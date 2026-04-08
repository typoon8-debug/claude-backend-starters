import Link from 'next/link'
import { Database } from 'lucide-react'

/** 퍼블릭 페이지 푸터 */
export function PublicFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className='border-t border-border/40 bg-background py-8'>
      <div className='container mx-auto max-w-screen-2xl px-4'>
        <div className='grid gap-8 sm:grid-cols-2 md:grid-cols-4'>
          {/* 브랜드 */}
          <div>
            <div className='flex items-center gap-2 font-bold'>
              <Database className='size-4 text-primary' />
              Supabase Starter
            </div>
            <p className='mt-2 text-sm text-muted-foreground'>
              Next.js 15 + Supabase로 만든 풀스택 스타터킷
            </p>
          </div>

          {/* 기능 */}
          <div>
            <h4 className='font-semibold text-sm'>기능</h4>
            <ul className='mt-3 space-y-2 text-sm text-muted-foreground'>
              <li><Link href='/login' className='hover:text-foreground transition-colors'>인증 (Auth)</Link></li>
              <li><Link href='/signup' className='hover:text-foreground transition-colors'>CRUD 예제</Link></li>
              <li><span className='opacity-50'>파일 업로드</span></li>
            </ul>
          </div>

          {/* 기술 스택 */}
          <div>
            <h4 className='font-semibold text-sm'>기술 스택</h4>
            <ul className='mt-3 space-y-2 text-sm text-muted-foreground'>
              <li><span>Next.js 15</span></li>
              <li><span>Supabase</span></li>
              <li><span>Tailwind CSS v4</span></li>
            </ul>
          </div>

          {/* 링크 */}
          <div>
            <h4 className='font-semibold text-sm'>링크</h4>
            <ul className='mt-3 space-y-2 text-sm text-muted-foreground'>
              <li><span className='opacity-50'>문서</span></li>
              <li><span className='opacity-50'>GitHub</span></li>
              <li><span className='opacity-50'>문의</span></li>
            </ul>
          </div>
        </div>

        <div className='mt-8 border-t border-border/40 pt-6 text-center text-xs text-muted-foreground'>
          <p>&copy; {currentYear} Supabase Starter Kit. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
