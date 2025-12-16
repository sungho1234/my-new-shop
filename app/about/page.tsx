'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Main Content */}
            <main className="max-w-[680px] mx-auto px-8 md:px-4 pt-40 md:pt-24 pb-32 md:pb-16">

                {/* Page Title */}
                <div className="fade-in mb-16">
                    <p className="text-[0.75rem] font-semibold tracking-[4px] uppercase text-[#a0a0a0]">
                        ABOUT US
                    </p>
                </div>

                {/* Hero Section */}
                <section className="mb-24 fade-in">
                    <h1 className="text-5xl md:text-3xl font-bold tracking-[-1.5px] text-[#0a0a0a] mb-8">
                        우리는 강사가 아닙니다.
                    </h1>
                    <p className="text-xl md:text-lg leading-[1.7] text-[#3a3a3a] mb-6">
                        지금 이 시간에도 시장에서 데이터로 수익을 내고 있는 현역 퀀트 트레이딩 팀입니다.
                        우리는 화려한 이론이나 미래 예측을 판매하지 않습니다.
                    </p>
                    <p className="text-xl md:text-lg leading-[1.7] text-[#3a3a3a]">
                        모든 전략과 기술은 실제 데이터와 수익률로 검증되었습니다. 더 이상의 설명은 사족일 뿐입니다.
                    </p>
                </section>

                {/* Image Block #1 - Dark */}
                <div className="my-16 h-[400px] md:h-[280px] rounded-lg flex items-center justify-center"
                     style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)' }}>
                    <span className="text-2xl md:text-xl font-semibold tracking-[3px] text-[#6a6a6a]">
                        DATA DRIVEN TRADING
                    </span>
                </div>

                {/* Divider */}
                <div className="w-10 h-[1px] bg-[#d0d0d0] my-24"></div>

                {/* Section #1: 우리가 다른 이유 */}
                <section className="mb-24">
                    <h2 className="text-[1.75rem] md:text-2xl font-bold tracking-[-0.5px] text-[#0a0a0a] mb-8">
                        우리가 다른 이유
                    </h2>
                    <p className="text-[1.0625rem] md:text-base leading-[1.8] text-[#3a3a3a] mb-6">
                        코인 선물 시장은 혼란스럽습니다. 수많은 리딩방, 전문가, 강사들이 "오늘 이 코인을 사라", "지금 매도하라"는 신호를 던집니다.
                        그러나 내일이 되면 그 정보는 쓸모없어지고, 당신은 다시 다음 신호를 기다리게 됩니다.
                    </p>

                    {/* Quote Block */}
                    <blockquote className="my-12 pl-8 border-l-[3px] border-[#0a0a0a]">
                        <p className="text-[1.375rem] md:text-xl font-medium italic leading-[1.6] text-[#3a3a3a]">
                            리딩방은 오늘 올라갈 종목(벽돌)을 던져줍니다.<br />
                            우리는 시장을 해석하는 '데이터'와 '기술'을 제공합니다.
                        </p>
                    </blockquote>

                    <p className="text-[1.0625rem] md:text-base leading-[1.8] text-[#3a3a3a] mb-6">
                        우리는 다릅니다. 우리는 당신에게 물고기를 주지 않습니다. 물고기를 잡는 방법, 더 나아가 낚시대를 만드는 방법을 알려드립니다.
                    </p>
                    <p className="text-[1.0625rem] md:text-base leading-[1.8] text-[#3a3a3a] mb-6">
                        우리가 제공하는 것은 일회성 정보가 아닌, <strong className="font-semibold">지속 가능한 수익 시스템의 설계도</strong>입니다.
                        이는 당신을 단순 수익자로 만드는 것이 아니라, 스스로 시스템을 이해하고 응용하며 발전시킬 수 있는 '시스템 빌더'로 격상시킵니다.
                    </p>

                    <h3 className="text-xl md:text-lg font-semibold tracking-[-0.3px] text-[#0a0a0a] mt-12 mb-6">
                        의존에서 독립으로
                    </h3>
                    <p className="text-[1.0625rem] md:text-base leading-[1.8] text-[#3a3a3a] mb-6">
                        대부분의 트레이더들은 감에 의존합니다. 뉴스를 보고, 다른 사람의 의견을 듣고, 차트의 패턴을 '느낌'으로 해석합니다.
                        그리고 손실이 발생하면 운이 나빴다고 생각합니다.
                    </p>
                    <p className="text-[1.0625rem] md:text-base leading-[1.8] text-[#3a3a3a]">
                        우리는 그 감의 영역을 데이터 엔지니어링의 영역으로 바꿉니다. 당신은 더 이상 뉴스와 감정에 휘둘리지 않고,
                        자신만의 원칙과 시스템을 갖게 될 것입니다.
                    </p>
                </section>

                {/* Image Block #2 - Light */}
                <div className="my-16 h-[400px] md:h-[280px] rounded-lg flex items-center justify-center"
                     style={{ background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)' }}>
                    <span className="text-2xl md:text-xl font-semibold tracking-[3px] text-[#9a9a9a]">
                        SYSTEMATIC APPROACH
                    </span>
                </div>

                {/* Divider */}
                <div className="w-10 h-[1px] bg-[#d0d0d0] my-24"></div>

                {/* Section #2: 우리의 유일한 증명은 '계좌'입니다 */}
                <section className="mb-24">
                    <h2 className="text-[1.75rem] md:text-2xl font-bold tracking-[-0.5px] text-[#0a0a0a] mb-8">
                        우리의 유일한 증명은 '계좌'입니다
                    </h2>
                    <p className="text-[1.0625rem] md:text-base leading-[1.8] text-[#3a3a3a] mb-6">
                        시장에는 말만 앞서는 사람들이 너무 많습니다. "75% 수익률 보장", "절대 손실 없음" 같은 불가능한 약속들. 우리는 그런 말을 하지 않습니다.
                    </p>
                    <p className="text-[1.0625rem] md:text-base leading-[1.8] text-[#3a3a3a] mb-6">
                        우리는 백테스팅 결과, 실제 매매 데이터, 숫자와 팩트로만 소통합니다. 모든 감성적, 주관적 요소를 배제하여 극도의 현실성과 신뢰성을 추구합니다.
                    </p>
                    <p className="text-[1.0625rem] md:text-base leading-[1.8] text-[#3a3a3a] mb-6">
                        우리가 공유하는 기술과 데이터는 외부에 많이 공개되지 않은 고급 정보입니다.
                        이것은 소수의 검증된 플레이어들에게만 허락되었던 실전 퀀트 기술입니다.
                    </p>

                    <h3 className="text-xl md:text-lg font-semibold tracking-[-0.3px] text-[#0a0a0a] mt-12 mb-6">
                        데이터로 말하다
                    </h3>
                    <p className="text-[1.0625rem] md:text-base leading-[1.8] text-[#3a3a3a] mb-6">
                        우리 팀은 매일 뉴욕 세션에서 활동합니다. 실시간으로 시장을 분석하고, 전략을 실행하며, 그 결과를 데이터로 축적합니다.
                        이것이 우리의 일이자 우리의 증명입니다.
                    </p>
                    <p className="text-[1.0625rem] md:text-base leading-[1.8] text-[#3a3a3a]">
                        우리는 가르치는 사람이 아니라, '증명해온 사람들'입니다. 실제 시장에서 수익으로 실력을 검증하고 있는 현역 팀입니다.
                    </p>
                </section>

                {/* Divider */}
                <div className="w-10 h-[1px] bg-[#d0d0d0] my-24"></div>

                {/* Section #3: 우리가 추구하는 5가지 가치 */}
                <section className="mb-24">
                    <h2 className="text-[1.75rem] md:text-2xl font-bold tracking-[-0.5px] text-[#0a0a0a] mb-12">
                        우리가 추구하는 5가지 가치
                    </h2>

                    <div className="space-y-12">
                        <div>
                            <h3 className="text-xl md:text-lg font-semibold tracking-[-0.3px] text-[#0a0a0a] mb-4">
                                권위 (Authority)
                            </h3>
                            <p className="text-[1.0625rem] md:text-base leading-[1.8] text-[#3a3a3a]">
                                우리는 이론가가 아닙니다. 현장에서 매일 전략을 실행하고, 그 결과로 수익을 창출하는 현역 트레이더입니다.
                                우리의 모든 지식은 실전에서 검증되었습니다.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl md:text-lg font-semibold tracking-[-0.3px] text-[#0a0a0a] mb-4">
                                기밀성 (Exclusivity)
                            </h3>
                            <p className="text-[1.0625rem] md:text-base leading-[1.8] text-[#3a3a3a]">
                                우리가 공유하는 정보는 쉽게 얻을 수 없는 것들입니다. 수많은 시행착오 끝에 얻은 인사이트, 내부에서만 통용되던 기술,
                                아무나 가질 수 없는 데이터. 이것이 우리가 제공하는 가치입니다.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl md:text-lg font-semibold tracking-[-0.3px] text-[#0a0a0a] mb-4">
                                실증주의 (Evidence-Based)
                            </h3>
                            <p className="text-[1.0625rem] md:text-base leading-[1.8] text-[#3a3a3a]">
                                우리는 미래를 예측하지 않습니다. 오직 과거와 현재의 데이터로 증명된 결과만을 다룹니다.
                                모든 주장은 숫자로 뒷받침되고, 모든 전략은 백테스트로 검증됩니다.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl md:text-lg font-semibold tracking-[-0.3px] text-[#0a0a0a] mb-4">
                                아키텍처 (Architecture)
                            </h3>
                            <p className="text-[1.0625rem] md:text-base leading-[1.8] text-[#3a3a3a]">
                                단기 수익률이 아닌 시스템을 설계합니다. 일시적인 성공이 아닌 지속 가능한 방법론을 구축합니다.
                                우리의 목표는 당신을 시스템 빌더로 만드는 것입니다.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl md:text-lg font-semibold tracking-[-0.3px] text-[#0a0a0a] mb-4">
                                엘리트 (Elite)
                            </h3>
                            <p className="text-[1.0625rem] md:text-base leading-[1.8] text-[#3a3a3a]">
                                우리는 모두를 위한 서비스를 제공하지 않습니다. 성장 가능성을 지닌 소수, 진지하게 배우고자 하는 사람들과 함께합니다.
                                이 선별성이 우리 커뮤니티의 질을 보장합니다.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Image Block #3 - Light */}
                <div className="my-16 h-[400px] md:h-[280px] rounded-lg flex items-center justify-center"
                     style={{ background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)' }}>
                    <span className="text-2xl md:text-xl font-semibold tracking-[3px] text-[#9a9a9a]">
                        ELITE COMMUNITY
                    </span>
                </div>

                {/* Divider */}
                <div className="w-10 h-[1px] bg-[#d0d0d0] my-24"></div>

                {/* Section #4: 우리의 사명 */}
                <section className="mb-24">
                    <h2 className="text-[1.75rem] md:text-2xl font-bold tracking-[-0.5px] text-[#0a0a0a] mb-8">
                        우리의 사명
                    </h2>
                    <p className="text-[1.0625rem] md:text-base leading-[1.8] text-[#3a3a3a] mb-6">
                        개인의 감과 추측에 의존하는 투자의 영역을, <strong className="font-semibold">데이터와 시스템에 기반한 엔지니어링의 영역</strong>으로 전환시키는 것.
                        이것이 우리가 존재하는 이유입니다.
                    </p>
                    <p className="text-[1.0625rem] md:text-base leading-[1.8] text-[#3a3a3a] mb-6">
                        퀀트 트레이딩은 오랫동안 소수의 헤지펀드, 프랍 트레이딩 펌의 전유물이었습니다. 일반 개인 투자자가 접근하기에는 장벽이 너무 높았습니다.
                    </p>
                    <p className="text-[1.0625rem] md:text-base leading-[1.8] text-[#3a3a3a] mb-12">
                        우리는 그 장벽을 허물고 있습니다. 소수의 검증된 플레이어들에게만 허락되었던 실전 퀀트 기술을,
                        진지하게 배우고자 하는 모든 이들에게 열어주고 있습니다.
                    </p>

                    {/* Info Box */}
                    <div className="bg-[#fafafa] border border-[#e8e8e8] rounded-lg p-10 my-12">
                        <h3 className="text-xl md:text-lg font-semibold tracking-[-0.3px] text-[#0a0a0a] mb-4">
                            우리의 비전
                        </h3>
                        <p className="text-[1.0625rem] md:text-base leading-[1.8] text-[#3a3a3a] mb-4">
                            기술과 데이터로 시장을 주도하는 <strong className="font-semibold">아시아 최고의 프랍 트레이딩 펌</strong>으로 성장합니다.
                        </p>
                        <p className="text-[1.0625rem] md:text-base leading-[1.8] text-[#3a3a3a]">
                            우리와 함께한 파트너들이 각자의 영역에서 시장을 주도하는 전문가로 성장하며,
                            가장 강력한 트레이더 생태계를 함께 구축합니다.
                        </p>
                    </div>

                    <h3 className="text-xl md:text-lg font-semibold tracking-[-0.3px] text-[#0a0a0a] mt-12 mb-6">
                        당신이 얻게 될 것
                    </h3>
                    <p className="text-[1.0625rem] md:text-base leading-[1.8] text-[#3a3a3a] mb-6">
                        당신의 트레이딩은 완전히 바뀔 것입니다. 감에 의존하던 매매는 데이터 기반의 의사결정으로,
                        불안한 예측은 검증된 시스템으로, 맹목적인 신호 추종은 독립적인 분석 능력으로 전환됩니다.
                    </p>
                    <p className="text-[1.0625rem] md:text-base leading-[1.8] text-[#3a3a3a] mb-6">
                        더 이상 리딩방의 신호를 기다리지 않습니다. 뉴스에 일희일비하지 않습니다. 다른 사람의 말에 흔들리지 않습니다.
                    </p>
                    <p className="text-[1.0625rem] md:text-base leading-[1.8] text-[#3a3a3a]">
                        당신은 자신만의 원칙을 가진 트레이더가 됩니다. 시스템을 이해하고, 전략을 응용하며, 지속적으로 성장하는 시스템 빌더가 됩니다.
                    </p>
                </section>

                {/* Divider */}
                <div className="w-10 h-[1px] bg-[#d0d0d0] my-24"></div>

                {/* Quote Section */}
                <blockquote className="my-24 pl-8 border-l-[3px] border-[#0a0a0a]">
                    <p className="text-[1.375rem] md:text-xl font-medium italic leading-[1.6] text-[#3a3a3a]">
                        우리는 예측하지 않고, 설계합니다.
                    </p>
                </blockquote>

                {/* Divider */}
                <div className="w-10 h-[1px] bg-[#d0d0d0] my-24"></div>

                {/* Section #5: 함께 성장하는 커뮤니티 */}
                <section className="mb-24">
                    <h2 className="text-[1.75rem] md:text-2xl font-bold tracking-[-0.5px] text-[#0a0a0a] mb-8">
                        함께 성장하는 커뮤니티
                    </h2>
                    <p className="text-[1.0625rem] md:text-base leading-[1.8] text-[#3a3a3a] mb-6">
                        MAXX Systems는 단순히 지식을 판매하는 플랫폼이 아닙니다. 우리는 실력 있는 트레이더들의 네트워크를 만들고 있습니다.
                    </p>
                    <p className="text-[1.0625rem] md:text-base leading-[1.8] text-[#3a3a3a] mb-6">
                        우리 팀은 당신의 성장에 시간과 인력을 먼저 투자합니다. 당신이 길을 잃지 않고 빠르게 성장하는 것이 곧 우리의 목표와 일치하기 때문입니다.
                    </p>
                    <p className="text-[1.0625rem] md:text-base leading-[1.8] text-[#3a3a3a] mb-6">
                        1:1 멘토링 데스크를 통해 현역 트레이더와 직접 소통하고, 당신의 분석을 검증받으며, 올바른 방향으로 나아갈 수 있습니다.
                    </p>
                    <p className="text-[1.0625rem] md:text-base leading-[1.8] text-[#3a3a3a] mb-12">
                        향후 개설될 비공개 커뮤니티에서는 전 세계의 시스템 빌더들, 퀀트 개발자들과 함께 성장할 수 있습니다.
                        이것은 단순한 정보 공유의 장이 아닌, 실력 있는 전문가들의 글로벌 네트워크입니다.
                    </p>

                    <h3 className="text-xl md:text-lg font-semibold tracking-[-0.3px] text-[#0a0a0a] mb-6">
                        시작은 지금입니다
                    </h3>
                    <p className="text-[1.0625rem] md:text-base leading-[1.8] text-[#3a3a3a] mb-6">
                        트레이딩의 진입 장벽을 무너뜨리는 것, 그것이 우리의 투자입니다. 당신이 시스템 빌더로 거듭나는 여정에 우리가 함께합니다.
                    </p>
                    <p className="text-[1.0625rem] md:text-base leading-[1.8] text-[#3a3a3a]">
                        감이 아닌 데이터로, 예측이 아닌 설계로, 의존이 아닌 독립으로. 당신의 트레이딩을 완전히 바꿀 준비가 되셨나요?
                    </p>
                </section>

            </main>

            <Footer />

            <style jsx>{`
                .fade-in {
                    opacity: 0;
                    transform: translateY(20px);
                    animation: fadeInUp 0.6s ease forwards;
                }

                .fade-in:nth-child(1) {
                    animation-delay: 0.1s;
                }

                .fade-in:nth-child(2) {
                    animation-delay: 0.2s;
                }

                @keyframes fadeInUp {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                * {
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                }
            `}</style>
        </div>
    );
};

export default AboutPage;
