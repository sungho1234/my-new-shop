import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductSlider from "@/components/ProductSlider";
import YoutubeBanner from "@/components/YoutubeBanner"; // 유튜브 배너 import

// 데이터 부분은 보내주신 파일 그대로 유지됩니다.
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

const toolsData = [
  { imgSrc: "https://via.placeholder.com/300x400/16A34A/FFFFFF?text=Entry+Signal", title: "MAXX Entry Signal", desc: "명확한 매수/매도 알림", price: "₩300,000" },
  { imgSrc: "https://via.placeholder.com/300x400/16A34A/FFFFFF?text=Trend+Follower", title: "트렌드 추종 지표", desc: "추세의 시작과 끝", price: "₩250,000" },
  { imgSrc: "https://via.placeholder.com/300x400/16A34A/FFFFFF?text=Volatility", title: "변동성 스캐너", desc: "기회가 있는 곳을 포착", price: "₩250,000" },
  { imgSrc: "https://via.placeholder.com/300x400/16A34A/FFFFFF?text=S/R+Zone", title: "지지/저항 자동 작도", desc: "핵심 가격대 시각화", price: "₩350,000" },
  { imgSrc: "https://via.placeholder.com/300x400/16A34A/FFFFFF?text=Volume+Profile", title: "매물대 분석 지표", desc: "세력의 흔적 찾기", price: "₩400,000" },
];

export default function Home() {
  return (
    <>
      <Header />

      <section className="w-full bg-slate-100">
        <div className="container mx-auto flex h-[450px] items-center px-4">
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
              부담없이 즐기는<br />
              상위 1% 지식
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              [이달의 무료 전자책 보러가기] →
            </p>
          </div>
        </div>
      </section>
      
      {/* 1. 회색 배너 위의 콘텐츠 */}
      <main className="container max-w-7xl mx-auto px-4">
        <div className="space-y-16 mt-16">
          <ProductSlider title="실시간 베스트" products={systemsData} />
          <ProductSlider title="무료 베스트" products={strategiesData} />
        </div>
      </main>

      {/* 2. 전체 너비로 확장된 회색 배너 */}
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

      {/* --- 수정된 부분: 유튜브 배너를 회색 배너 바로 아래에 추가 --- */}
      <YoutubeBanner />

      {/* 3. 나머지 콘텐츠 */}
      <main className="container max-w-7xl mx-auto px-4">
        <div className="mt-16">
          <ProductSlider title="PRECISION TOOLS : 정확한 데이터로 승률을 높이는 보조 지표" products={toolsData} />
        </div>
      </main>

      <Footer />
    </>
  );
}