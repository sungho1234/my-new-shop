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
    const [activeModule, setActiveModule] = useState<number>(1);
    const [userNote, setUserNote] = useState('');
    const [savedNotes, setSavedNotes] = useState([
        {
            id: 1,
            content: 'MODULE 01 학습 완료. 거래소 선택 시 수수료뿐만 아니라 API 안정성과 보안 감사 이력을 확인하는 것이 중요하다는 것을 배웠다. 다음에는 실제로 3-4개 거래소를 체크리스트로 비교 분석해봐야겠다.',
            createdAt: '2025. 10. 30. 14:23'
        }
    ]);

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

    const modules = [
        { id: 1, number: 'MODULE 01', name: '원론집: 거래소 & 차트 셋업', completed: true },
        { id: 2, number: 'MODULE 02', name: '지식 심화: 퀀트 투자 용어집', completed: false },
        { id: 3, number: 'MODULE 03', name: '도구 세팅: 트레이딩뷰 레이아웃', completed: false },
    ];

    const learningResources = [
        {
            id: 1,
            type: 'pdf',
            icon: 'DocumentText',
            name: '거래소 선택 가이드 & 보안 체크리스트',
            meta: 'PDF · 2.4MB · 15페이지',
            description: '안전하고 효율적인 거래소를 선택하는 기준을 제시하는 체크리스트입니다. 보안, 수수료, 기능 등 실전 트레이더 관점에서 검증된 선택 기준을 담았습니다.',
        },
        {
            id: 2,
            type: 'pdf',
            icon: 'ChartBar',
            name: '프로의 차트 셋업 철학 & 실전 세팅법',
            meta: 'PDF · 3.1MB · 22페이지',
            description: '우리 팀이 데이터를 분석할 때 어떤 기능을, 왜 사용하는지에 대한 관점이 담긴 셋업 가이드입니다. 정보의 홍수 속에서 \'버리는 기준\'을 알려드립니다.',
        },
        {
            id: 3,
            type: 'pdf',
            icon: 'BookOpen',
            name: '퀀트 투자 핵심 용어집',
            meta: 'PDF · 1.8MB · 18페이지',
            description: '단순한 용어 정의가 아닌, 우리 팀이 실전에서 이 용어를 어떻게 해석하고 활용하는지에 대한 관점을 담은 실전 용어집입니다. (핵심용어 15개)',
        },
        {
            id: 4,
            type: 'link',
            icon: 'Link',
            name: '트레이딩뷰 레이아웃 즉시 적용',
            meta: '공유 링크 · 원클릭 세팅',
            description: '클릭 한 번으로 당신의 트레이딩뷰 차트가 프로 트레이더의 표준 레이아웃(이평선, 지표 등)으로 즉시 변경됩니다.',
            special: true,
        },
    ];

    const completedModules = modules.filter(m => m.completed).length;
    const progressPercent = (completedModules / modules.length) * 100;

    const handleSaveNote = () => {
        if (userNote.trim()) {
            const newNote = {
                id: Date.now(),
                content: userNote,
                createdAt: new Date().toLocaleString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                }).replace(/\. /g, '. ')
            };
            setSavedNotes([newNote, ...savedNotes]);
            setUserNote('');
            alert('노트가 저장되었습니다.');
        }
    };

    const handleDeleteNote = (id: number) => {
        if (confirm('이 노트를 삭제하시겠습니까?')) {
            setSavedNotes(savedNotes.filter(note => note.id !== id));
        }
    };

    const renderIcon = (iconName: string, special: boolean = false) => {
        const colorClass = special ? 'text-green-600' : 'text-blue-600';

        switch (iconName) {
            case 'DocumentText':
                return (
                    <svg className={`w-6 h-6 ${colorClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                );
            case 'ChartBar':
                return (
                    <svg className={`w-6 h-6 ${colorClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                );
            case 'BookOpen':
                return (
                    <svg className={`w-6 h-6 ${colorClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                );
            case 'Link':
                return (
                    <svg className={`w-6 h-6 ${colorClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                );
            default:
                return null;
        }
    };

    const renderMaterialsTab = () => (
        <div className="space-y-6">
            {learningResources.map((resource) => (
                <div
                    key={resource.id}
                    className={`rounded-xl p-7 border transition-all duration-300 cursor-pointer ${
                        resource.special
                            ? 'bg-green-50 border-green-200 hover:border-green-300 hover:shadow-lg'
                            : 'bg-gray-50 border-gray-200 hover:border-blue-300 hover:bg-white hover:shadow-lg hover:-translate-y-0.5'
                    }`}
                >
                    <div className="flex gap-4 mb-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 border ${
                            resource.special
                                ? 'bg-green-100 border-green-200'
                                : 'bg-blue-50 border-blue-200'
                        }`}>
                            {renderIcon(resource.icon, resource.special)}
                        </div>
                        <div className="flex-grow">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{resource.name}</h3>
                            <p className="text-sm text-gray-600">{resource.meta}</p>
                        </div>
                    </div>
                    <p className="text-gray-600 text-base leading-relaxed mb-5">{resource.description}</p>
                    <div className="flex gap-3">
                        {resource.special ? (
                            <>
                                <button className="inline-flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-all hover:-translate-y-0.5 hover:shadow-lg">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    레이아웃 적용하기
                                </button>
                                <button className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    링크 복사
                                </button>
                            </>
                        ) : (
                            <>
                                <button className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-all hover:-translate-y-0.5 hover:shadow-lg">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    열람하기
                                </button>
                                <button className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    다운로드
                                </button>
                            </>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );

    const renderNotesTab = () => (
        <div className="space-y-8">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">학습 노트 작성</h3>
                <textarea
                    value={userNote}
                    onChange={(e) => setUserNote(e.target.value)}
                    placeholder="학습 중 중요한 내용이나 인사이트를 기록해보세요...

예시:
- 거래소 선택 시 유동성 지표가 생각보다 중요하다는 것을 알게 됨
- 보조지표를 3개 이하로 유지하는 것이 집중력에 도움이 됨
- 다음에 실전 적용 시 리스크 관리 부분을 먼저 체크해야겠음"
                    className="w-full min-h-[120px] bg-white border border-gray-300 rounded-lg p-4 text-gray-900 text-base resize-y focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
                <button
                    onClick={handleSaveNote}
                    className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-all"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    노트 저장
                </button>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">저장된 노트</h3>
                <div className="space-y-4">
                    {savedNotes.map((note) => (
                        <div key={note.id} className="bg-white border border-gray-200 rounded-lg p-5">
                            <div className="flex justify-between items-start mb-3">
                                <span className="text-sm text-gray-500">{note.createdAt}</span>
                                <button
                                    onClick={() => handleDeleteNote(note.id)}
                                    className="text-xs px-3 py-1.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    삭제
                                </button>
                            </div>
                            <p className="text-gray-700 text-base leading-relaxed">{note.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderSupportTab = () => (
        <div className="space-y-8">
            <div className="bg-green-50 border border-green-200 rounded-xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-3">현역 트레이더 1:1 기술 지원</h3>
                <p className="text-gray-700 text-base leading-relaxed mb-6">
                    이 상품은 1:1 지원이 포함되어 있지 않습니다. 학습 중 궁금한 점이나 기술적 질문이 있으시다면,{' '}
                    <span className="font-bold text-green-700">"2025 일반인을 위한 시스템 투자 올인원"</span> 패키지를 이용하시면
                    담당 팀원과의 1:1 프라이빗 채널을 통해 직접 피드백을 받으실 수 있습니다.
                </p>

                <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 space-y-3">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                        <span className="text-sm text-gray-600">1:1 지원 포함 여부</span>
                        <span className="text-sm font-semibold text-red-500">미포함</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                        <span className="text-sm text-gray-600">지원 기간</span>
                        <span className="text-sm font-semibold text-gray-900">-</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">담당 팀원</span>
                        <span className="text-sm font-semibold text-gray-900">-</span>
                    </div>
                </div>

                <button className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    올인원 패키지 업그레이드
                </button>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-5">자주 묻는 질문</h3>
                <div className="space-y-4">
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-7">
                        <h4 className="text-base font-semibold text-gray-900 mb-3">Q. PDF 자료는 몇 번까지 다운로드할 수 있나요?</h4>
                        <p className="text-gray-600 text-base leading-relaxed">구매하신 자료는 제한 없이 다운로드하실 수 있습니다. 다만, 저작권 보호를 위해 재배포는 금지되어 있습니다.</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-7">
                        <h4 className="text-base font-semibold text-gray-900 mb-3">Q. 트레이딩뷰 레이아웃은 어떻게 적용하나요?</h4>
                        <p className="text-gray-600 text-base leading-relaxed">"레이아웃 적용하기" 버튼을 클릭하시면 트레이딩뷰 웹사이트로 이동하며, 로그인 후 자동으로 레이아웃이 적용됩니다.</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-7">
                        <h4 className="text-base font-semibold text-gray-900 mb-3">Q. 환불 정책은 어떻게 되나요?</h4>
                        <p className="text-gray-600 text-base leading-relaxed">디지털 콘텐츠 특성상 다운로드 또는 열람 후에는 환불이 불가능합니다. 구매 전 상품 설명을 꼼꼼히 확인해주세요.</p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <Header />
            <div className="w-full bg-gray-50 min-h-screen">
                {/* Hero Banner */}
                <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)' }} className="text-white text-center py-12">
                    <h1 className="text-3xl font-bold mb-2">{user.nickname}님, 환영합니다!</h1>
                    <p className="text-base opacity-90">구매하신 콘텐츠의 학습 자료를 확인하세요</p>
                </div>

                <div className="container mx-auto px-4 max-w-7xl py-8">
                    {/* Breadcrumb */}
                    <div className="bg-white border border-gray-200 rounded-lg px-6 py-4 mb-8">
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-600 cursor-pointer hover:text-gray-900">홈</span>
                            <span className="text-gray-400">›</span>
                            <span className="text-gray-600 cursor-pointer hover:text-gray-900">My 콘텐츠</span>
                            <span className="text-gray-400">›</span>
                            <span className="text-gray-900 font-semibold">일반인을 위한 첫번째 안내서</span>
                        </div>
                    </div>

                    {/* Course Header */}
                    <div className="bg-white border border-gray-200 rounded-xl p-10 mb-8 shadow-sm">
                        <div className="inline-block px-4 py-2 bg-blue-50 text-blue-700 text-sm font-semibold rounded-full mb-4">
                            학습 진행 중
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-3">일반인을 위한 첫번째 안내서</h1>
                        <p className="text-lg text-gray-600 mb-6">
                            거래소 선택부터 차트 셋업까지 - 현역 트레이더의 '시작 세팅법'과 '관점'을 당신의 모니터에 복사해 드립니다.
                        </p>
                        <div className="flex items-center gap-8 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>구매일: 2025. 10. 30.</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span>총 3개 모듈</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>예상 학습 시간: 3-4시간</span>
                            </div>
                        </div>
                    </div>

                    {/* Main Grid Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
                        {/* Sidebar */}
                        <aside className="space-y-4">
                            {/* Progress Card */}
                            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">학습 진행률</div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                                    <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
                                </div>
                                <div className="text-sm font-semibold text-gray-900">{completedModules} / {modules.length} 모듈 완료</div>
                            </div>

                            {/* Module Navigation */}
                            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 mb-4">모듈 목록</div>
                                <div className="space-y-2">
                                    {modules.map((module) => (
                                        <button
                                            key={module.id}
                                            onClick={() => setActiveModule(module.id)}
                                            className={`w-full text-left px-4 py-3.5 rounded-lg border transition-all ${
                                                activeModule === module.id
                                                    ? 'bg-blue-50 border-blue-200'
                                                    : 'border-transparent hover:bg-gray-100 hover:border-gray-200'
                                            }`}
                                        >
                                            <div className="text-xs text-gray-500 mb-1">{module.number}</div>
                                            <div className="text-sm font-medium text-gray-900">{module.name}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </aside>

                        {/* Main Content */}
                        <main className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                            {/* Tab Navigation */}
                            <nav className="bg-gray-50 border-b border-gray-200 flex">
                                <button
                                    onClick={() => setActiveTab('materials')}
                                    className={`flex-1 px-8 py-5 text-base font-semibold transition-all relative ${
                                        activeTab === 'materials'
                                            ? 'text-gray-900 bg-white'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                                >
                                    학습 자료
                                    {activeTab === 'materials' && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                                    )}
                                </button>
                                <button
                                    onClick={() => setActiveTab('notes')}
                                    className={`flex-1 px-8 py-5 text-base font-semibold transition-all relative ${
                                        activeTab === 'notes'
                                            ? 'text-gray-900 bg-white'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                                >
                                    내 노트
                                    {activeTab === 'notes' && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                                    )}
                                </button>
                                <button
                                    onClick={() => setActiveTab('support')}
                                    className={`flex-1 px-8 py-5 text-base font-semibold transition-all relative ${
                                        activeTab === 'support'
                                            ? 'text-gray-900 bg-white'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                                >
                                    1:1 지원
                                    {activeTab === 'support' && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                                    )}
                                </button>
                            </nav>

                            {/* Tab Content */}
                            <div className="p-10">
                                {activeTab === 'materials' && renderMaterialsTab()}
                                {activeTab === 'notes' && renderNotesTab()}
                                {activeTab === 'support' && renderSupportTab()}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default SystemBuilderLearnPage;
