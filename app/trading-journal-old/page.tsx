'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowLeftIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
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

const TradingJournalOldPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [records, setRecords] = useState<TradingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const [formData, setFormData] = useState<{
    symbol: 'BTC/USDT' | 'ETH/USDT' | 'SOL/USDT' | 'XRP/USDT' | 'BNB/USDT';
    entryDateTime: string;
    exitDateTime: string;
    positionDirection: 'LONG' | 'SHORT';
    leverage: number;
    positionSize: number;
    entryPrice: number;
    exitPrice: number;
    roundTripFee: number;
    entryReason: string;
    exitReason: string;
  }>({
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
  });

  // 숫자 포맷 함수
  const formatNumber = (num: number): string => {
    return Math.round(num).toLocaleString('en-US');
  };

  // PNL & ROI 계산
  const calculatePnlAndRoi = (
    symbol: string,
    direction: string,
    leverage: number,
    positionSize: number,
    entryPrice: number,
    exitPrice: number
  ) => {
    if (!positionSize || !entryPrice || !exitPrice) {
      return { pnl: 0, roi: 0 };
    }

    const priceDiff = direction === 'LONG'
      ? exitPrice - entryPrice
      : entryPrice - exitPrice;

    const pnl = positionSize * priceDiff;
    const investment = (entryPrice * positionSize) / leverage;
    const roi = investment > 0 ? (pnl / investment) * 100 : 0;

    return { pnl, roi };
  };

  // 현재 입력값으로 PNL/ROI 계산
  const currentPnlRoi = calculatePnlAndRoi(
    formData.symbol,
    formData.positionDirection,
    formData.leverage,
    formData.positionSize,
    formData.entryPrice,
    formData.exitPrice
  );

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

  // 거래 추가
  const handleAddRecord = async () => {
    if (!user) return;

    const { pnl, roi } = currentPnlRoi;

    const recordData = {
      kakaoId: user.id,
      no: records.length + 1,
      ...formData,
      entryDateTime: formData.entryDateTime + 'T00:00',
      exitDateTime: formData.exitDateTime + 'T00:00',
      pnl,
      roi,
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

        // 폼 초기화
        setFormData({
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
        });
        setIsAddingNew(false);
        alert('거래가 성공적으로 저장되었습니다!');
      } else {
        alert('거래 기록 저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error saving record:', error);
      alert('거래 기록 저장 중 오류가 발생했습니다.');
    }
  };

  // 거래 삭제
  const handleDeleteRecord = async (id: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/trading-records/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setRecords(records.filter(r => r.id !== id));
        alert('거래가 삭제되었습니다.');
      }
    } catch (error) {
      console.error('Error deleting record:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

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
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/trading-journal')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">거래 기록 관리</h1>
              <p className="text-sm text-gray-500 mt-1">매매 내역을 추가하고 관리하세요</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddingNew(!isAddingNew)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <PlusIcon className="w-4 h-4" />
            {isAddingNew ? '취소' : '새 거래 추가'}
          </button>
        </div>

        {/* 거래 추가 폼 */}
        {isAddingNew && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
            {/* 헤더 */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <h2 className="text-lg font-bold text-white">새 거래 추가</h2>
            </div>

            <div className="p-6">
              {/* 거래 정보 */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 pb-2 border-b">거래 정보</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1.5">심볼</label>
                    <select
                      value={formData.symbol}
                      onChange={(e) => setFormData({ ...formData, symbol: e.target.value as any })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option>BTC/USDT</option>
                      <option>ETH/USDT</option>
                      <option>SOL/USDT</option>
                      <option>XRP/USDT</option>
                      <option>BNB/USDT</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1.5">방향</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, positionDirection: 'LONG' })}
                        className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          formData.positionDirection === 'LONG'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        LONG
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, positionDirection: 'SHORT' })}
                        className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          formData.positionDirection === 'SHORT'
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        SHORT
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1.5">레버리지</label>
                    <select
                      value={formData.leverage}
                      onChange={(e) => setFormData({ ...formData, leverage: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {Array.from({ length: 50 }, (_, i) => i + 1).map(num => (
                        <option key={num} value={num}>{num}x</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1.5">포지션 사이즈</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.positionSize}
                      onChange={(e) => setFormData({ ...formData, positionSize: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.5"
                    />
                  </div>
                </div>
              </div>

              {/* 가격 정보 */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 pb-2 border-b">가격 정보</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1.5">진입가</label>
                    <input
                      type="number"
                      value={formData.entryPrice}
                      onChange={(e) => setFormData({ ...formData, entryPrice: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="95000"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1.5">청산가</label>
                    <input
                      type="number"
                      value={formData.exitPrice}
                      onChange={(e) => setFormData({ ...formData, exitPrice: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="96500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1.5">진입일시</label>
                    <input
                      type="date"
                      value={formData.entryDateTime}
                      onChange={(e) => setFormData({ ...formData, entryDateTime: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1.5">청산일시</label>
                    <input
                      type="date"
                      value={formData.exitDateTime}
                      onChange={(e) => setFormData({ ...formData, exitDateTime: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* 수수료 */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 pb-2 border-b">수수료</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1.5">왕복 수수료</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.roundTripFee}
                      onChange={(e) => setFormData({ ...formData, roundTripFee: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="47.88"
                    />
                  </div>
                </div>
              </div>

              {/* PNL & ROI 미리보기 */}
              <div className="grid grid-cols-2 gap-3 mb-6 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                <div className="text-center">
                  <div className="text-xs text-gray-600 mb-1">예상 PNL</div>
                  <div className={`text-xl font-bold ${currentPnlRoi.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {currentPnlRoi.pnl >= 0 ? '+' : ''}${formatNumber(currentPnlRoi.pnl)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-600 mb-1">예상 ROI</div>
                  <div className={`text-xl font-bold ${currentPnlRoi.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {currentPnlRoi.roi >= 0 ? '+' : ''}{currentPnlRoi.roi.toFixed(2)}%
                  </div>
                </div>
              </div>

              {/* 거래 분석 */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 pb-2 border-b">거래 분석</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1.5">진입 근거</label>
                    <textarea
                      value={formData.entryReason}
                      onChange={(e) => setFormData({ ...formData, entryReason: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      placeholder="진입 근거를 입력하세요"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1.5">청산 근거</label>
                    <textarea
                      value={formData.exitReason}
                      onChange={(e) => setFormData({ ...formData, exitReason: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      placeholder="청산 근거를 입력하세요"
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              {/* 저장 버튼 */}
              <div className="flex gap-2 pt-4 border-t">
                <button
                  onClick={handleAddRecord}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition-colors"
                >
                  저장하기
                </button>
                <button
                  onClick={() => setIsAddingNew(false)}
                  className="px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-md hover:bg-gray-200 transition-colors"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 거래 목록 */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">전체 거래 내역 ({records.length}개)</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {records.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">거래 내역이 없습니다</p>
                <p className="text-sm mt-2">첫 거래를 기록해보세요!</p>
              </div>
            ) : (
              records.map((record) => (
                <div key={record.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-500">#{record.no}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {record.symbol}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        record.positionDirection === 'LONG' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {record.positionDirection}
                      </span>
                      <span className="text-xs text-gray-500">{record.leverage}x</span>
                    </div>
                    <button
                      onClick={() => handleDeleteRecord(record.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">진입일시</div>
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(record.entryDateTime).toLocaleDateString('ko-KR')}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">진입가</div>
                      <div className="text-sm font-medium text-gray-900">
                        ${record.entryPrice.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">청산가</div>
                      <div className="text-sm font-medium text-gray-900">
                        ${record.exitPrice.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">포지션 사이즈</div>
                      <div className="text-sm font-medium text-gray-900">
                        {record.positionSize}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">PNL</div>
                      <div className={`text-lg font-bold ${record.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {record.pnl >= 0 ? '+' : ''}${formatNumber(record.pnl)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">ROI</div>
                      <div className={`text-lg font-bold ${record.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {record.roi >= 0 ? '+' : ''}{record.roi.toFixed(2)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">수수료</div>
                      <div className="text-sm font-medium text-gray-900">
                        ${formatNumber(record.roundTripFee)}
                      </div>
                    </div>
                  </div>

                  {(record.entryReason || record.exitReason) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                      {record.entryReason && (
                        <div>
                          <div className="text-xs font-medium text-gray-500 mb-1">진입 근거</div>
                          <div className="text-sm text-gray-700">{record.entryReason}</div>
                        </div>
                      )}
                      {record.exitReason && (
                        <div>
                          <div className="text-xs font-medium text-gray-500 mb-1">청산 근거</div>
                          <div className="text-sm text-gray-700">{record.exitReason}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TradingJournalOldPage;
