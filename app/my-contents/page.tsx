'use client';

import React, { useState, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { XMarkIcon } from '@heroicons/react/24/solid';
import InquiryModal from '@/components/my-contents/InquiryModal';
import { useRouter } from 'next/navigation';

// [수정 1] 기존의 불완전한 ALL_PRODUCTS 배열을 삭제하고,
// data/products.ts에 있는 전체 상품 목록을 import 합니다.
import { ALL_PRODUCTS } from '@/data/products';

// [수정 2] 이 페이지에 있던 mergeWishlistWithProducts 함수는 그대로 사용합니다.
// 이제 이 함수는 위에서 import한 전체 상품 목록을 참조하게 됩니다.
const mergeWishlistWithProducts = (wishlist: any[]) => {
  console.log("🔍 병합 시작: DB IDs =", wishlist.map(item => item.productId));
  const merged = wishlist.map(item => {
    // 이제 여기서 사용하는 ALL_PRODUCTS는 모든 상품 정보가 담긴 배열입니다.
    const product = ALL_PRODUCTS.find(p => p.id === item.productId);
    if (product) {
      console.log("✅ 매치 성공: '", item.productId, "' → '", product.title, "'");
      // DB에서 가져온 찜 정보와, 상품 상세 정보를 합칩니다.
      return { ...item, ...product };
    }
    console.warn("⚠️ 매치 실패: ", item.productId, " – data/products.ts 파일을 확인하세요.");
    // 매칭 실패 시 기본값을 반환합니다.
    return { ...item, title: 'Unknown Product', author: 'Unknown', price: '0', thumbnail: '/placeholder.png' };
  }).filter(Boolean);
  
  console.log("✅ 병합 완료: 최종 ", merged.length, "개");
  return merged;
};

// MyWishlistContent 컴포넌트 (데이터 표시 로직)
const MyWishlistContent = () => {
  const { wishlist, removeFromWishlist } = useAuth();
  
  const mergedProducts = useMemo(() => mergeWishlistWithProducts(wishlist), [wishlist]);

  if (mergedProducts.length === 0) {
    return (
      <div className="mt-8 text-center py-24 border rounded-lg bg-gray-50">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <p className="mt-4 text-gray-500">찜한 상품이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <span className="font-semibold">{mergedProducts.length}개</span>
      </div>
      <div className="space-y-4">
        {mergedProducts.map((item) => (
          <div key={item.productId} className="border rounded-lg p-6 flex items-start gap-8 shadow-sm bg-white">
            <div className="w-40 h-auto flex-shrink-0 bg-gray-100 flex items-center justify-center">
              <img
                src={item.thumbnail || '/placeholder.png'}
                alt={item.title}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            <div className="flex-grow">
              <h3 className="text-xl font-bold text-gray-800">{item.title}</h3>
              <p className="text-base text-gray-600 mt-2">{item.author}</p>
              <p className="text-2xl font-bold mt-4">
                {/* 쉼표가 포함된 가격 문자열도 처리할 수 있도록 개선합니다. */}
                {Number(String(item.price).replace(/,/g, '') || 0).toLocaleString()}원
              </p>
            </div>
            <button
              onClick={() => removeFromWishlist(item.productId)}
              className="text-gray-400 hover:text-red-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};


// --- 이하 코드는 제공해주신 원본과 동일하게 유지됩니다 ---

const MyPurchasesContent = () => {
    const router = useRouter();
    return (
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold">구매내역</span>
        </div>
        <div className="text-center py-24 border rounded-lg bg-gray-50">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          <p className="mt-4 text-gray-500">구매내역이 없습니다.</p>
          <button onClick={() => router.push('/')} className="mt-6 bg-blue-800 text-white px-6 py-2.5 rounded-md font-semibold hover:bg-blue-900">상품 구매하기</button>
        </div>
      </div>
    );
};

const MyProfileContent = () => (
    <div className="text-center py-20 border rounded-lg bg-gray-50">
        <div>프로필 내용 (사용자 정보 표시 예정)</div>
    </div>
);

const MyInquiriesContent = ({ onOpenModal }: { onOpenModal: () => void }) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const toggleAccordion = (index: number) => setActiveIndex(activeIndex === index ? null : index);
    const faqItems = [
        { question: 'Q. 환불은 어떻게 하나요?', answer: 'A. 구매 후 24시간 이내 가능합니다.' },
        { question: 'Q. PDF 다운로드는?', answer: 'A. My 페이지에서 다운로드.' },
        { question: 'Q. 문의는?', answer: 'A. support@maxxsystems.com으로.' },
    ];
    return (
        <div className="mt-8 space-y-16">
            <section>
                <h3 className="text-2xl font-bold text-gray-900 border-b pb-4 mb-6">환불 정책</h3>
                <p className="text-base text-gray-600 leading-relaxed mb-6">구매 후 24시간 이내 환불 가능합니다. 자세한 사항은 아래 FAQ를 확인하세요.</p>
                <button 
                  onClick={onOpenModal}
                  className="bg-blue-800 text-white px-6 py-2.5 rounded-md font-semibold hover:bg-blue-900"
                >
                  문의하기
                </button>
            </section>
            <section>
                <h3 className="text-2xl font-bold text-gray-900 border-b pb-4 mb-6">고객 지원</h3>
                <p className="text-base text-gray-600 leading-relaxed mb-6">이메일: support@maxxsystems.com</p>
                <div className="text-lg font-semibold text-blue-700 bg-gray-50 p-4 rounded-lg inline-block">support@maxxsystems.com</div>
            </section>
            <section>
                <h3 className="text-2xl font-bold text-gray-900 border-b pb-4 mb-6">FAQ</h3>
                <div className="space-y-2">
                  {faqItems.map((item, index) => (
                    <div key={index} className="border-b">
                      <button
                        className="w-full flex justify-between items-center py-5 px-2 text-left"
                        onClick={() => toggleAccordion(index)}
                      >
                        <span className="text-lg font-medium text-gray-800">{item.question}</span>
                        <span className="text-2xl text-gray-400">{activeIndex === index ? '-' : '+'}</span>
                      </button>
                      <div className={`overflow-hidden transition-max-height duration-300 ease-in-out ${activeIndex === index ? 'max-h-60' : 'max-h-0'}`}>
                        <p className="p-4 pt-0 text-base text-gray-600 bg-gray-50 rounded-b-lg">{item.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
            </section>
        </div>
    );
};

const MyContentsPage = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'my-contents' | 'wishlist' | 'my-info' | 'inquiry'>('wishlist');
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    if (!user) {
        return (
            <>
                <Header />
                <div className="w-full bg-white pb-20 text-center py-40">
                    <p>로그인 후 이용해주세요.</p>
                </div>
                <Footer />
            </>
        );
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
        { id: 'my-contents' as const, label: 'My 구매내역' },
        { id: 'wishlist' as const, label: '찜목록' },
        { id: 'my-info' as const, label: 'My 정보' },
        { id: 'inquiry' as const, label: '문의하기' },
    ];

    return (
        <>
            <Header />
            <div className="w-full bg-white pb-20">
                <section style={{ backgroundColor: '#102450' }} className="text-white text-center py-10">
                    <h1 className="text-2xl font-semibold">{user.nickname}님, 환영합니다!</h1>
                </section>
                <div className="container mx-auto px-4 max-w-7xl">
                    <section className="mt-12">
                        <nav className="flex border-b space-x-12">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`pb-4 font-bold text-xl transition-colors duration-200 ${
                                        activeTab === tab.id
                                            ? 'border-b-2 border-black text-black'
                                            : 'text-gray-400 hover:text-gray-700 border-b-2 border-transparent'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                        <section className="mt-4">
                            <main>{renderContent()}</main>
                        </section>
                    </section>
                </div>
            </div>
            {isModalOpen && <InquiryModal onClose={() => setIsModalOpen(false)} />}
            <Footer />
        </>
    );
};

export default MyContentsPage;
