"""
Sensitivity Analysis - V3.2 FINAL
슬리피지, VPIN 임계값, 시간대별 민감도 분석
"""
import pandas as pd
import numpy as np
from typing import Dict, List, Callable


class SensitivityAnalyzer:
    """
    민감도 분석기

    주요 분석:
    1. 슬리피지 민감도 (1-5틱)
    2. VPIN 임계값 민감도 (0.45-0.60)
    3. 시간대별 성과
    4. 국면별 성과
    """

    def __init__(self):
        pass

    def run_slippage_sensitivity(
        self,
        backtest_func: Callable,
        base_config: dict
    ) -> pd.DataFrame:
        """
        슬리피지 민감도 테스트

        Args:
            backtest_func: 백테스팅 함수
            base_config: 기본 설정

        Returns:
            DataFrame: 슬리피지별 성과
        """
        results = []

        print("\n=== 슬리피지 민감도 분석 ===")

        for slippage_ticks in [1, 2, 3, 4, 5]:
            config = base_config.copy()
            config['slippage_mean'] = slippage_ticks
            config['slippage_std'] = slippage_ticks * 0.3

            result = backtest_func(config)

            results.append({
                'slippage_ticks': slippage_ticks,
                'monthly_return': result.get('monthly_return', 0),
                'sharpe_ratio': result.get('sharpe_ratio', 0),
                'win_rate': result.get('win_rate', 0),
                'total_trades': result.get('total_trades', 0),
                'profit_factor': result.get('profit_factor', 0)
            })

            print(f"슬리피지 {slippage_ticks}틱: "
                  f"월 수익 {result.get('monthly_return', 0):.2%}, "
                  f"승률 {result.get('win_rate', 0):.1%}, "
                  f"샤프 {result.get('sharpe_ratio', 0):.2f}")

        df = pd.DataFrame(results)

        # 분석
        print("\n--- 분석 결과 ---")
        if len(df) > 0:
            viable_at_3ticks = df[df['slippage_ticks'] == 3]['monthly_return'].values
            if len(viable_at_3ticks) > 0 and viable_at_3ticks[0] > 0.01:
                print("✅ 슬리피지 3틱에서도 월 1% 이상 → 실전 가능성 높음")
            else:
                print("⚠️ 슬리피지에 너무 민감 → 전략 재검토 필요")

        return df

    def run_vpin_threshold_sensitivity(
        self,
        backtest_func: Callable,
        base_config: dict
    ) -> pd.DataFrame:
        """
        VPIN 임계값 민감도 테스트

        Args:
            backtest_func: 백테스팅 함수
            base_config: 기본 설정

        Returns:
            DataFrame: VPIN 임계값별 성과
        """
        results = []

        print("\n=== VPIN 임계값 민감도 분석 ===")

        for vpin_min in [0.45, 0.50, 0.55, 0.60]:
            config = base_config.copy()
            config['vpin_min_threshold'] = vpin_min

            result = backtest_func(config)

            results.append({
                'vpin_min': vpin_min,
                'trade_count': result.get('total_trades', 0),
                'win_rate': result.get('win_rate', 0),
                'monthly_return': result.get('monthly_return', 0),
                'sharpe_ratio': result.get('sharpe_ratio', 0)
            })

            print(f"VPIN ≥ {vpin_min}: "
                  f"{result.get('total_trades', 0)}회 거래, "
                  f"승률 {result.get('win_rate', 0):.1%}, "
                  f"월 수익 {result.get('monthly_return', 0):.2%}")

        df = pd.DataFrame(results)

        # 분석
        print("\n--- 분석 결과 ---")
        if len(df) > 0 and 'sharpe_ratio' in df.columns:
            optimal_idx = df['sharpe_ratio'].idxmax()
            optimal_threshold = df.loc[optimal_idx, 'vpin_min']

            print(f"최적 VPIN 임계값: {optimal_threshold}")

            if optimal_threshold == 0.50:
                print("✅ V3.2 기본값(0.50)이 최적")
            else:
                print(f"⚠️ {optimal_threshold}로 조정 권장")

        return df

    def analyze_by_time_of_day(self, trades: List[dict]) -> pd.DataFrame:
        """
        시간대별 성과 분해

        Args:
            trades: 거래 목록

        Returns:
            DataFrame: 시간대별 통계
        """
        if not trades:
            print("거래 내역이 없습니다.")
            return pd.DataFrame()

        print("\n=== 시간대별 성과 ===")

        # 시간대별 분류
        tier_groups = {
            'TIER1_ASIAN_OPEN': [],
            'TIER2_EU_US': [],
            'TIER3_US_OPEN': []
        }

        for trade in trades:
            tier = trade.get('time_tier', 'UNKNOWN')
            if tier in tier_groups:
                tier_groups[tier].append(trade)

        results = []

        for tier, tier_trades in tier_groups.items():
            if not tier_trades:
                continue

            wins = [t for t in tier_trades if t.get('pnl', 0) > 0]
            avg_pnl = np.mean([t.get('pnl', 0) for t in tier_trades])
            win_rate = len(wins) / len(tier_trades) * 100 if tier_trades else 0

            results.append({
                'time_tier': tier,
                'count': len(tier_trades),
                'win_rate': win_rate,
                'avg_pnl': avg_pnl,
                'total_pnl': sum(t.get('pnl', 0) for t in tier_trades)
            })

            print(f"{tier}: {len(tier_trades)}회, "
                  f"승률 {win_rate:.1f}%, "
                  f"평균 PnL {avg_pnl:.2f}")

        df = pd.DataFrame(results)

        # 분석
        if len(df) > 0:
            best_tier = df.loc[df['avg_pnl'].idxmax(), 'time_tier']
            print(f"\n✅ 최고 성과 시간대: {best_tier}")

            # Tier 3 손실 확인
            tier3_data = df[df['time_tier'] == 'TIER3_US_OPEN']
            if len(tier3_data) > 0 and tier3_data['avg_pnl'].values[0] < 0:
                print("⚠️ Tier 3 (23-01시) 손실 → 비활성화 권장")

        return df

    def analyze_by_regime(self, trades: List[dict]) -> pd.DataFrame:
        """
        국면별 성과 분해

        Args:
            trades: 거래 목록

        Returns:
            DataFrame: 국면별 통계
        """
        if not trades:
            print("거래 내역이 없습니다.")
            return pd.DataFrame()

        print("\n=== 국면별 성과 ===")

        # 국면별 분류
        regime_groups = {}
        for trade in trades:
            regime = trade.get('regime', 'UNKNOWN')
            if regime not in regime_groups:
                regime_groups[regime] = []
            regime_groups[regime].append(trade)

        results = []

        for regime, regime_trades in regime_groups.items():
            if not regime_trades:
                continue

            wins = [t for t in regime_trades if t.get('pnl', 0) > 0]
            avg_pnl = np.mean([t.get('pnl', 0) for t in regime_trades])
            win_rate = len(wins) / len(regime_trades) * 100 if regime_trades else 0

            results.append({
                'regime': regime,
                'count': len(regime_trades),
                'win_rate': win_rate,
                'avg_pnl': avg_pnl,
                'total_pnl': sum(t.get('pnl', 0) for t in regime_trades)
            })

            print(f"{regime}: {len(regime_trades)}회, "
                  f"승률 {win_rate:.1f}%, "
                  f"평균 PnL {avg_pnl:.2f}")

        df = pd.DataFrame(results)

        # 분석
        if len(df) > 0:
            # CHOP 확인
            chop_data = df[df['regime'] == 'CHOP']
            if len(chop_data) > 0 and chop_data['avg_pnl'].values[0] < 0:
                print("\n⚠️ 횡보장(CHOP)에서 손실 → 거래 금지 권장")

        return df

    def print_summary(self, backtest_result: dict):
        """
        백테스팅 결과 요약 출력

        Args:
            backtest_result: 백테스팅 결과
        """
        print("\n" + "="*60)
        print("백테스팅 결과 요약")
        print("="*60)

        print(f"\n총 거래: {backtest_result.get('total_trades', 0)}회")
        print(f"승률: {backtest_result.get('win_rate', 0):.1f}%")
        print(f"월 수익률: {backtest_result.get('monthly_return', 0):.2%}")
        print(f"연간 수익률: {backtest_result.get('annual_return', 0):.2%}")
        print(f"샤프 비율: {backtest_result.get('sharpe_ratio', 0):.2f}")
        print(f"Profit Factor: {backtest_result.get('profit_factor', 0):.2f}")
        print(f"Max Drawdown: {backtest_result.get('max_drawdown', 0):.2%}")

        print("\n--- 합격 기준 체크 ---")

        passed = []
        failed = []

        # 체크리스트
        if backtest_result.get('total_trades', 0) >= 30:
            passed.append("✅ 총 거래 >= 30회")
        else:
            failed.append(f"❌ 총 거래 {backtest_result.get('total_trades', 0)}회 (목표: 30회 이상)")

        if backtest_result.get('win_rate', 0) >= 45:
            passed.append("✅ 승률 >= 45%")
        else:
            failed.append(f"❌ 승률 {backtest_result.get('win_rate', 0):.1f}% (목표: 45% 이상)")

        if backtest_result.get('profit_factor', 0) >= 1.4:
            passed.append("✅ Profit Factor >= 1.4")
        else:
            failed.append(f"❌ Profit Factor {backtest_result.get('profit_factor', 0):.2f} (목표: 1.4 이상)")

        if backtest_result.get('max_drawdown', 0) <= 0.20:
            passed.append("✅ Max Drawdown <= 20%")
        else:
            failed.append(f"❌ Max Drawdown {backtest_result.get('max_drawdown', 0):.1%} (목표: 20% 이하)")

        if backtest_result.get('sharpe_ratio', 0) >= 1.0:
            passed.append("✅ Sharpe Ratio >= 1.0")
        else:
            failed.append(f"❌ Sharpe Ratio {backtest_result.get('sharpe_ratio', 0):.2f} (목표: 1.0 이상)")

        if backtest_result.get('monthly_return', 0) > 0:
            passed.append("✅ 월 수익 > 0%")
        else:
            failed.append(f"❌ 월 수익 {backtest_result.get('monthly_return', 0):.2%} (목표: 0% 이상)")

        # 출력
        for item in passed:
            print(item)
        for item in failed:
            print(item)

        # 최종 판정
        print("\n" + "="*60)
        if len(failed) == 0:
            print("🎉 모든 기준 통과! Paper Trading 진행 가능")
        elif len(failed) <= 2:
            print("⚠️ 일부 기준 미달 - 파라미터 조정 후 재시도 권장")
        else:
            print("❌ 기준 미달 - 전략 재검토 필요")
        print("="*60)
