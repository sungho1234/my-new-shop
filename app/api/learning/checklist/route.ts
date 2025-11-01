import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// kakaoId를 기반으로 DB User의 내부 ID를 찾는 헬퍼 함수
async function getDbUserId(kakaoId: string): Promise<string | null> {
    if (!kakaoId) return null;
    try {
        const user = await prisma.user.findUnique({
            where: { kakaoId: String(kakaoId) },
            select: { id: true }
        });
        console.log('🔍 getDbUserId: kakaoId =', kakaoId, ', found userId =', user?.id || 'null');
        return user?.id || null;
    } catch (error) {
        console.error('❌ getDbUserId 에러:', error);
        return null;
    }
}

// GET: 체크리스트 불러오기
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const kakaoId = searchParams.get('kakaoId');
        const productId = searchParams.get('productId');
        console.log('📋 GET /api/learning/checklist: kakaoId =', kakaoId, ', productId =', productId);

        if (!kakaoId || !productId) {
            return NextResponse.json(
                { error: 'kakaoId and productId are required' },
                { status: 400 }
            );
        }

        const userId = await getDbUserId(String(kakaoId));
        if (!userId) {
            return NextResponse.json(
                { error: 'User not found in DB' },
                { status: 404 }
            );
        }

        const checklists = await prisma.userChecklist.findMany({
            where: {
                userId: userId,
                productId: productId
            }
        });

        console.log('✅ GET 성공: checklist 개수 =', checklists.length);
        return NextResponse.json(checklists, { status: 200 });
    } catch (error: any) {
        console.error('❌ GET /api/learning/checklist 에러:', error);
        return NextResponse.json(
            { error: 'Failed to fetch checklists: ' + error.message },
            { status: 500 }
        );
    }
}

// POST: 체크리스트 항목 저장
export async function POST(request: NextRequest) {
    try {
        console.log('💾 POST /api/learning/checklist 시작');
        const body = await request.json();
        console.log('📥 POST body:', body);

        const { kakaoId, productId, checklistId, completed, completedAt } = body;

        if (!kakaoId || !productId || checklistId === undefined) {
            console.warn('⚠️ POST: 필수 필드 누락');
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const userId = await getDbUserId(String(kakaoId));
        if (!userId) {
            return NextResponse.json(
                { error: 'User not found in DB' },
                { status: 404 }
            );
        }

        console.log('➕ POST: upsert 시도, userId =', userId);
        const result = await prisma.userChecklist.upsert({
            where: {
                userId_productId_checklistId: {
                    userId: userId,
                    productId: productId,
                    checklistId: checklistId
                }
            },
            update: {
                completed: completed,
                completedAt: completedAt
            },
            create: {
                userId: userId,
                productId: productId,
                checklistId: checklistId,
                completed: completed,
                completedAt: completedAt
            }
        });

        console.log('✅ POST 성공: checklist ID =', result.id);
        return NextResponse.json({ success: true, data: result }, { status: 200 });
    } catch (error: any) {
        console.error('❌ POST /api/learning/checklist 에러 상세:', error);
        return NextResponse.json(
            { error: 'Failed to save checklist item: ' + error.message },
            { status: 500 }
        );
    }
}
