// /app/logout/page.tsx

"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const LogoutPage = () => {
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 이 페이지가 로드되면 즉시 우리 서비스의 로그아웃 처리를 실행합니다.
    logout(); 
    
    // 로그아웃 처리가 끝났음을 알리고, 메인 페이지로 이동시킵니다.
    alert('정상적으로 로그아웃 되었습니다.');
    router.push('/');
  }, [logout, router]);

  // 처리되는 동안 잠시 보여줄 화면입니다.
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
      <p>로그아웃 처리 중입니다...</p>
      <p>잠시 후 메인 페이지로 이동합니다.</p>
    </div>
  );
};

export default LogoutPage;
