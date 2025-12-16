import { NextRequest, NextResponse } from 'next/server';
import { smsStore } from '@/lib/smsStore';

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();

    // 전화번호 정규화 (하이픈 제거)
    const normalizedPhone = phone.replace(/-/g, '');

    // 전화번호 유효성 검사
    if (!phone || !/^01[0-9]{8,9}$/.test(normalizedPhone)) {
      return NextResponse.json(
        { error: '올바른 전화번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    // 6자리 랜덤 인증 코드 생성
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // NHN Cloud SMS API 설정
    const NHN_APP_KEY = process.env.NHN_SMS_APP_KEY;
    const NHN_SECRET_KEY = process.env.NHN_SMS_SECRET_KEY;
    const NHN_SENDER_NUMBER = process.env.NHN_SMS_SENDER_NUMBER;

    if (!NHN_APP_KEY || !NHN_SECRET_KEY || !NHN_SENDER_NUMBER) {
      // 개발 환경: 콘솔에 인증 코드 출력
      console.log('─────────────────────────────────────');
      console.log('📱 [개발 모드] SMS 인증 코드');
      console.log(`전화번호: ${normalizedPhone}`);
      console.log(`인증코드: ${code}`);
      console.log('─────────────────────────────────────');

      // 메모리에 인증 코드 저장 (정규화된 번호로 저장)
      smsStore.set(normalizedPhone, code);

      return NextResponse.json({
        success: true,
        message: '개발 모드: 콘솔에서 인증 코드를 확인하세요.',
        devMode: true,
        code, // 개발 환경에서만 코드 반환
      });
    }

    // NHN Cloud SMS API 호출
    const response = await fetch(
      `https://api-sms.cloud.toast.com/sms/v3.0/appKeys/${NHN_APP_KEY}/sender/sms`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Secret-Key': NHN_SECRET_KEY,
        },
        body: JSON.stringify({
          body: `[MAXX Systems] 인증번호: ${code}\n5분 이내에 입력해주세요.`,
          sendNo: NHN_SENDER_NUMBER,
          recipientList: [
            {
              recipientNo: normalizedPhone,
              internationalRecipientNo: '82' + normalizedPhone.substring(1),
            },
          ],
        }),
      }
    );

    const result = await response.json();

    if (!response.ok || result.header.resultCode !== 0) {
      console.error('NHN SMS API Error:', result);
      return NextResponse.json(
        { error: 'SMS 발송에 실패했습니다. 잠시 후 다시 시도해주세요.' },
        { status: 500 }
      );
    }

    // 메모리에 인증 코드 저장 (정규화된 번호로 저장)
    smsStore.set(normalizedPhone, code);

    return NextResponse.json({
      success: true,
      message: '인증 코드가 발송되었습니다.',
    });
  } catch (error) {
    console.error('SMS Send Error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
