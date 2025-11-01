import prisma from './prisma';

// =============================================
// 체크리스트 관련 함수
// =============================================

export interface ChecklistItem {
    id: number;
    title: string;
    completed: boolean;
    completedAt: string | null;
}

/**
 * 사용자의 체크리스트 불러오기
 */
export async function fetchUserChecklists(userId: string, productId: string) {
    const checklists = await prisma.userChecklist.findMany({
        where: {
            userId: userId,
            productId: productId
        }
    });

    return checklists;
}

/**
 * 체크리스트 항목 저장/업데이트 (UPSERT)
 */
export async function saveChecklistItem(
    userId: string,
    productId: string,
    checklistId: number,
    completed: boolean,
    completedAt: string | null
): Promise<boolean> {
    try {
        console.log('💾 Saving checklist:', { userId, productId, checklistId, completed, completedAt });

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

        console.log('✅ Checklist saved successfully:', result);
        return true;
    } catch (error) {
        console.error('❌ Error saving checklist item:', error);
        return false;
    }
}

// =============================================
// 학습 노트 관련 함수
// =============================================

export interface NoteItem {
    id: string;
    type: 'question' | 'insight' | 'todo' | 'reference';
    title: string;
    content: string;
    createdAt: string;
    module: string;
}

/**
 * 사용자의 학습 노트 불러오기
 */
export async function fetchUserNotes(userId: string, productId: string) {
    const notes = await prisma.userNote.findMany({
        where: {
            userId: userId,
            productId: productId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return notes;
}

/**
 * 새 노트 추가
 */
export async function createNote(
    userId: string,
    productId: string,
    noteType: 'question' | 'insight' | 'todo' | 'reference',
    title: string,
    content: string,
    module: string
) {
    try {
        console.log('📝 Creating note:', { userId, productId, noteType, title, module });

        const note = await prisma.userNote.create({
            data: {
                userId: userId,
                productId: productId,
                noteType: noteType,
                title: title,
                content: content,
                module: module
            }
        });

        console.log('✅ Note created successfully:', note);
        return note;
    } catch (error) {
        console.error('❌ Error creating note:', error);
        return null;
    }
}

/**
 * 노트 삭제
 */
export async function deleteNote(userId: string, noteId: string): Promise<boolean> {
    try {
        // 먼저 해당 노트가 사용자의 것인지 확인
        const note = await prisma.userNote.findUnique({
            where: { id: noteId }
        });

        if (!note || note.userId !== userId) {
            console.error('Note not found or unauthorized');
            return false;
        }

        await prisma.userNote.delete({
            where: { id: noteId }
        });
        return true;
    } catch (error) {
        console.error('Error deleting note:', error);
        return false;
    }
}

/**
 * 노트 수정
 */
export async function updateNote(
    userId: string,
    noteId: string,
    title: string,
    content: string
): Promise<boolean> {
    try {
        // 먼저 해당 노트가 사용자의 것인지 확인
        const note = await prisma.userNote.findUnique({
            where: { id: noteId }
        });

        if (!note || note.userId !== userId) {
            console.error('Note not found or unauthorized');
            return false;
        }

        await prisma.userNote.update({
            where: { id: noteId },
            data: {
                title: title,
                content: content
            }
        });
        return true;
    } catch (error) {
        console.error('Error updating note:', error);
        return false;
    }
}
