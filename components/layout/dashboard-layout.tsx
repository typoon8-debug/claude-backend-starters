'use client'

import { useState } from 'react'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { DashboardSidebar } from './dashboard-sidebar'
import { DashboardHeader } from './dashboard-header'
import { useAuth } from '@/hooks/use-auth'

interface DashboardLayoutProps {
  children: React.ReactNode
}

/**
 * 대시보드 레이아웃 컴포넌트
 * - 데스크톱: 고정 사이드바 (256px) + 메인 콘텐츠
 * - 모바일: Sheet drawer + 메인 콘텐츠
 */
export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  // 인증 상태를 Zustand 스토어와 동기화
  useAuth()

  return (
    <div className='flex min-h-screen bg-background'>
      {/* 데스크톱 사이드바 (md 이상에서 표시) */}
      <aside className='hidden w-64 shrink-0 border-r border-border/40 md:flex md:flex-col'>
        <DashboardSidebar />
      </aside>

      {/* 모바일 사이드바 (Sheet drawer) */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent side='left' className='w-64 p-0'>
          <SheetTitle className='sr-only'>네비게이션 메뉴</SheetTitle>
          <DashboardSidebar onClose={() => setIsMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* 메인 콘텐츠 영역 */}
      <div className='flex flex-1 flex-col overflow-hidden'>
        <DashboardHeader onMenuClick={() => setIsMobileOpen(true)} />
        <main className='flex-1 overflow-y-auto p-4 md:p-6'>{children}</main>
      </div>
    </div>
  )
}
