import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 강의 접근 권한 확인
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const kakaoId = searchParams.get('kakaoId');
    const productId = searchParams.get('productId');

    // userId 또는 kakaoId로 사용자 찾기
    let actualUserId = userId;

    if (kakaoId) {
      const user = await prisma.user.findUnique({
        where: { kakaoId: String(kakaoId) },
      });

      if (!user) {
        return NextResponse.json(
          { hasAccess: false, message: 'User not found' },
          { status: 404 }
        );
      }

      actualUserId = user.id;
    }

    if (!actualUserId) {
      return NextResponse.json(
        { hasAccess: false, message: 'User ID or Kakao ID is required' },
        { status: 400 }
      );
    }

    // 특정 강의 접근 권한 확인
    if (productId) {
      const access = await prisma.courseAccess.findUnique({
        where: {
          userId_productId: {
            userId: actualUserId,
            productId,
          },
        },
      });

      const hasAccess = access && access.isActive;

      return NextResponse.json({
        hasAccess,
        access: hasAccess ? access : null,
      });
    }

    // 사용자의 모든 강의 접근 권한 조회
    const allAccess = await prisma.courseAccess.findMany({
      where: {
        userId: actualUserId,
        isActive: true,
      },
      orderBy: {
        grantedAt: 'desc',
      },
    });

    return NextResponse.json({
      courses: allAccess,
      count: allAccess.length,
    });
  } catch (error) {
    console.error('❌ Error checking course access:', error);
    return NextResponse.json(
      { hasAccess: false, message: 'Failed to check course access' },
      { status: 500 }
    );
  }
}
