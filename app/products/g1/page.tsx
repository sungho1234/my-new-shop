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


// 후기 데이터
const reviews = [
    { name: '민수현', rating: 5, date: '2일 전', content: '완전 초보인데도 멘토님이 하나하나 다 알려주셔서 정말 도움이 많이 됐어요. 특히 거래소 가입부터 차트 세팅까지 실시간으로 같이 해주셔서 혼자서는 절대 못했을 것 같아요. 자료도 체계적이고 과제집도 유용합니다!' },
    { name: 'trader_kim', rating: 5, date: '3일 전', content: '5일 멘토링 기간 동안 정말 많이 배웠습니다. 단순히 매매 방법만 알려주는 게 아니라 시스템적으로 접근하는 법을 배워서 앞으로도 계속 성장할 수 있을 것 같아요. 가격 대비 정말 만족스러운 패키지입니다.' },
    { name: '혜차', rating: 5, date: '5일 전', content: '우연히 유튜브 보고 바로 결제했는데 정말 잘한 선택인 것 같아요! 멘토님이 제 수준에 맞춰서 설명해주시고, 모르는 거 물어보면 바로바로 답변해주셔서 답답함이 없었어요. 원론집 내용도 탄탄하고 실전에 바로 적용할 수 있는 내용들이라 좋습니다.' },
    { name: 'jjun0825', rating: 5, date: '1주 전', content: '만족했습니다. 기대 이상이에요.' },
    { name: 'GO(26652)', rating: 4, date: '1주 전', content: '아직 강의 다 듣기 전이지만 지금까지 본 것만으로도 충분히 가치가 있다고 느껴집니다. 특히 스캠 필터링 체크리스트는 정말 유용하네요. 앞으로 더 열심히 공부해서 실전에 적용해보겠습니다!' },
    { name: 'H.SW', rating: 5, date: '1주 전', content: '이번 패키지는 정말 실전 위주로 구성되어 있어서 좋았어요. 다른 강의들은 이론만 가득한데, 여기는 바로 써먹을 수 있는 도구와 방법론을 제공해주니까 훨씬 효율적입니다. 멘토링도 단순히 질문만 받는 게 아니라 제 상황에 맞춰서 조언해주셔서 정말 도움이 됐습니다.' },
    { name: '박준영', rating: 5, date: '2주 전', content: '직장인이라 시간이 많지 않은데, 멘토님이 제 스케줄에 맞춰서 진행해주셔서 정말 감사했어요. 5일 동안 집중적으로 배우고 나니 혼자서도 할 수 있겠다는 자신감이 생겼습니다. 과제집으로 계속 연습하면서 실력을 키워나가겠습니다!' },
    { name: 'cryptolee', rating: 5, date: '2주 전', content: '솔직히 처음엔 가격이 부담스러웠는데, 막상 받아보니 이 정도 퀄리티면 오히려 저렴한 것 같아요. 6가지 모듈 자료도 알차고, 1:1 멘토링은 정말 값진 경험이었습니다. 특히 실제 현역 트레이더분과 직접 소통할 수 있다는 게 큰 장점이에요.' },
    { name: '이수진', rating: 4, date: '2주 전', content: '전반적으로 만족스럽습니다. 다만 초보자 입장에서는 용어가 좀 어려운 부분도 있었는데, 멘토님께 물어보면 쉽게 설명해주셔서 해결됐어요. 자료들이 평생 쓸 수 있다는 점도 좋고, 앞으로 계속 참고하면서 성장하겠습니다.' },
    { name: 'quant_rookie', rating: 5, date: '3주 전', content: '시스템 트레이딩에 관심은 많았는데 어디서부터 시작해야 할지 몰라서 고민이었어요. 이 패키지로 확실한 방향성을 잡을 수 있었고, 단계별로 따라가면서 자연스럽게 실력이 늘어나는 걸 느꼈습니다. 강력 추천합니다!' },
    { name: '최민호', rating: 5, date: '3주 전', content: '5일 멘토링이 끝난 후에도 자료들을 계속 복습하면서 공부하고 있어요. 특히 원론집이 정말 잘 정리되어 있어서 헷갈릴 때마다 찾아보고 있습니다. 과제집도 실전 연습하기 딱 좋게 구성되어 있고요. 이 가격에 이런 퀄리티면 정말 혜자네요.' },
    { name: 'trading_master', rating: 5, date: '3주 전', content: '다른 유료 강의도 몇 개 들어봤는데, 여기가 가장 체계적이고 실용적이었어요. 이론만 나열하는 게 아니라 실제로 적용할 수 있는 방법을 알려주고, 멘토님이 직접 피드백까지 해주시니까 훨씬 빨리 배울 수 있었습니다.' },
    { name: '김태희', rating: 4, date: '4주 전', content: '기대했던 것보다 더 알차게 구성되어 있어요. 멘토링 5일이 짧게 느껴질 정도로 배울 게 많았고, 자료들도 퀄리티가 높습니다. 다만 완전 초보라면 사전에 기본 용어 정도는 알고 오시는 게 좋을 것 같아요. 그래도 멘토님이 친절하게 설명해주시긴 합니다!' },
    { name: 'sys_trader', rating: 5, date: '4주 전', content: '현역 트레이더분의 노하우를 직접 배울 수 있다는 게 가장 큰 메리트인 것 같아요. 책이나 인터넷에서는 절대 얻을 수 없는 실전 팁들을 많이 알려주셨고, 제 질문에도 성심성의껏 답변해주셔서 정말 감사했습니다.' },
    { name: '박서연', rating: 5, date: '1개월 전', content: '완전 초보였는데 이제는 차트 보는 게 재밌어졌어요! 멘토님이 정말 친절하시고, 제가 이해할 때까지 계속 설명해주셔서 좋았습니다. 30일 과제집도 차근차근 진행하면서 실력을 키워가고 있어요. 강력 추천합니다!' },
    { name: 'invest_pro', rating: 5, date: '1개월 전', content: '가격 대비 정말 만족스러운 패키지입니다. 특히 스캠 필터링 체크리스트는 정말 유용하더라고요. 덕분에 수상한 프로젝트들을 미리 걸러낼 수 있었습니다. 멘토링도 기대 이상이었고, 자료 퀄리티도 훌륭합니다.' },
    { name: '정유진', rating: 4, date: '1개월 전', content: '전반적으로 좋았어요. 다만 5일이라는 기간이 좀 짧게 느껴지긴 했는데, 자료들이 워낙 잘 정리되어 있어서 혼자서도 충분히 공부할 수 있을 것 같아요. 과제집 풀면서 계속 연습하고 있습니다!' },
    { name: 'chart_king', rating: 5, date: '1개월 전', content: '시스템 트레이딩 입문하기 정말 좋은 패키지입니다. 멘토님이 제 수준에 딱 맞춰서 설명해주시고, 실전 예시도 많이 보여주셔서 이해하기 쉬웠어요. 원론집 내용도 정말 알차고, 평생 참고할 만한 자료인 것 같습니다.' },
    { name: '이지훈', rating: 5, date: '1개월 전', content: '다른 강의들은 이론만 가득한데, 여기는 정말 실전 위주로 구성되어 있어서 좋아요. 바로 써먹을 수 있는 도구들과 방법론을 제공해주니까 훨씬 효율적입니다. 멘토링도 1:1로 진행되어서 제 상황에 맞는 조언을 받을 수 있었어요.' },
    { name: 'moon_trader', rating: 5, date: '2개월 전', content: '정말 만족스러운 구매였습니다. 5일 멘토링 동안 배운 내용을 바탕으로 지금도 계속 실전 연습하고 있어요. 과제집이 정말 잘 만들어져 있어서 단계별로 따라가면서 자연스럽게 실력이 늘어나는 걸 느낍니다.' },
    { name: '강민지', rating: 5, date: '2개월 전', content: '처음엔 반신반의했는데, 정말 잘 만든 패키지네요. 특히 현역 트레이더분과 직접 소통할 수 있다는 게 큰 장점이에요. 제 질문에 바로바로 답변해주시고, 실전 팁도 많이 알려주셔서 정말 도움이 됐습니다!' },
    { name: 'crypto_newbie', rating: 4, date: '2개월 전', content: '완전 초보인 저도 따라갈 수 있을 정도로 친절하게 설명해주셔서 좋았어요. 다만 양이 많아서 5일 안에 다 소화하기는 좀 벅찼는데, 자료를 평생 볼 수 있으니까 천천히 복습하면서 공부하고 있습니다.' },
    { name: '윤서준', rating: 5, date: '2개월 전', content: '이 가격에 이런 퀄리티는 정말 찾기 힘들 것 같아요. 6가지 모듈 자료도 알차고, 1:1 멘토링은 정말 값진 경험이었습니다. 특히 스캠 필터링 방법을 배운 게 가장 유용했어요. 덕분에 사기 프로젝트를 피할 수 있게 됐습니다.' },
    { name: 'trading_hero', rating: 5, date: '2개월 전', content: '시스템 트레이딩에 입문하려는 분들한테 강력 추천합니다. 이론부터 실전까지 모든 걸 체계적으로 배울 수 있고, 멘토님의 1:1 지도가 정말 큰 도움이 됩니다. 자료도 평생 쓸 수 있어서 가성비 최고예요!' },
    { name: '최수현', rating: 5, date: '3개월 전', content: '직장 다니면서 틈틈이 공부하고 있는데, 멘토님이 제 스케줄에 맞춰서 진행해주셔서 정말 편했어요. 5일 동안 집중적으로 배우고 나니 이제는 혼자서도 할 수 있겠다는 자신감이 생겼습니다. 정말 추천합니다!' },
    { name: 'quant_student', rating: 4, date: '3개월 전', content: '전반적으로 만족스러웠습니다. 자료들이 체계적으로 잘 정리되어 있고, 멘토링도 유익했어요. 다만 초보자 입장에서는 일부 내용이 좀 어려웠는데, 멘토님께 물어보면 쉽게 설명해주셔서 해결됐습니다.' },
    { name: '김하늘', rating: 5, date: '3개월 전', content: '이런 패키지를 찾고 있었어요! 단순히 이론만 알려주는 게 아니라 실제로 써먹을 수 있는 시스템을 만드는 법을 배울 수 있어서 정말 좋았습니다. 멘토님도 친절하시고, 자료 퀄리티도 훌륭해요. 강력 추천합니다!' },
    { name: 'sys_master', rating: 5, date: '3개월 전', content: '현역 퀀트 트레이더의 노하우를 이 가격에 배울 수 있다는 게 정말 감사한 일인 것 같아요. 5일 멘토링 동안 정말 많이 배웠고, 지금도 자료들을 계속 참고하면서 실력을 키워가고 있습니다. 최고의 투자였습니다!' },
    { name: '박지우', rating: 5, date: '3개월 전', content: '완전 초보였는데 이제는 시스템 트레이딩이 뭔지 확실히 알게 됐어요. 멘토님이 제 눈높이에 맞춰서 설명해주시고, 실전 예시도 많이 보여주셔서 이해하기 쉬웠습니다. 과제집도 단계별로 잘 구성되어 있어서 좋아요!' },
    { name: 'trade_genius', rating: 5, date: '4개월 전', content: '가격 대비 최고의 가성비입니다. 다른 유료 강의 몇 개 들어봤는데 여기가 가장 체계적이고 실용적이었어요. 특히 1:1 멘토링으로 제 상황에 맞는 조언을 받을 수 있었던 게 가장 좋았습니다. 정말 추천합니다!' }
];

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


    const productInfo = {
        id: 'first-guide',  // data/products.ts와 일치하도록 유지
        title: '일반인을 위한 시스템 투자 올인원',
        author: 'kobba',
        price: '100',
        thumbnail: "/로고.png",
    };

    const liked = isLiked(productInfo.id);
    const purchased = isPurchased(productInfo.id);


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
                                <img src="/g1/g3.gif" alt="시스템 투자 올인원 - 섹션 3" style={{width: '760px', height: 'auto', display: 'block', maxWidth: '100%'}} />
                                <img src="/g1/g4.png" alt="시스템 투자 올인원 - 섹션 4" style={{width: '760px', height: 'auto', display: 'block', maxWidth: '100%'}} />
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
                                <img src="/g1/g15.gif" alt="시스템 투자 올인원 - 섹션 15" style={{width: '760px', height: 'auto', display: 'block', maxWidth: '100%'}} />
                                <img src="/g1/g16.png" alt="시스템 투자 올인원 - 섹션 16" style={{width: '760px', height: 'auto', display: 'block', maxWidth: '100%'}} />
                                <img src="/g1/g17.png" alt="시스템 투자 올인원 - 섹션 17" style={{width: '760px', height: 'auto', display: 'block', maxWidth: '100%'}} />
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
                                            Q: 이 과정을 수료하면 바로 '전업 트레이더'가 될 수 있습니까?
                                        </h4>
                                        <p style={{fontSize: '15px', lineHeight: '1.7', color: '#555', margin: '0'}}>
                                            A: 당장 사표를 쓰지 마십시오. 그것은 감정적인 결정입니다. 이 패키지의 목적은 당신의 월급을 대체할 '두 번째 현금 흐름(Second Cashflow)'을 만드는 것입니다. 시스템을 통해 얻은 수익이 당신의 월급을 3개월 연속 초과할 때, 그때 선택해도 늦지 않습니다. 우리는 당신이 감정에 휩쓸려 인생을 배팅하는 도박사가 아닌, 냉철하게 자산을 운용하는 '시스템 빌더(System Builder)'가 되기를 원합니다.
                                        </p>
                                    </div>

                                    {/* FAQ 4 */}
                                    <div style={{padding: '24px', border: '1px solid #e5e7eb', borderRadius: '12px', background: '#fff'}}>
                                        <h4 style={{fontSize: '17px', fontWeight: '700', color: '#333', marginBottom: '16px', lineHeight: '1.6'}}>
                                            Q: 1:1 멘토링은 어떤 방식으로 진행되나요?
                                        </h4>
                                        <p style={{fontSize: '15px', lineHeight: '1.7', color: '#555', margin: '0'}}>
                                            A: 단순 질의응답이 아닌, '코드 리뷰'와 같습니다. 당신이 과제(백테스팅, 매매 일지)를 수행하면, 담당 현역 트레이더가 그 논리를 점검합니다. "왜 이 구간에서 진입했습니까?", "손절 라인의 근거는 무엇입니까?" 이 치열한 문답 과정을 통해, 당신의 머릿속에 있는 막연한 '감'은 날카로운 '데이터'로 다듬어집니다. 5일간 당신은 든든한 '금융 파트너'를 얻게 될 것입니다.
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
