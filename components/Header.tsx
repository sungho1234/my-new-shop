"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

// --- 아이콘 SVG 컴포넌트 (원본 유지) ---
const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
    </svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);
// ------------------------------------

const Header = () => {
    // --- 모든 훅과 함수는 원본 그대로 유지 ---
    const [isScrolled, setIsScrolled] = useState(false);
    const { user, logout } = useAuth();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) setIsScrolled(true);
            else setIsScrolled(false);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogoutClick = () => {
        const KAKAO_REST_API_KEY = "ecddb30378573c07b10d4d51a98e6b0a";
        let LOGOUT_REDIRECT_URI = "http://localhost:3000/logout";
        if (window.location.hostname !== 'localhost') {
            LOGOUT_REDIRECT_URI = `${window.location.origin}/logout`;
        }
        const kakaoLogoutUrl = `https://kauth.kakao.com/oauth/logout?client_id=${KAKAO_REST_API_KEY}&logout_redirect_uri=${LOGOUT_REDIRECT_URI}`;
        logout();
        window.location.href = kakaoLogoutUrl;
    };
    // ------------------------------------

    // --- 최종 수정된 JSX ---
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/70 backdrop-blur-[10px]">
            <div className="container mx-auto px-4">
                <div className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? 'py-4' : 'py-8'}`}>
                    {/* ===== 로고 (원본 유지) ===== */}
                    <h1 className="text-2xl font-bold text-black">
                        <Link href="/">MAXX Systems</Link>
                    </h1>

                    {/* ===== 버튼 그룹 (위치 조절을 위해 클래스 추가) ===== */}
                    <div className="hidden items-center md:flex"> {/* <-- 1. space-x-6, text-sm 등 불필요한 클래스 제거 */}
                        {user ? (
                            // =============================================================
                            // 2. 이 div에 ml-auto와 mr-*를 추가하여 위치를 제어합니다.
                            // =============================================================
                            <div className="flex items-center gap-2 ml-auto mr-40"> 
                                {/* 
                                    [위치 조절 포인트!]
                                    mr-20의 숫자를 바꾸면 버튼 그룹이 왼쪽으로 움직입니다.
                                    - 더 왼쪽으로: mr-24, mr-32 ...
                                    - 더 오른쪽으로: mr-16, mr-12 ...
                                */}
                                <Link href="/my-contents" className="bg-white text-black px-4 py-2 rounded-full text-base font-semibold border border-gray-300 hover:bg-gray-100 transition-colors">
                                    My콘텐츠
                                </Link>
                                <div ref={menuRef} className="relative">
                                    <button
                                        onClick={() => setIsMenuOpen(prev => !prev)}
                                        className="flex items-center gap-2 rounded-full border border-gray-300 bg-white text-black px-3 py-2 hover:bg-gray-100 transition-colors"
                                    >
                                        <MenuIcon />
                                        <UserIcon />
                                    </button>
                                    {isMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg border z-10">
                                            {/* 드롭다운 메뉴 내용은 모두 원본 유지 */}
                                            <div className="p-4 border-b">
                                                <p className="text-sm text-gray-500 truncate">{user.email}</p>
                                                <div className="flex justify-between items-center mt-1">
                                                    <p className="font-bold">{user.nickname}님</p>
                                                    <Link href="/profile/edit" className="text-xs border rounded px-2 py-1 text-gray-500 hover:bg-gray-100">
                                                        정보 수정
                                                    </Link>
                                                </div>
                                            </div>
                                            <ul className="py-1 text-sm">
                                                <li><Link href="/wishlist" className="block px-4 py-2 hover:bg-gray-100">찜목록</Link></li>
                                                <li><Link href="/faq" className="block px-4 py-2 hover:bg-gray-100">자주묻는질문</Link></li>
                                                <li><Link href="/coupon" className="block px-4 py-2 hover:bg-gray-100">쿠폰 등록</Link></li>
                                            </ul>
                                            <div className="border-t p-2">
                                                <button onClick={handleLogoutClick} className="w-full text-left text-sm text-red-500 rounded px-4 py-2 hover:bg-red-50">
                                                    로그아웃
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            // --- 로그아웃 상태 (원본 유지) ---
                            <Link href="/login" className="rounded-md border px-4 py-2 hover:bg-gray-100">
                                로그인
                            </Link>
                        )}
                    </div>
                </div>
                
                {/* --- 스크롤 시 사라지는 하단 메뉴 (원본 유지) --- */}
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
