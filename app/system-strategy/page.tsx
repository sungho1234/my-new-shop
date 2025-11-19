'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ALL_PRODUCTS } from '@/data/products';

const SystemStrategyPage = () => {
    // c1, c2 상품 가져오기
    const c1 = ALL_PRODUCTS.find(p => p.id === 'strategy-vol1');
    const c2 = ALL_PRODUCTS.find(p => p.id === 'strategy-source');

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Main Content */}
            <main className="w-full pt-24 pb-20">
                <div className="max-w-4xl mx-auto px-6">

                    {/* Page Title */}
                    <div className="mb-16 text-center">
                        <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-4">
                            STRATEGY COLLECTION
                        </p>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            시스템 & 전략
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            백테스트로 검증된 퀀트 전략과 실전 도구를 경험하세요
                        </p>
                    </div>

                    {/* Products Section */}
                    <div className="space-y-20">

                        {/* C1 Product */}
                        {c1 && (
                            <div className="border-t border-gray-200 pt-12">
                                <Link href={`/products/${c1.id}`} className="group">
                                    <div className="flex flex-col md:flex-row gap-8">
                                        <div className="md:w-1/3">
                                            <img
                                                src={c1.thumbnail}
                                                alt={c1.title}
                                                className="w-full rounded-lg group-hover:opacity-90 transition-opacity"
                                            />
                                        </div>
                                        <div className="md:w-2/3">
                                            <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                                {c1.title}
                                            </h2>
                                            <p className="text-sm text-gray-500 mb-4">{c1.author}</p>
                                            <p className="text-gray-700 leading-relaxed mb-6">
                                                프로 트레이더의 전략 설계도, 백테스팅 결과, 해설 영상,
                                                실행 엔진까지 포함된 풀 패키지입니다.
                                                즉시 실전에 적용 가능한 도구와 명확한 가이드를 제공합니다.
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-2xl font-bold text-gray-900">₩{c1.price.toLocaleString()}</span>
                                                <span className="text-sm text-blue-600 group-hover:underline">자세히 보기 →</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        )}

                        {/* C2 Product */}
                        {c2 && (
                            <div className="border-t border-gray-200 pt-12">
                                <Link href={`/products/${c2.id}`} className="group">
                                    <div className="flex flex-col md:flex-row gap-8">
                                        <div className="md:w-1/3">
                                            <img
                                                src={c2.thumbnail}
                                                alt={c2.title}
                                                className="w-full rounded-lg group-hover:opacity-90 transition-opacity"
                                            />
                                        </div>
                                        <div className="md:w-2/3">
                                            <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                                {c2.title}
                                            </h2>
                                            <p className="text-sm text-gray-500 mb-4">{c2.author}</p>
                                            <p className="text-gray-700 leading-relaxed mb-6">
                                                검증된 퀀트 전략의 원본 소스를 투명하게 공개합니다.
                                                블랙박스가 아닌, 전략의 원리와 로직을 이해하고
                                                자신만의 시스템으로 응용할 수 있습니다.
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-2xl font-bold text-gray-900">₩{c2.price.toLocaleString()}</span>
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
                                왜 시스템 & 전략인가
                            </h3>
                            <div className="space-y-6 text-gray-700 leading-relaxed">
                                <p>
                                    시장에는 검증되지 않은 전략들이 넘쳐납니다. 화려한 수익률 그래프와 함께 "절대 손실 없음"을 약속하지만,
                                    실제로는 백테스트조차 제대로 하지 않은 경우가 많습니다.
                                    "75% 수익률 보장", "100% 승률" 같은 불가능한 약속들. 우리는 그런 말을 하지 않습니다.
                                </p>
                                <p>
                                    우리는 다릅니다. 모든 전략은 <strong className="font-semibold text-gray-900">백테스트와 실전 데이터로 철저하게 검증</strong>되었습니다.
                                    감이나 직관이 아닌, 수천 개의 거래 데이터로 증명된 전략만을 제공합니다.
                                    숫자와 팩트로만 소통하며, 모든 감성적·주관적 요소를 배제합니다.
                                </p>
                                <p>
                                    블랙박스가 아닙니다. 전략의 원리와 로직, 실증 사례를 모두 투명하게 공개합니다.
                                    당신은 전략을 맹목적으로 따르는 것이 아니라, 이해하고 응용할 수 있게 됩니다.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Strategy Details Section */}
                    <div className="mt-20 pt-12 border-t border-gray-200">
                        <div className="max-w-3xl mx-auto">
                            <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                                전략 상세
                            </h3>

                            <div className="space-y-16">
                                {/* Strategy 1 */}
                                <div>
                                    <div className="flex items-center gap-4 mb-4">
                                        <span className="text-4xl font-bold text-purple-600">01</span>
                                        <h4 className="text-2xl font-bold text-gray-900">풀 패키지 시스템</h4>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed mb-4">
                                        <strong className="text-gray-900">시스템 빌더 풀 패키지</strong>는 프로 트레이더의 모든 것을 담았습니다.
                                        전략 설계도, 백테스팅 결과, 해설 영상, 실행 엔진까지 포함되어
                                        복잡한 설정 없이 바로 실전에 적용할 수 있습니다.
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        포함 내용: 트레이딩뷰 인디케이터, 실행 엔진, 백테스트 리포트, 1:1 지원
                                    </p>
                                </div>

                                {/* Strategy 2 */}
                                <div>
                                    <div className="flex items-center gap-4 mb-4">
                                        <span className="text-4xl font-bold text-purple-600">02</span>
                                        <h4 className="text-2xl font-bold text-gray-900">전략 원본 공개</h4>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed mb-4">
                                        <strong className="text-gray-900">프로의 전략 원본</strong>은 검증된 퀀트 전략의 소스를 투명하게 공개합니다.
                                        전략이 왜 작동하는지 이해하고, 자신만의 시스템으로 응용할 수 있는 능력을 갖추게 됩니다.
                                        블랙박스가 아닌, 완전히 투명한 전략입니다.
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        포함 내용: 전략 소스코드, 로직 설명, 백테스트 데이터, 응용 가이드
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
                                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                    <h4 className="font-bold text-gray-900 mb-2">투명성</h4>
                                    <p className="text-sm text-gray-600">
                                        전략의 원리와 로직을 모두 공개하며 숫자로 증명합니다
                                    </p>
                                </div>

                                <div className="text-center">
                                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                        </svg>
                                    </div>
                                    <h4 className="font-bold text-gray-900 mb-2">실용성</h4>
                                    <p className="text-sm text-gray-600">
                                        즉시 실행 가능한 도구와 명확한 가이드를 제공합니다
                                    </p>
                                </div>

                                <div className="text-center">
                                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <h4 className="font-bold text-gray-900 mb-2">검증</h4>
                                    <p className="text-sm text-gray-600">
                                        백테스트와 실전 데이터로 철저하게 검증된 전략만 제공합니다
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom CTA Section */}
                    <div className="mt-24 pt-12 border-t border-gray-200">
                        <div className="text-center max-w-2xl mx-auto">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                검증된 전략으로 시작하세요
                            </h3>
                            <p className="text-gray-600 leading-relaxed mb-8">
                                감이 아닌 데이터로, 예측이 아닌 설계로,
                                투명하게 검증된 전략과 시스템을 경험하세요.
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

export default SystemStrategyPage;
