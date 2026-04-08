'use client'

import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ThemeToggle } from '@/components/common/theme-toggle'
import { UserAvatar } from '@/components/common/user-avatar'
import { useAuthStore } from '@/stores/auth-store'
import Link from 'next/link'

interface DashboardHeaderProps {
  onMenuClick: () => void
}

/** 대시보드 상단 헤더 */
export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const { user, profile, signOut } = useAuthStore()

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/'
  }

  return (
    <header className='sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-border/40 bg-background/80 px-4 backdrop-blur-md'>
      {/* 모바일 메뉴 버튼 */}
      <Button
        variant='ghost'
        size='icon'
        className='md:hidden'
        onClick={onMenuClick}
        aria-label='사이드바 열기'
      >
        <Menu className='size-4' />
      </Button>

      {/* 공간 채우기 */}
      <div className='flex-1' />

      {/* 우측: 테마 토글 + 유저 드롭다운 */}
      <div className='flex items-center gap-2'>
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='relative size-9 rounded-full p-0' aria-label='유저 메뉴'>
              <UserAvatar
                name={profile?.full_name ?? user?.email}
                avatarUrl={profile?.avatar_url}
                size='sm'
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-56'>
            <DropdownMenuLabel>
              <div className='flex flex-col space-y-1'>
                <p className='text-sm font-medium'>{profile?.full_name ?? '사용자'}</p>
                <p className='text-xs text-muted-foreground truncate'>{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href='/profile'>프로필 설정</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className='text-destructive focus:text-destructive'
              onClick={handleSignOut}
            >
              로그아웃
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
