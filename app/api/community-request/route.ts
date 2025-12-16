import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

// kakaoId를 기반으로 DB User의 내부 ID를 찾는 헬퍼 함수
async function getDbUserId(kakaoId: string): Promise<string | null> {
  if (!kakaoId) return null;
  try {
    const user = await prisma.user.findUnique({
      where: { kakaoId: String(kakaoId) },
      select: { id: true }
    });
    console.log('🔍 getDbUserId (community): kakaoId =', kakaoId, ', found userId =', user?.id || 'null');
    return user?.id || null;
  } catch (error) {
    console.error('❌ getDbUserId 에러:', error);
    return null;
  }
}

// GET: 사용자의 커뮤니티 가입 신청 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const kakaoId = searchParams.get('userId'); // 프론트에서 user.id (kakaoId)로 보냄
    const productId = searchParams.get('productId');

    if (!kakaoId || !productId) {
      return NextResponse.json(
        { error: 'userId and productId are required' },
        { status: 400 }
      );
    }

    // kakaoId를 실제 DB userId로 변환
    const userId = await getDbUserId(String(kakaoId));
    if (!userId) {
      return NextResponse.json(
        { error: 'User not found in DB' },
        { status: 404 }
      );
    }

    const existingRequest = await prisma.communityRequest.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    return NextResponse.json({
      exists: !!existingRequest,
      request: existingRequest,
    });
  } catch (error) {
    console.error('GET /api/community-request error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST: 커뮤니티 가입 신청
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId: kakaoId, productId, phone, telegramId } = body;

    if (!kakaoId || !productId || !phone || !telegramId) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // kakaoId를 실제 DB userId로 변환
    const userId = await getDbUserId(String(kakaoId));
    if (!userId) {
      return NextResponse.json(
        { error: 'User not found in DB' },
        { status: 404 }
      );
    }

    // 이미 신청했는지 확인
    const existingRequest = await prisma.communityRequest.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: 'Already submitted', request: existingRequest },
        { status: 409 }
      );
    }

    // 새 신청 생성
    const newRequest = await prisma.communityRequest.create({
      data: {
        userId,
        productId,
        phone,
        telegramId,
        status: 'PENDING',
      },
    });

    return NextResponse.json({
      success: true,
      request: newRequest,
    });
  } catch (error) {
    console.error('POST /api/community-request error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
