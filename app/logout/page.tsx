'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const LogoutPage = () => {
    const { logout } = useAuth();
    const router = useRouter();
    // 이 페이지의 로직이 단 한 번만 실행되도록 보장하는 '잠금 장치'입니다.
    const hasLoggedOut = useRef(false);

    useEffect(() => {
        // 이 useEffect 훅이 여러 번 실행되더라도, 실제 로그아웃 로직은 단 한 번만 실행됩니다.
        if (!hasLoggedOut.current) {
            // 1. 즉시 '실행됨' 상태로 변경하여 중복 실행을 막습니다.
            hasLoggedOut.current = true;

            // 2. Context의 logout 함수를 호출하여 상태와 localStorage를 깨끗하게 정리합니다.
            logout();

            // 3. 사용자에게 로그아웃 완료를 알립니다.
            alert('정상적으로 로그아웃 되었습니다.');

            // 4. 메인 페이지로 이동합니다. (뒤로가기 시 다시 로그아웃 페이지로 오는 것을 방지)
            router.replace('/');
        }
    }, [logout, router]);

    // 사용자가 보게 될 로딩 메시지 화면입니다.
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#f3f4f6',
            color: '#4b5563'
        }}>
            <p>로그아웃 처리 중입니다...</p>
        </div>
    );
};

export default LogoutPage;
