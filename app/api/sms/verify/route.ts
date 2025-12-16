import { NextRequest, NextResponse } from 'next/server';
import { smsStore } from '@/lib/smsStore';

export async function POST(req: NextRequest) {
  try {
    const { phone, code } = await req.json();

    // 입력값 검증
    if (!phone || !code) {
      return NextResponse.json(
        { error: '전화번호와 인증 코드를 입력해주세요.' },
        { status: 400 }
      );
    }

    // 전화번호 정규화 (하이픈 제거)
    const normalizedPhone = phone.replace(/-/g, '');

    // 인증 코드 확인
    const result = smsStore.verify(normalizedPhone, code);

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error('SMS Verify Error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
