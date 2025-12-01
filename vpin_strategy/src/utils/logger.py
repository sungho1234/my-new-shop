"""
Signal Logger - V3.2 FINAL
SQLite 기반 신호 로깅 시스템
"""
import sqlite3
import time
from datetime import datetime
from typing import Optional
from ..core.market_data import MarketData


class SignalLogger:
    """
    신호 결정 로거 (SQLite)

    모든 신호 (진입/거부) 기록
    사후 분석 가능
    """

    def __init__(self, db_path: str = "logs/signals.db"):
        """
        Args:
            db_path: SQLite DB 파일 경로
        """
        self.db_path = db_path
        self.conn = sqlite3.connect(db_path, check_same_thread=False)
        self.create_tables()

    def create_tables(self):
        """테이블 생성"""
        # 신호 로그 테이블
        self.conn.execute("""
            CREATE TABLE IF NOT EXISTS signal_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp REAL,
                datetime TEXT,
                decision TEXT,  -- ENTER, REJECT
                reason TEXT,
                score REAL,
                threshold REAL,
                direction TEXT,

                -- 지표 값들
                vpin REAL,
                ob_ratio REAL,
                ob_reliable INTEGER,
                large_trade INTEGER,
                large_trade_direction TEXT,
                volume_surge REAL,
                regime TEXT,
                funding_rate REAL,
                correlation REAL,

                -- 변동성
                atr_4h REAL,
                atr_percentile REAL,

                -- 스프레드
                spread REAL,
                avg_spread REAL,

                -- 시간대
                time_of_day TEXT,

                -- 메타
                symbol TEXT,
                price REAL
            )
        """)

        # 거래 로그 테이블
        self.conn.execute("""
            CREATE TABLE IF NOT EXISTS trade_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                entry_timestamp REAL,
                entry_datetime TEXT,
                exit_timestamp REAL,
                exit_datetime TEXT,

                symbol TEXT,
                direction TEXT,
                entry_price REAL,
                exit_price REAL,

                size REAL,
                pnl REAL,
                pnl_percent REAL,

                exit_reason TEXT,  -- TP1, TP2, TP3, SL_HARD, SL_TIME, SL_VPIN

                -- 진입 시 지표
                entry_vpin REAL,
                entry_score REAL,
                entry_regime TEXT
            )
        """)

        self.conn.commit()

    def log_decision(
        self,
        decision: str,
        market_data: MarketData,
        score: int,
        reason: str,
        direction: str = "LONG"
    ):
        """
        신호 결정 기록

        Args:
            decision: "ENTER" or "REJECT"
            market_data: MarketData 객체
            score: 계산된 점수
            reason: 결정 이유
            direction: 거래 방향
        """
        timestamp = time.time()
        dt_str = datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d %H:%M:%S')

        self.conn.execute("""
            INSERT INTO signal_log VALUES (
                NULL, ?, ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?, ?
            )
        """, (
            timestamp,
            dt_str,
            decision,
            reason,
            score,
            market_data.threshold if hasattr(market_data, 'threshold') else 70,
            direction,

            market_data.vpin,
            market_data.ob_ratio,
            1 if market_data.ob_reliable else 0,
            1 if market_data.large_trade_detected else 0,
            market_data.large_trade_direction if market_data.large_trade_direction else "NONE",
            market_data.volume_surge_ratio,
            market_data.regime,
            market_data.funding_rate,
            market_data.btc_eth_corr,

            market_data.atr_4h,
            market_data.atr_percentile,

            market_data.spread,
            market_data.avg_spread,

            market_data.time_of_day,

            market_data.symbol,
            market_data.price
        ))
        self.conn.commit()

    def log_trade(
        self,
        entry_timestamp: float,
        exit_timestamp: float,
        symbol: str,
        direction: str,
        entry_price: float,
        exit_price: float,
        size: float,
        exit_reason: str,
        entry_vpin: float = 0.0,
        entry_score: int = 0,
        entry_regime: str = "UNKNOWN"
    ):
        """
        거래 기록

        Args:
            entry_timestamp: 진입 시간
            exit_timestamp: 청산 시간
            symbol: 심볼
            direction: "LONG" or "SHORT"
            entry_price: 진입 가격
            exit_price: 청산 가격
            size: 포지션 크기
            exit_reason: 청산 이유
            entry_vpin: 진입 시 VPIN
            entry_score: 진입 시 점수
            entry_regime: 진입 시 국면
        """
        # PnL 계산
        if direction == "LONG":
            pnl = (exit_price - entry_price) * size
            pnl_percent = (exit_price - entry_price) / entry_price * 100
        else:  # SHORT
            pnl = (entry_price - exit_price) * size
            pnl_percent = (entry_price - exit_price) / entry_price * 100

        entry_dt = datetime.fromtimestamp(entry_timestamp).strftime('%Y-%m-%d %H:%M:%S')
        exit_dt = datetime.fromtimestamp(exit_timestamp).strftime('%Y-%m-%d %H:%M:%S')

        self.conn.execute("""
            INSERT INTO trade_log VALUES (
                NULL, ?, ?, ?, ?,
                ?, ?, ?, ?,
                ?, ?, ?,
                ?,
                ?, ?, ?
            )
        """, (
            entry_timestamp,
            entry_dt,
            exit_timestamp,
            exit_dt,

            symbol,
            direction,
            entry_price,
            exit_price,

            size,
            pnl,
            pnl_percent,

            exit_reason,

            entry_vpin,
            entry_score,
            entry_regime
        ))
        self.conn.commit()

    def analyze_rejections(self, limit: int = 20):
        """
        거부 사유 통계

        Args:
            limit: 상위 N개
        """
        cursor = self.conn.execute("""
            SELECT reason, COUNT(*) as count
            FROM signal_log
            WHERE decision = 'REJECT'
            GROUP BY reason
            ORDER BY count DESC
            LIMIT ?
        """, (limit,))

        print(f"\n=== 거부 사유 Top {limit} ===")
        for row in cursor.fetchall():
            print(f"{row[0]}: {row[1]}회")

    def analyze_by_time(self):
        """시간대별 성과"""
        cursor = self.conn.execute("""
            SELECT
                sl.time_of_day,
                COUNT(*) as entry_count,
                AVG(tl.pnl_percent) as avg_pnl_pct,
                SUM(CASE WHEN tl.pnl > 0 THEN 1 ELSE 0 END) * 100.0 / COUNT(*) as win_rate
            FROM signal_log sl
            LEFT JOIN trade_log tl ON sl.timestamp = tl.entry_timestamp
            WHERE sl.decision = 'ENTER'
            GROUP BY sl.time_of_day
        """)

        print("\n=== 시간대별 성과 ===")
        for row in cursor.fetchall():
            time_tier, count, avg_pnl, win_rate = row
            print(f"{time_tier}: {count}회, 평균 {avg_pnl:.2f}%, 승률 {win_rate:.1f}%")

    def analyze_by_regime(self):
        """국면별 성과"""
        cursor = self.conn.execute("""
            SELECT
                entry_regime,
                COUNT(*) as count,
                AVG(pnl_percent) as avg_pnl_pct,
                SUM(CASE WHEN pnl > 0 THEN 1 ELSE 0 END) * 100.0 / COUNT(*) as win_rate
            FROM trade_log
            GROUP BY entry_regime
        """)

        print("\n=== 국면별 성과 ===")
        for row in cursor.fetchall():
            regime, count, avg_pnl, win_rate = row
            print(f"{regime}: {count}회, 평균 {avg_pnl:.2f}%, 승률 {win_rate:.1f}%")

    def get_recent_signals(self, limit: int = 10):
        """최근 신호 조회"""
        cursor = self.conn.execute("""
            SELECT datetime, decision, score, reason, vpin, price
            FROM signal_log
            ORDER BY timestamp DESC
            LIMIT ?
        """, (limit,))

        print(f"\n=== 최근 신호 {limit}개 ===")
        for row in cursor.fetchall():
            dt, decision, score, reason, vpin, price = row
            print(f"[{dt}] {decision} | Score: {score} | VPIN: {vpin:.3f} | {reason}")

    def get_performance_summary(self):
        """전체 성과 요약"""
        cursor = self.conn.execute("""
            SELECT
                COUNT(*) as total_trades,
                SUM(CASE WHEN pnl > 0 THEN 1 ELSE 0 END) as wins,
                AVG(pnl_percent) as avg_pnl_pct,
                SUM(pnl) as total_pnl,
                MAX(pnl) as max_win,
                MIN(pnl) as max_loss
            FROM trade_log
        """)

        row = cursor.fetchone()
        if row and row[0] > 0:
            total, wins, avg_pnl, total_pnl, max_win, max_loss = row
            win_rate = wins / total * 100 if total > 0 else 0

            print("\n=== 전체 성과 요약 ===")
            print(f"총 거래: {total}회")
            print(f"승률: {win_rate:.1f}% ({wins}/{total})")
            print(f"평균 수익률: {avg_pnl:.2f}%")
            print(f"총 수익: ${total_pnl:.2f}")
            print(f"최대 승리: ${max_win:.2f}")
            print(f"최대 손실: ${max_loss:.2f}")
        else:
            print("\n거래 내역이 없습니다.")

    def close(self):
        """DB 연결 종료"""
        self.conn.close()
