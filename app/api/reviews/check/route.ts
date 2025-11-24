import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/reviews/check?kakaoId=xxx&productId=xxx - 사용자가 이미 후기를 작성했는지 확인
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const kakaoId = searchParams.get('kakaoId');
        const productId = searchParams.get('productId');

        if (!kakaoId || !productId) {
            return NextResponse.json(
                { error: 'kakaoId and productId are required' },
                { status: 400 }
            );
        }

        // kakaoId로 User 찾기
        const user = await prisma.user.findUnique({
            where: { kakaoId: String(kakaoId) }
        });

        if (!user) {
            return NextResponse.json({
                hasReviewed: false,
                review: null
            });
        }

        // 해당 상품에 작성한 후기 확인
        const review = await prisma.review.findUnique({
            where: {
                userId_productId: {
                    userId: user.id,
                    productId: productId
                }
            }
        });

        if (review) {
            return NextResponse.json({
                hasReviewed: true,
                review: {
                    id: review.id,
                    rating: review.rating,
                    content: review.content,
                    createdAt: review.createdAt
                }
            });
        }

        return NextResponse.json({
            hasReviewed: false,
            review: null
        });

    } catch (error) {
        console.error('❌ GET /api/reviews/check error:', error);
        return NextResponse.json(
            { error: 'Failed to check review status' },
            { status: 500 }
        );
    }
}
