import Link from 'next/link'
import { ArrowRight, LogIn } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

/** 랜딩 히어로 섹션 */
export function Hero() {
  return (
    <section
      aria-labelledby='hero-heading'
      className='relative mx-auto w-full px-4 py-24 text-center md:py-32'
    >
      <div className='mx-auto max-w-3xl space-y-6'>
        {/* 배지 */}
        <Badge variant='outline' className='mx-auto'>
          <span aria-hidden='true'>✨</span>
          {' '}Next.js 15 + Supabase + Tailwind v4
        </Badge>

        {/* 헤드라인 */}
        <h1 id='hero-heading' className='text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl'>
          풀스택 개발을{' '}
          <span className='bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent'>
            빠르게 시작하세요
          </span>
        </h1>

        {/* 설명 */}
        <p className='mx-auto max-w-xl text-base text-muted-foreground sm:text-lg'>
          인증, 데이터베이스 CRUD, 파일 업로드, 실시간 구독까지.
          검증된 기술 스택으로 즉시 프로덕션 레디 앱을 구축하세요.
        </p>

        {/* CTA 버튼 */}
        <div className='flex flex-col items-center gap-3 pt-4 sm:flex-row sm:justify-center'>
          <Button size='lg' className='w-full sm:w-auto' asChild>
            <Link href='/signup'>
              무료로 시작하기
              <ArrowRight className='ml-2 size-4' aria-hidden='true' />
            </Link>
          </Button>
          <Button size='lg' variant='outline' className='w-full sm:w-auto' asChild>
            <Link href='/login'>
              <LogIn className='mr-2 size-4' aria-hidden='true' />
              로그인
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
