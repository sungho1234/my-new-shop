// /components/Header.tsx

"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
// 1. useRouter는 더 이상 여기서 필요 없으므로 삭제해도 됩니다.

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth(); // 2. logout 함수는 여기서 호출하지 않으므로 user 정보만 가져옵니다.

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) setIsScrolled(true);
      else setIsScrolled(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 3. 로그아웃 버튼 클릭 시 카카오 로그아웃 페이지로 이동하는 함수
  const handleLogoutClick = () => {
    const KAKAO_REST_API_KEY = "ecddb30378573c07b10d4d51a98e6b0a"; // 1단계에서 확인한 REST API 키로 교체하세요!
    const LOGOUT_REDIRECT_URI = "http://localhost:3000/logout"; // 1단계에서 등록한 주소

    // 카카오 로그아웃 페이지 URL
    const kakaoLogoutUrl = `https://kauth.kakao.com/oauth/logout?client_id=${KAKAO_REST_API_KEY}&logout_redirect_uri=${LOGOUT_REDIRECT_URI}`;

    // 해당 URL로 페이지를 이동시킵니다.
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
                {/* 4. 버튼의 onClick 이벤트를 새로운 함수로 교체합니다. */}
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
