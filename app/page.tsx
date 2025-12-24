"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import YoutubeBanner from "@/components/YoutubeBanner";
import Manifesto from "@/components/Manifesto";
import GlobalProof from "@/components/GlobalProof";
import HeroSection from "@/components/HeroSection";
import PurchaseNotification from "@/components/PurchaseNotification";
import FeaturedCourse from "@/components/FeaturedCourse";
import { ALL_PRODUCTS } from "@/data/products";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

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
      <main className="w-full lg:pl-60 py-6 lg:py-10 px-4 lg:px-0">
        {/* 검색 결과 표시 */}
        {searchQuery && (
          <div className="mb-6 lg:mb-8">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
              '{searchQuery}' 검색 결과
            </h2>
            <p className="text-sm lg:text-base text-gray-600">
              {filteredProducts.length > 0
                ? `${filteredProducts.length}개의 상품을 찾았습니다.`
                : '검색 결과가 없습니다. 다른 키워드로 검색해보세요.'
              }
            </p>
          </div>
        )}

        {/* 상품 레이아웃 */}
        {filteredProducts.length > 0 ? (
          <div className="space-y-6 lg:space-y-10">
            {/* 섹션 타이틀: 실시간 베스트 강의 */}
            <div id="best-courses" className="mb-3 lg:mb-4" style={{ marginTop: '20px', scrollMarginTop: '120px' }}>
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900">실시간 베스트 강의</h2>
            </div>

            {/* 4개 강의 카드 가로 배치 */}
            <section className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    imgSrc={product.thumbnail}
                    title={product.title}
                    author={product.author}
                    rating={product.rating}
                    studentCount="280"
                    price={product.price}
                    href={getProductUrl(product.id)}
                    badges={product.id === 'growth-book' ? ["할인", "마감", "VOD"] : ["할인", "VOD"]}
                    duration={product.duration}
                    maxStudents={product.maxStudents}
                    instructor={product.instructor}
                    installment={product.installment}
                    discount={product.discount}
                    originalPrice={product.originalPrice}
                    reviewCount={product.reviewCount}
                    soldOut={product.id === 'growth-book'}
                  />
                ))}
              </div>
            </section>
          </div>
        ) : searchQuery ? (
          <div className="flex flex-col items-center justify-center py-12 lg:py-16">
            <svg className="w-16 h-16 lg:w-24 lg:h-24 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-gray-500 text-base lg:text-lg">검색 결과가 없습니다</p>
          </div>
        ) : null}
      </main>

      {/* 중간 배너 섹션 */}
      <section className="w-full bg-white py-8 lg:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <img
            src="/중간배너.png"
            alt="Overview Banner"
            className="w-full rounded-lg lg:rounded-2xl shadow-lg"
          />
        </div>
      </section>

      <GlobalProof />

      <div id="member-reports" style={{ scrollMarginTop: '120px' }}>
        <YoutubeBanner />
      </div>

      <FeaturedCourse />

      <section className="w-full bg-gradient-to-b from-gray-50 to-white py-12 lg:py-20 mt-8 lg:mt-16">
        <div className="container mx-auto max-w-screen-2xl px-4">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-12">
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
              <div className="relative bg-white p-5 lg:p-8 rounded-xl lg:rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 h-full border border-gray-100">
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg lg:rounded-xl flex items-center justify-center mb-4 lg:mb-6 shadow-lg">
                  <svg className="w-6 h-6 lg:w-7 lg:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h4 className="text-lg lg:text-xl font-bold text-gray-900 mb-2 lg:mb-3">결과로 증명합니다</h4>
                <p className="text-sm lg:text-base text-gray-600 leading-relaxed">우리의 유일한 증명은 '계좌'입니다. 모든 전략과 기술은 실제 데이터와 수익률로 검증되었습니다.</p>
              </div>
            </div>
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
              <div className="relative bg-white p-5 lg:p-8 rounded-xl lg:rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 h-full border border-gray-100">
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg lg:rounded-xl flex items-center justify-center mb-4 lg:mb-6 shadow-lg">
                  <svg className="w-6 h-6 lg:w-7 lg:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h4 className="text-lg lg:text-xl font-bold text-gray-900 mb-2 lg:mb-3">예측하지 않고 설계합니다</h4>
                <p className="text-sm lg:text-base text-gray-600 leading-relaxed">우리는 단기적인 수익률(벽돌)이 아닌, 지속 가능한 수익 시스템(설계도)의 기술을 제공합니다.</p>
              </div>
            </div>
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
              <div className="relative bg-white p-5 lg:p-8 rounded-xl lg:rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 h-full border border-gray-100">
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg lg:rounded-xl flex items-center justify-center mb-4 lg:mb-6 shadow-lg">
                  <svg className="w-6 h-6 lg:w-7 lg:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="text-lg lg:text-xl font-bold text-gray-900 mb-2 lg:mb-3">'감'의 영역을 넘어</h4>
                <p className="text-sm lg:text-base text-gray-600 leading-relaxed">당신의 트레이딩을 '감'의 영역에서 '데이터 엔지니어링'의 영역으로 바꿔드립니다. 자신만의 '원칙'과 '시스템'을 갖게 될 것입니다.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 공지사항 섹션 */}
      <section className="w-full bg-white py-10 lg:py-20">
        <div className="container mx-auto max-w-screen-2xl px-4">
          <div className="flex items-center justify-between mb-5 lg:mb-8">
            <h2 className="text-xl lg:text-3xl font-bold text-gray-900">공지사항</h2>
            <button className="text-sm lg:text-base text-gray-600 hover:text-gray-900 flex items-center gap-1">
              전체보기
              <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="space-y-3 lg:space-y-5">
            {/* 공지사항 아이템 1 */}
            <div className="bg-gray-50 rounded-lg lg:rounded-xl p-4 lg:p-8 shadow-sm hover:shadow-md transition-all cursor-pointer group">
              <div className="flex items-start gap-3 lg:gap-5">
                <span className="px-2 py-1 lg:px-3 lg:py-1.5 bg-red-50 text-red-600 text-xs lg:text-sm font-medium rounded border border-red-100 flex-shrink-0">중요</span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-2 lg:mb-3">
                    강의 환불 규정 안내 <span className="inline-flex items-center justify-center w-4 h-4 lg:w-5 lg:h-5 ml-1 bg-blue-500 text-white text-xs rounded-full">N</span>
                  </h3>
                  <p className="text-sm lg:text-base text-gray-600 leading-relaxed mb-3 lg:mb-4 line-clamp-3 lg:line-clamp-none">
                    안녕하세요, 감각이마나입니다.수강/환불 관련 기준을 아래와 같이 안내드립니다.1) 환불 가능 조건전액 환불은 수강 시작일로부터 7일 이내에만 가능합니다.단, 무료 강의를 제외한 유료 강의에 대해 "수강(시청/이용) 이력이 없는 경우"에 한해 전액 환불이 가능합니다.수강 시작일 기준: 결제 완료일(또는 수강 등록/첫 이용일) 기준으로 산정됩니다.2) 기간별 환불 비율수강 시작일을 기준으로 아래 기준이 적용됩니다.7일 초과 ~ 1개월 이내: 결제금액의 70% 환불1개월 초과 ~ 2개월 이내: 결제금액의 40% 환불2개월 초과: 환불 불가(0%3)) 자료 다운로드/이용 시 '수강 처리' 안내강의 자료(PDF/참부파일 등)를 다운로드하거나 열람한 경우, 해당 강의는 수강한 것으로 간주됩니다.이 경우 전액 환불...
                  </p>
                  <div className="flex items-center gap-3 lg:gap-6 text-xs lg:text-sm text-gray-500">
                    <span className="flex items-center gap-1 lg:gap-1.5">
                      <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      2025.12.22 17:12
                    </span>
                    <span className="flex items-center gap-1 lg:gap-1.5">
                      <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      2
                    </span>
                  </div>
                </div>
                <svg className="hidden lg:block w-6 h-6 text-blue-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
            </div>

            {/* 공지사항 아이템 2 */}
            <div className="bg-gray-50 rounded-lg lg:rounded-xl p-4 lg:p-8 shadow-sm hover:shadow-md transition-all cursor-pointer group">
              <div className="flex items-start gap-3 lg:gap-5">
                <span className="px-2 py-1 lg:px-3 lg:py-1.5 bg-red-50 text-red-600 text-xs lg:text-sm font-medium rounded border border-red-100 flex-shrink-0">중요</span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-2 lg:mb-3">
                    ◆ 무단 배포 / 저작권 침해 관련 공지
                  </h3>
                  <p className="text-sm lg:text-base text-gray-600 leading-relaxed mb-3 lg:mb-4 line-clamp-3 lg:line-clamp-none">
                    감각이마나에서 제공되는 모든 강의·전략·자료는 저작권법에 의해 보호되고 있습니다.저작권 침해는 수강생분들 눈은 윤리와의 덕목에 무단 배포나 공동 구매 사례가 단 한 번도 없었습니다.이 점 진심으로 감사드립니다.다만, 만약 향후라도 이러한 사안이 발견될 시엔 유통 공동 구매 불법 제배포가 증가하는 추세라 저희도 수강생분들의 권리를 보호하기 위해 아래 규정을 명확히 안내드립니다.◯ 금지되는 행위강의영상·자료·PDF 등 모든 자료의 무단 복사 및 배포타인과의 공동 구매 / 계정 공유자료 일부 또는 전체를 SNS·오픈채팅방·커페에 업로드강의 내용을 2차 가공하여압업 촬용척발 시 조치주시 수급 검한 박별(관불 불가)만 생시상 조치 및 손해배상 청구강의 가격 기준 최소 3배 이...
                  </p>
                  <div className="flex items-center gap-3 lg:gap-6 text-xs lg:text-sm text-gray-500">
                    <span className="flex items-center gap-1 lg:gap-1.5">
                      <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      2025.12.03 19:11
                    </span>
                    <span className="flex items-center gap-1 lg:gap-1.5">
                      <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      132
                    </span>
                  </div>
                </div>
                <svg className="hidden lg:block w-6 h-6 text-blue-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
            </div>

            {/* 공지사항 아이템 3 */}
            <div className="bg-gray-50 rounded-lg lg:rounded-xl p-4 lg:p-8 shadow-sm hover:shadow-md transition-all cursor-pointer group">
              <div className="flex items-start gap-3 lg:gap-5">
                <span className="px-2 py-1 lg:px-3 lg:py-1.5 bg-blue-50 text-blue-600 text-xs lg:text-sm font-medium rounded border border-blue-100 flex-shrink-0">일반</span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-2 lg:mb-3">
                    강의 자료/패블릿 다운받는 방법
                  </h3>
                  <p className="text-sm lg:text-base text-gray-600 leading-relaxed mb-3 lg:mb-4 line-clamp-3 lg:line-clamp-none">
                    안녕하세요. 강의 중 필요한 자료나 템플릿은 커뮤니티를 탭을 통해 제공됩니다.★ 강의 내용에 따라 업로드된 자료가 다르니, 꼭 해당 강의의 커뮤니티 탭을 확인해주세요1. 강의 자료/패블릿 다운받는 방법📌 PC에서 다운로드 방법강의의 화면 우측 하단에 있는'커뮤니티' 탭을 클릭합니다.게시된 링크 중 원하는 자료를 클릭하면 자동으로 다운로드가 시작됩니다.ㅁ 모바일에서 다운로드 방법강의의 제목 바로 아래에 있는 '커뮤니티' 탭을 눌러 이동니다.제공 강의에 언로드 릴크를 클릭하면 됩니다.
                  </p>
                  <div className="flex items-center gap-3 lg:gap-6 text-xs lg:text-sm text-gray-500">
                    <span className="flex items-center gap-1 lg:gap-1.5">
                      <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      2025.10.15 13:01
                    </span>
                    <span className="flex items-center gap-1 lg:gap-1.5">
                      <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      91
                    </span>
                  </div>
                </div>
                <svg className="hidden lg:block w-6 h-6 text-blue-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 브랜드 섹션 */}
      <section className="relative w-full bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-950 py-16 md:py-24 lg:py-32 overflow-hidden">
        {/* 복잡한 배경 레이어들 */}
        <div className="absolute inset-0">
          {/* 그리드 패턴 */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `
              linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>

          {/* 대각선 라인 */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(16, 185, 129, 0.1) 35px, rgba(16, 185, 129, 0.1) 70px)'
          }}></div>

          {/* 3D 느낌의 기하학적 도형들 */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-tl from-green-600/15 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-gradient-to-tr from-teal-500/20 to-transparent rounded-full blur-3xl"></div>

          {/* 육각형 패턴 효과 */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0L93.3 25v50L50 100 6.7 75V25z' fill='none' stroke='%2310b981' stroke-width='1'/%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px'
          }}></div>
        </div>

        {/* 빛 효과 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/50 via-transparent to-slate-950/80"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent"></div>

        {/* 컨텐츠 */}
        <div className="container mx-auto max-w-screen-2xl px-4 relative z-10">
          <div className="flex flex-col items-center justify-center text-center space-y-6 md:space-y-8">
            {/* 로고 */}
            <div className="relative">
              <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full"></div>
              <img
                src="/로고.png"
                alt="감각이마나 로고"
                className="relative w-32 h-32 md:w-48 md:h-48 object-contain drop-shadow-2xl"
              />
            </div>

            {/* 텍스트 */}
            <div className="space-y-2 md:space-y-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                온라인으로 돈버는 방법,
              </h2>
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
                가장 쉽게 알려드려요.
              </p>
            </div>

            {/* 서브 텍스트 */}
            <div className="space-y-1 md:space-y-2 text-gray-300 text-sm sm:text-base md:text-lg">
              <p>방법부터 실행까지,</p>
              <p>고독이어 아닌 생활 내는 것까지</p>
              <p>수강생과 강사분들과 함께하는 플랫폼,</p>
              <p className="font-semibold text-white">감각이마나.</p>
            </div>

            {/* 버튼과 소셜 미디어 */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mt-6 md:mt-8 w-full sm:w-auto">
              <button className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-colors shadow-lg text-sm sm:text-base">
                모든 강의 보기
              </button>
              <div className="flex items-center gap-3 sm:gap-4">
                <a href="#" className="text-white hover:text-green-400 transition-colors">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-green-400 transition-colors">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-green-400 transition-colors">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-green-400 transition-colors">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-green-400 transition-colors">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 장식 요소 */}
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
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