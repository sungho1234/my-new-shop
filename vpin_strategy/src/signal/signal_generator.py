"""
Signal Generator - V3.2 FINAL
3단계 필터링 + 점수 시스템
"""
from typing import Tuple, Optional
import time
from datetime import datetime
from ..core.market_data import MarketData
from ..core.data_sync import DataSynchronizer
from ..indicators.orderbook import OrderBookImbalance
from ..indicators.large_trade import LargeTradeDetector
from ..indicators.volume_surge import VolumeSurgeDetector
from ..indicators.regime import RegimeFilter, TimeFilter
from ..indicators.correlation import CorrelationCalculator


class SignalGenerator:
    """
    신호 생성기

    3단계 필터링:
    Tier 1: 필수 조건 (하나라도 실패 시 즉시 거부)
    Tier 2: 가점 요소 (최대 90점)
    Tier 3: 감점 요소 (최대 -15점)

    최종 점수 >= 70점 → 진입
    """

    def __init__(
        self,
        vpin_min_threshold: float = 0.50,
        score_threshold: int = 70,
        atr_percentile_max: float = 90.0,
        spread_multiplier_max: float = 2.0
    ):
        """
        Args:
            vpin_min_threshold: VPIN 최소값
            score_threshold: 진입 점수 임계값
            atr_percentile_max: ATR 백분위 최대값
            spread_multiplier_max: 스프레드 배수 최대값
        """
        self.vpin_min_threshold = vpin_min_threshold
        self.score_threshold = score_threshold
        self.atr_percentile_max = atr_percentile_max
        self.spread_multiplier_max = spread_multiplier_max

        # 지표 인스턴스
        self.data_sync = DataSynchronizer()
        self.ob_imbalance = OrderBookImbalance()
        self.time_filter = TimeFilter()

        # 마지막 거부 이유
        self.last_reject_reason = ""

    def check_entry(
        self,
        market_data: MarketData,
        direction: str = "LONG"
    ) -> Tuple[bool, int, str]:
        """
        진입 신호 확인

        Args:
            market_data: MarketData 객체
            direction: "LONG" or "SHORT"

        Returns:
            (should_enter, score, reason): 진입 여부, 점수, 이유
        """
        try:
            # ===== Tier 0: 데이터 동기화 확인 =====
            is_synced, sync_reason = self.data_sync.validate_sync(market_data)
            if not is_synced:
                self.last_reject_reason = sync_reason
                return False, 0, sync_reason

            # ===== Tier 1: 필수 조건 =====

            # 1. 시간대 확인
            if market_data.time_of_day == "INACTIVE":
                self.last_reject_reason = "TIME_INACTIVE"
                return False, 0, "TIME_INACTIVE"

            # 2. VPIN 최소치
            if market_data.vpin < self.vpin_min_threshold:
                self.last_reject_reason = "VPIN_TOO_LOW"
                return False, 0, f"VPIN_TOO_LOW ({market_data.vpin:.3f})"

            # 3. 변동성 (ATR 백분위)
            if market_data.atr_percentile > self.atr_percentile_max:
                self.last_reject_reason = "VOLATILITY_TOO_HIGH"
                return False, 0, f"VOLATILITY_TOO_HIGH ({market_data.atr_percentile:.1f}%)"

            # 4. 스프레드
            if market_data.avg_spread > 0:
                spread_ratio = market_data.spread / market_data.avg_spread
                if spread_ratio > self.spread_multiplier_max:
                    self.last_reject_reason = "SPREAD_TOO_WIDE"
                    return False, 0, f"SPREAD_TOO_WIDE ({spread_ratio:.2f}x)"

            # ===== Tier 2: 가점 요소 (0-90점) =====

            score = 0

            # VPIN 점수 (0-30점)
            score += self._calculate_vpin_score(market_data.vpin)

            # OB Imbalance 점수 (0-15점)
            ob_score = self.ob_imbalance.calculate_score(
                market_data.bids,
                market_data.asks,
                direction
            )
            score += ob_score

            # Large Trade 점수 (0-15점)
            if market_data.large_trade_detected:
                if market_data.large_trade_direction == ("BUY" if direction == "LONG" else "SELL"):
                    score += 15

            # Volume Surge 점수 (0-15점)
            score += self._calculate_volume_surge_score(market_data.volume_surge_ratio)

            # Regime 점수 (0-15점)
            score += self._calculate_regime_score(market_data.regime, direction)

            # ===== Tier 3: 감점 요소 (0 ~ -15점) =====

            # 펀딩비 감점 (0 ~ -10점)
            score += self._calculate_funding_penalty(market_data.funding_rate, direction)

            # 상관관계 감점 (0 ~ -5점)
            score += self._calculate_correlation_penalty(market_data.btc_eth_corr)

            # 최소 0점
            score = max(0, score)

            # ===== 최종 판단 =====

            if score >= self.score_threshold:
                return True, score, "OK"
            else:
                self.last_reject_reason = f"SCORE_TOO_LOW ({score}/{self.score_threshold})"
                return False, score, self.last_reject_reason

        except Exception as e:
            import traceback
            traceback.print_exc()
            self.last_reject_reason = f"CALCULATION_ERROR: {str(e)}"
            return False, 0, self.last_reject_reason

    def _calculate_vpin_score(self, vpin: float) -> int:
        """
        VPIN 점수 계산 (0-30점)

        Args:
            vpin: VPIN 값

        Returns:
            점수 (0-30)
        """
        if vpin >= 0.75:
            return 30
        elif vpin >= 0.70:
            return 25
        elif vpin >= 0.65:
            return 20
        elif vpin >= 0.60:
            return 15
        elif vpin >= 0.55:
            return 10
        elif vpin >= 0.50:
            return 5
        else:
            return 0

    def _calculate_volume_surge_score(self, surge_ratio: float) -> int:
        """
        Volume Surge 점수 계산 (0-15점)

        Args:
            surge_ratio: 볼륨 급증 비율

        Returns:
            점수 (0-15)
        """
        if surge_ratio >= 3.0:
            return 15
        elif surge_ratio >= 2.5:
            return 12
        elif surge_ratio >= 2.0:
            return 8
        elif surge_ratio >= 1.5:
            return 4
        else:
            return 0

    def _calculate_regime_score(self, regime: str, direction: str) -> int:
        """
        Regime 점수 계산 (0-15점)

        Args:
            regime: 국면명
            direction: 목표 방향

        Returns:
            점수 (0-15)
        """
        if direction == "LONG":
            if regime == "BULL_15M_1H_4H":
                return 15
            elif regime == "BULL_WEAK":
                return 8
        else:  # SHORT
            if regime == "BEAR_15M_1H_4H":
                return 15
            elif regime == "BEAR_WEAK":
                return 8

        return 0

    def _calculate_funding_penalty(self, funding_rate: float, direction: str) -> int:
        """
        펀딩비 감점 (0 ~ -10점)

        Args:
            funding_rate: 펀딩비 (%)
            direction: 목표 방향

        Returns:
            감점 (0 or -10)
        """
        if direction == "LONG":
            # 롱 진입 시 펀딩비 > 0.05% = 불리
            if funding_rate > 0.05:
                return -10
        else:  # SHORT
            # 숏 진입 시 펀딩비 < -0.05% = 불리
            if funding_rate < -0.05:
                return -10

        return 0

    def _calculate_correlation_penalty(self, correlation: float) -> int:
        """
        상관관계 감점 (0 ~ -5점)

        Args:
            correlation: BTC-ETH 상관계수

        Returns:
            감점 (0 or -5)
        """
        if correlation < 0.7:
            return -5
        return 0

    def get_score_breakdown(self, market_data: MarketData, direction: str = "LONG") -> dict:
        """
        점수 세부 내역 반환 (디버깅용)

        Args:
            market_data: MarketData 객체
            direction: 목표 방향

        Returns:
            dict: 점수 세부 내역
        """
        breakdown = {
            'vpin_score': self._calculate_vpin_score(market_data.vpin),
            'ob_imbalance_score': self.ob_imbalance.calculate_score(
                market_data.bids,
                market_data.asks,
                direction
            ),
            'large_trade_score': 15 if (
                market_data.large_trade_detected and
                market_data.large_trade_direction == ("BUY" if direction == "LONG" else "SELL")
            ) else 0,
            'volume_surge_score': self._calculate_volume_surge_score(market_data.volume_surge_ratio),
            'regime_score': self._calculate_regime_score(market_data.regime, direction),
            'funding_penalty': self._calculate_funding_penalty(market_data.funding_rate, direction),
            'correlation_penalty': self._calculate_correlation_penalty(market_data.btc_eth_corr)
        }

        breakdown['total_score'] = sum(breakdown.values())

        return breakdown
