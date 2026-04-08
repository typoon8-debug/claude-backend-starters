import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types'

/**
 * 브라우저(클라이언트 컴포넌트)에서 사용하는 Supabase 클라이언트
 * 싱글턴 패턴으로 불필요한 인스턴스 생성 방지
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
