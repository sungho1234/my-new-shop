"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ALL_PRODUCTS } from '@/data/products';
import Link from 'next/link';

// 데이터베이스의 Purchase 모델과 타입을 맞춥니다.
interface Purchase {
  id: string;
  productId: string;
  amount: number;
  createdAt: string;
  userId: string;
}

// 컴포넌트 이름은 MyPurchasesContent로 유지하여 page.tsx와 호환되게 합니다.
const MyPurchasesContent = () => {
    const { user } = useAuth();
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPurchases = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const response = await fetch(`/api/purchases?userId=${user.id}`);
                if (!response.ok) {
                    throw new Error('구매 목록을 불러오지 못했습니다.');
                }
                const data = await response.json();
                setPurchases(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchPurchases();
    }, [user]);

    // 로딩 중일 때 표시할 화면
    if (loading) {
        return <div className="text-center py-20">구매 목록을 불러오는 중...</div>;
    }

    // DB에서 가져온 구매내역(productId)과 전체 상품 목록(ALL_PRODUCTS)을 매칭시킵니다.
    const purchasedProducts = purchases.map(purchase => 
        ALL_PRODUCTS.find(p => p.id === purchase.productId)
    ).filter(Boolean); // find가 undefined를 반환할 경우를 대비해 필터링

    // [합친 부분 1] 구매한 상품이 없을 경우, '콘텐츠 둘러보기' 버튼을 포함하여 보여줍니다.
    if (purchasedProducts.length === 0) {
        return (
            <div className="text-center py-20 border rounded-lg">
                <p className="text-gray-500">아직 구매한 콘텐츠가 없습니다.</p>
                <Link href="/">
                    <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
                        콘텐츠 둘러보기
                    </button>
                </Link>
            </div>
        );
    }

    // [합친 부분 2] 구매한 상품이 있을 경우, '총 개수'와 함께 목록을 보여줍니다.
    return (
        <div>
            <p className="mb-4 font-semibold">총 {purchasedProducts.length}개</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {purchasedProducts.map((item: any) => (
                    <div key={item.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <Link href={`/products/${item.id}`} className="block">
                            <img src={item.thumbnail} alt={item.title} className="w-full h-48 object-cover" />
                            <div className="p-4">
                                <h3 className="font-bold text-lg truncate">{item.title}</h3>
                                <p className="text-sm text-gray-500">{item.author}</p>
                                <p className="text-right font-semibold mt-2">{item.price.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원</p>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyPurchasesContent;
