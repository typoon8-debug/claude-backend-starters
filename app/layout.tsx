import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'Supabase Starter Kit',
    template: '%s | Supabase Starter Kit',
  },
  description:
    'Next.js 15 + Supabase + TypeScript + Tailwind CSS + shadcn/ui로 만든 풀스택 스타터킷. 인증, CRUD, 파일 업로드, 실시간 구독 예제 포함.',
  keywords: ['Next.js', 'Supabase', 'TypeScript', 'Tailwind CSS', 'shadcn/ui', '스타터킷'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='ko' suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-full antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
