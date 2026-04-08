'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, Database } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { ThemeToggle } from '@/components/common/theme-toggle'

/** 퍼블릭 페이지 헤더 */
export function PublicHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleMobileNavClick = () => setMobileOpen(false)

  return (
    <header className='sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60'>
      <div className='container mx-auto flex h-14 max-w-screen-2xl items-center justify-between px-4'>
        {/* 로고 */}
        <Link
          href='/'
          className='mr-4 flex items-center gap-2 font-bold text-lg transition-colors hover:text-primary'
        >
          <Database className='size-5 text-primary' />
          <span>Supabase Starter</span>
        </Link>

        {/* 데스크톱 네비게이션 */}
        <nav className='hidden flex-1 items-center gap-6 text-sm md:flex'>
          <Link href='/#features' className='text-muted-foreground transition-colors hover:text-foreground'>
            기능 소개
          </Link>
          <Link href='/#tech-stack' className='text-muted-foreground transition-colors hover:text-foreground'>
            기술 스택
          </Link>
        </nav>

        {/* 우측: 테마 토글 + CTA */}
        <div className='flex items-center gap-2'>
          <ThemeToggle />
          <Button size='sm' variant='ghost' className='hidden sm:inline-flex' asChild>
            <Link href='/login'>로그인</Link>
          </Button>
          <Button size='sm' className='hidden sm:inline-flex' asChild>
            <Link href='/signup'>시작하기</Link>
          </Button>

          {/* 모바일 메뉴 */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant='ghost' size='icon' className='md:hidden' aria-label='메뉴 열기'>
                <Menu className='size-4' />
              </Button>
            </SheetTrigger>
            <SheetContent side='right'>
              <SheetTitle className='sr-only'>메뉴</SheetTitle>
              <nav className='flex flex-col gap-4 pt-4'>
                <Link href='/#features' className='text-sm font-medium text-muted-foreground hover:text-foreground' onClick={handleMobileNavClick}>
                  기능 소개
                </Link>
                <Link href='/#tech-stack' className='text-sm font-medium text-muted-foreground hover:text-foreground' onClick={handleMobileNavClick}>
                  기술 스택
                </Link>
                <Link href='/login' className='text-sm font-medium text-muted-foreground hover:text-foreground' onClick={handleMobileNavClick}>
                  로그인
                </Link>
                <Button className='w-full' asChild onClick={handleMobileNavClick}>
                  <Link href='/signup'>시작하기</Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
