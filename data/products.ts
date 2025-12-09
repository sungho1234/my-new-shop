// /data/products.ts

import type { Product, WishlistItem } from '@/context/AuthContext';

// 모든 상품 정보를 이 파일 한 곳에서만 관리합니다.
// 각 상품의 title은 해당 페이지의 itemForPay.title과 일치해야 합니다.
export const ALL_PRODUCTS: Product[] = [
  {
    // DB ID: first-guide (g1 페이지)
    id: 'first-guide',
    title: '매일 20만원씩 벌어오는 "시스템 트레이딩" 가이드',
    author: '모집기간 무제한',
    price: '250,000',
    thumbnail: '/g1.png',
    duration: '365일 수강',
    maxStudents: '100명 모집',
    instructor: '월조',
    installment: '12개월 할부 시 월 666,666원',
    discount: '63%',
    originalPrice: '총 3,000,000원',
    rating: '5.0',
    reviewCount: '33',
  },
  {
    // DB ID: system-builder (g2 페이지)
    id: 'system-builder',
    title: '일반인을 위한 첫번째 안내서',
    author: '모집기간 무제한',
    price: '250,000',
    thumbnail: '/g2.png',
    duration: '365일 수강',
    maxStudents: '100명 모집',
    instructor: '월조',
    installment: '12개월 할부 시 월 666,666원',
    discount: '63%',
    originalPrice: '총 3,000,000원',
    rating: '5.0',
    reviewCount: '33',
  },
  {
    // DB ID: growth-book (g3 페이지)
    id: 'growth-book',
    title: '일반인의 성장책: 스캠필터와 챌린지',
    author: '모집기간 무제한',
    price: '250,000',
    thumbnail: '/g3.png',
    duration: '365일 수강',
    maxStudents: '100명 모집',
    instructor: '월조',
    installment: '12개월 할부 시 월 666,666원',
    discount: '63%',
    originalPrice: '총 3,000,000원',
    rating: '5.0',
    reviewCount: '33',
  },
  {
    // DB ID: strategy-vol1 (c1 페이지)
    id: 'strategy-vol1',
    title: '시스템 빌더 풀 패키지',
    author: '모집기간 무제한',
    price: '250,000',
    thumbnail: '/c1.png',
    hidden: true, // 메인페이지에서 숨김
    duration: '365일 수강',
    maxStudents: '100명 모집',
    instructor: '월조',
    installment: '12개월 할부 시 월 666,666원',
    discount: '63%',
    originalPrice: '총 3,000,000원',
    rating: '5.0',
    reviewCount: '33',
  },
  {
    // DB ID: strategy-source (c2 페이지)
    id: 'strategy-source',
    title: '프로의 전략 원본',
    author: '모집기간 무제한',
    price: '250,000',
    thumbnail: '/c2.png',
    duration: '365일 수강',
    maxStudents: '100명 모집',
    instructor: '월조',
    installment: '12개월 할부 시 월 666,666원',
    discount: '63%',
    originalPrice: '총 3,000,000원',
    rating: '5.0',
    reviewCount: '33',
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
