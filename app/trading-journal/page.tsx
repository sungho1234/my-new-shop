'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { PlusIcon, TrashIcon, PencilIcon, CheckIcon, ChartBarIcon, CalendarIcon } from '@heroicons/react/24/outline';
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
  entryEmotion: string;
  exitEmotion: string;
  lessonLearned: string;
}

const TradingJournalPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [records, setRecords] = useState<TradingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingRow, setIsAddingRow] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedCell, setExpandedCell] = useState<{ id: string; field: string } | null>(null);
  const [timeFilter, setTimeFilter] = useState<'today' | 'month' | 'all'>('all');

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
        } else {
          console.error('Failed to fetch trading records');
        }
      } catch (error) {
        console.error('Error fetching trading records:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecords();
  }, [user]);

  const [newRecord, setNewRecord] = useState<Partial<TradingRecord>>({
    symbol: 'BTC/USDT',
    entryDateTime: new Date().toISOString().slice(0, 10),
    exitDateTime: new Date().toISOString().slice(0, 10),
    positionDirection: 'LONG',
    leverage: 1,
    positionSize: 0,
    entryPrice: 0,
    exitPrice: 0,
    roundTripFee: 0,
    entryReason: '',
    exitReason: '',
    entryEmotion: '',
    exitEmotion: '',
    lessonLearned: '',
  });

  const [editingRecord, setEditingRecord] = useState<TradingRecord | null>(null);

  // 날짜 필터
  const today = new Date().toISOString().split('T')[0];
  const thisMonth = new Date().toISOString().slice(0, 7);

  const filteredRecords = records.filter(r => {
    if (timeFilter === 'today') return r.entryDateTime.startsWith(today);
    if (timeFilter === 'month') return r.entryDateTime.startsWith(thisMonth);
    return true;
  });

  // 통계 계산
  const totalTrades = filteredRecords.length;
  const winTrades = filteredRecords.filter(r => r.pnl > 0).length;
  const lossTrades = filteredRecords.filter(r => r.pnl < 0).length;
  const breakEvenTrades = filteredRecords.filter(r => r.pnl === 0).length;
  const winRate = totalTrades > 0 ? (winTrades / totalTrades) * 100 : 0;
  const lossRate = totalTrades > 0 ? (lossTrades / totalTrades) * 100 : 0;

  const totalPnl = filteredRecords.reduce((sum, r) => sum + r.pnl, 0);
  const totalProfit = filteredRecords.filter(r => r.pnl > 0).reduce((sum, r) => sum + r.pnl, 0);
  const totalLoss = Math.abs(filteredRecords.filter(r => r.pnl < 0).reduce((sum, r) => sum + r.pnl, 0));
  const totalFees = filteredRecords.reduce((sum, r) => sum + r.roundTripFee, 0);
  const netPnl = totalPnl - totalFees;

  const avgWin = winTrades > 0 ? totalProfit / winTrades : 0;
  const avgLoss = lossTrades > 0 ? totalLoss / lossTrades : 0;
  const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : totalProfit > 0 ? Infinity : 0;

  // 원형 차트 계산
  const winAngle = (winRate / 100) * 360;
  const lossAngle = (lossRate / 100) * 360;

  // PNL, ROI 자동 계산
  const calculatePnlAndRoi = (
    symbol: string,
    positionDirection: 'LONG' | 'SHORT',
    leverage: number,
    positionSize: number,
    entryPrice: number,
    exitPrice: number
  ) => {
    if (!entryPrice || !exitPrice || !positionSize) {
      return { pnl: 0, roi: 0 };
    }

    let pnl = 0;
    if (positionDirection === 'LONG') {
      pnl = (exitPrice - entryPrice) * positionSize;
    } else {
      pnl = (entryPrice - exitPrice) * positionSize;
    }

    const investment = (entryPrice * positionSize) / leverage;
    const roi = investment > 0 ? (pnl / investment) * 100 : 0;

    return { pnl, roi };
  };

  const handleAddRecord = async () => {
    if (!newRecord.symbol || !user) return;

    const { pnl, roi } = calculatePnlAndRoi(
      newRecord.symbol || 'BTC/USDT',
      newRecord.positionDirection || 'LONG',
      newRecord.leverage || 1,
      newRecord.positionSize || 0,
      newRecord.entryPrice || 0,
      newRecord.exitPrice || 0
    );

    const recordData = {
      kakaoId: user.id,
      no: records.length + 1,
      symbol: newRecord.symbol || 'BTC/USDT',
      entryDateTime: (newRecord.entryDateTime || new Date().toISOString().slice(0, 10)) + 'T00:00',
      exitDateTime: (newRecord.exitDateTime || new Date().toISOString().slice(0, 10)) + 'T00:00',
      positionDirection: newRecord.positionDirection || 'LONG',
      leverage: newRecord.leverage || 1,
      positionSize: newRecord.positionSize || 0,
      entryPrice: newRecord.entryPrice || 0,
      exitPrice: newRecord.exitPrice || 0,
      pnl,
      roi,
      roundTripFee: newRecord.roundTripFee || 0,
      entryReason: newRecord.entryReason || '',
      exitReason: newRecord.exitReason || '',
      entryEmotion: newRecord.entryEmotion || '',
      exitEmotion: newRecord.exitEmotion || '',
      lessonLearned: newRecord.lessonLearned || '',
    };

    try {
      const response = await fetch('/api/trading-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recordData),
      });

      if (response.ok) {
        const savedRecord = await response.json();
        setRecords([savedRecord, ...records]);
        setNewRecord({
          symbol: 'BTC/USDT',
          entryDateTime: new Date().toISOString().slice(0, 10),
          exitDateTime: new Date().toISOString().slice(0, 10),
          positionDirection: 'LONG',
          leverage: 1,
          positionSize: 0,
          entryPrice: 0,
          exitPrice: 0,
          roundTripFee: 0,
          entryReason: '',
          exitReason: '',
          entryEmotion: '',
          exitEmotion: '',
          lessonLearned: '',
        });
        setIsAddingRow(false);
      } else {
        alert('거래 기록 저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error saving record:', error);
      alert('거래 기록 저장 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteRecord = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/trading-records/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setRecords(records.filter(r => r.id !== id));
      } else {
        alert('거래 기록 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error deleting record:', error);
      alert('거래 기록 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleEditRecord = (record: TradingRecord) => {
    setEditingId(record.id);
    setEditingRecord({ ...record });
  };

  const handleSaveEdit = async () => {
    if (!editingRecord) return;

    const { pnl, roi } = calculatePnlAndRoi(
      editingRecord.symbol,
      editingRecord.positionDirection,
      editingRecord.leverage,
      editingRecord.positionSize,
      editingRecord.entryPrice,
      editingRecord.exitPrice
    );

    const updatedData = { ...editingRecord, pnl, roi };

    try {
      const response = await fetch(`/api/trading-records/${editingRecord.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const savedRecord = await response.json();
        setRecords(records.map(r => r.id === editingRecord.id ? savedRecord : r));
        setEditingId(null);
        setEditingRecord(null);
      } else {
        alert('거래 기록 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error updating record:', error);
      alert('거래 기록 수정 중 오류가 발생했습니다.');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingRecord(null);
  };

  const getSymbolCoin = (symbol: string) => {
    return symbol.split('/')[0];
  };

  const currentPnlRoi = isAddingRow ? calculatePnlAndRoi(
    newRecord.symbol || 'BTC/USDT',
    newRecord.positionDirection || 'LONG',
    newRecord.leverage || 1,
    newRecord.positionSize || 0,
    newRecord.entryPrice || 0,
    newRecord.exitPrice || 0
  ) : { pnl: 0, roi: 0 };

  const toggleExpand = (id: string, field: string) => {
    if (expandedCell?.id === id && expandedCell?.field === field) {
      setExpandedCell(null);
    } else {
      setExpandedCell({ id, field });
    }
  };

  const renderTextField = (record: TradingRecord, field: keyof TradingRecord, placeholder: string) => {
    const isExpanded = expandedCell?.id === record.id && expandedCell?.field === field;
    const value = record[field] as string;

    if (editingId === record.id && editingRecord) {
      return (
        <textarea
          value={editingRecord[field] as string}
          onChange={(e) => setEditingRecord({ ...editingRecord, [field]: e.target.value })}
          className="w-full px-3 py-2 text-sm bg-white border border-gray-300 text-gray-900 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-normal"
          rows={4}
          placeholder={placeholder}
        />
      );
    }

    return (
      <div
        onClick={() => toggleExpand(record.id, field)}
        className="cursor-pointer hover:bg-gray-200 px-3 py-2 rounded transition-colors duration-150"
      >
        {isExpanded ? (
          <div className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">{value || <span className="text-gray-500 italic">{placeholder}</span>}</div>
        ) : (
          <div className="text-sm text-gray-900 line-clamp-4 leading-relaxed">{value || <span className="text-gray-500 italic">{placeholder}</span>}</div>
        )}
      </div>
    );
  };

  // 로딩 중
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-[1900px]">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">로딩 중...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // 로그인하지 않은 경우
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-[1900px]">
          <div className="flex items-center justify-center h-96">
            <div className="text-center bg-white border border-gray-200 p-12 rounded-xl shadow-lg">
              <h2 className="text-2xl font-medium text-gray-900 mb-4">로그인이 필요합니다</h2>
              <p className="text-gray-600 mb-6">매매 일지를 사용하려면 로그인해 주세요.</p>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                홈으로 이동
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-[1900px]">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-4xl font-semibold text-gray-900 mb-3 tracking-tight">Trading Journal</h1>
          <p className="text-base text-gray-600">체계적인 매매 기록으로 수익성 있는 트레이더로 성장하세요</p>
        </div>

        {/* 시간 필터 */}
        <div className="mb-6 flex items-center gap-3">
          <CalendarIcon className="w-5 h-5 text-gray-600" />
          <div className="flex gap-2">
            <button
              onClick={() => setTimeFilter('today')}
              className={`px-4 py-2 rounded font-medium text-sm transition-all ${
                timeFilter === 'today'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              오늘
            </button>
            <button
              onClick={() => setTimeFilter('month')}
              className={`px-4 py-2 rounded font-medium text-sm transition-all ${
                timeFilter === 'month'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              이번 달
            </button>
            <button
              onClick={() => setTimeFilter('all')}
              className={`px-4 py-2 rounded font-medium text-sm transition-all ${
                timeFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              전체
            </button>
          </div>
        </div>

        {/* 통계 대시보드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* 총 손익 */}
          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-medium text-gray-600 uppercase tracking-wide">총 손익</h3>
              <ChartBarIcon className="w-4 h-4 text-gray-400" />
            </div>
            <div className={`text-2xl font-semibold mb-1 tabular-nums ${totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(2)}
            </div>
            <p className="text-xs text-gray-600">순손익: ${netPnl.toFixed(2)}</p>
          </div>

          {/* 승률 */}
          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-medium text-gray-600 uppercase tracking-wide">승률</h3>
              <div className="w-10 h-10">
                <svg viewBox="0 0 36 36" className="w-full h-full">
                  <circle cx="18" cy="18" r="16" fill="none" stroke="#e5e7eb" strokeWidth="3"></circle>
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeDasharray={`${winRate} ${100 - winRate}`}
                    strokeDashoffset="25"
                  ></circle>
                </svg>
              </div>
            </div>
            <div className="text-2xl font-semibold text-green-600 mb-1 tabular-nums">{winRate.toFixed(1)}%</div>
            <p className="text-xs text-gray-600">{winTrades}승 {lossTrades}패</p>
          </div>

          {/* 총 수익 */}
          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-medium text-gray-600 uppercase tracking-wide">총 수익</h3>
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            </div>
            <div className="text-2xl font-semibold text-green-600 mb-1 tabular-nums">+${totalProfit.toFixed(2)}</div>
            <p className="text-xs text-gray-600">평균: ${avgWin.toFixed(2)}</p>
          </div>

          {/* 총 손실 */}
          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-medium text-gray-600 uppercase tracking-wide">총 손실</h3>
              <div className="w-2 h-2 bg-red-600 rounded-full"></div>
            </div>
            <div className="text-2xl font-semibold text-red-600 mb-1 tabular-nums">-${totalLoss.toFixed(2)}</div>
            <p className="text-xs text-gray-600">평균: ${avgLoss.toFixed(2)}</p>
          </div>
        </div>

        {/* 상세 통계 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">거래 통계</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">총 거래 횟수</span>
                <span className="text-sm font-semibold text-gray-900">{totalTrades}회</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">승리</span>
                <span className="text-sm font-semibold text-green-600">{winTrades}회</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">패배</span>
                <span className="text-sm font-semibold text-red-600">{lossTrades}회</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">무승부</span>
                <span className="text-sm font-semibold text-gray-600">{breakEvenTrades}회</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">수익성 분석</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Profit Factor</span>
                <span className={`text-sm font-semibold ${profitFactor >= 2 ? 'text-green-600' : profitFactor >= 1 ? 'text-yellow-500' : 'text-red-600'}`}>
                  {profitFactor === Infinity ? '∞' : profitFactor.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">평균 승리</span>
                <span className="text-sm font-semibold text-green-600">${avgWin.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">평균 손실</span>
                <span className="text-sm font-semibold text-red-600">${avgLoss.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">총 수수료</span>
                <span className="text-sm font-semibold text-gray-900">${totalFees.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">승패 분포</h3>
            <div className="flex items-center justify-center mb-4">
              <svg viewBox="0 0 100 100" className="w-32 h-32 transform -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="20"></circle>
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#34d399"
                  strokeWidth="20"
                  strokeDasharray={`${winRate * 2.51} ${100 * 2.51}`}
                  strokeLinecap="round"
                ></circle>
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#f87171"
                  strokeWidth="20"
                  strokeDasharray={`${lossRate * 2.51} ${100 * 2.51}`}
                  strokeDashoffset={`-${winRate * 2.51}`}
                  strokeLinecap="round"
                ></circle>
              </svg>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">승리</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{winRate.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">패배</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{lossRate.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 매매 내역 테이블 */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">매매 내역</h2>
              {!isAddingRow && (
                <button
                  onClick={() => setIsAddingRow(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium text-sm"
                >
                  <PlusIcon className="w-4 h-4" />
                  새 거래 기록
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider min-w-[50px]">No</th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider min-w-[100px]">심볼</th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider min-w-[140px]">진입일시</th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider min-w-[140px]">청산일시</th>
                  <th className="px-4 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider min-w-[90px]">방향</th>
                  <th className="px-4 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider min-w-[70px]">배율</th>
                  <th className="px-4 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider min-w-[120px]">사이즈</th>
                  <th className="px-4 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider min-w-[100px]">진입가</th>
                  <th className="px-4 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider min-w-[100px]">청산가</th>
                  <th className="px-4 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider bg-yellow-50 min-w-[110px]">PNL</th>
                  <th className="px-4 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider bg-green-50 min-w-[90px]">ROI</th>
                  <th className="px-4 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider min-w-[90px]">수수료</th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider min-w-[200px]">진입근거</th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider min-w-[200px]">청산근거</th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider min-w-[100px]">진입감정</th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider min-w-[100px]">청산감정</th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider bg-blue-50 min-w-[250px]">교훈</th>
                  <th className="px-4 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider min-w-[100px]">작업</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {/* 새 행 추가 - 제일 위에 표시 */}
                {isAddingRow && (
                  <tr className="bg-blue-50 border-2 border-blue-300">
                    <td className="px-4 py-4 text-sm font-bold text-gray-900">{records.length + 1}</td>

                    <td className="px-4 py-4">
                      <select
                        value={newRecord.symbol}
                        onChange={(e) => setNewRecord({ ...newRecord, symbol: e.target.value as any })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-1 focus:ring-blue-500 font-semibold"
                      >
                        <option>BTC/USDT</option>
                        <option>ETH/USDT</option>
                        <option>SOL/USDT</option>
                        <option>XRP/USDT</option>
                        <option>BNB/USDT</option>
                      </select>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <input
                        type="date"
                        value={newRecord.entryDateTime}
                        onChange={(e) => setNewRecord({ ...newRecord, entryDateTime: e.target.value })}
                        className="min-w-[140px] px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-1 focus:ring-blue-500"
                      />
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <input
                        type="date"
                        value={newRecord.exitDateTime}
                        onChange={(e) => setNewRecord({ ...newRecord, exitDateTime: e.target.value })}
                        className="min-w-[140px] px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-1 focus:ring-blue-500"
                      />
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <select
                        value={newRecord.positionDirection}
                        onChange={(e) => setNewRecord({ ...newRecord, positionDirection: e.target.value as 'LONG' | 'SHORT' })}
                        className="min-w-[90px] px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-1 focus:ring-blue-500 font-semibold"
                      >
                        <option>LONG</option>
                        <option>SHORT</option>
                      </select>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <select
                        value={newRecord.leverage}
                        onChange={(e) => setNewRecord({ ...newRecord, leverage: parseInt(e.target.value) })}
                        className="min-w-[70px] px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-1 focus:ring-blue-500"
                      >
                        {Array.from({ length: 50 }, (_, i) => i + 1).map(num => (
                          <option key={num} value={num}>{num}x</option>
                        ))}
                      </select>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 justify-end">
                        <input
                          type="number"
                          step="0.01"
                          value={newRecord.positionSize}
                          onChange={(e) => setNewRecord({ ...newRecord, positionSize: parseFloat(e.target.value) })}
                          className="w-20 px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 rounded-lg text-right focus:ring-1 focus:ring-blue-500"
                          placeholder="0.5"
                        />
                        <span className="text-xs text-gray-600 font-medium">{getSymbolCoin(newRecord.symbol || 'BTC/USDT')}</span>
                      </div>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        value={newRecord.entryPrice}
                        onChange={(e) => setNewRecord({ ...newRecord, entryPrice: parseFloat(e.target.value) })}
                        className="min-w-[100px] px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 rounded-lg text-right focus:ring-1 focus:ring-blue-500"
                        placeholder="95000"
                      />
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        value={newRecord.exitPrice}
                        onChange={(e) => setNewRecord({ ...newRecord, exitPrice: parseFloat(e.target.value) })}
                        className="min-w-[100px] px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 rounded-lg text-right focus:ring-1 focus:ring-blue-500"
                        placeholder="96500"
                      />
                    </td>

                    <td className={`px-4 py-4 text-right font-bold whitespace-nowrap ${
                      currentPnlRoi.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {currentPnlRoi.pnl >= 0 ? '+' : ''}${currentPnlRoi.pnl.toFixed(2)}
                    </td>

                    <td className={`px-4 py-4 text-right font-bold whitespace-nowrap ${
                      currentPnlRoi.roi >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {currentPnlRoi.roi >= 0 ? '+' : ''}{currentPnlRoi.roi.toFixed(2)}%
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        step="0.01"
                        value={newRecord.roundTripFee}
                        onChange={(e) => setNewRecord({ ...newRecord, roundTripFee: parseFloat(e.target.value) })}
                        className="min-w-[90px] px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 rounded-lg text-right focus:ring-1 focus:ring-blue-500"
                        placeholder="47.88"
                      />
                    </td>

                    <td className="px-4 py-4">
                      <textarea
                        value={newRecord.entryReason}
                        onChange={(e) => setNewRecord({ ...newRecord, entryReason: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-1 focus:ring-blue-500"
                        placeholder="진입 근거"
                        rows={2}
                      />
                    </td>

                    <td className="px-4 py-4">
                      <textarea
                        value={newRecord.exitReason}
                        onChange={(e) => setNewRecord({ ...newRecord, exitReason: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-1 focus:ring-blue-500"
                        placeholder="청산 근거"
                        rows={2}
                      />
                    </td>

                    <td className="px-4 py-4">
                      <input
                        type="text"
                        value={newRecord.entryEmotion}
                        onChange={(e) => setNewRecord({ ...newRecord, entryEmotion: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-1 focus:ring-blue-500"
                        placeholder="감정"
                      />
                    </td>

                    <td className="px-4 py-4">
                      <input
                        type="text"
                        value={newRecord.exitEmotion}
                        onChange={(e) => setNewRecord({ ...newRecord, exitEmotion: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-1 focus:ring-blue-500"
                        placeholder="감정"
                      />
                    </td>

                    <td className="px-4 py-4">
                      <textarea
                        value={newRecord.lessonLearned}
                        onChange={(e) => setNewRecord({ ...newRecord, lessonLearned: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-1 focus:ring-blue-500"
                        placeholder="교훈"
                        rows={2}
                      />
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={handleAddRecord}
                          className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-lg"
                        >
                          저장
                        </button>
                        <button
                          onClick={() => setIsAddingRow(false)}
                          className="px-4 py-2 bg-gray-400 text-white text-sm font-semibold rounded-lg hover:bg-gray-500 transition-colors"
                        >
                          취소
                        </button>
                      </div>
                    </td>
                  </tr>
                )}

                {filteredRecords.map((record, index) => {
                  const isEditing = editingId === record.id;
                  const currentRecord = isEditing && editingRecord ? editingRecord : record;

                  return (
                    <tr key={record.id} className={`${isEditing ? 'bg-blue-50' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors`}>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">{record.no}</td>

                      <td className="px-4 py-4">
                        {isEditing ? (
                          <select
                            value={currentRecord.symbol}
                            onChange={(e) => setEditingRecord({ ...editingRecord!, symbol: e.target.value as any })}
                            className="w-full px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 rounded focus:ring-1 focus:ring-blue-500 font-medium"
                          >
                            <option>BTC/USDT</option>
                            <option>ETH/USDT</option>
                            <option>SOL/USDT</option>
                            <option>XRP/USDT</option>
                            <option>BNB/USDT</option>
                          </select>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-blue-600 text-white">
                            {record.symbol.split('/')[0]}
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-4 text-sm text-gray-900 font-medium whitespace-nowrap">
                        {isEditing ? (
                          <input
                            type="date"
                            value={currentRecord.entryDateTime.slice(0, 10)}
                            onChange={(e) => setEditingRecord({ ...editingRecord!, entryDateTime: e.target.value + 'T00:00' })}
                            className="min-w-[140px] px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-1 focus:ring-blue-500"
                          />
                        ) : (
                          new Date(record.entryDateTime).toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                          }).replace(/\.\s/g, '/').replace(/\.$/, '')
                        )}
                      </td>

                      <td className="px-4 py-4 text-sm text-gray-900 font-medium whitespace-nowrap">
                        {isEditing ? (
                          <input
                            type="date"
                            value={currentRecord.exitDateTime.slice(0, 10)}
                            onChange={(e) => setEditingRecord({ ...editingRecord!, exitDateTime: e.target.value + 'T00:00' })}
                            className="min-w-[140px] px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-1 focus:ring-blue-500"
                          />
                        ) : (
                          new Date(record.exitDateTime).toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                          }).replace(/\.\s/g, '/').replace(/\.$/, '')
                        )}
                      </td>

                      <td className="px-4 py-4 text-center whitespace-nowrap">
                        {isEditing ? (
                          <select
                            value={currentRecord.positionDirection}
                            onChange={(e) => setEditingRecord({ ...editingRecord!, positionDirection: e.target.value as 'LONG' | 'SHORT' })}
                            className="w-full min-w-[90px] px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-1 focus:ring-blue-500 font-semibold"
                          >
                            <option>LONG</option>
                            <option>SHORT</option>
                          </select>
                        ) : (
                          <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold ${
                            record.positionDirection === 'LONG'
                              ? 'bg-green-100 text-green-800 border border-green-200'
                              : 'bg-red-100 text-red-800 border border-red-200'
                          }`}>
                            {record.positionDirection}
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-4 text-center text-sm font-semibold text-gray-900 whitespace-nowrap">
                        {isEditing ? (
                          <select
                            value={currentRecord.leverage}
                            onChange={(e) => setEditingRecord({ ...editingRecord!, leverage: parseInt(e.target.value) })}
                            className="w-full min-w-[70px] px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-1 focus:ring-blue-500"
                          >
                            {Array.from({ length: 50 }, (_, i) => i + 1).map(num => (
                              <option key={num} value={num}>{num}x</option>
                            ))}
                          </select>
                        ) : (
                          `${record.leverage}x`
                        )}
                      </td>

                      <td className="px-4 py-4 text-right text-sm font-semibold text-gray-900 whitespace-nowrap">
                        {isEditing ? (
                          <div className="flex items-center gap-2 justify-end">
                            <input
                              type="number"
                              step="0.01"
                              value={currentRecord.positionSize}
                              onChange={(e) => setEditingRecord({ ...editingRecord!, positionSize: parseFloat(e.target.value) })}
                              className="w-20 px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 rounded-lg text-right focus:ring-1 focus:ring-blue-500"
                            />
                            <span className="text-xs text-gray-500 font-medium">{getSymbolCoin(currentRecord.symbol)}</span>
                          </div>
                        ) : (
                          `${record.positionSize} ${getSymbolCoin(record.symbol)}`
                        )}
                      </td>

                      <td className="px-4 py-4 text-right text-sm font-semibold text-gray-900 whitespace-nowrap">
                        {isEditing ? (
                          <input
                            type="number"
                            value={currentRecord.entryPrice}
                            onChange={(e) => setEditingRecord({ ...editingRecord!, entryPrice: parseFloat(e.target.value) })}
                            className="min-w-[100px] px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 rounded-lg text-right focus:ring-1 focus:ring-blue-500"
                          />
                        ) : (
                          `$${record.entryPrice.toLocaleString()}`
                        )}
                      </td>

                      <td className="px-4 py-4 text-right text-sm font-semibold text-gray-900 whitespace-nowrap">
                        {isEditing ? (
                          <input
                            type="number"
                            value={currentRecord.exitPrice}
                            onChange={(e) => setEditingRecord({ ...editingRecord!, exitPrice: parseFloat(e.target.value) })}
                            className="min-w-[100px] px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 rounded-lg text-right focus:ring-1 focus:ring-blue-500"
                          />
                        ) : (
                          `$${record.exitPrice.toLocaleString()}`
                        )}
                      </td>

                      <td className={`px-4 py-4 text-right font-bold whitespace-nowrap ${
                        record.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {record.pnl >= 0 ? '+' : ''}${record.pnl.toFixed(2)}
                      </td>

                      <td className={`px-4 py-4 text-right font-bold whitespace-nowrap ${
                        record.roi >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {record.roi >= 0 ? '+' : ''}{record.roi.toFixed(2)}%
                      </td>

                      <td className="px-4 py-4 text-right text-sm font-medium text-gray-900 whitespace-nowrap">
                        {isEditing ? (
                          <input
                            type="number"
                            step="0.01"
                            value={currentRecord.roundTripFee}
                            onChange={(e) => setEditingRecord({ ...editingRecord!, roundTripFee: parseFloat(e.target.value) })}
                            className="min-w-[90px] px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 rounded-lg text-right focus:ring-1 focus:ring-blue-500"
                          />
                        ) : (
                          `$${record.roundTripFee.toFixed(2)}`
                        )}
                      </td>

                      <td className="px-4 py-4">{renderTextField(record, 'entryReason', '진입 근거를 입력하세요')}</td>
                      <td className="px-4 py-4">{renderTextField(record, 'exitReason', '청산 근거를 입력하세요')}</td>
                      <td className="px-4 py-4">{renderTextField(record, 'entryEmotion', '감정')}</td>
                      <td className="px-4 py-4">{renderTextField(record, 'exitEmotion', '감정')}</td>
                      <td className="px-4 py-4">{renderTextField(record, 'lessonLearned', '교훈을 입력하세요')}</td>

                      <td className="px-4 py-4">
                        {isEditing ? (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={handleSaveEdit}
                              className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                              title="저장"
                            >
                              <CheckIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="p-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors shadow-sm"
                              title="취소"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEditRecord(record)}
                              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                              title="수정"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteRecord(record.id)}
                              className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                              title="삭제"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}

                {/* 새 행 추가 */}
                {isAddingRow && (
                  <tr className="bg-blue-50 border-2 border-blue-300">
                    <td className="px-4 py-4 text-sm font-bold text-gray-900">{records.length + 1}</td>

                    <td className="px-4 py-4">
                      <select
                        value={newRecord.symbol}
                        onChange={(e) => setNewRecord({ ...newRecord, symbol: e.target.value as any })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-1 focus:ring-blue-500 font-semibold"
                      >
                        <option>BTC/USDT</option>
                        <option>ETH/USDT</option>
                        <option>SOL/USDT</option>
                        <option>XRP/USDT</option>
                        <option>BNB/USDT</option>
                      </select>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <input
                        type="date"
                        value={newRecord.entryDateTime}
                        onChange={(e) => setNewRecord({ ...newRecord, entryDateTime: e.target.value })}
                        className="min-w-[140px] px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-1 focus:ring-blue-500"
                      />
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <input
                        type="date"
                        value={newRecord.exitDateTime}
                        onChange={(e) => setNewRecord({ ...newRecord, exitDateTime: e.target.value })}
                        className="min-w-[140px] px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-1 focus:ring-blue-500"
                      />
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <select
                        value={newRecord.positionDirection}
                        onChange={(e) => setNewRecord({ ...newRecord, positionDirection: e.target.value as 'LONG' | 'SHORT' })}
                        className="min-w-[90px] px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-1 focus:ring-blue-500 font-semibold"
                      >
                        <option>LONG</option>
                        <option>SHORT</option>
                      </select>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <select
                        value={newRecord.leverage}
                        onChange={(e) => setNewRecord({ ...newRecord, leverage: parseInt(e.target.value) })}
                        className="min-w-[70px] px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-1 focus:ring-blue-500"
                      >
                        {Array.from({ length: 50 }, (_, i) => i + 1).map(num => (
                          <option key={num} value={num}>{num}x</option>
                        ))}
                      </select>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 justify-end">
                        <input
                          type="number"
                          step="0.01"
                          value={newRecord.positionSize}
                          onChange={(e) => setNewRecord({ ...newRecord, positionSize: parseFloat(e.target.value) })}
                          className="w-20 px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 rounded-lg text-right focus:ring-1 focus:ring-blue-500"
                          placeholder="0.5"
                        />
                        <span className="text-xs text-gray-600 font-medium">{getSymbolCoin(newRecord.symbol || 'BTC/USDT')}</span>
                      </div>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        value={newRecord.entryPrice}
                        onChange={(e) => setNewRecord({ ...newRecord, entryPrice: parseFloat(e.target.value) })}
                        className="min-w-[100px] px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 rounded-lg text-right focus:ring-1 focus:ring-blue-500"
                        placeholder="95000"
                      />
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        value={newRecord.exitPrice}
                        onChange={(e) => setNewRecord({ ...newRecord, exitPrice: parseFloat(e.target.value) })}
                        className="min-w-[100px] px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 rounded-lg text-right focus:ring-1 focus:ring-blue-500"
                        placeholder="96500"
                      />
                    </td>

                    <td className={`px-4 py-4 text-right font-bold whitespace-nowrap ${
                      currentPnlRoi.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {currentPnlRoi.pnl >= 0 ? '+' : ''}${currentPnlRoi.pnl.toFixed(2)}
                    </td>

                    <td className={`px-4 py-4 text-right font-bold whitespace-nowrap ${
                      currentPnlRoi.roi >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {currentPnlRoi.roi >= 0 ? '+' : ''}{currentPnlRoi.roi.toFixed(2)}%
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        step="0.01"
                        value={newRecord.roundTripFee}
                        onChange={(e) => setNewRecord({ ...newRecord, roundTripFee: parseFloat(e.target.value) })}
                        className="min-w-[90px] px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 rounded-lg text-right focus:ring-1 focus:ring-blue-500"
                        placeholder="47.88"
                      />
                    </td>

                    <td className="px-4 py-4">
                      <textarea
                        value={newRecord.entryReason}
                        onChange={(e) => setNewRecord({ ...newRecord, entryReason: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-1 focus:ring-blue-500"
                        placeholder="진입 근거"
                        rows={2}
                      />
                    </td>

                    <td className="px-4 py-4">
                      <textarea
                        value={newRecord.exitReason}
                        onChange={(e) => setNewRecord({ ...newRecord, exitReason: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-1 focus:ring-blue-500"
                        placeholder="청산 근거"
                        rows={2}
                      />
                    </td>

                    <td className="px-4 py-4">
                      <input
                        type="text"
                        value={newRecord.entryEmotion}
                        onChange={(e) => setNewRecord({ ...newRecord, entryEmotion: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-1 focus:ring-blue-500"
                        placeholder="감정"
                      />
                    </td>

                    <td className="px-4 py-4">
                      <input
                        type="text"
                        value={newRecord.exitEmotion}
                        onChange={(e) => setNewRecord({ ...newRecord, exitEmotion: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-1 focus:ring-blue-500"
                        placeholder="감정"
                      />
                    </td>

                    <td className="px-4 py-4">
                      <textarea
                        value={newRecord.lessonLearned}
                        onChange={(e) => setNewRecord({ ...newRecord, lessonLearned: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-1 focus:ring-blue-500"
                        placeholder="교훈"
                        rows={2}
                      />
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={handleAddRecord}
                          className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-lg"
                        >
                          저장
                        </button>
                        <button
                          onClick={() => setIsAddingRow(false)}
                          className="px-4 py-2 bg-gray-400 text-white text-sm font-semibold rounded-lg hover:bg-gray-500 transition-colors"
                        >
                          취소
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TradingJournalPage;
