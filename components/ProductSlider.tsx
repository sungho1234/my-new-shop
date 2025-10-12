"use client";

import Link from 'next/link';
import React from 'react';

interface Product {
  imgSrc: string;
  title: string;
  desc: string;
  price: string;
  href?: string;
}

interface ProductSliderProps {
  title: string;
  products: Product[];
}

const ProductSlider: React.FC<ProductSliderProps> = ({ title, products }) => {

  return (
    // 1. 가장 바깥 section을 flex 컨테이너로 만들어 내부의 div를 중앙 정렬합니다.
    <section className="flex justify-center">
      {/* 2. 제목과 상품 목록을 하나로 묶는 div를 추가합니다. 이 div가 중앙에 배치됩니다. */}
      <div>
        <div className="flex items-center justify-between mb-10">
          <h3 className="text-2xl font-bold">{title}</h3>
          <a href="#" className="text-sm text-gray-500 hover:text-black">모두보기 &gt;</a>
        </div>
        
        {/* 3. 상품 목록에서 justify-center를 제거하여, 묶음 내부에서는 왼쪽 정렬되도록 합니다. */}
        <div className="flex flex-wrap gap-[210px]">
          {products.map((product, index) => (
            <div key={index} className="w-[210px]">
              <div className="product-card-light">
                <Link href={product.href || '#'} legacyBehavior>
                  <a>
                    <img src={product.imgSrc} alt={product.title} className="product-image" />
                    <div className="p-2">
                      <h4 className="product-title-light">{product.title}</h4>
                      <p className="product-desc-light">{product.desc}</p>
                      <div className="product-price-light">{product.price}</div>
                    </div>
                  </a>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSlider;