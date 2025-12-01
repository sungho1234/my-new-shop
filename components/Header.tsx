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
    const { user, logout, purchases, wishlist } = useAuth();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
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

    // 검색 기능
    const handleSearch = () => {
        if (searchQuery.trim()) {
            router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            router.push('/');
        }
    };

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };
    // ------------------------------------

    // --- 최종 수정된 JSX ---
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-md shadow-sm">
            <div className="container max-w-7xl mx-auto px-4">
                <div className={`flex items-center justify-between transition-all duration-300 ${isScrolled ? 'py-3' : 'py-5'}`}>
                    {/* ===== 로고 ===== */}
                    <Link href="/">
                        <h1 className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer">
                            MAXX Systems
                        </h1>
                    </Link>

                    {/* ===== 중앙 검색바 ===== */}
                    <div className="hidden lg:flex flex-1 max-w-md mx-8">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="배우고 싶은 강의를 검색하세요"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearchKeyDown}
                                className="w-full px-5 py-2.5 pl-12 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm"
                            />
                            <button
                                onClick={handleSearch}
                                className="absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer"
                            >
                                <svg
                                    className="w-5 h-5 text-gray-400 hover:text-blue-600 transition-colors"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* ===== 우측 버튼 그룹 ===== */}
                    <div className="hidden items-center md:flex gap-3">
                        {user ? (
                            <>
                                <Link
                                    href="/my-contents"
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                                >
                                    My콘텐츠
                                </Link>
                                <div ref={menuRef} className="relative">
                                    <button
                                        onClick={() => setIsMenuOpen(prev => !prev)}
                                        className="flex items-center gap-2 px-3 py-2 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        <MenuIcon />
                                        <UserIcon />
                                    </button>
                                    {isMenuOpen && (
                                        <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 z-10 overflow-hidden">
                                            {/* 사용자 정보 섹션 */}
                                            <div className="px-6 py-5 border-b border-gray-100">
                                                <p className="text-xs text-gray-500 mb-1">{user.email}</p>
                                                <div className="flex justify-between items-center">
                                                    <p className="text-lg font-bold text-gray-900">{user.nickname}</p>
                                                    <Link href="/my-contents?tab=my-info" className="text-xs border border-gray-300 rounded-md px-3 py-1.5 text-gray-600 hover:bg-gray-50 transition-colors">
                                                        정보수정하기
                                                    </Link>
                                                </div>
                                            </div>
                                            {/* 메뉴 리스트 */}
                                            <ul className="py-2">
                                                <li>
                                                    <Link href="/my-contents?tab=my-contents" className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50 transition-colors">
                                                        <span className="text-base font-medium text-gray-800">My콘텐츠</span>
                                                        <span className="text-sm text-gray-500">{purchases.length}개</span>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link href="/my-contents?tab=wishlist" className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50 transition-colors">
                                                        <span className="text-base font-medium text-gray-800">찜목록</span>
                                                        <span className="text-sm text-gray-500">{wishlist.length}개</span>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link href="/my-contents?tab=inquiry" className="block px-6 py-3.5 hover:bg-gray-50 transition-colors">
                                                        <span className="text-base font-medium text-gray-800">자주묻는질문</span>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link href="/coupon" className="block px-6 py-3.5 hover:bg-gray-50 transition-colors">
                                                        <span className="text-base font-medium text-gray-800">쿠폰 등록</span>
                                                    </Link>
                                                </li>
                                            </ul>
                                            {/* 로그아웃 */}
                                            <div className="border-t border-gray-100 px-6 py-3">
                                                <button onClick={handleLogoutClick} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                                                    로그아웃
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="px-6 py-2.5 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-sm"
                            >
                                로그인
                            </Link>
                        )}
                    </div>
                </div>

                {/* --- 스크롤 시 사라지는 하단 메뉴 --- */}
                <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isScrolled ? 'max-h-0 opacity-0' : 'max-h-16 opacity-100'}`}
                >
                    <nav className="flex items-center space-x-8 pb-4 text-sm font-medium text-gray-700 border-t border-gray-100 pt-4">
                        <Link href="/builder-start" className="hover:text-blue-600 transition-colors">빌더의 시작</Link>
                        <Link href="/system-strategy" className="hover:text-blue-600 transition-colors">시스템&전략</Link>
                        <Link href="/about" className="hover:text-blue-600 transition-colors">팀소개</Link>
                        <Link href="/" className="hover:text-blue-600 transition-colors">전체상품</Link>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;
