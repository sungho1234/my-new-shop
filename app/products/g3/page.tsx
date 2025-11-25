"use client"; 

import React, { useState, useEffect } from 'react';
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

// 후기 데이터 - g3 상품 (성장책: 스캠필터와 챌린지)
const reviews = [
    { name: '안재현', rating: 5, date: '2일 전', content: '스캠 필터 체크리스트 덕분에 사기 프로젝트 하나 걸러냈어요. 막상 투자하려는 순간 체크리스트 보니까 빨간불이 여러 개 켜져서 투자 안 했는데, 며칠 뒤 먹튀했더라고요. 이것만으로도 본전 뽑았습니다.' },
    { name: 'scam_hunter', rating: 5, date: '3일 전', content: '30일 챌린지가 생각보다 체계적이에요. 하루하루 과제가 명확해서 뭘 해야 할지 헷갈리지 않고, 진짜 실력이 늘어나는 게 느껴집니다. 혼자 연습하기 딱 좋게 설계되어 있어요.' },
    { name: '박지민', rating: 5, date: '5일 전', content: '경험 좀 있다고 자만했는데, 스캠 필터 보고 충격 받았어요. 제가 놓치고 있던 위험 신호들이 많더라고요. "이번만은 다르겠지"라는 생각이 얼마나 위험한지 깨달았습니다.' },
    { name: 'challenge_master', rating: 4, date: '1주 전', content: '30일 챌린지 진행 중인데 꽤 타이트해요. 하루 과제를 빼먹으면 다음 날 부담이 되긴 하는데, 그만큼 강제로 공부하게 되니까 좋습니다. 멘토링은 없지만 혼자서도 충분히 따라갈 수 있어요.' },
    { name: '김서영', rating: 5, date: '1주 전', content: '가격 대비 정말 알차요. 스캠 필터 체크리스트는 평생 쓸 자료고, 과제집은 실전 연습하기 딱 좋습니다. 멘토링 없어도 자기주도 학습 가능한 분들한테 추천해요.' },
    { name: 'self_learner', rating: 5, date: '2주 전', content: '혼자 공부하는 스타일인데 이 책이 딱 맞아요. 과제가 단계별로 잘 나눠져 있어서 하나씩 클리어하는 재미가 있습니다. 스캠 필터도 실전에서 바로 써먹을 수 있어서 유용해요.' },
    { name: '이동현', rating: 5, date: '2주 전', content: '사기 당할 뻔한 적이 있어서 스캠 필터 때문에 샀는데, 과제집도 생각보다 훨씬 알차네요. 매일 조금씩 실력이 늘어나는 게 느껴집니다. 꾸준히만 하면 확실히 성장할 수 있을 것 같아요.' },
    { name: 'filter_expert', rating: 5, date: '2주 전', content: '스캠 필터 체크리스트가 정말 논리적이에요. 감정적으로 끌리는 프로젝트를 이성적으로 판단할 수 있게 해주는 안전장치 같습니다. 투자 전에 항상 체크하고 있어요.' },
    { name: '윤채원', rating: 4, date: '3주 전', content: '30일 과제가 생각보다 많아요. 직장 다니면서 하려니 좀 빡빡하긴 한데, 그래도 매일 조금씩이라도 하다 보니 실력이 늘고 있습니다. 자기관리 되는 분들한테 좋아요.' },
    { name: 'crypto_guard', rating: 5, date: '3주 전', content: '암호화폐 시장에 사기꾼이 너무 많은데, 이 필터 덕분에 안전하게 투자할 수 있게 됐어요. 특히 "욕망을 공격한다"는 표현이 정말 와닿더라고요. 제 욕심을 컨트롤하는 도구로 쓰고 있습니다.' },
    { name: '정민호', rating: 5, date: '3주 전', content: '챌린지 20일차인데 확실히 실력이 늘었어요. 처음엔 어려웠던 과제도 지금은 수월하게 풀리고, 차트 보는 눈도 달라졌습니다. 30일 끝나면 또 한 번 반복할 예정이에요.' },
    { name: 'daily_grinder', rating: 5, date: '4주 전', content: '매일매일 과제를 소화하면서 루틴이 생겼어요. 트레이딩도 결국 꾸준함이 중요한데, 이 책이 그 습관을 만들어주는 것 같습니다. 스캠 필터는 덤이고요!' },
    { name: '한지수', rating: 5, date: '1개월 전', content: '경험 많다고 자만했다가 스캠에 당할 뻔했어요. 이 체크리스트 보고 나서 투자 전에 항상 한 번 더 검토하게 됐습니다. 욕심 제어하는 데 정말 도움 돼요.' },
    { name: 'workbook_fan', rating: 4, date: '1개월 전', content: '과제집 퀄리티가 높아요. 단순 반복이 아니라 점진적으로 난이도가 올라가면서 자연스럽게 실력이 늘어나도록 설계되어 있습니다. 다만 멘토링이 없어서 가끔 궁금한 게 생기면 스스로 해결해야 해요.' },
    { name: '오준영', rating: 5, date: '1개월 전', content: '30일 챌린지 완주했어요! 처음엔 힘들었는데 끝까지 하고 나니 성취감이 엄청나네요. 실력도 확실히 늘었고, 이제 챌린지 2회차 시작합니다!' },
    { name: 'scam_avoider', rating: 5, date: '1개월 전', content: '스캠 필터만으로도 값어치 충분합니다. 이미 두 번이나 사기 프로젝트 거르는 데 성공했어요. 한 번 실수로 잃을 금액 생각하면 이건 정말 저렴한 보험이에요.' },
    { name: '김태윤', rating: 5, date: '2개월 전', content: '자기주도 학습 가능한 분들한테 강력 추천합니다. 과제가 명확하고, 스스로 검증하고 개선하는 방법을 배울 수 있어요. 멘토링 없어도 충분히 성장 가능합니다.' },
    { name: 'training_mode', rating: 5, date: '2개월 전', content: '이게 진짜 성장책이네요. 단순히 정보를 주는 게 아니라 실제로 훈련시키는 책입니다. 30일 동안 매일 과제 풀면서 실력이 쌓이는 게 느껴져요.' },
    { name: '이서준', rating: 4, date: '2개월 전', content: '스캠 필터는 정말 유용한데, 과제는 좀 많아요. 하루 1시간 정도는 투자해야 제대로 소화할 수 있을 것 같습니다. 시간 여유 있으신 분들한테 추천해요.' },
    { name: 'logic_trader', rating: 5, date: '2개월 전', content: '논리적 필터링이 이렇게 중요한지 몰랐어요. 감정적으로 끌리던 프로젝트들을 체크리스트로 걸러내니까 투자 판단이 훨씬 냉정해졌습니다. 계좌 지키는 최고의 도구예요.' },
    { name: '최유나', rating: 5, date: '3개월 전', content: '30일 챌린지 2회차 끝냈어요. 1회차 때보다 훨씬 빠르고 정확하게 풀리더라고요. 반복하면서 실력이 자동화되는 느낌입니다. 3회차도 도전할 예정이에요!' },
    { name: 'challenge_addict', rating: 5, date: '3개월 전', content: '과제집 중독됐어요. 매일 과제 푸는 게 재밌고, 실력 늘어나는 게 눈에 보여서 동기부여가 계속 됩니다. 이 가격에 이런 퀄리티는 정말 혜자예요.' },
    { name: '박현우', rating: 5, date: '3개월 전', content: '스캠 필터가 생각보다 훨씬 상세해요. 단순히 체크리스트만 있는 게 아니라 왜 그 항목이 중요한지, 사기꾼들이 어떤 수법을 쓰는지 설명되어 있어서 이해가 잘 됩니다.' },
    { name: 'safety_first', rating: 4, date: '4개월 전', content: '안전하게 투자하고 싶어서 샀는데 만족해요. 스캠 필터는 평생 자산이고, 과제집은 실력 향상에 확실히 도움됩니다. 다만 멘토링이 필요한 분은 올인원 패키지를 추천드려요.' },
    { name: '강민서', rating: 5, date: '4개월 전', content: '혼자서도 체계적으로 공부할 수 있게 설계되어 있어요. 30일 과제를 따라가다 보면 자연스럽게 기준이 생기고, 스스로 판단하는 능력이 생깁니다. 자습서로 정말 완벽해요!' }
];

// FAQ 내용
const faqItems = [
    {
        question: 'Q: 이 책에도 1:1 멘토링이나 피드백이 포함되나요?',
        answer: 'A: 아니요, 포함되지 않습니다. 이 성장책은 스스로 \'기준\'을 세우고 \'훈련\'할 수 있도록 설계된 \'데이터 기반 자습서(Self-Training Workbook)\'입니다. 만약 이 과제집을 바탕으로 현역 트레이더의 1:1 피드백과 지도가 필요하시다면, "일반인을 위한 시스템 투자 올인원" 패키지를 권장합니다.'
    },
    {
        question: 'Q: 저는 이미 경험이 좀 있는데, \'스캠 필터\'가 굳이 필요할까요?',
        answer: 'A: 사기꾼들은 당신의 \'지능\'이 아닌 \'욕망\'을 공격합니다. "이번만은 다르겠지"라는 안일함이 가장 똑똑한 사람을 가장 멍청한 피해자로 만듭니다. 현역 팀이 분석한 \'논리적 필터링 체크리스트\'는 당신의 순간적인 욕망을 차단하는 \'이성적 안전장치\'입니다. 한 번의 실수로 모든 시드를 날리는 시장에서, 이 체크리스트는 당신의 계좌를 지키는 가장 저렴한 보험입니다.'
    },
    {
        question: 'Q: 구매 후 자료는 어떻게 받나요?',
        answer: 'A: 결제 즉시, 기다림 없이 열람 가능합니다. 구매 확정과 동시에 홈페이지 내 [마이 콘텐츠]에서 모든 자료(PDF)를 즉시 확인하고 다운로드하실 수 있습니다. 이메일을 기다릴 필요 없이, 지금 바로 당신의 훈련을 시작하십시오.'
    },
];

// [ 2. 수정 ] 결제 정보를 새 상품에 맞게 변경
const itemForPay: PaymentItem = {
    title: "일반인의 성장책: 스캠필터와 챌린지",
    subtitle: "데이터 기반 훈련법",
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

    // [ 3. 수정 ] 찜하기 정보를 새 상품에 맞게 변경
    const productInfo = {
        id: 'growth-book',
        title: '일반인의 성장책: 스캠필터와 챌린지',
        author: 'kobba',
        price: '60,000',
        thumbnail: "/로고.png",
    };

    const liked = isLiked(productInfo.id);
    const purchased = isPurchased(productInfo.id);

    // 스크롤 애니메이션 훅 (기존과 동일)
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

    const handleLearnClick = () => {
        router.push('/learn/growth-book');
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

                        <div className={styles.contentArea}>
                            {/* 제목 섹션 */}
                            <section style={{marginTop: '60px', marginBottom: '60px'}}>
                                <h2 className={styles.mainHeadline} style={{textAlign: 'center', marginBottom: '16px'}}>
                                    일반인의 성장책: 스캠필터와 챌린지
                                </h2>
                                <p className={styles.mainSubheadline} style={{textAlign: 'center'}}>
                                    스스로를 '분석'하고 '성장'시키는 데이터 기반 훈련법입니다.
                                </p>
                            </section>

                            {/* 소개 문구 */}
                            <section className={styles.sectionSpacing}>
                                <p className={styles.bodyText} style={{textAlign: 'center', marginBottom: '20px'}}>
                                    <strong>성급한 매매로 돈을 잃고, 사기성 정보에 속거나<br/>
                                    해킹당한 경험이 있으신가요?</strong>
                                </p>
                                <p className={styles.bodyText} style={{textAlign: 'center', marginBottom: '20px'}}>
                                    이 성장책에는 위험을 피하는 <strong>'스캠 필터링'</strong>과 저희 팀이 신입에게 가장 먼저 가르치는 '생존 원칙',<br/>
                                    그리고 <strong>'데이터 기반 훈련법'</strong>을 모두 담았습니다.
                                </p>
                                <p className={styles.bodyText} style={{textAlign: 'center'}}>
                                    더 이상 '감'이 아닌, 스스로의 실력을 '데이터'로 분석하고<br/>
                                    성장하는 과정을 직접 경험하세요.
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

                            {/* 이미지 섹션 - g3 폴더의 이미지들 */}
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                <img src="/g3/1.png" alt="성장책 - 섹션 1" style={{width: '760px', height: 'auto', display: 'block', maxWidth: '100%'}} />
                                <img src="/g3/2.png" alt="성장책 - 섹션 2" style={{width: '760px', height: 'auto', display: 'block', maxWidth: '100%'}} />
                                <img src="/g3/3.png" alt="성장책 - 섹션 3" style={{width: '760px', height: 'auto', display: 'block', maxWidth: '100%'}} />
                                <img src="/g3/4.png" alt="성장책 - 섹션 4" style={{width: '760px', height: 'auto', display: 'block', maxWidth: '100%'}} />
                                <img src="/g3/5.png" alt="성장책 - 섹션 5" style={{width: '760px', height: 'auto', display: 'block', maxWidth: '100%'}} />
                                <img src="/g3/6.png" alt="성장책 - 섹션 6" style={{width: '760px', height: 'auto', display: 'block', maxWidth: '100%'}} />
                                <img src="/g3/7.png" alt="성장책 - 섹션 7" style={{width: '760px', height: 'auto', display: 'block', maxWidth: '100%'}} />
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