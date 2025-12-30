import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getAuthOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    // NextAuth 세션 확인
    const session = await getServerSession(getAuthOptions());

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const { phone, birthday, gender } = await req.json();

    // 전화번호 필수 확인
    if (!phone) {
      return NextResponse.json(
        { error: '전화번호는 필수입니다.' },
        { status: 400 }
      );
    }

    // 전화번호 유효성 검사
    if (!/^01[0-9]{1}-[0-9]{3,4}-[0-9]{4}$/.test(phone)) {
      return NextResponse.json(
        { error: '올바른 전화번호 형식이 아닙니다.' },
        { status: 400 }
      );
    }

    // 사용자 찾기
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 이미 프로필 완료된 경우
    if (user.isProfileComplete) {
      return NextResponse.json(
        { error: '이미 프로필이 완료되었습니다.' },
        { status: 400 }
      );
    }

    // 전화번호 중복 체크
    const existingPhone = await prisma.user.findFirst({
      where: {
        phone,
        id: { not: user.id },
      },
    });

    if (existingPhone) {
      return NextResponse.json(
        { error: '이미 사용 중인 전화번호입니다.' },
        { status: 400 }
      );
    }

    // 프로필 업데이트
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        phone,
        phoneVerified: true, // SMS 인증 완료했으므로 true
        birthday: birthday || null,
        gender: gender || null,
        isProfileComplete: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: '프로필이 성공적으로 업데이트되었습니다.',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        birthday: updatedUser.birthday,
        gender: updatedUser.gender,
        isProfileComplete: updatedUser.isProfileComplete,
      },
    });
  } catch (error) {
    console.error('Complete Profile Error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
