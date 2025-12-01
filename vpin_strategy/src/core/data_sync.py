"""
Data Synchronization - V3.2 FINAL
모든 지표의 시점 일치 확인
"""
import time
from typing import Tuple
from .market_data import MarketData


class DataSynchronizer:
    """
    모든 지표가 동일 시점인지 확인
    """
    def __init__(self, tolerance_ms: int = 500):
        """
        Args:
            tolerance_ms: 허용 오차 (밀리초), 기본값 0.5초
        """
        self.tolerance_ms = tolerance_ms

    def validate_sync(self, market_data: MarketData) -> Tuple[bool, str]:
        """
        모든 지표가 동일 시점인지 확인

        Args:
            market_data: MarketData 객체

        Returns:
            (is_synced, reason): 동기화 여부와 이유
        """
        current_time = time.time() * 1000  # milliseconds

        # VPIN 업데이트 시간
        vpin_age = current_time - market_data.vpin_last_update

        # 상관관계 업데이트 시간
        corr_age = current_time - market_data.corr_last_update

        # 경고: VPIN이 너무 오래됨 (3분)
        if vpin_age > 180000:
            return False, "VPIN_STALE"

        # 일반적으로 0.5초 이내면 OK
        max_age = max(vpin_age, corr_age)
        if max_age > self.tolerance_ms:
            return False, "DATA_DESYNC"

        return True, "OK"

    def get_data_ages(self, market_data: MarketData) -> dict:
        """
        각 지표의 나이(age) 반환 (디버깅용)

        Args:
            market_data: MarketData 객체

        Returns:
            dict: 각 지표의 나이(밀리초)
        """
        current_time = time.time() * 1000

        return {
            'vpin_age_ms': current_time - market_data.vpin_last_update,
            'corr_age_ms': current_time - market_data.corr_last_update,
            'current_time': current_time
        }
