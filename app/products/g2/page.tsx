"use client"; 

import React, { useState } from 'react';
import Script from 'next/script';
import styles from './ProductDetail.module.css'; // [정보] CSS 파일은 기존 v4와 동일한 것을 공유합니다.
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
        question: 'Q. 이 안내서에도 1:1 멘토링이 포함되나요?', 
        answer: 'A. 아니요, 본 상품은 1:1 멘토링 및 과제집 피드백이 제외된 \'핵심 셋업 가이드\'입니다. 현역 트레이더의 검증된 기준과 차트 세팅을 스스로 학습하고 적용할 수 있도록 구성된 셀프 가이드북입니다. 1:1 밀착 지원이 필요하신 분은 \'시스템 투자 올인원\' 패키지를 권장합니다.' 
    },
    { 
        question: 'Q. 이 안내서만 보면 바로 수익을 낼 수 있나요?', 
        answer: 'A. 아닙니다. 이 안내서는 \'수익을 내는 법\'을 알려주는 매매 전략서가 아닙니다. 이것은 트레이딩을 시작하기 위한 가장 단단하고 효율적인 \'기초 공사\' 가이드입니다. 잘못된 세팅과 불필요한 정보 탐색으로 낭비되는 시간을 수십 시간 절약하고, 올바른 \'관점\'으로 시작할 수 있도록 돕는 것이 이 안내서의 유일한 목표입니다.' 
    },
    { 
        question: 'Q. 구매 후 안내서는 어떻게 받나요?', 
        answer: 'A. 구매 즉시 [콘텐츠를 볼 수 있는 페이지 링크] 또는 [PDF 다운로드 링크]가 회원님의 이메일(또는 내 강의실)로 자동 전송됩니다. 트레이딩뷰 링크 또한 자료 내에 포함되어 있습니다.' 
    },
];

// [ 2. 수정 ] 결제 정보를 새 상품에 맞게 변경
const itemForPay: PaymentItem = {
    title: "일반인을 위한 첫번째 안내서",
    subtitle: "거래소 선택부터 차트 셋업까지",
    priceLabel: "70,000원",
    priceValue: 70000, // 실제 결제될 금액
    thumbnail: "/로고.png", // (상품 썸네일 이미지 경로)
};

const ProductDetailPage = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [paymentOpen, setPaymentOpen] = useState(false);
    
    const { user, addToWishlist, removeFromWishlist, isLiked } = useAuth();
    const router = useRouter();

    // [ 3. 수정 ] 찜하기 정보를 새 상품에 맞게 변경
    const productInfo = {
        id: 'first-guide', // 고유 ID (폴더명과 일치 권장)
        title: '일반인을 위한 첫번째 안내서',
        author: 'kobba',
        price: '70,000',
        thumbnail: "/로고.png", // (상품 썸네일 이미지 경로)
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
    // (animFinal은 이 페이지에서 사용되지 않음)

    const toggleAccordion = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    // (결제, 구매, 찜하기, 공유 핸들러 함수들은 기존과 모두 동일)
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
            merchant_uid: `GUIDE-${new Date().getTime()}`, // (상품 고유 Prefix)
            name: item.title,
            amount: 100, // 테스트 금액 (실제 결제 시 item.priceValue 사용)
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
                                src="https://www.youtube.com/embed/YOUTUBE_VIDEO_ID" // (가이드북용 영상 ID로 변경)
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
                                    일반인을 위한 첫번째 안내서
                                </h2>
                                <p className={styles.mainSubheadline}>
                                    [현역 트레이더의 '시작 세팅법'과 '관점'을<br/> 당신의 모니터에 복사해 드립니다.]
                                </p>
                            </section>

                            {/* 도입부 문단 */}
                            <section {...animIntro} className={styles.sectionSpacing}>
                                <p className={styles.bodyText}>
                                    이 안내서는 [Your Team Name] 트레이딩 팀이 수많은 시행착오 끝에 결론내린,<br/>
                                    가장 깔끔하고 효율적인 <strong>'시작 세팅법'</strong>입니다.
                                </p>
                                <p className={styles.bodyText}>
                                    트레이딩을 처음 시작할 때 겪는 막연한 혼란과 시간 낭비를 끝내기 위해,<br/>
                                    검증된 전문가의 시야와 관점을 당신의 모니터에 그대로 복사해 드립니다.
                                </p>
                                <p className={styles.bodyText}>
                                    불필요한 정보는 걷어내고, '실제로 수익을 내는 팀'이 집중하는 핵심에만 집중하세요.
                                </p>
                            </section>

                            {/* 패키지 앵커 제목 */}
                            <hr className={styles.sectionSeparator} />
                            <section {...animPackageIntro} className={styles.sectionSpacing}>
                                <h3 className={styles.sectionTitle}>이 안내서에 포함된 모든 것</h3>
                            </section>

                            {/* 패키지 구성 */}
                            <section {...animModules} className={styles.sectionSpacing} style={{marginTop: "-60px"}}>
                                
                                {/* PART 1. 원론집 */}
                                <div className={styles.moduleSpacing}>
                                    <h4 className={styles.moduleTitle}>PART 1. 📘 원론집 (확실한 기준 세우기)</h4>
                                    <p className={styles.bodyText}>
                                        '왜' 그렇게 해야 하는가에 대한 명확한 철학과 기준을 세웁니다.
                                    </p>
                                    <ul className={styles.styledList}>
                                        <li>
                                            <strong>'안전하고 효율적인 거래소 선택 기준' 체크리스트</strong><br />
                                            보안, 수수료, 유동성, 기능 등. 저희 팀이 '단 하나의 거래소'를 선택할 때 사용하는 실제 체크리스트와 그 이유를 공개합니다.
                                        </li>
                                        <li>
                                            <strong>'관점이 담긴' 셋업 가이드</strong><br />
                                            저희 팀이 데이터를 분석할 때 '어떤 기능'을, '왜' 사용하는지에 대한 명확한 관점을 공유합니다. 수십 가지 보조지표 중 살아남은 필수 지표와 시간을 낭비하지 않는 세팅법을 알려드립니다.
                                        </li>
                                        <li>
                                            <strong>'버리는 기준'에 대한 철학</strong><br />
                                            "정보의 홍수 속에서 가장 중요한 것은 '버리는 기준'입니다." 왜 저희는 2~3가지 보조지표만 화면에 둘까요? 차트를 깔끔하게 만들고 판단을 명료하게 만드는 팀의 확고한 철학을 공유합니다.
                                        </li>
                                    </ul>
                                </div>

                                {/* PART 2. 지식 심화 */}
                                <div className={styles.moduleSpacing}>
                                    <h4 className={styles.moduleTitle}>PART 2. 📚 지식 심화 (실전 용어 해석집)</h4>
                                    <p className={styles.bodyText}>
                                        용어의 '정의'가 아닌 '실전 해석'을 배웁니다.
                                    </p>
                                    <h5 className={styles.subsectionTitle}>현역 트레이더의 퀀트 용어집</h5>
                                    <p className={styles.bodyText}>
                                        단순히 용어를 정의(Define)하지 않습니다. '우리 팀은 이 용어를 실전에서 이렇게 해석하고 활용한다'는 '관점(Perspective)'을 더한 실전 용어집입니다.
                                    </p>
                                    <h5 className={styles.subsectionTitle}>핵심 용어 15가지 (실전 차트 포함)</h5>
                                    <p className={styles.bodyText}>
                                        '추세선', '지지/저항', '변동성' 등. 초보자가 가장 헷갈려 하지만 실전에서 매일 쓰이는 핵심 용어 15개를 선별하여, '어떻게 해석해야 하는지'를 해설합니다.
                                    </p>
                                </div>

                                {/* PART 3. 도구 세팅 */}
                                <div className={styles.moduleSpacing}>
                                    <h4 className={styles.moduleTitle}>PART 3. ⚙️ 도구 세팅 (차트 즉시 복사)</h4>
                                    <p className={styles.bodyText}>
                                        클릭 한 번으로 전문가의 차트를 그대로 복사합니다.
                                    </p>
                                    <h5 className={styles.subsectionTitle}>1-Click 트레이딩뷰 표준 레이아웃 링크</h5>
                                    <p className={styles.bodyText}>
                                        클릭 한 번으로 당신의 트레이딩뷰 차트가 저희 팀의 표준 레이아웃(필수 이평선, 핵심 보조지표, 차트 색상 설정)으로 즉시 변경되는 공유 링크를 제공합니다.
                                    </p>
                                    <h5 className={styles.subsectionTitle}>더 이상 세팅에 시간을 낭비하지 마세요</h5>
                                    <p className={styles.bodyText}>
                                        잘못된 세팅으로 시간을 낭비하거나 혼란을 겪을 필요 없이, 검증된 전문가의 환경에서 즉시 시작할 수 있습니다.
                                    </p>
                                </div>
                            </section>

                            <hr className={styles.sectionSeparator} />

                            {/* 추천 대상 */}
                            <section {...animRecommend} className={styles.sectionSpacing}>
                                <h3 className={styles.sectionTitle}>이런 분들에게 추천합니다</h3>
                                <ul className={styles.styledListCheck}>
                                    <li>✔️ 코인/주식/선물 트레이딩을 이제 막 시작하려는 완전 초보자</li>
                                    <li>✔️ 수많은 정보와 보조지표 속에서 길을 잃고 혼란스러운 분</li>
                                    <li>✔️ '전문가들은 도대체 차트를 어떻게 세팅할까?' 궁금했던 분</li>
                                    <li>✔️ 1:1 멘토링은 부담스럽지만, 전문가의 핵심 노하우만 빠르게 얻고 싶은 분</li>
                                    <li>✔️ 복잡한 것은 질색이고, 가장 효율적인 시작점을 원하는 분</li>
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

                            {/* [ 5. 수정 ] '마지막으로' 섹션은 이 상품에 없으므로 삭제함 */}
                            
                        </div>
                    </main>

                    {/* 사이드바 */}
                    <aside className={styles.sidebarColumn}>
                        <div className={styles.sidebarContent}>
                            <div className={styles.collectionInfo}>
                                <img src="/로고.png" alt="MAXX Quant System logo" />
                                <a href="#">MAXX Quant System</a>
                            </div>
                            
                            {/* [ 6. 수정 ] 사이드바 상품명 변경 */}
                            <h1 className={styles.productTitle}>일반인을 위한 첫번째 안내서</h1>
                            
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
                                    {/* [ 7. 수정 ] 사이드바 가격 변경 */}
                                    <span className={styles.price}>70,000원</span>
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