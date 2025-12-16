"use client";

import React, { useState, useEffect } from 'react';
import styles from './ProductDetail.module.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PaymentModal, { PaymentItem } from "@/components/PaymentModal";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useScrollFadeIn } from '@/hooks/useScrollFadeIn';

import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

// 후기 데이터 - g2 상품 (첫번째 안내서)
const reviews = [
    { name: '김준호', rating: 5, date: '2일 전', content: '트레이딩뷰 처음 써보는데 세팅 파일 하나로 프로 화면 그대로 복사됐어요. 설명서대로 따라하니 10분 만에 세팅 완료. 이제 도구 배우느라 시간 낭비 안 해도 되겠네요.' },
    { name: 'chart_starter', rating: 5, date: '3일 전', content: '가격이 저렴해서 기대 안 했는데 완전 혜자예요. 프로 트레이더가 실제로 쓰는 차트 세팅을 그대로 받으니까 바로 분석에 집중할 수 있어요. 굳이 비싼 패키지 안 사도 될 것 같습니다.' },
    { name: '이민지', rating: 4, date: '5일 전', content: '차트 보기 훨씬 편해졌어요. 예전엔 어떤 지표를 써야 할지 몰라서 이것저것 다 넣었는데, 이 가이드 보고 나니 필요한 것만 깔끔하게 정리됐습니다. 다만 완전 초보면 용어가 좀 어려울 수 있어요.' },
    { name: 'tradingview_user', rating: 5, date: '1주 전', content: '세팅 링크 클릭 한 번으로 모든 게 해결됐습니다. 진짜 10초 컷이에요. 유튜브 보면서 한참 설정하던 시간이 아깝네요. 이거 하나면 초보자도 바로 프로 환경에서 시작할 수 있습니다.' },
    { name: '박서진', rating: 5, date: '1주 전', content: '멘토링 없어도 충분해요. 가이드북이 너무 자세하게 설명되어 있어서 혼자서도 다 따라할 수 있었습니다. 특히 각 지표가 왜 필요한지, 어떻게 해석하는지 설명이 잘 되어 있어요.' },
    { name: 'quick_learner', rating: 5, date: '2주 전', content: '이 가격에 이런 퀄리티라니! 올인원 패키지는 부담스러웠는데 일단 이것부터 시작하길 잘했어요. 차트 세팅만 제대로 돼도 분석이 훨씬 수월하더라고요.' },
    { name: '최유진', rating: 5, date: '2주 전', content: '트레이딩뷰 유료 버전 결제했는데 뭘 어떻게 설정해야 할지 막막했어요. 이 안내서 덕분에 바로 활용할 수 있게 됐습니다. 특히 화면 레이아웃이 정말 깔끔하고 실용적이에요.' },
    { name: 'setup_master', rating: 4, date: '2주 전', content: '설정하는 데 시간 낭비 안 해도 돼서 좋습니다. 다만 트레이딩뷰 자체를 처음 쓰는 분은 기본 사용법은 따로 배우셔야 할 것 같아요. 이건 어디까지나 세팅 가이드니까요.' },
    { name: '정수민', rating: 5, date: '3주 전', content: '완전 초보인데도 따라하기 쉬웠어요. 스크린샷이 많이 포함되어 있어서 그대로 따라만 하면 되더라고요. 이제 프로처럼 차트 볼 수 있게 됐습니다!' },
    { name: 'visual_trader', rating: 5, date: '3주 전', content: '차트가 너무 복잡해서 스트레스였는데, 이 세팅으로 바꾸니까 훨씬 보기 편하고 집중도 잘 돼요. 색상 조합도 눈이 피곤하지 않게 잘 설정되어 있습니다.' },
    { name: '김하은', rating: 5, date: '3주 전', content: '유튜브 보면서 3시간 걸릴 거 10분 만에 끝났어요. 세팅 파일 하나로 모든 게 해결되니까 정말 편합니다. 가성비 최고예요!' },
    { name: 'chart_lover', rating: 5, date: '4주 전', content: '프로 트레이더 화면이 이렇게 생겼구나 싶었어요. 지표도 적당히 들어가 있고, 레이아웃도 효율적이에요. 혼자 이렇게 세팅하려면 시행착오가 엄청났을 텐데 정말 감사합니다.' },
    { name: '이준서', rating: 4, date: '1개월 전', content: '가격 대비 만족스럽습니다. 멘토링까지는 필요 없고 기본 세팅만 필요한 분들한테 딱이에요. 설명도 친절하게 되어 있어서 좋았습니다.' },
    { name: 'beginner_pro', rating: 5, date: '1개월 전', content: '트레이딩뷰 가입하고 막막했는데 이거 하나로 해결됐어요. 어떤 지표를 쓰고, 어떻게 배치하고, 색상은 어떻게 설정하는지 다 나와 있습니다. 초보자 필수템이에요!' },
    { name: '박민수', rating: 5, date: '1개월 전', content: '설정 파일 불러오기 한 번으로 끝. 진짜 간편해요. 가이드북도 PDF로 되어 있어서 나중에 다시 볼 수 있어서 좋고요. 이 가격이면 완전 혜자입니다.' },
    { name: 'chart_setup', rating: 5, date: '1개월 전', content: '다른 사람들 차트 보면서 어떻게 저렇게 설정했을까 궁금했는데, 이 안내서로 그 비밀을 알게 됐어요. 프로의 화면 구성이 이렇게 체계적이었다니!' },
    { name: '강지우', rating: 5, date: '2개월 전', content: '올인원은 너무 비싸서 망설였는데, 일단 이거부터 시작하길 잘했어요. 세팅만 제대로 돼도 트레이딩 효율이 확 올라가는 걸 느꼈습니다.' },
    { name: 'simple_trader', rating: 4, date: '2개월 전', content: '심플하고 실용적인 세팅이에요. 불필요한 지표 없이 딱 필요한 것만 들어가 있어서 좋습니다. 다만 왜 이 지표를 쓰는지 배경 설명이 더 있었으면 좋았을 것 같아요.' },
    { name: '윤서아', rating: 5, date: '2개월 전', content: '트레이딩뷰 처음 보는 사람도 따라할 수 있을 정도로 친절해요. 각 단계마다 스크린샷이 있어서 헷갈릴 일이 없었습니다. 강력 추천!' },
    { name: 'layout_guru', rating: 5, date: '2개월 전', content: '화면 레이아웃이 정말 효율적이에요. 한눈에 필요한 정보가 다 보이고, 복잡하지 않아서 집중하기 좋습니다. 이 세팅 그대로 평생 쓸 것 같아요.' },
    { name: '조민준', rating: 5, date: '3개월 전', content: '세팅 때문에 트레이딩 시작도 못하고 있었는데, 이 안내서 덕분에 바로 시작할 수 있었어요. 기술적인 부분은 전문가한테 맡기고 저는 분석에만 집중하면 되니까 좋네요.' },
    { name: 'fast_setup', rating: 5, date: '3개월 전', content: '10분 투자로 프로 환경 완성! 이것보다 빠르고 정확한 방법은 없을 것 같아요. 혼자 유튜브 보면서 하루 종일 걸렸을 텐데 정말 시간 절약됐습니다.' },
    { name: '한소희', rating: 4, date: '3개월 전', content: '가성비 좋아요. 비싼 패키지 살 필요 없이 기본 세팅은 이걸로 충분합니다. PDF 자료도 깔끔하게 정리되어 있어서 보기 편했어요.' },
    { name: 'pro_wannabe', rating: 5, date: '4개월 전', content: '프로 트레이더의 화면을 내 모니터에 그대로 복사할 수 있다는 게 이 상품의 핵심인 것 같아요. 정말 그대로 복사됩니다. 이제 남은 건 제 실력을 키우는 것뿐이네요!' },
    { name: '임태양', rating: 5, date: '4개월 전', content: '트레이딩뷰 설정이 이렇게 중요한지 몰랐어요. 세팅 바꾸고 나니 차트 분석이 훨씬 수월해졌습니다. 7만 원으로 이런 효과를 볼 수 있다니 정말 만족스럽습니다!' }
];

const faqItems = [
    {
        question: 'Q. 이 안내서에도 1:1 멘토링이 포함되나요?',
        answer: 'A. 아니요, 본 상품은 1:1 멘토링 및 과제집 피드백이 제외된 \'핵심 셋업 가이드\'입니다. 현역 트레이더의 검증된 기준과 차트 세팅을 스스로 학습하고 적용할 수 있도록 구성된 셀프 가이드북입니다. 1:1 밀착 지원이 필요하신 분은 \'시스템 투자 올인원\' 패키지를 권장합니다.'
    },
    {
        question: 'Q. 트레이딩뷰를 한 번도 써본 적 없는데 괜찮을까요?',
        answer: 'A. 도구 사용법을 익히느라 시간을 낭비하지 마십시오. 당신의 시간은 \'분석\'에 쓰여야지, \'설정\'에 쓰여선 안 됩니다. 이 안내서에는 클릭 한 번으로 저희 팀의 화면 구성을 그대로 볼 수 있는 파일이 포함되어 있습니다. 복잡한 기능 공부 없이, 프로의 환경에서 즉시 시작하십시오. 기술적인 장벽은 저희가 허물어 드립니다.'
    },
    {
        question: 'Q. 구매 후 자료는 어떻게 확인하나요?',
        answer: 'A. 결제 즉시, my콘텐츠 에서 열람 가능합니다. 구매 확정과 동시에 홈페이지 내 [마이 콘텐츠]에서 가이드북(PDF)과 세팅 링크를 즉시 확인하실 수 있습니다. 기다림 없이, 지금 바로 프로의 시야를 당신의 모니터에 이식하십시오.'
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
        id: 'system-builder',
        title: '2025 일반인을 위한 시스템 투자 올인원',
        author: 'kobba',
        price: '210,000',
        thumbnail: "/로고.png",
    };

    const liked = isLiked(productInfo.id);
    const purchased = isPurchased(productInfo.id);

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
                                            Q. 트레이딩뷰를 한 번도 써본 적 없는데 괜찮을까요?
                                        </h4>
                                        <p style={{
                                            fontSize: '15px',
                                            lineHeight: '1.7',
                                            color: '#555',
                                            margin: '0'
                                        }}>
                                            A. 도구 사용법을 익히느라 시간을 낭비하지 마십시오. 당신의 시간은 '분석'에 쓰여야지, '설정'에 쓰여선 안 됩니다. 이 안내서에는 클릭 한 번으로 저희 팀의 화면 구성을 그대로 볼 수 있는 파일이 포함되어 있습니다. 복잡한 기능 공부 없이, 프로의 환경에서 즉시 시작하십시오. 기술적인 장벽은 저희가 허물어 드립니다.
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
                                            Q. 구매 후 자료는 어떻게 확인하나요?
                                        </h4>
                                        <p style={{
                                            fontSize: '15px',
                                            lineHeight: '1.7',
                                            color: '#555',
                                            margin: '0'
                                        }}>
                                            A. 결제 즉시, my콘텐츠 에서 열람 가능합니다. 구매 확정과 동시에 홈페이지 내 [마이 콘텐츠]에서 가이드북(PDF)과 세팅 링크를 즉시 확인하실 수 있습니다. 기다림 없이, 지금 바로 프로의 시야를 당신의 모니터에 이식하십시오.
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
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '8px',
                                    marginTop: '40px'
                                }}>
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
                    productId="system-builder"
                />
            )}
        </div>
    );
};

export default ProductDetailPage;
