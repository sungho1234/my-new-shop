// components/HeroSection.tsx

"use client"; // 이 컴포넌트는 클라이언트 측 인터랙션(useState, useEffect)을 사용합니다.

import React, { useState, useEffect } from 'react';

// 슬라이드에 표시될 데이터를 배열로 관리합니다.
const heroData = [
  {
    headline: "우리는 예측하지 않고, 설계합니다.",
    subheadline: "시장의 언어를 해석하는 기술, 당신의 트레이딩을 진화시키다."
  },
  {
    headline: "우리는 강사가 아닙니다.",
    subheadline: "매일 뉴욕 세션에서 데이터로 증명하는, 현역 퀀트 트레이더 집단입니다."
  },
  {
    headline: "이것은 대중을 위해 만든 교육 자료가 아닙니다.",
    subheadline: "우리 팀이 실제 트레이딩을 위해 만든 내부 데이터 리포트, 전략 노트의 일부입니다."
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

  return (
    // 기존 히어로 섹션의 크기와 배경색을 그대로 유지합니다.
    <section className="w-full bg-slate-100">
      <div className="container mx-auto flex h-[450px] items-center px-4">
        {/* 슬라이드가 보이는 창(Viewport). 이 영역을 벗어나는 내용은 숨겨집니다. */}
        <div className="w-full overflow-hidden">
          {/* 실제로 움직이는 슬라이드 전체를 감싸는 트랙 */}
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {/* heroData 배열을 순회하며 각 슬라이드를 렌더링합니다. */}
            {heroData.map((data, index) => (
              <div key={index} className="w-full flex-shrink-0">
                {/* 기존 텍스트 스타일과 구조를 그대로 사용합니다. */}
                <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
                  {data.headline}
                </h2>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  {data.subheadline}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;