'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface Product {
    id: string;
    title: string;
    author: string;
    price: string;
    thumbnail: string;
}

interface User {
    id: number;
    nickname: string;
    profileImage: string;
    email?: string;
}

interface AuthContextType {
    user: User | null;
    login: (userData: any) => void;
    logout: () => void;
    wishlist: Product[];
    addToWishlist: (product: Product) => void;
    removeFromWishlist: (productId: string) => void;
    isLiked: (productId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [wishlist, setWishlist] = useState<Product[]>([]);
    const router = useRouter();

    useEffect(() => {
        // --- 원본 코드 유지 ---
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
            
            const storedWishlist = localStorage.getItem('wishlist');
            if (storedWishlist) {
                setWishlist(JSON.parse(storedWishlist));
            }
        } catch (error) {
            console.error("localStorage 데이터 파싱 오류:", error);
        }
    }, []);

    // [수정 2] login 함수
    const login = (kakaoUser: any) => {
        const newUser: User = {
            id: kakaoUser.id,
            nickname: kakaoUser.kakao_account.profile.nickname,
            profileImage: kakaoUser.kakao_account.profile.profile_image_url,
            email: kakaoUser.kakao_account.email,
        };
        localStorage.setItem('user', JSON.stringify(newUser));
        setUser(newUser);

        // ▼▼▼▼▼ [핵심 추가] 이 코드가 '몰래' 실행됩니다 ▼▼▼▼▼
        // UI 변경 없이, 백그라운드에서 DB에 유저 정보를 저장/업데이트합니다.
        try {
          fetch('/api/auth/login', { // 3단계에서 만든 '비밀 사무실' 주소
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser), // 카카오에서 받은 정보를 그대로 DB로 전송
          })
          .then(response => {
            if (!response.ok) {
              console.error("DB 동기화 실패 (서버 응답):", response.statusText);
              return response.json().then(err => Promise.reject(err));
            }
            return response.json();
          })
          .then(dbUser => {
            console.log("DB에 유저 정보 동기화 성공:", dbUser.name);
          })
          .catch(error => {
            console.error("DB 동기화 fetch 요청 오류:", error);
            // DB 저장이 실패해도, 사용자는 이미 localStorage 기준으로 로그인됩니다.
          });
        } catch (error) {
           console.error("DB 동기화 fetch 요청 최상위 오류:", error);
        }
        // ▲▲▲▲▲ [핵심 추가] 여기까지 입니다 ▲▲▲▲▲
    };

    // --- 나머지 코드는 모두 원본 유지 ---
    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
        router.push('/');
    };

    const addToWishlist = (product: Product) => {
        setWishlist((prev) => {
            const newWishlist = [...prev, product];
            localStorage.setItem('wishlist', JSON.stringify(newWishlist));
            return newWishlist;
        });
    };

    const removeFromWishlist = (productId: string) => {
        setWishlist((prev) => {
            const newWishlist = prev.filter((item) => item.id !== productId);
            localStorage.setItem('wishlist', JSON.stringify(newWishlist));
            return newWishlist;
        });
    };

    const isLiked = (productId: string) => {
        return wishlist.some((item) => item.id === productId);
    };

    const value = {
        user,
        login,
        logout,
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isLiked,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};