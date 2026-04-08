-- =============================================
-- Supabase 스타터킷 데이터베이스 스키마
-- Supabase Dashboard > SQL Editor에서 실행하세요
-- =============================================


-- =============================================
-- 1. profiles 테이블 (사용자 프로필)
-- =============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL PRIMARY KEY,
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  full_name   TEXT,
  avatar_url  TEXT,
  bio         TEXT,
  website     TEXT,
  CONSTRAINT bio_length CHECK (char_length(bio) <= 300)
);

-- RLS 활성화
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 프로필 조회: 본인만
CREATE POLICY "프로필 조회는 본인만" ON public.profiles
  FOR SELECT USING ((SELECT auth.uid()) = id);

-- 프로필 생성: 본인만
CREATE POLICY "프로필 생성은 본인만" ON public.profiles
  FOR INSERT WITH CHECK ((SELECT auth.uid()) = id);

-- 프로필 수정: 본인만
CREATE POLICY "프로필 수정은 본인만" ON public.profiles
  FOR UPDATE USING ((SELECT auth.uid()) = id);

-- 신규 가입 시 profiles 자동 생성 함수
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 신규 가입 트리거 등록
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- =============================================
-- 2. notes 테이블 (CRUD + Realtime 예제)
-- =============================================
CREATE TABLE IF NOT EXISTS public.notes (
  id         UUID        DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  user_id    UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title      TEXT        NOT NULL,
  content    TEXT        NOT NULL,
  is_public  BOOLEAN     DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT title_length CHECK (char_length(title) <= 100)
);

-- RLS 활성화
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- 노트 조회: 본인 소유 또는 공개 노트
CREATE POLICY "노트 조회: 본인 또는 공개" ON public.notes
  FOR SELECT USING (
    (SELECT auth.uid()) = user_id OR is_public = TRUE
  );

-- 노트 생성: 본인만
CREATE POLICY "노트 생성은 본인만" ON public.notes
  FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

-- 노트 수정: 본인만
CREATE POLICY "노트 수정은 본인만" ON public.notes
  FOR UPDATE USING ((SELECT auth.uid()) = user_id);

-- 노트 삭제: 본인만
CREATE POLICY "노트 삭제는 본인만" ON public.notes
  FOR DELETE USING ((SELECT auth.uid()) = user_id);

-- updated_at 자동 갱신 함수
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- notes updated_at 트리거
CREATE OR REPLACE TRIGGER on_notes_updated
  BEFORE UPDATE ON public.notes
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Realtime 활성화
ALTER PUBLICATION supabase_realtime ADD TABLE public.notes;


-- =============================================
-- 3. file_records 테이블 (Storage 메타데이터)
-- =============================================
CREATE TABLE IF NOT EXISTS public.file_records (
  id           UUID        DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  user_id      UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  file_name    TEXT        NOT NULL,
  file_path    TEXT        NOT NULL,
  file_size    BIGINT      NOT NULL,
  content_type TEXT        NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- RLS 활성화
ALTER TABLE public.file_records ENABLE ROW LEVEL SECURITY;

-- 파일 조회: 본인만
CREATE POLICY "파일 조회는 본인만" ON public.file_records
  FOR SELECT USING ((SELECT auth.uid()) = user_id);

-- 파일 생성: 본인만
CREATE POLICY "파일 생성은 본인만" ON public.file_records
  FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

-- 파일 삭제: 본인만
CREATE POLICY "파일 삭제는 본인만" ON public.file_records
  FOR DELETE USING ((SELECT auth.uid()) = user_id);


-- =============================================
-- 4. Storage 버킷 및 정책
-- Supabase Dashboard > Storage에서 설정하거나
-- 아래 SQL을 실행하세요
-- =============================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'files',
  'files',
  FALSE,
  52428800,  -- 50MB 제한
  ARRAY[
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf', 'text/plain', 'application/zip'
  ]
) ON CONFLICT (id) DO NOTHING;

-- Storage RLS: 본인 폴더의 파일만 조회
CREATE POLICY "본인 파일 조회" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'files'
    AND (SELECT auth.uid())::text = (storage.foldername(name))[1]
  );

-- Storage RLS: 본인 폴더에만 업로드
CREATE POLICY "본인 파일 업로드" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'files'
    AND (SELECT auth.uid())::text = (storage.foldername(name))[1]
  );

-- Storage RLS: 본인 파일만 삭제
CREATE POLICY "본인 파일 삭제" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'files'
    AND (SELECT auth.uid())::text = (storage.foldername(name))[1]
  );
