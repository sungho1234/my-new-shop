"use client";

import React, { useState, useEffect } from 'react';
import styles from './ProductDetail.module.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PaymentModal, { PaymentItem } from "@/components/PaymentModal";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const faqItems = [
    { question: 'Q: 코딩이나 프로그래밍 경험이 전혀 없어도 따라할 수 있나요?', answer: 'A: 네, 완전 초보자도 따라올 수 있도록 설계되었습니다. 파이썬 & VS Code 개발 환경 구축부터 차근차근 안내해드리며, AI를 활용한 코드 작성법까지 배우기 때문에 프로그래밍 경험이 없어도 봇을 만들 수 있습니다.' },
    { question: 'Q: 1:1 멘토링은 어떻게 진행되나요?', answer: 'A: 전담 트레이더가 1:1로 배정되어 여러분의 수준에 맞춰 진행됩니다. 거래소 세팅, 지표 설정, 전략 설계, 코드 리뷰까지 실시간으로 함께 진행하며, 궁금한 점은 언제든 질문하실 수 있습니다.' },
    { question: 'Q: VOD는 얼마나 볼 수 있나요?', answer: 'A: 구매일로부터 1년간 무제한으로 다시보기가 가능합니다. 총 21개의 VOD 강의가 제공되며, 원하는 시간에 반복 학습하실 수 있습니다.' },
    { question: 'Q: 어떤 거래소를 사용하나요?', answer: 'A: 거래소 선택 가이드를 통해 API 지원 여부, 출금 한도, 수수료, 슬리피지 등을 비교 분석하여 본인에게 맞는 거래소를 선택하실 수 있도록 안내해드립니다. 특정 거래소를 강제하지 않습니다.' },
    { question: 'Q: 수강생 전용 커뮤니티는 어떤 혜택이 있나요?', answer: 'A: 수강생 전용 커뮤니티에서 다른 수강생들과 전략 아이디어를 공유하고, 질문에 대한 답변을 빠르게 받으실 수 있습니다. 또한 시장 상황에 대한 정보 공유도 활발하게 이루어집니다.' },
];

const itemForPay: PaymentItem = {
    title: '매일 20만원씩 벌어오는 "시스템 트레이딩" 가이드',
    subtitle: "시스템 트레이딩 가이드",
    priceLabel: "107,000원",
    priceValue: 107000,
    thumbnail: "/시스템썸넬후보1.png",
};

const reviews = [
    { name: '민**', rating: 5, date: '2일 전', content: '완전 초보인데도 멘토님이 하나하나 다 알려주셔서 정말 도움이 많이 됐어요. 특히 거래소 가입부터 차트 세팅까지 실시간으로 같이 해주셔서 혼자서는 절대 못했을 것 같아요. 자료도 체계적이고 과제집도 유용합니다!' },
    { name: '김**', rating: 5, date: '3일 전', content: '5일 멘토링 기간 동안 정말 많이 배웠습니다. 단순히 매매 방법만 알려주는 게 아니라 시스템적으로 접근하는 법을 배워서 앞으로도 계속 성장할 수 있을 것 같아요. 가격 대비 정말 만족스러운 패키지입니다.' },
    { name: '이**', rating: 5, date: '5일 전', content: '우연히 유튜브 보고 바로 결제했는데 정말 잘한 선택인 것 같아요! 멘토님이 제 수준에 맞춰서 설명해주시고, 모르는 거 물어보면 바로바로 답변해주셔서 답답함이 없었어요. 원론집 내용도 탄탄하고 실전에 바로 적용할 수 있는 내용들이라 좋습니다.' },
    { name: '박**', rating: 5, date: '1주 전', content: '거래소 체크리스트 보고 깜짝 놀랐습니다. API 지원 여부, 출금 한도, 슬리피지 차이까지 이렇게 꼼꼼하게 비교해놓은 자료는 처음 봐요. 덕분에 거래소 선택에서 시간 엄청 아꼈습니다.' },
    { name: '최**', rating: 5, date: '1주 전', content: 'EMA, ATR, CCI, VWAP 지표를 실제로 어떻게 조합해서 쓰는지 구체적으로 배웠습니다. 특히 ATR로 동적 손절/익절 잡는 방법이 실전에서 진짜 유용해요.' },
    { name: '정**', rating: 5, date: '1주 전', content: '회사 다니면서 차트 볼 시간이 없었는데, 시스템으로 자동화하니까 진짜 편합니다. VOD 다시보기 1년 제공되는 것도 좋고, 모르는 부분 커뮤니티에서 바로 물어볼 수 있어서 좋아요.' },
    { name: '강**', rating: 5, date: '2주 전', content: 'VWAP 밴드 활용법이 정말 신세계였습니다. 표준편차로 과매수/과매도 구간 잡는 게 이렇게 효과적일 줄 몰랐어요. 백테스트 결과도 좋고요.' },
    { name: '한**', rating: 4, date: '2주 전', content: '완전 문과생인데 파이썬 환경 세팅부터 차근차근 알려주셔서 따라할 수 있었어요. 다만 코딩 베이스가 아예 없으면 초반에 좀 어려울 수 있을 것 같아요. 그래도 전반적으로 만족합니다!' },
    { name: 'CryptoJake', rating: 5, date: '2주 전', content: 'Finally found a course that actually teaches systematic trading properly. The EMA trend following + ATR risk management combo is solid. Worth every penny.' },
    { name: '오**', rating: 5, date: '3주 전', content: '과적합 방지하는 방법, 슬리피지 계산하는 법 등 실전에서 필수인 내용들 다 들어있습니다. 다른 강의들은 그냥 지표 설명만 하는데 여기는 실제 운용 관점에서 알려줘서 차원이 다릅니다.' },
    { name: '서**', rating: 5, date: '3주 전', content: '1:1 멘토링이 진짜 핵심이에요. 혼자 했으면 몇 달 걸렸을 걸 5일 만에 끝냈습니다. 트레이더님께서 제 코드 직접 봐주시면서 피드백 주신 게 정말 감사했어요. 덕분에 지금은 봇이 잘 돌아가고 있습니다!' },
    { name: '임**', rating: 5, date: '3주 전', content: '매매일지 템플릿 퀄리티가 장난 아닙니다. 승률, 손익비, 드로우다운 자동 계산되고 시각화까지 되어 있어서 제 트레이딩 패턴 분석하는 데 큰 도움이 됩니다.' },
    { name: 'TradingNinja', rating: 5, date: '1달 전', content: 'The position sizing module alone is worth the price. Most traders blow their accounts due to poor risk management. This course drills proper sizing into you.' },
    { name: '안**', rating: 5, date: '1달 전', content: '주식만 하다가 코인 시스템 트레이딩으로 넘어왔는데, 24시간 돌아가는 게 진짜 좋네요. 서버 세팅하는 것도 영상 보면서 그대로 따라하니까 어렵지 않았어요.' },
    { name: '윤**', rating: 5, date: '1달 전', content: 'AI한테 전략 명세서 작성하는 법 배운 게 제일 유용했습니다. 이제 아이디어만 있으면 바로 코드로 구현할 수 있어요. 강사님께 진심으로 감사드립니다. 1:1 멘토링 때 새벽까지 질문에 답변해주셔서 정말 감동이었어요.' },
    { name: '송**', rating: 4, date: '1달 전', content: 'CCI 지표 활용법이 특히 좋았어요. 과매수/과매도 반전 구간 잡는 게 생각보다 정확하더라고요. 다만 영상이 좀 길어서 1.5배속으로 봤습니다.' },
    { name: 'BlockchainBro', rating: 5, date: '1달 전', content: 'Great community support. Whenever I had questions about the code or strategy logic, someone always helped out within hours. The Korean trading community here is very active.' },
    { name: '홍**', rating: 5, date: '1달 전', content: '퇴근 후에 조금씩 공부해서 2주 만에 첫 봇 돌렸습니다. 아직 수익은 크지 않지만 시스템이 알아서 매매하니까 마음이 편해요. 감정 매매 안 하게 된 게 제일 큰 변화입니다.' },
    { name: '권**', rating: 5, date: '2달 전', content: '하이브리드 전략 설계 파트가 제일 좋았어요. EMA로 추세 잡고, ATR로 손절 정하고, CCI로 진입 타이밍 잡는 게 체계적으로 정리되어 있어서 바로 적용할 수 있었습니다.' },
    { name: '조**', rating: 5, date: '2달 전', content: '다른 시스템 트레이딩 강의도 들어봤는데 여기가 실전 위주로 가장 잘 되어 있는 것 같습니다. 특히 슬리피지, 수수료 같은 히든 코스트 관리하는 부분이 현실적이에요.' },
    { name: '유**', rating: 5, date: '2달 전', content: '처음에는 비싸다고 생각했는데 1:1 멘토링 받고 나서 생각이 바뀌었어요. 월조 트레이더님이 정말 성심성의껏 알려주십니다. 모르는 거 하나하나 다 대답해주시고, 제 상황에 맞는 조언도 해주셔서 너무 감사했습니다. 혼자 삽질할 시간 생각하면 오히려 저렴한 것 같아요.' },
];

const ProductDetailPage = () => {
    const [paymentOpen, setPaymentOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 4;

    const [dbReviews, setDbReviews] = useState<any[]>([]);
    const [selectedRating, setSelectedRating] = useState(0);
    const [reviewContent, setReviewContent] = useState('');
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [hasWrittenReview, setHasWrittenReview] = useState(false);

    const { user, addToWishlist, removeFromWishlist, isLiked, isPurchased } = useAuth();
    const router = useRouter();

    const productInfo = {
        id: 'first-guide',
        title: '매일 20만원씩 벌어오는 "시스템 트레이딩" 가이드',
        author: '월조',
        price: '107,000',
        thumbnail: "/시스템썸넬후보1.png",
    };

    const liked = isLiked(productInfo.id);
    const purchased = isPurchased(productInfo.id);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch(`/api/reviews?productId=${productInfo.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setDbReviews(data.reviews);
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
                setDbReviews([data.review, ...dbReviews]);
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

    const handleBuyNowClick = () => {
        if (!user) {
            if (window.confirm("로그인이 필요한 서비스입니다. 로그인 하시겠습니까?")) {
                router.push('/login');
            }
            return;
        }

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

    return (
        <div>
            <Header />
            <div id="wrapper" style={{maxWidth: '1280px', margin: '0 auto', padding: '40px 16px 0 16px'}}>
                <div className={styles.mainContainer}>
                    <main className={styles.contentColumn}>

                        {/* 유튜브 영상 */}
                        <section className={styles.mediaContainer}>
                            <iframe
                                src="https://www.youtube.com/embed/YOUTUBE_VIDEO_ID"
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen>
                            </iframe>
                        </section>

                        {/* 탭 메뉴 - 스크롤 네비게이션 */}
                        <div style={{
                            display: 'flex',
                            gap: '40px',
                            borderBottom: '1px solid #e5e7eb',
                            marginTop: '32px',
                            marginBottom: '0',
                            position: 'sticky',
                            top: '0',
                            background: '#fff',
                            zIndex: 10
                        }}>
                            {[
                                { id: 'intro-section', label: '소개' },
                                { id: 'curriculum-section', label: 'Curriculum' },
                                { id: 'faq-section', label: 'FAQ' },
                                { id: 'review-section', label: '후기' }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        const element = document.getElementById(tab.id);
                                        if (element) {
                                            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                        }
                                    }}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        padding: '16px 4px',
                                        fontSize: '15px',
                                        fontWeight: '400',
                                        color: '#9ca3af',
                                        cursor: 'pointer',
                                        borderBottom: '2px solid transparent',
                                        marginBottom: '-1px',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color = '#1a1a1a';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color = '#9ca3af';
                                    }}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                    <div className={styles.contentArea}>
                        {/* 소개 섹션 */}
                        <div id="intro-section" style={{padding: '40px 0', borderBottom: '1px solid #e5e7eb'}}>
                            <h3 style={{
                                fontSize: '20px',
                                fontWeight: '700',
                                color: '#333',
                                marginBottom: '32px',
                                paddingLeft: '16px',
                                borderLeft: '4px solid #000000'
                            }}>
                                소개
                            </h3>

                            <section style={{marginBottom: '40px'}}>
                                <h2 className={styles.mainHeadline} style={{textAlign: 'center', marginBottom: '16px'}}>
                                    매일 20만원씩 벌어오는 "시스템 트레이딩" 가이드
                                </h2>
                                <p className={styles.mainSubheadline} style={{textAlign: 'center'}}>
                                    스스로를 '분석'하고 '성장'시키는 데이터 기반 훈련법입니다.
                                </p>
                            </section>

                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                <img src="/20만원벌어/1번.png" alt="시스템 트레이딩 가이드 - 섹션 1" style={{width: '100%', height: 'auto', display: 'block'}} />
                                <img src="/20만원벌어/2번.png" alt="시스템 트레이딩 가이드 - 섹션 2" style={{width: '100%', height: 'auto', display: 'block'}} />
                                <img src="/20만원벌어/3번.png" alt="시스템 트레이딩 가이드 - 섹션 3" style={{width: '100%', height: 'auto', display: 'block'}} />
                                <img src="/20만원벌어/4번.png" alt="시스템 트레이딩 가이드 - 섹션 4" style={{width: '100%', height: 'auto', display: 'block'}} />
                                <img src="/20만원벌어/5번.png" alt="시스템 트레이딩 가이드 - 섹션 5" style={{width: '100%', height: 'auto', display: 'block'}} />
                                <img src="/20만원벌어/6번.png" alt="시스템 트레이딩 가이드 - 섹션 6" style={{width: '100%', height: 'auto', display: 'block'}} />
                                <img src="/20만원벌어/7번.png" alt="시스템 트레이딩 가이드 - 섹션 7" style={{width: '100%', height: 'auto', display: 'block'}} />
                                <img src="/20만원벌어/8번.png" alt="시스템 트레이딩 가이드 - 섹션 8" style={{width: '100%', height: 'auto', display: 'block'}} />
                                <img src="/20만원벌어/9번.png" alt="시스템 트레이딩 가이드 - 섹션 9" style={{width: '100%', height: 'auto', display: 'block'}} />
                                <img src="/20만원벌어/10번.png" alt="시스템 트레이딩 가이드 - 섹션 10" style={{width: '100%', height: 'auto', display: 'block'}} />
                                <img src="/20만원벌어/11번.png" alt="시스템 트레이딩 가이드 - 섹션 11" style={{width: '100%', height: 'auto', display: 'block'}} />
                                <img src="/20만원벌어/12번.png" alt="시스템 트레이딩 가이드 - 섹션 12" style={{width: '100%', height: 'auto', display: 'block'}} />
                            </div>
                        </div>

                        {/* Curriculum 섹션 */}
                        <div id="curriculum-section" style={{padding: '40px 0', borderBottom: '1px solid #e5e7eb'}}>
                            <h3 style={{
                                fontSize: '20px',
                                fontWeight: '700',
                                color: '#333',
                                marginBottom: '32px',
                                paddingLeft: '16px',
                                borderLeft: '4px solid #000000'
                            }}>
                                Curriculum
                            </h3>

                            <div style={{display: 'flex', flexDirection: 'column', gap: '0'}}>
                                {/* 섹션 1: 노동 소득에서 시스템 소득으로 */}
                                <div style={{
                                    padding: '20px 0',
                                    borderBottom: '1px solid #f3f4f6',
                                    fontSize: '15px',
                                    fontWeight: '500',
                                    color: '#6b7280'
                                }}>
                                    노동 소득에서 시스템 소득으로
                                </div>

                                {/* VOD 1 */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '16px 0',
                                    borderBottom: '1px solid #f3f4f6'
                                }}>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '12px', flex: 1}}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            background: '#3b82f6',
                                            borderRadius: '6px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0
                                        }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                                                <path d="M8 5v14l11-7z"/>
                                            </svg>
                                        </div>
                                        <div style={{flex: 1}}>
                                            <div style={{fontSize: '12px', color: '#9ca3af', marginBottom: '4px', fontWeight: '400'}}>VOD</div>
                                            <div style={{fontSize: '15px', color: '#374151', fontWeight: '400'}}>OT - 당신이 잠든 사이에도 코드는 돈을 벌고있습니다.</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => router.push('/learn/first-guide/watch?lecture=lec-1-1')}
                                        style={{
                                        padding: '8px 16px',
                                        background: '#3b82f6',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontSize: '13px',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        flexShrink: 0
                                    }}>
                                        무료공개 ▶
                                    </button>
                                </div>

                                {/* VOD 2 */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '16px 0',
                                    borderBottom: '1px solid #f3f4f6'
                                }}>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '12px', flex: 1}}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            background: '#3b82f6',
                                            borderRadius: '6px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0
                                        }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                                                <path d="M8 5v14l11-7z"/>
                                            </svg>
                                        </div>
                                        <div style={{flex: 1}}>
                                            <div style={{fontSize: '12px', color: '#9ca3af', marginBottom: '4px', fontWeight: '400'}}>VOD</div>
                                            <div style={{fontSize: '15px', color: '#374151', fontWeight: '400'}}>돈버는 시간대 (지표 제공)</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => router.push('/learn/first-guide/watch?lecture=lec-1-2')}
                                        style={{
                                        padding: '8px 16px',
                                        background: '#3b82f6',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontSize: '13px',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        flexShrink: 0
                                    }}>
                                        무료공개 ▶
                                    </button>
                                </div>

                                {/* 섹션 2: 기초 용어를 넘어 시장의 '미시구조(Microstructure)'를 이해하는 단계 */}
                                <div style={{
                                    padding: '20px 0',
                                    borderBottom: '1px solid #f3f4f6',
                                    fontSize: '15px',
                                    fontWeight: '500',
                                    color: '#6b7280',
                                    marginTop: '12px'
                                }}>
                                    기초 용어를 넘어 시장의 '미시구조(Microstructure)'를 이해하는 단계
                                </div>

                                {/* VOD 3-6 */}
                                {[
                                    { title: "API 통신과 캔들(OHLCV) 데이터의 구조", time: "00:15:32" },
                                    { title: "과적합(Overfitting)의 함정과 성과 검증", time: "00:22:18" },
                                    { title: "슬리피지와 수수료, '히든 코스트' 통제하기", time: "00:18:45" },
                                    { title: "파산을 막는 '포지션 사이징'과 레버리지", time: "00:24:11" }
                                ].map((vod, idx) => (
                                    <div key={idx} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '16px 0',
                                        borderBottom: '1px solid #f3f4f6'
                                    }}>
                                        <div style={{display: 'flex', alignItems: 'center', gap: '12px', flex: 1}}>
                                            <div style={{
                                                width: '32px',
                                                height: '32px',
                                                background: '#3b82f6',
                                                borderRadius: '6px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0
                                            }}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                                                    <path d="M8 5v14l11-7z"/>
                                                </svg>
                                            </div>
                                            <div style={{flex: 1}}>
                                                <div style={{fontSize: '12px', color: '#9ca3af', marginBottom: '4px', fontWeight: '400'}}>VOD</div>
                                                <div style={{fontSize: '15px', color: '#374151', fontWeight: '400'}}>{vod.title}</div>
                                            </div>
                                        </div>
                                        <div style={{fontSize: '14px', color: '#6b7280', flexShrink: 0, fontWeight: '400'}}>{vod.time}</div>
                                    </div>
                                ))}

                                {/* 섹션 3: 프로가 사용하는 4가지 핵심 지표 */}
                                <div style={{
                                    padding: '20px 0',
                                    borderBottom: '1px solid #f3f4f6',
                                    fontSize: '15px',
                                    fontWeight: '500',
                                    color: '#6b7280',
                                    marginTop: '12px'
                                }}>
                                    프로가 사용하는 4가지 핵심 지표
                                </div>

                                {/* VOD 7-10 */}
                                {[
                                    { title: "EMA를 활용한 추세 추종 메커니즘", time: "00:19:27" },
                                    { title: "ATR을 활용한 동적(Dynamic) 리스크 관리", time: "00:21:33" },
                                    { title: "CCI로 포착하는 과매수·과매도 반전 구간", time: "00:17:56" },
                                    { title: "VWAP과 표준편차 밴드의 통계적 활용", time: "00:23:42" }
                                ].map((vod, idx) => (
                                    <div key={idx} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '16px 0',
                                        borderBottom: '1px solid #f3f4f6'
                                    }}>
                                        <div style={{display: 'flex', alignItems: 'center', gap: '12px', flex: 1}}>
                                            <div style={{
                                                width: '32px',
                                                height: '32px',
                                                background: '#3b82f6',
                                                borderRadius: '6px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0
                                            }}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                                                    <path d="M8 5v14l11-7z"/>
                                                </svg>
                                            </div>
                                            <div style={{flex: 1}}>
                                                <div style={{fontSize: '12px', color: '#9ca3af', marginBottom: '4px', fontWeight: '400'}}>VOD</div>
                                                <div style={{fontSize: '15px', color: '#374151', fontWeight: '400'}}>{vod.title}</div>
                                            </div>
                                        </div>
                                        <div style={{fontSize: '14px', color: '#6b7280', flexShrink: 0, fontWeight: '400'}}>{vod.time}</div>
                                    </div>
                                ))}

                                {/* 섹션 4: 단순한 매매법이 아닌, 논리적인 '프레임워크'를 갖추는 단계 */}
                                <div style={{
                                    padding: '20px 0',
                                    borderBottom: '1px solid #f3f4f6',
                                    fontSize: '15px',
                                    fontWeight: '500',
                                    color: '#6b7280',
                                    marginTop: '12px'
                                }}>
                                    단순한 매매법이 아닌, 논리적인 '프레임워크'를 갖추는 단계
                                </div>

                                {/* VOD 11-13 */}
                                {[
                                    { title: "직관을 이기는 '확률적 사고'와 기대값", time: "00:26:14" },
                                    { title: "4가지 지표를 통합한 '하이브리드 전략' 설계", time: "00:31:28" },
                                    { title: "인간의 한계를 넘는 시스템만의 영역", time: "00:20:55" }
                                ].map((vod, idx) => (
                                    <div key={idx} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '16px 0',
                                        borderBottom: '1px solid #f3f4f6'
                                    }}>
                                        <div style={{display: 'flex', alignItems: 'center', gap: '12px', flex: 1}}>
                                            <div style={{
                                                width: '32px',
                                                height: '32px',
                                                background: '#3b82f6',
                                                borderRadius: '6px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0
                                            }}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                                                    <path d="M8 5v14l11-7z"/>
                                                </svg>
                                            </div>
                                            <div style={{flex: 1}}>
                                                <div style={{fontSize: '12px', color: '#9ca3af', marginBottom: '4px', fontWeight: '400'}}>VOD</div>
                                                <div style={{fontSize: '15px', color: '#374151', fontWeight: '400'}}>{vod.title}</div>
                                            </div>
                                        </div>
                                        <div style={{fontSize: '14px', color: '#6b7280', flexShrink: 0, fontWeight: '400'}}>{vod.time}</div>
                                    </div>
                                ))}

                                {/* 섹션 5: 실제 개발 환경을 구축하고 시스템을 '배포(Deploy)'하는 단계 */}
                                <div style={{
                                    padding: '20px 0',
                                    borderBottom: '1px solid #f3f4f6',
                                    fontSize: '15px',
                                    fontWeight: '500',
                                    color: '#6b7280',
                                    marginTop: '12px'
                                }}>
                                    실제 개발 환경을 구축하고 시스템을 '배포(Deploy)'하는 단계
                                </div>

                                {/* VOD 14-17 */}
                                {[
                                    { title: "파이썬 & VS Code 개발 환경 구축하기", time: "00:28:36" },
                                    { title: "AI가 이해하는 '전략 명세서' 작성법", time: "00:25:19" },
                                    { title: '"코드 써줘" 한 마디로 완성하는 봇 개발 실습', time: "00:35:47" },
                                    { title: "24시간 무중단 서버 운영과 알림 시스템", time: "00:29:22" }
                                ].map((vod, idx) => (
                                    <div key={idx} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '16px 0',
                                        borderBottom: idx === 3 ? 'none' : '1px solid #f3f4f6'
                                    }}>
                                        <div style={{display: 'flex', alignItems: 'center', gap: '12px', flex: 1}}>
                                            <div style={{
                                                width: '32px',
                                                height: '32px',
                                                background: '#3b82f6',
                                                borderRadius: '6px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0
                                            }}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                                                    <path d="M8 5v14l11-7z"/>
                                                </svg>
                                            </div>
                                            <div style={{flex: 1}}>
                                                <div style={{fontSize: '12px', color: '#9ca3af', marginBottom: '4px', fontWeight: '400'}}>VOD</div>
                                                <div style={{fontSize: '15px', color: '#374151', fontWeight: '400'}}>{vod.title}</div>
                                            </div>
                                        </div>
                                        <div style={{fontSize: '14px', color: '#6b7280', flexShrink: 0, fontWeight: '400'}}>{vod.time}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* FAQ 섹션 */}
                        <section id="faq-section" style={{padding: '40px 0', borderBottom: '1px solid #e5e7eb'}}>
                            <h3 style={{
                                fontSize: '20px',
                                fontWeight: '700',
                                color: '#333',
                                marginBottom: '32px',
                                paddingLeft: '16px',
                                borderLeft: '4px solid #000000'
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

                        {/* 후기 섹션 */}
                        <section id="review-section" style={{padding: '40px 0'}}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px'}}>
                                <h3 style={{
                                    fontSize: '20px',
                                    fontWeight: '700',
                                    color: '#333',
                                    margin: '0',
                                    paddingLeft: '16px',
                                    borderLeft: '4px solid #000000'
                                }}>
                                    후기
                                </h3>
                                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                    <span style={{fontSize: '18px', color: '#FFB800'}}>★</span>
                                    <span style={{fontSize: '16px', fontWeight: '700', color: '#333'}}>4.9</span>
                                    <span style={{fontSize: '14px', color: '#9ca3af'}}>({dbReviews.length + reviews.length})</span>
                                </div>
                            </div>

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
                                                    background: (purchased && user && !isSubmittingReview && selectedRating > 0 && reviewContent.trim().length >= 10) ? '#3b82f6' : '#e5e7eb',
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

                            <div style={{display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px'}}>
                                {(() => {
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
                                                color: currentPage === pageNum ? '#3b82f6' : '#6b7280',
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

                    {/* 사이드바 - 구매 카드 */}
                    <aside className={styles.sidebarColumn} style={{marginLeft: '60px', maxWidth: '350px'}}>
                        <div style={{
                            border: '1px solid #e5e7eb',
                            borderRadius: '0',
                            padding: '24px',
                            background: '#fff',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
                        }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'flex-start',
                            marginBottom: '4px'
                        }}>
                            <button
                                onClick={handleLikeClick}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill={liked ? '#ef4444' : 'none'}
                                    stroke={liked ? '#ef4444' : '#9ca3af'}
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                </svg>
                            </button>
                        </div>

                        <div style={{display: 'flex', gap: '8px', marginBottom: '12px'}}>
                            <div style={{
                                display: 'inline-block',
                                padding: '4px 10px',
                                background: '#fff',
                                border: '1px solid #FF6B35',
                                color: '#FF6B35',
                                fontSize: '12px',
                                fontWeight: '600',
                                borderRadius: '12px'
                            }}>
                                강의
                            </div>
                            <div style={{
                                display: 'inline-block',
                                padding: '4px 10px',
                                background: '#ef4444',
                                color: '#fff',
                                fontSize: '12px',
                                fontWeight: '600',
                                borderRadius: '12px'
                            }}>
                                NEW
                            </div>
                        </div>

                        <h1 style={{
                            fontSize: '21px',
                            fontWeight: '700',
                            lineHeight: '1.35',
                            color: '#1a1a1a',
                            marginBottom: '10px',
                            marginTop: '0'
                        }}>
                            매일 20만원씩 벌어오는 "시스템 트레이딩" 가이드
                        </h1>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            marginBottom: '10px'
                        }}>
                            <span style={{color: '#FFB800', fontSize: '14px'}}>★★★★★</span>
                            <span style={{fontSize: '14px', color: '#333', fontWeight: '600'}}>5.0</span>
                            <span style={{fontSize: '13px', color: '#9ca3af'}}>(27)</span>
                        </div>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '13px',
                            color: '#6b7280',
                            marginBottom: '20px'
                        }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                            <span>27명 수강</span>
                        </div>

                        <div style={{marginBottom: '20px'}}>
                            <p style={{fontSize: '13px', color: '#9ca3af', marginBottom: '4px'}}>12개월 할부 시</p>

                            <div style={{display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '16px'}}>
                                <span style={{fontSize: '20px', fontWeight: '700', color: '#ef4444'}}>73%</span>
                                <span style={{fontSize: '14px', color: '#1a1a1a'}}>월</span>
                                <span style={{fontSize: '26px', fontWeight: '800', color: '#1a1a1a'}}>107,000원</span>
                            </div>

                            <div style={{display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px'}}>
                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                    <span style={{color: '#9ca3af'}}>권장 소비자 가격</span>
                                    <span style={{color: '#9ca3af', textDecoration: 'line-through'}}>4,780,000원</span>
                                </div>
                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                    <span style={{color: '#9ca3af'}}>할인 금액</span>
                                    <span style={{color: '#6b7280'}}>3,490,000원</span>
                                </div>
                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                    <span style={{color: '#9ca3af'}}>할인 판매가</span>
                                    <span style={{color: '#1a1a1a', fontWeight: '700'}}>1,290,000원</span>
                                </div>
                            </div>
                        </div>

                        {isPurchased(productInfo.id) ? (
                            <button
                                onClick={handleLearnClick}
                                style={{
                                    width: '100%',
                                    padding: '15px',
                                    background: '#10b981',
                                    color: '#fff',
                                    fontSize: '16px',
                                    fontWeight: '700',
                                    border: 'none',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    marginBottom: '8px',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#059669';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = '#10b981';
                                }}
                            >
                                학습하기
                            </button>
                        ) : (
                            <button
                                onClick={handleBuyNowClick}
                                style={{
                                    width: '100%',
                                    padding: '15px',
                                    background: '#3b82f6',
                                    color: '#fff',
                                    fontSize: '16px',
                                    fontWeight: '700',
                                    border: 'none',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    marginBottom: '8px',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#2563eb';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = '#3b82f6';
                                }}
                            >
                                구매하기
                            </button>
                        )}

                        <button
                            style={{
                                width: '100%',
                                padding: '14px',
                                background: '#fff',
                                color: '#3b82f6',
                                fontSize: '15px',
                                fontWeight: '600',
                                border: '1.5px solid #3b82f6',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#eff6ff';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#fff';
                            }}
                        >
                            <span>📺</span> 무료 강의 보기
                        </button>

                        <hr style={{margin: '24px 0', border: 'none', borderTop: '1px solid #e5e7eb'}} />

                        <div style={{display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: '#6b7280'}}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                                <span>Enrollment limit: 49/27</span>
                            </div>
                            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="23 7 16 12 23 17 23 7"></polygon>
                                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                                </svg>
                                <span>Video: 21</span>
                            </div>
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
                    productId="first-guide"
                />
            )}
        </div>
    );
};

export default ProductDetailPage;
