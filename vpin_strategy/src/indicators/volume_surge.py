"""
Volume Surge Detector - V3.2 FINAL
완료된 5분 구간만 사용 (불완전 데이터 배제)
"""
from collections import deque
from typing import Tuple
import time
from ..utils.error_handling import SafeCalculator


class VolumeSurgeDetector:
    """
    거래량 급증 탐지기

    핵심:
    - 5분 구간별 거래량 추적
    - 완료된 구간만 사용
    - 현재 구간 vs 최근 1시간 평균 비교
    """

    def __init__(
        self,
        bucket_seconds: int = 300,  # 5분
        lookback_buckets: int = 12   # 1시간 = 12개 5분 구간
    ):
        """
        Args:
            bucket_seconds: 구간 크기 (초)
            lookback_buckets: 평균 계산용 과거 구간 수
        """
        self.bucket_seconds = bucket_seconds
        self.lookback_buckets = lookback_buckets

        # 완료된 구간들
        self.completed_buckets = deque(maxlen=lookback_buckets)

        # 현재 구간
        self.current_bucket_volume = 0.0
        self.current_bucket_start_time = self._get_bucket_start_time()

    def update(self, qty: float, timestamp: float):
        """
        거래 추가

        Args:
            qty: 거래량
            timestamp: 시간 (밀리초)
        """
        # 현재 구간 확인
        bucket_start = self._get_bucket_start_time_from_timestamp(timestamp)

        if bucket_start > self.current_bucket_start_time:
            # 새 구간 시작 - 이전 구간 완료
            self._complete_current_bucket()
            self.current_bucket_start_time = bucket_start
            self.current_bucket_volume = qty
        else:
            # 같은 구간 - 누적
            self.current_bucket_volume += qty

    def _complete_current_bucket(self):
        """현재 구간 완료 처리"""
        if self.current_bucket_volume > 0:
            self.completed_buckets.append({
                'volume': self.current_bucket_volume,
                'start_time': self.current_bucket_start_time
            })

    def _get_bucket_start_time(self) -> float:
        """현재 구간의 시작 시간 계산 (밀리초)"""
        current_time = time.time()
        bucket_start = (current_time // self.bucket_seconds) * self.bucket_seconds
        return bucket_start * 1000  # 밀리초로 변환

    def _get_bucket_start_time_from_timestamp(self, timestamp: float) -> float:
        """특정 시간의 구간 시작 시간 계산 (밀리초)"""
        timestamp_seconds = timestamp / 1000
        bucket_start = (timestamp_seconds // self.bucket_seconds) * self.bucket_seconds
        return bucket_start * 1000

    def calculate_surge_ratio(self) -> Tuple[float, str]:
        """
        거래량 급증 비율 계산

        주의: 완료된 구간만 사용!

        Returns:
            (ratio, status):
                ratio: 최근 완료 구간 / 과거 평균
                status: 계산 상태
        """
        if len(self.completed_buckets) < 3:
            return 1.0, "INSUFFICIENT_DATA"

        # 최근 완료된 구간 (현재 구간 제외!)
        last_completed = self.completed_buckets[-1]['volume']

        # 과거 구간들의 평균
        historical_volumes = [b['volume'] for b in list(self.completed_buckets)[:-1]]
        avg_volume = SafeCalculator.mean(historical_volumes, default=1.0)

        if avg_volume == 0:
            return 1.0, "ZERO_AVG"

        ratio = last_completed / avg_volume

        return ratio, "OK"

    def get_score(self) -> int:
        """
        Volume Surge 점수 계산 (0-15점)

        Returns:
            점수 (0-15)
        """
        ratio, status = self.calculate_surge_ratio()

        if status != "OK":
            return 0

        # 점수 매핑
        if ratio >= 3.0:
            return 15
        elif ratio >= 2.5:
            return 12
        elif ratio >= 2.0:
            return 8
        elif ratio >= 1.5:
            return 4
        else:
            return 0

    def force_complete_bucket(self):
        """강제로 현재 구간 완료 (백테스팅용)"""
        self._complete_current_bucket()
        self.current_bucket_volume = 0.0
        self.current_bucket_start_time = self._get_bucket_start_time()

    def get_stats(self) -> dict:
        """디버깅용 통계"""
        ratio, status = self.calculate_surge_ratio()
        return {
            'completed_buckets_count': len(self.completed_buckets),
            'current_bucket_volume': self.current_bucket_volume,
            'surge_ratio': ratio,
            'status': status,
            'avg_historical_volume': SafeCalculator.mean(
                [b['volume'] for b in self.completed_buckets]
            )
        }
