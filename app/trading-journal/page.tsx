'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface TradingRecord {
  id: string;
  no: number;
  symbol: 'BTC/USDT' | 'ETH/USDT' | 'SOL/USDT' | 'XRP/USDT' | 'BNB/USDT';
  entryDateTime: string;
  exitDateTime: string;
  positionDirection: 'LONG' | 'SHORT';
  leverage: number;
  positionSize: number;
  entryPrice: number;
  exitPrice: number;
  pnl: number;
  roi: number;
  roundTripFee: number;
  entryReason: string;
  exitReason: string;
}

const TradingJournalPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [records, setRecords] = useState<TradingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'all'>('month');
  const [showWeeklyTrades, setShowWeeklyTrades] = useState(false);

  // 숫자 포맷 함수
  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('en-US');
  };

  // 데이터 로드
  useEffect(() => {
    const fetchRecords = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/trading-records?kakaoId=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setRecords(data);
        }
      } catch (error) {
        console.error('Error fetching trading records:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecords();
  }, [user]);

  // 로그인 체크
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // 필터링된 레코드
  const getFilteredRecords = () => {
    if (timeFilter === 'all') return records;

    const now = new Date();
    const filterDate = new Date();

    if (timeFilter === 'week') {
      filterDate.setDate(now.getDate() - 7);
    } else if (timeFilter === 'month') {
      filterDate.setMonth(now.getMonth() - 1);
    }

    return records.filter(r => new Date(r.entryDateTime) >= filterDate);
  };

  const filteredRecords = getFilteredRecords();

  // 주간 데이터 (최근 7일)
  const getWeeklyData = () => {
    const today = new Date();
    const weekData = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayRecords = records.filter(r => {
        const recordDate = new Date(r.entryDateTime).toISOString().split('T')[0];
        return recordDate === dateStr;
      });

      const dayPnl = dayRecords.reduce((sum, r) => sum + r.pnl, 0);
      const wins = dayRecords.filter(r => r.pnl > 0).length;
      const losses = dayRecords.filter(r => r.pnl < 0).length;

      weekData.push({
        date: dateStr,
        dayName: ['일', '월', '화', '수', '목', '금', '토'][date.getDay()],
        dayNumber: date.getDate(),
        trades: dayRecords.length,
        wins,
        losses,
        pnl: dayPnl,
      });
    }

    return weekData;
  };

  // 통계 계산
  const totalPnl = filteredRecords.reduce((sum, r) => sum + r.pnl, 0);
  const totalFees = filteredRecords.reduce((sum, r) => sum + r.roundTripFee, 0);
  const netPnl = totalPnl - totalFees;
  const winTrades = filteredRecords.filter(r => r.pnl > 0).length;
  const lossTrades = filteredRecords.filter(r => r.pnl < 0).length;
  const totalTrades = filteredRecords.length;
  const winRate = totalTrades > 0 ? (winTrades / totalTrades) * 100 : 0;
  const totalProfit = filteredRecords.filter(r => r.pnl > 0).reduce((sum, r) => sum + r.pnl, 0);
  const totalLoss = Math.abs(filteredRecords.filter(r => r.pnl < 0).reduce((sum, r) => sum + r.pnl, 0));
  const avgWin = winTrades > 0 ? totalProfit / winTrades : 0;
  const avgLoss = lossTrades > 0 ? totalLoss / lossTrades : 0;
  const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : totalProfit > 0 ? Infinity : 0;

  // LONG vs SHORT 분석
  const longTrades = filteredRecords.filter(r => r.positionDirection === 'LONG');
  const shortTrades = filteredRecords.filter(r => r.positionDirection === 'SHORT');
  const longWinRate = longTrades.length > 0 ? (longTrades.filter(r => r.pnl > 0).length / longTrades.length) * 100 : 0;
  const shortWinRate = shortTrades.length > 0 ? (shortTrades.filter(r => r.pnl > 0).length / shortTrades.length) * 100 : 0;
  const longPnl = longTrades.reduce((sum, r) => sum + r.pnl, 0);
  const shortPnl = shortTrades.reduce((sum, r) => sum + r.pnl, 0);
  const longAvgWin = longTrades.filter(r => r.pnl > 0).length > 0
    ? longTrades.filter(r => r.pnl > 0).reduce((sum, r) => sum + r.pnl, 0) / longTrades.filter(r => r.pnl > 0).length
    : 0;
  const longAvgLoss = longTrades.filter(r => r.pnl < 0).length > 0
    ? Math.abs(longTrades.filter(r => r.pnl < 0).reduce((sum, r) => sum + r.pnl, 0)) / longTrades.filter(r => r.pnl < 0).length
    : 0;
  const shortAvgWin = shortTrades.filter(r => r.pnl > 0).length > 0
    ? shortTrades.filter(r => r.pnl > 0).reduce((sum, r) => sum + r.pnl, 0) / shortTrades.filter(r => r.pnl > 0).length
    : 0;
  const shortAvgLoss = shortTrades.filter(r => r.pnl < 0).length > 0
    ? Math.abs(shortTrades.filter(r => r.pnl < 0).reduce((sum, r) => sum + r.pnl, 0)) / shortTrades.filter(r => r.pnl < 0).length
    : 0;
  const longRiskReward = longAvgLoss > 0 ? longAvgWin / longAvgLoss : 0;
  const shortRiskReward = shortAvgLoss > 0 ? shortAvgWin / shortAvgLoss : 0;

  // 지난 주 vs 이번 주 비교
  const getWeekComparison = () => {
    const today = new Date();
    const lastWeekStart = new Date(today);
    lastWeekStart.setDate(today.getDate() - 14);
    const lastWeekEnd = new Date(today);
    lastWeekEnd.setDate(today.getDate() - 7);
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - 7);

    const lastWeekRecords = records.filter(r => {
      const date = new Date(r.entryDateTime);
      return date >= lastWeekStart && date < lastWeekEnd;
    });

    const thisWeekRecords = records.filter(r => {
      const date = new Date(r.entryDateTime);
      return date >= thisWeekStart;
    });

    const lastWeekPnl = lastWeekRecords.reduce((sum, r) => sum + r.pnl, 0);
    const thisWeekPnl = thisWeekRecords.reduce((sum, r) => sum + r.pnl, 0);
    const lastWeekWinRate = lastWeekRecords.length > 0
      ? (lastWeekRecords.filter(r => r.pnl > 0).length / lastWeekRecords.length) * 100
      : 0;
    const thisWeekWinRate = thisWeekRecords.length > 0
      ? (thisWeekRecords.filter(r => r.pnl > 0).length / thisWeekRecords.length) * 100
      : 0;

    // 손익비 계산
    const lastWeekWins = lastWeekRecords.filter(r => r.pnl > 0);
    const lastWeekLosses = lastWeekRecords.filter(r => r.pnl < 0);
    const lastWeekAvgWin = lastWeekWins.length > 0 ? lastWeekWins.reduce((sum, r) => sum + r.pnl, 0) / lastWeekWins.length : 0;
    const lastWeekAvgLoss = lastWeekLosses.length > 0 ? Math.abs(lastWeekLosses.reduce((sum, r) => sum + r.pnl, 0)) / lastWeekLosses.length : 0;
    const lastWeekRiskReward = lastWeekAvgLoss > 0 ? lastWeekAvgWin / lastWeekAvgLoss : 0;

    const thisWeekWins = thisWeekRecords.filter(r => r.pnl > 0);
    const thisWeekLosses = thisWeekRecords.filter(r => r.pnl < 0);
    const thisWeekAvgWin = thisWeekWins.length > 0 ? thisWeekWins.reduce((sum, r) => sum + r.pnl, 0) / thisWeekWins.length : 0;
    const thisWeekAvgLoss = thisWeekLosses.length > 0 ? Math.abs(thisWeekLosses.reduce((sum, r) => sum + r.pnl, 0)) / thisWeekLosses.length : 0;
    const thisWeekRiskReward = thisWeekAvgLoss > 0 ? thisWeekAvgWin / thisWeekAvgLoss : 0;

    return {
      lastWeek: {
        pnl: lastWeekPnl,
        winRate: lastWeekWinRate,
        trades: lastWeekRecords.length,
        riskReward: lastWeekRiskReward
      },
      thisWeek: {
        pnl: thisWeekPnl,
        winRate: thisWeekWinRate,
        trades: thisWeekRecords.length,
        riskReward: thisWeekRiskReward
      }
    };
  };

  const weekComparison = getWeekComparison();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-xl text-gray-600">로딩 중...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-gray-500">{new Date().getFullYear()}년 / {new Date().getMonth() + 1}월</p>
            <h1 className="text-2xl font-bold text-gray-900 mt-1">월별 트레이딩 피드백</h1>
          </div>
          <button
            onClick={() => router.push('/trading-journal-old')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <PlusIcon className="w-4 h-4" />
            거래 추가
          </button>
        </div>

        {/* 기간 필터 */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTimeFilter('week')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              timeFilter === 'week'
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            주간
          </button>
          <button
            onClick={() => setTimeFilter('month')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              timeFilter === 'month'
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            월간
          </button>
          <button
            onClick={() => setTimeFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              timeFilter === 'all'
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            전체
          </button>
        </div>

        {/* 주간 매매일지 캘린더 */}
        <div className="bg-white rounded-xl p-6 mb-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">주간 매매일지</h2>
          <div className="grid grid-cols-7 gap-3">
            {getWeeklyData().map((day, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  day.trades === 0
                    ? 'bg-gray-50 border-gray-200'
                    : day.pnl > 0
                    ? 'bg-green-50 border-green-200'
                    : day.pnl < 0
                    ? 'bg-red-50 border-red-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">{day.dayName}</div>
                  <div className="text-sm font-semibold text-gray-900 mb-2">{day.dayNumber}일</div>
                  {day.trades > 0 ? (
                    <>
                      <div className="text-xs text-gray-600 mb-1">
                        {day.wins}승 {day.losses}패
                      </div>
                      <div className={`text-sm font-bold ${day.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {day.pnl >= 0 ? '+' : ''}{day.pnl.toFixed(0)}%
                      </div>
                    </>
                  ) : (
                    <div className="text-xs text-gray-400">-</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 전체 통계 요약 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* 전체 거래 통계 */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-center font-bold text-gray-900 mb-4">전체 거래</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">거래 횟수</span>
                <span className="text-sm font-semibold text-gray-900">{totalTrades}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">승률</span>
                <span className="text-sm font-semibold text-gray-900">{winRate.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">손익비</span>
                <span className="text-sm font-semibold text-gray-900">
                  {avgLoss > 0 ? (avgWin / avgLoss).toFixed(2) : '-'}
                </span>
              </div>
            </div>
          </div>

          {/* LONG 거래 */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-center font-bold text-gray-900 mb-4">LONG 포지션</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">거래 횟수</span>
                <span className="text-sm font-semibold text-gray-900">{longTrades.length}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">승률</span>
                <span className="text-sm font-semibold text-gray-900">{longWinRate.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">손익비</span>
                <span className="text-sm font-semibold text-gray-900">
                  {longRiskReward > 0 ? longRiskReward.toFixed(2) : '-'}
                </span>
              </div>
            </div>
          </div>

          {/* SHORT 거래 */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-center font-bold text-gray-900 mb-4">SHORT 포지션</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">거래 횟수</span>
                <span className="text-sm font-semibold text-gray-900">{shortTrades.length}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">승률</span>
                <span className="text-sm font-semibold text-gray-900">{shortWinRate.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">손익비</span>
                <span className="text-sm font-semibold text-gray-900">
                  {shortRiskReward > 0 ? shortRiskReward.toFixed(2) : '-'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 7일 대비 8일의 매매 성적 변화량 */}
        <div className="bg-white rounded-xl p-6 mb-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-6 text-center">
            <span className="bg-yellow-100 px-3 py-1 rounded">지난 주 대비 이번 주의 매매 성적 변화량</span>
          </h2>

          <div className="grid grid-cols-2 gap-8">
            {/* 7일간 */}
            <div>
              <h3 className="text-center font-semibold text-gray-700 mb-4 pb-2 border-b-2 border-gray-200">
                지난 주
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">승률</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {weekComparison.lastWeek.winRate.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">손익비</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {weekComparison.lastWeek.riskReward > 0 ? weekComparison.lastWeek.riskReward.toFixed(2) : '-'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">총 PNL</span>
                  <span className={`text-sm font-semibold ${
                    weekComparison.lastWeek.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {weekComparison.lastWeek.pnl >= 0 ? '+' : ''}${formatNumber(weekComparison.lastWeek.pnl)}
                  </span>
                </div>
              </div>
            </div>

            {/* 이번 주 */}
            <div>
              <h3 className="text-center font-semibold text-gray-700 mb-4 pb-2 border-b-2 border-gray-200">
                이번 주
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">승률</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {weekComparison.thisWeek.winRate.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">손익비</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {weekComparison.thisWeek.riskReward > 0 ? weekComparison.thisWeek.riskReward.toFixed(2) : '-'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">총 PNL</span>
                  <span className={`text-sm font-semibold ${
                    weekComparison.thisWeek.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {weekComparison.thisWeek.pnl >= 0 ? '+' : ''}${formatNumber(weekComparison.thisWeek.pnl)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 방향 분석 */}
        <div className="bg-white rounded-xl p-6 mb-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-6">방향 분석</h2>

          <div className="grid grid-cols-2 gap-8">
            {/* 방향성 O (LONG) */}
            <div>
              <h3 className="text-center font-semibold text-gray-700 mb-4 pb-2 border-b-2 border-gray-200">
                방향성 O (LONG)
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">포지션 횟수</span>
                  <span className="text-sm font-semibold text-gray-900">{longTrades.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">승률</span>
                  <span className="text-sm font-semibold text-gray-900">{longWinRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">비율</span>
                  <span className={`text-sm font-semibold ${
                    longTrades.reduce((sum, r) => sum + r.pnl, 0) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {longTrades.reduce((sum, r) => sum + r.pnl, 0) >= 0 ? '+' : ''}
                    {longTrades.reduce((sum, r) => sum + r.pnl, 0).toFixed(0)}
                  </span>
                </div>
              </div>
            </div>

            {/* 방향성 X (SHORT) */}
            <div>
              <h3 className="text-center font-semibold text-gray-700 mb-4 pb-2 border-b-2 border-gray-200">
                방향성 X (SHORT)
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">포지션 횟수</span>
                  <span className="text-sm font-semibold text-gray-900">{shortTrades.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">승률</span>
                  <span className="text-sm font-semibold text-gray-900">{shortWinRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">비율</span>
                  <span className={`text-sm font-semibold ${
                    shortTrades.reduce((sum, r) => sum + r.pnl, 0) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {shortTrades.reduce((sum, r) => sum + r.pnl, 0) >= 0 ? '+' : ''}
                    {shortTrades.reduce((sum, r) => sum + r.pnl, 0).toFixed(0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 지난 주 대비 이번 주의 매매 성적 변화량 (간단 비교) */}
        <div className="bg-white rounded-xl p-6 mb-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-6 text-center">
            <span className="bg-yellow-100 px-3 py-1 rounded">지난 주 대비 이번 주의 매매 성적 변화량</span>
          </h2>

          <div className="grid grid-cols-2 gap-8">
            {/* 지난 주 */}
            <div>
              <h3 className="text-center font-semibold text-gray-700 mb-4 pb-2 border-b-2 border-gray-200">
                지난 주
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">승률</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {weekComparison.lastWeek.winRate.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">손익비</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {weekComparison.lastWeek.riskReward > 0 ? weekComparison.lastWeek.riskReward.toFixed(2) : '0'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">거래 횟수</span>
                  <span className="text-sm font-semibold text-gray-900">{weekComparison.lastWeek.trades}회</span>
                </div>
              </div>
            </div>

            {/* 이번 주 */}
            <div>
              <h3 className="text-center font-semibold text-gray-700 mb-4 pb-2 border-b-2 border-gray-200">
                이번 주
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">승률</span>
                  <span className={`text-sm font-semibold ${
                    weekComparison.thisWeek.winRate >= weekComparison.lastWeek.winRate ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {weekComparison.thisWeek.winRate.toFixed(1)}%
                    {weekComparison.lastWeek.trades > 0 && (
                      <span className="ml-1 text-xs">
                        ({weekComparison.thisWeek.winRate - weekComparison.lastWeek.winRate >= 0 ? '+' : ''}
                        {(weekComparison.thisWeek.winRate - weekComparison.lastWeek.winRate).toFixed(1)}%)
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">손익비</span>
                  <span className={`text-sm font-semibold ${
                    weekComparison.thisWeek.riskReward >= weekComparison.lastWeek.riskReward ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {weekComparison.thisWeek.riskReward > 0 ? weekComparison.thisWeek.riskReward.toFixed(2) : '0'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">거래 횟수</span>
                  <span className="text-sm font-semibold text-gray-900">{weekComparison.thisWeek.trades}회</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 월별/주별 매매 모아보기 버튼 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => router.push('/trading-journal-old')}
            className="w-full py-3 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 transition-colors"
          >
            전체 매매 모아보기
          </button>
          <button
            onClick={() => setShowWeeklyTrades(!showWeeklyTrades)}
            className="w-full py-3 bg-purple-100 text-purple-700 rounded-lg font-semibold hover:bg-purple-200 transition-colors"
          >
            {showWeeklyTrades ? '주별 보기 닫기' : '주별 거래 모아보기'}
          </button>
        </div>

        {/* 주별 거래 모아보기 뷰 */}
        {showWeeklyTrades && (
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">주별 거래 내역</h2>

            {getWeeklyData().map((day, index) => {
              const dayRecords = records.filter(r => {
                const recordDate = new Date(r.entryDateTime).toISOString().split('T')[0];
                return recordDate === day.date;
              });

              if (dayRecords.length === 0) return null;

              return (
                <div key={index} className="mb-6 last:mb-0">
                  <div className="flex items-center gap-3 mb-3 pb-2 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">
                      {day.dayName}요일, {day.dayNumber}일
                    </h3>
                    <span className="text-sm text-gray-500">
                      {day.wins}승 {day.losses}패
                    </span>
                    <span className={`text-sm font-bold ml-auto ${
                      day.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {day.pnl >= 0 ? '+' : ''}${formatNumber(day.pnl)}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {dayRecords.map((record) => (
                      <div
                        key={record.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold text-gray-500">#{record.no}</span>
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {record.symbol}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                            record.positionDirection === 'LONG' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {record.positionDirection}
                          </span>
                          <span className="text-xs text-gray-500">{record.leverage}x</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-xs text-gray-500">진입 → 청산</div>
                            <div className="text-xs font-medium text-gray-900">
                              ${record.entryPrice.toLocaleString()} → ${record.exitPrice.toLocaleString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-sm font-bold ${
                              record.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {record.pnl >= 0 ? '+' : ''}${formatNumber(record.pnl)}
                            </div>
                            <div className={`text-xs ${
                              record.roi >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {record.roi >= 0 ? '+' : ''}{record.roi.toFixed(2)}%
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {getWeeklyData().every(day => {
              const dayRecords = records.filter(r => {
                const recordDate = new Date(r.entryDateTime).toISOString().split('T')[0];
                return recordDate === day.date;
              });
              return dayRecords.length === 0;
            }) && (
              <div className="text-center py-12 text-gray-500">
                <p>이번 주 거래 내역이 없습니다</p>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default TradingJournalPage;
