// components/YoutubeBanner.tsx

import React from 'react';

// stories 데이터는 변경 없습니다.
const stories = [
  {
    type: 'video',
    videoId: '77BOyzPOMcE',
    title: '5줄 글쓰기로 우울증 극복하는 법',
    youtubeLink: 'https://www.youtube.com/watch?v=77BOyzPOMcE',
    channelName: '메신저가 되자',
    channelAvatar: 'https://yt3.ggpht.com/ytc/AIdro_kvhx-22299t_s3GT26i_MQy-f2d-2_Hvu2g1_g=s88-c-k-c0x00ffffff-no-rj',
  },
  {
    type: 'video',
    videoId: 'sJ01gD2i63c',
    title: '초사고 글쓰기 후 딱 10배가 느는...',
    youtubeLink: 'https://www.youtube.com/watch?v=sJ01gD2i63c',
    channelName: '메신저가 되자',
    channelAvatar: 'https://yt3.ggpht.com/ytc/AIdro_kvhx-22299t_s3GT26i_MQy-f2d-2_Hvu2g1_g=s88-c-k-c0x00ffffff-no-rj',
  },
  {
    type: 'video',
    videoId: 'pXz4bX8bY-M',
    title: '48억이나 팔렸다는 초사고 글쓰...',
    youtubeLink: 'https://www.youtube.com/watch?v=pXz4bX8bY-M',
    channelName: '메신저가 되자',
    channelAvatar: 'https://yt3.ggpht.com/ytc/AIdro_kvhx-22299t_s3GT26i_MQy-f2d-2_Hvu2g1_g=s88-c-k-c0x00ffffff-no-rj',
  },
  {
    type: 'image',
    thumbnail: 'https://via.placeholder.com/600x400/CCCCCC/000000?text=AI+1',
    title: 'AI로 조회수 13배, 매출 15배 상승',
    author: '콘텐츠 크리에이터',
    description: '조회수 13배 증가, 매출 15배 상승했습니다',
  },
  {
    type: 'image',
    thumbnail: 'https://via.placeholder.com/600x400/CCCCCC/000000?text=AI+2',
    title: '조회수 30배 증가, 업무 70% 단축',
    author: '마케터',
    description: '조회수 30배 증가, 업무 70% 단축, 단순 사업...',
  },
  {
    type: 'image',
    thumbnail: 'https://via.placeholder.com/600x400/CCCCCC/000000?text=AI+3',
    title: '19살 대학생, AI로 과제 85% 단축',
    author: '대학생',
    description: '19살 대학생, AI로 레포트 작성 시간 85% 단축...',
  },
];

const YoutubeBanner = () => {
  return (
    <section className="mt-16">
      {/* 1. 파란 배경 섹션 */}
      <div className="w-full bg-slate-900 pt-20 pb-40 -mt-20 overflow-hidden">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white">수강생 성공사례</h2>
              <p className="mt-2 text-gray-400">"아이디어를 결과물"로 바꾼 수강생들이었습니다.</p>
            </div>
            <a href="#" className="rounded-md border border-gray-600 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800">
              전체보기
            </a>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {stories.slice(0, 3).map((story, index) => (
               <a key={index} href={story.youtubeLink} target="_blank" rel="noopener noreferrer" className="group relative block w-full overflow-hidden rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300" style={{ paddingTop: '56.25%' }}>
                  <img src={`https://img.youtube.com/vi/${story.videoId}/hqdefault.jpg`} alt={story.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-3 bg-gradient-to-b from-black/50 to-transparent">
                    <div className="flex min-w-0 items-center gap-2">
                      <img src={story.channelAvatar} alt={story.channelName} className="h-8 w-8 flex-shrink-0 rounded-full bg-gray-700" />
                      <p className="truncate text-base font-semibold text-white">{story.title}</p>
                    </div>
                    <div className="flex-shrink-0 text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 group-hover:scale-110">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/e/ee/YouTube_social_white_squircle_%282017%29.svg" alt="YouTube Play Button" className="h-16 w-16" />
                  </div>
                </a>
            ))}
          </div>
        </div>
      </div>

      {/* 2. 흰색 배경 섹션 (마이너스 마진으로 위로 당겨짐) */}
      <div className="container mx-auto max-w-7xl px-4 py-20 -mt-24">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {stories.slice(3, 6).map((story, index) => (
            <div key={index}>
              <a href="#" className="group relative block overflow-hidden rounded-lg shadow-lg bg-white">
                <img src={story.thumbnail} alt={story.title} className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <h3 className="absolute bottom-4 left-4 text-xl font-bold text-white">{story.title}</h3>
              </a>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <button className="rounded-md bg-indigo-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            콘텐츠 및 수강생 성공사례 보러가기 →
          </button>
        </div>
      </div>
    </section>
  );
};

export default YoutubeBanner;