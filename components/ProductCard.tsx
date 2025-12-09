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
  duration?: string; // 수강 기간
  maxStudents?: string; // 모집 인원
  instructor?: string; // 강사/팀 정보
  installment?: string; // 할부 정보
  discount?: string; // 할인율
  originalPrice?: string; // 원가
  reviewCount?: string; // 리뷰 수
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
  duration,
  maxStudents,
  instructor,
  installment,
  discount,
  originalPrice,
  reviewCount,
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
        <div className="relative overflow-hidden rounded-lg mb-3 bg-gray-100 aspect-[16/9] border border-gray-200 shadow-sm group-hover:shadow-md transition-shadow duration-300">
          <img
            src={imgSrc}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* 배지들 */}
          {badges.length > 0 && (
            <div className="absolute top-6 left-6 flex gap-1">
              {badges.map((badge, index) => (
                <span
                  key={index}
                  className={`px-2.5 py-1 text-xs font-bold flex items-center gap-1 ${
                    badge === "할인"
                      ? "bg-orange-500 text-white rounded-xl"
                      : "border border-white text-white rounded-full"
                  }`}
                >
                  {badge === "VOD" && (
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  )}
                  {badge}
                </span>
              ))}
            </div>
          )}
          {/* 호버 시 오버레이 효과 */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
        </div>

        {/* 상품 정보 영역 */}
        <div className="space-y-1.5">
          {/* 상단 정보: 수강기간 | 모집인원 | 강사 */}
          <div className="flex items-center gap-2">
            {(duration || maxStudents) && (
              <div className="flex items-center gap-1 text-xs text-gray-600 border border-gray-300 rounded px-2 py-1 w-fit">
                {duration && (
                  <div className="flex items-center gap-0.5">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{duration}</span>
                  </div>
                )}
                {duration && maxStudents && <span>|</span>}
                {maxStudents && (
                  <div className="flex items-center gap-0.5">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>{maxStudents}</span>
                  </div>
                )}
              </div>
            )}
            {instructor && (
              <span className="text-xs text-gray-600">{instructor}</span>
            )}
          </div>

          {/* 제목 */}
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
            {title}
          </h3>

          {/* 강사명/모집기간 */}
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{author}</span>
          </div>

          {/* 할부 정보 */}
          {installment && (
            <p className="text-xs text-gray-600">{installment}</p>
          )}

          {/* 할인율 + 가격 + 별점 */}
          <div className="flex items-center gap-2 flex-wrap">
            {discount && (
              <span className="text-base font-bold text-red-500">{discount} 할인</span>
            )}
            <span className="text-base font-bold text-gray-900">{price}원</span>
            <div className="flex items-center">
              <span className="text-yellow-500 text-sm">⭐</span>
              <span className="text-sm font-medium text-gray-900">{rating}</span>
              {reviewCount && (
                <span className="text-sm text-gray-500">({reviewCount})</span>
              )}
            </div>
          </div>

          {/* 원가 */}
          {originalPrice && (
            <p className="text-xs text-gray-500">{originalPrice}</p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
