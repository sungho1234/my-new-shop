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

// FAQ 내용은 동일
const faqItems = [
    { 
        question: 'Q. \'실행 엔진(지표)\'이나 \'1:1 멘토링\'도 포함되나요?', 
        answer: 'A. 아니요, 본 상품은 \'시스템 빌더 풀 패키지\'에서 \'실행 엔진(지표)\', \'해설 영상\', \'1:1 멘토링\'이 모두 제외된 핵심 이론 패키지입니다. 오직 \'전략 설계도(PDF)\'와 \'실증 사례집(PDF)\' 두 가지만 제공됩니다.' 
    },
    { 
        question: 'Q. 이 자료만 봐도 수익을 낼 수 있나요?', 
        answer: 'A. 본 자료는 전략의 \'이론\'과 \'과거 데이터\'를 제공하며, 이것이 미래 수익을 보장하지 않습니다. 이 자료는 당신이 \'프로의 전략 원리\'를 학습하고, 시장을 데이터로 해석하는 \'눈\'을 갖도록 돕는 것을 목표로 합니다. 실제 실행과 판단은 본인의 몫입니다.' 
    },
    { 
        question: 'Q. 구매 후 자료는 어떻게 받나요?', 
        answer: 'A. 구매 즉시 \'전략 설계도(PDF)\'와 \'실증 사례집(PDF)\' 다운로드 링크가 회원님의 이메일(또는 내 강의실)로 자동 전송됩니다.' 
    },
];

// [ 1. 수정 ] 결제 정보를 90,000원으로 변경
const itemForPay: PaymentItem = {
    title: "프로의 전략 원본",
    subtitle: "시스템 설계도와 데이터 분석",
    priceLabel: "90,000원",
    priceValue: 90000,
    thumbnail: "/로고.png", 
};

const ProductDetailPage = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [paymentOpen, setPaymentOpen] = useState(false);
    
    const { user, addToWishlist, removeFromWishlist, isLiked } = useAuth();
    const router = useRouter();

    // [ 2. 수정 ] 찜하기 정보를 90,000원으로 변경
    const productInfo = {
        id: 'strategy-source', 
        title: '프로의 전략 원본: 시스템 설계도와 데이터 분석',
        author: 'kobba',
        price: '90,000',
        thumbnail: "/로고.png", 
    };
    
    const liked = isLiked(productInfo.id);

    // 스크롤 애니메이션 훅
    const animMedia = useScrollFadeIn('up', 1, 0);
    const animHeadline = useScrollFadeIn('up', 1, 0.1);
    const animIntro = useScrollFadeIn('up', 1, 0);
    const animPackageIntro = useScrollFadeIn('up', 1, 0.1);
    const animModules = useScrollFadeIn('up', 1, 0); 
    const animRecommend = useScrollFadeIn('up', 1, 0.1); 
    const animFaq = useScrollFadeIn('up', 1, 0);

    const toggleAccordion = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    // 결제 핸들러
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
            merchant_uid: `STRATEGY-${new Date().getTime()}`, 
            name: item.title,
            amount: 100, // 테스트 금액 (실제 결제 시 item.priceValue 또는 90000 사용)
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

    // 'Buy now' 버튼 핸들러
    const handleBuyNowClick = () => {
        if (user) {
            setPaymentOpen(true);
        } else {
            if (window.confirm("로그인이 필요한 서비스입니다. 로그인 하시겠습니까?")) {
                router.push('/login');
            }
        }
    };

    // 찜하기 핸들러
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

    // 공유 핸들러
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
                                    프로의 전략 원본: 시스템 설계도와 데이터 분석
                                </h2>
                                <p className={styles.mainSubheadline}>
                                    [시스템의 '두뇌'와 '운행 기록' 원본.<br/>
                                    프로의 전략 원리를 획득합니다.]
                                </p>
                            </section>

                            {/* 도입부 문단 */}
                            <section {...animIntro} className={styles.sectionSpacing}>
                                <p className={styles.bodyText}>
                                    이 자료는 저희 집단에서 수익을 창출하는 시스템에서 가장 중요한<br/>
                                    <strong>'두뇌'</strong>에 해당하는 핵심 설계도와, 그 논리가 실제 시장에서 어떻게 작동했는지를 증명하는 <strong>'운행 기록'</strong> 입니다.
                                </p>
                                <p className={styles.bodyText}>
                                    당신은 이 자료를 통해 단순히 하나의 전략을 배우는 것을 넘어,<br/>
                                    시장을 데이터로 해석하고 증명하는 프로의 시스템 원리 그 자체를 얻게 될 것입니다.
                                </p>
                            </section>

                            {/* 패키지 앵커 제목 */}
                            <hr className={styles.sectionSeparator} />
                            <section {...animPackageIntro} className={styles.sectionSpacing}>
                                <h3 className={styles.sectionTitle}>이 전략 원본에 포함된 모든 것</h3>
                            </section>

                            {/* 패키지 구성 */}
                            <section {...animModules} className={styles.sectionSpacing} style={{marginTop: "-60px"}}>
                                
                                {/* PART 1. 전략 설계도 */}
                                <div className={styles.moduleSpacing}>
                                    <h4 className={styles.moduleTitle}>PART 1. 🗺️ 전략 설계도 (심층 분석 PDF)</h4>
                                    <p className={styles.bodyText}>
                                        이것은 단순한 매뉴얼이 아닙니다. 이 전략이 '어떤 시장의 비효율성을 공략하기 위해 탄생했는지' 그 근본적인 배경과 철학, 그리고 그것을 구현하는 핵심 기술을 담은 심층 분석 문서입니다.
                                    </p>
                                    <ul className={styles.styledList}>
                                        <li>
                                            당신은 '왜' 이 전략이 효과가 있는지 근본적으로 이해하게 됩니다.
                                        </li>
                                        <li>
                                            시장을 바라보는 새로운 관점, 즉 '비효율성을 찾는 눈'을 갖게 됩니다.
                                        </li>
                                    </ul>
                                </div>

                                {/* PART 2. 실증 사례집 */}
                                <div className={styles.moduleSpacing}>
                                    <h4 className={styles.moduleTitle}>PART 2. 📊 실증 사례집 (데이터 분석 PDF)</h4>
                                    <p className={styles.bodyText}>
                                        이론은 실제 시장에서 증명되어야 합니다. 이 시스템이 과거의 "특정 시장 (상승장, 하락장, 횡보장)"에서 구체적으로 어떻게 수익을 창출했는지, 모든 데이터를 상세히 분석한 사례 연구 자료입니다.
                                    </p>
                                    <ul className={styles.styledList}>
                                        <li>
                                            이 자료는 과거 데이터상 어떤 퍼포먼스를 보여줬는지 숫자와 데이터로 보여줍니다.
                                        </li>
                                        <li>
                                            다양한 시장 국면에서도 시스템이 어떻게 잠재적 기회를 포착하고 리스크를 관리했는지 명확히 인지하여, 전략에 대한 객관적인 이해를 돕습니다.
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            <hr className={styles.sectionSeparator} />

                            {/* 추천 대상 */}
                            <section {...animRecommend} className={styles.sectionSpacing}>
                                <h3 className={styles.sectionTitle}>이런 분들에게 추천합니다</h3>
                                <ul className={styles.styledListCheck}>
                                    <li>'실행 도구(지표)'보다는 전략의 <strong>'핵심 논리'와 '철학'</strong>이 궁금한 분</li>
                                    <li>'왜' 이 전략이 작동하는지 근본적인 <strong>'증거(데이터)'</strong>를 확인하고 싶은 분</li>
                                    <li>언젠가 자신만의 시스템을 직접 만들고 싶은 '시스템 빌더' 지망생</li>
                                    <li>'시스템 빌더 풀 패키지' 구매 전, 핵심 이론을 먼저 확인하고 싶은 분</li>
                                    <li>시장의 <strong>'비효율성'</strong>을 찾아내는 프로의 관점을 배우고 싶은 분</li>
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
                            
                        </div>
                    </main>

                    {/* 사이드바 */}
                    <aside className={styles.sidebarColumn}>
                        <div className={styles.sidebarContent}>
                            <div className={styles.collectionInfo}>
                                <img src="/로고.png" alt="MAXX Quant System logo" />
                                <a href="#">MAXX Quant System</a>
                            </div>
                            
                            <h1 className={styles.productTitle}>프로의 전략 원본:<br/>시스템 설계도와 데이터 분석</h1>
                            
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
                                    {/* [ 3. 수정 ] 사이드바 가격을 90,000원으로 변경 */}
                                    <span className={styles.price}>90,000원</span>
                                    <span className={styles.priceSecondary}>($75)</span>
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