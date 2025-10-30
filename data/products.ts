// /data/products.ts

import type { Product, WishlistItem } from '@/context/AuthContext';

// 모든 상품 정보를 이 파일 한 곳에서만 관리합니다.
export const ALL_PRODUCTS: Product[] = [
  {
    // DB ID: maxx-quant-v4
    id: 'maxx-quant-v4',
    title: '2025 일반인을 위한 시스템 투자 올인원',
    author: 'MAXX Systems Team',
    price: '210,000',
    thumbnail: '/assets/product_g3.png',
  },
  {
    // DB ID: first-guide
    id: 'first-guide',
    title: '2025 일반인을 위한 첫번째 안내서',
    author: 'kobba',
    price: '70,000',
    thumbnail: '/assets/product_g1.png',
  },
  {
    // DB ID: growth-book
    id: 'growth-book',
    title: '일반인의 성장책: 스캠필터와 챌린지',
    author: 'kobba',
    price: '60,000',
    thumbnail: '/assets/product_general-growth.png',
  },
  {
    // DB ID: system-builder
    id: 'system-builder',
    title: '2025 일반인을 위한 시스템 투자 올인원',
    author: 'kobba',
    price: '210,000',
    thumbnail: '/assets/product_g2.png',
  },
  {
    // DB ID: strategy-source
    id: 'strategy-source',
    title: '프로의 전략 원본:시스템 설계도와 데이터 분석',
    author: 'Trader (London)',
    price: '90,000',
    thumbnail: '/assets/product_c2.png',
  },
  // 아래는 예시로 남겨둡니다. (퀀트 포트폴리오 전략집)
  {
    id: 'strategy-vol1',
    title: '퀀트 포트폴리오 전략집 Vol.1',
    author: 'Analyst (Berlin)',
    price: '450000',
    thumbnail: '/assets/product_c1.png',
  },
];

// ID로 상품 정보를 쉽게 찾기 위한 헬퍼 함수
export const getProductById = (id: string): Product | undefined => {
  return ALL_PRODUCTS.find(product => product.id === id);
};

// 찜 목록 병합 함수 (이 함수는 이제 정상 동작합니다)
export function mergeWishlistWithProducts(wishlistItems: WishlistItem[]): (WishlistItem & Product)[] {
  if (!wishlistItems || wishlistItems.length === 0) {
    return [];
  }
  const merged = wishlistItems.map(item => {
    const product = getProductById(item.productId);
    if (product) {
      return { ...item, ...product };
    }
    return null;
  }).filter((p): p is (WishlistItem & Product) => p !== null);
  
  return merged;
}
