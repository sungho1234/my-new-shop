"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/70 backdrop-blur-[10px]">
      <div className="container mx-auto px-4">
        {/* 1단: 로고와 로그인 버튼 (부드러운 여백 변경을 위해 transition 추가) */}
        <div className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? 'py-4' : 'py-8'}`}>
          <h1 className="text-2xl font-bold text-black">
            <Link href="/">MAXX Systems</Link>
          </h1>
          <div className="hidden items-center space-x-6 text-sm text-gray-600 md:flex">
            <Link href="/login" className="rounded-md border px-4 py-2 hover:bg-gray-100">
                로그인
            </Link>
          </div>
        </div>
        
        {/* --- 2단: 네비게이션 메뉴 (애니메이션 방식 변경) --- */}
        <div 
          className={`overflow-hidden transition-all duration-300 ease-in-out ${isScrolled ? 'max-h-0 opacity-0' : 'max-h-20 opacity-100'}`}
        >
          <nav className="flex items-center space-x-6 pb-4 text-sm font-semibold text-gray-800">
            <Link href="#" className="hover:text-black">트레이딩 시스템</Link>
            <Link href="#" className="hover:text-black">퀀트 전략</Link>
            <Link href="#" className="hover:text-black">챌린지</Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;