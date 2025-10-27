"use client";

import React from 'react';
import { useAuth } from '@/context/AuthContext';  // AuthContext만 import (Product 타입 사용)

// [직접 정의: Product 타입 (AuthContext에 없으면 에러 방지)]
export interface Product {
  id: string;
  title: string;
  author: string;
  price: string;
  thumbnail: string;
  description?: string;
}

// [내장: 상품 배열 – products.ts 의존 끊음, 직접 하드코딩]
const ALL_PRODUCTS: Product[] = [
  {
    id: 'g1',
    title: '일반인을 위한 첫번째 안내서',
    author: 'kobba',
    price: '70000',
    thumbnail: '/assets/product_g1.png',
  },
  {
    id: 'g2',
    title: '2025 일반인을 위한 시스템 투자 올인원',
    author: 'kobba',
    price: '2100000',
    thumbnail: '/assets/product_g2.png',
  },
  {
    id: 'c1',
    title: '퀀트 포트폴리오 전략집 Vol.1',
    author: 'Analyst (Berlin)',
    price: '450000',
    thumbnail: '/assets/product_c1.png',
  },
  {
    id: 'c2',
    title: '프리미엄 퀀트 전략집 Vol.2',
    author: 'Trader (London)',
    price: '890000',
    thumbnail: '/assets/product_c2.png',
  },
  {
    id: 'g3',
    title: 'MAXX Quant System v4.0 (시스템 패키지)',
    author: 'MAXX Systems Team',
    price: '9900000',
    thumbnail: '/assets/product_g3.png',
  },
  {
    id: 'general-growth',  // 문제 ID 직접 추가
    title: '일반인의 성장책: 스캠필터와 챌린지',
    author: 'kobba',
    price: '70000',
    thumbnail: '/assets/product_general-growth.png',  // 이미지 경로; 없으면 '/placeholder.png'로
  },
];

// [내장: 문자열 정리 함수 (숨겨진 문자 제거)]
function normalizeId(id: string): string {
  return id
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')  // 특수 문자만 지움
    .replace(/-+/g, '-');
}

// [내장: ID로 상품 찾기]
function getProductById(id: string): Product | undefined {
  const cleanId = normalizeId(id);
  console.log(`🔍 MyWishlist: ID '${id}' → clean '${cleanId}'`);  // 간단 로그
  return ALL_PRODUCTS.find(p => normalizeId(p.id) === cleanId);
}

// [내장: merge 함수 – 직접 구현 (products.ts 안 씀)]
function mergeWishlist(wishlist: any[]): Product[] {
  if (!wishlist || wishlist.length === 0) {
    console.log("ℹ️ 찜 목록 빈 상태");
    return [];
  }
  console.log("🔍 병합 시작: DB IDs =", wishlist.map(item => item.productId));

  const merged = wishlist
    .map(item => {
      const product = getProductById(item.productId);
      if (product) {
        console.log(`✅ 매치 성공: '${item.productId}' → '${product.title}'`);
        return product;
      }
      console.warn(`⚠️ 매치 실패: '${item.productId}'`);
      return null;
    })
    .filter((p): p is Product => p !== null);

  console.log("🔍 병합 끝: 성공 개수 =", merged.length);
  return merged;
}

// [찜 카드 컴포넌트 – 간단 UI (position sticky 에러 피함)]
interface WishCardProps {
  product: Product;
  onRemove: (id: string) => void;
}

const WishCard: React.FC<WishCardProps> = ({ product, onRemove }) => (
  <div className="flex items-center p-4 border-b border-gray-200 hover:bg-gray-50 relative">  {/* relative로 position 충돌 피함 */}
    {/* 이미지 */}
    <img src={product.thumbnail} alt={product.title} className="w-16 h-16 object-cover rounded mr-4" />
    {/* 정보 */}
    <div className="flex-1">
      <h3 className="font-semibold text-sm">{product.title}</h3>
      <p className="text-xs text-gray-500">크리에이터: {product.author}</p>
      <p className="text-sm font-bold">₩{product.price.toLocaleString()}</p>  {/* 가격 포맷 */}
    </div>
    {/* 삭제 버튼 */}
    <button
      onClick={() => onRemove(product.id)}
      className="text-gray-400 hover:text-red-500 transition-colors absolute right-4 top-1/2 -translate-y-1/2"
      title="찜 삭제"
    >
      ✕
    </button>
  </div>
);

// 메인 컴포넌트
const MyWishlist = () => {
  const { user, wishlist, removeFromWishlist } = useAuth();

  // [핵심: 내장 merge 호출]
  const mergedWishlist = mergeWishlist(wishlist);

  if (!user) {
    return <div className="p-4 text-center text-gray-500">로그인이 필요합니다.</div>;
  }

  if (mergedWishlist.length === 0) {
    // [fallback: Raw 제거 – 깔끔 메시지 + 디버그]
    console.log("🧪 fallback: merged=0, 원본 wishlist 길이=", wishlist?.length);
    if (wishlist && wishlist.length > 0) {
      console.log("🔍 Raw DB 데이터:", JSON.stringify(wishlist, null, 2));  // 콘솔만
    }
    return (
      <div className="p-4 text-center text-gray-500">
        찜한 상품이 없습니다. <br />
        {wishlist?.length > 0 && '(매칭 확인 중 – 콘솔 봐주세요)'}
      </div>
    );
  }

  // [삭제 핸들러]
  const handleRemove = async (productId: string) => {
    if (!removeFromWishlist) return;
    await removeFromWishlist(productId);
    // 페이지 리로드 (간단)
    window.location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto p-4">  {/* 레이아웃 정리 – sticky 충돌 피함 */}
      <h2 className="text-2xl font-bold mb-4">내 찜 목록</h2>
      <div className="bg-white rounded-lg shadow">
        {mergedWishlist.map((product) => (
          <WishCard key={product.id} product={product} onRemove={handleRemove} />
        ))}
      </div>
    </div>
  );
};

export default MyWishlist;
