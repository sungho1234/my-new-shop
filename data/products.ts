// /data/products.ts – 찜 목록 매칭을 위한 상품 데이터 (DB 대체, 나중 삭제)

// 타입 정의 (AuthContext에 없으면 에러 – 간단히 여기서)
export interface Product {
  id: string;
  title: string;
  author: string;
  price: string;
  thumbnail: string;
  description?: string;  // optional
}

// 상품 배열 – 직접 타이핑으로 숨겨진 문자 피함 (복사 말고 수동 입력 추천)
export const ALL_PRODUCTS: Product[] = [
  {
    id: 'g1',  // g1 (수동 입력)
    title: '일반인을 위한 첫번째 안내서',
    author: 'kobba',
    price: '70000',
    thumbnail: '/assets/product_g1.png',
    description: '',
  },
  {
    id: 'g2',
    title: '2025 일반인을 위한 시스템 투자 올인원',
    author: 'kobba',
    price: '2100000',
    thumbnail: '/assets/product_g2.png',
    description: '',
  },
  {
    id: 'c1',
    title: '퀀트 포트폴리오 전략집 Vol.1',
    author: 'Analyst (Berlin)',
    price: '450000',
    thumbnail: '/assets/product_c1.png',
    description: '',
  },
  {
    id: 'c2',
    title: '프리미엄 퀀트 전략집 Vol.2',
    author: 'Trader (London)',
    price: '890000',
    thumbnail: '/assets/product_c2.png',
    description: '',
  },
  {
    id: 'g3',
    title: 'MAXX Quant System v4.0 (시스템 패키지)',
    author: 'MAXX Systems Team',
    price: '9900000',
    thumbnail: '/assets/product_g3.png',
    description: '',
  },
  {
    id: 'general-growth',  // general-growth (하이픈 1개, 수동 타이핑: g-e-n-e-r-a-l - g-r-o-w-t-h)
    title: '일반인의 성장책: 스캠필터와 챌린지',
    author: 'kobba',
    price: '70000',
    thumbnail: '/assets/product_general-growth.png',  // 이미지 없으면 placeholder로 바꿔요
    description: '',
  },
];

// 문자열 정규화 함수 – 숨겨진 문자 제거 (근본 해결)
function normalizeId(id: string): string {
  return id
    .toString()  // 숫자면 string으로
    .trim()  // 앞뒤 공백 제거
    .toLowerCase()  // 소문자
    .replace(/[^a-z0-9-]/g, '')  // 알파벳, 숫자, 하이픈만 남김 (특수/숨겨진 문자 삭제, e.g., \u200B 제거)
    .replace(/-+/g, '-');  // 여러 하이픈 하나로
}

// ID로 상품 찾기 – 정규화 적용
export const getProductById = (id: string): Product | undefined => {
  const cleanId = normalizeId(id);
  console.log(`🔍 normalize: 원본 '${id}' → clean '${cleanId}'`);  // 디버그 로그 (간단)

  return ALL_PRODUCTS.find(product => normalizeId(product.id) === cleanId);
};

// 찜 병합 – 정규화된 find 사용
export function mergeWishlistWithProducts(wishlistItems: any[]): Product[] {
  if (!wishlistItems || wishlistItems.length === 0) {
    console.log("ℹ️ 빈 찜 목록 – 카드 없음");
    return [];
  }

  console.log("🔍 병합 시작: DB IDs =", wishlistItems.map(item => item.productId));
  console.log("🔍 배열 IDs =", ALL_PRODUCTS.map(p => p.id));

  const merged = wishlistItems
    .map((item) => {
      const product = getProductById(item.productId);
      if (product) {
        console.log(`✅ 매치: '${item.productId}' → '${product.title}'`);
        return product;
      }
      console.warn(`⚠️ 매치 실패: '${item.productId}'`);
      return null;
    })
    .filter((p): p is Product => p !== null);  // null 제거

  console.log("🔍 병합 끝: 성공 =", merged.length);

  return merged;
}
