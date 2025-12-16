"use client";

import Link from 'next/link';
import React, { useState } from 'react';

const FeaturedCourse = () => {
  const [showCopyPopup, setShowCopyPopup] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowCopyPopup(true);
      setTimeout(() => setShowCopyPopup(false), 2000);
    } catch (err) {
      console.error('클립보드 복사 실패:', err);
    }
  };

  return (
    <section className="w-full bg-black py-16">
      <div className="container mx-auto max-w-7xl px-4">
        <h2 className="text-2xl font-bold text-white mb-8">실시간 베스트 강의</h2>

        <div className="grid grid-cols-[3fr_1.3fr] gap-4">
          {/* 왼쪽: 강의 이미지 */}
          <div className="relative h-[480px]">
            <div className="relative overflow-hidden rounded-2xl h-full">
              <img
                src="/시스템썸넬후보1.png"
                alt="Featured Course"
                className="w-full h-full object-cover"
              />
              {/* 배지들 */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-2.5 py-1 text-xs font-bold bg-orange-500 text-white rounded-lg">
                  할인
                </span>
                <span className="px-2.5 py-1 text-xs font-bold border border-black text-black rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  VOD
                </span>
              </div>
              {/* 찜 버튼 */}
              <button className="absolute top-4 right-4 w-9 h-9 bg-black bg-opacity-50 rounded-full flex items-center justify-center hover:bg-opacity-70 transition">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* 오른쪽: 강의 정보 카드 (이미지와 같은 높이) */}
          <div className="bg-gray-900 rounded-2xl p-6 h-[480px] flex flex-col">
            <div className="flex-1 flex flex-col items-center text-center justify-center">
              {/* VOD 배지 */}
              <div className="flex items-center gap-2 mb-5">
                <span className="px-3 py-1.5 text-xs font-bold border border-black text-black rounded-full flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  VOD
                </span>
              </div>

              {/* 제목 */}
              <h3 className="text-lg font-bold text-white mb-4 leading-tight">
                매일 20만원씩 벌어오는 "시스템 트레이딩" 가이드
              </h3>

              {/* 담당사 */}
              <p className="text-gray-400 text-sm mb-4">maxx systems</p>

              {/* 별점 */}
              <div className="flex items-center gap-1 mb-5">
                <span className="text-yellow-500 text-sm">★★★★★</span>
                <span className="text-white font-medium text-sm ml-1">5.0 (27)</span>
              </div>

              {/* 공유하기 버튼 */}
              <div className="relative">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 text-gray-400 text-sm hover:text-white transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  공유하기
                </button>
                {showCopyPopup && (
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
                    이 페이지가 클립보드에 복사되었습니다.
                  </div>
                )}
              </div>
            </div>

            <div className="mt-auto">
              {/* 수강 정보 */}
              <div className="bg-gray-800 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>모집기간 2025년 12월 20일~2026년 1월 30일</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>365일 수강</span>
                  </div>
                  <span className="text-gray-600">|</span>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>49명 모집</span>
                  </div>
                </div>
              </div>

              {/* 자세히 보기 버튼 */}
              <Link href="/products/g1" className="w-full">
                <button className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base rounded-lg transition">
                  자세히 보기
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourse;
