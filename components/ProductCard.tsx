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
  featured?: boolean; // 큰 카드 여부
  compact?: boolean; // 가로형 작은 카드 여부
  badges?: string[]; // 배지 표시 (예: ["무료", "VOD"])
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
  featured = false,
  compact = false,
  badges = [],
}) => {
  // 컴팩트 가로형 레이아웃
  if (compact) {
    return (
      <Link href={href}>
        <div className="group cursor-pointer flex gap-4 bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
          {/* 썸네일 영역 - 왼쪽 */}
          <div className="relative overflow-hidden bg-gray-100 w-48 flex-shrink-0">
            <img
              src={imgSrc}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
          </div>

          {/* 상품 정보 영역 - 오른쪽 */}
          <div className="flex-1 p-4 flex flex-col justify-center space-y-2">
            <h3 className="text-base font-semibold text-gray-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
              {title}
            </h3>
            <p className="text-sm text-gray-600">{author}</p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-yellow-500 font-medium">⭐ {rating}</span>
              <span className="text-gray-500">({studentCount}명)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900">{price}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // 피처드 큰 카드 레이아웃
  if (featured) {
    return (
      <Link href={href}>
        <div className="group cursor-pointer h-full">
          <div className="relative overflow-hidden rounded-lg bg-gray-100 h-full flex flex-col">
            <div className="relative overflow-hidden bg-gray-100 flex-1">
              <img
                src={imgSrc}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
            </div>
            <div className="p-6 bg-white space-y-3">
              <h3 className="text-xl font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                {title}
              </h3>
              <p className="text-base text-gray-600">{author}</p>
              <div className="flex items-center gap-2">
                <span className="text-yellow-500 font-medium">⭐ {rating}</span>
                <span className="text-gray-500">({studentCount}명)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900">{price}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // 기본 카드 레이아웃
  return (
    <Link href={href}>
      <div className="group cursor-pointer">
        {/* 썸네일 영역 */}
        <div className="relative overflow-hidden rounded-lg mb-2 bg-gray-100 aspect-[3/2] border border-gray-200 shadow-sm group-hover:shadow-md transition-shadow duration-300">
          <img
            src={imgSrc}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* 배지들 */}
          {badges.length > 0 && (
            <div className="absolute top-2 left-2 flex gap-1">
              {badges.map((badge, index) => (
                <span
                  key={index}
                  className={`px-2 py-0.5 text-xs font-bold rounded ${
                    badge === "무료"
                      ? "bg-orange-500 text-white"
                      : "bg-black text-white rounded-full"
                  }`}
                >
                  {badge}
                </span>
              ))}
            </div>
          )}
          {/* 호버 시 오버레이 효과 */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
        </div>

        {/* 상품 정보 영역 */}
        <div className="space-y-1">
          {/* 제목 */}
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
            {title}
          </h3>

          {/* 강사명 */}
          <p className="text-xs text-gray-600">{author}</p>

          {/* 평점 및 수강생 수 */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-yellow-500 font-medium">⭐ {rating}</span>
            <span className="text-gray-500">({studentCount}명)</span>
          </div>

          {/* 가격 */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-900">{price}원</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
