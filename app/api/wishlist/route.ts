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

// 1. 찜 목록 '조회' (GET 요청) – 기존 유지, 로그 추가
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const kakaoId = searchParams.get('kakaoId');
    console.log("📋 GET /api/wishlist: kakaoId =", kakaoId);

    if (!kakaoId) {
      return NextResponse.json({ error: 'Kakao ID is required' }, { status: 400 });
    }

    const userId = await getDbUserId(String(kakaoId));
    if (!userId) {
      return NextResponse.json({ error: 'User not found in DB' }, { status: 404 });
    }

    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId: userId },
      // include: { user: true } // 나중에 필요 시
    });
    console.log("✅ GET 성공: wishlist 길이 =", wishlistItems.length);
    return NextResponse.json(wishlistItems, { status: 200 });
  } catch (error) {
    console.error("❌ GET /api/wishlist 전체 에러:", error);
    return NextResponse.json({ error: 'Server error during fetch' }, { status: 500 });
  }
}

// 2. 찜 '추가' (POST 요청) – 에러 핸들링 강화
export async function POST(request: Request) {
  try {
    console.log("❤️ POST /api/wishlist 시작");
    const body = await request.json();
    console.log("📥 POST body:", body); // { kakaoId: number, product: { id: string, ... } }

    const { kakaoId, product } = body;
    if (!kakaoId || !product || !product.id) {
      console.warn("⚠️ POST: kakaoId 또는 product.id 누락 – kakaoId:", kakaoId, ", product.id:", product?.id);
      return NextResponse.json({ error: 'kakaoId and product.id are required' }, { status: 400 });
    }

    const userId = await getDbUserId(String(kakaoId));
    if (!userId) {
      console.warn("⚠️ POST: User not found – kakaoId:", kakaoId);
      return NextResponse.json({ error: 'User not found in DB' }, { status: 404 });
    }

    console.log("➕ POST: userId =", userId, ", productId =", product.id, " – Prisma create 시도");
    const newWishlistItem = await prisma.wishlistItem.create({
      data: {
        userId: userId,
        productId: product.id, // 상품의 고유 ID (e.g., 'general-growth')
        // title: product.title, // 옵션: WishlistItem에 추가 필드 있으면
        // thumbnail: product.thumbnail,
      },
    });

    console.log("✅ POST 성공: 새 WishlistItem ID =", newWishlistItem.id);
    return NextResponse.json(newWishlistItem, { status: 201 });
  } catch (error: any) {
    console.error("❌ POST /api/wishlist 에러 상세:", error);
    if (error.code === 'P2002') { // Prisma unique violation (이미 찜)
      console.log("🔄 POST: 이미 찜된 상품 – 409 반환");
      return NextResponse.json({ error: 'Item already in wishlist' }, { status: 409 });
    }
    if (error.message?.includes('PrismaClientInitializationError') || error.message?.includes('DB connection')) {
      console.error("🚨 POST: DB 연결/Prisma 초기화 실패");
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }
    // 기타 에러 (e.g., invalid data, network)
    console.error("🚨 POST: 기타 서버 에러");
    return NextResponse.json({ error: 'Failed to add to wishlist: ' + error.message }, { status: 500 });
  }
}

// 3. 찜 '삭제' (DELETE 요청) – 에러 핸들링 강화
export async function DELETE(request: NextRequest) {
  try {
    console.log("🗑️ DELETE /api/wishlist 시작");
    const { searchParams } = new URL(request.url);
    const kakaoId = searchParams.get('kakaoId');
    const productId = searchParams.get('productId');
    console.log("📥 DELETE params: kakaoId =", kakaoId, ", productId =", productId);

    if (!kakaoId || !productId) {
      return NextResponse.json({ error: 'kakaoId and productId are required' }, { status: 400 });
    }

    const userId = await getDbUserId(String(kakaoId));
    if (!userId) {
      return NextResponse.json({ error: 'User not found in DB' }, { status: 404 });
    }

    console.log("🔍 DELETE: userId =", userId, ", productId =", productId, " – findFirst 시도");
    const wishlistItem = await prisma.wishlistItem.findFirst({
      where: {
        userId: userId,
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
    if (error.code === 'P2025') { // Prisma not found
      return NextResponse.json({ error: 'Wishlist item not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete item: ' + error.message }, { status: 500 });
  }
}
