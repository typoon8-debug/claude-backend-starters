'use client'

import { useAuthStore } from '@/stores/auth-store'

/** 대시보드 환영 배너 */
export function WelcomeBanner() {
  const { user, profile } = useAuthStore()
  const name = profile?.full_name ?? user?.email?.split('@')[0] ?? '사용자'

  return (
    <div className='mb-6'>
      <h1 className='text-2xl font-bold tracking-tight'>Hello, {name}님! 👋</h1>
      <p className='mt-1 text-sm text-muted-foreground'>
        Supabase Starter Kit에 오신 것을 환영합니다. 아래에서 주요 기능을 확인하세요.
      </p>
    </div>
  )
}
