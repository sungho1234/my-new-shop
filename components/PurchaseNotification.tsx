"use client";

import React, { useState, useEffect } from 'react';
import { ALL_PRODUCTS } from '@/data/products';

interface PurchaseNotice {
  id: number;
  userName: string;
  productTitle: string;
  timeAgo: string;
}

const PurchaseNotification: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // 더미 구매 알림 데이터 (실제로는 API에서 가져올 수 있음)
  const purchaseNotices: PurchaseNotice[] = [
    { id: 1, userName: '김**', productTitle: ALL_PRODUCTS[0].title, timeAgo: '방금 전' },
    { id: 2, userName: '이**', productTitle: ALL_PRODUCTS[1].title, timeAgo: '2분 전' },
    { id: 3, userName: '박**', productTitle: ALL_PRODUCTS[2].title, timeAgo: '5분 전' },
    { id: 4, userName: '최**', productTitle: ALL_PRODUCTS[3].title, timeAgo: '8분 전' },
    { id: 5, userName: '정**', productTitle: ALL_PRODUCTS[4].title, timeAgo: '12분 전' },
  ];

  // 3초마다 다음 알림으로 전환
  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % purchaseNotices.length);
        setIsVisible(true);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, [purchaseNotices.length]);

  const currentNotice = purchaseNotices[currentIndex];

  return (
    <div className="fixed bottom-6 left-6 z-40 max-w-sm">
      <div
        className={`
          bg-white rounded-lg shadow-lg border border-gray-200 p-4
          transition-all duration-300 transform
          ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}
        `}
      >
        <div className="flex items-start gap-3">
          {/* 아이콘 */}
          <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-5 h-5 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* 내용 */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 mb-1">
              실시간 구매 알림
            </p>
            <p className="text-xs text-gray-600 line-clamp-2 mb-1">
              <span className="font-medium">{currentNotice.userName}</span>님이{' '}
              <span className="font-medium text-primary-600">
                {currentNotice.productTitle.length > 30
                  ? currentNotice.productTitle.substring(0, 30) + '...'
                  : currentNotice.productTitle}
              </span>
              을(를) 구매했습니다
            </p>
            <p className="text-xs text-gray-400">{currentNotice.timeAgo}</p>
          </div>

          {/* 닫기 버튼 (선택사항) */}
          {/* <button
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            onClick={() => setIsVisible(false)}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default PurchaseNotification;
