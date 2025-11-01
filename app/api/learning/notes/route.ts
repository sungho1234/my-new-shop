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

// GET: 노트 목록 불러오기
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const kakaoId = searchParams.get('kakaoId');
        const productId = searchParams.get('productId');
        console.log('📝 GET /api/learning/notes: kakaoId =', kakaoId, ', productId =', productId);

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

        const notes = await prisma.userNote.findMany({
            where: {
                userId: userId,
                productId: productId
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        console.log('✅ GET 성공: notes 개수 =', notes.length);
        return NextResponse.json(notes, { status: 200 });
    } catch (error: any) {
        console.error('❌ GET /api/learning/notes 에러:', error);
        return NextResponse.json(
            { error: 'Failed to fetch notes: ' + error.message },
            { status: 500 }
        );
    }
}

// POST: 새 노트 생성
export async function POST(request: NextRequest) {
    try {
        console.log('📝 POST /api/learning/notes 시작');
        const body = await request.json();
        console.log('📥 POST body:', body);

        const { kakaoId, productId, noteType, title, content, module } = body;

        if (!kakaoId || !productId || !noteType || !title || !content) {
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

        console.log('➕ POST: note create 시도, userId =', userId);
        const note = await prisma.userNote.create({
            data: {
                userId: userId,
                productId: productId,
                noteType: noteType,
                title: title,
                content: content,
                module: module || 'MODULE 01'
            }
        });

        console.log('✅ POST 성공: note ID =', note.id);
        return NextResponse.json(note, { status: 201 });
    } catch (error: any) {
        console.error('❌ POST /api/learning/notes 에러 상세:', error);
        return NextResponse.json(
            { error: 'Failed to create note: ' + error.message },
            { status: 500 }
        );
    }
}

// DELETE: 노트 삭제
export async function DELETE(request: NextRequest) {
    try {
        console.log('🗑️ DELETE /api/learning/notes 시작');
        const { searchParams } = new URL(request.url);
        const kakaoId = searchParams.get('kakaoId');
        const noteId = searchParams.get('noteId');
        console.log('📥 DELETE params: kakaoId =', kakaoId, ', noteId =', noteId);

        if (!kakaoId || !noteId) {
            return NextResponse.json(
                { error: 'kakaoId and noteId are required' },
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

        // 먼저 노트가 해당 사용자의 것인지 확인
        const note = await prisma.userNote.findUnique({
            where: { id: noteId }
        });

        if (!note) {
            console.warn('⚠️ DELETE: Note not found');
            return NextResponse.json(
                { error: 'Note not found' },
                { status: 404 }
            );
        }

        if (note.userId !== userId) {
            console.warn('⚠️ DELETE: Unauthorized');
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        await prisma.userNote.delete({
            where: { id: noteId }
        });

        console.log('✅ DELETE 성공: note ID =', noteId);
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error: any) {
        console.error('❌ DELETE /api/learning/notes 에러 상세:', error);
        if (error.code === 'P2025') {
            return NextResponse.json(
                { error: 'Note not found' },
                { status: 404 }
            );
        }
        return NextResponse.json(
            { error: 'Failed to delete note: ' + error.message },
            { status: 500 }
        );
    }
}

// PUT: 노트 수정
export async function PUT(request: NextRequest) {
    try {
        console.log('✏️ PUT /api/learning/notes 시작');
        const body = await request.json();
        console.log('📥 PUT body:', body);

        const { kakaoId, noteId, title, content } = body;

        if (!kakaoId || !noteId || !title || !content) {
            console.warn('⚠️ PUT: 필수 필드 누락');
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

        // 먼저 노트가 해당 사용자의 것인지 확인
        const note = await prisma.userNote.findUnique({
            where: { id: noteId }
        });

        if (!note) {
            console.warn('⚠️ PUT: Note not found');
            return NextResponse.json(
                { error: 'Note not found' },
                { status: 404 }
            );
        }

        if (note.userId !== userId) {
            console.warn('⚠️ PUT: Unauthorized');
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        const updatedNote = await prisma.userNote.update({
            where: { id: noteId },
            data: {
                title: title,
                content: content
            }
        });

        console.log('✅ PUT 성공: note ID =', noteId);
        return NextResponse.json(updatedNote, { status: 200 });
    } catch (error: any) {
        console.error('❌ PUT /api/learning/notes 에러 상세:', error);
        return NextResponse.json(
            { error: 'Failed to update note: ' + error.message },
            { status: 500 }
        );
    }
}
