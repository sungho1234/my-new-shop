// /data/products.ts

import type { Product, WishlistItem } from '@/context/AuthContext';

// 모든 상품 정보를 이 파일 한 곳에서만 관리합니다.
// 각 상품의 title은 해당 페이지의 itemForPay.title과 일치해야 합니다.
export const ALL_PRODUCTS: Product[] = [
  {
    // DB ID: first-guide (g1 페이지)
    id: 'first-guide',
    title: '일반인을 위한 시스템 투자 올인원',
    author: 'kobba',
    price: '100',
    thumbnail: '/g1.png',
  },
  {
    // DB ID: system-builder (g2 페이지)
    id: 'system-builder',
    title: '일반인을 위한 첫번째 안내서',
    author: 'kobba',
    price: '100',
    thumbnail: '/g2.png',
  },
  {
    // DB ID: growth-book (g3 페이지)
    id: 'growth-book',
    title: '일반인의 성장책: 스캠필터와 챌린지',
    author: 'kobba',
    price: '60,000',
    thumbnail: '/g3.png',
  },
  {
    // DB ID: strategy-vol1 (c1 페이지)
    id: 'strategy-vol1',
    title: '시스템 빌더 풀 패키지',
    author: 'Analyst (Berlin)',
    price: '450000',
    thumbnail: '/c1.png',
  },
  {
    // DB ID: strategy-source (c2 페이지)
    id: 'strategy-source',
    title: '프로의 전략 원본',
    author: 'kobba',
    price: '90,000',
    thumbnail: '/c2.png',
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
