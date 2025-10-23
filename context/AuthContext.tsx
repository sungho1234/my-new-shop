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

// [수정 1] Vercel 빌드 에러 해결을 위해 User 타입에 email 속성 추가
interface User {
    id: number;
    nickname: string;
    profileImage: string;
    email?: string; // Header.tsx에서 사용하는 email 속성을 optional로 추가
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
        // 이 부분은 브라우저 환경에서만 실행되므로 안전합니다.
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

    // [수정 2] login 함수에 email 정보 저장을 추가하여 빌드 에러 방지
    const login = (kakaoUser: any) => {
        const newUser: User = {
            id: kakaoUser.id,
            nickname: kakaoUser.kakao_account.profile.nickname,
            profileImage: kakaoUser.kakao_account.profile.profile_image_url,
            email: kakaoUser.kakao_account.email, // email 정보 추가
        };
        localStorage.setItem('user', JSON.stringify(newUser));
        setUser(newUser);
    };

    // [수정 3] 로그아웃 시 찜 목록(wishlist) 데이터는 삭제하지 않도록 원상 복구
    const logout = () => {
        localStorage.removeItem('user'); // user 정보만 삭제
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
