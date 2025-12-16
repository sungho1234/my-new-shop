import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 토스페이먼츠 웹훅 처리 API
// 결제 상태 변경 시 토스 서버에서 이 API를 호출합니다
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventType, data } = body;

    console.log('🔔 Webhook received:', eventType, ', data:', data);

    // 이벤트 타입별 처리
    switch (eventType) {
      case 'PAYMENT_CONFIRM_SUCCESS':
        return await handlePaymentSuccess(data);

      case 'PAYMENT_CANCEL':
        return await handlePaymentCancel(data);

      case 'PAYMENT_REFUND':
        return await handlePaymentRefund(data);

      default:
        console.log('⚠️ Unknown event type:', eventType);
        return NextResponse.json(
          { message: 'Unknown event type' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json(
      { message: 'Webhook processing failed', error: String(error) },
      { status: 500 }
    );
  }
}

// 결제 성공 처리
async function handlePaymentSuccess(data: any) {
  const { paymentKey, orderId, status } = data;

  // Payment 조회
  const payment = await prisma.payment.findFirst({
    where: { transactionId: paymentKey },
    include: { order: true },
  });

  if (!payment) {
    console.error('❌ Payment not found:', paymentKey);
    return NextResponse.json(
      { message: 'Payment not found' },
      { status: 404 }
    );
  }

  // 이미 처리된 결제인지 확인
  if (payment.status === 'COMPLETED') {
    console.log('⚠️ Payment already processed:', paymentKey);
    return NextResponse.json({ message: 'Already processed' }, { status: 200 });
  }

  // Payment 상태 업데이트
  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: 'COMPLETED',
      paidAt: new Date(),
    },
  });

  // Order 상태 업데이트 및 주문 정보 조회
  const order = await prisma.order.update({
    where: { id: payment.orderId },
    data: { status: 'COMPLETED' },
    include: {
      orderItems: true,
    },
  });

  // 강의 접근 권한 자동 부여
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
    }
  } catch (accessError) {
    console.error('⚠️ Failed to grant course access:', accessError);
  }

  console.log('✅ Payment success processed:', paymentKey);

  return NextResponse.json({ success: true }, { status: 200 });
}

// 결제 취소 처리
async function handlePaymentCancel(data: any) {
  const { paymentKey, cancelReason } = data;

  const payment = await prisma.payment.findFirst({
    where: { transactionId: paymentKey },
  });

  if (!payment) {
    return NextResponse.json(
      { message: 'Payment not found' },
      { status: 404 }
    );
  }

  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: 'CANCELLED',
      cancelledAt: new Date(),
      failReason: cancelReason,
    },
  });

  await prisma.order.update({
    where: { id: payment.orderId },
    data: { status: 'CANCELLED' },
  });

  console.log('✅ Payment cancelled:', paymentKey);

  return NextResponse.json({ success: true }, { status: 200 });
}

// 환불 처리
async function handlePaymentRefund(data: any) {
  const { paymentKey, refundReason } = data;

  const payment = await prisma.payment.findFirst({
    where: { transactionId: paymentKey },
  });

  if (!payment) {
    return NextResponse.json(
      { message: 'Payment not found' },
      { status: 404 }
    );
  }

  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: 'REFUNDED',
      refundedAt: new Date(),
      failReason: refundReason,
    },
  });

  const order = await prisma.order.update({
    where: { id: payment.orderId },
    data: { status: 'REFUNDED' },
    include: {
      orderItems: true,
    },
  });

  // 강의 접근 권한 비활성화
  try {
    for (const item of order.orderItems) {
      await prisma.courseAccess.updateMany({
        where: {
          userId: order.userId,
          productId: item.productId,
          orderId: order.id,
        },
        data: {
          isActive: false,
        },
      });
    }
    console.log('✅ Course access revoked for refund');
  } catch (accessError) {
    console.error('⚠️ Failed to revoke course access:', accessError);
  }

  console.log('✅ Payment refunded:', paymentKey);

  return NextResponse.json({ success: true }, { status: 200 });
}
