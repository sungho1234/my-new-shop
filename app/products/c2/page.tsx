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

// 후기 데이터 - c2 상품 (프로의 전략 원본)
const reviews = [
    { name: '송현우', rating: 5, date: '2일 전', content: '전략 설계도를 보면서 프로가 어떻게 시스템을 구축하는지 이해할 수 있었어요. 단순히 매매 타이밍만 알려주는 게 아니라 전략의 논리 자체를 배울 수 있어서 정말 유익합니다.' },
    { name: 'data_analyst', rating: 5, date: '3일 전', content: '백테스팅 데이터가 상세하게 나와 있어서 좋아요. 단순히 결과만 보여주는 게 아니라 각 구간에서 어떤 판단이 있었는지, 왜 그런 결정을 내렸는지 알 수 있어서 학습 효과가 큽니다.' },
    { name: '김도현', rating: 4, date: '5일 전', content: '이론 자료라 실행까지는 제가 해야 하지만, 전략의 원리를 이해하는 데는 최고예요. 멘토링이나 실행 도구는 없지만 가격 대비 충분한 가치가 있습니다. 스스로 공부할 수 있는 분들한테 추천해요.' },
    { name: 'strategy_seeker', rating: 5, date: '1주 전', content: '프로의 사고방식을 엿볼 수 있어서 좋았어요. 단순히 지표 몇 개 조합한 게 아니라 시장을 데이터로 해석하는 체계적인 접근법이 인상 깊었습니다. 저도 이렇게 생각하는 법을 배우고 싶었어요.' },
    { name: '정수아', rating: 5, date: '1주 전', content: '설계도 보면서 제 전략의 허점을 발견했어요. 프로는 이렇게 체계적으로 접근하는구나 싶었습니다. 실증 사례집도 정말 상세해서 어떤 시장 환경에서 어떻게 작동하는지 알 수 있었어요.' },
    { name: 'quant_learner', rating: 5, date: '2주 전', content: '데이터로 증명하는 방법을 배울 수 있어요. 막연한 감이 아니라 숫자로 검증하는 프로세스가 정말 중요하다는 걸 깨달았습니다. 이 자료는 평생 참고할 만한 가치가 있어요.' },
    { name: '박민재', rating: 4, date: '2주 전', content: '전략의 핵심 원리가 담겨 있어요. 다만 초보자에게는 좀 어려울 수 있습니다. 기본 지식이 어느 정도 있는 분들이 더 깊이 공부하기 위한 자료라고 생각하면 될 것 같아요.' },
    { name: 'system_builder', rating: 5, date: '2주 전', content: '이 설계도를 바탕으로 제 전략을 수정 중이에요. 프로의 로직을 이해하고 나니 제가 놓치고 있던 부분이 보이더라고요. 실행 엔진은 없지만 원리를 배우는 데는 최고의 자료입니다.' },
    { name: '최서윤', rating: 5, date: '3주 전', content: '백테스팅 데이터가 정말 상세해요. 승률, 손익비, 최대 낙폭 등 모든 지표가 다 나와 있고, 각 구간별 분석도 되어 있어서 시스템이 어떻게 작동하는지 완벽하게 이해할 수 있었습니다.' },
    { name: 'logic_master', rating: 5, date: '3주 전', content: '전략의 논리 구조를 배울 수 있어요. 단순히 진입/청산 조건만 나온 게 아니라 왜 그런 조건을 설정했는지, 어떤 시장 특성을 반영한 건지 설명되어 있어서 정말 유익합니다.' },
    { name: '강태민', rating: 4, date: '3주 전', content: '가격 대비 만족스러워요. 멘토링이나 실행 도구는 없지만, 전략의 원본을 볼 수 있다는 것만으로도 충분한 가치가 있습니다. 이론을 배우고 싶은 분들한테 추천해요.' },
    { name: 'theory_hunter', rating: 5, date: '4주 전', content: '시스템의 두뇌를 해부한 느낌이에요. 겉으로 보이는 결과만 보는 게 아니라 내부 논리를 완전히 이해할 수 있어서 좋았습니다. 이 원리를 제 방식으로 응용하고 있어요.' },
    { name: '윤지호', rating: 5, date: '1개월 전', content: '프로의 전략을 이렇게 공개한다는 게 신기해요. 설계도 보면서 정말 많이 배웠습니다. 단순히 따라 하는 게 아니라 원리를 이해하고 제 방식으로 재구성할 수 있게 됐어요.' },
    { name: 'deep_thinker', rating: 5, date: '1개월 전', content: '데이터 분석 방법론이 정말 체계적이에요. 막연히 차트만 보던 저에게 숫자로 검증하는 법을 알려줬습니다. 실증 사례집 보면서 통계적 사고방식을 많이 배웠어요.' },
    { name: '서준혁', rating: 4, date: '1개월 전', content: '이론 중심 자료라 실전 적용은 제가 해야 하지만, 원리를 배우는 데는 최고예요. 완전 초보보다는 경험이 좀 있는 분들이 더 깊이 공부하기 좋은 자료인 것 같습니다.' },
    { name: 'backtest_pro', rating: 5, date: '1개월 전', content: '백테스팅이 이렇게 상세할 수가 있나 싶어요. 모든 거래 내역, 통계 지표, 구간별 분석까지 완벽하게 정리되어 있습니다. 이 데이터만 봐도 전략의 신뢰성을 충분히 검증할 수 있어요.' },
    { name: '이채은', rating: 5, date: '2개월 전', content: '시스템 트레이딩의 원리를 이해하고 싶었는데, 이 자료가 딱이에요. 프로가 어떻게 시장을 해석하고, 어떻게 전략으로 구체화하는지 그 과정을 배울 수 있어서 정말 값집니다.' },
    { name: 'principle_seeker', rating: 5, date: '2개월 전', content: '전략의 원본을 볼 수 있다는 게 이 상품의 가장 큰 가치예요. 결과만 보는 게 아니라 설계 과정부터 검증 방법까지 모두 공개되어 있어서 정말 투명하고 신뢰가 갑니다.' },
    { name: '조예린', rating: 4, date: '2개월 전', content: 'PDF 자료만 제공되지만 내용이 정말 알차요. 전략 설계도는 논리 구조가 명확하고, 실증 사례집은 데이터가 상세합니다. 스스로 학습할 수 있는 분들한테 추천해요.' },
    { name: 'data_driven', rating: 5, date: '2개월 전', content: '데이터로 증명한다는 게 뭔지 확실히 알게 됐어요. 막연한 기대가 아니라 과거 데이터로 철저히 검증된 전략이라는 게 느껴집니다. 이런 접근법을 배우고 싶었어요.' },
    { name: '한승우', rating: 5, date: '3개월 전', content: '프로의 사고방식을 훔칠 수 있어요. 단순히 매매 기법만 배우는 게 아니라 시장을 바라보는 관점 자체가 달라졌습니다. 이 설계도는 평생 참고할 자료가 될 것 같아요.' },
    { name: 'strategy_analyst', rating: 5, date: '3개월 전', content: '전략 분석하는 걸 좋아하는데, 이 자료는 정말 분석할 거리가 많아요. 설계도 하나하나 뜯어보면서 왜 이렇게 설계했는지 고민하는 과정이 정말 재밌고 유익합니다.' },
    { name: '김나연', rating: 4, date: '3개월 전', content: '이론 자료지만 실전 적용 가능성이 높아요. 설계도가 구체적이라서 이걸 바탕으로 실제 시스템 구축하는 게 가능합니다. 다만 코딩이나 실행은 본인이 해야 해요.' },
    { name: 'blueprint_reader', rating: 5, date: '4개월 전', content: '설계도를 읽는 재미가 있어요. 프로가 어떤 논리로 시스템을 구축했는지 한 단계 한 단계 따라가면서 이해하는 과정이 정말 흥미롭습니다. 이론 공부 좋아하는 분들한테 강추!' },
    { name: '박시우', rating: 5, date: '4개월 전', content: '가격 대비 최고의 가성비예요. 멘토링이나 실행 엔진 없이 순수하게 전략의 원리만 담긴 자료지만, 그 원리를 배우는 게 가장 중요하다고 생각하는 분들한테는 완벽한 선택입니다.' }
];

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
    priceLabel: "100원",
    priceValue: 100,
    thumbnail: "/로고.png",
};

const ProductDetailPage = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [paymentOpen, setPaymentOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 4;

    // 후기 관련 state
    const [dbReviews, setDbReviews] = useState<any[]>([]);
    const [selectedRating, setSelectedRating] = useState(0);
    const [reviewContent, setReviewContent] = useState('');
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [hasWrittenReview, setHasWrittenReview] = useState(false);

    const { user, addToWishlist, removeFromWishlist, isLiked, isPurchased } = useAuth();
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
    const purchased = isPurchased(productInfo.id);

    // 스크롤 애니메이션 훅
    const animMedia = useScrollFadeIn('up', 1, 0);
    const animHeadline = useScrollFadeIn('up', 1, 0.1);
    const animIntro = useScrollFadeIn('up', 1, 0);
    const animPackageIntro = useScrollFadeIn('up', 1, 0.1);
    const animModules = useScrollFadeIn('up', 1, 0);
    const animRecommend = useScrollFadeIn('up', 1, 0.1);
    const animFaq = useScrollFadeIn('up', 1, 0);

    // DB에서 후기 불러오기 (후기 작성 여부도 함께 확인)
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch(`/api/reviews?productId=${productInfo.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setDbReviews(data.reviews);

                    // 내가 작성한 후기가 있는지 즉시 확인 (추가 API 호출 없이!)
                    if (user) {
                        const myReview = data.reviews.find((r: any) => r.kakaoId === String(user.id));
                        setHasWrittenReview(!!myReview);
                    }
                }
            } catch (error) {
                console.error('후기 불러오기 실패:', error);
            }
        };
        fetchReviews();
    }, [productInfo.id, user]);

    // 후기 제출 함수
    const handleSubmitReview = async () => {
        if (!user) {
            alert('로그인이 필요합니다.');
            router.push('/login');
            return;
        }

        if (!purchased) {
            alert('구매한 상품만 후기를 작성할 수 있습니다.');
            return;
        }

        if (selectedRating === 0) {
            alert('별점을 선택해주세요.');
            return;
        }

        if (reviewContent.trim().length < 10) {
            alert('후기는 최소 10자 이상 작성해주세요.');
            return;
        }

        if (reviewContent.length > 1000) {
            alert('후기는 1000자를 초과할 수 없습니다.');
            return;
        }

        setIsSubmittingReview(true);

        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    kakaoId: user.id,
                    productId: productInfo.id,
                    rating: selectedRating,
                    content: reviewContent
                })
            });

            if (res.ok) {
                const data = await res.json();
                alert('후기가 성공적으로 등록되었습니다!');

                // 후기 목록에 새 후기 추가 (맨 위로)
                setDbReviews([data.review, ...dbReviews]);

                // 폼 초기화
                setSelectedRating(0);
                setReviewContent('');
                setHasWrittenReview(true);
            } else {
                const errorData = await res.json();
                alert(errorData.error || '후기 등록에 실패했습니다.');
            }
        } catch (error) {
            console.error('후기 제출 실패:', error);
            alert('후기 등록 중 오류가 발생했습니다.');
        } finally {
            setIsSubmittingReview(false);
        }
    };

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
            merchant_uid: `STRATEGY-${new Date().getTime()}`,
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

    // 'Buy now' 버튼 핸들러
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
        router.push('/learn/strategy-source');
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

                            {/* 제목 섹션 */}
                            <section style={{marginTop: '60px', marginBottom: '60px'}}>
                                <h2 className={styles.mainHeadline} style={{textAlign: 'center', marginBottom: '16px'}}>
                                    프로의 전략 원본: 시스템 설계도와 데이터 분석
                                </h2>
                                <p className={styles.mainSubheadline} style={{textAlign: 'center'}}>
                                    시스템의 '두뇌'와 '운행 기록' 원본.<br/>
                                    프로의 전략 원리를 획득합니다.
                                </p>
                            </section>

                            {/* 소개 문구 */}
                            <section className={styles.sectionSpacing}>
                                <p className={styles.bodyText} style={{textAlign: 'center', marginBottom: '20px'}}>
                                    이 자료는 저희 집단에서 수익을 창출하는 시스템에서 가장 중요한<br/>
                                    <strong>'두뇌'</strong>에 해당하는 핵심 설계도와, 그 논리가 실제 시장에서 어떻게 작동했는지를 증명하는 <strong>'운행 기록'</strong> 입니다.
                                </p>
                                <p className={styles.bodyText} style={{textAlign: 'center'}}>
                                    당신은 이 자료를 통해 단순히 하나의 전략을 배우는 것을 넘어,<br/>
                                    시장을 데이터로 해석하고 증명하는 프로의 시스템 원리 그 자체를 얻게 될 것입니다.
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

                            {/* 이미지 섹션 - c2 폴더의 이미지들 */}
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                <img src="/c2/1.png" alt="프로의 전략 원본 - 섹션 1" style={{width: '760px', height: 'auto', display: 'block', maxWidth: '100%'}} />
                                <img src="/c2/2.png" alt="프로의 전략 원본 - 섹션 2" style={{width: '760px', height: 'auto', display: 'block', maxWidth: '100%'}} />
                                <img src="/c2/3.png" alt="프로의 전략 원본 - 섹션 3" style={{width: '760px', height: 'auto', display: 'block', maxWidth: '100%'}} />
                                <img src="/c2/4.png" alt="프로의 전략 원본 - 섹션 4" style={{width: '760px', height: 'auto', display: 'block', maxWidth: '100%'}} />
                                <img src="/c2/5.png" alt="프로의 전략 원본 - 섹션 5" style={{width: '760px', height: 'auto', display: 'block', maxWidth: '100%'}} />
                                <img src="/c2/6.png" alt="프로의 전략 원본 - 섹션 6" style={{width: '760px', height: 'auto', display: 'block', maxWidth: '100%'}} />
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
                                    {faqItems.map((item, index) => (
                                        <div key={index} style={{padding: '24px', border: '1px solid #e5e7eb', borderRadius: '12px', background: '#fff'}}>
                                            <h4 style={{fontSize: '17px', fontWeight: '700', color: '#333', marginBottom: '16px', lineHeight: '1.6'}}>
                                                {item.question}
                                            </h4>
                                            <p style={{fontSize: '15px', lineHeight: '1.7', color: '#555', margin: '0'}}>
                                                {item.answer}
                                            </p>
                                        </div>
                                    ))}
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
                                        <span style={{fontSize: '14px', color: '#FF6B35', fontWeight: '600'}}>📝 {dbReviews.length + reviews.length}</span>
                                    </div>
                                </div>

                                {/* 후기 작성 박스 */}
                                {hasWrittenReview ? (
                                    <div style={{padding: '24px', border: '1px solid #e5e7eb', borderRadius: '12px', background: '#f9fafb', marginBottom: '24px', textAlign: 'center'}}>
                                        <p style={{fontSize: '15px', color: '#6b7280', margin: 0}}>이미 후기를 작성하셨습니다.</p>
                                    </div>
                                ) : (
                                    <div style={{padding: '24px', border: '1px solid #e5e7eb', borderRadius: '12px', background: '#fff', marginBottom: '24px'}}>
                                        <div style={{display: 'flex', gap: '8px', marginBottom: '16px'}}>
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <span
                                                    key={star}
                                                    onClick={() => {
                                                        if (purchased && user) {
                                                            setSelectedRating(star);
                                                        } else if (!user) {
                                                            alert('로그인이 필요합니다.');
                                                            router.push('/login');
                                                        } else if (!purchased) {
                                                            alert('구매한 상품만 후기를 작성할 수 있습니다.');
                                                        }
                                                    }}
                                                    style={{
                                                        fontSize: '24px',
                                                        color: star <= selectedRating ? '#FFB800' : '#e5e7eb',
                                                        cursor: (purchased && user) ? 'pointer' : 'not-allowed',
                                                        transition: 'color 0.2s'
                                                    }}
                                                >
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                        <textarea
                                            placeholder={purchased && user ? "후기를 작성해주세요 (최소 10자)" : "구매 후 작성이 가능합니다."}
                                            disabled={!purchased || !user}
                                            value={reviewContent}
                                            onChange={(e) => setReviewContent(e.target.value)}
                                            maxLength={1000}
                                            style={{
                                                width: '100%',
                                                minHeight: '100px',
                                                padding: '16px',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '8px',
                                                fontSize: '15px',
                                                resize: 'vertical',
                                                fontFamily: 'inherit',
                                                color: (purchased && user) ? '#333' : '#9ca3af',
                                                background: (purchased && user) ? '#fff' : '#f9fafb'
                                            }}
                                        />
                                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px'}}>
                                            <span style={{fontSize: '13px', color: '#9ca3af'}}>이모티콘은 제작되어 보여집니다.</span>
                                            <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                                                <span style={{fontSize: '13px', color: '#9ca3af'}}>{reviewContent.length}/1000</span>
                                                <button
                                                    onClick={handleSubmitReview}
                                                    disabled={!purchased || !user || isSubmittingReview || selectedRating === 0 || reviewContent.trim().length < 10}
                                                    style={{
                                                        padding: '8px 20px',
                                                        background: (purchased && user && !isSubmittingReview && selectedRating > 0 && reviewContent.trim().length >= 10) ? '#FF6B35' : '#e5e7eb',
                                                        color: (purchased && user && !isSubmittingReview && selectedRating > 0 && reviewContent.trim().length >= 10) ? '#fff' : '#9ca3af',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        fontSize: '14px',
                                                        fontWeight: '600',
                                                        cursor: (purchased && user && !isSubmittingReview && selectedRating > 0 && reviewContent.trim().length >= 10) ? 'pointer' : 'not-allowed',
                                                        transition: 'background 0.2s'
                                                    }}
                                                >
                                                    {isSubmittingReview ? '등록 중...' : '등록'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* 후기 카드들 */}
                                <div style={{display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px'}}>
                                    {(() => {
                                        // DB 후기와 더미 후기를 합침 (DB 후기가 맨 위에)
                                        const allReviews = [...dbReviews, ...reviews];
                                        const paginatedReviews = allReviews.slice((currentPage - 1) * reviewsPerPage, currentPage * reviewsPerPage);

                                        return paginatedReviews.map((review, idx) => (
                                            <div key={review.id || `review-${idx}`} style={{padding: '24px', border: '1px solid #e5e7eb', borderRadius: '12px', background: '#fff'}}>
                                                <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px'}}>
                                                    <div>
                                                        <div style={{fontWeight: '700', fontSize: '15px', color: '#333', marginBottom: '4px'}}>
                                                            {review.userName || review.name}
                                                        </div>
                                                        <div style={{color: '#FFB800', fontSize: '14px', marginBottom: '8px'}}>
                                                            {'★'.repeat(review.rating)}
                                                        </div>
                                                    </div>
                                                    <span style={{fontSize: '13px', color: '#9ca3af'}}>{review.date}</span>
                                                </div>
                                                <p style={{fontSize: '15px', lineHeight: '1.7', color: '#333', margin: '0'}}>
                                                    {review.content}
                                                </p>
                                            </div>
                                        ));
                                    })()}
                                </div>

                                {/* 페이지네이션 */}
                                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '32px'}}>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        style={{
                                            padding: '8px 12px',
                                            border: 'none',
                                            borderRadius: '6px',
                                            background: 'transparent',
                                            color: currentPage === 1 ? '#d1d5db' : '#6b7280',
                                            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                            fontSize: '18px',
                                            fontWeight: '400',
                                            transition: 'color 0.2s'
                                        }}
                                    >
                                        ‹
                                    </button>

                                    {(() => {
                                        const allReviews = [...dbReviews, ...reviews];
                                        const totalPages = Math.ceil(allReviews.length / reviewsPerPage);
                                        const maxVisible = 5;
                                        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
                                        let endPage = Math.min(totalPages, startPage + maxVisible - 1);

                                        if (endPage - startPage + 1 < maxVisible) {
                                            startPage = Math.max(1, endPage - maxVisible + 1);
                                        }

                                        return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(pageNum => (
                                            <button
                                                key={pageNum}
                                                onClick={() => setCurrentPage(pageNum)}
                                                style={{
                                                    padding: '6px 12px',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    background: 'transparent',
                                                    color: currentPage === pageNum ? '#FF6B35' : '#6b7280',
                                                    cursor: 'pointer',
                                                    fontSize: '15px',
                                                    fontWeight: currentPage === pageNum ? '700' : '400',
                                                    minWidth: '32px',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (currentPage !== pageNum) {
                                                        e.currentTarget.style.color = '#374151';
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (currentPage !== pageNum) {
                                                        e.currentTarget.style.color = '#6b7280';
                                                    }
                                                }}
                                            >
                                                {pageNum}
                                            </button>
                                        ));
                                    })()}

                                    <button
                                        onClick={() => {
                                            const allReviews = [...dbReviews, ...reviews];
                                            setCurrentPage(prev => Math.min(Math.ceil(allReviews.length / reviewsPerPage), prev + 1));
                                        }}
                                        disabled={(() => {
                                            const allReviews = [...dbReviews, ...reviews];
                                            return currentPage === Math.ceil(allReviews.length / reviewsPerPage);
                                        })()}
                                        style={{
                                            padding: '8px 12px',
                                            border: 'none',
                                            borderRadius: '6px',
                                            background: 'transparent',
                                            color: (() => {
                                                const allReviews = [...dbReviews, ...reviews];
                                                return currentPage === Math.ceil(allReviews.length / reviewsPerPage) ? '#d1d5db' : '#6b7280';
                                            })(),
                                            cursor: (() => {
                                                const allReviews = [...dbReviews, ...reviews];
                                                return currentPage === Math.ceil(allReviews.length / reviewsPerPage) ? 'not-allowed' : 'pointer';
                                            })(),
                                            fontSize: '18px',
                                            fontWeight: '400',
                                            transition: 'color 0.2s'
                                        }}
                                    >
                                        ›
                                    </button>
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