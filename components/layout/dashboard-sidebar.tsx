'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  Upload,
  Zap,
  User,
  ComponentIcon,
  LogOut,
  Database,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { UserAvatar } from '@/components/common/user-avatar'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'

/** 사이드바 네비게이션 아이템 정의 */
const NAV_ITEMS = [
  { label: '대시보드', href: '/dashboard', icon: LayoutDashboard },
  { label: '컴포넌트', href: '/components', icon: ComponentIcon },
  { label: '노트 CRUD', href: '/notes', icon: FileText },
  { label: '파일 업로드', href: '/files', icon: Upload },
  { label: 'Realtime', href: '/realtime', icon: Zap },
  { label: '프로필', href: '/profile', icon: User },
] as const

interface DashboardSidebarProps {
  /** 사이드바 닫기 콜백 (모바일 Sheet용) */
  onClose?: () => void
}

/** 대시보드 사이드바 컴포넌트 */
export function DashboardSidebar({ onClose }: DashboardSidebarProps) {
  const pathname = usePathname()
  const { user, profile, signOut } = useAuthStore()

  const handleSignOut = async () => {
    await signOut()
    // 페이지 새로고침으로 미들웨어 리다이렉트 처리
    window.location.href = '/'
  }

  return (
    <div className='flex h-full flex-col'>
      {/* 로고 */}
      <div className='flex h-14 items-center border-b border-border/40 px-4'>
        <Link
          href='/dashboard'
          className='flex items-center gap-2 font-bold text-lg hover:text-primary transition-colors'
          onClick={onClose}
        >
          <Database className='size-5 text-primary' />
          <span>Supabase Starter</span>
        </Link>
      </div>

      {/* 네비게이션 */}
      <ScrollArea className='flex-1 px-2 py-4'>
        <nav className='space-y-1'>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <Icon className='size-4 shrink-0' />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* 하단 유저 패널 */}
      <div className='border-t border-border/40 p-4'>
        <Separator className='mb-4' />
        <div className='flex items-center gap-3 mb-3'>
          <UserAvatar name={profile?.full_name ?? user?.email} avatarUrl={profile?.avatar_url} size='sm' />
          <div className='flex-1 overflow-hidden'>
            <p className='truncate text-sm font-medium'>
              {profile?.full_name ?? '사용자'}
            </p>
            <p className='truncate text-xs text-muted-foreground'>{user?.email}</p>
          </div>
        </div>
        <Button
          variant='ghost'
          size='sm'
          className='w-full justify-start gap-2 text-muted-foreground hover:text-destructive'
          onClick={handleSignOut}
        >
          <LogOut className='size-4' />
          로그아웃
        </Button>
      </div>
    </div>
  )
}
