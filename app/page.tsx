"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import YoutubeBanner from "@/components/YoutubeBanner";
import Manifesto from "@/components/Manifesto";
import GlobalProof from "@/components/GlobalProof";
import HeroSection from "@/components/HeroSection";
import PurchaseNotification from "@/components/PurchaseNotification";
import { ALL_PRODUCTS } from "@/data/products";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function HomeContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'system' | 'strategy'>('all');

  // productId를 URL 경로로 변환하는 매핑
  const getProductUrl = (productId: string): string => {
    const urlMap: Record<string, string> = {
      'first-guide': 'g1',
      'system-builder': 'g2',
      'growth-book': 'g3',
      'strategy-vol1': 'c1',
      'strategy-source': 'c2'
    };
    return `/products/${urlMap[productId] || productId}`;
  };

  // 검색어가 있으면 카테고리 필터 초기화
  useEffect(() => {
    if (searchQuery) {
      setSelectedCategory('all');
    }
  }, [searchQuery]);

  // 카테고리별 및 검색어 필터링
  const filteredProducts = ALL_PRODUCTS.filter(product => {
    // 숨김 상품 제외
    if (product.hidden) return false;

    // 검색어 필터링
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const titleMatch = product.title.toLowerCase().includes(query);
      const authorMatch = product.author.toLowerCase().includes(query);
      return titleMatch || authorMatch;
    }

    // 카테고리 필터링
    if (selectedCategory === 'all') return true;
    // first-guide, system-builder, growth-book은 시스템 학습
    if (selectedCategory === 'system') {
      return ['first-guide', 'system-builder', 'growth-book'].includes(product.id);
    }
    // strategy-vol1, strategy-source는 전략 패키지
    if (selectedCategory === 'strategy') {
      return ['strategy-vol1', 'strategy-source'].includes(product.id);
    }
    return true;
  });

  return (
    <div>
      <Header />

      <HeroSection />

      {/* 실시간 구매 알림 */}
      <PurchaseNotification />

      {/* 상품 그리드 섹션 */}
      <main className="container max-w-7xl mx-auto px-4 py-10">
        {/* 검색 결과 표시 */}
        {searchQuery && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              '{searchQuery}' 검색 결과
            </h2>
            <p className="text-gray-600">
              {filteredProducts.length > 0
                ? `${filteredProducts.length}개의 상품을 찾았습니다.`
                : '검색 결과가 없습니다. 다른 키워드로 검색해보세요.'
              }
            </p>
          </div>
        )}

        {/* 상품 레이아웃 - 레퍼런스 구조 */}
        {filteredProducts.length > 0 ? (
          <div className="space-y-10">
            {/* 섹션 타이틀: 실시간 베스트 강의 */}
            <div className="mb-4" style={{ marginTop: '100px' }}>
              <h2 className="text-2xl font-bold text-gray-900">실시간 베스트 강의</h2>
            </div>

            {/* Section 1: 메인 히어로 카드 (좌우 구조) */}
            {filteredProducts.find(p => p.id === 'first-guide') && (() => {
              const mainProduct = filteredProducts.find(p => p.id === 'first-guide')!;
              return (
                <section className="w-full" style={{ marginBottom: '120px' }}>
                  <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
                      {/* 왼쪽: 큰 썸네일 이미지 */}
                      <div className="lg:col-span-7">
                        <Link href={getProductUrl(mainProduct.id)}>
                          <div className="relative group cursor-pointer rounded-xl overflow-hidden bg-gray-100 aspect-[2/1]">
                            <img
                              src={mainProduct.thumbnail}
                              alt={mainProduct.title}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            {/* 좌상단 배지들 */}
                            <div className="absolute top-3 left-3 flex gap-1.5">
                              <span className="px-2.5 py-0.5 bg-orange-500 text-white text-xs font-bold rounded">
                                무료
                              </span>
                              <span className="px-2.5 py-0.5 bg-black text-white text-xs font-medium rounded-full">
                                VOD
                              </span>
                            </div>
                            {/* 우상단 하트 아이콘 */}
                            <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors">
                              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                            </button>
                          </div>
                        </Link>
                      </div>

                      {/* 오른쪽: 정보 카드 */}
                      <div className="lg:col-span-3">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 h-full flex flex-col">
                          {/* VOD 배지 */}
                          <div className="mb-2">
                            <span className="inline-block px-2.5 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                              ● VOD
                            </span>
                          </div>

                          {/* 제목 */}
                          <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
                            {mainProduct.title}
                          </h3>

                          {/* 강사명 */}
                          <p className="text-xs text-gray-600 mb-2">{mainProduct.author}</p>

                          {/* 별점 */}
                          <div className="flex items-center gap-1.5 mb-3">
                            <span className="text-yellow-400 text-base">⭐</span>
                            <span className="text-sm font-semibold text-gray-900">5.0</span>
                            <span className="text-xs text-gray-500">(32)</span>
                          </div>

                          {/* 공유하기 버튼 */}
                          <button className="flex items-center gap-1.5 text-xs text-gray-600 mb-3 hover:text-gray-900">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                            공유하기
                          </button>

                          {/* 강의 정보 */}
                          <div className="flex flex-col gap-2 mb-3 p-2.5 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              365일 수강
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              1000명 모집
                            </div>
                          </div>

                          {/* 가격 */}
                          <div className="mb-3">
                            <div className="text-xl font-bold text-gray-900">{mainProduct.price}원</div>
                          </div>

                          {/* 지금 보기 버튼 */}
                          <Link href={getProductUrl(mainProduct.id)}>
                            <button className="w-full py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                              지금 보기
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              );
            })()}

            {/* Section 2: 실시간 베스트 강의 (반복 제목) */}
            <div className="max-w-5xl mr-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">실시간 베스트 강의</h2>
            </div>

            {/* Section 3: 나머지 상품 3열 그리드 */}
            <section className="w-full">
              <div className="max-w-5xl mr-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.filter(p => p.id !== 'first-guide').map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      imgSrc={product.thumbnail}
                      title={product.title}
                      author={product.author}
                      rating="4.8"
                      studentCount="280"
                      price={product.price}
                      href={getProductUrl(product.id)}
                      badges={["무료", "VOD"]}
                    />
                  ))}
                </div>
              </div>
            </section>
          </div>
        ) : searchQuery ? (
          <div className="flex flex-col items-center justify-center py-16">
            <svg className="w-24 h-24 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-gray-500 text-lg">검색 결과가 없습니다</p>
          </div>
        ) : null}
      </main>

      <GlobalProof />

      <YoutubeBanner />

      <section className="w-full bg-gradient-to-b from-gray-50 to-white py-20 mt-16">
        <div className="container mx-auto max-w-screen-2xl px-4">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
              <div className="relative bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 h-full border border-gray-100">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">결과로 증명합니다</h4>
                <p className="text-gray-600 leading-relaxed">우리의 유일한 증명은 '계좌'입니다. 모든 전략과 기술은 실제 데이터와 수익률로 검증되었습니다.</p>
              </div>
            </div>
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
              <div className="relative bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 h-full border border-gray-100">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">예측하지 않고 설계합니다</h4>
                <p className="text-gray-600 leading-relaxed">우리는 단기적인 수익률(벽돌)이 아닌, 지속 가능한 수익 시스템(설계도)의 기술을 제공합니다.</p>
              </div>
            </div>
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
              <div className="relative bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 h-full border border-gray-100">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">'감'의 영역을 넘어</h4>
                <p className="text-gray-600 leading-relaxed">당신의 트레이딩을 '감'의 영역에서 '데이터 엔지니어링'의 영역으로 바꿔드립니다. 자신만의 '원칙'과 '시스템'을 갖게 될 것입니다.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Manifesto />

      <Footer />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}