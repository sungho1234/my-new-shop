// /hooks/useScrollFadeIn.ts

"use client";

import { useRef, useEffect, useCallback } from 'react';

// 이 훅은Intersection Observer를 사용하여 요소가 화면에 나타났을 때 애니메이션을 적용합니다.
export const useScrollFadeIn = (direction = 'up', duration = 1, delay = 0) => {
  const dom = useRef<HTMLDivElement>(null);

  // 애니메이션 방향을 결정하는 함수
  const handleDirection = (name: string) => {
    switch (name) {
      case 'up':
        return 'translate3d(0, 50%, 0)';
      case 'down':
        return 'translate3d(0, -50%, 0)';
      case 'left':
        return 'translate3d(50%, 0, 0)';
      case 'right':
        return 'translate3d(-50%, 0, 0)';
      default:
        return;
    }
  };

  // 스크롤 이벤트가 발생했을 때 실행될 콜백 함수
  const handleScroll = useCallback(
    ([entry]: IntersectionObserverEntry[]) => {
      const { current } = dom;

      if (current && entry.isIntersecting) {
        current.style.transitionProperty = 'opacity, transform';
        current.style.transitionDuration = `${duration}s`;
        current.style.transitionTimingFunction = 'cubic-bezier(0, 0, 0.2, 1)';
        current.style.transitionDelay = `${delay}s`;
        current.style.opacity = '1';
        current.style.transform = 'translate3d(0, 0, 0)';
      }
    },
    [delay, duration]
  );

  useEffect(() => {
    let observer: IntersectionObserver;
    const { current } = dom;

    if (current) {
      observer = new IntersectionObserver(handleScroll, { threshold: 0.1 });
      observer.observe(current);

      return () => observer && observer.disconnect();
    }
  }, [handleScroll]);

  return {
    ref: dom,
    style: {
      opacity: 0,
      transform: handleDirection(direction),
    },
  };
};
