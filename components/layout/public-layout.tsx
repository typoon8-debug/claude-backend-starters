import { PublicHeader } from './public-header'
import { PublicFooter } from './public-footer'

interface PublicLayoutProps {
  children: React.ReactNode
}

/** 퍼블릭 페이지 레이아웃 (Header + Main + Footer) */
export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className='flex min-h-screen flex-col bg-background'>
      <PublicHeader />
      <main className='flex-1'>{children}</main>
      <PublicFooter />
    </div>
  )
}
