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

// [수정] User 인터페이스에 email 속성을 추가합니다.
interface User {
    id: number;
    nickname: string;
    profileImage: string;
    email?: string; // 카카오 API에서 이메일 정보가 선택 항목일 수 있으므로 '?'를 붙여 optional로 지정합니다.
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
            console.error("Failed to parse localStorage data", error);
        }
    }, []);

    // [수정] login 함수에서 email 정보도 함께 저장하도록 수정합니다.
    const login = (kakaoUser: any) => {
        const newUser: User = {
            id: kakaoUser.id,
            nickname: kakaoUser.kakao_account.profile.nickname,
            profileImage: kakaoUser.kakao_account.profile.profile_image_url,
            email: kakaoUser.kakao_account.email, // 이메일 정보 추가
        };
        localStorage.setItem('user', JSON.stringify(newUser));
        setUser(newUser);
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('wishlist'); 
        setWishlist([]);
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

    const value = { user, login, logout, wishlist, addToWishlist, removeFromWishlist, isLiked };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
