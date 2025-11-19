'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ALL_PRODUCTS } from '@/data/products';

const BuilderStartPage = () => {
    // g1, g2, g3 상품 가져오기
    const g1 = ALL_PRODUCTS.find(p => p.id === 'first-guide');
    const g2 = ALL_PRODUCTS.find(p => p.id === 'system-builder');
    const g3 = ALL_PRODUCTS.find(p => p.id === 'growth-book');

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Main Content */}
            <main className="w-full pt-24 pb-20">
                <div className="max-w-4xl mx-auto px-6">

                    {/* Page Title */}
                    <div className="mb-16 text-center">
                        <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-4">
                            LEARNING COLLECTION
                        </p>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            빌더의 시작
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            시스템 트레이딩의 기초부터 실전까지, 체계적인 학습으로 시작하세요
                        </p>
                    </div>

                    {/* Products Section */}
                    <div className="space-y-20">

                        {/* G1 Product */}
                        {g1 && (
                            <div className="border-t border-gray-200 pt-12">
                                <Link href={`/products/${g1.id}`} className="group">
                                    <div className="flex flex-col md:flex-row gap-8">
                                        <div className="md:w-1/3">
                                            <img
                                                src={g1.thumbnail}
                                                alt={g1.title}
                                                className="w-full rounded-lg group-hover:opacity-90 transition-opacity"
                                            />
                                        </div>
                                        <div className="md:w-2/3">
                                            <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                                {g1.title}
                                            </h2>
                                            <p className="text-sm text-gray-500 mb-4">{g1.author}</p>
                                            <p className="text-gray-700 leading-relaxed mb-6">
                                                시스템 트레이딩의 모든 것을 담은 올인원 패키지입니다.
                                                초보자부터 중급자까지 필요한 모든 학습 자료와 실전 도구를 제공합니다.
                                                1:1 멘토링과 함께 나만의 시스템을 구축할 수 있습니다.
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-2xl font-bold text-gray-900">₩{g1.price.toLocaleString()}</span>
                                                <span className="text-sm text-blue-600 group-hover:underline">자세히 보기 →</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        )}

                        {/* G2 Product */}
                        {g2 && (
                            <div className="border-t border-gray-200 pt-12">
                                <Link href={`/products/${g2.id}`} className="group">
                                    <div className="flex flex-col md:flex-row gap-8">
                                        <div className="md:w-1/3">
                                            <img
                                                src={g2.thumbnail}
                                                alt={g2.title}
                                                className="w-full rounded-lg group-hover:opacity-90 transition-opacity"
                                            />
                                        </div>
                                        <div className="md:w-2/3">
                                            <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                                {g2.title}
                                            </h2>
                                            <p className="text-sm text-gray-500 mb-4">{g2.author}</p>
                                            <p className="text-gray-700 leading-relaxed mb-6">
                                                시스템 트레이딩을 처음 시작하는 분들을 위한 완벽한 가이드입니다.
                                                거래소 선택부터 차트 셋업까지, 기초를 탄탄하게 다지며
                                                단계별로 시스템 트레이딩의 세계에 입문할 수 있습니다.
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-2xl font-bold text-gray-900">₩{g2.price.toLocaleString()}</span>
                                                <span className="text-sm text-blue-600 group-hover:underline">자세히 보기 →</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        )}

                        {/* G3 Product */}
                        {g3 && (
                            <div className="border-t border-gray-200 pt-12">
                                <Link href={`/products/${g3.id}`} className="group">
                                    <div className="flex flex-col md:flex-row gap-8">
                                        <div className="md:w-1/3">
                                            <img
                                                src={g3.thumbnail}
                                                alt={g3.title}
                                                className="w-full rounded-lg group-hover:opacity-90 transition-opacity"
                                            />
                                        </div>
                                        <div className="md:w-2/3">
                                            <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                                {g3.title}
                                            </h2>
                                            <p className="text-sm text-gray-500 mb-4">{g3.author}</p>
                                            <p className="text-gray-700 leading-relaxed mb-6">
                                                사기와 해킹으로부터 자산을 지키는 방법을 배우고,
                                                30일 챌린지를 통해 꾸준한 학습 습관을 만듭니다.
                                                안전한 트레이딩 환경 구축과 함께 지속적인 성장을 경험하세요.
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-2xl font-bold text-gray-900">₩{g3.price.toLocaleString()}</span>
                                                <span className="text-sm text-blue-600 group-hover:underline">자세히 보기 →</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        )}

                    </div>

                    {/* Philosophy Section */}
                    <div className="mt-24 pt-12 border-t border-gray-200">
                        <div className="max-w-3xl mx-auto">
                            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                                왜 빌더의 시작인가
                            </h3>
                            <div className="space-y-6 text-gray-700 leading-relaxed">
                                <p>
                                    대부분의 트레이더들은 리딩방의 신호를 기다립니다. "지금 이 코인을 사라", "이 가격에 매도하라"는 지시를 따릅니다.
                                    하지만 내일이 되면 그 정보는 쓸모없어지고, 다시 다음 신호를 기다리게 됩니다.
                                    이것이 대부분의 투자자가 갇혀 있는 현실입니다.
                                </p>
                                <p>
                                    우리는 다릅니다. 물고기를 주는 대신 낚시하는 방법을 알려드립니다.
                                    더 나아가 낚시대를 만드는 방법까지 제공합니다.
                                    일회성 정보가 아닌, <strong className="font-semibold text-gray-900">지속 가능한 시스템의 설계도</strong>를 드립니다.
                                </p>
                                <p>
                                    감에 의존하던 매매는 데이터 기반의 의사결정으로,
                                    불안한 예측은 검증된 시스템으로,
                                    맹목적인 신호 추종은 독립적인 분석 능력으로 전환됩니다.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Learning Path Section */}
                    <div className="mt-20 pt-12 border-t border-gray-200">
                        <div className="max-w-3xl mx-auto">
                            <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                                학습 로드맵
                            </h3>

                            <div className="space-y-16">
                                {/* Step 1 */}
                                <div>
                                    <div className="flex items-center gap-4 mb-4">
                                        <span className="text-4xl font-bold text-blue-600">01</span>
                                        <h4 className="text-2xl font-bold text-gray-900">기초 다지기</h4>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed mb-4">
                                        <strong className="text-gray-900">일반인을 위한 첫번째 안내서</strong>로 시작하세요.
                                        거래소 선택부터 차트 셋업까지, 시스템 트레이딩의 기본을 탄탄하게 다집니다.
                                        복잡해 보이는 용어들을 이해하고, 실전 환경을 구축하는 방법을 배웁니다.
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        추천 대상: 시스템 트레이딩을 처음 시작하는 초보자
                                    </p>
                                </div>

                                {/* Step 2 */}
                                <div>
                                    <div className="flex items-center gap-4 mb-4">
                                        <span className="text-4xl font-bold text-blue-600">02</span>
                                        <h4 className="text-2xl font-bold text-gray-900">시스템 구축</h4>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed mb-4">
                                        <strong className="text-gray-900">시스템 투자 올인원</strong>으로 나만의 시스템을 만듭니다.
                                        전문가의 1:1 멘토링과 함께 실전 도구를 활용하며,
                                        초보자에서 시스템 빌더로 성장하는 모든 과정을 경험합니다.
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        추천 대상: 체계적으로 시스템을 구축하고 싶은 학습자
                                    </p>
                                </div>

                                {/* Step 3 */}
                                <div>
                                    <div className="flex items-center gap-4 mb-4">
                                        <span className="text-4xl font-bold text-blue-600">03</span>
                                        <h4 className="text-2xl font-bold text-gray-900">안전과 성장</h4>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed mb-4">
                                        <strong className="text-gray-900">성장책</strong>으로 자산을 지키고 꾸준히 성장합니다.
                                        스캠 필터링으로 사기와 해킹을 방어하고,
                                        30일 챌린지를 통해 지속 가능한 학습 습관을 만듭니다.
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        추천 대상: 안전한 투자 환경을 구축하고 지속적으로 성장하고 싶은 분
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Key Principles Section */}
                    <div className="mt-20 pt-12 border-t border-gray-200">
                        <div className="max-w-3xl mx-auto">
                            <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                                핵심 원칙
                            </h3>

                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h4 className="font-bold text-gray-900 mb-2">체계적 학습</h4>
                                    <p className="text-sm text-gray-600">
                                        단계별 커리큘럼으로 기초부터 실전까지 체계적으로 학습합니다
                                    </p>
                                </div>

                                <div className="text-center">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <h4 className="font-bold text-gray-900 mb-2">독립적 성장</h4>
                                    <p className="text-sm text-gray-600">
                                        신호 의존에서 벗어나 스스로 판단하고 성장하는 능력을 키웁니다
                                    </p>
                                </div>

                                <div className="text-center">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                    </div>
                                    <h4 className="font-bold text-gray-900 mb-2">지속 가능성</h4>
                                    <p className="text-sm text-gray-600">
                                        일회성이 아닌 오래 사용할 수 있는 시스템을 구축합니다
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom CTA Section */}
                    <div className="mt-24 pt-12 border-t border-gray-200">
                        <div className="text-center max-w-2xl mx-auto">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                지금 시작하세요
                            </h3>
                            <p className="text-gray-600 leading-relaxed mb-8">
                                더 이상 리딩방의 신호를 기다리지 마세요.
                                데이터 기반의 시스템 트레이더로 성장하는 여정을 시작합니다.
                            </p>
                            <Link
                                href="/"
                                className="inline-block bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                전체 콘텐츠 보기
                            </Link>
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
};

export default BuilderStartPage;
