'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';

const LogoutPage = () => {
    const { logout } = useAuth();
    // 이 페이지의 로직이 단 한 번만 실행되도록 보장하는 '잠금 장치'입니다.
    const hasLoggedOut = useRef(false);

    useEffect(() => {
        // 이 useEffect 훅이 여러 번 실행되더라도, 실제 로그아웃 로직은 단 한 번만 실행됩니다.
        if (!hasLoggedOut.current) {
            // 1. 즉시 '실행됨' 상태로 변경하여 중복 실행을 막습니다.
            hasLoggedOut.current = true;

            // 2. 즉시 실행 비동기 함수로 순차 처리
            (async () => {
                // 2-1. Context의 logout 함수를 호출하여 상태와 localStorage를 깨끗하게 정리합니다.
                await logout();

                // 2-2. 사용자에게 로그아웃 완료를 알립니다.
                alert('정상적으로 로그아웃 되었습니다.');

                // 2-3. alert 확인 후 메인 페이지로 이동하고 새로고침합니다.
                window.location.href = '/';
            })();
        }
    }, [logout]);

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
