import { supabase } from './supabase';

// =============================================
// 체크리스트 관련 함수
// =============================================

export interface ChecklistItem {
    id: number;
    title: string;
    completed: boolean;
    completedAt: string | null;
}

export interface DBChecklistItem {
    user_id: string;
    product_id: string;
    checklist_id: number;
    completed: boolean;
    completed_at: string | null;
}

/**
 * 사용자의 체크리스트 불러오기
 */
export async function fetchUserChecklists(userId: string, productId: string): Promise<DBChecklistItem[]> {
    const { data, error } = await supabase
        .from('user_checklists')
        .select('*')
        .eq('user_id', userId)
        .eq('product_id', productId);

    if (error) {
        console.error('Error fetching checklists:', error);
        return [];
    }

    return data || [];
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
    const { error } = await supabase
        .from('user_checklists')
        .upsert({
            user_id: userId,
            product_id: productId,
            checklist_id: checklistId,
            completed: completed,
            completed_at: completedAt
        }, {
            onConflict: 'user_id,product_id,checklist_id'
        });

    if (error) {
        console.error('Error saving checklist item:', error);
        return false;
    }

    return true;
}

// =============================================
// 학습 노트 관련 함수
// =============================================

export interface NoteItem {
    id: number;
    type: 'question' | 'insight' | 'todo' | 'reference';
    title: string;
    content: string;
    createdAt: string;
    module: string;
}

export interface DBNoteItem {
    id: number;
    user_id: string;
    product_id: string;
    note_type: 'question' | 'insight' | 'todo' | 'reference';
    title: string;
    content: string;
    module: string;
    created_at: string;
}

/**
 * 사용자의 학습 노트 불러오기
 */
export async function fetchUserNotes(userId: string, productId: string): Promise<DBNoteItem[]> {
    const { data, error } = await supabase
        .from('user_notes')
        .select('*')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching notes:', error);
        return [];
    }

    return data || [];
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
): Promise<DBNoteItem | null> {
    const { data, error } = await supabase
        .from('user_notes')
        .insert({
            user_id: userId,
            product_id: productId,
            note_type: noteType,
            title: title,
            content: content,
            module: module
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating note:', error);
        return null;
    }

    return data;
}

/**
 * 노트 삭제
 */
export async function deleteNote(userId: string, noteId: number): Promise<boolean> {
    const { error } = await supabase
        .from('user_notes')
        .delete()
        .eq('id', noteId)
        .eq('user_id', userId); // 보안: 자신의 노트만 삭제 가능

    if (error) {
        console.error('Error deleting note:', error);
        return false;
    }

    return true;
}

/**
 * 노트 수정
 */
export async function updateNote(
    userId: string,
    noteId: number,
    title: string,
    content: string
): Promise<boolean> {
    const { error } = await supabase
        .from('user_notes')
        .update({
            title: title,
            content: content
        })
        .eq('id', noteId)
        .eq('user_id', userId); // 보안: 자신의 노트만 수정 가능

    if (error) {
        console.error('Error updating note:', error);
        return false;
    }

    return true;
}
