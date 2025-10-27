import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // 1단계에서 만든 'Prisma 도우미'

export async function POST(request: Request) {
  try {
    // 1. 브라우저(AuthContext)가 보낸 유저 정보를 받습니다.
    const body = await request.json();
    const { id, nickname, email, profileImage } = body;

    // 2. 필수 정보(카카오 ID)가 있는지 확인합니다.
    if (!id) {
      return NextResponse.json({ error: 'Kakao ID is required' }, { status: 400 });
    }

    const kakaoIdString = String(id); // ID를 문자열로 변환

    // 3. DB에서 이 'kakaoId'로 유저를 찾습니다.
    const user = await prisma.user.findUnique({
      where: { kakaoId: kakaoIdString },
    });

    let dbUser;

    if (user) {
      // 4. [로그인] 유저가 이미 DB에 있다면, 최신 정보로 '업데이트'합니다.
      dbUser = await prisma.user.update({
        where: { kakaoId: kakaoIdString },
        data: {
          name: nickname, // 'name' 필드에 'nickname' 저장
          email: email,
          image: profileImage, // 'image' 필드에 'profileImage' 저장
        },
      });
    } else {
      // 5. [회원가입] 유저가 DB에 없다면, '새로 생성'합니다.
      dbUser = await prisma.user.create({
        data: {
          kakaoId: kakaoIdString,
          name: nickname,
          email: email,
          image: profileImage,
        },
      });
    }

    // 6. 처리된 유저 정보를 브라우저에 다시 보내줍니다.
    return NextResponse.json(dbUser, { status: 200 });

  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}