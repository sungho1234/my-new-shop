'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const SystemBuilderLearnPage = () => {
    const { user, purchases } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'materials' | 'action-plan' | 'support'>('materials');
    const [activeModule, setActiveModule] = useState<number>(1);
    const [showNoteEditor, setShowNoteEditor] = useState(false);
    const [selectedNoteType, setSelectedNoteType] = useState<'question' | 'insight' | 'todo' | 'reference'>('question');
    const [noteTitle, setNoteTitle] = useState('');
    const [noteContent, setNoteContent] = useState('');
    const [activeFilter, setActiveFilter] = useState<'all' | 'question' | 'insight' | 'todo' | 'reference'>('all');

    const [checklist, setChecklist] = useState([
        { id: 1, title: '거래소 선택 가이드 PDF 다운로드', completed: true, completedAt: '2025. 10. 30. 14:20' },
        { id: 2, title: '차트 셋업 철학 문서 읽기', completed: true, completedAt: '2025. 10. 30. 15:10' },
        { id: 3, title: '트레이딩뷰 레이아웃 실제 적용해보기', completed: false, completedAt: null },
        { id: 4, title: '거래소 3곳 체크리스트로 비교 분석', completed: false, completedAt: null },
        { id: 5, title: '핵심 용어 15개 복습 및 암기', completed: false, completedAt: null },
    ]);

    const [notes, setNotes] = useState([
        {
            id: 1,
            type: 'question' as const,
            title: 'API 안정성 99.9%의 실제 의미는?',
            content: '거래소 선택 가이드에서 API 안정성 99.9% 이상을 권장한다고 나와있는데, 실제로 이게 어느 정도 수준인지 감이 안 온다. 다운타임이 연간 며칠 정도인지, 실전 트레이딩할 때 체감이 어떤지 궁금함.',
            createdAt: '2025. 10. 30. 15:30',
            module: 'MODULE 01'
        },
        {
            id: 2,
            type: 'insight' as const,
            title: '차트 지표를 3개 이하로 유지하는 이유',
            content: '많은 지표를 쓰면 정보 과부하로 판단력이 흐려진다는 점이 인상 깊었다. 실제로 프로 트레이더들은 이평선, 볼린저밴드, RSI 정도만 사용한다고 함. "버리는 기준"이 "더하는 기준"보다 중요하다는 철학이 마음에 든다.',
            createdAt: '2025. 10. 30. 16:15',
            module: 'MODULE 01'
        },
        {
            id: 3,
            type: 'todo' as const,
            title: '거래소 비교 분석 진행하기',
            content: '바이낸스, 업비트, OKX 3곳을 체크리스트 기준으로 비교 분석해야 함. 보안 감사 이력, 수수료 구조, API 안정성, 거래량 등을 스프레드시트로 정리할 것. 이번 주말까지 완료 목표.',
            createdAt: '2025. 10. 30. 17:00',
            module: 'MODULE 01'
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

    const handleChecklistToggle = (id: number) => {
        setChecklist(checklist.map(item => {
            if (item.id === id && !item.completed) {
                const now = new Date();
                return {
                    ...item,
                    completed: true,
                    completedAt: `${now.getFullYear()}. ${now.getMonth() + 1}. ${now.getDate()}. ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
                };
            }
            return item;
        }));
    };

    const handleSaveNote = () => {
        if (!noteTitle.trim() || !noteContent.trim()) {
            alert('제목과 내용을 모두 입력해주세요.');
            return;
        }

        const now = new Date();
        const newNote = {
            id: Date.now(),
            type: selectedNoteType,
            title: noteTitle,
            content: noteContent,
            createdAt: `${now.getFullYear()}. ${now.getMonth() + 1}. ${now.getDate()}. ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
            module: 'MODULE 01'
        };

        setNotes([newNote, ...notes]);
        setNoteTitle('');
        setNoteContent('');
        setShowNoteEditor(false);
        setSelectedNoteType('question');
    };

    const handleDeleteNote = (id: number) => {
        if (confirm('이 노트를 삭제하시겠습니까?')) {
            setNotes(notes.filter(note => note.id !== id));
        }
    };

    const getFilteredNotes = () => {
        if (activeFilter === 'all') return notes;
        return notes.filter(note => note.type === activeFilter);
    };

    const getNoteTypeInfo = (type: string) => {
        const types = {
            question: { name: '궁금한 점', bgColor: 'bg-yellow-100', textColor: 'text-yellow-700', icon: '?' },
            insight: { name: '인사이트', bgColor: 'bg-blue-100', textColor: 'text-blue-700', icon: '💡' },
            todo: { name: '해야할 일', bgColor: 'bg-green-100', textColor: 'text-green-700', icon: '✓' },
            reference: { name: '참고', bgColor: 'bg-purple-100', textColor: 'text-purple-700', icon: '📄' }
        };
        return types[type as keyof typeof types] || types.question;
    };

    const getNoteCounts = () => {
        return {
            all: notes.length,
            question: notes.filter(n => n.type === 'question').length,
            insight: notes.filter(n => n.type === 'insight').length,
            todo: notes.filter(n => n.type === 'todo').length,
            reference: notes.filter(n => n.type === 'reference').length
        };
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

    const renderActionPlanTab = () => {
        const counts = getNoteCounts();
        const filteredNotes = getFilteredNotes();

        return (
            <div className="space-y-10">
                {/* 섹션 1: 학습 체크리스트 */}
                <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-6">MODULE 01 학습 체크리스트</h2>
                    <div className="space-y-3">
                        {checklist.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => handleChecklistToggle(item.id)}
                                className={`flex items-start gap-4 p-4 rounded-lg border transition-all cursor-pointer ${
                                    item.completed
                                        ? 'bg-green-50 border-green-200'
                                        : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                                }`}
                            >
                                <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                    item.completed
                                        ? 'bg-green-600 border-green-600'
                                        : 'border-gray-300'
                                }`}>
                                    {item.completed && (
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                                <div className="flex-grow">
                                    <p className={`text-base font-medium mb-1 ${item.completed ? 'text-green-700' : 'text-gray-900'}`}>
                                        {item.title}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {item.completed ? `완료 · ${item.completedAt}` : '미완료'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-all">
                        다음 모듈로 이동
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* 섹션 2: 노션 스타일 노트 시스템 */}
                <div className="pt-8 border-t border-gray-200">
                    {/* 노트 헤더 */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900">학습 노트</h2>
                        <button
                            onClick={() => setShowNoteEditor(!showNoteEditor)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-all"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            새 노트
                        </button>
                    </div>

                    {/* 노트 에디터 */}
                    {showNoteEditor && (
                        <div className="bg-white border-2 border-blue-600 rounded-xl overflow-hidden mb-6 shadow-lg">
                            {/* 툴바 */}
                            <div className="bg-gray-50 border-b border-gray-200 p-3 flex gap-2">
                                {['question', 'insight', 'todo', 'reference'].map((type) => {
                                    const typeInfo = getNoteTypeInfo(type);
                                    return (
                                        <button
                                            key={type}
                                            onClick={() => setSelectedNoteType(type as any)}
                                            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                                                selectedNoteType === type
                                                    ? 'bg-blue-50 text-blue-700 border border-blue-600'
                                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                                            }`}
                                        >
                                            <span>{typeInfo.icon}</span>
                                            <span>{typeInfo.name}</span>
                                        </button>
                                    );
                                })}
                            </div>
                            {/* 제목 입력 */}
                            <input
                                type="text"
                                value={noteTitle}
                                onChange={(e) => setNoteTitle(e.target.value)}
                                placeholder="제목을 입력하세요..."
                                className="w-full px-6 pt-5 pb-3 text-2xl font-bold text-gray-900 border-none focus:outline-none"
                            />
                            {/* 내용 입력 */}
                            <textarea
                                value={noteContent}
                                onChange={(e) => setNoteContent(e.target.value)}
                                placeholder="내용을 입력하세요...

팁:
• 이해가 안 되는 부분을 질문으로 정리해보세요
• 중요한 인사이트는 나중에 다시 보기 쉽게 기록하세요
• 실천할 내용은 구체적으로 작성하세요"
                                className="w-full px-6 pb-6 text-base text-gray-700 leading-relaxed resize-y min-h-[150px] border-none focus:outline-none"
                            />
                            {/* 푸터 */}
                            <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 flex justify-end gap-3">
                                <button
                                    onClick={() => {
                                        setShowNoteEditor(false);
                                        setNoteTitle('');
                                        setNoteContent('');
                                    }}
                                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-all"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={handleSaveNote}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-all"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    저장
                                </button>
                            </div>
                        </div>
                    )}

                    {/* 필터 탭 */}
                    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                        <button
                            onClick={() => setActiveFilter('all')}
                            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                                activeFilter === 'all'
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                            <span>전체</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                activeFilter === 'all' ? 'bg-white/20' : 'bg-gray-100'
                            }`}>{counts.all}</span>
                        </button>
                        {(['question', 'insight', 'todo'] as const).map((type) => {
                            const typeInfo = getNoteTypeInfo(type);
                            const count = counts[type];
                            return (
                                <button
                                    key={type}
                                    onClick={() => setActiveFilter(type)}
                                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                                        activeFilter === type
                                            ? 'bg-gray-900 text-white'
                                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                    }`}
                                >
                                    <span>{typeInfo.icon}</span>
                                    <span>{typeInfo.name}</span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                        activeFilter === type ? 'bg-white/20' : 'bg-gray-100'
                                    }`}>{count}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* 노트 카드 목록 */}
                    <div className="space-y-4">
                        {filteredNotes.map((note) => {
                            const typeInfo = getNoteTypeInfo(note.type);
                            return (
                                <div
                                    key={note.id}
                                    className="bg-white border border-gray-200 rounded-xl p-6 transition-all hover:border-gray-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer group"
                                >
                                    {/* 카드 헤더 */}
                                    <div className="flex justify-between items-start mb-3">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold ${typeInfo.bgColor} ${typeInfo.textColor}`}>
                                            <span>{typeInfo.icon}</span>
                                            <span>{typeInfo.name}</span>
                                        </span>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDeleteNote(note.id)}
                                                className="p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-100 hover:text-red-600 transition-all"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    {/* 제목 */}
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3 leading-snug">{note.title}</h3>
                                    {/* 내용 */}
                                    <p className="text-gray-600 text-sm leading-relaxed mb-4">{note.content}</p>
                                    {/* 푸터 */}
                                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                        <span className="text-xs text-gray-500">{note.createdAt}</span>
                                        <span className="text-xs font-medium text-gray-600 bg-gray-50 px-2.5 py-1 rounded">{note.module}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

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
                                    onClick={() => setActiveTab('action-plan')}
                                    className={`flex-1 px-8 py-5 text-base font-semibold transition-all relative ${
                                        activeTab === 'action-plan'
                                            ? 'text-gray-900 bg-white'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                                >
                                    실행 계획
                                    {activeTab === 'action-plan' && (
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
                                {activeTab === 'action-plan' && renderActionPlanTab()}
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
