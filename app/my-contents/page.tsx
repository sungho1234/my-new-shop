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
    <div className="mt-10">
      <div className="mb-4">
        <span className="text-sm font-medium text-gray-700">총 <span className="text-gray-900 font-semibold">{mergedProducts.length}</span>개</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {mergedProducts.map((item) => (
          <div key={item.productId} className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200">
            <div className="flex">
              <div className="relative w-48 h-48 flex-shrink-0 bg-gray-50 overflow-hidden">
                <img
                  src={item.thumbnail || '/placeholder.png'}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <button
                  onClick={() => removeFromWishlist(item.productId)}
                  className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm text-gray-600 hover:text-red-500 hover:bg-white rounded-md transition-colors shadow-sm"
                  aria-label="찜 해제"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-semibold text-gray-900 line-clamp-2 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{item.author}</p>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <BookOpenIcon className="w-4 h-4" />
                    <span>학습 콘텐츠</span>
                  </div>
                </div>
                <button
                  onClick={() => router.push(`/products/${item.id}`)}
                  className="mt-3 w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  구매하기
                </button>
              </div>
            </div>
          </div>
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
      <div className="mt-10">
        <div className="mb-4">
          <span className="text-sm font-medium text-gray-700">총 <span className="text-gray-900 font-semibold">{mergedPurchases.length}</span>개</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {mergedPurchases.map((item) => (
            <div key={item.id} className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200">
              <div className="flex">
                <div className="relative w-48 h-48 flex-shrink-0 bg-gray-50 overflow-hidden">
                  <img
                    src={item.thumbnail || '/placeholder.png'}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute top-2 right-2 bg-white px-2.5 py-0.5 rounded-full border border-gray-200">
                    <span className="text-xs font-medium text-gray-700">구매완료</span>
                  </div>
                </div>
                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 line-clamp-2 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{item.author}</p>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{new Date(item.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push(getLearnPageUrl(item.productId))}
                    className="mt-3 w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    <BookOpenIcon className="w-4 h-4" />
                    학습하기
                  </button>
                </div>
              </div>
            </div>
          ))}
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
        { id: 'my-contents' as const, label: 'My콘텐츠', icon: (
          <BookOpenIcon className="w-5 h-5" />
        )},
        { id: 'wishlist' as const, label: '찜목록', icon: (
          <HeartIcon className="w-5 h-5" />
        )},
        { id: 'my-info' as const, label: 'My정보', icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        )},
        { id: 'inquiry' as const, label: '문의하기', icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )},
    ];

    return (
        <>
            <Header />
            <div className="w-full bg-white pb-20 min-h-screen">
                <section className="relative bg-gray-50 border-b border-gray-200 py-12">
                    <div className="container mx-auto px-4 max-w-7xl">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 bg-white border border-gray-200 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Welcome back</p>
                            <h1 className="text-2xl font-bold text-gray-900">{user.nickname}님</h1>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">학습을 계속해보세요</p>
                    </div>
                </section>

                <div className="container mx-auto px-4 max-w-7xl">
                    <section className="mt-6">
                        <nav className="flex gap-1 p-1 bg-gray-100 rounded-lg mb-6">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabChange(tab.id)}
                                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md text-sm font-medium transition-all ${
                                        activeTab === tab.id
                                            ? 'bg-blue-600 text-white shadow-sm'
                                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                                >
                                    {tab.icon}
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </nav>
                        <section>
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
