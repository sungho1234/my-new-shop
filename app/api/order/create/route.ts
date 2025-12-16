import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 주문 번호 생성 함수
function generateOrderNumber(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ORD-${date}-${random}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { kakaoId, userId, productId, buyerName, buyerEmail, buyerPhone } = body;

    console.log('📦 Order Create - kakaoId:', kakaoId, ', userId:', userId, ', productId:', productId);

    if ((!kakaoId && !userId) || !productId) {
      return NextResponse.json(
        { message: 'User ID (kakaoId or userId) and Product ID are required' },
        { status: 400 }
      );
    }

    // 1. 사용자 찾기 (userId 우선, 없으면 kakaoId)
    let user;
    if (userId) {
      // NextAuth 로그인 (네이버/구글)
      user = await prisma.user.findUnique({
        where: { id: userId },
      });
    } else if (kakaoId) {
      // 카카오 로그인
      user = await prisma.user.findUnique({
        where: { kakaoId: String(kakaoId) },
      });
    }

    if (!user) {
      console.error('❌ User not found - kakaoId:', kakaoId, ', userId:', userId);
      return NextResponse.json(
        { message: `User not found` },
        { status: 404 }
      );
    }

    // 2. 상품 정보 조회 (현재는 하드코딩된 데이터 사용)
    // TODO: Product 테이블에서 조회하도록 수정
    const productData: { [key: string]: { title: string; price: number; discount?: number } } = {
      'first-guide': { title: '초보자를 위한 첫 가이드', price: 100, discount: 0 },
      'system-builder': { title: '시스템 빌더 완성 과정', price: 100, discount: 0 },
      'growth-book': { title: '성장 전략 북', price: 100, discount: 0 },
      'strategy-vol1': { title: '전략 Vol.1', price: 100, discount: 0 },
      'strategy-source': { title: '프로의 전략 원본', price: 100, discount: 0 },
    };

    const product = productData[productId];
    if (!product) {
      return NextResponse.json(
        { message: `Product ${productId} not found` },
        { status: 404 }
      );
    }

    // 3. 가격 계산
    const originalPrice = product.price;
    const discountRate = product.discount || 0;
    const discountAmount = Math.floor(originalPrice * (discountRate / 100));
    const finalAmount = originalPrice - discountAmount;

    // 4. 주문 생성
    const orderNumber = generateOrderNumber();

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: user.id,
        status: 'PENDING',
        totalAmount: originalPrice,
        discountAmount,
        finalAmount,
        buyerName: buyerName || user.name || '',
        buyerEmail: buyerEmail || user.email || '',
        buyerPhone: buyerPhone || '',
        orderItems: {
          create: [
            {
              productId,
              productName: product.title,
              price: finalAmount,
              quantity: 1,
            },
          ],
        },
        payment: {
          create: {
            paymentMethod: 'PENDING', // 결제 수단은 나중에 결제 시 업데이트
            status: 'PENDING',
            amount: finalAmount,
          },
        },
      },
      include: {
        orderItems: true,
        payment: true,
      },
    });

    console.log('✅ Order created:', order.orderNumber);

    return NextResponse.json(
      {
        success: true,
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          totalAmount: order.totalAmount,
          discountAmount: order.discountAmount,
          finalAmount: order.finalAmount,
          status: order.status,
          orderItems: order.orderItems,
          payment: order.payment,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Error creating order:', error);
    return NextResponse.json(
      { message: 'Failed to create order', error: String(error) },
      { status: 500 }
    );
  }
}
