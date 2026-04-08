import { createClient } from '@/lib/supabase/server'
import { apiSuccess, apiError, apiUnauthorized, apiBadRequest } from '@/lib/api/response'
import { z } from 'zod'

/** 파일 메타데이터 저장 스키마 */
const fileRecordSchema = z.object({
  file_name: z.string().min(1),
  file_path: z.string().min(1),
  file_size: z.number().positive(),
  content_type: z.string().min(1),
})

/** GET /api/files — 내 파일 목록 조회 */
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return apiUnauthorized()

  const { data, error } = await supabase
    .from('file_records')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return apiError(error.message)
  return apiSuccess(data)
}

/** POST /api/files — 파일 메타데이터 저장 */
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return apiUnauthorized()

  const body = await request.json() as unknown
  const parsed = fileRecordSchema.safeParse(body)

  if (!parsed.success) {
    return apiBadRequest(parsed.error.errors[0]?.message ?? '입력값이 올바르지 않습니다')
  }

  const { data, error } = await supabase
    .from('file_records')
    .insert({ ...parsed.data, user_id: user.id })
    .select()
    .single()

  if (error) return apiError(error.message)
  return apiSuccess(data, 201)
}
