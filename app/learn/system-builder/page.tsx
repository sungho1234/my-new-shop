'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const SystemBuilderLearnPage = () => {
    const { user, purchases } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'materials' | 'notes' | 'support'>('materials');
    const [activeModule, setActiveModule] = useState<number | null>(null);
    const [userNote, setUserNote] = useState('');

    // 구매 여부 확인
    const hasPurchased = purchases.some(p => p.productId === 'system-builder');

    if (!user) {
        return (
            <>
                <Header />
                <div className="w-full bg-white pb-20 text-center py-40">
                    <p className="text-lg text-gray-700">로그인이 필요한 서비스입니다.</p>
                    <button
                        onClick={() => router.push('/login')}
                        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                        로그인하기
                    </button>
                </div>
                <Footer />
            </>
        );
    }

    if (!hasPurchased) {
        return (
            <>
                <Header />
                <div className="w-full bg-white pb-20 text-center py-40">
                    <p className="text-lg text-gray-700">구매한 콘텐츠만 학습하실 수 있습니다.</p>
                    <button
                        onClick={() => router.push('/products/g2')}
                        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                        상품 페이지로 이동
                    </button>
                </div>
                <Footer />
            </>
        );
    }

    const learningModules = [
        {
            id: 1,
            title: '기레스 선택 가이드 & 보안 체크리스트',
            type: 'PDF',
            size: '2.4MB',
            pages: '15페이지',
            description: '안전하고 효율적인 거래소를 선택하는 기준을 제시하는 체크리스트입니다. 보안, 수수료, 기능 등 실전 트레이더가 반영해서 검증된 선택 기준을 담았습니다.',
        },
        {
            id: 2,
            title: '프로의 차트 셋업 전략 & 실전 세팅법',
            type: 'PDF',
            size: '3.1MB',
            pages: '22페이지',
            description: '우리 팀이 데이터를 분석할 때 어떤 가능을, 왜 사용하는지에 대한 관점이 담긴 셋업 가이드입니다. 정보의 홍수 속에서 \'버리는 기준\'을 알려드립니다.',
        },
        {
            id: 3,
            title: '퀀트 투자 핵심 용어집',
            type: 'PDF',
            size: '1.8MB',
            pages: '18페이지',
            description: '단순한 용어 정리가 아닌, 우리 팀이 실전에서 이 용어를 어떻게 해석하고 활용하는지에 대한 관점을 담은 실전 용어집입니다. (핵심용어 15개)',
        },
    ];

    const renderMaterialsTab = () => (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">유성준님, 환영합니다!</h2>
                <p className="text-gray-700">구매하신 콘텐츠의 학습 자료를 확인하세요</p>
            </div>

            {/* 학습 진행률 */}
            <div className="bg-white rounded-xl p-6 border">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900">학습 진행 중</h3>
                    <span className="text-sm text-blue-600 font-semibold">1 / 3 모듈 완료</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div className="bg-blue-600 h-3 rounded-full" style={{ width: '33%' }}></div>
                </div>
            </div>

            {/* 모듈 목록 */}
            <div className="bg-white rounded-xl p-6 border">
                <h3 className="text-lg font-bold text-gray-900 mb-4">모듈 목록</h3>
                <div className="space-y-4">
                    {learningModules.map((module, index) => (
                        <div
                            key={module.id}
                            className={`border rounded-xl p-5 ${activeModule === index ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-200'}`}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                    activeModule === index ? 'bg-blue-200' : 'bg-white'
                                }`}>
                                    {module.type === 'PDF' ? (
                                        <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                                        </svg>
                                    )}
                                </div>
                                <div className="flex-grow">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <span className="text-xs font-medium text-blue-600 mb-1 block">MODULE 0{index + 1}</span>
                                            <h4 className="text-base font-bold text-gray-900">{module.title}</h4>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3">{module.description}</p>
                                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                                        <span>{module.type} · {module.size} · {module.pages}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setActiveModule(activeModule === index ? null : index)}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            열람하기
                                        </button>
                                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                            다운로드
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 트레이딩뷰 레이아웃 즉시 적용 섹션 */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-green-200 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                    </div>
                    <div className="flex-grow">
                        <h4 className="text-lg font-bold text-gray-900 mb-2">트레이딩뷰 레이아웃 즉시 적용</h4>
                        <p className="text-sm text-gray-700 mb-2">공유 링크 · 원클릭 세팅</p>
                        <p className="text-sm text-gray-600 mb-4">
                            클릭 한 번으로 당신의 트레이딩뷰 차트를 프로 트레이더의 표준 레이아웃(이평선, 지표 등)으로 즉시 변경됩니다.
                        </p>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
                                <span className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    레이아웃 적용하기
                                </span>
                            </button>
                            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                                <span className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    링크 복사
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ 섹션 */}
            <div className="bg-white rounded-xl p-6 border">
                <h3 className="text-lg font-bold text-gray-900 mb-4">자주 묻는 질문</h3>
                <div className="space-y-4">
                    <div className="border-b pb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Q. PDF 자료는 몇 번까지 다운로드할 수 있나요?</h4>
                        <p className="text-sm text-gray-600">구매하신 자료는 제한 없이 다운로드하실 수 있습니다. 단만, 저작권 보호를 위해 재배포는 금지되어 있습니다.</p>
                    </div>
                    <div className="border-b pb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Q. 트레이딩뷰 레이아웃은 어떻게 적용하나요?</h4>
                        <p className="text-sm text-gray-600">"레이아웃 적용하기" 버튼을 클릭하시면 트레이딩뷰 웹사이트로 이동하며, 로그인 후 자동으로 레이아웃이 적용됩니다.</p>
                    </div>
                    <div className="pb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Q. 환불 정책은 어떻게 되나요?</h4>
                        <p className="text-sm text-gray-600">디지털 콘텐츠 특성상 다운로드 또는 열람 후에는 환불이 불가능합니다. 구매 전 상품 설명을 꼼꼼히 확인해주세요.</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderNotesTab = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border">
                <h3 className="text-lg font-bold text-gray-900 mb-4">내 노트</h3>
                <div className="mb-6">
                    <textarea
                        value={userNote}
                        onChange={(e) => setUserNote(e.target.value)}
                        placeholder="학습 중 중요한 내용이나 인사이트를 기록해보세요..."
                        className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                    <button className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                        <span className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                            </svg>
                            노트 저장
                        </span>
                    </button>
                </div>

                <div className="border-t pt-6">
                    <h4 className="font-semibold text-gray-900 mb-3">저장된 노트</h4>
                    <div className="bg-gray-50 rounded-lg p-4 border">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs text-gray-500">2025. 10. 30. 14:23</span>
                            <button className="text-xs text-blue-600 hover:text-blue-700">삭제</button>
                        </div>
                        <p className="text-sm text-gray-700">
                            MODULE 01 학습 완료. 거래소 선택 시 수수료뿐만 아니라 API 안정성과 보안 검사 이력을 확인하는 것이 중요하다는 것을 배웠다. 다음에는 실제로 3-4개 거래소를 체크리스트로 비교 분석해봐야겠다.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderSupportTab = () => (
        <div className="space-y-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 border-2 border-green-200">
                <h3 className="text-xl font-bold text-gray-900 mb-3">현역 트레이더 1:1 기술 지원</h3>
                <p className="text-gray-700 mb-4">
                    이 상품은 1:1 지원이 포함되어 있지 않습니다. 학습 중 궁금한 점이나 기술적 질문이 있으시다면,
                    <span className="font-semibold text-green-700"> "2025 일반인을 위한 시스템 투자 올인원" </span>
                    패키지를 이용하시면 담당 팀원과의 1:1 프라이빗 채널을 통해 직접 피드백을 받으실 수 있습니다.
                </p>
                <div className="bg-white rounded-lg p-4 border border-green-300 mb-4">
                    <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">1:1 지원 포함 여부</label>
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600">지원 기간</span>
                            <span className="text-sm font-semibold text-red-500">-</span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">담당 팀원</label>
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600">담당 팀원</span>
                            <span className="text-sm font-semibold text-red-500">-</span>
                        </div>
                    </div>
                </div>
                <button className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">
                    <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        올인원 패키지 업그레이드
                    </span>
                </button>
            </div>
        </div>
    );

    return (
        <>
            <Header />
            <div className="w-full bg-gray-50 pb-20">
                {/* 상단 breadcrumb */}
                <div className="bg-white border-b">
                    <div className="container mx-auto px-4 max-w-7xl py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="cursor-pointer hover:text-blue-600">홈</span>
                            <span>&gt;</span>
                            <span className="cursor-pointer hover:text-blue-600">My 콘텐츠</span>
                            <span>&gt;</span>
                            <span className="font-semibold text-gray-900">일반인을 위한 첫번째 안내서</span>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 max-w-7xl py-8">
                    {/* 상품 제목과 태그 */}
                    <div className="mb-6">
                        <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full mb-3">
                            학습 진행 중
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">일반인을 위한 첫번째 안내서</h1>
                        <p className="text-gray-600">
                            거레스 선택부터 차트 셋업까지 – 현역 트레이더의 '시작 세팅법'과 '관점'을 당신의 모니터에 복사해 드립니다.
                        </p>
                        <div className="flex gap-4 mt-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>구매일: 2025. 10. 30.</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span>총 3개 모듈</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>예상 학습 시간: 3-4시간</span>
                            </div>
                        </div>
                    </div>

                    {/* 탭 네비게이션 */}
                    <div className="bg-white rounded-xl shadow-sm border mb-6">
                        <nav className="flex border-b">
                            <button
                                onClick={() => setActiveTab('materials')}
                                className={`flex-1 px-6 py-4 text-base font-semibold transition-colors ${
                                    activeTab === 'materials'
                                        ? 'text-blue-600 border-b-2 border-blue-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                학습 자료
                            </button>
                            <button
                                onClick={() => setActiveTab('notes')}
                                className={`flex-1 px-6 py-4 text-base font-semibold transition-colors ${
                                    activeTab === 'notes'
                                        ? 'text-blue-600 border-b-2 border-blue-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                내 노트
                            </button>
                            <button
                                onClick={() => setActiveTab('support')}
                                className={`flex-1 px-6 py-4 text-base font-semibold transition-colors ${
                                    activeTab === 'support'
                                        ? 'text-blue-600 border-b-2 border-blue-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                1:1 지원
                            </button>
                        </nav>

                        <div className="p-6">
                            {activeTab === 'materials' && renderMaterialsTab()}
                            {activeTab === 'notes' && renderNotesTab()}
                            {activeTab === 'support' && renderSupportTab()}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default SystemBuilderLearnPage;
