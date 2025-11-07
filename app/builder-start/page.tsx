'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ALL_PRODUCTS } from '@/data/products';

const BuilderStartPage = () => {
    // g1, g2, g3 상품만 필터링
    const learningProducts = ALL_PRODUCTS.filter(p =>
        ['first-guide', 'system-builder', 'growth-book'].includes(p.id)
    );

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Main Content */}
            <main className="w-full pt-32 md:pt-24 pb-32 md:pb-16">

                {/* Exhibition Title */}
                <div className="max-w-[1400px] mx-auto px-8 md:px-4 mb-20 md:mb-16">
                    <p className="text-[0.6875rem] font-medium tracking-[5px] uppercase text-[#b0b0b0] mb-6">
                        LEARNING COLLECTION 2025
                    </p>
                    <h1 className="text-6xl md:text-4xl font-light tracking-[-2px] text-[#0a0a0a] mb-4">
                        빌더의 시작
                    </h1>
                </div>

                {/* Products Grid */}
                <section className="max-w-[1400px] mx-auto px-8 md:px-4 mb-24">
                    <div className="flex flex-wrap gap-12 md:gap-8 justify-center">
                        {learningProducts.map((product, index) => (
                            <Link
                                key={product.id}
                                href={`/products/${product.id}`}
                                className="group block w-[280px] md:w-full"
                            >
                                {/* 상품 이미지 */}
                                <div className="relative mb-5 overflow-hidden bg-[#fafafa]">
                                    <img
                                        src={product.thumbnail}
                                        alt={product.title}
                                        className="w-full h-auto object-cover group-hover:opacity-95 transition-opacity duration-500"
                                    />
                                </div>

                                {/* 상품 정보 */}
                                <div className="space-y-3">
                                    <h2 className="text-[1rem] font-medium tracking-[-0.3px] text-[#0a0a0a] leading-[1.4]">
                                        {product.title}
                                    </h2>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[0.6875rem] tracking-[1.5px] uppercase text-[#9a9a9a]">
                                            {product.author}
                                        </span>
                                        <span className="text-[0.875rem] font-medium text-[#0a0a0a]">
                                            ₩{product.price.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Divider */}
                <div className="max-w-[1400px] mx-auto px-8 md:px-4">
                    <div className="w-16 h-[1px] bg-[#d8d8d8] my-20 md:my-16"></div>
                </div>

                {/* Exhibition Statement - 풍부한 글 */}
                <section className="max-w-[1400px] mx-auto px-8 md:px-4 mb-20">
                    <h2 className="text-[2rem] md:text-2xl font-light tracking-[-1px] text-[#0a0a0a] mb-12">
                        전시 소개
                    </h2>

                    <div className="space-y-8 text-[1.0625rem] md:text-base leading-[1.9] text-[#3a3a3a]">
                        <p>
                            코인 선물 시장은 혼란스럽습니다. 수많은 리딩방, 전문가, 강사들이 "오늘 이 코인을 사라", "지금 매도하라"는 신호를 던집니다.
                            그러나 내일이 되면 그 정보는 쓸모없어지고, 당신은 다시 다음 신호를 기다리게 됩니다.
                            이것이 대부분의 트레이더가 갇혀 있는 현실입니다.
                        </p>

                        <p>
                            우리는 다릅니다. 우리는 당신에게 물고기를 주지 않습니다. 물고기를 잡는 방법, 더 나아가 낚시대를 만드는 방법을 알려드립니다.
                            <strong className="font-semibold"> 벽돌이 아닌 설계도</strong>를 제공합니다.
                            일회성 정보가 아닌, 지속 가능한 수익 시스템의 설계도입니다.
                        </p>

                        <p>
                            이 컬렉션에 담긴 세 가지 학습 콘텐츠는 당신을 단순 수익자가 아닌, 스스로 시스템을 이해하고 응용하며 발전시킬 수 있는
                            <strong className="font-semibold"> '시스템 빌더'</strong>로 격상시킵니다.
                            초보자도 이해할 수 있는 명확한 가이드부터, 실전에서 즉시 적용 가능한 구체적인 기술까지,
                            체계적으로 구성된 학습 로드맵을 따라가게 됩니다.
                        </p>

                        <blockquote className="my-12 pl-6 border-l-2 border-[#d0d0d0] italic text-[1.25rem] md:text-lg leading-[1.7] text-[#5a5a5a]">
                            "의존에서 독립으로, 감에서 데이터로, 예측에서 설계로."
                        </blockquote>

                        <p>
                            대부분의 트레이더들은 감에 의존합니다. 뉴스를 보고, 다른 사람의 의견을 듣고, 차트의 패턴을 '느낌'으로 해석합니다.
                            그리고 손실이 발생하면 운이 나빴다고 생각합니다.
                            우리는 그 감의 영역을 <strong className="font-semibold">데이터 엔지니어링의 영역</strong>으로 바꿉니다.
                        </p>

                        <p>
                            시스템 트레이딩을 처음 접하는 분들도 단계별로 학습할 수 있도록 콘텐츠를 구성했습니다.
                            첫 번째 안내서에서는 거래소 선택부터 차트 셋업까지 기초를 탄탄하게 다집니다.
                            올인원 패키지에서는 초보자부터 중급자까지 필요한 모든 학습 자료와 실전 도구를 제공합니다.
                            성장책에서는 사기와 해킹으로부터 자산을 지키는 방법과 함께, 30일 챌린지를 통해 꾸준한 학습 습관을 만듭니다.
                        </p>

                        <p>
                            모든 콘텐츠는 현역 트레이더의 실전 경험을 기반으로 만들어졌습니다. 화려한 이론이 아닌, 시장에서 검증된 실전 기술입니다.
                            이론만으로는 부족합니다. 실제 거래소 선택부터 차트 셋업까지, 즉시 적용 가능한 실전 가이드를 제공합니다.
                            당신은 더 이상 뉴스와 감정에 휘둘리지 않고, 자신만의 원칙과 시스템을 갖게 될 것입니다.
                        </p>
                    </div>
                </section>

                {/* Divider */}
                <div className="max-w-[1400px] mx-auto px-8 md:px-4">
                    <div className="w-16 h-[1px] bg-[#d8d8d8] my-20 md:my-16"></div>
                </div>

                {/* Philosophy Section */}
                <section className="max-w-[1400px] mx-auto px-8 md:px-4 mb-20">
                    <h2 className="text-[2rem] md:text-2xl font-light tracking-[-1px] text-[#0a0a0a] mb-12">
                        학습 철학
                    </h2>

                    <div className="space-y-16">
                        <div>
                            <h3 className="text-[1.25rem] md:text-xl font-medium tracking-[-0.5px] text-[#0a0a0a] mb-4">
                                체계적 학습
                            </h3>
                            <p className="text-[1.0625rem] md:text-base leading-[1.9] text-[#3a3a3a]">
                                복잡한 시장 속에서도 흔들리지 않는 기준과 원칙을 세울 수 있도록, 단계별 커리큘럼으로 시스템 트레이딩의 기초부터 실전까지 체계적으로 학습합니다.
                                각 단계는 다음 단계로 자연스럽게 연결되며, 학습자는 자신의 성장을 명확하게 느낄 수 있습니다.
                                초보자도 길을 잃지 않고, 중급자는 깊이 있는 통찰을 얻게 됩니다.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-[1.25rem] md:text-xl font-medium tracking-[-0.5px] text-[#0a0a0a] mb-4">
                                독립적 성장
                            </h3>
                            <p className="text-[1.0625rem] md:text-base leading-[1.9] text-[#3a3a3a]">
                                리딩방의 신호에 의존하지 않고, 스스로 판단하고 성장할 수 있는 데이터 기반 사고방식을 체득합니다.
                                당신은 더 이상 누군가의 신호를 기다리지 않습니다. 시장을 스스로 해석하고, 데이터를 분석하며, 자신만의 전략을 세웁니다.
                                이것이 진정한 트레이더의 길이며, 우리가 추구하는 독립적 성장입니다.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-[1.25rem] md:text-xl font-medium tracking-[-0.5px] text-[#0a0a0a] mb-4">
                                지속 가능성
                            </h3>
                            <p className="text-[1.0625rem] md:text-base leading-[1.9] text-[#3a3a3a]">
                                일회성 수익이 아닌 지속 가능한 시스템을 구축합니다. 감정에 휘둘리지 않고, 자신만의 원칙과 시스템을 갖춘 트레이더로 성장하게 됩니다.
                                오늘 배운 것이 내일도, 1년 후에도 유효한 지식이 됩니다. 시장이 변해도 흔들리지 않는 기본기와 사고방식을 체득합니다.
                                이것이 우리가 제공하는 진정한 가치입니다.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Divider */}
                <div className="max-w-[1400px] mx-auto px-8 md:px-4">
                    <div className="w-16 h-[1px] bg-[#d8d8d8] my-20 md:my-16"></div>
                </div>

                {/* Closing Statement */}
                <section className="max-w-[1400px] mx-auto px-8 md:px-4 mb-20">
                    <div className="text-[1.0625rem] md:text-base leading-[1.9] text-[#3a3a3a] space-y-8">
                        <p>
                            당신의 트레이딩은 완전히 바뀔 것입니다. 감에 의존하던 매매는 데이터 기반의 의사결정으로,
                            불안한 예측은 검증된 시스템으로, 맹목적인 신호 추종은 독립적인 분석 능력으로 전환됩니다.
                        </p>

                        <p>
                            더 이상 리딩방의 신호를 기다리지 않습니다. 뉴스에 일희일비하지 않습니다. 다른 사람의 말에 흔들리지 않습니다.
                            당신은 자신만의 원칙을 가진 트레이더가 됩니다. 시스템을 이해하고, 전략을 응용하며, 지속적으로 성장하는 시스템 빌더가 됩니다.
                        </p>

                        <p className="text-[#7a7a7a] italic">
                            감(感)이 아닌 데이터로, 운(運)이 아닌 시스템으로, 의존이 아닌 독립으로 나아가는 여정에 함께합니다.
                        </p>
                    </div>
                </section>

            </main>

            <Footer />

            <style jsx>{`
                * {
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                }
            `}</style>
        </div>
    );
};

export default BuilderStartPage;
