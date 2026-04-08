import Link from 'next/link'
import { Database } from 'lucide-react'

interface AuthLayoutProps {
  children: React.ReactNode
}

/** 인증 페이지 레이아웃 (중앙 카드 형식) */
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className='flex min-h-screen flex-col bg-background'>
      {/* 상단 로고 */}
      <header className='flex h-14 items-center justify-center border-b border-border/40'>
        <Link href='/' className='flex items-center gap-2 font-bold text-lg hover:text-primary transition-colors'>
          <Database className='size-5 text-primary' />
          Supabase Starter
        </Link>
      </header>

      {/* 중앙 콘텐츠 */}
      <main className='flex flex-1 items-center justify-center px-4 py-12'>
        {children}
      </main>
    </div>
  )
}
