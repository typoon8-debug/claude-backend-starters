'use client'

import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/sonner'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

/** 앱 전역 클라이언트 프로바이더 */
export function Providers({ children }: { children: React.ReactNode }) {
  // QueryClient를 useState로 생성해 서버 렌더링 시 공유 방지
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1분
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
        {children}
        <Toaster richColors position='top-right' />
      </ThemeProvider>
    </QueryClientProvider>
  )
}
