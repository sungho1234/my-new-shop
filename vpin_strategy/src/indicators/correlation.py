"""
Correlation Calculator - V3.2 FINAL
BTC-ETH 상관관계 (1분마다 갱신)
"""
from collections import deque
import time
import numpy as np
from ..utils.error_handling import SafeCalculator


class CorrelationCalculator:
    """
    BTC-ETH 상관관계 계산기

    핵심:
    - 1분봉 수익률 기반
    - 1시간 롤링 윈도우
    - 1분마다만 재계산 (캐싱)
    """

    def __init__(
        self,
        window_minutes: int = 60,
        calc_interval_seconds: int = 60,
        min_data_points: int = 20
    ):
        """
        Args:
            window_minutes: 상관관계 계산 윈도우 (분)
            calc_interval_seconds: 재계산 주기 (초)
            min_data_points: 최소 데이터 포인트
        """
        self.window_minutes = window_minutes
        self.calc_interval = calc_interval_seconds
        self.min_data_points = min_data_points

        # 수익률 저장
        self.btc_returns = deque(maxlen=window_minutes)
        self.eth_returns = deque(maxlen=window_minutes)

        # 마지막 가격 (수익률 계산용)
        self.btc_last_price: float = 0
        self.eth_last_price: float = 0

        # 캐시
        self.last_corr: float = 0.8  # 기본값 (높은 상관관계 가정)
        self.last_calc_time: float = 0

    def update_prices(self, btc_price: float, eth_price: float):
        """
        1분봉 가격 업데이트

        Args:
            btc_price: BTC 가격
            eth_price: ETH 가격
        """
        # 첫 업데이트
        if self.btc_last_price == 0:
            self.btc_last_price = btc_price
            self.eth_last_price = eth_price
            return

        # 수익률 계산
        btc_ret = (btc_price - self.btc_last_price) / self.btc_last_price
        eth_ret = (eth_price - self.eth_last_price) / self.eth_last_price

        # 저장
        self.btc_returns.append(btc_ret)
        self.eth_returns.append(eth_ret)

        # 가격 업데이트
        self.btc_last_price = btc_price
        self.eth_last_price = eth_price

    def get_correlation(self) -> float:
        """
        상관관계 반환 (1분마다 재계산)

        Returns:
            상관계수 (-1.0 ~ 1.0)
        """
        now = time.time()

        # 1분 안 지났으면 캐시 반환
        if now - self.last_calc_time < self.calc_interval:
            return self.last_corr

        # 데이터 부족
        if len(self.btc_returns) < self.min_data_points:
            return self.last_corr  # 기본값 유지

        # 재계산
        try:
            btc_arr = np.array(list(self.btc_returns))
            eth_arr = np.array(list(self.eth_returns))

            corr_matrix = np.corrcoef(btc_arr, eth_arr)
            corr = corr_matrix[0, 1]

            # NaN 체크
            if np.isnan(corr):
                return self.last_corr

            # 업데이트
            self.last_corr = float(corr)
            self.last_calc_time = now

            return self.last_corr

        except Exception as e:
            # 에러 시 이전 값 반환
            return self.last_corr

    def get_penalty(self) -> int:
        """
        상관관계 감점 계산 (0 ~ -5점)

        Returns:
            감점 (0 or -5)
        """
        corr = self.get_correlation()

        # 상관관계 < 0.7 = 시장 혼란
        if corr < 0.7:
            return -5
        else:
            return 0

    def should_update(self) -> bool:
        """캐시 업데이트 필요 여부"""
        now = time.time()
        return now - self.last_calc_time >= self.calc_interval

    def get_stats(self) -> dict:
        """디버깅용 통계"""
        return {
            'correlation': self.last_corr,
            'btc_returns_count': len(self.btc_returns),
            'eth_returns_count': len(self.eth_returns),
            'last_calc_time': self.last_calc_time,
            'time_since_last_calc': time.time() - self.last_calc_time
        }
