import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

// GET: email 또는 kakaoId로 user 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const kakaoId = searchParams.get('kakaoId');

    if (!email && !kakaoId) {
      return NextResponse.json({ error: 'Email or kakaoId is required' }, { status: 400 });
    }

    let user;
    if (email) {
      user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          kakaoId: true,
          naverId: true,
          googleId: true,
          createdAt: true,
        },
      });
    } else if (kakaoId) {
      user = await prisma.user.findUnique({
        where: { kakaoId },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          kakaoId: true,
          naverId: true,
          googleId: true,
          createdAt: true,
        },
      });
    }

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // CUID를 숫자로 변환 (해시)
    const hashCode = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      return Math.abs(hash);
    };

    return NextResponse.json({
      dbId: user.id, // 실제 CUID
      hashedId: hashCode(user.id), // CUID를 숫자로 변환
      name: user.name,
      email: user.email,
      image: user.image,
      kakaoId: user.kakaoId,
      naverId: user.naverId,
      googleId: user.googleId,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error('❌ GET /api/user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
