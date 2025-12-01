"""
Basic Usage Example - VPIN Strategy V3.2

이 예제는 전략의 기본 사용법을 보여줍니다.
실제 거래를 위해서는 Binance WebSocket 연동이 필요합니다.
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from src.core import VPINCalculator, MarketData
from src.signal import SignalGenerator
from src.indicators import (
    OrderBookImbalance,
    LargeTradeDetector,
    VolumeSurgeDetector,
    RegimeFilter,
    TimeFilter,
    CorrelationCalculator
)
from src.utils import SignalLogger
from src.config import StrategyConfig


def main():
    """기본 사용 예제"""

    print("="*60)
    print("VPIN Trading Strategy V3.2 - Basic Usage")
    print("="*60)

    # ===== 1. 초기화 =====
    print("\n[1] 컴포넌트 초기화...")

    # VPIN Calculator
    vpin_calc = VPINCalculator(
        bucket_size=StrategyConfig.VPIN_BUCKET_SIZE,
        num_buckets=StrategyConfig.VPIN_NUM_BUCKETS
    )

    # Signal Generator
    signal_gen = SignalGenerator(
        vpin_min_threshold=StrategyConfig.VPIN_MIN_THRESHOLD,
        score_threshold=StrategyConfig.SCORE_THRESHOLD
    )

    # 보조 지표들
    ob_imbalance = OrderBookImbalance()
    large_trade = LargeTradeDetector()
    volume_surge = VolumeSurgeDetector()
    regime_filter = RegimeFilter()
    time_filter = TimeFilter()
    corr_calc = CorrelationCalculator()

    # Logger
    logger = SignalLogger(db_path="logs/signals_example.db")

    print("[OK] 초기화 완료")

    # ===== 2. 시뮬레이션 데이터 =====
    print("\n[2] 시뮬레이션 데이터 생성...")

    # Market Data 객체
    market_data = MarketData()
    market_data.symbol = "BTCUSDT"
    market_data.price = 50000.0

    # 호가창 (예시)
    market_data.bids = [
        (49999.0, 10.5),
        (49998.0, 8.2),
        (49997.0, 12.1),
        (49996.0, 15.3),
        (49995.0, 9.7)
    ]
    market_data.asks = [
        (50000.0, 5.2),  # 매도 우위 (OB Imbalance)
        (50001.0, 4.1),
        (50002.0, 6.3),
        (50003.0, 7.8),
        (50004.0, 5.5)
    ]

    # VPIN (시뮬레이션)
    market_data.vpin = 0.65  # 높은 VPIN
    market_data.vpin_last_update = 1000000

    # 기타 지표들
    market_data.volume_surge_ratio = 2.2
    market_data.regime = "BULL_15M_1H_4H"
    market_data.time_of_day = "TIER1_ASIAN_OPEN"
    market_data.funding_rate = 0.01  # 정상 범위
    market_data.btc_eth_corr = 0.85  # 높은 상관관계
    market_data.atr_percentile = 60  # 정상 변동성
    market_data.spread = 1.0
    market_data.avg_spread = 1.2
    market_data.large_trade_detected = True
    market_data.large_trade_direction = "BUY"

    # OB 계산
    (ob_ratio, ob_reliable), _ = ob_imbalance.calculate(
        market_data.bids,
        market_data.asks
    )
    market_data.ob_ratio = ob_ratio
    market_data.ob_reliable = ob_reliable

    market_data.update_timestamp()
    market_data.corr_last_update = market_data.timestamp

    print("[OK] 시뮬레이션 데이터 준비 완료")

    # ===== 3. 신호 생성 =====
    print("\n[3] 신호 생성 테스트...")

    should_enter, score, reason = signal_gen.check_entry(
        market_data,
        direction="LONG"
    )

    print(f"\n--- 신호 결과 ---")
    print(f"진입 여부: {'[ENTER]' if should_enter else '[REJECT]'}")
    print(f"점수: {score}/70")
    print(f"이유: {reason}")

    # 점수 세부 내역
    breakdown = signal_gen.get_score_breakdown(market_data, "LONG")
    print(f"\n--- 점수 세부 내역 ---")
    for key, value in breakdown.items():
        print(f"{key}: {value}")

    # ===== 4. 로깅 =====
    print("\n[4] 로깅...")

    logger.log_decision(
        decision="ENTER" if should_enter else "REJECT",
        market_data=market_data,
        score=score,
        reason=reason,
        direction="LONG"
    )

    print("[OK] 로깅 완료")

    # ===== 5. VPIN 통계 =====
    print("\n[5] VPIN Calculator 통계...")

    # 몇 개의 거래 추가 (시뮬레이션)
    import time
    timestamp = time.time() * 1000

    for i in range(100):
        # 매수/매도 랜덤
        import random
        is_buyer_maker = random.choice([True, False])
        qty = random.uniform(0.01, 0.5)

        vpin_calc.update(50000.0, qty, is_buyer_maker, timestamp)
        timestamp += 1000  # 1초 증가

    stats = vpin_calc.get_stats()
    print(f"\nVPIN: {stats['vpin']:.3f}")
    print(f"Bucket Size: {stats['bucket_size']:.1f} BTC")
    print(f"Progress: {stats['current_progress']*100:.1f}%")
    print(f"Completed Buckets: {stats['completed_buckets_count']}")

    # ===== 6. 완료 =====
    print("\n" + "="*60)
    print("[OK] 기본 사용 예제 완료")
    print("="*60)

    print("\n다음 단계:")
    print("1. Binance WebSocket 연동 (실시간 데이터)")
    print("2. 백테스팅 프레임워크 구현")
    print("3. Paper Trading 테스트")
    print("4. 실전 투입")

    logger.close()


if __name__ == "__main__":
    # logs 디렉토리 생성
    os.makedirs("logs", exist_ok=True)

    main()
