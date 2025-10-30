"use client"; 

import React, { useState } from 'react';
import Script from 'next/script';
import styles from './ProductDetail.module.css'; // [정보] CSS 파일은 기존 v4/first-guide와 동일한 것을 공유합니다.
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PaymentModal, { PaymentItem } from "@/components/PaymentModal";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useScrollFadeIn } from '@/hooks/useScrollFadeIn';

import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

// [ 1. 수정 ] FAQ 내용을 새 상품에 맞게 변경
const faqItems = [
    { 
        question: 'Q. 이 책에도 1:1 멘토링이나 피드백이 포함되나요?', 
        answer: 'A. 아니요, 본 상품은 \'셀프 트레이닝북\'이며 1:1 피드백은 포함되지 않습니다. 이 \'성장책\'의 기록을 바탕으로 현역 트레이더의 1:1 피드백과 지원을 받기 원하신다면, "일반인을 위한 시스템 투자 올인원" 패키지를 이용하셔야 합니다.' 
    },
    { 
        question: 'Q. 이 책을 보면 바로 수익을 낼 수 있나요?', 
        answer: 'A. 아닙니다. 이 책은 \'수익을 내는 비법\'을 알려주는 것이 아니라, \'스스로 성장하는 방법\'과 \'시장의 위험을 피하는 방법\'을 다룹니다. 감에 의존하는 매매를 멈추고, 데이터를 기반으로 스스로를 분석하고 훈련하는 \'올바른 습관\'을 만드는 것이 이 책의 유일한 목표입니다.' 
    },
    { 
        question: 'Q. 구매 후 자료는 어떻게 받나요?', 
        answer: 'A. 구매 즉시 [PDF 다운로드 링크]가 회원님의 이메일(또는 내 강의실)로 자동 전송됩니다.' 
    },
];

// [ 2. 수정 ] 결제 정보를 새 상품에 맞게 변경
const itemForPay: PaymentItem = {
    title: "일반인의 성장책: 스캠필터와 챌린지",
    subtitle: "데이터 기반 훈련법",
    priceLabel: "60,000원",
    priceValue: 60000,
    thumbnail: "/로고.png",
};

const ProductDetailPage = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [paymentOpen, setPaymentOpen] = useState(false);
    
    const { user, addToWishlist, removeFromWishlist, isLiked, isPurchased } = useAuth();
    const router = useRouter();

    // [ 3. 수정 ] 찜하기 정보를 새 상품에 맞게 변경
    const productInfo = {
        id: 'growth-book',
        title: '일반인의 성장책: 스캠필터와 챌린지',
        author: 'kobba',
        price: '60,000',
        thumbnail: "/로고.png",
    };
    
    const liked = isLiked(productInfo.id);

    // 스크롤 애니메이션 훅 (기존과 동일)
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
            merchant_uid: `GROWTH-${new Date().getTime()}`,
            name: item.title,
            amount: 100, // 테스트 금액
            buyer_email: "test@example.com",
            buyer_name: user?.nickname || "테스터",
            buyer_tel: "010-1234-5678",
        };

        IMP.request_pay(payData, async (rsp: any) => {
            if (rsp.success) {
                try {
                    const response = await fetch('/api/purchases', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            kakaoId: user?.id,
                            productId: productInfo.id,
                            amount: payData.amount,
                        }),
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || '구매 기록 저장에 실패했습니다.');
                    }

                    alert("결제가 완료되었습니다. 구매내역 페이지에서 확인하실 수 있습니다.");

                } catch (error) {
                    console.error(error);
                    const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";
                    alert(`결제는 성공했으나 구매 기록 저장 중 오류가 발생했습니다: ${errorMessage}. 관리자에게 문의해주세요.`);
                }
            } else {
                alert("결제에 실패하였습니다. 에러: " + rsp.error_msg);
            }
        });
    };

    const handleBuyNowClick = () => {
        if (!user) {
            if (window.confirm("로그인이 필요한 서비스입니다. 로그인 하시겠습니까?")) {
                router.push('/login');
            }
            return;
        }

        // 중복 구매 체크
        if (isPurchased(productInfo.id)) {
            alert("이미 구매하신 상품입니다.");
            return;
        }

        setPaymentOpen(true);
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
                                src="https://www.youtube.com/embed/YOUTUBE_VIDEO_ID" // (성장책용 영상 ID로 변경)
                                title="YouTube video player" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen>
                            </iframe>
                        </section>

                        {/* [ 4. 수정 ] 메인 콘텐츠 영역을 새 상품 내용으로 전체 교체 */}
                        <div className={styles.contentArea}>

                            {/* 메인 헤드라인 */}
                            <section {...animHeadline} className={styles.sectionSpacing}>
                                <h2 className={styles.mainHeadline}>
                                    일반인의 성장책: 스캠필터와 챌린지
                                </h2>
                                <p className={styles.mainSubheadline}>
                                    [스스로를 '분석'하고 '성장'시키는 데이터 기반 훈련법입니다.]
                                </p>
                            </section>

                            {/* 도입부 문단 */}
                            <section {...animIntro} className={styles.sectionSpacing}>
                                <p className={styles.bodyText}>
                                    성급한 매매로 돈을 잃고, 사기성 정보에 속거나<br/>
                                    해킹당한 경험이 있으신가요?
                                </p>
                                <p className={styles.bodyText}>
                                    이 성장책에는 위험을 피하는 <strong>'스캠 필터링'</strong>과 저희 팀이 신입에게 가장 먼저 가르치는 '생존 원칙',<br/>
                                    그리고 <strong>'데이터 기반 훈련법'</strong>을 모두 담았습니다.
                                </p>
                                <p className={styles.bodyText}>
                                    더 이상 '감'이 아닌, 스스로의 실력을 '데이터'로 분석하고<br/>
                                    성장하는 과정을 직접 경험하세요.
                                </p>
                            </section>

                            {/* 패키지 앵커 제목 */}
                            <hr className={styles.sectionSeparator} />
                            <section {...animPackageIntro} className={styles.sectionSpacing}>
                                <h3 className={styles.sectionTitle}>이 성장책에 포함된 모든 것</h3>
                            </section>

                            {/* 패키지 구성 */}
                            <section {...animModules} className={styles.sectionSpacing} style={{marginTop: "-60px"}}>
                                
                                {/* PART 1. 스캠 필터링 */}
                                <div className={styles.moduleSpacing}>
                                    <h4 className={styles.moduleTitle}>PART 1. 🛡️ 스캠 필터링 체크리스트 (위험 회피 가이드)</h4>
                                    <p className={styles.bodyText}>
                                        위험한 사기 정보와 해킹을 스스로 피하는 '기준'을 세웁니다.
                                    </p>
                                    
                                    <h5 className={styles.subsectionTitle}>사기성 정보 판별법</h5>
                                    <p className={styles.bodyText}>
                                        "절대 손실 없음", "월 75% 수익 보장" 같은 시장의 흔한 사기 문구들이 왜 논리적으로 불가능한지 현역 트레이딩 팀이 직접 설명해 드립니다.
                                    </p>
                                    
                                    <h5 className={styles.subsectionTitle}>자산 보호 가이드</h5>
                                    <p className={styles.bodyText}>
                                        위험한 정보들을 스스로 걸러낼 수 있는 체크리스트, 해킹 방지법, 그리고 디파이(DeFi) 이용 시 사기 링크를 구별하는 실용적인 방법을 제공합니다.
                                    </p>
                                </div>

                                {/* PART 2. 과제집 */}
                                <div className={styles.moduleSpacing}>
                                    <h4 className={styles.moduleTitle}>PART 2. 📊 과제집 (데이터 기반 트레이닝북)</h4>
                                    <p className={styles.bodyText}>
                                        '감(感)'으로 하던 매매를 멈추고, '데이터'로 판단하도록 훈련합니다.
                                    </p>

                                    <h5 className={styles.subsectionTitle}>데이터 기반 습관 교정</h5>
                                    <p className={styles.bodyText}>
                                        단순한 학습지가 아닌, 당신의 매매 습관을 '데이터 기반'으로 교정하는 실전 훈련 과제입니다.
                                    </p>
                                    
                                    <h5 className={styles.subsectionTitle}>'관점' 체득 훈련</h5>
                                    <p className={styles.bodyText}>
                                        정교하게 설계된 명확한 미션을 수행하고 그 결과를 기록하는 과정을 통해, '감'에 의존하던 매매를 멈추고 '데이터'로 시장을 분석하는 관점을 체득하게 됩니다.
                                    </p>

                                    <h5 className={styles.subsectionTitle}>[연계] '올인원' 패키지 활용</h5>
                                    <p className={styles.bodyText}>
                                        스스로의 실력을 분석하고 데이터로 확인하는 가장 확실한 훈련 방식입니다. ("일반인을 위한 시스템 투자 올인원" 이용 시, 이 기록을 바탕으로 현역 트레이더의 1:1 피드백 및 지원을 받을 수 있습니다.)
                                    </p>
                                </div>
                            </section>

                            <hr className={styles.sectionSeparator} />

                            {/* 추천 대상 */}
                            <section {...animRecommend} className={styles.sectionSpacing}>
                                <h3 className={styles.sectionTitle}>이런 분들에게 추천합니다</h3>
                                <ul className={styles.styledListCheck}>
                                    {/* CSS가 '✓'를 추가하므로 텍스트의 '✔️'는 제거합니다 */}
                                    <li>성급하고 감정적인 매매로 손실을 본 경험이 있는 분</li>
                                    <li>시장의 사기성 정보(스캠)를 <strong>구별하는 '기준'</strong>이 필요한 분</li>
                                    <li>해킹이나 보안 위협으로부터 자산을 스스로 지키고 싶은 분</li>
                                    <li>매매일지를 어떻게 써야 할지, 무엇을 기록해야 할지 막막했던 분</li>
                                    <li>스스로의 실력을 '데이터'로 분석하고 체계적으로 성장하고 싶은 분</li>
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
                            
                            {/* [ 5. 수정 ] 사이드바 상품명 변경 (가독성을 위해 2줄로) */}
                            <h1 className={styles.productTitle}>일반인의 성장책:<br/>스캠필터와 챌린지</h1>
                            
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
                                    {/* [ 6. 수정 ] 사이드바 가격 변경 (임시 50,000원) */}
                                    <span className={styles.price}>50,000원</span>
                                    <span className={styles.priceSecondary}>($35)</span>
                                    {/* (달러 가격은 제거) */}
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