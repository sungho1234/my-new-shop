import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: 사용자의 모든 거래 기록 조회
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const kakaoId = searchParams.get('kakaoId');

    if (!kakaoId) {
      return NextResponse.json({ error: 'kakaoId is required' }, { status: 400 });
    }

    // kakaoId로 User를 찾기
    const user = await prisma.user.findUnique({
      where: { kakaoId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 사용자의 모든 거래 기록을 최신순으로 조회
    const records = await prisma.tradingRecord.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(records, { status: 200 });
  } catch (error) {
    console.error('GET /api/trading-records Error:', error);
    return NextResponse.json({ error: 'Failed to fetch trading records' }, { status: 500 });
  }
}

// POST: 새로운 거래 기록 생성
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('📝 POST /api/trading-records - Received data:', body);

    const {
      kakaoId,
      no,
      symbol,
      entryDateTime,
      exitDateTime,
      positionDirection,
      leverage,
      positionSize,
      entryPrice,
      exitPrice,
      pnl,
      roi,
      roundTripFee,
      entryReason,
      exitReason,
      entryEmotion,
      exitEmotion,
      lessonLearned,
    } = body;

    // 필수 필드 검증
    if (!kakaoId || !symbol || !entryDateTime || !exitDateTime || !positionDirection) {
      console.error('❌ Missing required fields');
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // kakaoId로 User를 찾기, 없으면 생성
    console.log('🔍 Looking for user with kakaoId:', kakaoId);
    let user = await prisma.user.findUnique({
      where: { kakaoId: String(kakaoId) },
    });

    if (!user) {
      console.log('⚠️ User not found in DB, creating minimal user record...');
      // 프론트엔드 로그인이 DB와 동기화되지 않은 경우를 처리하기 위해 최소 사용자 레코드 생성
      user = await prisma.user.create({
        data: {
          kakaoId: String(kakaoId),
          name: '사용자', // 기본 이름, 정상 로그인 시 업데이트됨
        },
      });
      console.log('✅ Minimal user created:', user.id);
    } else {
      console.log('✅ User found:', user.id);
    }

    // 새로운 거래 기록 생성
    console.log('💾 Creating new trading record...');
    const newRecord = await prisma.tradingRecord.create({
      data: {
        userId: user.id,
        no,
        symbol,
        entryDateTime,
        exitDateTime,
        positionDirection,
        leverage,
        positionSize,
        entryPrice,
        exitPrice,
        pnl,
        roi,
        roundTripFee,
        entryReason: entryReason || '',
        exitReason: exitReason || '',
        entryEmotion: entryEmotion || '',
        exitEmotion: exitEmotion || '',
        lessonLearned: lessonLearned || '',
      },
    });

    console.log('✅ Trading record created successfully:', newRecord.id);
    return NextResponse.json(newRecord, { status: 201 });
  } catch (error) {
    console.error('❌ POST /api/trading-records Error:', error);
    return NextResponse.json({
      error: 'Failed to create trading record',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
