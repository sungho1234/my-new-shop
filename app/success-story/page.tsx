import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function SuccessStoryPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container max-w-3xl mx-auto px-6 py-20">
        {/* 메인 타이틀 */}
        <div className="mb-20 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            [수강생 성공 사례관]
          </h1>
          <p className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2">
            "안정적인 32%수익률, 데이터'로 장학금 벌고 있습니다."
          </p>
          <p className="text-lg text-gray-600">
            - 25세 대학생의 '시스템 투자 올인원' 실전 후기
          </p>
        </div>

        {/* #1. 수강생 소개 */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900">#1.</h2>
            <h2 className="text-2xl font-bold text-gray-900">수강생 소개</h2>
            <div className="w-16 h-0.5 bg-gray-900 mx-auto mt-4"></div>
          </div>

          <div className="space-y-12">
            {/* 이미지 공간 1 */}
            <div className="relative w-full aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-400 text-base">이미지 공간</p>
              </div>
            </div>

            {/* Q&A 1 */}
            <div className="py-8">
              <p className="text-lg font-bold text-gray-900 mb-6">
                Q. 간단한 자기소개 부탁드립니다.
              </p>
              <p className="text-gray-700 leading-relaxed text-base">
                A. 안녕하세요. 저는 서울 소재 대학교에서 상경계열을 전공하고 있는 25살 대학생 김민재입니다.
                전역 후에 학교 다니면서 학비랑 용돈 벌려고 편의점이랑 학원 알바를 병행하고 있었고요.
                코인은 군대 전역하고 친구들 따라서 시작했는데, 리딩방에 속아서 많은 돈을 내고도 이상한 정보에 빠져
                소위 말하는 알트코인들을 사다가 군적금을 날려먹은 경험이 있었습니다.
                사실 그당시에는 리딩방이나 돈버는 방법 이런것에는 쳐다도 안볼생각이었어요.
              </p>
            </div>

            {/* Q&A 2 */}
            <div className="py-8">
              <p className="text-lg font-bold text-gray-900 mb-6">
                Q. 대학생에게는 약간 적지 않은 금액인데, 올인원 패키지를 결제한 이유가 있을까요?
              </p>
              <p className="text-gray-700 leading-relaxed text-base">
                A. 솔직히 처음엔 과거 기억떄문에 망설였습니다. 그런데 리디방처럼 무조건적인 수익률을 약속하지 않았고,
                여러 후기와 해외 트레이더의 에세이 등을 보니 시스템 투자라는 여러 지식을 알수 있는 기회라고 생각이 들면서 신뢰감이 생겼습니다.
                또한 퀀트투자에 흥미가 생겼는데, 제가 개발도 모르고 전문적인 지식이 있는것도 아니라서 멘토가 절실한 상황이었어요.
                근데 올인원 패키지에서는 현역 팀원 중 한명을 매칭해준다고 하여서 이 패키지를 선택하게 되었습니다.
                실제로 그때그때 제가 시스템을 빌딩할 때 피드백을 받을 수 있어서 많은 도움이 되었습니다.
              </p>
            </div>
          </div>
        </section>

        {/* #2. 시스템 도입 후의 성과 */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900">#2.</h2>
            <h2 className="text-2xl font-bold text-gray-900">시스템 도입 후의 성과</h2>
            <div className="w-16 h-0.5 bg-gray-900 mx-auto mt-4"></div>
          </div>

          <div className="space-y-12">
            {/* 이미지 공간 2 */}
            <div className="relative w-full aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-400 text-base">이미지 공간</p>
              </div>
            </div>

            {/* Q&A 1 */}
            <div className="py-8">
              <p className="text-lg font-bold text-gray-900 mb-6">
                Q. 시스템(올인원) 도입 후, 삶이 어떻게 달라졌나요?
              </p>
              <p className="text-gray-700 leading-relaxed text-base">
                A. 가장 큰 변화는 시간적인 여유인 것 같습니다. 예전에는 수업 시간에도 몰래 차트 보느라 교수님 눈치 보고,
                밤에는 잠 설쳐서 학교 가면 졸기 바빴거든요. 그런데 이 시스템을 도입하고 나서는 '기계적으로' 매매가 자동화 됩니다.
                수익이 알바비보다 안정적으로 나오기 시작하니까 굳이 시간을 팔아서 돈을 벌 필요가 없어졌어요.
                지금은 트레이딩 수익으로 생활비 충당하고, 남는 시간엔 학업이랑 취업 준비에 집중하고 있습니다.
              </p>
            </div>

            {/* Q&A 2 */}
            <div className="py-8">
              <p className="text-lg font-bold text-gray-900 mb-6">
                Q. 구체적인 수치 변화가 있었나요?
              </p>
              <p className="text-gray-700 leading-relaxed text-base">
                A. 승률의 기복이 사라졌습니다. 예전엔 운 좋으면 50% 벌고, 운 나쁘면 -74%였는데,
                지금은 제공해주신 설계도를 공부하고, 팀원분의 도움과 함께 저의 시스템을 구축하고 나니까 손익비가 일정하게 유지돼요.
                무엇보다 '스캠 필터링' 덕분에 이상한 정보에 휩쓸리거나, 해킹당한 횟수가 '0회'가 됐습니다.
                이게 대학생인 저한테는 돈 버는 것보다 더 중요했어요. 시드머니 지키는 게 제일 힘드니까요.
              </p>
            </div>
          </div>
        </section>

        {/* #3. 학습 효과와 효율성 */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900">#3.</h2>
            <h2 className="text-2xl font-bold text-gray-900">학습 효과와 효율성</h2>
            <div className="w-16 h-0.5 bg-gray-900 mx-auto mt-4"></div>
          </div>

          <div className="space-y-12">
            {/* 이미지 공간 3 */}
            <div className="relative w-full aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-400 text-base">이미지 공간</p>
              </div>
            </div>

            {/* Q&A 1 */}
            <div className="py-8">
              <p className="text-lg font-bold text-gray-900 mb-6">
                Q. 강의 내용 중 가장 좋았던 점은 무엇인가요?
              </p>
              <p className="text-gray-700 leading-relaxed text-base">
                A. "과제집"과 '1:1 멘토링'이요. 아예 퀀트투자를 모르는 지식 0 부터 시작했는데,
                그 이후 저만의 시스템 투자로 변화하고, 퀀트에 대해서 지식을 습득할 때 "과제집"을 활용해서 빠르게 적응할 수 있었습니다.
                또한 이 과제를 진행하면서 저만의 시스템 투자를 구축할 때 1:1 멘토링이 저한테는 필수적 이었어요.
                멘토링 때 제가 멍청한 질문을 해도 "엘리트 상사가 후배 코칭하듯" 진짜 꼼꼼하게 답변해 주셨어요.
                단순히 "이게 이거에요"가 아니라 "이 데이터 때문에 이 자리와 정보는 위험합니다"라고 논리적으로 설명해 주시니까,
                저도 스스로 판단하는 눈이 생기더라고요.
              </p>
            </div>

            {/* Q&A 2 */}
            <div className="py-8">
              <p className="text-lg font-bold text-gray-900 mb-6">
                Q. '시스템 빌더'가 된다는 게 어떤 의미인가요?
              </p>
              <p className="text-gray-700 leading-relaxed text-base">
                A. 게임으로 치면 나만의 '공략집' 을 만들어두고 플레이하는 느낌이에요.
                예전엔 맨땅에 헤딩하면서 '감'으로 게임을 했다면,
                지금은 프로들이 만들어놓은 '설계도(공략집)'를 활용하고, 이것을 저만의 시스템으로 바꾼 후 하니까 레벨업이 엄청 빨라요.
                제가 뭘 모르고 있는지조차 몰랐는데, 이제는 제가 실제 증권사에서 트레이더들이 사용하는 '시스템'을 이해하고 응용하고 있다는 느낌이 듭니다.
              </p>
            </div>
          </div>
        </section>

        {/* #4. 구매후 관점 */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900">#4.</h2>
            <h2 className="text-2xl font-bold text-gray-900">구매후 관점</h2>
            <div className="w-16 h-0.5 bg-gray-900 mx-auto mt-4"></div>
          </div>

          <div className="space-y-12">
            {/* 이미지 공간 4 */}
            <div className="relative w-full aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-400 text-base">이미지 공간</p>
              </div>
            </div>

            {/* Q&A 1 */}
            <div className="py-8">
              <p className="text-lg font-bold text-gray-900 mb-6">
                Q. 비슷한 상황에서 구매를 망설이는 분들에게 조언해주신다면?
              </p>
              <p className="text-gray-700 leading-relaxed text-base">
                A. 음… 사실 코인선물, 해외선물 등 파생상품은 도박이다, 퀀트투자나 데이터기반 분석하는 투자는 다 뻥이다 말이 안된다.
                이런사람들이 근처에 많거든요.
                <br /><br />
                하지만 현재 여의도 증권사에서 자상운용팀, 프랍 트레이더들 등 데이터와 지식을 가지고 투자를 하는 사람들 보고
                도박꾼이라고 하지는 않잖아요. 어떻게보면 그사람들은 다 고스펙, 고연봉에 고학력자들인데….
                <br /><br />
                감으로 투자한다면 도박이 맞지만, 어느정도의 지식과 데이터를 가지고한다면 안정적인 투자라고 생각합니다.
                이 패키지는 그 지식을 가질수 있도록 시간을 단축시켜주는 도구로써 활용해보았으면 좋겠습니다.
              </p>
            </div>
          </div>
        </section>

        {/* #5. 마지막 소감 */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900">#5.</h2>
            <h2 className="text-2xl font-bold text-gray-900">마지막 소감</h2>
            <div className="w-16 h-0.5 bg-gray-900 mx-auto mt-4"></div>
          </div>

          <div className="space-y-12">
            {/* 이미지 공간 5 */}
            <div className="relative w-full aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-400 text-base">이미지 공간</p>
              </div>
            </div>

            {/* Q&A 1 */}
            <div className="py-8">
              <p className="text-lg font-bold text-gray-900 mb-6">
                Q. 본인에게 이번 프로젝트는 어떤 의미인가요?
              </p>
              <p className="text-gray-700 leading-relaxed text-base">
                A. 저에게는 '터닝 포인트'입니다. 이번 경험을 통해서 단순히 용돈 벌이를 넘어서 투자의 관점을 다르게 바꿔주었고,
                '자본을 운용하는 방식'을 배웠어요. 이제 여러 트레이딩 포럼이나 에세이도 이해하기 용이해서 지식의 크기가 넓어졌다고 생각이 듭니다.
                다른사람들 보다 '퀀트'에 눈을 먼저 떠서 앞서가는 느낌이 들며,
                앞으로도 계속 나아갈 것 이라는 확신이 들게 되었습니다.
              </p>
            </div>
          </div>
        </section>

        {/* 추천 상품 섹션 */}
        <div className="mt-20 pt-8 bg-gray-50 -mx-6 px-6 py-10 rounded-2xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-900">김민재님이 수강한 강의</h2>
            <a href="/" className="text-sm text-blue-600 hover:underline">
              전체보기
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 올인원 상품 (G1) */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex gap-5">
                <div className="w-28 h-28 flex-shrink-0">
                  <img src="/g1.png" alt="시스템 투자 올인원" className="w-full h-full object-cover rounded-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <a href="/products/g1" className="block mb-2">
                    <h3 className="text-base font-bold text-gray-900 hover:text-blue-600 transition-colors">
                      일반인을 위한 시스템 투자 올인원
                    </h3>
                  </a>
                  <p className="text-sm text-gray-600 mb-3">kobba</p>
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-yellow-400">⭐</span>
                    <span className="font-medium text-gray-900">4.8</span>
                    <span className="text-gray-400 mx-1">|</span>
                    <span className="text-gray-500">구매 280명</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 시스템 빌더 풀 패키지 (C1) */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex gap-5">
                <div className="w-28 h-28 flex-shrink-0">
                  <img src="/c1.png" alt="시스템 빌더 풀 패키지" className="w-full h-full object-cover rounded-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <a href="/products/c1" className="block mb-2">
                    <h3 className="text-base font-bold text-gray-900 hover:text-blue-600 transition-colors">
                      시스템 빌더 풀 패키지
                    </h3>
                  </a>
                  <p className="text-sm text-gray-600 mb-3">Analyst (Berlin)</p>
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-yellow-400">⭐</span>
                    <span className="font-medium text-gray-900">4.8</span>
                    <span className="text-gray-400 mx-1">|</span>
                    <span className="text-gray-500">구매 280명</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
