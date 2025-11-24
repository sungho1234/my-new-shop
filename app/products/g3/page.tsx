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

// FAQ 내용
const faqItems = [
    {
        question: 'Q: 이 책에도 1:1 멘토링이나 피드백이 포함되나요?',
        answer: 'A: 아니요, 포함되지 않습니다. 이 성장책은 스스로 \'기준\'을 세우고 \'훈련\'할 수 있도록 설계된 \'데이터 기반 자습서(Self-Training Workbook)\'입니다. 만약 이 과제집을 바탕으로 현역 트레이더의 1:1 피드백과 지도가 필요하시다면, "일반인을 위한 시스템 투자 올인원" 패키지를 권장합니다.'
    },
    {
        question: 'Q: 이 책을 보면 바로 수익을 낼 수 있나요?',
        answer: 'A: 아니요. 이 책은 \'수익\'이 아닌 \'성장\'을 약속합니다. 이 책은 당신이 \'감정적 손실\'을 멈추고(방어), \'데이터 기반 성장\'(훈련)을 시작하도록 돕습니다. 수익은 그 과정에서 자연스럽게 따라오는 결과이지, 이 책의 보장 사항이 아닙니다.'
    },
    {
        question: 'Q: 구매 후 자료는 어떻게 받나요?',
        answer: 'A: 구매 확정 즉시, \'스캠 필터링 체크리스트(PDF)\'와 \'과제집(PDF)\'을 즉시 다운로드할 수 있는 링크가 이메일로 발송됩니다.'
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
                                        <span style={{fontSize: '14px', color: '#FF6B35', fontWeight: '600'}}>📝 {reviews.length}</span>
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

                                {/* 후기 카드들 */}
                                <div style={{display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px'}}>
                                    {reviews.slice((currentPage - 1) * reviewsPerPage, currentPage * reviewsPerPage).map((review, idx) => (
                                        <div key={idx} style={{padding: '24px', border: '1px solid #e5e7eb', borderRadius: '12px', background: '#fff'}}>
                                            <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px'}}>
                                                <div>
                                                    <div style={{fontWeight: '700', fontSize: '15px', color: '#333', marginBottom: '4px'}}>{review.name}</div>
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
                                    ))}
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
                                        const totalPages = Math.ceil(reviews.length / reviewsPerPage);
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
                                        onClick={() => setCurrentPage(prev => Math.min(Math.ceil(reviews.length / reviewsPerPage), prev + 1))}
                                        disabled={currentPage === Math.ceil(reviews.length / reviewsPerPage)}
                                        style={{
                                            padding: '8px 12px',
                                            border: 'none',
                                            borderRadius: '6px',
                                            background: 'transparent',
                                            color: currentPage === Math.ceil(reviews.length / reviewsPerPage) ? '#d1d5db' : '#6b7280',
                                            cursor: currentPage === Math.ceil(reviews.length / reviewsPerPage) ? 'not-allowed' : 'pointer',
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