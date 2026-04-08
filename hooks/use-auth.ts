'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/stores/auth-store'

/**
 * 인증 상태를 관리하는 훅
 * Supabase Auth 상태 변경을 구독하고 Zustand 스토어와 동기화
 */
export function useAuth() {
  const { user, profile, isLoading, setUser, setProfile, setLoading, signOut } =
    useAuthStore()

  useEffect(() => {
    const supabase = createClient()

    // 현재 세션 확인
    const initAuth = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser()
      setUser(currentUser)

      if (currentUser) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single()
        setProfile(profileData)
      }
      setLoading(false)
    }

    initAuth()

    // 인증 상태 변경 구독
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)

      if (session?.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        setProfile(profileData)
      } else {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [setUser, setProfile, setLoading])

  return { user, profile, isLoading, signOut }
}
