"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { signIn } from 'next-auth/react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';

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
    const [showMoreOptions, setShowMoreOptions] = useState(false);

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
                console.log("🔑 카카오 로그인 성공 - accessToken:", authObj.access_token);

                // @ts-ignore
                window.Kakao.API.request({
                    url: '/v2/user/me',
                    success: function (res: any) {
                        const loginSuccess = login(res, authObj.access_token);

                        if (loginSuccess) {
                            router.push('/');
                        } else {
                            console.error("AuthContext login failed, redirect cancelled.");
                        }
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

    const handleSocialLogin = async (provider: 'naver' | 'google') => {
        try {
            const result = await signIn(provider, {
                redirect: true,
                callbackUrl: '/'
            });
        } catch (error) {
            console.error(`${provider} 로그인 오류:`, error);
            alert('로그인에 실패했습니다. 다시 시도해주세요.');
        }
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

                    {/* 카카오 로그인 (항상 표시) */}
                    <button
                        onClick={handleKakaoLogin}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-yellow-400 py-3 font-bold text-black transition hover:opacity-90"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2c-5.523 0-10 3.582-10 8s4.477 8 10 8c1.373 0 2.68-.21 3.882-.587L18 19.5V16.3a8.82 8.82 0 002-4.3c0-4.418-4.477-8-10-8z"></path>
                        </svg>
                        카카오로 3초만에 시작하기
                    </button>

                    {/* 다른 로그인 옵션 토글 버튼 */}
                    <div className="mt-6">
                        <button
                            onClick={() => setShowMoreOptions(!showMoreOptions)}
                            className="text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center justify-center gap-1 mx-auto"
                        >
                            또는 일반 로그인
                            <svg
                                className={`w-4 h-4 transition-transform ${showMoreOptions ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>

                    {/* 네이버/구글 로그인 (토글) */}
                    <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            showMoreOptions ? 'max-h-40 opacity-100 mt-4' : 'max-h-0 opacity-0'
                        }`}
                    >
                        <div className="space-y-3">
                            {/* 네이버 로그인 */}
                            <button
                                onClick={() => handleSocialLogin('naver')}
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#03C75A] py-3 font-bold text-white transition hover:opacity-90"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16.273 12.845 7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727v12.845Z" />
                                </svg>
                                네이버로 시작하기
                            </button>

                            {/* 구글 로그인 */}
                            <button
                                onClick={() => handleSocialLogin('google')}
                                className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white py-3 font-bold text-gray-700 transition hover:bg-gray-50"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                                구글로 시작하기
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default LoginPage;
