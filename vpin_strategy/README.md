# VPIN Trading Strategy - Implementation

**Version:** 3.2 FINAL
**Status:** Implementation Phase
**Strategy:** Disciplined VPIN + Conservative Filters

## Project Structure

```
vpin_strategy/
├── src/
│   ├── core/
│   │   ├── market_data.py       # Data structures
│   │   ├── vpin_calculator.py   # VPIN calculation
│   │   └── data_sync.py         # Synchronization
│   ├── indicators/
│   │   ├── orderbook.py         # OB Imbalance
│   │   ├── large_trade.py       # Large Trade Detector
│   │   ├── volume_surge.py      # Volume Surge
│   │   ├── regime.py            # Regime Filter
│   │   └── correlation.py       # Correlation Calculator
│   ├── signal/
│   │   └── signal_generator.py  # Signal scoring system
│   ├── utils/
│   │   ├── logger.py            # SQLite logger
│   │   └── error_handling.py    # Safe wrappers
│   └── backtest/
│       ├── engine.py            # Backtesting engine
│       └── sensitivity.py       # Sensitivity analysis
├── tests/                       # Unit tests
├── config/
│   └── strategy_config.py       # Configuration
├── data/                        # Historical data
└── logs/                        # Execution logs
```

## Implementation Phases

### Phase 1: MVP (2 weeks) - COMPLETED
- [x] Project structure
- [x] VPIN Calculator
- [x] Basic data structures
- [x] Error handling framework

### Phase 2: Indicators (1 week) - COMPLETED
- [x] OB Imbalance
- [x] Large Trade Detector
- [x] Volume Surge
- [x] Scoring System

### Phase 3: Filters (1 week) - COMPLETED
- [x] Regime Filter
- [x] Time filters
- [x] Penalty factors (funding, volatility, correlation)

### Phase 4: Stabilization (1 week) - COMPLETED
- [x] Error handling
- [x] Logging system
- [x] Sensitivity analysis tools

### Phase 5: Next Steps
- [ ] Binance WebSocket integration
- [ ] Backtesting engine implementation
- [ ] Historical data collection (2-3 months)
- [ ] Parameter optimization
- [ ] Paper trading (1 month)

## Quick Start

```bash
# 1. 의존성 설치
pip install -r requirements.txt

# 2. 기본 예제 실행
cd vpin_strategy
python examples/basic_usage.py
```

```python
# Python에서 사용
from src.core import VPINCalculator, MarketData
from src.signal import SignalGenerator
from src.utils import SignalLogger

# VPIN Calculator 초기화
vpin_calc = VPINCalculator(bucket_size=40, num_buckets=50)

# 거래 데이터 업데이트
vpin_calc.update(price=50000.0, qty=0.5, is_buyer_maker=False, timestamp=1000000)

# Signal Generator 초기화
signal_gen = SignalGenerator(vpin_min_threshold=0.50, score_threshold=70)

# Market Data 준비
market_data = MarketData()
market_data.vpin = vpin_calc.get_vpin()
# ... (기타 지표 설정)

# 신호 확인
should_enter, score, reason = signal_gen.check_entry(market_data, direction="LONG")
print(f"진입: {should_enter}, 점수: {score}, 이유: {reason}")
```

## Specification

See [VPIN_Complete_전략_최종기획안_V3.2_FINAL.txt](../VPIN_Complete_전략_최종기획안_V3.2_FINAL.txt)

## Expected Performance

- Monthly Return: +1.5-3%
- Win Rate: 48-50%
- Sharpe Ratio: 1.0+
- Success Probability: 60-65%

## Core Philosophy

**"VPIN < 0.50이면, 우리는 존재하지 않는다"**
**"70점 미만은 신호가 아니다"**
**"규칙 = 생명선"**
