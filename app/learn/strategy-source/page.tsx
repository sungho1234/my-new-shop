'use client';

import React, { useState, useRef, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

// API 호출 함수들
const fetchUserChecklists = async (kakaoId: number, productId: string) => {
    const res = await fetch(`/api/learning/checklist?kakaoId=${kakaoId}&productId=${productId}`);
    if (!res.ok) throw new Error('Failed to fetch checklists');
    return res.json();
};

const saveChecklistItem = async (
    kakaoId: number,
    productId: string,
    checklistId: number,
    completed: boolean,
    completedAt: string | null
) => {
    const res = await fetch('/api/learning/checklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kakaoId, productId, checklistId, completed, completedAt })
    });
    if (!res.ok) return false;
    const data = await res.json();
    return data.success;
};

const fetchUserNotes = async (kakaoId: number, productId: string) => {
    const res = await fetch(`/api/learning/notes?kakaoId=${kakaoId}&productId=${productId}`);
    if (!res.ok) throw new Error('Failed to fetch notes');
    return res.json();
};

const createNote = async (
    kakaoId: number,
    productId: string,
    noteType: string,
    title: string,
    content: string,
    module: string
) => {
    const res = await fetch('/api/learning/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kakaoId, productId, noteType, title, content, module })
    });
    if (!res.ok) return null;
    return res.json();
};

const deleteNote = async (kakaoId: number, noteId: string) => {
    const res = await fetch(`/api/learning/notes?kakaoId=${kakaoId}&noteId=${noteId}`, {
        method: 'DELETE'
    });
    if (!res.ok) return false;
    const data = await res.json();
    return data.success;
};

const StrategySourceLearnPage = () => {
    const { user, purchases } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'materials' | 'action-plan' | 'support'>('materials');
    const [activeModule, setActiveModule] = useState<number>(1);
    const [showNoteEditor, setShowNoteEditor] = useState(false);
    const [selectedNoteType, setSelectedNoteType] = useState<'question' | 'insight' | 'todo' | 'reference'>('question');
    const [noteTitle, setNoteTitle] = useState('');
    const [noteContent, setNoteContent] = useState('');
    const [activeFilter, setActiveFilter] = useState<'all' | 'question' | 'insight' | 'todo' | 'reference'>('all');
    const [isLoadingData, setIsLoadingData] = useState(true);

    const resourceRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

    const PRODUCT_ID = 'strategy-source';

    const [checklist, setChecklist] = useState<Array<{ id: number; title: string; completed: boolean; completedAt: string | null }>>([
        { id: 1, title: '전략 설계도 PDF 다운로드', completed: false, completedAt: null },
        { id: 2, title: '전략 로직 핵심 부분 분석', completed: false, completedAt: null },
        { id: 3, title: '실증 사례집 데이터 해석', completed: false, completedAt: null },
        { id: 4, title: '나만의 전략 응용 아이디어 정리', completed: false, completedAt: null },
        { id: 5, title: '백테스팅 결과 분석 및 인사이트 도출', completed: false, completedAt: null },
    ]);

    const [notes, setNotes] = useState<Array<{
        id: string;
        type: 'question' | 'insight' | 'todo' | 'reference';
        title: string;
        content: string;
        createdAt: string;
        module: string;
    }>>([]);

    const hasPurchased = purchases.some(p => p.productId === 'strategy-source');

    // 구매 날짜 가져오기
    const purchaseDate = purchases.find(p => p.productId === 'strategy-source')?.createdAt;
    const formattedPurchaseDate = purchaseDate
        ? new Date(purchaseDate).toLocaleDateString('ko-KR', { year: 'numeric', month: 'numeric', day: 'numeric' }).replace(/\. /g, '. ')
        : '2025. 10. 30.';

    useEffect(() => {
        if (!user) return;

        const loadData = async () => {
            try {
                setIsLoadingData(true);
                const dbChecklists = await fetchUserChecklists(user.id, PRODUCT_ID);
                setChecklist(prev => prev.map(item => {
                    const dbItem = dbChecklists.find((db: any) => db.checklistId === item.id);
                    if (dbItem) {
                        return {
                            ...item,
                            completed: dbItem.completed,
                            completedAt: dbItem.completedAt
                        };
                    }
                    return item;
                }));

                const dbNotes = await fetchUserNotes(user.id, PRODUCT_ID);
                const formattedNotes = dbNotes.map((note: any) => ({
                    id: note.id,
                    type: note.noteType as 'question' | 'insight' | 'todo' | 'reference',
                    title: note.title,
                    content: note.content,
                    createdAt: new Date(note.createdAt).toLocaleString('ko-KR', {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    }).replace(/\. /g, '. '),
                    module: note.module
                }));
                setNotes(formattedNotes);
            } catch (error) {
                console.error('Error loading learning data:', error);
            } finally {
                setIsLoadingData(false);
            }
        };

        loadData();
    }, [user]);

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
                        onClick={() => router.push('/products/c2')}
                        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                        상품 페이지로 이동
                    </button>
                </div>
                <Footer />
            </>
        );
    }

    if (isLoadingData) {
        return (
            <>
                <Header />
                <div className="w-full bg-white pb-20 text-center py-40">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                    <p className="mt-4 text-gray-500">학습 데이터를 불러오는 중...</p>
                </div>
                <Footer />
            </>
        );
    }

    const completedChecklistCount = checklist.filter(item => item.completed).length;
    const checklistProgressPercent = (completedChecklistCount / checklist.length) * 100;

    const handleChecklistToggle = async (id: number) => {
        if (!user) return;

        const updatedChecklist = checklist.map(item => {
            if (item.id === id) {
                if (!item.completed) {
                    const now = new Date();
                    const completedAt = `${now.getFullYear()}. ${now.getMonth() + 1}. ${now.getDate()}. ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
                    return { ...item, completed: true, completedAt: completedAt };
                } else {
                    return { ...item, completed: false, completedAt: null };
                }
            }
            return item;
        });

        setChecklist(updatedChecklist);

        const updatedItem = updatedChecklist.find(item => item.id === id);
        if (updatedItem) {
            await saveChecklistItem(
                user.id,
                PRODUCT_ID,
                updatedItem.id,
                updatedItem.completed,
                updatedItem.completedAt
            );
        }
    };

    const handleSaveNote = async () => {
        if (!user) return;

        if (!noteTitle.trim() || !noteContent.trim()) {
            alert('제목과 내용을 모두 입력해주세요.');
            return;
        }

        const dbNote = await createNote(
            user.id,
            PRODUCT_ID,
            selectedNoteType,
            noteTitle,
            noteContent,
            'STRATEGY VOL1'
        );

        if (dbNote) {
            const newNote = {
                id: dbNote.id,
                type: dbNote.noteType as 'question' | 'insight' | 'todo' | 'reference',
                title: dbNote.title,
                content: dbNote.content,
                createdAt: new Date(dbNote.createdAt).toLocaleString('ko-KR', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }).replace(/\. /g, '. '),
                module: dbNote.module
            };

            setNotes([newNote, ...notes]);
            setNoteTitle('');
            setNoteContent('');
            setShowNoteEditor(false);
            setSelectedNoteType('question');
        } else {
            alert('노트 저장에 실패했습니다.');
        }
    };

    const handleDeleteNote = async (id: string) => {
        if (!user) return;

        if (confirm('이 노트를 삭제하시겠습니까?')) {
            const success = await deleteNote(user.id, id);

            if (success) {
                setNotes(notes.filter(note => note.id !== id));
            } else {
                alert('노트 삭제에 실패했습니다.');
            }
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

    const modules = [
        { id: 1, number: 'MODULE 01', name: '전략 설계도', completed: true, resourceIds: [1] },
        { id: 2, number: 'MODULE 02', name: '실증 사례집', completed: false, resourceIds: [2] },
    ];

    const learningResources = [
        {
            id: 1,
            type: 'pdf',
            name: '전략 설계도 (Strategy Blueprint)',
            meta: 'PDF · 5.2MB · 45페이지',
            description: '현역 트레이더가 실제 사용하는 전략의 핵심 로직과 진입/청산 기준을 상세히 담은 설계도입니다.',
            special: false,
        },
        {
            id: 2,
            type: 'pdf',
            name: '실증 사례집 (Backtesting Results)',
            meta: 'PDF · 3.8MB · 32페이지',
            description: '과거 데이터 기반의 전략 검증 결과와 실전 적용 사례를 분석한 자료입니다.',
            special: false,
        },
    ];

    // 모듈 클릭 시 해당 학습 자료로 스크롤
    const handleModuleClick = (moduleId: number) => {
        setActiveModule(moduleId);
        setActiveTab('materials');

        const targetModule = modules.find(m => m.id === moduleId);
        if (targetModule && targetModule.resourceIds.length > 0) {
            const firstResourceId = targetModule.resourceIds[0];
            setTimeout(() => {
                resourceRefs.current[firstResourceId]?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'nearest'
                });
            }, 100);
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
                    ref={(el) => {
                        resourceRefs.current[resource.id] = el;
                    }}
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
                            {renderIcon(resource.type === 'link' ? 'Link' : 'DocumentText', resource.special)}
                        </div>
                        <div className="flex-grow">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{resource.name}</h3>
                            <p className="text-sm text-gray-600">{resource.meta}</p>
                        </div>
                    </div>
                    <p className="text-gray-600 text-base leading-relaxed mb-5">{resource.description}</p>
                    <div className="flex gap-3">
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
                <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-6">학습 체크리스트</h2>
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
                </div>

                <div className="pt-8 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900">기록사항 및 Q&A</h2>
                    </div>

                    {(
                        <div className="bg-white border-2 border-blue-600 rounded-xl overflow-hidden mb-6 shadow-lg">
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
                            <input
                                type="text"
                                value={noteTitle}
                                onChange={(e) => setNoteTitle(e.target.value)}
                                placeholder="제목을 입력하세요..."
                                className="w-full px-6 pt-5 pb-3 text-2xl font-bold text-gray-900 border-none focus:outline-none"
                            />
                            <textarea
                                value={noteContent}
                                onChange={(e) => setNoteContent(e.target.value)}
                                placeholder="내용을 입력하세요..."
                                className="w-full px-6 pb-6 text-base text-gray-700 leading-relaxed resize-y min-h-[150px] border-none focus:outline-none"
                            />
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

                    <div className="space-y-4">
                        {filteredNotes.map((note) => {
                            const typeInfo = getNoteTypeInfo(note.type);
                            return (
                                <div
                                    key={note.id}
                                    className="bg-white border border-gray-200 rounded-xl p-6 transition-all hover:border-gray-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer group"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold ${typeInfo.bgColor} ${typeInfo.textColor}`}>
                                            <span>{typeInfo.icon}</span>
                                            <span>{typeInfo.name}</span>
                                        </span>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3 leading-snug">{note.title}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed mb-4">{note.content}</p>
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
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-3">1:1 지원 안내</h3>
                <p className="text-gray-700 text-base leading-relaxed mb-6">
                    이 상품은 1:1 멘토링 및 해설 영상이 제외된 핵심 이론 패키지입니다.
                    실행 지표나 1:1 지원이 필요하신 경우 <span className="font-bold text-blue-700">"시스템 빌더 풀 패키지"</span>를 이용하시면
                    모든 콘텐츠와 멘토링을 함께 받으실 수 있습니다.
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

                <button className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    풀 패키지 업그레이드
                </button>
            </div>
        </div>
    );

    return (
        <>
            <Header />
            <div className="w-full bg-gray-50 min-h-screen">
                <div style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)' }} className="text-white text-center py-12">
                    <h1 className="text-3xl font-bold mb-2">{user.nickname}님, 환영합니다!</h1>
                    <p className="text-base opacity-90">프로의 전략 원본 학습실</p>
                </div>

                <div className="container mx-auto px-4 max-w-7xl py-8">
                    <div className="bg-white border border-gray-200 rounded-lg px-6 py-4 mb-8">
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-600 cursor-pointer hover:text-gray-900">홈</span>
                            <span className="text-gray-400">›</span>
                            <span className="text-gray-600 cursor-pointer hover:text-gray-900">My 콘텐츠</span>
                            <span className="text-gray-400">›</span>
                            <span className="text-gray-900 font-semibold">프로의 전략 원본</span>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-10 mb-8 shadow-sm">
                        <div className="inline-block px-4 py-2 bg-blue-50 text-blue-700 text-sm font-semibold rounded-full mb-4">
                            프리미엄 패키지
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-3">프로의 전략 원본</h1>
                        <p className="text-lg text-gray-600 mb-6">
                            현역 트레이더의 전략 설계도와 실증 사례집으로 프로의 사고방식과 데이터 해석법을 배우세요.
                        </p>
                        <div className="flex items-center gap-8 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>구매일: {formattedPurchaseDate}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span>총 {learningResources.length}개 자료</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
                        <aside className="space-y-4">
                            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">학습 진행률</div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                                    <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${checklistProgressPercent}%` }}></div>
                                </div>
                                <div className="text-sm font-semibold text-gray-900">{Math.round(checklistProgressPercent)}% 완료</div>
                            </div>

                            {/* Module Navigation */}
                            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 mb-4">모듈 목록</div>
                                <div className="space-y-2">
                                    {modules.map((module) => (
                                        <button
                                            key={module.id}
                                            onClick={() => handleModuleClick(module.id)}
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

                        <main className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
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

export default StrategySourceLearnPage;
