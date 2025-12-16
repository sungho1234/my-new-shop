import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/reviews?productId=xxx - 특정 상품의 후기 조회
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('productId');

        if (!productId) {
            return NextResponse.json(
                { error: 'productId is required' },
                { status: 400 }
            );
        }

        // 최신순으로 정렬 (createdAt DESC)
        const reviews = await prisma.review.findMany({
            where: { productId },
            include: {
                user: {
                    select: {
                        kakaoId: true,  // kakaoId 추가 (클라이언트 비교용)
                        name: true,
                        email: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc' // 최신 후기가 맨 위로
            }
        });

        // 평균 별점 계산
        const averageRating = reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;

        // 응답 데이터 형식 변환
        const formattedReviews = reviews.map(review => ({
            id: review.id,
            userId: review.userId,  // userId 추가 (DB cuid)
            kakaoId: review.user.kakaoId,  // kakaoId 추가 (클라이언트 비교용)
            userName: review.user.name || '사용자',
            rating: review.rating,
            content: review.content,
            createdAt: review.createdAt,
            // 상대적인 날짜 표시를 위한 계산
            date: getRelativeTime(review.createdAt)
        }));

        return NextResponse.json({
            reviews: formattedReviews,
            totalCount: reviews.length,
            averageRating: Math.round(averageRating * 10) / 10 // 소수점 1자리
        });

    } catch (error) {
        console.error('❌ GET /api/reviews error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch reviews' },
            { status: 500 }
        );
    }
}

// POST /api/reviews - 후기 작성
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { kakaoId, productId, rating, content } = body;

        // 입력값 검증
        if (!kakaoId || !productId || !rating || !content) {
            return NextResponse.json(
                { error: 'kakaoId, productId, rating, content are required' },
                { status: 400 }
            );
        }

        if (rating < 1 || rating > 5) {
            return NextResponse.json(
                { error: 'Rating must be between 1 and 5' },
                { status: 400 }
            );
        }

        // 1. kakaoId로 User 찾기
        const user = await prisma.user.findUnique({
            where: { kakaoId: String(kakaoId) }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // 2. 구매 여부 확인 (CourseAccess를 통해)
        const courseAccess = await prisma.courseAccess.findFirst({
            where: {
                userId: user.id,
                productId: productId,
                isActive: true
            }
        });

        if (!courseAccess) {
            return NextResponse.json(
                { error: 'You must purchase this product before writing a review' },
                { status: 403 }
            );
        }

        // 3. 이미 후기 작성했는지 확인
        const existingReview = await prisma.review.findUnique({
            where: {
                userId_productId: {
                    userId: user.id,
                    productId: productId
                }
            }
        });

        if (existingReview) {
            return NextResponse.json(
                { error: 'You have already written a review for this product' },
                { status: 409 }
            );
        }

        // 4. 후기 생성
        const review = await prisma.review.create({
            data: {
                userId: user.id,
                productId,
                rating,
                content
            },
            include: {
                user: {
                    select: {
                        kakaoId: true,  // kakaoId 추가
                        name: true,
                        email: true,
                    }
                }
            }
        });

        console.log('✅ Review created:', review.id);

        return NextResponse.json({
            success: true,
            review: {
                id: review.id,
                userId: review.userId,  // userId 추가
                kakaoId: review.user.kakaoId,  // kakaoId 추가
                userName: review.user.name || '사용자',
                rating: review.rating,
                content: review.content,
                createdAt: review.createdAt,
                date: getRelativeTime(review.createdAt)
            }
        }, { status: 201 });

    } catch (error) {
        console.error('❌ POST /api/reviews error:', error);
        return NextResponse.json(
            { error: 'Failed to create review' },
            { status: 500 }
        );
    }
}

// 상대적인 시간 표시 함수
function getRelativeTime(date: Date): string {
    const now = new Date();
    const diffInMs = now.getTime() - new Date(date).getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);

    if (diffInMinutes < 1) return '방금 전';
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    if (diffInDays < 7) return `${diffInDays}일 전`;
    if (diffInWeeks < 4) return `${diffInWeeks}주 전`;
    if (diffInMonths < 12) return `${diffInMonths}개월 전`;
    return `${Math.floor(diffInMonths / 12)}년 전`;
}
