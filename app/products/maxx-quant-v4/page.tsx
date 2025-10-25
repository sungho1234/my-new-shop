"use client"; 

import React, { useState } from 'react';
import Script from 'next/script';
import styles from './ProductDetail.module.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PaymentModal, { PaymentItem } from "@/components/PaymentModal";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useScrollFadeIn } from '@/hooks/useScrollFadeIn';

import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';


const faqItems = [
    { question: 'Q: 완전 초보도 따라갈 수 있나요?', answer: 'A: 네, 이 패키지는 입문자를 위해 설계되었습니다. 전담 팀원이 당신의 수준에 맞춰 설명해드립니다.' },
    { question: 'Q: 5일간의 멘토링 후에는 어떻게 하나요?', answer: 'A: 제공된 6가지 모듈 자료는 영구적으로 사용 가능하며, 과제집을 통해 스스로 성장을 이어갈 수 있습니다. 추가 멘토링이 필요한 경우 별도 프로그램을 안내해 드립니다.' },
    { question: 'Q: 수익을 보장하나요?', answer: 'A: 아니요. 그 어떤 트레이딩 교육도 수익을 보장할 수 없습니다. 우리는 올바른 방법론과 도구, 그리고 안전한 접근법을 가르칩니다. 실제 수익은 당신의 학습, 훈련, 실행에 달려 있습니다.' },
    { question: 'Q: 환불 정책은 어떻게 되나요?', answer: 'A: 구매 후 24시간 이내, 멘토링 채널 개설 전 100% 환불 가능합니다.' },
];

const itemForPay: PaymentItem = {
    title: "2025 일반인을 위한 시스템 투자 올인원",
    subtitle: "디지털 콘텐츠",
    priceLabel: "2,100,000원",
    priceValue: 2100000,
    thumbnail: "/로고.png",
};

const ProductDetailPage = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [paymentOpen, setPaymentOpen] = useState(false);
    
    const { user, addToWishlist, removeFromWishlist, isLiked } = useAuth();
    const router = useRouter();

    const productInfo = {
        id: 'maxx-quant-v4', 
        title: '2025 일반인을 위한 시스템 투자 올인원',
        author: 'kobba',
        price: '2,100,000',
        thumbnail: "/로고.png",
    };
    
    const liked = isLiked(productInfo.id);

    // 스크롤 애니메이션 훅
    const animMedia = useScrollFadeIn('up', 1, 0);
    const animHeadline = useScrollFadeIn('up', 1, 0.1);
    const animPainPoints = useScrollFadeIn('up', 1, 0);
    const animCallout = useScrollFadeIn('up', 1, 0.1);
    const animCoreValue = useScrollFadeIn('up', 1, 0); 
    const animPackageIntro = useScrollFadeIn('up', 1, 0); 
    const animModules = useScrollFadeIn('up', 1, 0); 
    const animSpecial = useScrollFadeIn('up', 1, 0.1); 
    const animResults = useScrollFadeIn('up', 1, 0); 
    const animFaq = useScrollFadeIn('up', 1, 0);
    const animFinal = useScrollFadeIn('up', 1, 0.1);

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
        if (!user) {
            if (window.confirm("로그인이 필요한 서비스입니다. 로그인 하시겠습니까?")) {
                router.push('/login');
            }
            return;
        }

        if (liked) {
            removeFromWishlist(productInfo.id);
        } else {
            addToWishlist(productInfo);
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
                        
                        <section className={`${styles.mediaContainer} ${styles.card}`} {...animMedia}>
                            <iframe 
                                src="https://www.youtube.com/embed/YOUTUBE_VIDEO_ID"
                                title="YouTube video player" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen>
                            </iframe>
                        </section>

                        <div className={styles.contentArea}>

                            {/* 메인 헤드라인 */}
                            <section {...animHeadline} className={styles.sectionSpacing}>
                                <h2 className={styles.mainHeadline}>
                                    현역 퀀트 트레이더와 함께하는<br />
                                    2025 일반인을 위한 시스템 투자 올인원
                                </h2>
                                <p className={styles.mainSubheadline}>
                                    5일간의 1:1 전담 멘토링으로 당신의 매매가 '감'이 아닌 '데이터'로<br/>
                                    바뀌는 순간을 경험하세요.
                                </p>
                            </section>

                            {/* 이런 분들을 위해 준비했습니다 */}
                            <section {...animPainPoints} className={styles.sectionSpacing}>
                                <h3 className={styles.sectionTitle}>혹시, 이런 고민을 하고 계신가요?</h3>
                                <p className={styles.subsectionTitle}>혼자 공부하며 길을 잃은 느낌이 듭니다...</p>
                                
                                <ul className={styles.styledList}>
                                    <li>"수많은 유튜브와 강의를 봤지만, 어디서부터 시작해야 할지 모르겠어요."</li>
                                    <li>"보조지표가 너무 많아 어떤 것을 믿어야 할지 혼란스러워요."</li>
                                    <li>"매매할 때마다 불안하고, 손실이 나면 멘탈이 흔들려요."</li>
                                    <li>"'수익률 75% 보장' 같은 광고가 진짜인지 가짜인지 분간이 안 돼요."</li>
                                    <li>"혼자 하면 계속 같은 실수를 반복할 것 같아 두려워요."</li>
                                </ul>
                            </section>

                            {/* 콜아웃 박스 */}
                            <section {...animCallout} className={styles.sectionSpacing}>
                                <div className={styles.calloutBox}>
                                    <p><strong>당신은 혼자가 아닙니다.</strong></p>
                                    <p>
                                        우리는 소수에게만 허락되었던 퀀트 기술의 장벽을 무너뜨리고,<br/>
                                        실력 있는 트레이더들의 성장 네트워크를 만들고 있습니다.
                                    </p>
                                </div>
                            </section>

                            {/* 도입부 문단 */}
                            <section {...animCoreValue} className={styles.sectionSpacing}>
                                <p className={styles.bodyText}>
                                    이 올인원에서는 챌린지 설정, 기술 사용 등 다루는 정보를 물어보고<br/>
                                    습득할 수 있도록 현역 트레이더 팀원 한명이 배정됩니다.
                                </p>
                                <p className={styles.bodyText}>
                                    저희는 당신의 성장에 우리의 시간과 인력을 먼저 소비 합니다.<br/>
                                    당신이 길을 잃지 않고 빠르게 성장하는 것이 곧 우리의 목표와 일치하기 떄문입니다.
                                </p>
                                <p className={styles.bodyText}>
                                    <strong>위 패키지는 트레이딩 진입장벽을 무너뜨리기 위한 저희의 투자입니다.</strong>
                                </p>
                            </section>

                            {/* 패키지 앵커 제목 */}
                            <hr className={styles.sectionSeparator} />
                            <section {...animPackageIntro} className={styles.sectionSpacing}>
                                <h3 className={styles.sectionTitle}>패키지에 포함된 6가지 핵심 자산</h3>
                                <p className={styles.mainSubheadline} style={{fontSize: "20px"}}>
                                    현역 트레이더의 1:1 멘토링부터 실전 도구 세팅까지,<br/>
                                    성장에 필요한 모든 것을 담았습니다.
                                </p>
                            </section>

                            {/* 패키지 구성 */}
                            <section {...animModules} className={styles.sectionSpacing} style={{marginTop: "-60px"}}>
                                
                                {/* 1. 퍼스널 멘토링 데스크 (강조) */}
                                <div className={styles.highlightBox}>
                                    <h4 className={styles.moduleTitle}>MODULE 1. 1:1 퍼스널 멘토링 데스크 ⭐</h4>
                                    <p className={styles.bodyText}>
                                        이 패키지의 핵심입니다. 구매 확정일로부터 <strong>5일간</strong>, 당신과 담당 팀원만 참여하는 <strong>1:1 프라이빗 채널</strong>이 개설됩니다.
                                        시간에 구애받지 않고 질문을 남겨주시면, 담당 팀원이 직접 답변드립니다.
                                    </p>
                                    
                                    <h5 className={styles.subsectionTitle}>멘토링으로 얻게 되는 4가지 핵심 가치:</h5>
                                    <ul className={styles.styledList}>
                                        <li><strong>학습의 가속화</strong><br />
                                            '원론집'과 '트레이닝북'의 모든 궁금증을 완벽히 이해할 때까지 해결해 드립니다.
                                        </li>
                                        <li><strong>성장의 방향성 검증</strong><br />
                                            '트레이닝북' 과제와 매매 일지에 대해 전문가의 피드백을 받고 방향성을 점검합니다.
                                        </li>
                                        <li><strong>실전 환경 세팅 지원</strong><br />
                                            차트 세팅, API 연동, 보안 설정 등 기술적 문제들을 단계별로 함께 해결합니다.
                                        </li>
                                        <li><strong>심리적 안정감</strong><br />
                                            혼자가 아니라는 확신. 막힐 때마다 물어볼 수 있는 전문가가 있다는 것은 큰 차이를 만듭니다.
                                        </li>
                                    </ul>
                                </div>

                                {/* 2. 원론집 */}
                                <div className={styles.moduleSpacing}>
                                    <h4 className={styles.moduleTitle}>MODULE 2. 📘 원론집 (Foundation Guidebook)</h4>
                                    <p className={styles.bodyText}>
                                        트레이딩의 기초를 탄탄하게 다지는 필수 가이드입니다. 시작부터 올바른 환경을 갖추는 것이 성공의 절반입니다.
                                    </p>
                                    <h5 className={styles.subsectionTitle}>포함 내용:</h5>
                                    <ul className={styles.styledList}>
                                        <li><strong>안전한 거래소 선택 체크리스트 (15개 항목)</strong></li>
                                        <li><strong>실전 차트 셋업 가이드 (필수 보조지표 3가지 포함)</strong></li>
                                        <li><strong>정보 필터링 원칙: '버리는 기준'을 명확히 아는 법</strong></li>
                                    </ul>
                                </div>

                                {/* 3. 지식 심화 */}
                                <div className={styles.moduleSpacing}>
                                    <h4 className={styles.moduleTitle}>MODULE 3. 📚 지식 심화 (Deep Knowledge Library)</h4>
                                    <p className={styles.bodyText}>
                                        단순한 용어 정의가 아닌, '우리 팀이 실전에서 이 개념을 어떻게 해석하고 활용하는지'를 더한 실무 중심 용어집입니다.
                                    </p>
                                    <h5 className={styles.subsectionTitle}>핵심 용어 15개 수록:</h5>
                                    <ul className={styles.styledList}>
                                        <li>추세선, 변동성, RSI, MACD, 볼린저 밴드</li>
                                        <li>지지선/저항선, 거래량 분석, 백테스팅 방법론 등</li>
                                    </ul>
                                </div>

                                {/* 4. 도구 세팅 */}
                                <div className={styles.moduleSpacing}>
                                    <h4 className={styles.moduleTitle}>MODULE 4. ⚙️ 도구 세팅 (Tool Setup Kit)</h4>
                                    <p className={styles.bodyText}>
                                        클릭 한 번으로 당신의 차트가 우리 팀이 사용하는 표준 레이아웃으로 즉시 변경됩니다. "이게 맞나?" 고민할 시간을 줄여드립니다.
                                    </p>
                                    <h5 className={styles.subsectionTitle}>포함 사항:</h5>
                                    <ul className={styles.styledList}>
                                        <li><strong>데이/스윙 트레이딩용 차트 레이아웃 3종</strong></li>
                                        <li><strong>핵심 알림(Alert) 템플릿 5종</strong></li>
                                        <li><strong>워치리스트 관리 방법론</strong></li>
                                    </ul>
                                </div>

                                {/* 5. 스캠 필터링 */}
                                <div className={styles.moduleSpacing}>
                                    <h4 className={styles.moduleTitle}>MODULE 5. 🛡️ 스캠 필터링 체크리스트</h4>
                                    <p className={styles.bodyText}>
                                        "절대 손실 없음", "75% 수익률 보장" 같은 문구들이 왜 논리적으로 불가능한지, 현역 팀이 명확히 설명해 드립니다. 스스로 위험을 걸러내는 기준을 드립니다.
                                    </p>
                                    <h5 className={styles.subsectionTitle}>보호 체크리스트 포함:</h5>
                                    <ul className={styles.styledList}>
                                        <li><strong>11가지 사기 패턴 분석</strong></li>
                                        <li><strong>피싱 및 해킹 방지 (2FA, 콜드월렛, 화이트리스트 설정)</strong></li>
                                        <li><strong>의심스러운 링크와 스마트 컨트랙트 검증 방법</strong></li>
                                    </ul>
                                </div>

                                {/* 6. 과제집 */}
                                <div className={styles.moduleSpacing}>
                                    <h4 className={styles.moduleTitle}>MODULE 6. 📊 과제집 (트레이닝북)</h4>
                                    <p className={styles.bodyText}>
                                        '감'에 의존하던 매매를 '데이터 기반'으로 교정하는 정교하게 설계된 실전 훈련 과제입니다.
                                    </p>
                                    
                                    <h5 className={styles.subsectionTitle}>5단계 훈련 프로세스:</h5>
                                    <ol className={styles.numberedFeatureList}>
                                        <li>
                                            <div className={styles.numberedFeatureContent}>
                                                <h4 className={styles.numberedFeatureTitle}>1단계: 관찰 훈련</h4>
                                                <p className={styles.numberedFeatureDesc}>30일간 매일 가격과 거래량 패턴 기록</p>
                                            </div>
                                        </li>
                                        <li>
                                            <div className={styles.numberedFeatureContent}>
                                                <h4 className={styles.numberedFeatureTitle}>2단계: 가설 수립</h4>
                                                <p className={styles.numberedFeatureDesc}>관찰 데이터를 바탕으로 진입/청산 조건 정의</p>
                                            </div>
                                        </li>
                                        <li>
                                            <div className={styles.numberedFeatureContent}>
                                                <h4 className={styles.numberedFeatureTitle}>3단계: 백테스팅</h4>
                                                <p className={styles.numberedFeatureDesc}>과거 데이터로 가설 검증 (승률, 손익비 계산)</p>
                                            </div>
                                        </li>
                                        <li>
                                            <div className={styles.numberedFeatureContent}>
                                                <h4 className={styles.numberedFeatureTitle}>4단계: 소액 실전</h4>
                                                <p className={styles.numberedFeatureDesc}>최소 금액으로 전략 실행 및 매매 일지 기록</p>
                                            </div>
                                        </li>
                                        <li>
                                            <div className={styles.numberedFeatureContent}>
                                                <h4 className={styles.numberedFeatureTitle}>5단계: 분석 및 개선</h4>
                                                <p className={styles.numberedFeatureDesc}>50회 거래 후 데이터 분석 및 규칙 수정</p>
                                            </div>
                                        </li>
                                    </ol>
                                </div>
                            </section>

                            <hr className={styles.sectionSeparator} />

                            {/* 왜 특별한가? */}
                            <section {...animSpecial} className={styles.sectionSpacing}>
                                <h3 className={styles.sectionTitle}>왜 이 패키지가 특별한가?</h3>
                                <ul className={styles.styledListCheck}>
                                    <li>
                                        <strong>양방향 성장 파트너십</strong><br />
                                        <span>
                                            일방적인 영상 강의가 아닙니다. 5일간 당신의 전담 팀원이 함께합니다.
                                        </span>
                                    </li>
                                    <li>
                                        <strong>실전 중심 콘텐츠</strong><br />
                                        <span>
                                            이론만 가르치지 않습니다. 우리 팀이 실제로 사용하는 도구, 세팅, 전략을 그대로 공유합니다.
                                        </span>
                                    </li>
                                    <li>
                                        <strong>사기 방지 교육 포함</strong><br />
                                        <span>
                                            수익률만 외치는 시장에서, 우리는 당신을 보호하는 방법부터 가르칩니다.
                                        </span>
                                    </li>
                                </ul>
                            </section>

                            {/* 기대 결과 */}
                            <section {...animResults} className={styles.sectionSpacing}>
                                <h3 className={styles.sectionTitle}>이런 결과를 기대할 수 있습니다</h3>
                                <ul className={styles.styledListCheck}>
                                    <li><strong>5일 후,</strong> 트레이딩 환경을 완벽히 세팅하고 자신감 있게 시작합니다.</li>
                                    <li><strong>30일 후,</strong> 감이 아닌 데이터로 판단을 내리는 습관이 형성됩니다.</li>
                                    <li><strong>90일 후,</strong> 자신만의 매매 시스템을 구축하고 지속적으로 개선할 수 있습니다.</li>
                                </ul>
                            </section>

                            <hr className={styles.sectionSeparator} />
                            
                            {/* FAQ */}
                            <section className={styles.faqBox} {...animFaq}>
                                <h3 className={styles.sectionTitle}>자주 묻는 질문 (FAQ)</h3>
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

                            {/* 마지막으로 */}
                            <section className={`${styles.descriptionBox} ${styles.card}`} {...animFinal}>
                                <h3 className={styles.sectionTitle}>마지막으로</h3>
                                <p className={styles.bodyText}>트레이딩은 외롭고 어려운 여정입니다.<br/>
                                    하지만 올바른 안내와 함께라면, 그 길은 훨씬 명확하고 안전해집니다.
                                </p>
                                <p className={styles.bodyText}>
                                    이 패키지는 트레이딩 진입장벽을 무너뜨리기 위한 저희의 투자입니다.<br/>
                                    우리는 당신이 길을 잃지 않고 빠르게 성장하는 것에 시간과 인력을 먼저 투자합니다.
                                </p>
                                <p className={styles.bodyText}><strong>당신의 성장이 곧 우리의 목표입니다.</strong></p>
                            </section>
                        </div>
                    </main>

                    {/* 사이드바 */}
                    <aside className={styles.sidebarColumn}>
                        <div className={styles.sidebarContent}>
                            <div className={styles.collectionInfo}>
                                <img src="/로고.png" alt="MAXX Quant System logo" />
                                <a href="#">MAXX Quant System</a>
                            </div>
                            {/* [수정] 사이드바의 메인 상품명에서 <br/> 태그 제거 */}
                            <h1 className={styles.productTitle}>일반인을 위한 시스템 투자 올인원</h1>
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
                                    className={`${styles.actionBtn} ${liked ? styles.liked : ''}`}
                                >
                                    {liked ? (
                                        <HeartIconSolid className="w-5 h-5" />
                                    ) : (
                                        <HeartIcon className="w-5 h-5" />
                                    )}
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