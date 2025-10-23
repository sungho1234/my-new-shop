import React, { useState, useEffect } from 'react';
// import { fetchWishlistItems } from '@/lib/api'; 

const MyWishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]); // 찜한 상품 목록 상태

  // useEffect(() => {
  //   // 찜한 상품 목록을 가져오는 API 호출
  //   const getItems = async () => {
  //     const items = await fetchWishlistItems();
  //     setWishlistItems(items);
  //   };
  //   getItems();
  // }, []);

  if (wishlistItems.length === 0) {
    return (
      <div className="text-center py-20 border rounded-lg">
        <p className="text-gray-500">찜한 상품이 없습니다.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-4 font-semibold">총 {wishlistItems.length}개</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* wishlistItems.map(item => <ProductCard key={item.id} item={item} />) */}
      </div>
    </div>
  );
};

export default MyWishlist;
