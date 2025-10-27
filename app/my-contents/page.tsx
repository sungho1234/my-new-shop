'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { XMarkIcon } from '@heroicons/react/24/solid'; 
import InquiryModal from '@/components/my-contents/InquiryModal'; 

// MyPurchasesContent, MyProfileContent 컴포넌트는 기존 코드 그대로 유지합니다.
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
// [복원] MyProfileContent의 mt-8 제거 (원래 없었음)
const MyProfileContent = () => <div className="text-center py-20 border rounded-lg bg-gray-50">내 정보 콘텐츠 영역</div>;

// MyWishlistContent 컴포넌트 (사용자가 제공한 이전 버전과 동일하게 복원)
const MyWishlistContent = () => {
    const { wishlist, removeFromWishlist } = useAuth();

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

    // [복원] space-y-6 -> space-y-4, h-[213px] -> h-auto, 버튼 flex-shrink-0 제거
    return (
        <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
                <span className="font-semibold">총 {wishlist.length}개</span>
            </div>
            <div className="space-y-4"> 
                {wishlist.map((item) => (
                    <div key={item.id} className="border rounded-lg p-6 flex items-start gap-8 shadow-sm bg-white">
                        <img 
                            src={item.thumbnail || "https://via.placeholder.com/160/F3F4F6/9CA3AF?text=No+Image"} // 기본 이미지 추가
                            alt={item.title} 
                            className="w-40 h-auto object-cover rounded-md flex-shrink-0 bg-gray-100" 
                        />
                        <div className="flex-grow">
                            <h3 className="text-xl font-bold text-gray-800">{item.title}</h3>
                            <p className="text-base text-gray-600 mt-2">{item.author}</p>
                            <p className="text-2xl font-bold mt-4">{item.price}원</p>
                        </div>
                        <button onClick={() => removeFromWishlist(item.id)} className="text-gray-400 hover:text-red-500"> 
                           <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

// MyInquiriesContent 컴포넌트
const faqItems = [
    { question: 'Q. 1:1 멘토링은 언제, 어떻게 시작되나요?', answer: 'A. "올인원 패키지" 구매 확정일로부터 24시간 이내에 담당 팀원이 회원님의 연락처(또는 이메일)로 프라이빗 채널 초대를 드립니다.' },
    { question: 'Q. 구매한 콘텐츠(PDF, 영상)는 어디서 볼 수 있나요?', answer: 'A. 본 페이지의 "My콘텐츠" 탭을 클릭하시면 구매하신 모든 콘텐츠 목록과 링크를 확인하실 수 있습니다.' },
    { question: 'Q. 트레이딩뷰 지표 접근 권한은 어떻게 받나요?', answer: 'A. "시스템 빌더 패키지" 구매 시 입력하신 트레이딩뷰 ID로 24시간 이내에 접근 권한이 부여되며, 완료 시 알림을 드립니다.' },
];

const MyInquiriesContent = ({ onOpenModal }: { onOpenModal: () => void }) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggleAccordion = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    // [수정] max-w-4xl mx-auto 제거 (요청하신 좌측 정렬)
    return (
        <div className="mt-8 space-y-16"> 
            {/* 1. 새 문의 등록 섹션 */}
            <section>
                <h3 className="text-2xl font-bold text-gray-900 border-b pb-4 mb-6">1:1 문의</h3>
                <p className="text-base text-gray-600 leading-relaxed mb-6">
                    서비스 이용 중 불편한 점이나 궁금한 점이 있으신가요?<br />
                    아래 버튼을 눌러 문의를 남겨주시면 담당자가 신속하게 확인 후 답변드립니다.
                </p>
                <button
                    className="bg-blue-800 text-white px-6 py-2.5 rounded-md font-semibold hover:bg-blue-900"
                    onClick={onOpenModal} 
                >
                    + 새 문의 등록하기
                </button>
            </section>

            {/* 2. 이메일 문의 섹션 */}
            <section>
                <h3 className="text-2xl font-bold text-gray-900 border-b pb-4 mb-6">이메일 문의</h3>
                <p className="text-base text-gray-600 leading-relaxed mb-6">
                    파일 첨부가 필요하거나, 비회원 상태에서의 문의는 아래 이메일로 연락주세요.
                </p>
                <div className="text-lg font-semibold text-blue-700 bg-gray-50 p-4 rounded-lg inline-block">
                    support@maxxsystems.com
                </div>
            </section>

            {/* 3. FAQ 섹션 */}
            <section>
                <h3 className="text-2xl font-bold text-gray-900 border-b pb-4 mb-6">자주 묻는 질문 (FAQ)</h3>
                <div className="space-y-2">
                    {faqItems.map((item, index) => (
                        <div key={index} className="border-b">
                            <button
                                className="w-full flex justify-between items-center py-5 px-2 text-left"
                                onClick={() => toggleAccordion(index)}
                            >
                                <span className="text-lg font-medium text-gray-800">{item.question}</span>
                                <span className="text-2xl text-gray-400">
                                    {activeIndex === index ? '-' : '+'}
                                </span>
                            </button>
                            <div
                                className={`overflow-hidden transition-max-height duration-300 ease-in-out ${
                                    activeIndex === index ? 'max-h-60' : 'max-h-0'
                                }`}
                            >
                                <p className="p-4 pt-0 text-base text-gray-600 bg-gray-50 rounded-b-lg">
                                    {item.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};


// MyContentsPage 컴포넌트
const MyContentsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('my-contents');
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!user) {
    return <div className="text-center py-40">로그인이 필요합니다.</div>;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'my-contents': return <MyPurchasesContent />;
      case 'wishlist': return <MyWishlistContent />;
      case 'my-info': return <MyProfileContent />;
      case 'inquiry': return <MyInquiriesContent onOpenModal={() => setIsModalOpen(true)} />;
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
          {/* [복원] mt-8 -> mt-4 로 변경 (원래 상태) */}
          <main className="mt-4"> 
            {renderContent()}
          </main>
        </div>
      </div>
      
      {isModalOpen && <InquiryModal onClose={() => setIsModalOpen(false)} />}
      
      <Footer />
    </>
  );
};

export default MyContentsPage;