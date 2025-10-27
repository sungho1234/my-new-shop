"use client";

import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';

// 모달이 받을 props 정의 (닫기 함수)
interface InquiryModalProps {
    onClose: () => void;
}

const InquiryModal: React.FC<InquiryModalProps> = ({ onClose }) => {
    // 폼 내부의 상태 관리
    const [title, setTitle] = useState('');
    const [details, setDetails] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // 폼 기본 제출 동작(새로고침) 방지

        if (!title.trim() || !details.trim()) {
            alert('제목과 문의사항을 모두 입력해주세요.');
            return;
        }

        // (실제 구현 시)
        // 여기에 폼 데이터를 서버로 전송하는 API 로직을 추가합니다.
        console.log({ title, details });

        alert('문의가 성공적으로 접수되었습니다. 빠른 시일 내에 답변드리겠습니다.');
        onClose(); // 모달 닫기
    };

    return (
        // 모달 오버레이 (바탕)
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" 
            onClick={onClose}
        >
            {/* 모달 콘텐츠 (클릭해도 안 닫힘) */}
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden" 
                onClick={(e) => e.stopPropagation()}
            >
                
                {/* 모달 헤더 */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900">새 문의 등록</h3>
                    <button 
                        className="text-gray-400 hover:text-gray-600" 
                        onClick={onClose}
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* 모달 본문 (폼) */}
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-6">
                        <div>
                            <label htmlFor="inquiryTitle" className="block text-sm font-medium text-gray-700 mb-1">
                                제목
                            </label>
                            <input
                                type="text"
                                id="inquiryTitle"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="문의 제목을 입력해주세요"
                                required
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="inquiryDetails" className="block text-sm font-medium text-gray-700 mb-1">
                                문의사항
                            </label>
                            <textarea
                                id="inquiryDetails"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                rows={8}
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                placeholder="문의하실 내용을 자세히 적어주세요."
                                required
                            />
                        </div>
                    </div>

                    {/* 모달 푸터 (버튼) */}
                    <div className="flex justify-end p-6 bg-gray-50 border-t border-gray-200 rounded-b-lg">
                        <button 
                            type="submit" 
                            className="bg-blue-800 text-white px-6 py-2.5 rounded-md font-semibold hover:bg-blue-900"
                        >
                            문의사항 보내기
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InquiryModal;