// components/YoutubeBanner.tsx

import React from 'react';
import Link from 'next/link';

// stories 데이터는 변경 없습니다.
const stories = [
  {
    type: 'video',
    videoId: 'BLNTvBMPG8k',
    title: '',
    youtubeLink: 'https://www.youtube.com/watch?v=BLNTvBMPG8k',
    channelName: '메신저가 되자',
    channelAvatar: 'https://yt3.ggpht.com/ytc/AIdro_kvhx-22299t_s3GT26i_MQy-f2d-2_Hvu2g1_g=s88-c-k-c0x00ffffff-no-rj',
  },
  {
    type: 'video',
    videoId: 'C4TlMBWhjNM',
    title: '',
    youtubeLink: 'https://www.youtube.com/watch?v=C4TlMBWhjNM&t=647s',
    channelName: '메신저가 되자',
    channelAvatar: 'https://yt3.ggpht.com/ytc/AIdro_kvhx-22299t_s3GT26i_MQy-f2d-2_Hvu2g1_g=s88-c-k-c0x00ffffff-no-rj',
  },
  {
    type: 'video',
    videoId: '2oTv94Pa12A',
    title: '',
    youtubeLink: 'https://www.youtube.com/watch?v=2oTv94Pa12A&t=1s',
    channelName: '메신저가 되자',
    channelAvatar: 'https://yt3.ggpht.com/ytc/AIdro_kvhx-22299t_s3GT26i_MQy-f2d-2_Hvu2g1_g=s88-c-k-c0x00ffffff-no-rj',
  },
  {
    type: 'image',
    thumbnail: '/블로그썸네일1.png',
    title: '',
    author: '시스템 트레이더',
    description: '분석을 넘어 시스템으로: 코빠의 SMC 구축기',
    href: 'https://blog.naver.com/credit777_31/224072068084',
  },
  {
    type: 'image',
    thumbnail: '/대학생 후기.png',
    title: '',
    author: '대학생 ㅣ 매일 20만원씩 벌어오는 시스템 트레이딩 가이드',
    description: '군적금 날려본 알바생의 이야기',
    href: '/success-story',
  },
  {
    type: 'image',
    thumbnail: 'https://via.placeholder.com/600x400/CCCCCC/000000?text=19%EC%82%B4+%EB%8C%80%ED%95%99%EC%83%9D',
    title: '',
    author: '컨텐츠 크리에이터 ㅣ 매일 20만원씩 벌어오는 시스템 트레이딩 가이드',
    description: '추측을 멈추고 설계하기: S. Walker의 회고록',
    href: 'https://medium.com/@invitetel02/i-bought-an-internal-manual-from-a-prop-trading-firm-and-here-is-what-happened-526e906442e3',
  },
];

const YoutubeBanner = () => {
  return (
    <section className="mt-12 mb-16">
      {/* 1. 배경 영역 */}
      <div className="relative w-full pt-16 pb-32 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* 배경 패턴 */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-900/50"></div>

        <div className="container mx-auto max-w-7xl px-4 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-4 border border-white/20">
              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
              </svg>
              <span className="text-sm font-medium text-white">실전 인사이트</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">맴버 리포트 및 실전 전략</h2>
            <p className="text-lg text-gray-300 leading-relaxed">이론을 넘어, 실제 증명된 멤버들의 기록과 전략 활용법을 심도 있게 다룹니다.</p>
          </div>
        </div>
      </div>

      {/* 2. 콘텐츠 영역 */}
      <div className="container mx-auto max-w-7xl px-4 -mt-20">
        {/* 첫 번째 줄 (영상 카드) - 유튜브 임베드 플레이어 */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mb-32">
          {stories.slice(0, 3).map((story, index) => (
            <div key={index} className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
              <div className="relative block w-full overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300" style={{ paddingTop: '56.25%' }}>
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={`https://www.youtube.com/embed/${story.videoId}`}
                  title={story.title || 'YouTube video'}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          ))}
        </div>

        {/* --- 두 번째 줄 (이미지 카드) --- */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
            {stories.slice(3, 6).map((story, index) => {
                const WrapperComponent = story.href ? Link : 'a';
                const linkProps = story.href ? { href: story.href } : { href: '#' };

                return (
                    <div key={index} className="group">
                        <WrapperComponent {...linkProps} className="block">
                            {/* 이미지 영역 */}
                            <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 mb-4">
                                <img
                                    src={story.thumbnail}
                                    alt={story.title}
                                    className="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                            {/* 텍스트 영역 - 이미지 아래 고정 */}
                            <div className="px-2">
                                <p className="text-xs font-medium text-gray-500 mb-2">
                                    {story.author}
                                </p>
                                <p className="text-lg font-semibold text-gray-900 leading-snug">
                                    {story.description}
                                </p>
                            </div>
                        </WrapperComponent>
                    </div>
                );
            })}
        </div>
      </div>
    </section>
  );
};

export default YoutubeBanner;