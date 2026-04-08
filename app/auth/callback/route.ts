import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Supabase Auth 콜백 Route Handler
 * 이메일 인증 및 소셜 로그인 후 리다이렉트되는 엔드포인트
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // 인증 성공: 대시보드 또는 지정된 경로로 리다이렉트
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // 인증 실패: 에러 파라미터와 함께 로그인 페이지로 리다이렉트
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
