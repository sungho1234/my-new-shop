"use client";


import React, { useState, useEffect } from 'react';
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
    title: "일반인을 위한 시스템 투자 올인원",
    subtitle: "시스템 투자 올인원 패키지",
    priceLabel: "100원",
    priceValue: 100,
    thumbnail: "/로고.png",
};


const ProductDetailPage = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [paymentOpen, setPaymentOpen] = useState(false);
    
    const { user, addToWishlist, removeFromWishlist, isLiked, isPurchased } = useAuth();
    const router = useRouter();


    const productInfo = {
        id: 'first-guide',
        title: '일반인을 위한 시스템 투자 올인원',
        author: 'kobba',
        price: '100',
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

    // 후기 섹션으로 스크롤
    useEffect(() => {
        if (window.location.hash === '#review-section') {
            setTimeout(() => {
                const reviewSection = document.getElementById('review-section');
                if (reviewSection) {
                    reviewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        }
    }, []);
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
            amount: item.priceValue,
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

    const handleLearnClick = () => {
        router.push('/learn/first-guide');
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
                            {/* 제목 섹션 */}
                            <section style={{marginTop: '60px', marginBottom: '60px'}}>
                                <h2 className={styles.mainHeadline} style={{textAlign: 'center', marginBottom: '16px'}}>
                                    현역 퀀트 트레이더와 함께하는<br/>
                                    2025 일반인을 위한 시스템 투자 올인원
                                </h2>
                                <p className={styles.mainSubheadline} style={{textAlign: 'center'}}>
                                    5일간의 1:1 전담 멘토링으로 당신의 매매가 '감'이 아닌 '데이터'로 바뀌는 순간을 경험하세요.
                                </p>
                            </section>

                            {/* 소개 문구 */}
                            <section className={styles.sectionSpacing}>
                                <p className={styles.bodyText}>
                                    이 올인원에서는 전략 설정, 기술 사용 등 다루는 정보를 물어보고<br/>
                                    습득할 수 있도록 현역 트레이더 팀원 한명이 배정됩니다.
                                </p>
                                <p className={styles.bodyText}>
                                    저희는 당신의 성장에 우리의 시간과 인력을 먼저 투자합니다.<br/>
                                    당신이 길을 잃지 않고 빠르게 성장하는 것이 곧 우리의 목표와 일치하기 때문입니다.
                                </p>
                                <p className={styles.bodyText}>
                                    <strong>위 패키지는 트레이딩 진입장벽을 무너뜨리기 위한 저희의 투자입니다.</strong>
                                </p>
                            </section>

                            <hr className={styles.sectionSeparator} style={{marginBottom: '60px'}} />

                            {/* 소개 목차 */}
                            <section style={{marginBottom: '40px'}}>
                                <h3 style={{
                                    fontSize: '24px',
                                    fontWeight: '700',
                                    color: '#333',
                                    margin: '0',
                                    paddingLeft: '16px',
                                    borderLeft: '4px solid #FF6B35'
                                }}>
                                    소개
                                </h3>
                            </section>

                            {/* 이미지 섹션 - g1 폴더의 이미지들 */}
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                <img src="/g1/g1.png" alt="시스템 투자 올인원 - 섹션 1" style={{width: '760px', height: 'auto', display: 'block', maxWidth: '100%'}} />
                                <img src="/g1/g2.png" alt="시스템 투자 올인원 - 섹션 2" style={{width: '760px', height: 'auto', display: 'block', maxWidth: '100%'}} />
                                <img src="/g1/g3.png" alt="시스템 투자 올인원 - 섹션 3" style={{width: '760px', height: 'auto', display: 'block', maxWidth: '100%'}} />
                                <img src="/g1/g4.gif" alt="시스템 투자 올인원 - 섹션 4" style={{width: '760px', height: 'auto', display: 'block', maxWidth: '100%'}} />
                                <img src="/g1/g5.png" alt="시스템 투자 올인원 - 섹션 5" style={{width: '760px', height: 'auto', display: 'block', maxWidth: '100%'}} />
                                <img src="/g1/g6.png" alt="시스템 투자 올인원 - 섹션 6" style={{width: '760px', height: 'auto', display: 'block', maxWidth: '100%'}} />
                                <img src="/g1/g7.png" alt="시스템 투자 올인원 - 섹션 7" style={{width: '760px', height: 'auto', display: 'block', maxWidth: '100%'}} />
                                <img src="/g1/g8.png" alt="시스템 투자 올인원 - 섹션 8" style={{width: '760px', height: 'auto', display: 'block', maxWidth: '100%'}} />
                                <img src="/g1/g9.png" alt="시스템 투자 올인원 - 섹션 9" style={{width: '760px', height: 'auto', display: 'block', maxWidth: '100%'}} />
                                <img src="/g1/g10.png" alt="시스템 투자 올인원 - 섹션 10" style={{width: '760px', height: 'auto', display: 'block', maxWidth: '100%'}} />
                                <img src="/g1/g11.png" alt="시스템 투자 올인원 - 섹션 11" style={{width: '760px', height: 'auto', display: 'block', maxWidth: '100%'}} />
                                <img src="/g1/g12.png" alt="시스템 투자 올인원 - 섹션 12" style={{width: '760px', height: 'auto', display: 'block', maxWidth: '100%'}} />
                                <img src="/g1/g13.png" alt="시스템 투자 올인원 - 섹션 13" style={{width: '760px', height: 'auto', display: 'block', maxWidth: '100%'}} />
                                <img src="/g1/g14.png" alt="시스템 투자 올인원 - 섹션 14" style={{width: '760px', height: 'auto', display: 'block', maxWidth: '100%'}} />
                                <img src="/g1/g15.png" alt="시스템 투자 올인원 - 섹션 15" style={{width: '760px', height: 'auto', display: 'block', maxWidth: '100%'}} />
                                <img src="/g1/g16.png" alt="시스템 투자 올인원 - 섹션 16" style={{width: '760px', height: 'auto', display: 'block', maxWidth: '100%'}} />
                                <img src="/g1/g17.png" alt="시스템 투자 올인원 - 섹션 17" style={{width: '760px', height: 'auto', display: 'block', maxWidth: '100%'}} />
                                <img src="/g1/g18.png" alt="시스템 투자 올인원 - 섹션 18" style={{width: '760px', height: 'auto', display: 'block', maxWidth: '100%'}} />
                                <img src="/g1/g19.gif" alt="시스템 투자 올인원 - 섹션 19" style={{width: '760px', height: 'auto', display: 'block', maxWidth: '100%'}} />
                                <img src="/g1/g20.png" alt="시스템 투자 올인원 - 섹션 20" style={{width: '760px', height: 'auto', display: 'block', maxWidth: '100%'}} />
                                <img src="/g1/g21.png" alt="시스템 투자 올인원 - 섹션 21" style={{width: '760px', height: 'auto', display: 'block', maxWidth: '100%'}} />
                            </div>

                            <hr className={styles.sectionSeparator} style={{marginTop: '80px', marginBottom: '60px'}} />

                            {/* FAQ 섹션 */}
                            <section style={{marginBottom: '80px'}}>
                                <h3 style={{
                                    fontSize: '24px',
                                    fontWeight: '700',
                                    color: '#333',
                                    margin: '0 0 40px 0',
                                    paddingLeft: '16px',
                                    borderLeft: '4px solid #FF6B35'
                                }}>
                                    자주 묻는 질문 (FAQ)
                                </h3>

                                <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
                                    {/* FAQ 1 */}
                                    <div style={{padding: '24px', border: '1px solid #e5e7eb', borderRadius: '12px', background: '#fff'}}>
                                        <h4 style={{fontSize: '17px', fontWeight: '700', color: '#333', marginBottom: '16px', lineHeight: '1.6'}}>
                                            Q: 완전 초보도 따라갈 수 있나요?
                                        </h4>
                                        <p style={{fontSize: '15px', lineHeight: '1.7', color: '#555', margin: '0'}}>
                                            A: 네, 가능합니다. 이 패키지는 '어디서부터 시작할지' 모르는 분들을 위해 설계되었습니다. 1:1 멘토링을 통해 거래소 가입과 같은 기초 단계부터 차트 세팅, 용어 이해까지 모든 과정을 개인의 속도에 맞춰 지원합니다.
                                        </p>
                                    </div>

                                    {/* FAQ 2 */}
                                    <div style={{padding: '24px', border: '1px solid #e5e7eb', borderRadius: '12px', background: '#fff'}}>
                                        <h4 style={{fontSize: '17px', fontWeight: '700', color: '#333', marginBottom: '16px', lineHeight: '1.6'}}>
                                            Q: 5일간의 멘토링 후에는 어떻게 하나요?
                                        </h4>
                                        <p style={{fontSize: '15px', lineHeight: '1.7', color: '#555', margin: '0'}}>
                                            A: 5일은 당신이 '혼자 설 수 있도록' 시스템의 기초를 다지고 모든 도구를 세팅하는 집중 기간입니다. 5일이 지나도, 당신은 '원론집', '스캠 필터', '과제집' 등 모든 핵심 자산을 영구적으로 소유합니다. 멘토링 기간 동안 습득한 '스스로 검증하고 개선하는 방법론'을 바탕으로 30일, 90일간 트레이닝을 지속하며 성장하게 됩니다.
                                        </p>
                                    </div>

                                    {/* FAQ 3 */}
                                    <div style={{padding: '24px', border: '1px solid #e5e7eb', borderRadius: '12px', background: '#fff'}}>
                                        <h4 style={{fontSize: '17px', fontWeight: '700', color: '#333', marginBottom: '16px', lineHeight: '1.6'}}>
                                            Q: 수익을 보장하나요?
                                        </h4>
                                        <p style={{fontSize: '15px', lineHeight: '1.7', color: '#555', margin: '0'}}>
                                            A: 아니요. 저희는 절대로 수익을 보장하지 않습니다. "수익 보장"을 약속하는 곳이 있다면 '스캠 필터링 체크리스트'에 따라 즉시 피하시길 권합니다. 우리는 '물고기'를 잡아주는 것이 아닌, 시장에서 평생 살아남을 수 있는 '시스템을 설계하고 검증하는 법'을 가르칩니다. 투자의 모든 최종 책임은 본인에게 있으며, 저희는 그 과정을 가장 안전하고 효율적으로 수행하도록 돕는 파트너입니다.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <hr className={styles.sectionSeparator} style={{marginBottom: '60px'}} />

                            {/* 후기 섹션 */}
                            <section id="review-section">
                                <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px'}}>
                                    <h3 style={{
                                        fontSize: '24px',
                                        fontWeight: '700',
                                        color: '#333',
                                        margin: '0',
                                        paddingLeft: '16px',
                                        borderLeft: '4px solid #FF6B35'
                                    }}>
                                        후기
                                    </h3>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                        <span style={{fontSize: '20px', color: '#FFB800'}}>★</span>
                                        <span style={{fontSize: '18px', fontWeight: '700', color: '#333'}}>4.9</span>
                                        <span style={{fontSize: '14px', color: '#FF6B35', fontWeight: '600'}}>📝 831</span>
                                    </div>
                                </div>

                                {/* 후기 작성 박스 */}
                                <div style={{padding: '24px', border: '1px solid #e5e7eb', borderRadius: '12px', background: '#fff', marginBottom: '24px'}}>
                                    <div style={{display: 'flex', gap: '8px', marginBottom: '16px'}}>
                                        <span style={{fontSize: '24px', color: '#e5e7eb', cursor: 'pointer'}}>★</span>
                                        <span style={{fontSize: '24px', color: '#e5e7eb', cursor: 'pointer'}}>★</span>
                                        <span style={{fontSize: '24px', color: '#e5e7eb', cursor: 'pointer'}}>★</span>
                                        <span style={{fontSize: '24px', color: '#e5e7eb', cursor: 'pointer'}}>★</span>
                                        <span style={{fontSize: '24px', color: '#e5e7eb', cursor: 'pointer'}}>★</span>
                                    </div>
                                    <textarea
                                        placeholder="구매 후 작성이 가능합니다."
                                        disabled
                                        style={{width: '100%', minHeight: '100px', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '15px', resize: 'vertical', fontFamily: 'inherit', color: '#9ca3af', background: '#f9fafb'}}
                                    />
                                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px'}}>
                                        <span style={{fontSize: '13px', color: '#9ca3af'}}>이모티콘은 제작되어 보여집니다.</span>
                                        <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                                            <span style={{fontSize: '13px', color: '#9ca3af'}}>0/1000</span>
                                            <button disabled style={{padding: '8px 20px', background: '#e5e7eb', color: '#9ca3af', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'not-allowed'}}>등록</button>
                                        </div>
                                    </div>
                                </div>

                                <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                                    {/* 후기 카드들 */}
                                    <div style={{padding: '24px', border: '1px solid #e5e7eb', borderRadius: '12px', background: '#fff'}}>
                                        <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px'}}>
                                            <div>
                                                <div style={{fontWeight: '700', fontSize: '15px', color: '#333', marginBottom: '4px'}}>혜차</div>
                                                <div style={{color: '#FFB800', fontSize: '14px', marginBottom: '8px'}}>★★★★★</div>
                                            </div>
                                            <span style={{fontSize: '13px', color: '#9ca3af'}}>2일 전</span>
                                        </div>
                                        <p style={{fontSize: '15px', lineHeight: '1.7', color: '#333', margin: '0'}}>
                                            우연히 모르실리들 보고 바로 결제하신다! 정말더할 좋아보이거 빡독에 잦어서 부저어는 혜어저는 상황입니다. 막왕자를 꽃그 자신의의 떨어 되었으며 이렇게 자장아의 말자하는는 시대와 모든 평제들 등해 지도 새로써 시직혈료입니다!
                                        </p>
                                    </div>

                                    <div style={{padding: '24px', border: '1px solid #e5e7eb', borderRadius: '12px', background: '#fff'}}>
                                        <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px'}}>
                                            <div>
                                                <div style={{fontWeight: '700', fontSize: '15px', color: '#333', marginBottom: '4px'}}>jjun0825</div>
                                                <div style={{color: '#FFB800', fontSize: '14px', marginBottom: '8px'}}>★★★★★</div>
                                            </div>
                                            <span style={{fontSize: '13px', color: '#9ca3af'}}>2일 전</span>
                                        </div>
                                        <p style={{fontSize: '15px', lineHeight: '1.7', color: '#333', margin: '0'}}>
                                            만족했습니다. 전내에 별의 잦어다릅.....
                                        </p>
                                    </div>

                                    <div style={{padding: '24px', border: '1px solid #e5e7eb', borderRadius: '12px', background: '#fff'}}>
                                        <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px'}}>
                                            <div>
                                                <div style={{fontWeight: '700', fontSize: '15px', color: '#333', marginBottom: '4px'}}>GO(26652)</div>
                                                <div style={{color: '#FFB800', fontSize: '14px', marginBottom: '8px'}}>★★★★★</div>
                                            </div>
                                            <span style={{fontSize: '13px', color: '#9ca3af'}}>2일 전</span>
                                        </div>
                                        <p style={{fontSize: '15px', lineHeight: '1.7', color: '#333', margin: '0'}}>
                                            아직 강의듣기 전이지만 모르실리드를 듣발씨 예어저이어이 전반적엔 빡독의 필요성을 광센에에 너무 기대됩니다
                                        </p>
                                    </div>

                                    <div style={{padding: '24px', border: '1px solid #e5e7eb', borderRadius: '12px', background: '#fff'}}>
                                        <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px'}}>
                                            <div>
                                                <div style={{fontWeight: '700', fontSize: '15px', color: '#333', marginBottom: '4px'}}>H.SW</div>
                                                <div style={{color: '#FFB800', fontSize: '14px', marginBottom: '8px'}}>★★★★★</div>
                                            </div>
                                            <span style={{fontSize: '13px', color: '#9ca3af'}}>3일 전</span>
                                        </div>
                                        <p style={{fontSize: '15px', lineHeight: '1.7', color: '#333', margin: '0'}}>
                                            전제 구조 이번 강의는 수경사너 느낌 강의 좀 본후으서 참하이면 실적에서 바로 쓰어는 사구 체결한 전직 효율을 얻읍 다느는 것이다. 단순서 사느 노구돼 티 쓸 모는 분야 머니떼 관 그런게 해어 서고지, 어떤 입력에 사구 단개중 거저어 실인 바드느스크 상련로 이어거느집을 만들어서 노뎌 그러서 수잡이 끝나 나싀 상련로 최인의 기능됩다.
                                        </p>
                                    </div>
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
                                    <span className={styles.price}>210,000원</span>
                                    <span className={styles.priceSecondary}>($150)</span>
                                </div>
                                {isPurchased(productInfo.id) ? (
                                    <button className={styles.buyButton} onClick={handleLearnClick} style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                                        학습하기 →
                                    </button>
                                ) : (
                                    <button className={styles.buyButton} onClick={handleBuyNowClick}>
                                        Buy now
                                    </button>
                                )}
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
