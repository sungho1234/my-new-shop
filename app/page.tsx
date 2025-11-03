import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductSlider from "@/components/ProductSlider";
import YoutubeBanner from "@/components/YoutubeBanner";
import Manifesto from "@/components/Manifesto";
import GlobalProof from "@/components/GlobalProof";
import HeroSection from "@/components/HeroSection"; // 새로 만든 HeroSection 컴포넌트를 가져옵니다.

// systemsData와 strategiesData는 그대로 유지됩니다.
const systemsData = [
  { imgSrc: "/g1.png", title: "2025 일반인을 위한 시스템 투자 올인원", desc: "⭐4.8 ㅣ 구매 280명", price: "210,000원", href: '/products/g1' },
  { imgSrc: "/g2.png", title: "일반인을 위한 첫번째 안내서: 거래소 선택부터 차트 셋업까지", desc: "⭐4.8 ㅣ 구매 280명", price: "70,000원", href: '/products/g2' },
  { imgSrc: "https://via.placeholder.com/300x400/F3F4F6/9CA3AF?text=%ED%80%88%ED%8A%B8+%EC%8B%9C%EC%8A%A4%ED%85%9C+Pro", title: "일반인의 성장책: 스캠필터와 챌린지", desc: "⭐4.8 ㅣ 구매 280명", price: "60,000원", href: '/products/g3'  },
];

const strategiesData = [
  { imgSrc: "/c1.png", title: "시스템 빌더 풀 패키지: 실행 엔진, 1:1 지원, 멤버십 키 ", desc: "⭐4.8 ㅣ 구매 280명", price: "₩210,000", href: '/products/c1' },
  { imgSrc: "https://via.placeholder.com/300x400/CA8A04/FFFFFF?text=Risk+Mgmt", title: "프로의 전략 원본: 시스템 설계도와 데이터 분석 ", desc: "⭐4.8 ㅣ 구매 280명", price: "₩90,000", href: '/products/c2' },
  { imgSrc: "https://via.placeholder.com/300x400/CA8A04/FFFFFF?text=Risk+Mgmt", title: "리스크 관리 전략", desc: "계좌를 지키는 기술", price: "₩350,000" },
];

export default function Home() {
  return (
    <div>
      <Header />

      {/* 기존의 정적 히어로 섹션이 새로운 슬라이드 컴포넌트로 교체되었습니다. */}
      <HeroSection />
      
      <main className="container max-w-7xl mx-auto px-4">
        <div className="space-y-16 mt-16">
          <ProductSlider title="실시간 베스트" products={systemsData} />
          <ProductSlider title="무료 베스트" products={strategiesData} />
        </div>
      </main>

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

      <YoutubeBanner />

      <GlobalProof />

      <Manifesto />

      <Footer />
    </div>
  );
}