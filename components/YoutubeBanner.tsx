// components/YoutubeBanner.tsx

import React from 'react';

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
    videoId: 'BLNTvBMPG8k',
    title: '',
    youtubeLink: 'https://www.youtube.com/watch?v=BLNTvBMPG8k',
    channelName: '메신저가 되자',
    channelAvatar: 'https://yt3.ggpht.com/ytc/AIdro_kvhx-22299t_s3GT26i_MQy-f2d-2_Hvu2g1_g=s88-c-k-c0x00ffffff-no-rj',
  },
  {
    type: 'video',
    videoId: 'BLNTvBMPG8k',
    title: '',
    youtubeLink: 'https://www.youtube.com/watch?v=BLNTvBMPG8k',
    channelName: '메신저가 되자',
    channelAvatar: 'https://yt3.ggpht.com/ytc/AIdro_kvhx-22299t_s3GT26i_MQy-f2d-2_Hvu2g1_g=s88-c-k-c0x00ffffff-no-rj',
  },
  {
    type: 'image',
    thumbnail: 'https://via.placeholder.com/600x400/CCCCCC/000000?text=AI%EB%A1%9C+%EC%A1%B0%ED%9A%8C%EC%88%98+13%EB%B0%B0',
    title: '',
    author: 'Analyst(Berlin) | The Archive Vol.1 ',
    description: '분석 모델을 시스템으로 전환하기까지: Maria G.의 회고',
  },
  {
    type: 'image',
    thumbnail: 'https://via.placeholder.com/600x400/CCCCCC/000000?text=%EC%A1%B0%ED%9A%8C%EC%88%98+30%EB%B0%B0+%EC%A6%9D%EA%B0%80',
    title: '',
    author: 'Trader(London) | Quant System Lite',
    description: '런던의 변동성을 지배하는 방법: John S.의 트레이딩 로그',
  },
  {
    type: 'image',
    thumbnail: 'https://via.placeholder.com/600x400/CCCCCC/000000?text=19%EC%82%B4+%EB%8C%80%ED%95%99%EC%83%9D',
    title: '',
    author: 'Market Expert(Tokyo) | MAXX Quant System v4.0',
    description: '노이즈 속에서 알파(α)를 찾는 기술: 키노아 요코.의 전략 노트',
  },
];

const YoutubeBanner = () => {
  return (
    <section className="mt-16">
      {/* 1. 배경 영역 */}
      <div 
        className="w-full pt-20 pb-32 -mt-20"
        style={{
          backgroundImage: "url('/youtube-banner-bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white">맴버 리포트 및 실전 인사이트</h2>
              <p className="mt-2 text-gray-400">"이론을 넘어, 실제 증명된 멤버들의 기록과 전략 활용법을 심도 있게 다룹니다."</p>
            </div>
            <a href="#" className="rounded-md border border-gray-600 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800">
              전체보기
            </a>
          </div>
        </div>
      </div>

      {/* 2. 콘텐츠 영역 */}
      <div className="container mx-auto max-w-7xl px-4 -mt-24">
        {/* 첫 번째 줄 (영상 카드) - 유튜브 임베드 플레이어 */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 mb-36">
          {stories.slice(0, 3).map((story, index) => (
            <div key={index} className="relative block w-full overflow-hidden rounded-lg shadow-xl" style={{ paddingTop: '56.25%' }}>
              <iframe
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube.com/embed/${story.videoId}`}
                title={story.title || 'YouTube video'}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ))}
        </div>

        {/* --- 두 번째 줄 (이미지 카드) - 레퍼런스 디자인과 동일하게 수정된 부분 --- */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {stories.slice(3, 6).map((story, index) => (
                <div key={index}>
                    <a href="#" className="block group">
                        {/* 1. 이미지 영역 (카드 안의 텍스트 오버레이 제거) */}
                        <div className="overflow-hidden rounded-lg shadow-lg">
                            <img
                                src={story.thumbnail}
                                alt={story.title}
                                className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                        </div>
                        {/* 2. 텍스트 영역 (카드 아래의 텍스트는 그대로 유지) */}
                        <div className="p-4">
                            <p className="text-xs text-gray-500">
                                {story.author} 
                            </p>
                            <p className="mt-1 text-sm font-semibold text-gray-900">
                                {story.description}
                            </p>
                        </div>
                    </a>
                </div>
            ))}
        </div>

        {/* 버튼 */}
        <div className="mt-12 flex justify-center">
          <button className="rounded-md bg-indigo-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            시스템 및 실제 데이터 확인하기 →
          </button>
        </div>
      </div>
    </section>
  );
};

export default YoutubeBanner;