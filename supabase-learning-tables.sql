-- ==========================================
-- 학습 진행 상황 저장을 위한 Supabase 테이블 생성
-- ==========================================

-- 1. 사용자 체크리스트 테이블
CREATE TABLE IF NOT EXISTS user_checklists (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    checklist_id INTEGER NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(user_id, product_id, checklist_id)
);

-- 2. 사용자 학습 노트 테이블
CREATE TABLE IF NOT EXISTS user_notes (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    note_type TEXT NOT NULL CHECK (note_type IN ('question', 'insight', 'todo', 'reference')),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    module TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 인덱스 생성 (검색 성능 향상)
CREATE INDEX IF NOT EXISTS idx_user_checklists_user_product ON user_checklists(user_id, product_id);
CREATE INDEX IF NOT EXISTS idx_user_notes_user_product ON user_notes(user_id, product_id);

-- Row Level Security (RLS) 정책 설정
ALTER TABLE user_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notes ENABLE ROW LEVEL SECURITY;

-- 체크리스트: 자신의 데이터만 조회 가능
CREATE POLICY "Users can view own checklists" ON user_checklists
    FOR SELECT USING (auth.uid() = user_id);

-- 체크리스트: 자신의 데이터만 삽입 가능
CREATE POLICY "Users can insert own checklists" ON user_checklists
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 체크리스트: 자신의 데이터만 업데이트 가능
CREATE POLICY "Users can update own checklists" ON user_checklists
    FOR UPDATE USING (auth.uid() = user_id);

-- 체크리스트: 자신의 데이터만 삭제 가능
CREATE POLICY "Users can delete own checklists" ON user_checklists
    FOR DELETE USING (auth.uid() = user_id);

-- 노트: 자신의 데이터만 조회 가능
CREATE POLICY "Users can view own notes" ON user_notes
    FOR SELECT USING (auth.uid() = user_id);

-- 노트: 자신의 데이터만 삽입 가능
CREATE POLICY "Users can insert own notes" ON user_notes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 노트: 자신의 데이터만 업데이트 가능
CREATE POLICY "Users can update own notes" ON user_notes
    FOR UPDATE USING (auth.uid() = user_id);

-- 노트: 자신의 데이터만 삭제 가능
CREATE POLICY "Users can delete own notes" ON user_notes
    FOR DELETE USING (auth.uid() = user_id);

-- updated_at 자동 업데이트를 위한 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성
DROP TRIGGER IF EXISTS update_user_checklists_updated_at ON user_checklists;
CREATE TRIGGER update_user_checklists_updated_at
    BEFORE UPDATE ON user_checklists
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_notes_updated_at ON user_notes;
CREATE TRIGGER update_user_notes_updated_at
    BEFORE UPDATE ON user_notes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
