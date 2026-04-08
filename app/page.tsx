import Link from 'next/link'
import { Database, Shield, FileText, Upload, Zap, Code2, FormInput, Layout, ArrowRight } from 'lucide-react'
import { PublicLayout } from '@/components/layout/public-layout'
import { Section } from '@/components/layout/section'
import { Hero } from '@/components/common/hero'
import { FeatureCard } from '@/components/common/feature-card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

/** 기능 소개 카드 데이터 */
const FEATURES = [
  {
    icon: <Shield className='size-5' />,
    title: 'Supabase Auth',
    description: '이메일/비밀번호, 소셜 로그인, 비밀번호 재설정까지. middleware.ts로 라우트 자동 보호.',
    badge: '인증',
  },
  {
    icon: <Database className='size-5' />,
    title: 'PostgreSQL + RLS',
    description: 'Row Level Security로 데이터베이스 레벨 보안. 서버 없이도 안전한 직접 쿼리.',
    badge: '데이터베이스',
  },
  {
    icon: <FileText className='size-5' />,
    title: 'CRUD 예제',
    description: '@tanstack/react-query + Zustand 조합으로 낙관적 업데이트를 포함한 완전한 CRUD.',
    badge: 'TanStack Query',
  },
  {
    icon: <Upload className='size-5' />,
    title: 'Supabase Storage',
    description: 'react-dropzone으로 드래그앤드롭 파일 업로드. 이미지 미리보기, 진행률 표시.',
    badge: 'react-dropzone',
  },
  {
    icon: <Zap className='size-5' />,
    title: 'Realtime 구독',
    description: 'Supabase Realtime으로 DB 변경사항을 WebSocket으로 실시간 구독. Zustand 자동 동기화.',
    badge: 'WebSocket',
  },
  {
    icon: <FormInput className='size-5' />,
    title: 'React Hook Form + Zod',
    description: '타입 안전 폼 검증. 서버 에러 핸들링, 로딩 상태 관리 패턴 포함.',
    badge: 'Zod',
  },
  {
    icon: <Code2 className='size-5' />,
    title: 'Next.js API Routes',
    description: 'REST 패턴 API Routes. 표준 응답 헬퍼, Zod 서버사이드 검증, 인증 확인.',
    badge: 'REST API',
  },
  {
    icon: <Layout className='size-5' />,
    title: 'shadcn/ui 쇼케이스',
    description: '28개 컴포넌트 인터랙티브 데모. Button, Form, Dialog, Table 등 실제 사용 패턴.',
    badge: 'shadcn/ui',
  },
]

export default function HomePage() {
  return (
    <PublicLayout>
      {/* 히어로 섹션 */}
      <Hero />

      <Separator />

      {/* 기능 소개 섹션 */}
      <Section id='features'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold tracking-tight'>포함된 기능</h2>
          <p className='mt-3 text-muted-foreground'>
            프로덕션에서 바로 사용 가능한 패턴과 예제를 제공합니다
          </p>
        </div>
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </Section>

      <Separator />

      {/* 기술 스택 섹션 */}
      <Section id='tech-stack' className='py-16'>
        <div className='text-center mb-10'>
          <h2 className='text-3xl font-bold tracking-tight'>기술 스택</h2>
          <p className='mt-3 text-muted-foreground'>
            검증된 라이브러리만 선별했습니다
          </p>
        </div>
        <div className='grid gap-3 sm:grid-cols-2 md:grid-cols-3 text-sm'>
          {[
            { category: '프레임워크', items: ['Next.js 15', 'React 19', 'TypeScript'] },
            { category: '백엔드', items: ['Supabase Auth', 'PostgreSQL + RLS', 'Supabase Storage', 'Realtime'] },
            { category: 'UI', items: ['Tailwind CSS v4', 'shadcn/ui', 'lucide-react', 'next-themes'] },
            { category: '상태관리', items: ['Zustand', '@tanstack/react-query'] },
            { category: '폼', items: ['React Hook Form', 'Zod', '@hookform/resolvers'] },
            { category: '유틸리티', items: ['react-dropzone', 'date-fns', 'sonner', 'clsx + tw-merge'] },
          ].map((stack) => (
            <div key={stack.category} className='rounded-lg border p-4'>
              <p className='font-semibold text-xs text-muted-foreground uppercase mb-2'>{stack.category}</p>
              <ul className='space-y-1'>
                {stack.items.map((item) => (
                  <li key={item} className='flex items-center gap-2'>
                    <span className='size-1.5 rounded-full bg-primary shrink-0' />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Separator />

      {/* CTA 섹션 */}
      <Section className='text-center py-20'>
        <h2 className='text-3xl font-bold tracking-tight'>지금 바로 시작하세요</h2>
        <p className='mt-3 text-muted-foreground max-w-md mx-auto'>
          .env.local에 Supabase 키를 입력하고 database.sql을 실행하면 즉시 개발을 시작할 수 있습니다.
        </p>
        <div className='mt-8 flex flex-col sm:flex-row items-center justify-center gap-3'>
          <Button size='lg' asChild>
            <Link href='/signup'>
              무료 계정 만들기 <ArrowRight className='ml-2 size-4' />
            </Link>
          </Button>
          <Button size='lg' variant='outline' asChild>
            <Link href='/login'>로그인</Link>
          </Button>
        </div>
      </Section>
    </PublicLayout>
  )
}
