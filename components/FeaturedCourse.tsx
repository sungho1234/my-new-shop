"use client";

import Link from 'next/link';
import React from 'react';

const FeaturedCourse = () => {
  return (
    <section className="w-full bg-black py-16">
      <div className="container mx-auto max-w-7xl px-4">
        <h2 className="text-2xl font-bold text-white mb-8">실시간 베스트 강의</h2>

        <div className="grid md:grid-cols-[1.5fr_1fr] gap-6 items-center">
          {/* 왼쪽: 강의 이미지 */}
          <div className="relative h-[500px]">
            <div className="relative overflow-hidden rounded-lg h-full">
              <img
                src="/g1.png"
                alt="Featured Course"
                className="w-full h-full object-cover"
              />
              {/* 배지들 */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-2.5 py-1 text-xs font-bold bg-orange-500 text-white rounded-lg">
                  할인
                </span>
                <span className="px-2.5 py-1 text-xs font-bold border border-white text-white rounded-full flex items-center gap-1">
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

          {/* 오른쪽: 강의 정보 카드 */}
          <div className="bg-gray-800 rounded-xl p-6 h-[500px] flex flex-col justify-between">
            <div>
              {/* VOD 배지 */}
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2.5 py-1 text-xs font-bold border border-gray-600 text-white rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  VOD
                </span>
              </div>

              {/* 제목 */}
              <h3 className="text-xl font-bold text-white mb-3">
                상위 1% ICT 마스터가 알려주는 트<br/>레이딩 기법
              </h3>

              {/* 구분선 */}
              <div className="w-12 h-0.5 bg-white mb-3"></div>

              {/* 담당사 */}
              <p className="text-gray-400 text-xs mb-3">담당사</p>

              {/* 별점 */}
              <div className="flex items-center gap-1 mb-4">
                <span className="text-yellow-500 text-sm">⭐⭐⭐⭐⭐</span>
                <span className="text-white font-medium text-sm ml-2">5.0 (33)</span>
              </div>

              {/* 공유하기 버튼 */}
              <button className="flex items-center gap-2 text-white text-xs hover:text-gray-300 transition mb-4">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                공유하기
              </button>
            </div>

            <div>
              {/* 수강 정보 */}
              <div className="bg-gray-900 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>수강기간 무제한</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>365일 수강</span>
                  </div>
                  <span>|</span>
                  <div className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>100명 모집</span>
                  </div>
                </div>
              </div>

              {/* 자세히 보기 버튼 */}
              <Link href="/products/g1">
                <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg transition">
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
