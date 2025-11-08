'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { XMarkIcon, BookOpenIcon, HeartIcon, PlayCircleIcon } from '@heroicons/react/24/outline';
import InquiryModal from '@/components/my-contents/InquiryModal';
import { useRouter, useSearchParams } from 'next/navigation';
import { ALL_PRODUCTS } from '@/data/products';

const mergeWishlistWithProducts = (wishlist: any[]) => {
  const merged = wishlist.map(item => {
    const product = ALL_PRODUCTS.find(p => p.id === item.productId);
    if (product) {
      return { ...item, ...product };
    }
    return { ...item, title: 'Unknown Product', author: 'Unknown', price: '0', thumbnail: '/placeholder.png' };
  }).filter(Boolean);
  return merged;
};

const MyWishlistContent = () => {
  const router = useRouter();
  const { wishlist, removeFromWishlist } = useAuth();
  const mergedProducts = useMemo(() => mergeWishlistWithProducts(wishlist), [wishlist]);

  if (mergedProducts.length === 0) {
    return (
      <div className="mt-10 text-center py-32 bg-gray-50 rounded-lg border border-gray-200">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gray-100 rounded-full">
          <HeartIcon className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">찜한 상품이 없습니다</h3>
        <p className="text-sm text-gray-500">마음에 드는 콘텐츠를 찜해보세요</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="mb-5">
        <span className="text-sm font-medium text-gray-700">총 <span className="text-gray-900 font-semibold">{mergedProducts.length}</span>개</span>
      </div>

      {/* Horizontal Card Layout */}
      <div className="space-y-4 max-w-5xl">
        {mergedProducts.map((item) => (
          <button
            key={item.productId}
            onClick={() => router.push(`/products/${item.id}`)}
            className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 text-left w-full relative flex"
          >
            {/* Product Image - Left Side */}
            <div className="relative w-40 md:w-48 flex-shrink-0 bg-gray-50 overflow-hidden">
              <img
                src={item.thumbnail || '/placeholder.png'}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Product Info - Right Side */}
            <div className="flex-1 p-5 flex flex-col justify-center relative">
              <p className="text-xs text-gray-500 mb-2">저작</p>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 leading-snug line-clamp-2">{item.title}</h3>
              <p className="text-sm md:text-base text-gray-600">{item.author}</p>

              {/* Remove Button - Positioned absolutely in top right */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromWishlist(item.productId);
                }}
                className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-500 rounded-lg transition-colors z-10"
                aria-label="찜 해제"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const MyPurchasesContent = () => {
    const router = useRouter();
    const { purchases, isLoadingPurchases } = useAuth();

    const getLearnPageUrl = (productId: string) => {
        const learnPageMap: { [key: string]: string } = {
            'system-builder': '/learn/system-builder',
            'first-guide': '/learn/first-guide',
            'growth-book': '/learn/growth-book',
            'strategy-vol1': '/learn/strategy-vol1',
            'strategy-source': '/learn/strategy-source',
        };
        return learnPageMap[productId] || '/my-contents';
    };

    const mergedPurchases = useMemo(() => {
      const merged = purchases.map(item => {
        const product = ALL_PRODUCTS.find(p => p.id === item.productId);
        if (product) {
          return { ...item, ...product };
        }
        return { ...item, title: 'Unknown Product', author: 'Unknown', price: '0', thumbnail: '/placeholder.png' };
      });
      return merged;
    }, [purchases]);

    if (isLoadingPurchases) {
      return (
        <div className="mt-10 text-center py-32">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-3 border-solid border-gray-900 border-r-transparent"></div>
          <p className="mt-4 text-sm text-gray-600">구매내역을 불러오는 중...</p>
        </div>
      );
    }

    if (mergedPurchases.length === 0) {
      return (
        <div className="mt-10 text-center py-32 bg-gray-50 rounded-lg border border-gray-200">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gray-100 rounded-full">
            <BookOpenIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">구매내역이 없습니다</h3>
          <p className="text-sm text-gray-500 mb-5">지금 바로 학습을 시작해보세요</p>
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            <PlayCircleIcon className="w-5 h-5" />
            콘텐츠 둘러보기
          </button>
        </div>
      );
    }

    return (
      <div>
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">총 <span className="font-semibold">{mergedPurchases.length}</span>개</h2>

          {/* 정렬 드롭다운 */}
          <div className="flex items-center gap-2">
            <select className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>보유한 콘텐츠</option>
              <option>최신순</option>
              <option>오래된순</option>
            </select>
          </div>
        </div>

        {/* 2열 그리드 레이아웃 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {mergedPurchases.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-md border border-gray-200 transition-shadow relative"
            >
              {/* 우측 상단 3점 메뉴 */}
              <div className="absolute top-6 right-6">
                <button className="text-gray-400 hover:text-gray-600 p-1">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
              </div>

              {/* 클릭 가능한 영역: 이미지 + 제목/정보 */}
              <div
                className="cursor-pointer group mb-5 flex gap-5"
                onClick={() => router.push(getLearnPageUrl(item.productId))}
              >
                {/* 왼쪽: 썸네일 (세로로 긴 직사각형) */}
                <div className="flex-shrink-0">
                  <div className="w-28 h-36 bg-gray-50 rounded-lg shadow-sm overflow-hidden group-hover:shadow-md transition-shadow">
                    <img
                      src={item.thumbnail || '/placeholder.png'}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* 오른쪽: 제목 + 제작자 + 이어보기 버튼 */}
                <div className="flex-1 flex flex-col justify-between pr-8">
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500">{item.author}</p>
                  </div>

                  {/* 이어보기 작은 버튼 */}
                  <div className="mt-3">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-medium">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                      이어보기
                    </span>
                  </div>
                </div>
              </div>

              {/* 하단: 후기 작성 버튼 */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // 후기 작성
                }}
                className="w-full py-2.5 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 text-gray-700 rounded-lg text-sm font-medium transition-all"
              >
                후기 작성
              </button>
            </div>
          ))}
        </div>

        {/* 하단 더보기 버튼 */}
        <div className="mt-12 text-center">
          <button className="px-8 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2">
            프로모 더 둘러보기
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    );
};

const MyProfileContent = () => {
    const { user } = useAuth();

    return (
        <div className="mt-10 max-w-3xl">
            <div className="bg-white border border-gray-200 rounded-lg p-8">
                <div className="mb-6 pb-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">개인 정보</h2>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            닉네임
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={user?.nickname || ''}
                                disabled
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm"
                            />
                        </div>
                        <p className="mt-1.5 text-xs text-gray-500">※ 닉네임은 카카오 로그인 시 자동으로 변경됩니다.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            아이디(이메일)
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                value={user?.email || ''}
                                disabled
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            *생년월일
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value="20020608"
                                disabled
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            *성별
                        </label>
                        <div className="relative">
                            <select
                                disabled
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm appearance-none cursor-not-allowed"
                            >
                                <option>남</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            *휴대폰번호 인증
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value="010-3334-7276"
                                disabled
                                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm"
                            />
                            <button
                                disabled
                                className="px-6 py-3 bg-gray-200 text-gray-500 rounded-lg text-sm font-medium cursor-not-allowed"
                            >
                                번호 변경
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                    <button
                        disabled
                        className="w-full bg-gray-300 text-gray-500 px-6 py-3.5 rounded-lg text-sm font-semibold cursor-not-allowed"
                    >
                        저장
                    </button>
                </div>
            </div>
        </div>
    );
};

const MyInquiriesContent = ({ onOpenModal }: { onOpenModal: () => void }) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const toggleAccordion = (index: number) => setActiveIndex(activeIndex === index ? null : index);
    const faqItems = [
        { question: '환불은 어떻게 하나요?', answer: '구매 후 24시간 이내에 환불 신청이 가능합니다. My 콘텐츠 페이지에서 환불 요청을 하시면 검토 후 처리해드립니다.' },
        { question: 'PDF 다운로드는 어디서 하나요?', answer: 'My 콘텐츠 페이지에서 구매하신 상품의 "학습하기" 버튼을 클릭하시면 학습 자료 탭에서 다운로드하실 수 있습니다.' },
        { question: '학습 진행 상황은 어떻게 확인하나요?', answer: '각 학습 페이지의 사이드바에서 학습 진행률과 체크리스트를 확인하실 수 있습니다.' },
        { question: '1:1 문의는 어떻게 하나요?', answer: '아래 "문의하기" 버튼을 클릭하시거나 support@maxxsystems.com으로 이메일을 보내주세요.' },
    ];

    return (
        <div className="mt-10 space-y-10">
            <section className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0 w-12 h-12 bg-white border border-gray-200 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">궁금한 점이 있으신가요?</h3>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                      학습 관련 문의사항이나 기술적인 질문이 있으시면 언제든지 문의해주세요.
                      빠르고 정확하게 답변해드리겠습니다.
                    </p>
                    <button
                      onClick={onOpenModal}
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      문의하기
                    </button>
                  </div>
                </div>
            </section>

            <section>
                <h3 className="text-xl font-bold text-gray-900 mb-4">자주 묻는 질문</h3>
                <div className="space-y-2">
                  {faqItems.map((item, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors">
                      <button
                        className="w-full flex justify-between items-center py-4 px-5 text-left hover:bg-gray-50 transition-colors"
                        onClick={() => toggleAccordion(index)}
                      >
                        <span className="text-base font-semibold text-gray-900">Q. {item.question}</span>
                        <div className={`flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center transition-all ${
                          activeIndex === index ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'
                        }`}>
                          <svg className={`w-4 h-4 transition-transform ${activeIndex === index ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${activeIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="px-5 pb-4">
                          <div className="bg-gray-50 rounded-md p-4 border-l-3 border-blue-600">
                            <p className="text-sm text-gray-700 leading-relaxed">{item.answer}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
            </section>

            <section className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">이메일 문의</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">직접 이메일로 문의하실 수도 있습니다</p>
                <a
                  href="mailto:support@maxxsystems.com"
                  className="inline-flex items-center gap-2 text-base font-medium text-gray-900 hover:text-gray-700 bg-gray-50 px-5 py-2.5 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  support@maxxsystems.com
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
            </section>
        </div>
    );
};

const MyContentsPageContent = () => {
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState<'my-contents' | 'wishlist' | 'my-info' | 'inquiry'>('my-contents');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const tab = searchParams.get('tab') as 'my-contents' | 'wishlist' | 'my-info' | 'inquiry';
        if (tab && ['my-contents', 'wishlist', 'my-info', 'inquiry'].includes(tab)) {
            setActiveTab(tab);
        }
    }, [searchParams]);

    const handleTabChange = (tab: 'my-contents' | 'wishlist' | 'my-info' | 'inquiry') => {
        setActiveTab(tab);
        router.push(`/my-contents?tab=${tab}`, { scroll: false });
    };

    if (!user) {
        return (
            <>
                <Header />
                <div className="w-full bg-white pb-20 text-center py-40">
                    <p className="text-lg text-gray-600">로그인 후 이용해주세요.</p>
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
        { id: 'my-contents' as const, label: 'My콘텐츠' },
        { id: 'wishlist' as const, label: '찜목록' },
        { id: 'my-info' as const, label: 'My정보' },
        { id: 'inquiry' as const, label: '문의하기' },
    ];

    return (
        <>
            <Header />
            <div className="w-full bg-white pb-20 min-h-screen">
                {/* 헤더 배너 - 레퍼런스와 동일 */}
                <section className="bg-gradient-to-r from-slate-700 to-slate-800 py-16">
                    <div className="container mx-auto px-4 max-w-7xl text-center">
                        <h1 className="text-3xl font-bold text-white mb-2">{user.nickname}님의 콘텐츠</h1>
                    </div>
                </section>

                <div className="container mx-auto px-4 max-w-7xl">
                    <section className="mt-8">
                        {/* 탭 네비게이션 - 레퍼런스와 동일 */}
                        <nav className="flex gap-12 border-b border-gray-200 mb-10">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabChange(tab.id)}
                                    className={`pb-4 text-base font-semibold transition-all relative ${
                                        activeTab === tab.id
                                            ? 'text-gray-900'
                                            : 'text-gray-400 hover:text-gray-600'
                                    }`}
                                >
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
                                    )}
                                </button>
                            ))}
                        </nav>
                        <section>
                            <main>{renderContent()}</main>
                        </section>

                        {/* Explore Section */}
                        {(activeTab === 'my-contents' || activeTab === 'wishlist') && (
                            <section className="mt-16 pt-10 border-t border-gray-200">
                                <div className="text-center mb-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-1">MAXX 둘러보기</h2>
                                    <p className="text-sm text-gray-500">더 많은 학습 콘텐츠를 확인해보세요</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <button
                                        onClick={() => router.push('/builder-start')}
                                        className="group bg-gradient-to-br from-blue-50 to-indigo-50 border border-gray-200 rounded-lg p-6 text-left hover:shadow-md hover:border-blue-200 transition-all duration-200"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center">
                                                <BookOpenIcon className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-base font-bold text-gray-900 mb-1">빌더의 시작</h3>
                                                <p className="text-xs text-gray-600 leading-relaxed">
                                                    시스템 트레이딩의 기초부터 실전까지 체계적으로 학습하세요
                                                </p>
                                            </div>
                                            <svg className="flex-shrink-0 w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => router.push('/system-strategy')}
                                        className="group bg-gradient-to-br from-purple-50 to-pink-50 border border-gray-200 rounded-lg p-6 text-left hover:shadow-md hover:border-purple-200 transition-all duration-200"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0 w-10 h-10 bg-purple-600 text-white rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-base font-bold text-gray-900 mb-1">시스템 & 전략</h3>
                                                <p className="text-xs text-gray-600 leading-relaxed">
                                                    백테스트로 검증된 퀀트 전략과 실행 도구를 경험하세요
                                                </p>
                                            </div>
                                            <svg className="flex-shrink-0 w-5 h-5 text-purple-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </button>
                                </div>
                            </section>
                        )}
                    </section>
                </div>
            </div>
            {isModalOpen && <InquiryModal onClose={() => setIsModalOpen(false)} />}
            <Footer />
        </>
    );
};

const MyContentsPage = () => {
    return (
        <Suspense fallback={
            <>
                <Header />
                <div className="w-full bg-white pb-20 text-center py-40">
                    <div className="inline-block h-10 w-10 animate-spin rounded-full border-3 border-solid border-gray-900 border-r-transparent"></div>
                    <p className="mt-4 text-sm text-gray-600">로딩 중...</p>
                </div>
                <Footer />
            </>
        }>
            <MyContentsPageContent />
        </Suspense>
    );
};

export default MyContentsPage;
