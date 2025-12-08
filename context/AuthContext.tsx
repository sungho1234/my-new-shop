'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export interface Product {
  id: string; // 상품 ID (예: 'maxx-quant-v4')
  title: string;
  author: string;
  price: string;
  thumbnail: string;
  hidden?: boolean; // 메인페이지에서 숨김 여부
}

export interface WishlistItem {
  id: string; // DB의 CUID
  productId: string; // 상품 ID (예: 'maxx-quant-v4')
  userId: string; // DB의 User CUID
  createdAt?: Date; // 옵션
}

export interface Purchase {
  id: string; // DB의 CUID
  productId: string; // 상품 ID
  amount: number; // 구매 금액
  userId: string; // DB의 User CUID
  createdAt: Date; // 구매 날짜
}

interface User {
  id: number; // 카카오 ID
  nickname: string;
  profileImage: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  login: (kakaoUser: any, accessToken?: string) => boolean; // 로그인 성공 여부 반환
  logout: () => void;
  wishlist: WishlistItem[];
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isLiked: (productId: string) => boolean;
  purchases: Purchase[];
  fetchPurchases: () => Promise<void>;
  isPurchased: (productId: string) => boolean;
  isLoadingPurchases: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoadingPurchases, setIsLoadingPurchases] = useState<boolean>(true); // 초기값 true로 시작
  const [isLoadingWishlist, setIsLoadingWishlist] = useState<boolean>(true); // 초기값 true로 시작
  // isLoading은 더 이상 사용하지 않음 - 페이지 전체 블로킹 방지
  const router = useRouter();

  // 1. 찜 목록 로드 헬퍼 (useCallback으로 안정화 – Hooks 규칙 준수)
  const fetchWishlist = useCallback(async (kakaoId: number) => {
    console.log("📋 fetchWishlist 호출: kakaoId =", kakaoId);
    setIsLoadingWishlist(true);
    try {
      const res = await fetch(`/api/wishlist?kakaoId=${kakaoId}`);
      if (!res.ok) throw new Error(`Failed to fetch wishlist: ${res.status}`);
      const data: WishlistItem[] = await res.json();
      setWishlist(data);
      console.log("✅ DB 찜 목록 로드 성공:", data.length, "개");
    } catch (err) {
      console.error("❌ DB 찜 목록 로드 실패:", err);
      setWishlist([]);
    } finally {
      setIsLoadingWishlist(false);
    }
  }, []); // 의존성 없음 – 안정적

  // 1-1. 구매내역 로드 헬퍼
  const fetchPurchasesInternal = useCallback(async (kakaoId: number) => {
    console.log("🛒 fetchPurchases 호출: kakaoId =", kakaoId);
    setIsLoadingPurchases(true);
    try {
      // 먼저 kakaoId로 userId를 찾아야 함
      const res = await fetch(`/api/purchases?kakaoId=${kakaoId}`);
      if (!res.ok) throw new Error(`Failed to fetch purchases: ${res.status}`);
      const data: Purchase[] = await res.json();
      setPurchases(data);
      console.log("✅ DB 구매내역 로드 성공:", data.length, "개");
    } catch (err) {
      console.error("❌ DB 구매내역 로드 실패:", err);
      setPurchases([]);
    } finally {
      setIsLoadingPurchases(false);
    }
  }, []);

  // 2. 초기 로드: localStorage에서 user 복원 (로그인 상태 유지)
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const loadedUser: User = JSON.parse(storedUser);
          console.log("🔄 localStorage에서 user 복원: ", loadedUser.nickname);
          setUser(loadedUser);
          // wishlist와 purchases는 아래 useEffect가 처리
        } else {
          // 로그인하지 않은 경우 로딩 상태 false로 변경
          setIsLoadingPurchases(false);
          setIsLoadingWishlist(false);
        }
      } catch (error) {
        console.error("❌ localStorage User 파싱 오류:", error);
        localStorage.removeItem('user'); // 손상된 데이터 삭제
        setIsLoadingPurchases(false);
        setIsLoadingWishlist(false);
      }
    };
    initAuth();
  }, []);

  // 3. user 변경 시 wishlist와 purchases 자동 로드 (로그인 후 동기화 – Hooks 안전)
  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        // 병렬로 빠르게 로드 (await 없이 백그라운드에서 실행)
        fetchWishlist(user.id);
        fetchPurchasesInternal(user.id);
      } else {
        setWishlist([]); // 로그아웃 시 초기화
        setPurchases([]);
        setIsLoadingPurchases(false);
        setIsLoadingWishlist(false);
      }
    };
    loadUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); // user만 의존성으로, fetchWishlist와 fetchPurchasesInternal은 useCallback으로 안정화되어 있음

  // 4. login 함수 (async 호출 제거 – setUser만, useEffect가 처리)
  const login = (kakaoUser: any, accessToken?: string): boolean => {
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
    // accessToken이 있으면 사용, 없으면 로컬 저장만
    if (accessToken) {
      fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`DB 로그인 실패: ${res.status}`);
          }
          return res.json();
        })
        .then((dbUser) => console.log("✅ DB 로그인/회원가입 성공:", dbUser?.nickname || '새 사용자 생성'))
        .catch((err) => console.error("❌ DB 로그인 실패:", err));
    } else {
      console.warn("⚠️ accessToken 없음 - DB 동기화 생략");
    }

    console.log("✅ login 성공: ", newUser.nickname);
    return true;
  };

  // 5. logout
  const logout = () => {
    console.log("🚪 logout 호출");
    localStorage.removeItem('user');
    setUser(null); // useEffect가 wishlist와 purchases 초기화
    router.push('/');
  };

  // 5-1. 구매내역 새로고침용 함수 (외부에서 호출 가능)
  const fetchPurchases = async () => {
    if (user) {
      await fetchPurchasesInternal(user.id);
    }
  };

  // 6. addToWishlist (낙관적 업데이트 적용)
  const addToWishlist = async (product: Product) => {
    if (!user) {
      console.warn("⚠️ addToWishlist: 로그인 필요");
      return;
    }
    console.log("❤️ addToWishlist: ", product.id);

    // 낙관적 업데이트: 즉시 UI 업데이트
    const tempItem: WishlistItem = {
      id: 'temp-' + Date.now(),
      productId: product.id,
      userId: user.id.toString(),
    };
    setWishlist(prev => [...prev, tempItem]);

    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kakaoId: user.id, product }),
      });
      if (!response.ok) throw new Error(`Add failed: ${response.status}`);
      await fetchWishlist(user.id); // DB에서 정확한 데이터로 재로드
      console.log("✅ 찜 추가 성공");
    } catch (error) {
      console.error("❌ 찜 추가 실패:", error);
      // 실패 시 롤백
      setWishlist(prev => prev.filter(item => item.id !== tempItem.id));
      throw error;
    }
  };

  // 7. removeFromWishlist (낙관적 업데이트 적용)
  const removeFromWishlist = async (productId: string) => {
    if (!user) {
      console.warn("⚠️ removeFromWishlist: 로그인 필요");
      return;
    }
    console.log("🗑️ removeFromWishlist: ", productId);

    // 낙관적 업데이트: 즉시 UI 업데이트
    const previousWishlist = [...wishlist];
    setWishlist(prev => prev.filter(item => item.productId !== productId));

    try {
      const response = await fetch(`/api/wishlist?kakaoId=${user.id}&productId=${productId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error(`Remove failed: ${response.status}`);
      console.log("✅ 찜 제거 성공");
    } catch (error) {
      console.error("❌ 찜 제거 실패:", error);
      // 실패 시 롤백
      setWishlist(previousWishlist);
      throw error;
    }
  };

  // 8. isLiked
  const isLiked = (productId: string) => {
    return wishlist.some((item) => item.productId === productId);
  };

  // 9. isPurchased - 이미 구매한 상품인지 확인
  const isPurchased = (productId: string) => {
    return purchases.some((item) => item.productId === productId);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isLiked,
    purchases,
    fetchPurchases,
    isPurchased,
    isLoadingPurchases,
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
