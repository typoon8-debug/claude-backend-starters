import { create } from 'zustand'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/lib/supabase/types'
import { createClient } from '@/lib/supabase/client'

interface AuthState {
  /** 현재 로그인한 Supabase 유저 */
  user: User | null
  /** profiles 테이블에서 가져온 추가 프로필 정보 */
  profile: Profile | null
  /** 인증 상태 로딩 여부 */
  isLoading: boolean

  setUser: (user: User | null) => void
  setProfile: (profile: Profile | null) => void
  setLoading: (isLoading: boolean) => void
  /** 로그아웃 처리 */
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  isLoading: true,

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (isLoading) => set({ isLoading }),

  signOut: async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    set({ user: null, profile: null })
  },
}))
