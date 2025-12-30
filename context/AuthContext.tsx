'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

export interface Product {
  id: string; // 상품 ID (예: 'maxx-quant-v4')
  title: string;
  author: string;
  price: string;
  thumbnail: string;
  hidden?: boolean; // 메인페이지에서 숨김 여부
  duration?: string; // 수강 기간 (예: '365일 수강')
  maxStudents?: string; // 모집 인원 (예: '100명 모집')
  instructor?: string; // 강사/팀 정보 (예: '팀멘사')
  installment?: string; // 할부 정보 (예: '12개월 할부 시 원 666,666원')
  discount?: string; // 할인율 (예: '63%')
  originalPrice?: string; // 원가 (예: '총 3,000,000원')
  rating?: string; // 별점 (예: '5.0')
  reviewCount?: string; // 리뷰 수 (예: '33')
}

export interface WishlistItem {
  id: string; // DB의 CUID
  productId: string; // 상품 ID (예: 'maxx-quant-v4')
  userId: string; // DB의 User CUID
  createdAt?: Date; // 옵션
}

export interface CourseAccess {
  id: string; // DB의 CUID
  productId: string; // 상품 ID
  userId: string; // DB의 User CUID
  orderId: string | null; // 주문 ID
  grantedAt: Date; // 권한 부여 날짜
  expiresAt: Date | null; // 만료 날짜
  isActive: boolean; // 활성 여부
}

interface User {
  id: number; // 카카오 ID 또는 해시된 숫자
  dbId?: string; // DB의 실제 CUID (네이버/구글 로그인용)
  nickname: string;
  profileImage: string;
  email?: string;
  createdAt?: Date; // 가입일
}

interface AuthContextType {
  user: User | null;
  login: (kakaoUser: any, accessToken?: string) => boolean; // 로그인 성공 여부 반환
  logout: () => void;
  wishlist: WishlistItem[];
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isLiked: (productId: string) => boolean;
  courseAccess: CourseAccess[];
  fetchCourseAccess: () => Promise<void>;
  isPurchased: (productId: string) => boolean;
  isLoadingCourseAccess: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [courseAccess, setCourseAccess] = useState<CourseAccess[]>([]);
  const [isLoadingCourseAccess, setIsLoadingCourseAccess] = useState<boolean>(true); // 초기값 true로 시작
  const [isLoadingWishlist, setIsLoadingWishlist] = useState<boolean>(true); // 초기값 true로 시작
  // isLoading은 더 이상 사용하지 않음 - 페이지 전체 블로킹 방지
  const { data: session, status } = useSession(); // NextAuth 세션 체크

  // 1. 찜 목록 로드 헬퍼 (useCallback으로 안정화 – Hooks 규칙 준수)
  const fetchWishlist = useCallback(async (kakaoId: number, dbId?: string) => {
    console.log("📋 fetchWishlist 호출: kakaoId =", kakaoId, ", dbId =", dbId);
    setIsLoadingWishlist(true);
    try {
      // dbId가 있으면 userId로, 없으면 kakaoId로 조회
      const query = dbId ? `userId=${dbId}` : `kakaoId=${kakaoId}`;
      const res = await fetch(`/api/wishlist?${query}`);
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

  // 1-1. 강의 접근 권한 로드 헬퍼
  const fetchCourseAccessInternal = useCallback(async (kakaoId: number, dbId?: string) => {
    console.log("🎓 fetchCourseAccess 호출: kakaoId =", kakaoId, ", dbId =", dbId);
    setIsLoadingCourseAccess(true);
    try {
      // dbId가 있으면 userId로, 없으면 kakaoId로 조회
      const query = dbId ? `userId=${dbId}` : `kakaoId=${kakaoId}`;
      const res = await fetch(`/api/course-access/check?${query}`);
      if (!res.ok) throw new Error(`Failed to fetch course access: ${res.status}`);
      const data = await res.json();
      setCourseAccess(data.courses || []);
      console.log("✅ DB 강의 접근 권한 로드 성공:", data.courses?.length || 0, "개");
    } catch (err) {
      console.error("❌ DB 강의 접근 권한 로드 실패:", err);
      setCourseAccess([]);
    } finally {
      setIsLoadingCourseAccess(false);
    }
  }, []);

  // 2. 초기 로드: localStorage + NextAuth 세션 체크
  useEffect(() => {
    const initAuth = async () => {
      try {
        // NextAuth 세션이 있으면 email로 DB 조회
        if (status === 'authenticated' && session?.user?.email) {
          console.log("🔄 NextAuth 세션에서 user 복원:", session.user.email);

          // DB에서 email로 user 조회
          const response = await fetch(`/api/user?email=${encodeURIComponent(session.user.email)}`);
          if (response.ok) {
            const dbUser = await response.json();
            const nextAuthUser: User = {
              id: dbUser.hashedId, // 해시된 숫자 ID
              dbId: dbUser.dbId, // 실제 CUID
              nickname: dbUser.name || session.user.name || '사용자',
              profileImage: dbUser.image || session.user.image || '',
              email: dbUser.email,
              createdAt: dbUser.createdAt ? new Date(dbUser.createdAt) : undefined,
            };
            console.log("✅ NextAuth user 로드 성공:", nextAuthUser);
            setUser(nextAuthUser);
            localStorage.setItem('user', JSON.stringify(nextAuthUser));
            return;
          }
        }

        // NextAuth 세션이 없으면 localStorage 체크
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const loadedUser: User = JSON.parse(storedUser);
          console.log("🔄 localStorage에서 user 복원: ", loadedUser.nickname);
          setUser(loadedUser);
        } else {
          // 로그인하지 않은 경우
          setIsLoadingCourseAccess(false);
          setIsLoadingWishlist(false);
        }
      } catch (error) {
        console.error("❌ User 복원 오류:", error);
        localStorage.removeItem('user');
        setIsLoadingCourseAccess(false);
        setIsLoadingWishlist(false);
      }
    };

    if (status !== 'loading') {
      initAuth();
    }
  }, [session, status]);

  // 3. user 변경 시 wishlist와 courseAccess 자동 로드 (로그인 후 동기화 – Hooks 안전)
  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        // 병렬로 빠르게 로드 (await 없이 백그라운드에서 실행)
        fetchWishlist(user.id, user.dbId);
        fetchCourseAccessInternal(user.id, user.dbId);
      } else {
        setWishlist([]); // 로그아웃 시 초기화
        setCourseAccess([]);
        setIsLoadingCourseAccess(false);
        setIsLoadingWishlist(false);
      }
    };
    loadUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); // user만 의존성으로, fetchWishlist와 fetchCourseAccessInternal은 useCallback으로 안정화되어 있음

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

    console.log("📧 카카오에서 받은 이메일:", email);
    console.log("📦 kakao_account 전체:", kakaoUser?.kakao_account);

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
        .then(async (dbUser) => {
          console.log("✅ DB 로그인/회원가입 성공:", dbUser?.nickname || '새 사용자 생성');
          console.log("📧 DB에서 받은 이메일:", dbUser.email);
          console.log("📦 DB 전체 응답:", dbUser);

          // 카카오에서 이메일을 못 받았을 경우, DB에서 kakaoId로 조회해서 이메일 가져오기
          let finalEmail = dbUser.email || newUser.email;
          if (!finalEmail && kakaoUser.id) {
            try {
              const userResponse = await fetch(`/api/user?kakaoId=${kakaoUser.id}`);
              if (userResponse.ok) {
                const userData = await userResponse.json();
                finalEmail = userData.email || '';
                console.log("📧 DB에서 kakaoId로 조회한 이메일:", finalEmail);
              }
            } catch (error) {
              console.error("❌ DB에서 이메일 조회 실패:", error);
            }
          }

          // DB에서 받은 정보로 user 객체 업데이트 (email, createdAt 포함)
          const updatedUser: User = {
            ...newUser,
            email: finalEmail, // DB에서 받은 이메일 우선 사용
            createdAt: dbUser.createdAt ? new Date(dbUser.createdAt) : undefined,
          };
          console.log("🔄 업데이트된 user 객체:", updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
          setUser(updatedUser);
        })
        .catch((err) => console.error("❌ DB 로그인 실패:", err));
    } else {
      console.warn("⚠️ accessToken 없음 - DB 동기화 생략");
    }

    console.log("✅ login 성공: ", newUser.nickname);
    return true;
  };

  // 5. logout
  const logout = async () => {
    console.log("🚪 logout 호출");
    localStorage.removeItem('user');
    setUser(null); // useEffect가 wishlist와 purchases 초기화

    // NextAuth 세션도 종료
    if (session) {
      const { signOut } = await import('next-auth/react');
      await signOut({ redirect: false });
    }

    // router.push는 제거 - /logout 페이지에서 처리
  };

  // 5-1. 강의 접근 권한 새로고침용 함수 (외부에서 호출 가능)
  const fetchCourseAccess = async () => {
    if (user) {
      await fetchCourseAccessInternal(user.id, user.dbId);
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
      userId: user.dbId || user.id.toString(),
    };
    setWishlist(prev => [...prev, tempItem]);

    try {
      const body = user.dbId
        ? { userId: user.dbId, product }
        : { kakaoId: user.id, product };

      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error(`Add failed: ${response.status}`);
      await fetchWishlist(user.id, user.dbId); // DB에서 정확한 데이터로 재로드
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
      const query = user.dbId
        ? `userId=${user.dbId}&productId=${productId}`
        : `kakaoId=${user.id}&productId=${productId}`;

      const response = await fetch(`/api/wishlist?${query}`, {
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

  // 9. isPurchased - 이미 구매한 상품인지 확인 (강의 접근 권한이 있는지)
  const isPurchased = (productId: string) => {
    return courseAccess.some((item: CourseAccess) => item.productId === productId && item.isActive);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isLiked,
    courseAccess,
    fetchCourseAccess,
    isPurchased,
    isLoadingCourseAccess,
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
