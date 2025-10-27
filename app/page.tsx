import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductSlider from "@/components/ProductSlider";
import YoutubeBanner from "@/components/YoutubeBanner";
import Manifesto from "@/components/Manifesto";
import GlobalProof from "@/components/GlobalProof";
import HeroSection from "@/components/HeroSection"; // 새로 만든 HeroSection 컴포넌트를 가져옵니다.

// systemsData와 strategiesData는 그대로 유지됩니다.
const systemsData = [
  { imgSrc: "https://via.placeholder.com/300x400/F3F4F6/9CA3AF?text=MAXX+%ED%80%88%ED%8A%B8+%EC%8B%9C%EC%8A%A4%ED%85%9C+v4.0", title: "2025 일반인을 위한 시스템 투자 올인원", desc: "⭐4.8 ㅣ 구매 280명", price: "210,000원", href: '/products/g1' },
  { imgSrc: "https://via.placeholder.com/300x400/F3F4F6/9CA3AF?text=%ED%80%88%ED%8A%B8+%EC%8B%9C%EC%8A%A4%ED%85%9C+Lite", title: "일반인을 위한 첫번째 안내서: 거래소 선택부터 차트 셋업까지", desc: "⭐4.8 ㅣ 구매 280명", price: "70,000원", href: '/products/g2' },
  { imgSrc: "https://via.placeholder.com/300x400/F3F4F6/9CA3AF?text=%ED%80%88%ED%8A%B8+%EC%8B%9C%EC%8A%A4%ED%85%9C+Pro", title: "일반인의 성장책: 스캠필터와 챌린지", desc: "⭐4.8 ㅣ 구매 280명", price: "60,000원", href: '/products/g3'  },
];

const strategiesData = [
  { imgSrc: "https://via.placeholder.com/300x400/CA8A04/FFFFFF?text=Strategy+Guide", title: "시스템 빌더 풀 패키지: 실행 엔진, 1:1 지원, 멤버십 키 ", desc: "⭐4.8 ㅣ 구매 280명", price: "₩55,000", href: '/products/c1' },
  { imgSrc: "https://via.placeholder.com/300x400/CA8A04/FFFFFF?text=Risk+Mgmt", title: "프로의 전략 원본: 시스템 설계도와 데이터 분석 ", desc: "⭐4.8 ㅣ 구매 280명", price: "₩350,000", href: '/products/c2' },
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

      <section className="w-full bg-gray-100 py-24 mt-16">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <h4 className="text-lg font-bold">결과로 증명합니다</h4>
              <p className="mt-2 text-sm text-gray-600">우리의 유일한 증명은 '계좌'입니다. 모든 전략과 기술은 실제 데이터와 수익률로 검증되었습니다.</p>
            </div>
            <div>
              <h4 className="text-lg font-bold">예측하지 않고 설계합니다</h4>
              <p className="mt-2 text-sm text-gray-600">우리는 단기적인 수익률(벽돌)이 아닌, 지속 가능한 수익 시스템(설계도)의 기술을 제공합니다.</p>
            </div>
            <div>
              <h4 className="text-lg font-bold">'감'의 영역을 넘어</h4>
              <p className="mt-2 text-sm text-gray-600">당신의 트레이딩을 '감'의 영역에서 '데이터 엔지니어링'의 영역으로 바꿔드립니다. 자신만의 '원칙'과 '시스템'을 갖게 될 것입니다.</p>
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