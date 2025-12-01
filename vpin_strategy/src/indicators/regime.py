"""
Regime Filter - V3.2 FINAL
Multi-Timeframe EMA Alignment + ADX
"""
from collections import deque
from typing import Tuple, List, Optional
import numpy as np
from ..utils.error_handling import SafeCalculator


class RegimeFilter:
    """
    시장 국면 필터

    핵심:
    - 15분/1시간/4시간 EMA 정렬
    - ADX로 추세 강도 확인
    - 또는 가격-EMA 거리로 대체
    """

    def __init__(
        self,
        ema_15m_period: int = 20,
        ema_1h_period: int = 20,
        ema_4h_period: int = 20,
        adx_period: int = 14,
        adx_threshold: float = 25.0
    ):
        """
        Args:
            ema_15m_period: 15분봉 EMA 기간
            ema_1h_period: 1시간봉 EMA 기간
            ema_4h_period: 4시간봉 EMA 기간
            adx_period: ADX 계산 기간
            adx_threshold: ADX 최소값
        """
        self.ema_15m_period = ema_15m_period
        self.ema_1h_period = ema_1h_period
        self.ema_4h_period = ema_4h_period
        self.adx_period = adx_period
        self.adx_threshold = adx_threshold

        # 캔들 데이터
        self.candles_15m = deque(maxlen=100)
        self.candles_1h = deque(maxlen=100)
        self.candles_4h = deque(maxlen=100)

        # EMA 값
        self.ema_15m = None
        self.ema_1h = None
        self.ema_4h = None

        # ADX 값
        self.adx = 0.0

    def update_candle(self, timeframe: str, candle: dict):
        """
        캔들 데이터 업데이트

        Args:
            timeframe: "15m", "1h", or "4h"
            candle: {'open', 'high', 'low', 'close', 'volume', 'timestamp'}
        """
        if timeframe == "15m":
            self.candles_15m.append(candle)
            self.ema_15m = self._calculate_ema(self.candles_15m, self.ema_15m_period)

        elif timeframe == "1h":
            self.candles_1h.append(candle)
            self.ema_1h = self._calculate_ema(self.candles_1h, self.ema_1h_period)

        elif timeframe == "4h":
            self.candles_4h.append(candle)
            self.ema_4h = self._calculate_ema(self.candles_4h, self.ema_4h_period)

            # 4시간봉 업데이트 시 ADX 계산
            self.adx = self._calculate_adx(self.candles_4h)

    def _calculate_ema(self, candles: deque, period: int) -> Optional[float]:
        """EMA 계산"""
        if len(candles) < period:
            return None

        closes = [c['close'] for c in candles]
        return self._ema(closes, period)

    def _ema(self, values: List[float], period: int) -> float:
        """EMA 계산 헬퍼"""
        if not values or len(values) < period:
            return 0.0

        multiplier = 2 / (period + 1)
        ema = SafeCalculator.mean(values[:period])

        for value in values[period:]:
            ema = (value * multiplier) + (ema * (1 - multiplier))

        return ema

    def _calculate_adx(self, candles: deque) -> float:
        """
        ADX 계산

        간단한 구현:
        1. True Range (TR) 계산
        2. +DM, -DM 계산
        3. +DI, -DI 계산
        4. DX 계산
        5. ADX = DX의 이동평균
        """
        if len(candles) < self.adx_period + 1:
            return 0.0

        try:
            candles_list = list(candles)

            # True Range
            tr_list = []
            for i in range(1, len(candles_list)):
                high = candles_list[i]['high']
                low = candles_list[i]['low']
                prev_close = candles_list[i-1]['close']

                tr = max(
                    high - low,
                    abs(high - prev_close),
                    abs(low - prev_close)
                )
                tr_list.append(tr)

            if len(tr_list) < self.adx_period:
                return 0.0

            # +DM, -DM
            plus_dm_list = []
            minus_dm_list = []

            for i in range(1, len(candles_list)):
                high = candles_list[i]['high']
                low = candles_list[i]['low']
                prev_high = candles_list[i-1]['high']
                prev_low = candles_list[i-1]['low']

                plus_dm = high - prev_high
                minus_dm = prev_low - low

                if plus_dm > minus_dm and plus_dm > 0:
                    plus_dm_list.append(plus_dm)
                    minus_dm_list.append(0)
                elif minus_dm > plus_dm and minus_dm > 0:
                    plus_dm_list.append(0)
                    minus_dm_list.append(minus_dm)
                else:
                    plus_dm_list.append(0)
                    minus_dm_list.append(0)

            # Smoothed TR, +DM, -DM
            atr = SafeCalculator.mean(tr_list[-self.adx_period:])
            plus_di = SafeCalculator.mean(plus_dm_list[-self.adx_period:]) / atr * 100 if atr > 0 else 0
            minus_di = SafeCalculator.mean(minus_dm_list[-self.adx_period:]) / atr * 100 if atr > 0 else 0

            # DX
            di_sum = plus_di + minus_di
            if di_sum == 0:
                return 0.0

            dx = abs(plus_di - minus_di) / di_sum * 100

            # ADX (DX의 이동평균 - 단순화)
            return dx

        except Exception as e:
            return 0.0

    def check_regime(self, current_price: float, direction: str = "LONG") -> Tuple[str, bool]:
        """
        시장 국면 확인

        Args:
            current_price: 현재 가격
            direction: "LONG" or "SHORT"

        Returns:
            (regime_name, is_aligned): 국면명, 정렬 여부
        """
        if not all([self.ema_15m, self.ema_1h, self.ema_4h]):
            return "UNKNOWN", False

        # EMA 정렬 확인
        if direction == "LONG":
            # 상승 정렬: 15m > 1h > 4h
            ema_aligned = (self.ema_15m > self.ema_1h > self.ema_4h)

            # 가격이 모든 EMA 위
            price_above = current_price > self.ema_15m

            # ADX 확인 (추세 강도)
            strong_trend = self.adx > self.adx_threshold

            if ema_aligned and price_above and strong_trend:
                return "BULL_15M_1H_4H", True
            elif ema_aligned and price_above:
                return "BULL_WEAK", True
            else:
                return "CHOP", False

        else:  # SHORT
            # 하락 정렬: 15m < 1h < 4h
            ema_aligned = (self.ema_15m < self.ema_1h < self.ema_4h)

            # 가격이 모든 EMA 아래
            price_below = current_price < self.ema_15m

            # ADX 확인
            strong_trend = self.adx > self.adx_threshold

            if ema_aligned and price_below and strong_trend:
                return "BEAR_15M_1H_4H", True
            elif ema_aligned and price_below:
                return "BEAR_WEAK", True
            else:
                return "CHOP", False

    def get_score(self, current_price: float, direction: str = "LONG") -> int:
        """
        Regime 점수 계산 (0-15점)

        Args:
            current_price: 현재 가격
            direction: "LONG" or "SHORT"

        Returns:
            점수 (0-15)
        """
        regime, is_aligned = self.check_regime(current_price, direction)

        if not is_aligned:
            return 0

        # 강한 추세
        if regime in ["BULL_15M_1H_4H", "BEAR_15M_1H_4H"]:
            return 15

        # 약한 추세
        if regime in ["BULL_WEAK", "BEAR_WEAK"]:
            return 8

        return 0

    def get_stats(self) -> dict:
        """디버깅용 통계"""
        return {
            'ema_15m': self.ema_15m,
            'ema_1h': self.ema_1h,
            'ema_4h': self.ema_4h,
            'adx': self.adx,
            'candles_15m_count': len(self.candles_15m),
            'candles_1h_count': len(self.candles_1h),
            'candles_4h_count': len(self.candles_4h)
        }


class TimeFilter:
    """
    시간대 필터

    Tier 1: 09-11시 (아시아 오픈)
    Tier 2: 11-15시, 21-23시 (유럽/미국)
    Tier 3: 23-01시 (미국 오픈)
    """

    def __init__(self):
        self.tier1_hours = [9, 10]  # 09-11시
        self.tier2_hours = [11, 12, 13, 14, 21, 22]  # 11-15시, 21-23시
        self.tier3_hours = [23, 0]  # 23-01시

    def get_time_tier(self, hour_utc: int) -> str:
        """
        시간대 Tier 반환

        Args:
            hour_utc: UTC 시간 (0-23)

        Returns:
            "TIER1_ASIAN_OPEN", "TIER2_EU_US", "TIER3_US_OPEN", or "INACTIVE"
        """
        if hour_utc in self.tier1_hours:
            return "TIER1_ASIAN_OPEN"
        elif hour_utc in self.tier2_hours:
            return "TIER2_EU_US"
        elif hour_utc in self.tier3_hours:
            return "TIER3_US_OPEN"
        else:
            return "INACTIVE"

    def is_active(self, hour_utc: int) -> bool:
        """거래 가능 시간대인지 확인"""
        return hour_utc in (self.tier1_hours + self.tier2_hours + self.tier3_hours)
