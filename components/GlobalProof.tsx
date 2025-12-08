"use client";

import React, { useRef, useEffect, useState } from 'react';

// 가상 후기 데이터
const reviews = [
  {
    stars: 5,
    quote: "지금까지 감으로 했던 트레이딩을 과학적 및 기술적접근으로 단계를 높여주어서 감사합니다. 그리고 담당 트레이더님이랑 계속 연락을 주고받아서 더 쉽게 성장할수 있었어요.",
    author: "맨디(80270)",
    date: "24시간 전",
    product: "일반인을 위한 시스템 투자 올인원",
    flag: "🇰🇷",
  },
  {
    stars: 5,
    quote: "드디어 인사이트가 정리되었네요. 항상 투자를 배워보고싶었는데 기본적인 퀀트투자에 대한 지식을 가지게되어서 기뻣습니다. vol2도 궁금한데 현재는 담당 트레이더님은 vol숙달에 더 집중하고 넘어가라고 하셔서 실력을 기르고있네요.",
    author: "최승영",
    date: "24시간 전",
    product: "일반인을 위한 첫번째 안내서",
    flag: "🇰🇷",
  },
  {
    stars: 5,
    quote: "Finally, a systematic approach that removes emotion. It's been a game-changer for my trading in the European session.",
    author: "John S.",
    location: "London, UK",
    flag: "🇬🇧",
    date: "3일 전",
    product: "시스템 빌더 풀 패키지"
  },
  {
    stars: 5,
    quote: "As a beginner, the Lite version was perfect. The principles are clear, and my risk management has improved tenfold.",
    author: "Maria G.",
    location: "Berlin, DE",
    flag: "🇩🇪",
    date: "2주 전",
    product: "일반인의 성장책: 스캠필터와 챌린지"
  },
  {
    stars: 5,
    quote: "The data analysis tools are top-notch. I'm identifying trends I never saw before. Highly recommended for serious traders.",
    author: "Kenji T.",
    location: "Tokyo, JP",
    flag: "🇯🇵",
    date: "1주 전",
    product: "프로의 전략 원본"
  },
  {
    stars: 5,
    quote: "시스템 트레이딩의 기초부터 고급까지 체계적으로 배울 수 있었습니다. 특히 백테스팅 방법론이 정말 도움이 되었어요. 이제 자신감을 가지고 실전 투자를 하고 있습니다.",
    author: "김민수",
    date: "3일 전",
    product: "시스템 빌더 풀 패키지",
    flag: "🇰🇷",
  },
  {
    stars: 5,
    quote: "Trading psychology and risk management sections are excellent. This course helped me overcome my biggest weakness - emotional trading.",
    author: "David L.",
    location: "New York, USA",
    flag: "🇺🇸",
    date: "5일 전",
    product: "일반인의 성장책: 스캠필터와 챌린지"
  },
  {
    stars: 5,
    quote: "처음에는 반신반의했는데, 실제로 따라하니 수익률이 안정적으로 나오기 시작했어요. 담당 트레이더님의 피드백도 정말 세심하고 도움이 됩니다.",
    author: "박지훈",
    date: "1주 전",
    product: "프로의 전략 원본",
    flag: "🇰🇷",
  },
  {
    stars: 5,
    quote: "Les stratégies sont clairement expliquées et faciles à mettre en œuvre. J'ai enfin trouvé une approche systématique qui fonctionne.",
    author: "Sophie M.",
    location: "Paris, FR",
    flag: "🇫🇷",
    date: "4일 전",
    product: "시스템 빌더 풀 패키지"
  },
  {
    stars: 5,
    quote: "암호화폐 트레이딩 처음 시작하는데 너무 막막했는데, 이 강의 덕분에 기초를 탄탄히 다질 수 있었습니다. 리스크 관리의 중요성을 제대로 배웠어요.",
    author: "이서연",
    date: "2일 전",
    product: "일반인을 위한 첫번째 안내서",
    flag: "🇰🇷",
  },
  {
    stars: 5,
    quote: "Excellent course! The technical indicators and pattern recognition modules are incredibly detailed. Worth every penny.",
    author: "Alex K.",
    location: "Sydney, AU",
    flag: "🇦🇺",
    date: "6일 전",
    product: "프로의 전략 원본"
  },
  {
    stars: 5,
    quote: "여러 투자 강의를 들어봤지만, 이렇게 실전적이고 체계적인 강의는 처음입니다. 특히 포트폴리오 구성 방법이 정말 유용했어요.",
    author: "정현우",
    date: "1주 전",
    product: "일반인을 위한 시스템 투자 올인원",
    flag: "🇰🇷",
  },
  {
    stars: 5,
    quote: "The community support is amazing. Fellow traders are helpful and the instructor responds quickly to questions. Great learning environment!",
    author: "Lisa W.",
    location: "Singapore",
    flag: "🇸🇬",
    date: "3일 전",
    product: "일반인의 성장책: 스캠필터와 챌린지"
  },
];

// ▼▼▼ 1. 여기에 타입을 정의합니다 ▼▼▼
interface Review {
  stars: number;
  quote: string;
  author: string;
  date: string;
  product: string;
  flag?: string; // ?는 이 속성이 있어도 되고 없어도 된다는 의미입니다.
  location?: string;
}

// ReviewCard 컴포넌트가 받을 props의 타입을 정의합니다.
interface ReviewCardProps {
  review: Review;
}
// ▲▲▲ 여기까지 추가 ▲▲▲


// ▼▼▼ 2. 여기에 props 타입을 적용합니다 ▼▼▼
// 후기 카드 UI 컴포넌트
const ReviewCard = ({ review }: ReviewCardProps) => (
  <div className="flex-shrink-0 w-72 h-64">
    <div className="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col border border-gray-200">
      <div className="text-yellow-400 text-lg mb-3">{'★'.repeat(review.stars)}</div>
      <div className="mb-3">
        <p className="font-semibold text-sm text-gray-900">{review.author}</p>
        <p className="text-xs text-gray-500 mt-1">{review.date}</p>
      </div>
      <p className="text-gray-800 text-sm leading-relaxed line-clamp-4">
        {review.quote}
      </p>
    </div>
  </div>
);

export default function GlobalProof() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // ▼▼▼ 3. 여기에 파라미터 타입을 적용합니다 ▼▼▼
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 312;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  // ▲▲▲ 여기까지 수정 ▲▲▲

  useEffect(() => {
    if (!scrollContainerRef.current) return;

    intervalRef.current = setInterval(() => {
      const container = scrollContainerRef.current;
      if (container) {
        // 전체 콘텐츠의 절반(원본 리뷰 끝)에 도달하면 처음으로 즉시 리셋
        const halfWidth = container.scrollWidth / 2;
        if (container.scrollLeft >= halfWidth) {
          container.scrollTo({ left: 0, behavior: 'auto' });
        } else {
          // 부드러운 연속 스크롤
          container.scrollBy({ left: 1, behavior: 'auto' });
        }
      }
    }, 20);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <section className="bg-gray-50 py-8 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Global Team's Insights</h2>
            <p className="mt-2 text-gray-600">이것은 단순한 후기가 아닌, 데이터로 소통하는 글로벌 팀의 실제 기록입니다.</p>
          </div>
          <div className="hidden sm:flex items-center space-x-2">
            <button onClick={() => scroll('left')} aria-label="이전 후기 보기" className="p-2 rounded-md border bg-white hover:bg-gray-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button onClick={() => scroll('right')} aria-label="다음 후기 보기" className="p-2 rounded-md border bg-white hover:bg-gray-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>
      
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide -mb-4 px-6"
      >
        {/* 원본 리뷰 */}
        {reviews.map((review, index) => (
          <div key={index}>
              <ReviewCard review={review} />
          </div>
        ))}
        {/* 복제된 리뷰 (무한 스크롤용) */}
        {reviews.map((review, index) => (
          <div key={`clone-${index}`}>
              <ReviewCard review={review} />
          </div>
        ))}
      </div>
    </section>
  );
}