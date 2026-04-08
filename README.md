# Claude Backend Starters

Next.js 15 + Supabase 풀스택 스타터킷입니다.
실제 프로덕션 패턴을 기반으로 한 예제를 통해 빠르게 개발을 시작할 수 있습니다.

## 주요 기능

- **인증** — 이메일/비밀번호 로그인·회원가입, 비밀번호 찾기·재설정, 소셜 로그인(Google, GitHub)
- **노트 CRUD** — React Query + Zustand 낙관적 업데이트 패턴
- **파일 업로드** — react-dropzone + Supabase Storage 드래그앤드롭
- **Realtime** — Supabase Realtime postgres_changes 구독
- **프로필 관리** — 사용자 정보 편집
- **컴포넌트 쇼케이스** — 28개 shadcn/ui 컴포넌트 인터랙티브 데모

## 기술 스택

| 분류 | 라이브러리 |
|------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Database | Supabase (PostgreSQL + RLS) |
| Auth | Supabase Auth + @supabase/ssr |
| Storage | Supabase Storage |
| Realtime | Supabase Realtime |
| Server State | @tanstack/react-query v5 |
| Client State | Zustand v5 |
| Form | React Hook Form + Zod |
| File Upload | react-dropzone |

## 시작하기

### 1. 환경 변수 설정

```bash
cp .env.example .env.local
```

`.env.local`에 Supabase 프로젝트 정보를 입력하세요:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. 데이터베이스 설정

Supabase Dashboard > SQL Editor에서 `database.sql`을 실행하세요.

### 3. Supabase Storage 설정

Supabase Dashboard > Storage에서 `files` 버킷을 생성하세요 (database.sql에 포함).

### 4. 패키지 설치 및 실행

```bash
npm install
npm run dev
```

http://localhost:3000 에서 확인하세요.

## 프로젝트 구조

```
app/
├── (auth)/           # 인증 페이지
├── (dashboard)/      # 대시보드 페이지
├── api/              # API Routes
└── auth/callback/    # OAuth 콜백
components/
├── auth/             # 인증 폼
├── notes/            # 노트 CRUD
├── files/            # 파일 업로드
├── layout/           # 레이아웃
├── showcase/         # 컴포넌트 쇼케이스
└── ui/               # shadcn/ui
hooks/                # React Query 커스텀 훅
lib/                  # 유틸리티, 스키마, Supabase 클라이언트
stores/               # Zustand 스토어
```

## 라이선스

MIT
