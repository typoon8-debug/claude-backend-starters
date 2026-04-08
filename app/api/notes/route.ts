import { createClient } from '@/lib/supabase/server'
import { apiSuccess, apiError, apiUnauthorized, apiBadRequest } from '@/lib/api/response'
import { noteSchema } from '@/lib/schemas/note'

/** GET /api/notes — 내 노트 목록 조회 */
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return apiUnauthorized()

  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return apiError(error.message)
  return apiSuccess(data)
}

/** POST /api/notes — 노트 생성 */
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return apiUnauthorized()

  const body = await request.json() as unknown
  const parsed = noteSchema.safeParse(body)

  if (!parsed.success) {
    return apiBadRequest(parsed.error.errors[0]?.message ?? '입력값이 올바르지 않습니다')
  }

  const { data, error } = await supabase
    .from('notes')
    .insert({ ...parsed.data, user_id: user.id })
    .select()
    .single()

  if (error) return apiError(error.message)
  return apiSuccess(data, 201)
}
