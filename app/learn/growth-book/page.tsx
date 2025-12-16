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

const GrowthBookLearnPage = () => {
    const { user, courseAccess } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'materials' | 'support'>('materials');
    const [activeModule, setActiveModule] = useState<number>(1);
    const [showNoteEditor, setShowNoteEditor] = useState(false);
    const [selectedNoteType, setSelectedNoteType] = useState<'question' | 'insight' | 'todo' | 'reference'>('question');
    const [noteTitle, setNoteTitle] = useState('');
    const [noteContent, setNoteContent] = useState('');
    const [activeFilter, setActiveFilter] = useState<'all' | 'question' | 'insight' | 'todo' | 'reference'>('all');
    const [isLoadingData, setIsLoadingData] = useState(true);

    // Refs for learning resource cards
    const resourceRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

    const PRODUCT_ID = 'growth-book';

    const [checklist, setChecklist] = useState<Array<{ id: number; title: string; completed: boolean; completedAt: string | null }>>([
        { id: 1, title: 'PART 1: 스캠 필터링 체크리스트 학습 완료', completed: false, completedAt: null },
        { id: 2, title: 'PART 2: 데이터 기반 과제집 1회차 실습', completed: false, completedAt: null },
        { id: 3, title: '실전 매매일지 첫 기록 작성', completed: false, completedAt: null },
        { id: 4, title: '30일 챌린지북 Day 1-7 완료', completed: false, completedAt: null },
        { id: 5, title: '30일 챌린지북 전체 완료 및 회고', completed: false, completedAt: null },
    ]);

    const [notes, setNotes] = useState<Array<{
        id: string;
        type: 'question' | 'insight' | 'todo' | 'reference';
        title: string;
        content: string;
        createdAt: string;
        module: string;
    }>>([]);

    // 구매 여부 확인
    const hasPurchased = courseAccess.some(access => access.productId === 'growth-book' && access.isActive);

    // 구매 날짜 가져오기
    const purchaseDate = courseAccess.find(access => access.productId === 'growth-book')?.grantedAt;
    const formattedPurchaseDate = purchaseDate
        ? new Date(purchaseDate).toLocaleDateString('ko-KR', { year: 'numeric', month: 'numeric', day: 'numeric' }).replace(/\. /g, '. ')
        : '2025. 10. 30.';

    // 컴포넌트 마운트 시 데이터 불러오기
    useEffect(() => {
        if (!user) return;

        const loadData = async () => {
            try {
                setIsLoadingData(true);

                // 체크리스트 불러오기
                const dbChecklists = await fetchUserChecklists(user.id, PRODUCT_ID);

                // DB 데이터를 로컬 state와 병합
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

                // 노트 불러오기
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
                        onClick={() => router.push('/products/g3')}
                        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                        상품 페이지로 이동
                    </button>
                </div>
                <Footer />
            </>
        );
    }

    // 데이터 로딩 중
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

    const modules = [
        { id: 1, number: 'PART 1', name: '스캠 필터링 체크리스트', completed: true, resourceIds: [1] },
        { id: 2, number: 'PART 2-1', name: '데이터 기반 과제집', completed: false, resourceIds: [2] },
        { id: 3, number: 'PART 2-2', name: '실전 매매일지 템플릿', completed: false, resourceIds: [3] },
        { id: 4, number: 'BONUS', name: '30일 챌린지북', completed: false, resourceIds: [4] },
    ];

    const learningResources = [
        {
            id: 1,
            type: 'pdf',
            icon: 'DocumentText',
            name: '🛡️ 스캠 필터링 체크리스트 (PART 1)',
            meta: 'PDF · 2.5MB · 18페이지',
            description: '위험한 사기 정보와 해킹으로부터 자산을 지키는 실전 가이드입니다. 사기성 정보 판별 기준, 해킹 방지법, 디파이 사기 링크 구별법을 체계적으로 정리했습니다.',
        },
        {
            id: 2,
            type: 'pdf',
            icon: 'ChartBar',
            name: '📊 데이터 기반 과제집 (PART 2)',
            meta: 'PDF · 3.2MB · 42페이지',
            description: '감(感)으로 하던 매매를 멈추고, 데이터로 판단하도록 훈련하는 실전 트레이닝북입니다. 당신의 매매 습관을 데이터 기반으로 교정하는 실전 훈련 과제가 포함되어 있으며, 올인원 패키지 이용 시 이 기록을 바탕으로 현역 트레이더의 1:1 피드백을 받을 수 있습니다.',
        },
        {
            id: 3,
            type: 'pdf',
            icon: 'DocumentText',
            name: '실전 매매일지 템플릿',
            meta: 'PDF · 1.8MB · 12페이지',
            description: '매 거래마다 진입 이유, 감정 상태, 결과 분석을 기록하는 실전 매매일지 템플릿입니다. 스스로의 실력을 데이터로 분석하고 체계적으로 성장하는 가장 확실한 방법입니다. 기록은 성장의 가장 강력한 도구입니다.',
        },
        {
            id: 4,
            type: 'pdf',
            icon: 'BookOpen',
            name: '30일 학습 습관 형성 챌린지북',
            meta: 'PDF · 2.8MB · 35페이지',
            description: '하루 15분씩 꾸준히 실천할 수 있는 학습 루틴을 만드는 30일 챌린지입니다. 매일의 작은 실천이 큰 변화를 만듭니다. 정교하게 설계된 명확한 미션을 수행하며 데이터 기반 사고방식을 체득하게 됩니다.',
            special: true,
        },
    ];

    // 체크리스트 완료 개수로 학습 진행률 계산
    const completedChecklistCount = checklist.filter(item => item.completed).length;
    const checklistProgressPercent = (completedChecklistCount / checklist.length) * 100;

    // 모듈 클릭 시 해당 학습 자료로 스크롤
    const handleModuleClick = (moduleId: number) => {
        setActiveModule(moduleId);
        setActiveTab('materials'); // 학습 자료 탭으로 전환

        const targetModule = modules.find(m => m.id === moduleId);
        if (targetModule && targetModule.resourceIds.length > 0) {
            const firstResourceId = targetModule.resourceIds[0];
            // 약간의 딜레이를 주어 탭 전환 후 스크롤
            setTimeout(() => {
                resourceRefs.current[firstResourceId]?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'nearest'
                });
            }, 100);
        }
    };

    const handleChecklistToggle = async (id: number) => {
        if (!user) return;

        const updatedChecklist = checklist.map(item => {
            if (item.id === id) {
                if (!item.completed) {
                    // 체크하기
                    const now = new Date();
                    const completedAt = `${now.getFullYear()}. ${now.getMonth() + 1}. ${now.getDate()}. ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
                    return {
                        ...item,
                        completed: true,
                        completedAt: completedAt
                    };
                } else {
                    // 체크 해제하기
                    return {
                        ...item,
                        completed: false,
                        completedAt: null
                    };
                }
            }
            return item;
        });

        setChecklist(updatedChecklist);

        // DB에 저장
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

        // DB에 저장
        const dbNote = await createNote(
            user.id,
            PRODUCT_ID,
            selectedNoteType,
            noteTitle,
            noteContent,
            'MODULE 01'
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
            // DB에서 삭제
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
        <div className="max-w-4xl">
            {learningResources.map((resource, index) => (
                <div key={resource.id}>
                    {/* PART 구분선 - 모든 카드 상단에 표시 */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-start">
                            <span className="bg-white pr-3 text-base font-bold text-gray-400 tracking-wide">
                                PART {index + 1}
                            </span>
                        </div>
                    </div>

                    <div
                        ref={(el) => {
                            resourceRefs.current[resource.id] = el;
                        }}
                        className={`bg-white rounded-2xl p-7 border-l-4 border-y border-r transition-shadow hover:shadow-md ${
                            resource.special
                                ? 'border-l-green-500 border-green-300 bg-green-50/30'
                                : 'border-l-gray-900 border-gray-200'
                        }`}
                    >
                        <div className="flex gap-5 mb-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                resource.special
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-100 text-gray-700'
                            }`}>
                                {renderIcon(resource.icon, resource.special)}
                            </div>
                            <div className="flex-grow">
                                <h3 className="text-lg font-bold text-gray-900 mb-1">{resource.name}</h3>
                                <p className="text-sm text-gray-500">{resource.meta}</p>
                            </div>
                        </div>
                        <p className="text-gray-600 text-base leading-relaxed mb-5">{resource.description}</p>
                        <div className="flex gap-2">
                            {resource.special ? (
                                <>
                                    <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                        레이아웃 적용하기
                                    </button>
                                    <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                        링크 복사
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        열람하기
                                    </button>
                                    <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        다운로드
                                    </button>
                                </>
                            )}
                        </div>
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
                        <h2 className="text-xl font-bold text-gray-900">기록사항 및 Q&A</h2>
                    </div>

                    {/* 노트 에디터 */}
                    {(
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

    const renderSupportTab = () => {
        const counts = getNoteCounts();
        const filteredNotes = getFilteredNotes();

        return (
            <div className="space-y-10 max-w-4xl">
                {/* 1:1 지원 섹션 */}
                <div className="bg-white rounded-2xl border border-gray-200 p-8">
                    <div className="flex items-start gap-5 mb-6">
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">자기주도 학습 프로그램 안내</h3>
                            <p className="text-gray-600 text-base leading-relaxed">
                                성장책은 <span className="font-semibold text-blue-700">완전 자기주도형 워크북</span>입니다.
                                1:1 지원은 포함되어 있지 않으며, 스스로 워크시트를 작성하고 일지를 기록하며 성장하는 과정을 경험하게 됩니다.
                                더 깊은 학습과 전문가 피드백이 필요하다면 올인원 패키지를 확인해보세요.
                            </p>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-5 mb-5 space-y-3">
                        <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                            <span className="text-sm font-medium text-gray-600">학습 방식</span>
                            <span className="text-sm font-semibold text-blue-600">자기주도형 워크북</span>
                        </div>
                        <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                            <span className="text-sm font-medium text-gray-600">1:1 지원 포함 여부</span>
                            <span className="text-sm font-semibold text-red-500">미포함</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600">권장 학습 기간</span>
                            <span className="text-sm font-semibold text-gray-900">30일 (하루 15분)</span>
                        </div>
                    </div>

                    <button className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        멘토링 포함 올인원 패키지 보기
                    </button>
                </div>

                {/* 노트 시스템 */}
                <div>
                    {/* 노트 헤더 */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900">기록사항 및 Q&A</h2>
                    </div>

                    {/* 노트 에디터 */}
                    {(
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

    return (
        <>
            <Header />
            <div className="w-full bg-white pb-20 min-h-screen">
                {/* Hero Banner - Slate Gradient */}
                <section className="bg-gradient-to-r from-slate-700 to-slate-800 py-16">
                    <div className="container mx-auto px-4 max-w-7xl text-center">
                        <h1 className="text-3xl font-bold text-white mb-2">일반인의 성장책 - 자기주도 학습 워크북</h1>
                        <p className="text-base text-white/80">구매일: {formattedPurchaseDate} · 총 {learningResources.length}개 자료</p>
                    </div>
                </section>

                <div className="container mx-auto px-4 max-w-7xl">
                    <section className="mt-8">
                        {/* Tab Navigation - Underline Style */}
                        <nav className="flex gap-12 border-b border-gray-200 mb-10">
                            <button
                                onClick={() => setActiveTab('materials')}
                                className={`pb-4 text-base font-semibold transition-all relative ${
                                    activeTab === 'materials'
                                        ? 'text-gray-900'
                                        : 'text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                학습 자료
                                {activeTab === 'materials' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('support')}
                                className={`pb-4 text-base font-semibold transition-all relative ${
                                    activeTab === 'support'
                                        ? 'text-gray-900'
                                        : 'text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                1:1 지원 & 노트
                                {activeTab === 'support' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
                                )}
                            </button>
                        </nav>

                        {/* Tab Content */}
                        <section>
                            <main>
                                {activeTab === 'materials' && renderMaterialsTab()}
                                {activeTab === 'support' && renderSupportTab()}
                            </main>
                        </section>
                    </section>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default GrowthBookLearnPage;
