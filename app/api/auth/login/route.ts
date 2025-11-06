import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    // 1. [변경] 브라우저로부터 '보안 카드(accessToken)'를 받습니다.
    const { accessToken } = await request.json();

    if (!accessToken) {
      return NextResponse.json({ error: 'Access Token is required' }, { status: 400 });
    }

    // 2. [핵심] '비밀 사무실'(우리 서버)이 '카카오 서버'에게 직접 '보안 카드'가 진짜인지 물어봅니다.
    const kakaoResponse = await fetch('https://kapi.kakao.com/v2/user/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    });

    if (!kakaoResponse.ok) {
      // '보안 카드'가 가짜이거나 만료되었습니다.
      return NextResponse.json({ error: 'Failed to verify Kakao token' }, { status: 401 });
    }

    // 3. '카카오 서버'가 "이 사람은 진짜"라며 '보증된' 유저 정보를 줍니다.
    const kakaoUser = await kakaoResponse.json();

    // 4. [기존 로직] 이 '보증된' 정보로 DB에 회원가입 또는 로그인을 진행합니다.
    const kakaoIdString = String(kakaoUser.id);
    const { nickname, profile_image_url } = kakaoUser.kakao_account.profile;
    const email = kakaoUser.kakao_account.email;

    console.log('🔑 Login attempt - kakaoId:', kakaoIdString, ', nickname:', nickname, ', email:', email);

    const dbUser = await prisma.user.upsert({
      where: { kakaoId: kakaoIdString },
      // [업데이트] 유저가 이미 있다면 (로그인)
      update: {
        name: nickname,
        image: profile_image_url,
        email: email,
      },
      // [생성] 유저가 없다면 (회원가입)
      create: {
        kakaoId: kakaoIdString,
        name: nickname,
        image: profile_image_url,
        email: email,
      },
    });

    console.log('✅ User upserted successfully - DB userId:', dbUser.id, ', kakaoId:', dbUser.kakaoId);

    // 5. [중요] DB에 저장된 정보가 아닌,
    // 프론트엔드(AuthContext)가 사용하는 '원본' 포맷으로 다시 맞춰서 보내줍니다.
    // (이렇게 해야 Header.tsx 등 다른 UI가 깨지지 않습니다.)
    // [수정] id를 숫자가 아닌 문자열로 변환하여 전송 (API에서 String()으로 받기 때문)
    const frontendUserFormat = {
      id: Number(kakaoUser.id), // AuthContext의 User 타입이 number이므로 숫자로 유지
      nickname: nickname,
      profileImage: profile_image_url,
      email: email,
    };

    return NextResponse.json(frontendUserFormat, { status: 200 });

  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}