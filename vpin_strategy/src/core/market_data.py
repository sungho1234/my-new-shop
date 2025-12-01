"""
Market Data Structures - V3.2 FINAL
모든 지표를 담는 통합 데이터 구조
"""
from collections import deque
from typing import List, Tuple, Optional
import time


class MarketData:
    """
    모든 지표를 담는 통합 데이터 구조
    """
    def __init__(self):
        # Timestamp (동기화 기준)
        self.timestamp: float = 0

        # 호가창
        self.bids: List[Tuple[float, float]] = []  # [(price, qty), ...]
        self.asks: List[Tuple[float, float]] = []
        self.spread: float = 0
        self.avg_spread: float = 0

        # 가격 정보
        self.price: float = 0
        self.symbol: str = "BTCUSDT"

        # VPIN
        self.vpin: float = 0.5
        self.vpin_last_update: float = 0

        # OB Imbalance
        self.ob_ratio: float = 1.0
        self.ob_reliable: bool = False

        # Large Trade
        self.large_trade_detected: bool = False
        self.large_trade_direction: Optional[str] = None  # "BUY" or "SELL"

        # Volume Surge
        self.volume_surge_ratio: float = 1.0

        # Regime
        self.regime: str = "UNKNOWN"  # "BULL_15M_1H_4H", "BEAR", "CHOP", etc.

        # 시간대
        self.time_of_day: str = "INACTIVE"  # "TIER1_ASIAN_OPEN", "TIER2_EU_OPEN", etc.

        # 감점 요소
        self.funding_rate: float = 0.0
        self.btc_eth_corr: float = 0.8
        self.corr_last_update: float = 0  # NEW: 계산 주기 관리

        # 변동성
        self.atr_4h: float = 0
        self.atr_history_30d: List[float] = []
        self.atr_percentile: float = 50

        # 거래 내역
        self.trades: deque = deque(maxlen=5000)  # 최근 체결

        # 신호 관련 (for logging)
        self.threshold: float = 70
        self.direction: str = "LONG"

    def update_timestamp(self):
        """현재 시간으로 타임스탬프 업데이트"""
        self.timestamp = time.time() * 1000  # milliseconds

    def update_spread(self):
        """스프레드 계산 및 업데이트"""
        if self.bids and self.asks:
            best_bid = self.bids[0][0]
            best_ask = self.asks[0][0]
            self.spread = best_ask - best_bid
            self.price = (best_bid + best_ask) / 2

    def add_trade(self, price: float, qty: float, is_buyer_maker: bool, timestamp: float):
        """체결 내역 추가"""
        self.trades.append({
            'price': price,
            'qty': qty,
            'is_buyer_maker': is_buyer_maker,
            'timestamp': timestamp
        })


class IndicatorCache:
    """
    계산 주기 관리를 위한 캐시
    """
    def __init__(self):
        # 상관관계 캐시 (1분마다 갱신)
        self.corr_value: float = 0.8
        self.corr_last_calc: float = 0
        self.corr_interval: int = 60  # seconds

        # Volume Surge 캐시 (5분마다 갱신)
        self.surge_value: float = 1.0
        self.surge_last_calc: float = 0
        self.surge_interval: int = 300  # seconds

        # ATR 캐시 (1시간마다 갱신)
        self.atr_value: float = 0
        self.atr_last_calc: float = 0
        self.atr_interval: int = 3600  # seconds

    def should_update_corr(self) -> bool:
        """상관관계 업데이트 필요 여부"""
        return time.time() - self.corr_last_calc > self.corr_interval

    def should_update_surge(self) -> bool:
        """Volume Surge 업데이트 필요 여부"""
        return time.time() - self.surge_last_calc > self.surge_interval

    def should_update_atr(self) -> bool:
        """ATR 업데이트 필요 여부"""
        return time.time() - self.atr_last_calc > self.atr_interval

    def update_corr(self, value: float):
        """상관관계 캐시 업데이트"""
        self.corr_value = value
        self.corr_last_calc = time.time()

    def update_surge(self, value: float):
        """Volume Surge 캐시 업데이트"""
        self.surge_value = value
        self.surge_last_calc = time.time()

    def update_atr(self, value: float):
        """ATR 캐시 업데이트"""
        self.atr_value = value
        self.atr_last_calc = time.time()
