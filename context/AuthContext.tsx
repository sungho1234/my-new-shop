'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export interface Product {
  id: string; // 상품 ID (예: 'maxx-quant-v4')
  title: string;
  author: string;
  price: string;
  thumbnail: string;
}

export interface WishlistItem {
  id: string; // DB의 CUID
  productId: string; // 상품 ID (예: 'maxx-quant-v4')
  userId: string; // DB의 User CUID
  createdAt?: Date; // 옵션
}

interface User {
  id: number; // 카카오 ID
  nickname: string;
  profileImage: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  login: (kakaoUser: any) => boolean; // 로그인 성공 여부 반환
  logout: () => void;
  wishlist: WishlistItem[];
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isLiked: (productId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const router = useRouter();

  // 1. 찜 목록 로드 헬퍼 (useCallback으로 안정화 – Hooks 규칙 준수)
  const fetchWishlist = useCallback(async (kakaoId: number) => {
    console.log("📋 fetchWishlist 호출: kakaoId =", kakaoId);
    try {
      const res = await fetch(`/api/wishlist?kakaoId=${kakaoId}`);
      if (!res.ok) throw new Error(`Failed to fetch wishlist: ${res.status}`);
      const data: WishlistItem[] = await res.json();
      setWishlist(data);
      console.log("✅ DB 찜 목록 로드 성공:", data.length, "개");
    } catch (err) {
      console.error("❌ DB 찜 목록 로드 실패:", err);
      setWishlist([]);
    }
  }, []); // 의존성 없음 – 안정적

  // 2. 초기 로드: localStorage에서 user 복원 (로그인 상태 유지)
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const loadedUser: User = JSON.parse(storedUser);
        console.log("🔄 localStorage에서 user 복원: ", loadedUser.nickname);
        setUser(loadedUser);
        // wishlist는 아래 useEffect가 처리
      }
    } catch (error) {
      console.error("❌ localStorage User 파싱 오류:", error);
      localStorage.removeItem('user'); // 손상된 데이터 삭제
    }
  }, []);

  // 3. user 변경 시 wishlist 자동 로드 (로그인 후 동기화 – Hooks 안전)
  useEffect(() => {
    if (user) {
      fetchWishlist(user.id);
    } else {
      setWishlist([]); // 로그아웃 시 초기화
    }
  }, [user, fetchWishlist]); // user 의존성 추가

  // 4. login 함수 (async 호출 제거 – setUser만, useEffect가 처리)
  const login = (kakaoUser: any): boolean => {
    console.log("🔑 login 호출: kakaoUser =", kakaoUser);
    if (!kakaoUser || !kakaoUser.id) {
      console.error("❌ 카카오 ID 누락");
      alert("로그인에 필요한 정보가 없습니다. 다시 시도해주세요.");
      return false;
    }

    const nickname = kakaoUser?.kakao_account?.profile?.nickname ?? '사용자';
    const profileImage = kakaoUser?.kakao_account?.profile?.profile_image_url ?? '';
    const email = kakaoUser?.kakao_account?.email ?? '';

    const newUser: User = {
      id: kakaoUser.id,
      nickname,
      profileImage,
      email,
    };

    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser); // 이게 useEffect([user]) 트리거 → wishlist 로드

    // DB 동기화 (async – login 성공 여부에 영향 안 줌)
    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    })
      .then((res) => res.json())
      .then((dbUser) => console.log("✅ DB 로그인/회원가입 성공:", dbUser?.name || '새 사용자 생성'))
      .catch((err) => console.error("❌ DB 로그인 실패:", err));

    console.log("✅ login 성공: ", newUser.nickname);
    return true;
  };

  // 5. logout
  const logout = () => {
    console.log("🚪 logout 호출");
    localStorage.removeItem('user');
    setUser(null); // useEffect가 wishlist 초기화
    router.push('/');
  };

  // 6. addToWishlist (DB 후 재로드)
  const addToWishlist = async (product: Product) => {
    if (!user) {
      console.warn("⚠️ addToWishlist: 로그인 필요");
      return;
    }
    console.log("❤️ addToWishlist: ", product.id);
    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kakaoId: user.id, product }),
      });
      if (!response.ok) throw new Error(`Add failed: ${response.status}`);
      await fetchWishlist(user.id); // 재로드
      console.log("✅ 찜 추가 성공");
    } catch (error) {
      console.error("❌ 찜 추가 실패:", error);
      throw error; // 상위 (e.g., ProductDetail)로 에러 전파
    }
  };

  // 7. removeFromWishlist (DB 후 재로드)
  const removeFromWishlist = async (productId: string) => {
    if (!user) {
      console.warn("⚠️ removeFromWishlist: 로그인 필요");
      return;
    }
    console.log("🗑️ removeFromWishlist: ", productId);
    try {
      const response = await fetch(`/api/wishlist?kakaoId=${user.id}&productId=${productId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error(`Remove failed: ${response.status}`);
      await fetchWishlist(user.id); // 재로드
      console.log("✅ 찜 제거 성공");
    } catch (error) {
      console.error("❌ 찜 제거 실패:", error);
      throw error;
    }
  };

  // 8. isLiked
  const isLiked = (productId: string) => {
    return wishlist.some((item) => item.productId === productId);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isLiked,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
