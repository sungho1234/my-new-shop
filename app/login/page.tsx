// /app/login/page.tsx

"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';

// 1. 제공해주신 JavaScript 키를 여기에 입력합니다.
const KAKAO_JAVASCRIPT_KEY = "7943adf01d59eb4d9b2343d093a9eb95";

const Logo = () => (
    <svg width="34" height="24" viewBox="0 0 34 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.208.5h9.072v22.96H2.208V.5zm20.48 0h9.072v22.96h-9.072V.5z" stroke="#111" strokeWidth="1"></path>
        <path d="M11.28 23.46V.5h9.112v23H11.28z" stroke="#111" strokeWidth="1"></path>
    </svg>
);

const LoginPage = () => {
    const { login } = useAuth();
    const router = useRouter();

    const initializeKakao = () => {
        // @ts-ignore
        if (window.Kakao && !window.Kakao.isInitialized()) {
            // @ts-ignore
            window.Kakao.init(KAKAO_JAVASCRIPT_KEY);
        }
    };

    const handleKakaoLogin = () => {
        // @ts-ignore
        if (!window.Kakao) {
            alert("카카오 SDK가 로드되지 않았습니다.");
            return;
        }

        // @ts-ignore
        window.Kakao.Auth.login({
            success: function (authObj: any) {
                // @ts-ignore
                window.Kakao.API.request({
                    url: '/v2/user/me',
                    success: function (res: any) {
                        login(res);
                        router.push('/');
                    },
                    fail: function (error: any) {
                        alert('사용자 정보 요청에 실패했습니다: ' + JSON.stringify(error));
                    },
                });
            },
            fail: function (err: any) {
                alert('카카오 로그인에 실패했습니다: ' + JSON.stringify(err));
            },
        });
    };

    return (
        <div className="flex min-h-screen flex-col">
            <Script
                src="https://developers.kakao.com/sdk/js/kakao.js"
                onLoad={initializeKakao}
            />

            <Header />
            <main className="flex flex-grow items-center justify-center bg-gray-50 py-12">
                <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm">
                    <div className="mb-6 flex justify-center"><Logo /></div>
                    <h2 className="mb-8 text-xl font-semibold leading-relaxed text-gray-800">
                        소수에게만 허락된 데이터<br/>Quantitative Trading Desk
                    </h2>

                    <button
                        onClick={handleKakaoLogin}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-yellow-400 py-3 font-bold text-black transition hover:opacity-90"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2c-5.523 0-10 3.582-10 8s4.477 8 10 8c1.373 0 2.68-.21 3.882-.587L18 19.5V16.3a8.82 8.82 0 002-4.3c0-4.418-4.477-8-10-8z"></path>
                        </svg>
                        카카오로 3초만에 시작하기
                    </button>
                    
                    <div className="mt-6">
                        <span className="text-sm text-gray-500">또는 일반 로그인</span>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default LoginPage;
