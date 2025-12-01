"""
Order Book Imbalance Indicator - V3.2 FINAL
유동성 필터 포함 (최소 50 BTC)
"""
from typing import List, Tuple
from ..utils.error_handling import safe_calculate


class OrderBookImbalance:
    """
    호가창 불균형 계산기

    핵심:
    - Bid Volume / Ask Volume 비율
    - 최소 유동성 50 BTC 필터 (신뢰성)
    """

    def __init__(self, min_liquidity_btc: float = 50.0):
        """
        Args:
            min_liquidity_btc: 최소 유동성 (BTC)
        """
        self.min_liquidity_btc = min_liquidity_btc

    @safe_calculate(default_value=(1.0, False), error_reason="OB_IMBALANCE")
    def calculate(
        self,
        bids: List[Tuple[float, float]],
        asks: List[Tuple[float, float]],
        depth_levels: int = 10
    ) -> Tuple[Tuple[float, bool], str]:
        """
        호가창 불균형 계산

        Args:
            bids: [(price, qty), ...] 매수 호가
            asks: [(price, qty), ...] 매도 호가
            depth_levels: 계산할 호가 레벨 수

        Returns:
            ((ratio, is_reliable), status):
                ratio: bid_volume / ask_volume
                is_reliable: 유동성이 충분한지 여부
        """
        if not bids or not asks:
            return (1.0, False), "EMPTY_ORDERBOOK"

        # 상위 N개 레벨의 총 볼륨
        bid_volume = sum(qty for _, qty in bids[:depth_levels])
        ask_volume = sum(qty for _, qty in asks[:depth_levels])

        # 총 유동성
        total_liquidity = bid_volume + ask_volume

        # 유동성 체크
        is_reliable = total_liquidity >= self.min_liquidity_btc

        if not is_reliable:
            return (1.0, False), "LOW_LIQUIDITY"

        # 비율 계산
        if ask_volume == 0:
            # Ask가 0이면 극단적 매수 우위
            return (10.0, is_reliable), "ASK_ZERO"

        ratio = bid_volume / ask_volume

        return (ratio, is_reliable), "OK"

    def calculate_score(
        self,
        bids: List[Tuple[float, float]],
        asks: List[Tuple[float, float]],
        direction: str = "LONG"
    ) -> int:
        """
        OB Imbalance 점수 계산 (0-15점)

        Args:
            bids: 매수 호가
            asks: 매도 호가
            direction: "LONG" or "SHORT"

        Returns:
            점수 (0-15)
        """
        (ratio, is_reliable), status = self.calculate(bids, asks)

        if not is_reliable:
            return 0

        if direction == "LONG":
            # 매수 우위 (ratio > 1)
            if ratio >= 2.5:
                return 15
            elif ratio >= 2.0:
                return 12
            elif ratio >= 1.5:
                return 8
            elif ratio >= 1.2:
                return 4
            else:
                return 0

        else:  # SHORT
            # 매도 우위 (ratio < 1)
            if ratio <= 0.4:  # 1/2.5
                return 15
            elif ratio <= 0.5:  # 1/2.0
                return 12
            elif ratio <= 0.67:  # 1/1.5
                return 8
            elif ratio <= 0.83:  # 1/1.2
                return 4
            else:
                return 0

    def get_imbalance_direction(
        self,
        bids: List[Tuple[float, float]],
        asks: List[Tuple[float, float]]
    ) -> str:
        """
        불균형 방향 반환

        Returns:
            "BUY_HEAVY", "SELL_HEAVY", or "BALANCED"
        """
        (ratio, is_reliable), _ = self.calculate(bids, asks)

        if not is_reliable:
            return "BALANCED"

        if ratio >= 1.5:
            return "BUY_HEAVY"
        elif ratio <= 0.67:
            return "SELL_HEAVY"
        else:
            return "BALANCED"
