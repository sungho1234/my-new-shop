// 파일 경로: /app/products/maxx-quant-v4/page.tsx

"use client"; 

import React, { useState } from 'react';
import Script from 'next/script';
import styles from './ProductDetail.module.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PaymentModal, { PaymentItem } from "@/components/PaymentModal";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

// 1. 스크롤 애니메이션 훅 import
import { useScrollFadeIn } from '@/hooks/useScrollFadeIn';

const faqItems = [
  { question: 'Q1. 코딩 지식이 필요한가요?', answer: '아닙니다. 이 원장은 전략의 논리를 다룹니다. 엑셀 수준으로 충분합니다.' },
  { question: 'Q2. 수익을 보장하나요?', answer: '아니요. 우리는 지식을 제공하고, 당신은 가치를 판단하면 됩니다.' },
  { question: 'Q3. Vol.1만으로 실전이 가능한가요?', answer: '네. Vol.1 하나로 완전한 시스템 구축이 가능합니다.' },
  { question: 'Q4. 디브리핑은 어떻게 진행되나요?', answer: '구매 후 3일간 텔레그램/이메일로 현역 팀원과 1:1 소통합니다.' },
];

const itemForPay: PaymentItem = {
    title: "MAXX Quant System v4.1",
    subtitle: "디지털 콘텐츠",
    priceLabel: "2,100,000원",
    priceValue: 2100000,
    thumbnail: "/로고.png",
};

const ProductDetailPage = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [paymentOpen, setPaymentOpen] = useState(false);
    
    const { user } = useAuth();
    const router = useRouter();

    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    // 2. 애니메이션 훅 호출
    const animMedia = useScrollFadeIn('up', 1, 0);
    const animTabs = useScrollFadeIn('up', 1, 0.1);
    const animDesc = useScrollFadeIn('up', 1, 0);
    const animAdditional = useScrollFadeIn('up', 1, 0.1);
    const animWhatYouGet = useScrollFadeIn('up', 1, 0);
    const animTarget = useScrollFadeIn('up', 1, 0.1);
    const animFaq = useScrollFadeIn('up', 1, 0);
    const animTrust = useScrollFadeIn('up', 1, 0.1);

    const toggleAccordion = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const handlePayRequest = (item: PaymentItem, method: "KAKAOPAY" | "NAVERPAY") => {
        // @ts-ignore
        const { IMP } = window;
        if (!IMP) {
            alert("결제 모듈 로딩에 실패했습니다. 페이지를 새로고침 후 다시 시도해주세요.");
            return;
        }
        IMP.init('iamport');
        const payData = {
            pg: method === 'KAKAOPAY' ? 'kakaopay' : 'html5_inicis.INIpayTest',
            pay_method: method === 'NAVERPAY' ? 'naverpay' : 'card',
            merchant_uid: `MAXX-${new Date().getTime()}`,
            name: item.title,
            amount: 100,
            buyer_email: "test@example.com", 
            buyer_name: user?.nickname || "테스터",
            buyer_tel: "010-1234-5678",
        };
        IMP.request_pay(payData, (rsp: any) => {
            if (rsp.success) {
                alert("결제가 완료되었습니다. 주문번호: " + rsp.merchant_uid);
            } else {
                alert("결제에 실패하였습니다. 에러: " + rsp.error_msg);
            }
        });
    };

    const handleBuyNowClick = () => {
        if (user) {
            setPaymentOpen(true);
        } else {
            if (window.confirm("로그인이 필요한 서비스입니다. 로그인 하시겠습니까?")) {
                router.push('/login');
            }
        }
    };

    const handleLikeClick = () => {
        if (user) {
            setIsLiked(!isLiked);
            setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
        } else {
            if (window.confirm("로그인이 필요한 서비스입니다. 로그인 하시겠습니까?")) {
                router.push('/login');
            }
        }
    };

    const handleShareClick = () => {
        const currentUrl = window.location.href;
        navigator.clipboard.writeText(currentUrl).then(() => {
            alert("이 페이지의 주소가 클립보드에 복사되었습니다.");
        }).catch(err => {
            console.error('클립보드 복사 실패:', err);
            alert("클립보드 복사에 실패했습니다.");
        });
    };

    return (
        <div>
            <Script type="text/javascript" src="https://cdn.iamport.kr/js/iamport.payment-1.2.0.js" />
            
            <Header />
            <div id="wrapper">
                <div className={styles.mainContainer}>
                    <main className={styles.contentColumn}>
                        {/* 3. 각 섹션의 최상위 태그에 ref 속성만 추가합니다. */}
                        <section className={`${styles.mediaContainer} ${styles.card}`} {...animMedia}>
                            <iframe 
                                src="https://www.youtube.com/embed/YOUTUBE_VIDEO_ID"
                                title="YouTube video player" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen>
                            </iframe>
                        </section>

                        <nav className={styles.tabsNav} {...animTabs}>
                            <button 
                                className={`${styles.tabLink} ${activeTab === 'overview' ? styles.active : ''}`}
                                onClick={() => setActiveTab('overview')}
                            >
                                Introduction
                            </button>
                            <button 
                                className={`${styles.tabLink} ${activeTab === 'details' ? styles.active : ''}`}
                                onClick={() => setActiveTab('details')}
                            >
                                Detail
                            </button>
                        </nav>
                        
                        <div id="overview" className={`${styles.tabPane} ${activeTab === 'overview' ? styles.active : ''}`}>
                            <section className={`${styles.descriptionBox} ${styles.card}`} {...animDesc}>
                                <h3>TEAM DESCRIPTION</h3>
                                <h4 className={styles.subheading}>우리는 누구인가</h4>
                                <p>우리는 교육자가 아닙니다.</p>
                                <p>매일 뉴욕 세션이 열릴 때, 우리는 실제 자본을 시장에 투입합니다. <strong>데이터</strong>를 분석하고, <strong>포지션</strong>을 열고, <strong>수익을 실현</strong>합니다. 이것이 우리의 일입니다. 우리는 <strong>현역 퀀트 트레이딩 팀</strong>입니다.</p>
                                <p>아시아 최고의 프랍 트레이딩 펌으로 성장하는 과정에서, 우리가 축적한 기술과 통찰을 선택된 소수와 공유하기로 결정했습니다.</p>
                                <p><strong>The Archive</strong>는 우리 팀이 실전에서 사용하는 내부 리포트, 전략 노트, 데이터 분석 자료를 외부에 공개하는 프로젝트입니다. 강의나 교육이 아닌, <strong>지식 교류</strong>입니다.</p>
                            </section>

                            <div {...animAdditional}>
                                <div className={styles.additionalContent}>
                                    <h3 className={styles.contentTitle}>📦 The Archive Vol. 1</h3>
                                    <p>Vol. 1은 코인 선물시장에 입문하는 트레이더를 위한 첫 번째 원장입니다. 이 원장에는 다음이 담겨 있습니다:</p>
                                    <ol className={styles.numberedFeatureList}>
                                        <li>
                                            <div className={styles.numberedFeatureContent}>
                                                <h4 className={styles.numberedFeatureTitle}>퀀트 분석의 기초</h4>
                                                <p className={styles.numberedFeatureDesc}>시장 구조, 주문장 해석, 펀딩비 활용, 거래량 분석 등 데이터 중심 사고의 기반</p>
                                            </div>
                                        </li>
                                        <li>
                                            <div className={styles.numberedFeatureContent}>
                                                <h4 className={styles.numberedFeatureTitle}>검증된 트레이딩 전략 1종</h4>
                                                <p className={styles.numberedFeatureDesc}>2020-2024년 백테스팅으로 증명된 모멘텀 반전 전략의 완전한 로직과 실전 가이드</p>
                                            </div>
                                        </li>
                                        <li>
                                            <div className={styles.numberedFeatureContent}>
                                                <h4 className={styles.numberedFeatureTitle}>리스크 관리 시스템</h4>
                                                <p className={styles.numberedFeatureDesc}>포지션 사이징, 손절 설계, 자금 관리 등 손실을 제어하고 수익을 보호하는 과학적 방법론</p>
                                            </div>
                                        </li>
                                        <li>
                                            <div className={styles.numberedFeatureContent}>
                                                <h4 className={styles.numberedFeatureTitle}>실증 케이스 스터디 10건</h4>
                                                <p className={styles.numberedFeatureDesc}>급락장, 횡보장, 변동성 확대 구간 등 실제 시장에서 전략이 어떻게 작동했는지 분석한 자료</p>
                                            </div>
                                        </li>
                                    </ol>
                                    <hr className={styles.contentSeparator} />
                                    <p><strong>Vol. 1을 취득한 순간, 3일간의 디브리핑 기간이 주어집니다.</strong></p>
                                    <ul className={styles.mentoringList}>
                                        <li>이해되지 않는 개념을 질문할 수 있습니다</li>
                                        <li>실전 적용 시 막히는 부분을 검토받을 수 있습니다</li>
                                        <li>자신의 케이스를 분석 요청할 수 있습니다</li>
                                        <li>추가 학습 방향을 안내받을 수 있습니다</li>
                                    </ul>  
                                    <p>이것은 멘토링입니다. The Archive는 단순히 PDF를 판매하는 상품이 아닙니다.</p>
                                </div>
                            </div>

                            <section className={styles.whatYouGetCard} {...animWhatYouGet}>
                                <h3>WHAT YOU GET</h3>
                                <div className={styles.whatYouGetSection}>
                                    <h4>원장 구성</h4>
                                    <ul className={styles.whatYouGetList}>
                                        <li className={styles.whatYouGetItem}>
                                            <h5><span className={styles.pdfLabel}>PDF</span>스탠다드 원론집 (80페이지)</h5>
                                            <p>파생시장 및 코인 선물시장의 핵심 이론: 선물/옵션 개념, 청산 메커니즘, 펀딩비, 주문장 해석, 거래량 분석, 리스크 관리 원칙</p>
                                        </li>
                                        <li className={styles.whatYouGetItem}>
                                            <h5><span className={styles.pdfLabel}>PDF</span>전략 원장 Vol.1 — The Ledger (120페이지)</h5>
                                            <p>모멘텀 반전 전략의 완전한 문서: 전략 철학, 진입/청산 로직, 포지션 사이징, 백테스팅 결과 (2020-2024, 승률 62.4%, 샤프 1.87), 실전 가이드</p>
                                        </li>
                                        <li className={styles.whatYouGetItem}>
                                            <h5><span className={styles.pdfLabel}>PDF</span>실증 사례집 (60페이지)</h5>
                                            <p>10개 실제 시장 케이스 스터디: 급락장, 횡보장, 변동성 확대, 펀딩비 이상 등 다양한 환경에서의 전략 적용 사례 및 결과 분석</p>
                                        </li>
                                    </ul>
                                </div>
                                <div className={styles.whatYouGetSection}>
                                    <h4>동봉 혜택</h4>
                                    <ul className={styles.whatYouGetList}>
                                        <li className={styles.whatYouGetItem}>
                                            <h5>3일간 디브리핑 세션</h5>
                                            <p>현역 퀀트 팀 멤버와 1:1 연결 (텔레그램/이메일)을 통해 전략 이해, 실전 적용, 케이스 리뷰, 학습 방향 등 자유롭게 질문</p>
                                        </li>
                                        <li className={styles.whatYouGetItem}>
                                            <h5>평생 업데이트 권한</h5>
                                            <p>전략 수정 또는 시장 변화 시 업데이트 버전 무료 제공 (분기별 1-2회 업데이트 예정)</p>
                                        </li>
                                        <li className={styles.whatYouGetItem}>
                                            <h5>고유 고객 ID</h5>
                                            <p>향후 Vol.2 및 상위 정보 교류 시 기존 멤버 접근 권한 및 업그레이드 경로 우선 안내</p>
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            <section className={styles.targetAudienceSection} {...animTarget}>
                                <h3>The Archive Vol. 1은 다음과 같은 분들을 위해 작성되었습니다:</h3>
                                <ul className={styles.targetAudienceList}>
                                    <li>감정이 아닌 데이터로 트레이딩하고 싶은 분</li>
                                    <li>남의 신호가 아닌 자신의 판단으로 포지션을 열고 싶은 분</li>
                                    <li>일시적 수익이 아닌 지속 가능한 시스템을 구축하고 싶은 분</li>
                                </ul>
                                <p className={styles.warningText}>
                                    당장 10배 수익을 원하시는 분, 리딩신호를 알고싶은 분은 저희를 보지 말아주세요.
                                </p>
                                <h3>취득 후 얻게 되는 것</h3>
                                <div className={styles.benefitsGrid}>
                                    <div className={styles.benefitColumn}>
                                        <h4>기술적 자산</h4>
                                        <ul>
                                            <li>파생시장 구조 이해</li>
                                            <li>데이터 기반 전략 수립 능력</li>
                                            <li>리스크 시스템 설계 능력</li>
                                            <li>백테스팅 결과 해석 능력</li>
                                        </ul>
                                    </div>
                                    <div className={styles.benefitColumn}>
                                        <h4>실전적 자산</h4>
                                        <ul>
                                            <li>즉시 적용 가능한 검증 전략</li>
                                            <li>10가지 실제 케이스 경험</li>
                                            <li>전략 커스터마이징 능력</li>
                                            <li>시장 변화 대응 사고방식</li>
                                        </ul>
                                    </div>
                                    <div className={styles.benefitColumn}>
                                        <h4>관계적 자산</h4>
                                        <ul>
                                            <li>현역 트레이더와 직접 소통 기회</li>
                                            <li>향후 커뮤니티 접근 가능성</li>
                                            <li>추가 제품 우선 취득 자격</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>
                            
                            <section className={styles.faqBox} {...animFaq}>
                                <h3>F&Q</h3>
                                <div className={styles.accordion}>
                                    {faqItems.map((item, index) => (
                                        <div key={index} className={styles.accordionItem}>
                                            <button
                                                className={`${styles.accordionTitle} ${activeIndex === index ? styles.active : ''}`}
                                                onClick={() => toggleAccordion(index)}
                                            >
                                                {item.question}
                                                <span className={styles.icon}>{activeIndex === index ? '-' : '+'}</span>
                                            </button>
                                            <div className={`${styles.accordionContent} ${activeIndex === index ? styles.show : ''}`}>
                                                <p>{item.answer}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className={`${styles.trustBox} ${styles.card}`} {...animTrust}>
                                <h3>Trust & Principles</h3>
                                <ul className={styles.featureList}>
                                    <li>
                                        <h4>비소유권 원칙 (Non-Custodial)</h4>
                                        <p>저희는 고객님의 자산에 절대로 접근할 수 없습니다. 시스템은 거래소 API를 통해 매매 신호만 전달할 뿐, 자금의 입출금 권한은 오직 고객님 본인에게만 있습니다.</p>
                                    </li>
                                    <li>
                                        <h4>데이터 기반 의사결정 (Data-Driven)</h4>
                                        <p>시스템의 모든 판단은 주관적인 예측이 아닌, 백테스팅으로 검증된 통계적 모델에 따라 이루어집니다.</p>
                                    </li>
                                </ul>
                            </section>
                        </div>
                        <div id="details" className={`${styles.tabPane} ${activeTab === 'details' ? styles.active : ''}`}>
                            <section className={`${styles.guideBox} ${styles.card}`}>
                                <h3>사용 가이드 및 기술 백서 (PDF)</h3>
                                <p>시스템의 설치 방법부터 실전 운용 가이드, 그리고 MAXX 시스템의 핵심 전략 로직과 리스크 관리 기준이 투명하게 기술된 통합 문서입니다. 아래 링크를 통해 PDF 파일을 확인하실 수 있습니다.</p>
                                <a href="#" className={styles.pdfDownloadButton}>User Guide & Whitepaper 다운로드</a>
                            </section>
                            <section className={`${styles.performanceDataBox} ${styles.card}`}>
                                <h3>과거 데이터 기반의 백테스트 결과</h3>
                                <ul className={styles.keyValueList}>
                                    <li><span>누적 수익률 (CAGR)</span><strong>+1,240%</strong></li>
                                    <li><span>최대 손실폭 (MDD)</span><strong>-12.8%</strong></li>
                                    <li><span>평균 거래 실행 속도</span><strong>0.05초</strong></li>
                                </ul>
                                <p className={styles.disclaimer}>주의: 과거의 성과가 미래의 수익을 보장하지 않으며, 모든 투자는 시장 변동성에 따른 위험을 내포합니다. 본 데이터는 시스템의 과거 성향을 이해하기 위한 참고 자료입니다.</p>
                            </section>
                        </div>
                    </main>

                    {/* 사이드바는 변경하지 않습니다. */}
                    <aside className={styles.sidebarColumn}>
                        <div className={styles.sidebarContent}>
                            <div className={styles.collectionInfo}>
                                <img src="/로고.png" alt="MAXX Quant System logo" />
                                <a href="#">MAXX Quant System</a>
                            </div>
                            <h1 className={styles.productTitle}>MAXX Quant System v4.1</h1>
                            <div className={styles.participants}>
                                <div className={styles.participantItem}>
                                    <img src="/코빠로고1.png" alt="Creator logo" />
                                    <div>
                                        <span>Creator</span>
                                        <a href="#">kobba</a>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.actionBar}>
                                <button
                                    onClick={handleLikeClick}
                                    className={`${styles.actionBtn} ${isLiked ? styles.liked : ''}`}
                                >
                                    ♡ {likeCount}
                                </button>
                                <button onClick={handleShareClick} className={styles.actionBtn}>
                                    ↑ Share
                                </button>
                                <button className={styles.actionBtn}>↻ Refresh</button>
                                <button className={styles.actionBtn}>···</button>
                            </div>
                            <hr className={styles.separator} />
                            <div className={`${styles.priceBox} ${styles.card}`}>
                                <div className={styles.priceInfo}>
                                    <span>Price</span>
                                    <span className={styles.price}>2,100,000원</span>
                                    <span className={styles.priceSecondary}>($1,500)</span>
                                </div>
                                <button className={styles.buyButton} onClick={handleBuyNowClick}>
                                    Buy now
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
            <Footer />

            {user && (
                <PaymentModal
                    open={paymentOpen}
                    onClose={() => setPaymentOpen(false)}
                    item={itemForPay}
                    onPay={handlePayRequest}
                />
            )}
        </div>
    );
};

export default ProductDetailPage;
