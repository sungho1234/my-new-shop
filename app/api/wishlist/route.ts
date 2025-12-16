import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma'; // Prisma 클라이언트 (prisma.ts)

// 'kakaoId'를 기반으로 DB User의 '내부 ID'를 찾는 '보안 헬퍼'
async function getDbUserId(kakaoId: string): Promise<string | null> {
  if (!kakaoId) {
    console.warn("⚠️ getDbUserId: kakaoId가 비어있음");
    return null;
  }
  try {
    const kakaoIdStr = String(kakaoId);
    console.log("🔍 getDbUserId: 검색 시작 - kakaoId (타입:", typeof kakaoId, ", 값:", kakaoId, ", 변환 후:", kakaoIdStr, ")");

    const user = await prisma.user.findUnique({
      where: { kakaoId: kakaoIdStr },
      select: { id: true, kakaoId: true, name: true }, // 디버깅을 위해 추가 정보도 가져옴
    });

    if (user) {
      console.log("✅ getDbUserId: 사용자 찾음 - userId:", user.id, ", DB kakaoId:", user.kakaoId, ", name:", user.name);
    } else {
      console.warn("❌ getDbUserId: 사용자 없음 - kakaoId:", kakaoIdStr);
      // 모든 사용자 출력 (디버깅용)
      const allUsers = await prisma.user.findMany({ select: { kakaoId: true, name: true } });
      console.log("📋 DB에 존재하는 모든 사용자 kakaoId:", allUsers.map(u => ({ kakaoId: u.kakaoId, name: u.name })));
    }

    return user?.id || null;
  } catch (error) {
    console.error("❌ getDbUserId 에러 (Prisma 쿼리 실패):", error);
    return null;
  }
}

// 1. 찜 목록 '조회' (GET 요청) – kakaoId 또는 userId로 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const kakaoId = searchParams.get('kakaoId');
    const userId = searchParams.get('userId'); // 네이버/구글 로그인용
    console.log("📋 GET /api/wishlist: kakaoId =", kakaoId, ", userId =", userId);

    let dbUserId: string | null = null;

    if (userId) {
      // userId가 있으면 직접 사용 (네이버/구글 로그인)
      dbUserId = userId;
    } else if (kakaoId) {
      // kakaoId로 조회 (카카오 로그인)
      dbUserId = await getDbUserId(String(kakaoId));
    } else {
      return NextResponse.json({ error: 'kakaoId or userId is required' }, { status: 400 });
    }

    if (!dbUserId) {
      return NextResponse.json({ error: 'User not found in DB' }, { status: 404 });
    }

    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId: dbUserId },
    });
    console.log("✅ GET 성공: wishlist 길이 =", wishlistItems.length);
    return NextResponse.json(wishlistItems, { status: 200 });
  } catch (error) {
    console.error("❌ GET /api/wishlist 전체 에러:", error);
    return NextResponse.json({ error: 'Server error during fetch' }, { status: 500 });
  }
}

// 2. 찜 '추가' (POST 요청) – kakaoId 또는 userId 지원
export async function POST(request: Request) {
  try {
    console.log("❤️ POST /api/wishlist 시작");
    const body = await request.json();
    console.log("📥 POST body:", body);

    const { kakaoId, userId, product } = body;
    if (!product || !product.id) {
      console.warn("⚠️ POST: product.id 누락");
      return NextResponse.json({ error: 'product.id is required' }, { status: 400 });
    }

    let dbUserId: string | null = null;

    if (userId) {
      // userId가 있으면 직접 사용 (네이버/구글 로그인)
      dbUserId = userId;
    } else if (kakaoId) {
      // kakaoId로 조회 (카카오 로그인)
      dbUserId = await getDbUserId(String(kakaoId));
    } else {
      return NextResponse.json({ error: 'kakaoId or userId is required' }, { status: 400 });
    }

    if (!dbUserId) {
      console.warn("⚠️ POST: User not found");
      return NextResponse.json({ error: 'User not found in DB' }, { status: 404 });
    }

    console.log("➕ POST: userId =", dbUserId, ", productId =", product.id);
    const newWishlistItem = await prisma.wishlistItem.create({
      data: {
        userId: dbUserId,
        productId: product.id,
      },
    });

    console.log("✅ POST 성공: 새 WishlistItem ID =", newWishlistItem.id);
    return NextResponse.json(newWishlistItem, { status: 201 });
  } catch (error: any) {
    console.error("❌ POST /api/wishlist 에러 상세:", error);
    if (error.code === 'P2002') {
      console.log("🔄 POST: 이미 찜된 상품 – 409 반환");
      return NextResponse.json({ error: 'Item already in wishlist' }, { status: 409 });
    }
    console.error("🚨 POST: 기타 서버 에러");
    return NextResponse.json({ error: 'Failed to add to wishlist: ' + error.message }, { status: 500 });
  }
}

// 3. 찜 '삭제' (DELETE 요청) – kakaoId 또는 userId 지원
export async function DELETE(request: NextRequest) {
  try {
    console.log("🗑️ DELETE /api/wishlist 시작");
    const { searchParams } = new URL(request.url);
    const kakaoId = searchParams.get('kakaoId');
    const userId = searchParams.get('userId');
    const productId = searchParams.get('productId');
    console.log("📥 DELETE params: kakaoId =", kakaoId, ", userId =", userId, ", productId =", productId);

    if (!productId) {
      return NextResponse.json({ error: 'productId is required' }, { status: 400 });
    }

    let dbUserId: string | null = null;

    if (userId) {
      // userId가 있으면 직접 사용 (네이버/구글 로그인)
      dbUserId = userId;
    } else if (kakaoId) {
      // kakaoId로 조회 (카카오 로그인)
      dbUserId = await getDbUserId(String(kakaoId));
    } else {
      return NextResponse.json({ error: 'kakaoId or userId is required' }, { status: 400 });
    }

    if (!dbUserId) {
      return NextResponse.json({ error: 'User not found in DB' }, { status: 404 });
    }

    console.log("🔍 DELETE: userId =", dbUserId, ", productId =", productId);
    const wishlistItem = await prisma.wishlistItem.findFirst({
      where: {
        userId: dbUserId,
        productId: productId,
      },
    });

    if (!wishlistItem) {
      console.warn("⚠️ DELETE: Wishlist item not found");
      return NextResponse.json({ error: 'Wishlist item not found' }, { status: 404 });
    }

    await prisma.wishlistItem.delete({
      where: { id: wishlistItem.id },
    });

    console.log("✅ DELETE 성공: ID =", wishlistItem.id, " 삭제됨");
    return NextResponse.json({ message: 'Wishlist item deleted' }, { status: 200 });
  } catch (error: any) {
    console.error("❌ DELETE /api/wishlist 에러 상세:", error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Wishlist item not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete item: ' + error.message }, { status: 500 });
  }
}
