import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: 'size-4',
  md: 'size-6',
  lg: 'size-8',
}

/** 로딩 스피너 컴포넌트 */
export function LoadingSpinner({ className, size = 'md' }: LoadingSpinnerProps) {
  return (
    <Loader2
      className={cn('animate-spin text-muted-foreground', sizeMap[size], className)}
      aria-label='로딩 중'
    />
  )
}

/** 전체 화면 로딩 컴포넌트 */
export function PageLoading() {
  return (
    <div className='flex min-h-[400px] items-center justify-center'>
      <LoadingSpinner size='lg' />
    </div>
  )
}
