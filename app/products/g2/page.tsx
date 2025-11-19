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

const itemForPay: PaymentItem = {
    title: "일반인을 위한 첫번째 안내서",
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
        id: 'system-builder',
        title: '2025 일반인을 위한 시스템 투자 올인원',
        author: 'kobba',
        price: '210,000',
        thumbnail: "/로고.png",
    };
    
    const liked = isLiked(productInfo.id);

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

    // --- [수정된 부분!] ---
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
            merchant_uid: `GUIDE-${new Date().getTime()}`,
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
                        // [수정!] userId 대신 kakaoId를 보내도록 수정합니다.
                        body: JSON.stringify({
                            kakaoId: user?.id, // user.id는 숫자 카카오 ID이므로, kakaoId라는 이름으로 전송
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
    // --- 여기까지 수정 ---

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
        router.push('/learn/system-builder');
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
                                    일반인을 위한 첫번째 안내서
                                </h2>
                                <p className={styles.mainSubheadline} style={{textAlign: 'center'}}>
                                    [현역 트레이더의 '시작 세팅법'과 '관점'을 당신의 모니터에 복사해 드립니다.]
                                </p>
                            </section>

                            {/* 소개 섹션 */}
                            <section className={styles.sectionSpacing}>
                                <p className={styles.bodyText}>
                                    이 안내서는 <strong>[Your Team Name] 트레이딩 팀</strong>이 수많은 시행착오 끝에 결론내린,<br/>
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

                            <hr className={styles.sectionSeparator} style={{marginBottom: '60px'}} />

                            {/* 소개 목차 */}
                            <section style={{marginBottom: '40px'}}>
                                <h3 style={{
                                    fontSize: '24px',
                                    fontWeight: '700',
                                    color: '#333',
                                    margin: '0',
                                    paddingLeft: '16px',
                                    borderLeft: '4px solid #FF6B35',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}>
                                    소개
                                </h3>
                            </section>

                            {/* 이미지 섹션 */}
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                <img
                                    src="/1.png"
                                    alt="일반인을 위한 첫번째 안내서 - 섹션 1"
                                    style={{
                                        width: '760px',
                                        height: 'auto',
                                        display: 'block',
                                        maxWidth: '100%'
                                    }}
                                />
                                <img
                                    src="/2.png"
                                    alt="일반인을 위한 첫번째 안내서 - 섹션 2"
                                    style={{
                                        width: '760px',
                                        height: 'auto',
                                        display: 'block',
                                        maxWidth: '100%',
                                        marginTop: '-5px'
                                    }}
                                />
                                <img
                                    src="/3.png"
                                    alt="일반인을 위한 첫번째 안내서 - 섹션 3"
                                    style={{
                                        width: '760px',
                                        height: 'auto',
                                        display: 'block',
                                        maxWidth: '100%'
                                    }}
                                />
                                <img
                                    src="/4.png"
                                    alt="일반인을 위한 첫번째 안내서 - 섹션 4"
                                    style={{
                                        width: '760px',
                                        height: 'auto',
                                        display: 'block',
                                        maxWidth: '100%'
                                    }}
                                />
                                <img
                                    src="/5.gif"
                                    alt="일반인을 위한 첫번째 안내서 - 섹션 5"
                                    style={{
                                        width: '760px',
                                        height: 'auto',
                                        display: 'block',
                                        maxWidth: '100%'
                                    }}
                                />
                                <img
                                    src="/6.png"
                                    alt="일반인을 위한 첫번째 안내서 - 섹션 6"
                                    style={{
                                        width: '760px',
                                        height: 'auto',
                                        display: 'block',
                                        maxWidth: '100%'
                                    }}
                                />
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
                                    <div style={{
                                        padding: '24px',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '12px',
                                        background: '#fff'
                                    }}>
                                        <h4 style={{
                                            fontSize: '17px',
                                            fontWeight: '700',
                                            color: '#333',
                                            marginBottom: '16px',
                                            lineHeight: '1.6'
                                        }}>
                                            Q: 이 안내서에도 1:1 멘토링이 포함되나요?
                                        </h4>
                                        <p style={{
                                            fontSize: '15px',
                                            lineHeight: '1.7',
                                            color: '#555',
                                            margin: '0'
                                        }}>
                                            A: 아니요, 이 안내서는 1:1 지원을 포함하지 않습니다. 대신, 가장 합리적인 비용으로 현역 팀의 '핵심 노하우'와 '표준 세팅'을 온전히 습득할 수 있도록 설계된 <strong>'자습서(Self-Study Guide)'</strong>입니다.
                                        </p>
                                    </div>

                                    {/* FAQ 2 */}
                                    <div style={{
                                        padding: '24px',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '12px',
                                        background: '#fff'
                                    }}>
                                        <h4 style={{
                                            fontSize: '17px',
                                            fontWeight: '700',
                                            color: '#333',
                                            marginBottom: '16px',
                                            lineHeight: '1.6'
                                        }}>
                                            Q: 이 안내서만 보면 바로 수익을 낼 수 있나요?
                                        </h4>
                                        <p style={{
                                            fontSize: '15px',
                                            lineHeight: '1.7',
                                            color: '#555',
                                            margin: '0'
                                        }}>
                                            A: 아니요, 이 안내서는 '수익'을 보장하지 않습니다. 이 자료는 '물고기'가 아닌, 트레이딩이라는 바다에 나가기 위한 <strong>'가장 튼튼한 배와 나침반을 세팅하는 법'</strong>을 알려드립니다. 올바른 시작은 성공의 확률을 높이지만, 결과는 전적으로 본인의 노력과 시장 상황에 달려있습니다.
                                        </p>
                                    </div>

                                    {/* FAQ 3 */}
                                    <div style={{
                                        padding: '24px',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '12px',
                                        background: '#fff'
                                    }}>
                                        <h4 style={{
                                            fontSize: '17px',
                                            fontWeight: '700',
                                            color: '#333',
                                            marginBottom: '16px',
                                            lineHeight: '1.6'
                                        }}>
                                            Q: 구매 후 안내서는 어떻게 받나요?
                                        </h4>
                                        <p style={{
                                            fontSize: '15px',
                                            lineHeight: '1.7',
                                            color: '#555',
                                            margin: '0'
                                        }}>
                                            A: 구매 확정 즉시, PDF 안내서와 '차트 레이아웃 링크'가 포함된 디지털 콘텐츠에 액세스할 수 있는 링크가 이메일로 발송됩니다.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <hr className={styles.sectionSeparator} style={{marginBottom: '60px'}} />

                            {/* 후기 섹션 */}
                            <section>
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
                                <div style={{
                                    padding: '24px',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '12px',
                                    background: '#fff',
                                    marginBottom: '24px'
                                }}>
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
                                        style={{
                                            width: '100%',
                                            minHeight: '100px',
                                            padding: '16px',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            fontSize: '15px',
                                            resize: 'vertical',
                                            fontFamily: 'inherit',
                                            color: '#9ca3af',
                                            background: '#f9fafb'
                                        }}
                                    />
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginTop: '12px'
                                    }}>
                                        <span style={{fontSize: '13px', color: '#9ca3af'}}>이모티콘은 제작되어 보여집니다.</span>
                                        <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                                            <span style={{fontSize: '13px', color: '#9ca3af'}}>0/1000</span>
                                            <button
                                                disabled
                                                style={{
                                                    padding: '8px 20px',
                                                    background: '#e5e7eb',
                                                    color: '#9ca3af',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    fontSize: '14px',
                                                    fontWeight: '600',
                                                    cursor: 'not-allowed'
                                                }}
                                            >
                                                등록
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                                    {/* 후기 1 */}
                                    <div style={{
                                        padding: '24px',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '12px',
                                        background: '#fff'
                                    }}>
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

                                    {/* 후기 2 */}
                                    <div style={{
                                        padding: '24px',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '12px',
                                        background: '#fff'
                                    }}>
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

                                    {/* 후기 3 */}
                                    <div style={{
                                        padding: '24px',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '12px',
                                        background: '#fff'
                                    }}>
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

                                    {/* 후기 4 */}
                                    <div style={{
                                        padding: '24px',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '12px',
                                        background: '#fff'
                                    }}>
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

                    <aside className={styles.sidebarColumn}>
                        <div className={styles.sidebarContent}>
                            <div className={styles.collectionInfo}>
                                <img src="/로고.png" alt="MAXX Quant System logo" />
                                <a href="#">MAXX Quant System</a>
                            </div>
                            
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
                                    <span className={styles.price}>70,000원</span>
                                    <span className={styles.priceSecondary}>($50)</span>
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
