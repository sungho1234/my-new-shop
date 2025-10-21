// /components/Header.tsx

"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation'; // useRouter를 다시 추가합니다.

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth(); // 원래 코드처럼 logout 함수를 가져옵니다.
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) setIsScrolled(true);
      else setIsScrolled(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 로그아웃 버튼 클릭 시 실행될 함수
  const handleLogoutClick = () => {
    const KAKAO_REST_API_KEY = "ecddb30378573c07b10d4d51a98e6b0a"; // 사용하시던 키
    let LOGOUT_REDIRECT_URI = "http://localhost:3000/logout"; // 기본값은 로컬 주소

    // 1. 현재 브라우저의 주소가 'localhost'가 아닌 경우 (즉, 배포된 사이트인 경우)
    if (window.location.hostname !== 'localhost') {
        // 로그아웃 후 돌아올 주소를 현재 사이트의 주소로 변경합니다.
        LOGOUT_REDIRECT_URI = `${window.location.origin}/logout`;
    }

    // 2. 카카오 로그아웃 페이지로 이동
    const kakaoLogoutUrl = `https://kauth.kakao.com/oauth/logout?client_id=${KAKAO_REST_API_KEY}&logout_redirect_uri=${LOGOUT_REDIRECT_URI}`;
    
    // 3. 우리 앱의 상태도 로그아웃 처리 (기존 로직 유지)
    logout(); 
    
    // 4. 카카오 로그아웃 페이지로 이동
    window.location.href = kakaoLogoutUrl;

    // 만약 카카오 로그아웃을 먼저 하지 않고 바로 홈으로 보내고 싶다면 아래 코드를 대신 사용하세요.
    // logout();
    // router.push('/');
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
