import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // [수정!] userId 대신 kakaoId를 받습니다.
    const { kakaoId, productId, amount } = body;

    if (!kakaoId || !productId || amount === undefined) {
      return NextResponse.json({ message: 'Kakao ID, Product ID, and amount are required' }, { status: 400 });
    }
    
    // [수정!] 받은 kakaoId(숫자)로 우리 DB에서 User(문자열 id)를 찾습니다.
    const user = await prisma.user.findUnique({
        where: {
            // schema의 kakaoId는 String이므로, 받은 숫자를 문자로 변환해줘야 합니다.
            kakaoId: String(kakaoId),
        }
    });

    // 만약 우리 DB에 해당 카카오 ID를 가진 유저가 없으면 에러를 반환합니다.
    if (!user) {
        return NextResponse.json({ message: `User with Kakao ID ${kakaoId} not found` }, { status: 404 });
    }

    // [수정!] 찾은 유저의 '진짜 ID'(문자열)를 사용하여 구매 기록을 생성합니다.
    const newPurchase = await prisma.purchase.create({
      data: {
        userId: user.id, // DB의 문자열 ID 사용
        productId,
        amount,
      },
    });

    return NextResponse.json(newPurchase, { status: 201 });

  } catch (error) {
    console.error('Error creating purchase:', error);
    return NextResponse.json({ message: 'Failed to create purchase' }, { status: 500 });
  }
}

// GET 함수는 기존과 동일하게 유지합니다.
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    const purchases = await prisma.purchase.findMany({
      where: {
        userId: userId,
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
