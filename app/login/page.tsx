// app/login/page.tsx

"use client";

import React from 'react';
import Link from 'next/link';

// 기존 헤더/푸터 대신 메인 페이지와 동일한 컴포넌트를 불러옵니다.
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// 로고 SVG 컴포넌트
const Logo = () => (
  <svg width="34" height="24" viewBox="0 0 34 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.208.5h9.072v22.96H2.208V.5zm20.48 0h9.072v22.96h-9.072V.5z" stroke="#111" strokeWidth="1"/>
    <path d="M11.28 23.46V.5h9.112v23H11.28z" stroke="#111" strokeWidth="1"/>
  </svg>
);

const LoginPage = () => {
  return (
    // 페이지 전체를 감싸는 div 추가 (헤더, 메인, 푸터 구조를 위해)
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* 메인 콘텐츠 (로그인 박스) */}
      <main className="flex flex-grow items-center justify-center bg-gray-50 py-12">
        <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <div className="mb-6 flex justify-center">
            <Logo />
          </div>
          <h2 className="mb-8 text-xl font-semibold leading-relaxed text-gray-800">
            생각을 바꾸는 지식,<br/>상식을 벗어나세요
          </h2>
          <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-yellow-400 py-3 font-bold text-black transition hover:opacity-90">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 2c-5.523 0-10 3.582-10 8s4.477 8 10 8c1.373 0 2.68-.21 3.882-.587L18 19.5V16.3a8.82 8.82 0 002-4.3c0-4.418-4.477-8-10-8z"/></svg>
            카카오로 3초만에 시작하기
          </button>
          <div className="mt-6">
            <Link href="#" className="text-sm text-gray-500 hover:underline">
              또는 일반 로그인
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;