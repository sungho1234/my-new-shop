// 파일 경로: /hooks/useScrollFadeIn.ts

"use client";

import { useRef, useEffect, useCallback, RefObject } from 'react';

type Direction = 'up' | 'down' | 'left' | 'right';

/**
 * 스크롤 시 요소에 페이드-인 애니메이션을 적용하는 Custom Hook
 * @param direction - 애니메이션 방향 ('up', 'down', 'left', 'right')
 * @param duration - 애니메이션 지속 시간 (초)
 * @param delay - 애니메이션 지연 시간 (초)
 * @returns - JSX에 적용할 ref와 style 객체
 */
export const useScrollFadeIn = (
  direction: Direction = 'up',
  duration: number = 1,
  delay: number = 0
): { ref: RefObject<HTMLDivElement> } => {
  const dom = useRef<HTMLDivElement>(null);

  const handleDirection = (name: Direction): string => {
    switch (name) {
      case 'up':
        return 'translate3d(0, 50px, 0)';
      case 'down':
        return 'translate3d(0, -50px, 0)';
      case 'left':
        return 'translate3d(50px, 0, 0)';
      case 'right':
        return 'translate3d(-50px, 0, 0)';
      default:
        return '';
    }
  };

  const handleScroll = useCallback(
    ([entry]: IntersectionObserverEntry[]) => {
      const { current } = dom;

      if (current && entry.isIntersecting) {
        current.style.transitionProperty = 'all';
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
      // 초기 상태 설정
      current.style.opacity = '0';
      current.style.transform = handleDirection(direction);
      
      observer = new IntersectionObserver(handleScroll, { threshold: 0.1 });
      observer.observe(current);

      return () => observer && observer.disconnect();
    }
  }, [handleScroll, direction]);

  return {
    ref: dom,
  };
};
