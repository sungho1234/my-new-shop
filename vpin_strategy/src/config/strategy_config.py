"""
Strategy Configuration - V3.2 FINAL
전략 설정 파일
"""

class StrategyConfig:
    """전략 설정"""

    # ===== VPIN 설정 =====
    VPIN_BUCKET_SIZE = 40  # BTC
    VPIN_NUM_BUCKETS = 50
    VPIN_MIN_BUCKET_SIZE = 10  # BTC
    VPIN_MAX_BUCKET_SIZE = 100  # BTC
    VPIN_MIN_THRESHOLD = 0.50  # 필수 조건

    # ===== 신호 생성 설정 =====
    SCORE_THRESHOLD = 70  # 진입 점수 임계값
    ATR_PERCENTILE_MAX = 90.0  # 변동성 필터
    SPREAD_MULTIPLIER_MAX = 2.0  # 스프레드 필터

    # ===== OB Imbalance 설정 =====
    OB_MIN_LIQUIDITY_BTC = 50.0  # 최소 유동성
    OB_DEPTH_LEVELS = 10  # 호가 레벨 수

    # ===== Large Trade 설정 =====
    LARGE_TRADE_WINDOW_SECONDS = 300  # 5분
    LARGE_TRADE_TRIM_PERCENT = 10.0  # Trimmed Mean 제거 비율
    LARGE_TRADE_THRESHOLD_MULTIPLIER = 2.0  # 평균의 2배

    # ===== Volume Surge 설정 =====
    VOLUME_SURGE_BUCKET_SECONDS = 300  # 5분
    VOLUME_SURGE_LOOKBACK_BUCKETS = 12  # 1시간

    # ===== Regime Filter 설정 =====
    REGIME_EMA_15M_PERIOD = 20
    REGIME_EMA_1H_PERIOD = 20
    REGIME_EMA_4H_PERIOD = 20
    REGIME_ADX_PERIOD = 14
    REGIME_ADX_THRESHOLD = 25.0

    # ===== Correlation 설정 =====
    CORR_WINDOW_MINUTES = 60  # 1시간
    CORR_CALC_INTERVAL_SECONDS = 60  # 1분마다 재계산
    CORR_MIN_DATA_POINTS = 20
    CORR_THRESHOLD = 0.7  # 최소 상관계수

    # ===== 시간대 설정 =====
    TIME_TIER1_HOURS = [9, 10]  # 09-11시 (UTC)
    TIME_TIER2_HOURS = [11, 12, 13, 14, 21, 22]  # 11-15시, 21-23시
    TIME_TIER3_HOURS = [23, 0]  # 23-01시

    # ===== 청산 설정 =====
    # Take Profit (부분 청산)
    TP1_MULTIPLIER = 1.5  # ATR × 1.5
    TP1_SIZE_PERCENT = 50  # 50% 청산

    TP2_MULTIPLIER = 3.0  # ATR × 3.0
    TP2_SIZE_PERCENT = 30  # 30% 청산

    TP3_MULTIPLIER = 5.0  # ATR × 5.0
    TP3_SIZE_PERCENT = 20  # 20% 청산

    # Stop Loss
    SL_HARD_MULTIPLIER = 1.0  # ATR × 1.0
    SL_TIME_MINUTES = 10  # 10분
    SL_VPIN_THRESHOLD = 0.4  # VPIN < 0.4

    # ===== 백테스팅 설정 =====
    BACKTEST_SLIPPAGE_MEAN_TICKS = 2  # 평균 슬리피지
    BACKTEST_SLIPPAGE_STD_TICKS = 0.6  # 슬리피지 표준편차
    BACKTEST_FILL_RATE = 0.95  # 체결률 95%

    # ===== 리스크 관리 =====
    MAX_POSITION_SIZE_BTC = 0.1  # 최대 포지션 크기
    MAX_DAILY_TRADES = 5  # 일일 최대 거래 수
    MAX_CONSECUTIVE_LOSSES = 3  # 연속 손실 후 휴식

    # ===== 로깅 =====
    LOG_DB_PATH = "logs/signals.db"
    LOG_LEVEL = "INFO"

    # ===== 거래소 =====
    EXCHANGE = "binance"
    SYMBOL = "BTCUSDT"
    SYMBOL_ETH = "ETHUSDT"  # 상관관계 계산용


class BacktestConfig:
    """백테스팅 전용 설정"""

    # 데이터 기간
    START_DATE = "2024-01-01"
    END_DATE = "2024-03-31"

    # 초기 자본
    INITIAL_CAPITAL = 10000  # USD

    # 슬리피지 (민감도 분석용)
    SLIPPAGE_SCENARIOS = [1, 2, 3, 4, 5]  # 틱

    # VPIN 임계값 (민감도 분석용)
    VPIN_THRESHOLD_SCENARIOS = [0.45, 0.50, 0.55, 0.60]

    # 성과 기준
    MIN_TRADES = 30
    MIN_WIN_RATE = 45.0  # %
    MIN_PROFIT_FACTOR = 1.4
    MAX_DRAWDOWN = 20.0  # %
    MIN_SHARPE_RATIO = 1.0
