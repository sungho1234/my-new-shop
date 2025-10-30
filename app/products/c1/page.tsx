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
        question: 'Q. 이 \'실행 엔진\'은 자동으로 매매해 주나요?', 
        answer: 'A. 아닙니다. 본 \'실행 엔진\'은 자동 매매 프로그램(Bot)이 아니며, 트레이딩뷰(TradingView) 차트에서 명확한 \'진입\', \'청산\', \'리스크 관리\' 시그널을 시각적으로 알려주는 전용 지표(Indicator)입니다. 모든 최종 판단과 주문은 사용자 본인이 직접 실행해야 합니다.' 
    },
    { 
        question: 'Q. \'일반인을 위한 올인원\' 패키지와는 무엇이 다른가요?', 
        answer: 'A. \'올인원 패키지\'가 트레이딩을 처음 시작하는 입문자를 위한 \'기초 세팅\'과 \'훈련법\'에 초점을 맞췄다면, 본 \'시스템 빌더 패키지\'는 이미 기초를 아는 분들을 대상으로 현역 팀이 사용하는 구체적인 \'전략\'과 \'실행 도구(지표)\' 자체를 제공하는 상위 레벨의 패키지입니다.' 
    },
    { 
        question: 'Q. 구매 후 콘텐츠는 어떻게 받나요?', 
        answer: 'A. 구매 즉시 모든 PDF 자료와 영상 링크에 접근할 수 있습니다. \'실행 엔진(트레이딩뷰 지표)\'은 [트레이딩뷰 ID를 통해 접근 권한 부여 방식 설명] 방식으로 제공되며, \'퍼스널 멘토링\'은 [안내 방식, 예: 24시간 이내] 프라이빗 채널로 초대됩니다.' 
    },
];

// [ 2. 수정 ] 결제 정보를 새 상품에 맞게 변경 (가격 임시 설정)
const itemForPay: PaymentItem = {
    title: "시스템 빌더 풀 패키지",
    subtitle: "실행 엔진, 1:1 지원, 멤버십 키",
    priceLabel: "210,000원", // (원하시는 가격으로 수정)
    priceValue: 210000,        // (원하시는 가격으로 수정)
    thumbnail: "/로고.png", // (상품 썸네일 이미지 경로)
};

const ProductDetailPage = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [paymentOpen, setPaymentOpen] = useState(false);
    
    const { user, addToWishlist, removeFromWishlist, isLiked } = useAuth();
    const router = useRouter();

    // [ 3. 수정 ] 찜하기 정보를 새 상품에 맞게 변경
    const productInfo = {
        id: 'system-builder', // 고유 ID (폴더명과 일치 권장)
        title: '시스템 빌더 풀 패키지',
        author: 'kobba',
        price: '210,000',     // (원하시는 가격으로 수정)
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
            merchant_uid: `BUILDER-${new Date().getTime()}`, // (상품 고유 Prefix)
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
                                src="https://www.youtube.com/embed/YOUTUBE_VIDEO_ID" // (빌더 패키지용 영상 ID로 변경)
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
                                    시스템 빌더 풀 패키지
                                </h2>
                                <p className={styles.mainSubheadline}>
                                    [최고의 설계도를 손에 넣는 것을 넘어,<br/>
                                    현역 팀의 도구와 1:1 지원까지 모두 제공합니다.]
                                </p>
                            </section>

                            {/* 도입부 문단 */}
                            <section {...animIntro} className={styles.sectionSpacing}>
                                <p className={styles.bodyText}>
                                    당신은 더 이상 이론을 공부하는 '관찰자'가 아닙니다.<br/>
                                    강력한 <strong>'실행 엔진'</strong>을 장착하고, 현역 팀원과 직접 소통하는 <strong>'트레이더'</strong>로 거듭납니다.
                                </p>
                                <p className={styles.bodyText}>
                                    이것은 지식 단계를 끝내고, 프로의 세계에 접속하는 완전한 권한입니다.
                                </p>
                            </section>

                            {/* 패키지 앵커 제목 */}
                            <hr className={styles.sectionSeparator} />
                            <section {...animPackageIntro} className={styles.sectionSpacing}>
                                <h3 className={styles.sectionTitle}>이 풀 패키지에 포함된 모든 것</h3>
                            </section>

                            {/* 패키지 구성 */}
                            <section {...animModules} className={styles.sectionSpacing} style={{marginTop: "-60px"}}>
                                
                                {/* PART 1. 실행 엔진 */}
                                <div className={styles.moduleSpacing}>
                                    <h4 className={styles.moduleTitle}>PART 1. ⚙️ [핵심 도구] 실행 엔진 (트레이딩뷰 전용 지표)</h4>
                                    <p className={styles.bodyText}>
                                        '전략 설계도'의 복잡한 핵심 로직(진입, 청산, 리스크 관리)이<br/>
                                        모두 내장된 트레이딩뷰 전용 지표입니다.
                                    </p>
                                    <p className={styles.bodyText}>
                                        당신은 더 이상 복잡한 분석을 직접 할 필요가 없습니다.<br/>
                                        이 하나의 지표가 제시하는 명확한 시그널을 활용하여 즉각적인 트레이딩 판단을 내릴 수 있습니다.
                                    </p>
                                </div>

                                {/* PART 2. 전략 설계도 */}
                                <div className={styles.moduleSpacing}>
                                    <h4 className={styles.moduleTitle}>PART 2. 🗺️ 전략 설계도 (심층 분석 PDF)</h4>
                                    <p className={styles.bodyText}>
                                        이것은 단순한 매뉴얼이 아닙니다. '실행 엔진'이 어떤 시장의 비효율성을 공략하기 위해 탄생했는지, 그 근본 철학과 핵심 기술을 담은 심층 분석 문서입니다.
                                    </p>
                                    <p className={styles.bodyText}>
                                        당신은 '왜' 이 전략이 효과가 있는지 근본적으로 이해하게 됩니다.<br/>
                                        시장을 바라보는 새로운 관점, 즉 '비효율성을 찾는 눈'을 갖게 됩니다.
                                    </p>
                                </div>

                                {/* PART 3. 실증 사례집 */}
                                <div className={styles.moduleSpacing}>
                                    <h4 className={styles.moduleTitle}>PART 3. 📊 실증 사례집 (데이터 분석 PDF)</h4>
                                    <p className={styles.bodyText}>
                                        이론은 실제 시장에서 증명되어야 합니다. 이 시스템이 과거의 특정 시장(상승장, 하락장, 횡보장)에서 구체적으로 어떻게 수익을 창출했는지, 모든 데이터를 상세히 분석한 사례 연구 자료입니다.
                                    </p>
                                    <ul className={styles.styledList}>
                                        <li>과거 데이터상 어떤 퍼포먼스를 보여줬는지 숫자와 데이터로 명확히 보여줍니다.</li>
                                        <li>다양한 시장 국면에서 시스템이 어떻게 기회를 포착하고 리스크를 관리했는지 인지하여, 전략에 대한 객관적인 이해를 돕습니다.</li>
                                    </ul>
                                </div>

                                {/* PART 4. 해설 영상 */}
                                <div className={styles.moduleSpacing}>
                                    <h4 className={styles.moduleTitle}>PART 4. 🎬 해설 영상 (트레이더 브리핑)</h4>
                                    <p className={styles.bodyText}>
                                        '전략 설계도'와 '실증 사례집'의 핵심 내용을 현역 트레이더가 직접 해설합니다. 텍스트만으로는 전달할 수 없었던 전략의 미묘한 디테일과 데이터를 해석하는 관점을 공유합니다.
                                    </p>
                                    <ul className={styles.styledList}>
                                        <li>
                                            <strong>전략의 '왜':</strong> 이 전략이 탄생한 배경과 로직의 핵심을 영상 해설로 더 깊이 있게 설명합니다.
                                        </li>
                                        <li>
                                            <strong>데이터의 '어떻게':</strong> 실증 사례집의 데이터를 실제 차트와 함께 복기하며, 시스템이 과거 시장에서 어떻게 작동했는지 시각적으로 확인합니다.
                                        </li>
                                    </ul>
                                </div>

                                {/* PART 5. 퍼스널 멘토링 (강조) */}
                                <div className={styles.highlightBox} style={{marginTop: "60px"}}>
                                    <h4 className={styles.moduleTitle}>PART 5. 🧑‍🏫 퍼스널 멘토링 데스크 (1:1 집중 지원) ⭐</h4>
                                    <p className={styles.bodyText}>
                                        구매 확정일로부터 <strong>7일 동안</strong>, 당신과 담당 팀원만 참여하는 <strong>1:1 프라이빗 채널</strong>이 개설됩니다. 시간에 구애받지 않고 질문을 남기면, 담당 팀원이 확인 후 직접 답변드립니다.
                                    </p>
                                    <ul className={styles.styledList}>
                                        <li>
                                            <strong>논리의 완벽한 이해:</strong> "실행 엔진"이 왜 특정 지점에서 신호를 보내는지, 그 근거 로직을 완벽하게 당신의 것으로 만들 수 있습니다.
                                        </li>
                                        <li>
                                            <strong>전략적 토론과 확장:</strong> "만약 시장이 이런 상황이라면?"과 같이 자신만의 아이디어를 제시하고, 현역 트레이더와 깊이 있는 토론을 통해 전략의 활용도를 극대화할 수 있습니다.
                                        </li>
                                        <li>
                                            <strong>분석 과정의 교정:</strong> 자신의 분석 과정이 올바른지, 현역 트레이더의 피드백을 통해 직접 점검받고 잘못 이해한 부분을 교정할 수 있습니다.
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            <hr className={styles.sectionSeparator} />

                            {/* 추천 대상 */}
                            <section {...animRecommend} className={styles.sectionSpacing}>
                                <h3 className={styles.sectionTitle}>이런 분들에게 추천합니다</h3>
                                <ul className={styles.styledListCheck}>
                                    {/* CSS가 '✓'를 추가하므로 텍스트의 '✔️'는 제거합니다 */}
                                    <li>'감'이 아닌 명확한 <strong>'시스템'과 '데이터'</strong>로 매매하고 싶은 분</li>
                                    <li>이론 공부는 끝내고, 실제 <strong>'실행 도구(지표)'</strong>가 필요한 분</li>
                                    <li>자신만의 전략을 만들고 싶지만, 검증된 <strong>'기초 설계도'</strong>가 없는 분</li>
                                    <li>복잡한 분석 대신, 명확한 <strong>'진입/청산 시그널'</strong>이 필요한 트레이더</li>
                                    <li>현역 트레이더와 전략에 대해 <strong>'깊이 있는 토론'</strong>을 하고 싶은 분</li>
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
                            <h1 className={styles.productTitle}>시스템 빌더<br/>풀 패키지</h1>
                            
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
                                    {/* [ 6. 수정 ] 사이드바 가격 변경 (임시 210,000원) */}
                                    <span className={styles.price}>210,000원</span>
                                    <span className={styles.priceSecondary}>($150)</span>
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