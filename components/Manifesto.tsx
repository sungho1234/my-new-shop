import Link from 'next/link';

// 우측 아이콘 영역에 들어갈 SVG 컴포넌트입니다.
// 복잡한 구조를 상징하는 라인 아트 아이콘입니다.
const SystemIcon = () => (
  <svg 
    width="120" 
    height="120" 
    viewBox="0 0 100 100" 
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#3182CE', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#63B3ED', stopOpacity: 0.8 }} />
      </linearGradient>
    </defs>
    <path 
      d="M20,50 L35,35 M35,35 L50,50 M50,50 L35,65 M35,65 L20,50 M50,50 L65,35 M65,35 L80,50 M80,50 L65,65 M65,65 L50,50" 
      stroke="url(#iconGradient)" 
      strokeWidth="2" 
      fill="none" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    <circle cx="20" cy="50" r="3" fill="#A0AEC0" />
    <circle cx="35" cy="35" r="3" fill="#A0AEC0" />
    <circle cx="50" cy="50" r="4" fill="white" />
    <circle cx="35" cy="65" r="3" fill="#A0AEC0" />
    <circle cx="65" cy="35" r="3" fill="#A0AEC0" />
    <circle cx="80" cy="50" r="3" fill="#A0AEC0" />
    <circle cx="65" cy="65" r="3" fill="#A0AEC0" />
  </svg>
);


export default function Manifesto() {
  // 배경 이미지 URL입니다. 고화질의 '퀀트 데스크' 이미지로 교체하세요.
  const backgroundImageUrl = 'https://images.unsplash.com/photo-1611606063065-ee7946f0b343?q=80&w=1974&auto=format&fit=crop';

  return (
    // Link 컴포넌트로 전체를 감싸 클릭 가능한 영역으로 만듭니다.
    <Link href="/getting-started" className="block my-12">
      {/* 2. 전체 레이아웃 및 크기 */}
      <div
        className="relative max-w-7xl mx-auto h-auto md:h-[240px] rounded-2xl overflow-hidden group"
      >
        {/* 3. 배경 스타일 */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-105"
          style={{ backgroundImage: `url(${backgroundImageUrl})` }}
        ></div>
        <div className="absolute inset-0 bg-[rgba(10,20,40,0.7)]"></div>

        {/* 4. 내부 컨텐츠 구조 */}
        <div className="relative h-full flex flex-col md:flex-row items-center justify-center md:justify-start text-center md:text-left p-6 md:p-0 md:pl-16">
          
          {/* 5. 좌측 텍스트 영역 */}
          <div className="w-full md:w-[65%]">
            <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">
              모든 것의 시작: 첫 번째 원칙
            </h2>
            <p className="text-[#A0AEC0] text-base md:text-lg font-medium transition-colors duration-300 group-hover:text-white">
              우리 시스템을 관통하는 핵심 원리부터 확인하기 →
            </p>
          </div>

          {/* 6. 우측 아이콘 영역 (모바일에서는 숨김) */}
          <div className="hidden md:flex w-[35%] h-full justify-center items-center">
            <SystemIcon />
          </div>

        </div>
      </div>
    </Link>
  );
}

