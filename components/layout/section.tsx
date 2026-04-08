import * as React from 'react'
import { cn } from '@/lib/utils'

/** 재사용 가능한 섹션 컨테이너 컴포넌트 */
export function Section({ className, ...props }: React.ComponentProps<'section'>) {
  return (
    <section
      className={cn('container mx-auto px-4 py-16 md:py-24', className)}
      {...props}
    />
  )
}
