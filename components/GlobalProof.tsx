"use client";

import React, { useRef, useEffect, useState } from 'react';

// 가상 후기 데이터
const reviews = [
  {
    stars: 5,
    quote: "지금까지 감으로 했던 트레이딩을 과학적 및 기술적접근으로 단계를 높여주어서 감사합니다. 그리고 담당 트레이더님이랑 계속 연락을 주고받아서 더 쉽게 성장할수 있었어요.",
    author: "맨디(80270)",
    date: "24시간 전",
    product: "전략 아카이브1",
    flag: "🇰🇷", 
  },
  {
    stars: 5,
    quote: "드디어 인사이트가 정리되었네요. 항상 투자를 배워보고싶었는데 기본적인 퀀트투자에 대한 지식을 가지게되어서 기뻣습니다. vol2도 궁금한데 현재는 담당 트레이더님은 vol숙달에 더 집중하고 넘어가라고 하셔서 실력을 기르고있네요.",
    author: "최승영",
    date: "24시간 전",
    product: "The Archive Vol.1",
    flag: "🇰🇷",
  },
  {
    stars: 5,
    quote: "Finally, a systematic approach that removes emotion. It’s been a game-changer for my trading in the European session.",
    author: "John S.",
    location: "London, UK",
    flag: "🇬🇧",
    date: "3일 전",
    product: "The Archive Vol. 2"
  },
  {
    stars: 5,
    quote: "As a beginner, the Lite version was perfect. The principles are clear, and my risk management has improved tenfold.",
    author: "Maria G.",
    location: "Berlin, DE",
    flag: "🇩🇪",
    date: "2주 전",
    product: "Quant System Lite"
  },
  {
    stars: 5,
    quote: "The data analysis tools are top-notch. I'm identifying trends I never saw before. Highly recommended for serious traders.",
    author: "Kenji T.",
    location: "Tokyo, JP",
    flag: "🇯🇵",
    date: "1주 전",
    product: "MAXX Quant System v4.0"
  },
];

// 후기 카드 UI 컴포넌트
const ReviewCard = ({ review }) => (
  <div className="flex-shrink-0 w-80 sm:w-96 h-96">
    <div className="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col justify-between border border-gray-100">
      <div>
        <div className="text-yellow-400 text-lg mb-4">{'★'.repeat(review.stars)}</div>
        <p className="text-gray-800 leading-relaxed line-clamp-6">
          {review.quote}
        </p>
      </div>
      <div className="mt-6 flex items-center">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-600 mr-3">
          {review.flag ? review.flag : review.author.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-sm text-gray-900">{review.author}</p>
          <p className="text-xs text-gray-500">{review.date}</p>
        </div>
      </div>
      <div className="mt-6 -mx-6 -mb-6 p-4 bg-blue-600 rounded-b-xl">
        <p className="text-white text-sm font-semibold text-center truncate">
          {review.product}
        </p>
      </div>
    </div>
  </div>
);

export default function GlobalProof() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 344;
      scrollContainerRef.current.scrollBy({ 
        left: direction === 'left' ? -scrollAmount : scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };

  useEffect(() => {
    if (isPaused || !scrollContainerRef.current) return;

    intervalRef.current = setInterval(() => {
      const container = scrollContainerRef.current;
      if (container) {
        if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 1) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scroll('right');
        }
      }
    }, 2000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused]);

  return (
    <section className="bg-gray-50 py-20 w-full overflow-hidden">
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
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        // [핵심 수정] scrollbar-hide 클래스를 여기에 추가했습니다.
        className="flex overflow-x-auto space-x-6 pb-4 scroll-snap-x-mandatory scrollbar-hide -mb-4"
        style={{
          paddingLeft: 'max(1.5rem, calc((100% - 1280px) / 2))',
          paddingRight: '1.5rem'
        }}
      >
        {reviews.map((review, index) => (
          <div key={index} className="scroll-snap-center">
              <ReviewCard review={review} />
          </div>
        ))}
        {reviews.slice(0, 2).map((review, index) => (
          <div key={`clone-${index}`} className="scroll-snap-center">
              <ReviewCard review={review} />
          </div>
        ))}
      </div>
    </section>
  );
}