'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ALL_PRODUCTS } from '@/data/products';

const SystemStrategyPage = () => {
    // c1, c2 상품만 필터링
    const strategyProducts = ALL_PRODUCTS.filter(p =>
        ['strategy-vol1', 'strategy-source'].includes(p.id)
    );

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Main Content */}
            <main className="w-full pt-32 md:pt-24 pb-32 md:pb-16">

                {/* Exhibition Title */}
                <div className="max-w-[1400px] mx-auto px-8 md:px-4 mb-20 md:mb-16">
                    <p className="text-[0.6875rem] font-medium tracking-[5px] uppercase text-[#b0b0b0] mb-6">
                        STRATEGY COLLECTION 2025
                    </p>
                    <h1 className="text-6xl md:text-4xl font-light tracking-[-2px] text-[#0a0a0a] mb-4">
                        시스템 & 전략
                    </h1>
                </div>

                {/* Products Grid */}
                <section className="max-w-[1400px] mx-auto px-8 md:px-4 mb-24">
                    <div className="flex flex-wrap gap-12 md:gap-8 justify-center">
                        {strategyProducts.map((product, index) => (
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
                            시장에는 검증되지 않은 전략들이 넘쳐납니다. 화려한 수익률 그래프와 함께 "절대 손실 없음"을 약속하지만,
                            실제로는 백테스트조차 제대로 하지 않은 경우가 많습니다. 말만 앞서는 사람들이 너무 많습니다.
                            "75% 수익률 보장", "100% 승률" 같은 불가능한 약속들. 우리는 그런 말을 하지 않습니다.
                        </p>

                        <p>
                            우리는 다릅니다. 모든 전략은 <strong className="font-semibold">백테스트와 실전 데이터로 철저하게 검증</strong>되었습니다.
                            감이나 직관이 아닌, 수천 개의 거래 데이터로 증명된 전략만을 제공합니다.
                            우리는 백테스팅 결과, 실제 매매 데이터, 숫자와 팩트로만 소통합니다.
                            모든 감성적, 주관적 요소를 배제하여 극도의 현실성과 신뢰성을 추구합니다.
                        </p>

                        <p>
                            이 컬렉션에 담긴 두 가지 전략 시스템은 프로 트레이더의 사고방식과 도구를 그대로 경험할 수 있게 해줍니다.
                            전략 설계도, 백테스팅 결과, 해설 영상, 실행 엔진까지 포함된 풀 패키지와,
                            검증된 퀀트 전략의 원본 소스를 투명하게 공개하는 전략 원본을 제공합니다.
                        </p>

                        <blockquote className="my-12 pl-6 border-l-2 border-[#d0d0d0] italic text-[1.25rem] md:text-lg leading-[1.7] text-[#5a5a5a]">
                            "우리는 미래를 예측하지 않습니다. 과거 데이터로 검증된 전략을 설계합니다."
                        </blockquote>

                        <p>
                            전략의 원리만 알려주고 끝나는 것이 아닙니다. 트레이딩뷰 인디케이터와 실행 엔진까지 제공하여,
                            복잡한 설정 없이 바로 실전에 적용할 수 있습니다. 이론이 아닌 실전, 추상이 아닌 구체,
                            상상이 아닌 검증된 결과를 제공합니다. 즉시 실행 가능한 도구와 명확한 가이드를 함께 제공합니다.
                        </p>

                        <p>
                            또한 블랙박스가 아닙니다. 전략의 원리와 로직, 실증 사례를 모두 투명하게 공개합니다.
                            당신은 전략을 맹목적으로 따르는 것이 아니라, 이해하고 응용할 수 있게 됩니다.
                            전략이 왜 작동하는지 이해하고, 자신만의 시스템을 구축할 수 있는 능력을 갖추게 됩니다.
                        </p>

                        <p>
                            우리가 공유하는 기술과 데이터는 외부에 많이 공개되지 않은 고급 정보입니다.
                            이것은 소수의 검증된 플레이어들에게만 허락되었던 실전 퀀트 기술입니다.
                            현역 퀀트 트레이더가 실제로 사용하는 전략과 시스템을, 당신도 그대로 경험할 수 있습니다.
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
                        전략 원칙
                    </h2>

                    <div className="space-y-16">
                        <div>
                            <h3 className="text-[1.25rem] md:text-xl font-medium tracking-[-0.5px] text-[#0a0a0a] mb-4">
                                투명성
                            </h3>
                            <p className="text-[1.0625rem] md:text-base leading-[1.9] text-[#3a3a3a]">
                                블랙박스 전략은 제공하지 않습니다. 전략의 원리와 로직, 백테스팅 결과, 실증 사례까지 모두 투명하게 공개합니다.
                                당신은 전략을 이해하고 신뢰할 수 있습니다. 모든 주장은 숫자로 뒷받침되고, 모든 전략은 백테스트로 검증됩니다.
                                우리는 미래를 예측하지 않습니다. 오직 과거와 현재의 데이터로 증명된 결과만을 다룹니다.
                                이러한 투명성이 우리 전략 시스템의 신뢰를 만듭니다.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-[1.25rem] md:text-xl font-medium tracking-[-0.5px] text-[#0a0a0a] mb-4">
                                실용성
                            </h3>
                            <p className="text-[1.0625rem] md:text-base leading-[1.9] text-[#3a3a3a]">
                                이론으로 끝나지 않습니다. 즉시 실행 가능한 도구와 명확한 가이드를 함께 제공합니다.
                                복잡한 코딩이나 설정 없이, 당장 내일부터 실전에 적용할 수 있습니다.
                                트레이딩뷰 인디케이터와 실행 엔진을 제공하며, 1:1 지원으로 당신의 실전 적용을 돕습니다.
                                단기 수익률이 아닌 시스템을 설계하고, 일시적인 성공이 아닌 지속 가능한 방법론을 구축합니다.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-[1.25rem] md:text-xl font-medium tracking-[-0.5px] text-[#0a0a0a] mb-4">
                                검증
                            </h3>
                            <p className="text-[1.0625rem] md:text-base leading-[1.9] text-[#3a3a3a]">
                                모든 전략은 수천 개의 거래 데이터로 검증되었습니다. 화려한 말이 아닌, 숫자와 팩트로만 소통합니다.
                                100% 백테스트 검증된 전략만을 제공합니다. 우리는 이론가가 아닙니다.
                                현장에서 매일 전략을 실행하고, 그 결과로 수익을 창출하는 현역 트레이더입니다.
                                우리의 모든 지식은 실전에서 검증되었으며, 이것이 우리의 유일한 증명입니다.
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
                            당신의 트레이딩은 완전히 바뀔 것입니다. 감이 아닌 데이터로, 예측이 아닌 설계로,
                            상상이 아닌 검증된 방법으로 시장에 접근하게 됩니다. 더 이상 불확실한 신호에 의존하지 않고,
                            스스로 시장을 해석하고 전략을 실행하는 독립적인 트레이더가 됩니다.
                        </p>

                        <p>
                            프로 트레이더의 도구를 경험하세요. 우리가 제공하는 전략과 시스템은 현역 퀀트 트레이더가 실제로 사용하는 것들입니다.
                            투명성과 실용성을 최우선으로 하며, 검증되지 않은 전략은 판매하지 않습니다.
                            즉시 실행 가능한 도구와 명확한 가이드로, 당신의 트레이딩을 다음 단계로 끌어올립니다.
                        </p>

                        <p className="text-[#7a7a7a] italic">
                            이론이 아닌 실전, 추상이 아닌 구체, 상상이 아닌 검증된 전략으로 시장을 주도합니다.
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

export default SystemStrategyPage;
