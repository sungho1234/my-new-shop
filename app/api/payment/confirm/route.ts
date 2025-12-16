import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 결제 승인 API (토스페이먼츠 결제 완료 후 호출)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      orderId,
      paymentKey,
      amount,
      paymentMethod = 'CARD',
      paymentProvider = 'toss',
    } = body;

    console.log('💳 Payment Confirm - orderId:', orderId, ', paymentKey:', paymentKey);

    if (!orderId || !paymentKey || !amount) {
      return NextResponse.json(
        { message: 'Order ID, Payment Key, and Amount are required' },
        { status: 400 }
      );
    }

    // 1. 주문 조회
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        payment: true,
        orderItems: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { message: `Order ${orderId} not found` },
        { status: 404 }
      );
    }

    // 2. 금액 확인 (보안을 위해 서버에서 검증)
    if (order.finalAmount !== amount) {
      console.error('❌ Amount mismatch:', order.finalAmount, '!=', amount);
      return NextResponse.json(
        { message: 'Amount mismatch' },
        { status: 400 }
      );
    }

    // 3. Payment 업데이트
    const updatedPayment = await prisma.payment.update({
      where: { orderId: order.id },
      data: {
        status: 'COMPLETED',
        paymentMethod,
        paymentProvider,
        transactionId: paymentKey,
        paidAt: new Date(),
      },
    });

    // 4. Order 상태 업데이트
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'PAID',
      },
      include: {
        orderItems: true,
        payment: true,
      },
    });

    console.log('✅ Payment confirmed:', paymentKey, ', Order:', order.orderNumber);

    // 5. 강의 접근 권한 자동 부여
    try {
      for (const item of order.orderItems) {
        await prisma.courseAccess.upsert({
          where: {
            userId_productId: {
              userId: order.userId,
              productId: item.productId,
            },
          },
          update: {
            isActive: true,
            orderId: order.id,
          },
          create: {
            userId: order.userId,
            productId: item.productId,
            orderId: order.id,
            isActive: true,
          },
        });
        console.log('✅ Course access granted:', order.userId, item.productId);
      }
    } catch (accessError) {
      console.error('⚠️ Failed to grant course access:', accessError);
      // 권한 부여 실패해도 결제는 완료 처리
    }

    return NextResponse.json(
      {
        success: true,
        order: updatedOrder,
        payment: updatedPayment,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Error confirming payment:', error);
    return NextResponse.json(
      { message: 'Failed to confirm payment', error: String(error) },
      { status: 500 }
    );
  }
}
