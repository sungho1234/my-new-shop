import React, { useState, useEffect } from 'react';
// import { fetchPurchasedItems } from '@/lib/api'; // 예시: API 호출 함수

const MyPurchases = () => {
  const [purchasedItems, setPurchasedItems] = useState([]); // 구매한 상품 목록 상태

  // useEffect(() => {
  //   // 페이지 로드 시 구매한 상품 목록을 API로부터 가져옵니다.
  //   const getItems = async () => {
  //     const items = await fetchPurchasedItems();
  //     setPurchasedItems(items);
  //   };
  //   getItems();
  // }, []);

  // 구매한 상품이 없을 경우 (레퍼런스 1번 이미지의 "아직 구매한 전자책이 없습니다.")
  if (purchasedItems.length === 0) {
    return (
      <div className="text-center py-20 border rounded-lg">
        <p className="text-gray-500">아직 구매한 콘텐츠가 없습니다.</p>
        <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md">
          콘텐츠 둘러보기
        </button>
      </div>
    );
  }

  // 구매한 상품이 있을 경우 목록을 렌더링
  return (
    <div>
      <p className="mb-4 font-semibold">총 {purchasedItems.length}개</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* purchasedItems.map(item => <ProductCard key={item.id} item={item} />) */}
      </div>
    </div>
  );
};

export default MyPurchases;
