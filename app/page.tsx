import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductSlider from "@/components/ProductSlider";
import YoutubeBanner from "@/components/YoutubeBanner";
import Manifesto from "@/components/Manifesto";
import GlobalProof from "@/components/GlobalProof";
import HeroSection from "@/components/HeroSection"; // 새로 만든 HeroSection 컴포넌트를 가져옵니다.

// systemsData와 strategiesData는 그대로 유지됩니다.
const systemsData = [
  { imgSrc: "https://via.placeholder.com/300x400/F3F4F6/9CA3AF?text=MAXX+%ED%80%88%ED%8A%B8+%EC%8B%9C%EC%8A%A4%ED%85%9C+v4.0", title: "MAXX 퀀트 시스템 v4.0", desc: "24/7 완전 자동매매", price: "0.5 ETH", href: '/products/maxx-quant-v4' },
  { imgSrc: "https://via.placeholder.com/300x400/F3F4F6/9CA3AF?text=%ED%80%88%ED%8A%B8+%EC%8B%9C%EC%8A%A4%ED%85%9C+Lite", title: "퀀트 시스템 Lite", desc: "입문자용 자동매매", price: "0.2 ETH" },
  { imgSrc: "https://via.placeholder.com/300x400/F3F4F6/9CA3AF?text=%ED%80%88%ED%8A%B8+%EC%8B%9C%EC%8A%A4%ED%85%9C+Pro", title: "퀀트 시스템 Pro", desc: "전문가용 고급 기능", price: "1.0 ETH" },
];

const strategiesData = [
  { imgSrc: "https://via.placeholder.com/300x400/CA8A04/FFFFFF?text=Strategy+Guide", title: "퀀트 시스템 120% 활용법", desc: "시스템 핵심 전략 VOD", price: "₩550,000" },
  { imgSrc: "https://via.placeholder.com/300x400/CA8A04/FFFFFF?text=Risk+Mgmt", title: "리스크 관리 전략", desc: "계좌를 지키는 기술", price: "₩350,000" },
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