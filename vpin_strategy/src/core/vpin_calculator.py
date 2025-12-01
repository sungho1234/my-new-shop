"""
VPIN Calculator - V3.2 FINAL
Volume-Synchronized Probability of Informed Trading
Adaptive Bucket Size: 2% of hourly volume, 10-100 BTC range
"""
from collections import deque
from typing import Optional, Tuple
import time
import numpy as np
from ..utils.error_handling import safe_calculate, SafeCalculator


class VPINCalculator:
    """
    VPIN 계산기 (Adaptive Bucket Size)

    핵심 개념:
    - Volume Bucket 기반 (시간 기반 아님)
    - Buy Volume과 Sell Volume 구분
    - VPIN = |Buy - Sell| / Total Volume의 이동평균
    """

    def __init__(
        self,
        bucket_size: int = 40,  # BTC 단위
        num_buckets: int = 50,   # VPIN 계산에 사용할 버킷 수
        min_bucket_size: int = 10,  # 최소 버킷 크기
        max_bucket_size: int = 100  # 최대 버킷 크기
    ):
        """
        Args:
            bucket_size: 초기 버킷 크기 (BTC)
            num_buckets: VPIN 계산용 버킷 수
            min_bucket_size: 최소 버킷 크기 (BTC)
            max_bucket_size: 최대 버킷 크기 (BTC)
        """
        self.bucket_size = bucket_size
        self.num_buckets = num_buckets
        self.min_bucket_size = min_bucket_size
        self.max_bucket_size = max_bucket_size

        # 현재 버킷
        self.current_bucket_buy_volume = 0.0
        self.current_bucket_sell_volume = 0.0
        self.current_bucket_total_volume = 0.0

        # 완료된 버킷들 (최근 num_buckets개 보관)
        self.completed_buckets = deque(maxlen=num_buckets)

        # VPIN 값
        self.vpin = 0.5  # 초기값 (중립)
        self.last_update_time = time.time() * 1000

        # 시간당 볼륨 추적 (Adaptive Bucket Size용)
        self.hourly_volume_tracker = deque(maxlen=3600)  # 1시간치 초단위 볼륨
        self.last_bucket_adjustment_time = time.time()

    def update(self, price: float, qty: float, is_buyer_maker: bool, timestamp: float) -> Optional[float]:
        """
        체결 내역으로 VPIN 업데이트

        Args:
            price: 체결 가격
            qty: 체결 수량 (BTC)
            is_buyer_maker: True면 매도 체결, False면 매수 체결
            timestamp: 체결 시간 (밀리초)

        Returns:
            VPIN 값 (업데이트 시) 또는 None
        """
        # 매수/매도 구분
        if is_buyer_maker:
            # buyer가 maker = 매도 체결
            self.current_bucket_sell_volume += qty
        else:
            # buyer가 taker = 매수 체결
            self.current_bucket_buy_volume += qty

        self.current_bucket_total_volume += qty

        # 버킷이 가득 찼는지 확인
        if self.current_bucket_total_volume >= self.bucket_size:
            return self._complete_bucket(timestamp)

        return None

    def _complete_bucket(self, timestamp: float) -> float:
        """
        현재 버킷 완료 및 VPIN 계산

        Args:
            timestamp: 완료 시간 (밀리초)

        Returns:
            새로 계산된 VPIN 값
        """
        # 버킷의 Order Imbalance 계산
        total_vol = self.current_bucket_total_volume
        if total_vol > 0:
            imbalance = abs(self.current_bucket_buy_volume - self.current_bucket_sell_volume) / total_vol
        else:
            imbalance = 0.0

        # 완료된 버킷 저장
        self.completed_buckets.append({
            'buy_volume': self.current_bucket_buy_volume,
            'sell_volume': self.current_bucket_sell_volume,
            'total_volume': total_vol,
            'imbalance': imbalance,
            'timestamp': timestamp
        })

        # 현재 버킷 리셋
        self.current_bucket_buy_volume = 0.0
        self.current_bucket_sell_volume = 0.0
        self.current_bucket_total_volume = 0.0

        # VPIN 계산
        self.vpin = self._calculate_vpin()
        self.last_update_time = timestamp

        # 1시간마다 버킷 크기 조정
        self._adjust_bucket_size_if_needed()

        return self.vpin

    @safe_calculate(default_value=0.5, error_reason="VPIN_CALC")
    def _calculate_vpin(self) -> Tuple[float, str]:
        """
        VPIN 계산: 최근 N개 버킷의 평균 Imbalance

        Returns:
            (vpin_value, status)
        """
        if len(self.completed_buckets) < 10:
            # 버킷이 충분하지 않으면 중립값
            return 0.5, "INSUFFICIENT_BUCKETS"

        # 최근 버킷들의 imbalance 평균
        imbalances = [bucket['imbalance'] for bucket in self.completed_buckets]
        vpin = SafeCalculator.mean(imbalances, default=0.5)

        # VPIN은 0-1 범위로 클리핑
        vpin = max(0.0, min(1.0, vpin))

        return vpin, "OK"

    def _adjust_bucket_size_if_needed(self):
        """
        1시간마다 버킷 크기를 시간당 볼륨의 2%로 조정
        """
        current_time = time.time()

        # 1시간마다 조정
        if current_time - self.last_bucket_adjustment_time < 3600:
            return

        # 시간당 볼륨 계산
        if len(self.completed_buckets) < 10:
            return  # 데이터 부족

        # 최근 1시간 버킷들의 총 볼륨 계산
        one_hour_ago = (current_time - 3600) * 1000  # 밀리초
        recent_buckets = [
            b for b in self.completed_buckets
            if b['timestamp'] > one_hour_ago
        ]

        if not recent_buckets:
            return

        hourly_volume = sum(b['total_volume'] for b in recent_buckets)

        # 새 버킷 크기: 시간당 볼륨의 2%
        new_bucket_size = hourly_volume * 0.02

        # 범위 제한 (10-100 BTC)
        new_bucket_size = max(self.min_bucket_size, min(self.max_bucket_size, new_bucket_size))

        # 업데이트
        if abs(new_bucket_size - self.bucket_size) > 5:  # 5 BTC 이상 차이나면 조정
            print(f"[VPIN] Bucket size adjusted: {self.bucket_size:.1f} -> {new_bucket_size:.1f} BTC")
            self.bucket_size = new_bucket_size

        self.last_bucket_adjustment_time = current_time

    def get_vpin(self) -> float:
        """현재 VPIN 값 반환"""
        return self.vpin

    def get_last_update_time(self) -> float:
        """마지막 업데이트 시간 반환 (밀리초)"""
        return self.last_update_time

    def get_bucket_progress(self) -> float:
        """현재 버킷 진행률 (0.0 ~ 1.0)"""
        if self.bucket_size == 0:
            return 0.0
        return min(1.0, self.current_bucket_total_volume / self.bucket_size)

    def get_stats(self) -> dict:
        """
        디버깅용 통계

        Returns:
            dict: VPIN 계산기 상태
        """
        return {
            'vpin': self.vpin,
            'bucket_size': self.bucket_size,
            'current_progress': self.get_bucket_progress(),
            'completed_buckets_count': len(self.completed_buckets),
            'last_update_time': self.last_update_time,
            'current_buy_volume': self.current_bucket_buy_volume,
            'current_sell_volume': self.current_bucket_sell_volume
        }
