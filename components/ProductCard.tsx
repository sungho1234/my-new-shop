"use client";

import Link from 'next/link';
import React from 'react';

interface ProductCardProps {
  id: string;
  imgSrc: string;
  title: string;
  author: string;
  rating?: string;
  studentCount?: string;
  price: string;
  href: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  imgSrc,
  title,
  author,
  rating = "4.8",
  studentCount = "280",
  price,
  href,
}) => {
  return (
    <Link href={href}>
      <div className="group cursor-pointer">
        {/* 썸네일 영역 */}
        <div className="relative overflow-hidden rounded-lg mb-3 bg-gray-100 aspect-[4/3]">
          <img
            src={imgSrc}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* 호버 시 오버레이 효과 */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
        </div>

        {/* 상품 정보 영역 */}
        <div className="space-y-2">
          {/* 제목 */}
          <h3 className="text-base font-semibold text-gray-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
            {title}
          </h3>

          {/* 강사명 */}
          <p className="text-sm text-gray-600">{author}</p>

          {/* 평점 및 수강생 수 */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-yellow-500 font-medium">⭐ {rating}</span>
            <span className="text-gray-500">({studentCount}명)</span>
          </div>

          {/* 가격 */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">{price}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
