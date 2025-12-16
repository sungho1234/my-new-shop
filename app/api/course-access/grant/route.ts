import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 강의 접근 권한 부여
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, productId, orderId } = body;

    if (!userId || !productId) {
      return NextResponse.json(
        { message: 'User ID and Product ID are required' },
        { status: 400 }
      );
    }

    // 이미 접근 권한이 있는지 확인
    const existingAccess = await prisma.courseAccess.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existingAccess) {
      // 이미 있으면 활성화
      const updatedAccess = await prisma.courseAccess.update({
        where: { id: existingAccess.id },
        data: { isActive: true },
      });

      return NextResponse.json({
        success: true,
        access: updatedAccess,
        message: '강의 접근 권한이 활성화되었습니다.',
      });
    }

    // 새로 생성
    const access = await prisma.courseAccess.create({
      data: {
        userId,
        productId,
        orderId,
        isActive: true,
      },
    });

    console.log('✅ Course access granted:', userId, productId);

    return NextResponse.json({
      success: true,
      access,
      message: '강의 접근 권한이 부여되었습니다.',
    });
  } catch (error) {
    console.error('❌ Error granting course access:', error);
    return NextResponse.json(
      { message: 'Failed to grant course access', error: String(error) },
      { status: 500 }
    );
  }
}
