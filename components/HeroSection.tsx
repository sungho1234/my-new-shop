// components/HeroSection.tsx

"use client"; // 이 컴포넌트는 클라이언트 측 인터랙션(useState, useEffect)을 사용합니다.

import React, { useState, useEffect } from 'react';

// 슬라이드에 표시될 데이터를 배열로 관리합니다.
const heroData = [
  {
    headline: "우리는 예측하지 않고, 설계합니다.",
    subheadline: "시장의 언어를 해석하는 기술, 당신의 트레이딩을 진화시키다.",
    backgroundType: 'gradient', // 기본 그라데이션 배경
  },
  {
    headline: "우리는 강사가 아닙니다.",
    subheadline: "매일 뉴욕 세션에서 데이터로 증명하는, 현역 퀀트 트레이더 집단입니다.",
    backgroundType: 'image', // 이미지 배경
    backgroundImage: '/메인히어로.jpg',
  },
  {
    headline: "이것은 대중을 위해 만든 교육 자료가 아닙니다.",
    subheadline: "우리 팀이 실제 트레이딩을 위해 만든 내부 데이터 리포트, 전략 노트의 일부입니다.",
    backgroundType: 'image', // 이미지 배경
    backgroundImage: '/메인히어로2.jpg',
  }
];

const HeroSection = () => {
  // 현재 보여줄 슬라이드의 인덱스를 관리하는 상태
  const [currentIndex, setCurrentIndex] = useState(0);

  // 6초마다 슬라이드를 자동으로 변경하는 로직
  useEffect(() => {
    const interval = setInterval(() => {
      // 다음 인덱스로 업데이트하되, 마지막 슬라이드면 처음으로 돌아갑니다.
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroData.length);
    }, 6000); // 6초

    // 컴포넌트가 사라질 때 인터벌을 정리하여 메모리 누수를 방지합니다.
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const currentSlide = heroData[currentIndex];
  const isImageBackground = currentSlide.backgroundType === 'image';

  return (
    <section className="w-full relative overflow-hidden h-[450px]">
      {/* 배경 레이어들 */}
      {heroData.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {slide.backgroundType === 'image' ? (
            // 이미지 배경 (슬라이드 2: "우리는 강사가 아닙니다")
            <>
              <img
                src={slide.backgroundImage}
                alt="배경"
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* 이미지 위에 어두운 오버레이 */}
              <div className="absolute inset-0 bg-black/40"></div>
            </>
          ) : (
            // 그라데이션 배경 + 상품 이미지
            <>
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(135deg, #2d2d2d 0%, #3d3d3d 50%, #4a4a4a 100%)' }}
              ></div>
              {/* 오른쪽 상품 이미지 - 배경에 블렌딩 */}
              <div className="absolute right-0 top-0 h-full w-[55%] overflow-hidden">
                {/* 첫번째 상품 이미지 */}
                <div className="absolute right-[15%] top-[10%] w-[320px] h-[200px]">
                  <img
                    src="/시스템썸넬후보1.png"
                    alt="시스템 트레이딩 가이드"
                    className="w-full h-full object-cover rounded-lg opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#3d3d3d] via-transparent to-transparent"></div>
                </div>
                {/* 두번째 상품 이미지 */}
                <div className="absolute right-[5%] bottom-[15%] w-[280px] h-[180px]">
                  <img
                    src="/완판상품이미지.png"
                    alt="파이썬 고성능 매매 로직"
                    className="w-full h-full object-cover rounded-lg opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#3d3d3d] via-transparent to-transparent"></div>
                </div>
                {/* 전체 왼쪽 그라데이션 오버레이 */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#2d2d2d] via-[#2d2d2d]/70 to-transparent"></div>
              </div>
            </>
          )}
        </div>
      ))}

      {/* 콘텐츠 영역 */}
      <div className="container mx-auto flex h-full items-center px-4 relative z-10">
        <div className="w-full overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {heroData.map((data, index) => (
              <div key={index} className="w-full flex-shrink-0 flex items-center gap-12">
                {/* 왼쪽: 텍스트 영역 */}
                <div className="flex-1 max-w-2xl">
                  <h2 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">
                    {data.headline}
                  </h2>
                  <p className="mt-6 text-lg leading-8 text-gray-300">
                    {data.subheadline}
                  </p>
                </div>
                {/* 오른쪽 공간 */}
                <div className="flex-1"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 하단 네비게이션 도트 */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {heroData.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? 'w-6 h-2 bg-white'
                : 'w-2 h-2 bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`슬라이드 ${index + 1}로 이동`}
          />
        ))}
      </div>

      {/* 좌우 화살표 */}
      <button
        onClick={() => setCurrentIndex((prev) => (prev === 0 ? heroData.length - 1 : prev - 1))}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-all z-20"
        aria-label="이전 슬라이드"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => setCurrentIndex((prev) => (prev + 1) % heroData.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-all z-20"
        aria-label="다음 슬라이드"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </section>
  );
};

export default HeroSection;
