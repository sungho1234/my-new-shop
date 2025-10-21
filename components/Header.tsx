// /components/Header.tsx

"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) setIsScrolled(true);
      else setIsScrolled(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoutClick = () => {
    // 1. 카카오 REST API 키는 환경변수에서 가져오는 것이 더 안전합니다. (선택사항)
    const KAKAO_REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY; 

    // 2. 고정된 주소 대신, 환경변수에서 현재 사이트의 기본 URL을 가져옵니다.
    const LOGOUT_REDIRECT_URI = `${process.env.NEXT_PUBLIC_BASE_URL}/logout`;

    if (!KAKAO_REST_API_KEY) {
        alert("카카오 REST API 키가 설정되지 않았습니다.");
        return;
    }

    const kakaoLogoutUrl = `https://kauth.kakao.com/oauth/logout?client_id=${KAKAO_REST_API_KEY}&logout_redirect_uri=${LOGOUT_REDIRECT_URI}`;
    
    window.location.href = kakaoLogoutUrl;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/70 backdrop-blur-[10px]">
      <div className="container mx-auto px-4">
        <div className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? 'py-4' : 'py-8'}`}>
          <h1 className="text-2xl font-bold text-black">
            <Link href="/">MAXX Systems</Link>
          </h1>
          <div className="hidden items-center space-x-6 text-sm text-gray-600 md:flex">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="font-semibold">{user.nickname}님</span>
                <button
                  onClick={handleLogoutClick}
                  className="rounded-md border px-4 py-2 hover:bg-gray-100"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <Link href="/login" className="rounded-md border px-4 py-2 hover:bg-gray-100">
                로그인
              </Link>
            )}
          </div>
        </div>
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
