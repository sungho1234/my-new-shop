import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 주문 목록 조회 (사용자별)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const kakaoId = searchParams.get('kakaoId');
    const userId = searchParams.get('userId');
    const orderNumber = searchParams.get('orderNumber');

    // 특정 주문 번호로 조회
    if (orderNumber) {
      const order = await prisma.order.findUnique({
        where: { orderNumber },
        include: {
          orderItems: true,
          payment: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!order) {
        return NextResponse.json(
          { message: `Order ${orderNumber} not found` },
          { status: 404 }
        );
      }

      return NextResponse.json({ order }, { status: 200 });
    }

    // 사용자별 주문 목록 조회
    let actualUserId = userId;

    if (kakaoId) {
      const user = await prisma.user.findUnique({
        where: { kakaoId: String(kakaoId) },
      });

      if (!user) {
        return NextResponse.json(
          { message: `User with Kakao ID ${kakaoId} not found` },
          { status: 404 }
        );
      }

      actualUserId = user.id;
    }

    if (!actualUserId) {
      return NextResponse.json(
        { message: 'User ID or Kakao ID is required' },
        { status: 400 }
      );
    }

    const orders = await prisma.order.findMany({
      where: { userId: actualUserId },
      include: {
        orderItems: true,
        payment: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error('❌ Error fetching orders:', error);
    return NextResponse.json(
      { message: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
