import type { User } from '@supabase/supabase-js'
import type { Profile, Note, FileRecord } from '@/lib/supabase/types'

/** 공통 타입 재export */
export type { User, Profile, Note, FileRecord }

/** API 성공 응답 타입 */
export type ApiSuccess<T> = {
  data: T
}

/** API 에러 응답 타입 */
export type ApiError = {
  error: string
}

/** API 응답 타입 (성공 또는 에러) */
export type ApiResponse<T> = ApiSuccess<T> | ApiError

/** 파일 업로드 허용 타입 */
export const ALLOWED_FILE_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'image/webp': ['.webp'],
  'application/pdf': ['.pdf'],
  'text/plain': ['.txt'],
  'application/zip': ['.zip'],
} as const

/** 최대 파일 크기 (50MB) */
export const MAX_FILE_SIZE = 50 * 1024 * 1024

/** 네비게이션 아이템 타입 */
export interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}
