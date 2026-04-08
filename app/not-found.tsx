import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, AlertCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-6 p-4 text-center'>
      <div className='flex flex-col items-center gap-4'>
        <div className='rounded-full bg-muted p-4'>
          <AlertCircle className='size-10 text-muted-foreground' />
        </div>
        <div>
          <h1 className='text-6xl font-bold tracking-tight'>404</h1>
          <h2 className='mt-2 text-xl font-semibold'>페이지를 찾을 수 없습니다</h2>
          <p className='mt-2 text-sm text-muted-foreground'>
            요청하신 페이지가 존재하지 않거나 이동되었습니다.
          </p>
        </div>
      </div>
      <Button asChild>
        <Link href='/'>
          <Home className='mr-2 size-4' />
          홈으로 돌아가기
        </Link>
      </Button>
    </div>
  )
}
