"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

// 커리큘럼 데이터 타입
interface Lecture {
  id: string;
  title: string;
  duration: string;
  videoUrl?: string;
  type: 'free' | 'paid';
}

interface Section {
  id: string;
  title: string;
  lectures: Lecture[];
}

// 상품별 커리큘럼 데이터
const CURRICULUM_DATA: Record<string, Section[]> = {
  'first-guide': [
    {
      id: 'section-1',
      title: '노동 소득에서 시스템 소득으로',
      lectures: [
        { id: 'lec-1-1', title: 'OT - 당신이 잠든 사이에도 코드는 돈을 벌고있습니다.', duration: '00:00:53', type: 'free', videoUrl: 'https://www.youtube.com/embed/VIDEO_ID_1' },
        { id: 'lec-1-2', title: '돈버는 시간대 (지표 제공)', duration: '00:15:28', type: 'free' },
      ]
    },
    {
      id: 'section-2',
      title: '기초 용어를 넘어 시장의 \'미시구조(Microstructure)\'를 이해하는 단계',
      lectures: [
        { id: 'lec-2-1', title: 'API 통신과 캔들(OHLCV) 데이터의 구조', duration: '00:15:32', type: 'paid' },
        { id: 'lec-2-2', title: '과적합(Overfitting)의 함정과 성과 검증', duration: '00:22:18', type: 'paid' },
        { id: 'lec-2-3', title: '슬리피지와 수수료, \'히든 코스트\' 통제하기', duration: '00:18:45', type: 'paid' },
        { id: 'lec-2-4', title: '파산을 막는 \'포지션 사이징\'과 레버리지', duration: '00:24:11', type: 'paid' },
      ]
    },
    {
      id: 'section-3',
      title: '프로가 사용하는 4가지 핵심 지표',
      lectures: [
        { id: 'lec-3-1', title: 'EMA를 활용한 추세 추종 메커니즘', duration: '00:19:27', type: 'paid' },
        { id: 'lec-3-2', title: 'ATR을 활용한 동적(Dynamic) 리스크 관리', duration: '00:21:33', type: 'paid' },
        { id: 'lec-3-3', title: 'CCI로 포착하는 과매수·과매도 반전 구간', duration: '00:17:56', type: 'paid' },
        { id: 'lec-3-4', title: 'VWAP과 표준편차 밴드의 통계적 활용', duration: '00:23:42', type: 'paid' },
      ]
    },
    {
      id: 'section-4',
      title: '단순한 매매법이 아닌, 논리적인 \'프레임워크\'를 갖추는 단계',
      lectures: [
        { id: 'lec-4-1', title: '직관을 이기는 \'확률적 사고\'와 기대값', duration: '00:26:14', type: 'paid' },
        { id: 'lec-4-2', title: '4가지 지표를 통합한 \'하이브리드 전략\' 설계', duration: '00:31:28', type: 'paid' },
        { id: 'lec-4-3', title: '인간의 한계를 넘는 시스템만의 영역', duration: '00:20:55', type: 'paid' },
      ]
    },
    {
      id: 'section-5',
      title: '실제 개발 환경을 구축하고 시스템을 \'배포(Deploy)\'하는 단계',
      lectures: [
        { id: 'lec-5-1', title: '파이썬 & VS Code 개발 환경 구축하기', duration: '00:28:36', type: 'paid' },
        { id: 'lec-5-2', title: 'AI가 이해하는 \'전략 명세서\' 작성법', duration: '00:25:19', type: 'paid' },
        { id: 'lec-5-3', title: '"코드 써줘" 한 마디로 완성하는 봇 개발 실습', duration: '00:35:47', type: 'paid' },
        { id: 'lec-5-4', title: '24시간 무중단 서버 운영과 알림 시스템', duration: '00:29:22', type: 'paid' },
      ]
    },
  ],
  // 다른 상품의 커리큘럼도 추가 가능
};

const WatchPage = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { user, isPurchased } = useAuth();

  const productId = params.productId as string;
  const lectureId = searchParams.get('lecture') || '';

  const [currentLectureId, setCurrentLectureId] = useState(lectureId);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const curriculum = CURRICULUM_DATA[productId] || [];
  const hasPurchased = isPurchased(productId);

  // 현재 강의 찾기
  const currentLecture = curriculum
    .flatMap(section => section.lectures)
    .find(lec => lec.id === currentLectureId);

  // 다음 강의 찾기
  const getNextLecture = () => {
    const allLectures = curriculum.flatMap(section => section.lectures);
    const currentIndex = allLectures.findIndex(lec => lec.id === currentLectureId);
    if (currentIndex < allLectures.length - 1) {
      return allLectures[currentIndex + 1];
    }
    return null;
  };

  const nextLecture = getNextLecture();

  // 강의 선택 시 URL 업데이트
  const handleLectureClick = (lecture: Lecture) => {
    if (lecture.type === 'paid' && !hasPurchased) {
      alert('이 강의는 구매 후 시청할 수 있습니다.');
      return;
    }
    setCurrentLectureId(lecture.id);
    router.push(`/learn/${productId}/watch?lecture=${lecture.id}`);
  };

  // 다음 강의로 이동
  const goToNextLecture = () => {
    if (nextLecture) {
      handleLectureClick(nextLecture);
    }
  };

  // 초기 로딩 완료 체크
  useEffect(() => {
    // 초기 로딩 시간을 주어 AuthContext가 user를 복원할 시간을 줌
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // 로그인 체크 (초기 로딩 완료 후에만)
  useEffect(() => {
    if (!isInitialLoad && !user) {
      alert('로그인이 필요합니다.');
      router.push('/login');
    }
  }, [isInitialLoad, user, router]);

  // 초기 로딩 중이거나 로그인하지 않은 경우 로딩 화면 표시
  if (isInitialLoad || !user) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#000',
        color: '#fff',
        fontSize: '16px'
      }}>
        {isInitialLoad ? '로딩 중...' : null}
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: '#000',
      overflow: 'hidden'
    }}>
      {/* 상단 헤더 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px 20px',
        background: '#1a1a1a',
        borderBottom: '1px solid #2a2a2a'
      }}>
        <button
          onClick={() => router.back()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: '#3b82f6',
            color: '#fff',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            border: 'none',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#2563eb'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#3b82f6'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to class
        </button>

        <div style={{
          marginLeft: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          {user && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#e5e7eb'
            }}>
              <img
                src={user.profileImage || '/default-avatar.png'}
                alt={user.nickname}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
              <span style={{ fontSize: '14px' }}>{user.nickname}</span>
            </div>
          )}
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div style={{
        display: 'flex',
        flex: 1,
        overflow: 'hidden'
      }}>
        {/* 비디오 플레이어 영역 */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          background: '#1a1a1a',
          overflow: 'hidden'
        }}>
          {/* 비디오 플레이어 */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: '0',
            paddingBottom: '49%', // 비율을 적당하게 조정
            background: '#000',
            flexShrink: 0
          }}>
            {currentLecture ? (
              currentLecture.videoUrl ? (
                <iframe
                  src={currentLecture.videoUrl}
                  title={currentLecture.title}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none'
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#9ca3af',
                  fontSize: '16px'
                }}>
                  비디오를 준비 중입니다.
                </div>
              )
            ) : (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#9ca3af',
                fontSize: '16px'
              }}>
                강의를 선택해주세요.
              </div>
            )}
          </div>

          {/* 강의 정보 및 네비게이션 */}
          <div style={{
            background: '#1a1a1a',
            padding: '10px 16px',
            borderTop: '1px solid #2a2a2a',
            flexShrink: 0
          }}>
            {currentLecture && (
              <>
                <h1 style={{
                  fontSize: '15px',
                  fontWeight: '700',
                  color: '#fff',
                  marginBottom: '3px'
                }}>
                  {currentLecture.title}
                </h1>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#9ca3af',
                  fontSize: '11px',
                  marginBottom: '8px'
                }}>
                  <span>🎬 VOD</span>
                  <span>•</span>
                  <span>⏱️ {currentLecture.duration}</span>
                </div>

                {/* 다음 강의 버튼 */}
                {nextLecture && (
                  <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <button
                      onClick={goToNextLecture}
                      style={{
                        padding: '6px 14px',
                        background: '#3b82f6',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                        whiteSpace: 'nowrap'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#2563eb'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#3b82f6'}
                    >
                      다음 강의 →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* 커리큘럼 사이드바 */}
        <div style={{
          width: '400px',
          background: '#111',
          borderLeft: '1px solid #2a2a2a',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* 헤더 */}
          <div style={{
            padding: '16px',
            borderBottom: '1px solid #2a2a2a',
            background: '#1a1a1a'
          }}>
            <h3 style={{
              color: '#fff',
              fontSize: '16px',
              fontWeight: '600',
              margin: 0
            }}>
              Curriculum
            </h3>
          </div>

          {/* 커리큘럼 목록 */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 0'
          }}>
            {curriculum.map((section) => (
              <div key={section.id} style={{ marginBottom: '8px' }}>
                {/* 섹션 헤더 */}
                <div style={{
                  padding: '12px 16px',
                  background: '#1a1a1a',
                  color: '#9ca3af',
                  fontSize: '13px',
                  fontWeight: '500'
                }}>
                  <span>{section.title}</span>
                </div>

                {/* 강의 목록 */}
                <div>
                  {section.lectures.map((lecture) => {
                    const isActive = lecture.id === currentLectureId;
                    const isLocked = lecture.type === 'paid' && !hasPurchased;

                    return (
                      <div
                        key={lecture.id}
                        onClick={() => handleLectureClick(lecture)}
                        style={{
                          padding: '12px 16px',
                          background: isActive ? '#3b82f6' : 'transparent',
                          color: isActive ? '#fff' : '#e5e7eb',
                          cursor: isLocked ? 'not-allowed' : 'pointer',
                          borderLeft: isActive ? '3px solid #fff' : 'none',
                          paddingLeft: isActive ? '13px' : '16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          opacity: isLocked ? 0.5 : 1,
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          if (!isLocked && !isActive) {
                            e.currentTarget.style.background = '#1a1a1a';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isLocked && !isActive) {
                            e.currentTarget.style.background = 'transparent';
                          }
                        }}
                      >
                        {/* 아이콘 */}
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px',
                          background: isActive ? '#fff' : '#3b82f6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          {isLocked ? (
                            <span style={{ color: '#fff', fontSize: '14px' }}>🔒</span>
                          ) : (
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill={isActive ? '#3b82f6' : '#fff'}
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          )}
                        </div>

                        {/* 강의 정보 */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontSize: '13px',
                            fontWeight: '500',
                            marginBottom: '4px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {lecture.title}
                          </div>
                          <div style={{
                            fontSize: '11px',
                            color: isActive ? '#e0e7ff' : '#9ca3af',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <span>🎬 VOD</span>
                            <span>•</span>
                            <span>⏱️ {lecture.duration}</span>
                          </div>
                        </div>

                        {/* 무료 공개 뱃지 */}
                        {lecture.type === 'free' && (
                          <div style={{
                            padding: '2px 8px',
                            background: '#10b981',
                            color: '#fff',
                            borderRadius: '4px',
                            fontSize: '10px',
                            fontWeight: '600'
                          }}>
                            무료공개
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchPage;
