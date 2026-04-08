import { createClient } from '@/lib/supabase/server'
import { apiSuccess, apiError, apiUnauthorized, apiBadRequest, apiNotFound } from '@/lib/api/response'
import { noteSchema } from '@/lib/schemas/note'

interface RouteContext {
  params: Promise<{ id: string }>
}

/** GET /api/notes/[id] — 노트 단건 조회 */
export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return apiUnauthorized()

  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return apiNotFound('노트')
  return apiSuccess(data)
}

/** PUT /api/notes/[id] — 노트 수정 */
export async function PUT(request: Request, { params }: RouteContext) {
  const { id } = await params
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
    .update(parsed.data)
    .eq('id', id)
    .eq('user_id', user.id) // RLS 외에 추가 확인
    .select()
    .single()

  if (error || !data) return apiNotFound('노트')
  return apiSuccess(data)
}

/** DELETE /api/notes/[id] — 노트 삭제 */
export async function DELETE(_request: Request, { params }: RouteContext) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return apiUnauthorized()

  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return apiError(error.message)
  return apiSuccess({ message: '삭제되었습니다' })
}
