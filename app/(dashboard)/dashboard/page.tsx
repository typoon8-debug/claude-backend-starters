import type { Metadata } from 'next'
import { FileText, Upload, Zap, User } from 'lucide-react'
import { WelcomeBanner } from '@/components/dashboard/welcome-banner'
import { StatsCard } from '@/components/dashboard/stats-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export const metadata: Metadata = { title: '대시보드' }

/** 스타터킷 기능 안내 카드 */
const FEATURE_CARDS = [
  {
    href: '/notes',
    icon: <FileText className='size-5' />,
    title: '노트 CRUD',
    description: 'Supabase PostgreSQL + RLS + @tanstack/react-query로 구현한 완전한 CRUD 예제',
    badge: 'Realtime 지원',
  },
  {
    href: '/files',
    icon: <Upload className='size-5' />,
    title: '파일 업로드',
    description: 'react-dropzone + Supabase Storage로 구현한 드래그앤드롭 파일 업로드',
    badge: 'Storage',
  },
  {
    href: '/realtime',
    icon: <Zap className='size-5' />,
    title: 'Realtime',
    description: 'Supabase Realtime으로 구현한 실시간 데이터 구독 예제',
    badge: 'Websocket',
  },
  {
    href: '/profile',
    icon: <User className='size-5' />,
    title: '프로필 설정',
    description: '아바타 업로드 포함 프로필 편집 예제 (React Hook Form + Zod)',
    badge: 'Auth',
  },
]

export default function DashboardPage() {
  return (
    <div>
      <WelcomeBanner />

      {/* 통계 카드 */}
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8'>
        <StatsCard
          title='총 노트'
          value='--'
          description='내 노트 개수'
          icon={<FileText className='size-4' />}
        />
        <StatsCard
          title='업로드 파일'
          value='--'
          description='업로드한 파일 수'
          icon={<Upload className='size-4' />}
        />
        <StatsCard
          title='실시간 연결'
          value='활성'
          description='Supabase Realtime'
          icon={<Zap className='size-4' />}
        />
        <StatsCard
          title='계정 상태'
          value='정상'
          description='Supabase Auth'
          icon={<User className='size-4' />}
        />
      </div>

      {/* 기능 안내 */}
      <div>
        <h2 className='text-lg font-semibold mb-4'>주요 기능 예제</h2>
        <div className='grid gap-4 sm:grid-cols-2'>
          {FEATURE_CARDS.map((item) => (
            <Link key={item.href} href={item.href}>
              <Card className='group h-full cursor-pointer transition-all hover:shadow-md hover:border-primary/50'>
                <CardHeader className='pb-2'>
                  <div className='flex items-center justify-between'>
                    <div className='flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors'>
                      {item.icon}
                    </div>
                    <Badge variant='secondary' className='text-xs'>{item.badge}</Badge>
                  </div>
                  <CardTitle className='mt-3 text-base'>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className='text-sm'>{item.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
