'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
// [수정] heroicons v2에 맞는 XMarkIcon을 가져옵니다.
import { XMarkIcon } from '@heroicons/react/24/solid'; 

// MyPurchasesContent, MyProfileContent, MyInquiriesContent 컴포넌트는 기존 코드 그대로 유지합니다.
const MyPurchasesContent = () => (
    <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
            <span className="font-semibold">총 0개</span>
        </div>
        <div className="text-center py-24 border rounded-lg bg-gray-50">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <p className="mt-4 text-gray-500">아직 구매한 콘텐츠가 없습니다.</p>
            <button className="mt-6 bg-blue-800 text-white px-6 py-2.5 rounded-md font-semibold hover:bg-blue-900">
                콘텐츠 둘러보기
            </button>
        </div>
    </div>
);
const MyProfileContent = () => <div className="text-center py-20 border rounded-lg bg-gray-50">내 정보 콘텐츠 영역</div>;
const MyInquiriesContent = () => <div className="text-center py-20 border rounded-lg bg-gray-50">문의하기 콘텐츠 영역</div>;

// MyWishlistContent 컴포넌트
const MyWishlistContent = () => {
    // 전역 상태에서 찜 목록 데이터와 제거 함수를 가져옵니다.
    const { wishlist, removeFromWishlist } = useAuth();

    // 찜 목록이 비어있을 경우
    if (wishlist.length === 0) {
        return (
            <div className="mt-8 text-center py-24 border rounded-lg bg-gray-50">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <p className="mt-4 text-gray-500">찜한 상품이 없습니다.</p>
            </div>
        );
    }

    // 찜 목록이 있을 경우, 목록을 렌더링합니다.
    return (
        <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
                <span className="font-semibold">총 {wishlist.length}개</span>
            </div>
            <div className="space-y-4">
                {wishlist.map((item) => (
                    <div key={item.id} className="border rounded-lg p-6 flex items-start gap-8 shadow-sm bg-white">
                        <img src={item.thumbnail} alt={item.title} className="w-40 h-auto object-cover rounded-md flex-shrink-0" />
                        <div className="flex-grow">
                            <h3 className="text-xl font-bold text-gray-800">{item.title}</h3>
                            <p className="text-base text-gray-600 mt-2">{item.author}</p>
                            <p className="text-2xl font-bold mt-4">{item.price}원</p>
                        </div>
                        <button onClick={() => removeFromWishlist(item.id)} className="text-gray-400 hover:text-red-500">
                           {/* [수정] XIcon -> XMarkIcon 으로 변경 */}
                           <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

// MyContentsPage 컴포넌트의 나머지 부분은 기존 코드 그대로 유지합니다.
const MyContentsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('my-contents');

  if (!user) {
    return <div className="text-center py-40">로그인이 필요합니다.</div>;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'my-contents': return <MyPurchasesContent />;
      case 'wishlist': return <MyWishlistContent />;
      case 'my-info': return <MyProfileContent />;
      case 'inquiry': return <MyInquiriesContent />;
      default: return <MyPurchasesContent />;
    }
  };

  const tabs = [
    { id: 'my-contents', label: 'My콘텐츠' },
    { id: 'wishlist', label: '찜목록' },
    { id: 'my-info', label: '내 정보' },
    { id: 'inquiry', label: '문의하기' },
  ];

  return (
    <>
      <Header />
      <div className="w-full bg-white pb-20">
        <section style={{ backgroundColor: '#102450' }} className="text-white text-center py-10">
          <h1 className="text-2xl font-semibold">{user.nickname}님의 콘텐츠</h1>
        </section>
        <div className="container mx-auto px-4 max-w-7xl">
          <section className="mt-12">
            <nav className="flex border-b space-x-12">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-4 font-bold text-xl transition-colors duration-200 ${activeTab === tab.id ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-gray-700 border-b-2 border-transparent'}`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </section>
          <main className="mt-4">
            {renderContent()}
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyContentsPage;
