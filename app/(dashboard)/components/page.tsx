import type { Metadata } from 'next'
import { ComponentShowcase } from '@/components/showcase/component-showcase'

export const metadata: Metadata = { title: '컴포넌트 쇼케이스' }

export default function ComponentsPage() {
  return (
    <div>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold tracking-tight'>컴포넌트 쇼케이스</h1>
        <p className='mt-1 text-sm text-muted-foreground'>
          shadcn/ui 컴포넌트 인터랙티브 데모 — 모든 컴포넌트를 직접 조작해보세요.
        </p>
      </div>
      <ComponentShowcase />
    </div>
  )
}
