import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // [수정!] userId 대신 kakaoId를 받습니다.
    const { kakaoId, productId, amount } = body;

    console.log('💳 Purchase POST - kakaoId:', kakaoId, '(타입:', typeof kakaoId, '), productId:', productId, ', amount:', amount);

    if (!kakaoId || !productId || amount === undefined) {
      return NextResponse.json({ message: 'Kakao ID, Product ID, and amount are required' }, { status: 400 });
    }

    // [수정!] 받은 kakaoId(숫자)로 우리 DB에서 User(문자열 id)를 찾습니다.
    const kakaoIdStr = String(kakaoId);
    console.log('🔍 User 검색 중 - kakaoId:', kakaoIdStr);

    const user = await prisma.user.findUnique({
        where: {
            // schema의 kakaoId는 String이므로, 받은 숫자를 문자로 변환해줘야 합니다.
            kakaoId: kakaoIdStr,
        }
    });

    // 만약 우리 DB에 해당 카카오 ID를 가진 유저가 없으면 에러를 반환합니다.
    if (!user) {
        console.error('❌ User not found - kakaoId:', kakaoIdStr);
        // 모든 사용자 출력 (디버깅용)
        const allUsers = await prisma.user.findMany({ select: { kakaoId: true, name: true } });
        console.log('📋 DB에 존재하는 모든 사용자:', allUsers.map(u => ({ kakaoId: u.kakaoId, name: u.name })));
        return NextResponse.json({ message: `User with Kakao ID ${kakaoId} not found` }, { status: 404 });
    }

    console.log('✅ User 찾음 - userId:', user.id, ', name:', user.name);

    // [수정!] 찾은 유저의 '진짜 ID'(문자열)를 사용하여 구매 기록을 생성합니다.
    const newPurchase = await prisma.purchase.create({
      data: {
        userId: user.id, // DB의 문자열 ID 사용
        productId,
        amount,
      },
    });

    console.log('✅ Purchase created - id:', newPurchase.id);
    return NextResponse.json(newPurchase, { status: 201 });

  } catch (error) {
    console.error('❌ Error creating purchase:', error);
    return NextResponse.json({ message: 'Failed to create purchase' }, { status: 500 });
  }
}

// GET 함수: userId 또는 kakaoId로 구매내역 조회
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const kakaoId = searchParams.get('kakaoId');

    // kakaoId가 있으면 먼저 User를 찾아서 userId를 얻음
    let actualUserId = userId;

    if (kakaoId) {
      const user = await prisma.user.findUnique({
        where: { kakaoId: String(kakaoId) }
      });

      if (!user) {
        return NextResponse.json({ message: `User with Kakao ID ${kakaoId} not found` }, { status: 404 });
      }

      actualUserId = user.id;
    }

    if (!actualUserId) {
      return NextResponse.json({ message: 'User ID or Kakao ID is required' }, { status: 400 });
    }

    const purchases = await prisma.purchase.findMany({
      where: {
        userId: actualUserId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(purchases, { status: 200 });
  } catch (error) {
    console.error('Error fetching purchases:', error);
    return NextResponse.json({ message: 'Failed to fetch purchases' }, { status: 500 });
  }
}
