# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

Next.js 15 + Supabase 풀스택 스타터킷.
인증(이메일/비밀번호), CRUD(노트), 파일 업로드, Realtime 구독, 프로필 관리 예제를 포함합니다.

## 기술 스택

| 분류 | 라이브러리 | 버전 |
|------|-----------|------|
| Framework | Next.js (App Router) | 15.5.14 |
| Runtime | React | 19.1.0 |
| Language | TypeScript (strict) | ^5 |
| Styling | Tailwind CSS v4 + shadcn/ui | ^4 |
| Database/Auth/Storage | Supabase | @supabase/supabase-js ^2, @supabase/ssr ^0.10 |
| Server State | @tanstack/react-query | ^5 |
| Client State | Zustand | ^5 |
| Form | react-hook-form + @hookform/resolvers | ^7 / ^5 |
| Validation | Zod | ^3 |
| Icons | lucide-react | ^1 |
| Toast | sonner | ^2 |
| 날짜 | date-fns | ^4 |
| 파일 입력 | react-dropzone | ^15 |

## 코드 규칙

- 세미콜론 없음
- 작은따옴표 사용
- 들여쓰기: 2칸
- `any` 타입 금지 — `unknown` 사용 후 타입 좁히기
- 컴포넌트명: PascalCase, 변수/함수명: camelCase
- 주석: 한국어
- 클라이언트 컴포넌트에만 파일 최상단 `'use client'` 지시어 명시

## 개발 명령어

```bash
npm run dev       # 개발 서버 실행 (http://localhost:3000)
npm run build     # 프로덕션 빌드
npm run lint      # ESLint 검사
npx tsc --noEmit  # 타입 체크 (빌드 없이)
```

테스트 설정 없음. 테스트 추가 시 jest 또는 vitest 별도 설정 필요.

## 환경 변수 및 설정

### 환경 변수 파일 구조

- `.env` — Supabase URL/ANON_KEY (공개 가능한 값)
- `.env.local` — 로컬 전용 민감 값 (`.env`보다 우선 적용)

### 필수 환경 변수

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### MCP 서버 (.mcp.json)

프로젝트 루트의 `.mcp.json`에 Supabase MCP HTTP 서버가 설정되어 있습니다.
Claude Code에서 Supabase 스키마/데이터 조회 시 이 MCP 서버를 활용할 수 있습니다.

### 데이터베이스 초기화

`database.sql`을 Supabase Dashboard > SQL Editor에서 실행하세요.
`profiles`, `notes`, `file_records` 테이블과 RLS 정책이 생성됩니다.

DB 타입(`lib/supabase/types.ts`)은 수동 정의. 스키마 변경 시 이 파일도 함께 업데이트해야 합니다.

## 아키텍처 핵심 패턴

### Supabase 클라이언트 선택 규칙

| 컨텍스트 | 사용 파일 | 호출 방법 |
|---------|----------|---------|
| 클라이언트 컴포넌트 / 훅 | `lib/supabase/client.ts` | `createClient()` (동기) |
| 서버 컴포넌트 / Route Handler | `lib/supabase/server.ts` | `await createClient()` (비동기) |
| 미들웨어 | `middleware.ts` 내 직접 생성 | `createServerClient(...)` |

### Next.js 15 동적 Route Params (Breaking Change)

Next.js 15부터 `params`가 Promise로 변경됨. 반드시 `await`로 추출해야 합니다.

```typescript
// app/api/notes/[id]/route.ts 패턴
interface RouteContext {
  params: Promise<{ id: string }>
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params  // await 필수
  const supabase = await createClient()
  // ...
}
```

### API Route 패턴

모든 Route Handler의 공통 구조:

```typescript
import { createClient } from '@/lib/supabase/server'
import { apiSuccess, apiError, apiUnauthorized, apiBadRequest, apiNotFound } from '@/lib/api/response'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return apiUnauthorized()   // 401
  // ... Supabase 쿼리
  if (error) return apiError(error.message)  // 500
  return apiSuccess(data)               // 200
}
```

API 응답 헬퍼 (`lib/api/response.ts`):

```typescript
apiSuccess(data, status?)    // { data } — 기본 200
apiError(message, status?)   // { error } — 기본 500
apiUnauthorized()            // 401
apiBadRequest(message)       // 400
apiNotFound(resource)        // 404
```

RLS가 DB 레벨 보안을 이중으로 담당. Route Handler에서도 `user_id` 조건 추가 권장.

### API 응답 타입 (`types/index.ts`)

```typescript
type ApiSuccess<T> = { data: T }
type ApiError     = { error: string }
type ApiResponse<T> = ApiSuccess<T> | ApiError
```

### 폼 패턴 (react-hook-form + zodResolver)

```typescript
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { noteSchema, type NoteInput } from '@/lib/schemas/note'

const form = useForm<NoteInput>({
  resolver: zodResolver(noteSchema),
  defaultValues: { title: '', content: '', is_public: false },
})
```

### Zod 스키마 검증 규칙 (`lib/schemas/`)

| 필드 | 규칙 |
|-----|------|
| 로그인 password | min 6자 |
| 회원가입 password | min 8자 + 영문 대문자 + 숫자 포함 |
| fullName | min 2자, max 50자 |
| note.title | min 1자, max 100자 |
| note.content | min 1자 |
| profile.bio | max 300자 |
| profile.website | URL 형식 또는 빈 문자열 허용 |

### cn() 유틸 (`lib/utils.ts`)

Tailwind 클래스 충돌 없이 조건부 병합할 때 사용:

```typescript
import { cn } from '@/lib/utils'
// clsx + tailwind-merge 결합
<div className={cn('base-class', isActive && 'active-class', className)} />
```

### React Query 전역 설정 (`app/providers.tsx`)

```typescript
new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,  // 1분간 fresh 유지
      retry: 1,               // 실패 시 1회 재시도
    },
  },
})
```

뮤테이션 성공 후 반드시 `queryClient.invalidateQueries()`로 캐시 무효화 + sonner toast 알림.

### 인증 흐름

1. `middleware.ts` — 매 요청마다 세션 갱신, 보호된 경로 접근 제어
2. `app/providers.tsx` — `QueryClientProvider` + `ThemeProvider` + `Toaster` 전역 래핑
3. `hooks/use-auth.ts` — `onAuthStateChange` 구독 후 `useAuthStore`(Zustand)와 동기화
4. `stores/auth-store.ts` — `user`, `profile`, `isLoading` 상태 관리. `signOut()` 포함

클라이언트 컴포넌트에서 인증 정보: `useAuth()` 훅 사용.

### Middleware 경로 보호 (`middleware.ts`)

```typescript
// 인증 필요 경로 (미인증 시 /login으로 리다이렉트)
const PROTECTED_PATHS = ['/dashboard', '/notes', '/files', '/realtime', '/profile']

// 인증 상태에서 접근 불가 (이미 로그인 시 /dashboard로 리다이렉트)
const AUTH_PATHS = ['/login', '/signup', '/forgot-password', '/reset-password']
```

### 파일 업로드 패턴

클라이언트에서 Supabase Storage로 직접 업로드 (Next.js 4MB 제한 우회):

```typescript
// 1단계: Supabase Storage에 직접 업로드
const { data } = await supabase.storage
  .from('files')
  .upload(`${user.id}/${crypto.randomUUID()}/${file.name}`, file)

// 2단계: 메타데이터를 /api/files 로 저장 (POST)
await saveFile({ file_name, file_path, file_size, content_type })
```

파일 제약 (`types/index.ts`):
- 허용 MIME 타입: `image/jpeg`, `image/png`, `image/gif`, `image/webp`, `application/pdf`, `text/plain`, `application/zip`
- `MAX_FILE_SIZE = 50 * 1024 * 1024` (50MB)
- Storage 경로 형식: `{user_id}/{uuid}/{filename}`

### Realtime 패턴 (`hooks/use-realtime.ts`)

```typescript
const channel = supabase
  .channel('realtime-notes')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'notes' }, (payload) => {
    // 이벤트 로그: 최근 20개만 유지
    setEvents((prev) => [event, ...prev].slice(0, 20))
    // Zustand 스토어 동기화
    if (payload.eventType === 'INSERT') addNote(payload.new as Note)
    if (payload.eventType === 'UPDATE') updateNote(payload.new as Note)
    if (payload.eventType === 'DELETE') removeNote((payload.old as { id: string }).id)
  })
  .subscribe()

return () => { supabase.removeChannel(channel) }  // 언마운트 시 반드시 해제
```

`useNotesStore`의 `addNote/updateNote/removeNote`는 **Realtime 이벤트 전용**.
일반 CRUD 뮤테이션 콜백에서는 `invalidateQueries` 사용.

### 상태 분리 원칙

| 상태 유형 | 도구 | 스토어/훅 |
|---------|------|---------|
| 서버 데이터 (노트, 파일) | React Query | `useNotes()`, `useFiles()` |
| 인증 상태 | Zustand | `useAuthStore`, `useAuth()` |
| UI 상태 (사이드바) | Zustand | `useUIStore` |
| Realtime 이벤트 | Zustand (notes) | `useNotesStore`, `useNotesRealtime()` |

### Tailwind v4 특이점

- `tailwind.config.ts` 없음 — 테마 설정은 `app/globals.css`의 `@theme` 블록에서 CSS 변수로 관리
- PostCSS 전용: `postcss.config.mjs`에서 `@tailwindcss/postcss` 플러그인 사용
- 다크모드: `@custom-variant dark (&:is(.dark *))` 커스텀 변형 사용
- shadcn/ui 컴포넌트 추가: `npx shadcn add [component-name]`

## 폴더 구조

```
.
├── .env                     ← Supabase 공개 키
├── .env.local               ← 로컬 전용 민감 값
├── .mcp.json                ← Claude Code MCP 서버 설정 (Supabase HTTP)
├── database.sql             ← DB 초기화 SQL (테이블 + RLS)
├── middleware.ts            ← 세션 갱신 + 경로 보호
├── postcss.config.mjs       ← Tailwind v4 PostCSS 설정
│
├── app/
│   ├── globals.css          ← Tailwind @theme 설정 (CSS 변수, oklch 색상)
│   ├── layout.tsx           ← 루트 레이아웃 (Providers 포함)
│   ├── providers.tsx        ← QueryClient + ThemeProvider + Toaster
│   ├── page.tsx             ← 랜딩 페이지 (/ 경로)
│   │
│   ├── (auth)/              ← 인증 페이지 그룹 (레이아웃 별도)
│   │   ├── login/
│   │   ├── signup/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   │
│   ├── (dashboard)/         ← 인증 후 대시보드 그룹
│   │   ├── layout.tsx       ← 사이드바 + 헤더 레이아웃
│   │   ├── components/      ← shadcn/ui 컴포넌트 쇼케이스
│   │   ├── dashboard/       ← /dashboard 메인
│   │   ├── notes/           ← /notes 노트 CRUD
│   │   ├── files/           ← /files 파일 업로드
│   │   ├── realtime/        ← /realtime Supabase Realtime 데모
│   │   └── profile/         ← /profile 프로필 관리
│   │
│   └── api/
│       ├── notes/
│       │   ├── route.ts     ← GET(목록), POST(생성)
│       │   └── [id]/route.ts← GET(단건), PUT(수정), DELETE(삭제)
│       ├── files/
│       │   ├── route.ts     ← GET(목록), POST(메타데이터 저장)
│       │   └── [id]/route.ts← DELETE(삭제)
│       └── profile/
│           └── route.ts     ← GET(조회), PUT(수정)
│
├── components/
│   ├── auth/                ← 인증 폼 컴포넌트
│   ├── common/              ← 공통 컴포넌트 (UserAvatar, ThemeToggle 등)
│   ├── dashboard/           ← 대시보드 위젯 (StatsCard, WelcomeBanner)
│   ├── files/               ← 파일 업로드 (react-dropzone 기반)
│   ├── layout/              ← 사이드바, 헤더 등 레이아웃
│   ├── notes/               ← 노트 CRUD 컴포넌트
│   ├── showcase/            ← shadcn/ui 컴포넌트 쇼케이스
│   └── ui/                  ← shadcn/ui 기본 컴포넌트 (28개)
│
├── hooks/
│   ├── use-auth.ts          ← 인증 상태 관리 (onAuthStateChange)
│   ├── use-notes.ts         ← 노트 CRUD React Query 훅
│   ├── use-files.ts         ← 파일 관리 React Query 훅
│   └── use-realtime.ts      ← Supabase Realtime 구독 훅
│
├── lib/
│   ├── utils.ts             ← cn() 유틸 (clsx + tailwind-merge)
│   ├── api/response.ts      ← API 응답 헬퍼 (apiSuccess 등)
│   ├── schemas/             ← Zod 스키마 (auth, note, profile)
│   └── supabase/
│       ├── client.ts        ← 브라우저용 createClient()
│       ├── server.ts        ← 서버용 async createClient()
│       └── types.ts         ← Database 타입, Profile/Note/FileRecord
│
├── stores/
│   ├── auth-store.ts        ← useAuthStore (user, profile, isLoading, signOut)
│   ├── notes-store.ts       ← useNotesStore (Realtime 이벤트 전용 CRUD)
│   └── ui-store.ts          ← useUIStore (isSidebarOpen)
│
└── types/
    └── index.ts             ← ApiSuccess/ApiError/ApiResponse, ALLOWED_FILE_TYPES, MAX_FILE_SIZE
```

## 중요 주의사항

### 절대 하지 말아야 할 것

1. **`any` 타입 사용 금지** — `unknown` + 타입 가드 또는 `safeParse` 사용
2. **Route Handler에서 `params` 직접 구조분해 금지** — 반드시 `await params` 후 추출
3. **`lib/supabase/server.ts`를 클라이언트 컴포넌트에서 import 금지** — 서버 전용
4. **`useNotesStore.addNote/updateNote/removeNote`를 일반 CRUD에서 직접 호출 금지** — Realtime 전용

### 새 API Route 추가 시 체크리스트

- [ ] `params: Promise<{ id: string }>` 인터페이스 선언
- [ ] `const { id } = await params` 로 추출
- [ ] `supabase.auth.getUser()`로 인증 확인 → `apiUnauthorized()` 반환
- [ ] Zod `safeParse`로 요청 바디 검증
- [ ] 응답은 `lib/api/response.ts` 헬퍼만 사용

### 새 폼 컴포넌트 추가 시 체크리스트

- [ ] `lib/schemas/`에 Zod 스키마 먼저 정의
- [ ] `useForm<T>({ resolver: zodResolver(schema) })` 패턴 사용
- [ ] 비밀번호 필드: 회원가입/재설정은 8자+대문자+숫자 규칙 준수

### Tailwind v4 사용 시 주의

- `tailwind.config.ts` 수정 불가 (파일 없음)
- 커스텀 테마 변경은 `app/globals.css`의 `@theme` 블록에서 CSS 변수로 추가
- shadcn/ui 컴포넌트 추가: `npx shadcn add [component]`
