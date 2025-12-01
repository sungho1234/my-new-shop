"""
Large Trade Detector - V3.2 FINAL
Trimmed Mean 사용 (극단값 제거)
"""
from collections import deque
from typing import Optional, Dict, Tuple
import numpy as np
from ..utils.error_handling import SafeCalculator


class LargeTradeDetector:
    """
    대량 거래 탐지기

    핵심:
    - Trimmed Mean (상하위 10% 제거)
    - 평균의 2배 이상 = 대량 거래
    - 방향 구분 (매수 / 매도)
    """

    def __init__(
        self,
        window_seconds: int = 300,  # 5분
        trim_percent: float = 10.0,  # 상하위 10%
        threshold_multiplier: float = 2.0  # 평균의 2배
    ):
        """
        Args:
            window_seconds: 평균 계산 윈도우 (초)
            trim_percent: Trimmed Mean 제거 비율 (%)
            threshold_multiplier: 대량 거래 판단 배수
        """
        self.window_seconds = window_seconds
        self.trim_percent = trim_percent
        self.threshold_multiplier = threshold_multiplier

        # 최근 거래 내역
        self.recent_trades = deque(maxlen=1000)

        # 마지막 대량 거래
        self.last_large_trade: Optional[Dict] = None

    def update(self, price: float, qty: float, is_buyer_maker: bool, timestamp: float):
        """
        거래 내역 업데이트

        Args:
            price: 체결 가격
            qty: 체결 수량
            is_buyer_maker: True면 매도, False면 매수
            timestamp: 체결 시간 (밀리초)
        """
        self.recent_trades.append({
            'price': price,
            'qty': qty,
            'is_buyer_maker': is_buyer_maker,
            'timestamp': timestamp
        })

    def check_large_trade(
        self,
        current_trade_qty: float,
        is_buyer_maker: bool,
        current_timestamp: float
    ) -> Tuple[bool, Optional[str]]:
        """
        대량 거래 여부 확인

        Args:
            current_trade_qty: 현재 거래량
            is_buyer_maker: 현재 거래 방향
            current_timestamp: 현재 시간

        Returns:
            (is_large, direction): 대량 거래 여부 및 방향
        """
        # 최근 윈도우 내 거래 필터링
        cutoff_time = current_timestamp - (self.window_seconds * 1000)
        recent_qtys = [
            t['qty'] for t in self.recent_trades
            if t['timestamp'] > cutoff_time
        ]

        if len(recent_qtys) < 20:
            # 데이터 부족
            return False, None

        # Trimmed Mean 계산
        trimmed_mean = self._calculate_trimmed_mean(recent_qtys)

        if trimmed_mean == 0:
            return False, None

        # 대량 거래 판단
        is_large = current_trade_qty >= (trimmed_mean * self.threshold_multiplier)

        if is_large:
            direction = "SELL" if is_buyer_maker else "BUY"
            self.last_large_trade = {
                'qty': current_trade_qty,
                'direction': direction,
                'timestamp': current_timestamp,
                'threshold': trimmed_mean * self.threshold_multiplier
            }
            return True, direction

        return False, None

    def _calculate_trimmed_mean(self, values: list) -> float:
        """
        Trimmed Mean 계산 (상하위 10% 제거)

        Args:
            values: 수량 리스트

        Returns:
            Trimmed Mean
        """
        if not values:
            return 0.0

        try:
            arr = np.array(values)
            # 상하위 10% 제거
            lower_percentile = np.percentile(arr, self.trim_percent)
            upper_percentile = np.percentile(arr, 100 - self.trim_percent)

            # 중간 80% 필터링
            trimmed = arr[(arr >= lower_percentile) & (arr <= upper_percentile)]

            if len(trimmed) == 0:
                return SafeCalculator.mean(values)

            return float(np.mean(trimmed))

        except Exception:
            return SafeCalculator.mean(values)

    def get_score(self, direction: str = "LONG") -> int:
        """
        Large Trade 점수 계산 (0-15점)

        Args:
            direction: 목표 방향 ("LONG" or "SHORT")

        Returns:
            점수 (0-15)
        """
        if not self.last_large_trade:
            return 0

        # 5분 이내 거래만 유효
        import time
        current_time = time.time() * 1000
        if current_time - self.last_large_trade['timestamp'] > 300000:
            return 0

        trade_direction = self.last_large_trade['direction']

        # 방향 일치 확인
        if direction == "LONG" and trade_direction == "BUY":
            return 15
        elif direction == "SHORT" and trade_direction == "SELL":
            return 15
        else:
            return 0

    def get_last_large_trade(self) -> Optional[Dict]:
        """마지막 대량 거래 정보 반환"""
        return self.last_large_trade

    def get_stats(self) -> dict:
        """디버깅용 통계"""
        recent_qtys = [t['qty'] for t in self.recent_trades]
        return {
            'trades_count': len(self.recent_trades),
            'avg_qty': SafeCalculator.mean(recent_qtys),
            'trimmed_mean': self._calculate_trimmed_mean(recent_qtys),
            'last_large_trade': self.last_large_trade
        }
