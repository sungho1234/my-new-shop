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

    // [수정 1] 페이지가 처음 로드될 때, user 정보와 함께 wishlist 정보도 localStorage에서 불러옵니다.
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        
        const storedWishlist = localStorage.getItem('wishlist');
        if (storedWishlist) {
            setWishlist(JSON.parse(storedWishlist));
        }
    }, []);

    const login = (kakaoUser: any) => {
        const newUser: User = {
            id: kakaoUser.id,
            nickname: kakaoUser.kakao_account.profile.nickname,
            profileImage: kakaoUser.kakao_account.profile.profile_image_url,
        };
        localStorage.setItem('user', JSON.stringify(newUser));
        setUser(newUser);
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
        router.push('/');
    };

    // [수정 2] 찜 목록에 상품을 추가할 때, localStorage에도 변경된 목록을 저장합니다.
    const addToWishlist = (product: Product) => {
        setWishlist((prev) => {
            const newWishlist = [...prev, product];
            localStorage.setItem('wishlist', JSON.stringify(newWishlist));
            return newWishlist;
        });
    };

    // [수정 3] 찜 목록에서 상품을 제거할 때, localStorage에도 변경된 목록을 저장합니다.
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
