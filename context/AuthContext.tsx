// /context/AuthContext.tsx

"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// 사용자 정보의 타입을 정의합니다.
interface User {
  id: number;
  nickname: string;
  profileImage: string;
}

// Context가 가지게 될 값들의 타입을 정의합니다.
interface AuthContextType {
  user: User | null;
  login: (userData: any) => void;
  logout: () => void;
}

// Context를 생성합니다.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Context를 제공하는 Provider 컴포넌트를 만듭니다.
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // 페이지가 로드될 때 로컬 스토리지에서 사용자 정보를 가져옵니다.
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (kakaoUser: any) => {
    const newUser: User = {
      id: kakaoUser.id,
      nickname: kakaoUser.kakao_account.profile.nickname,
      profileImage: kakaoUser.kakao_account.profile.profile_image_url,
    };
    localStorage.setItem('user', JSON.stringify(newUser)); // 브라우저에 사용자 정보 저장
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('user'); // 브라우저에서 사용자 정보 삭제
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 다른 컴포넌트에서 쉽게 Context를 사용할 수 있게 해주는 Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
