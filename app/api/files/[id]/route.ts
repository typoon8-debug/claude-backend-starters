import { createClient } from '@/lib/supabase/server'
import { apiSuccess, apiError, apiUnauthorized, apiNotFound } from '@/lib/api/response'

interface RouteContext {
  params: Promise<{ id: string }>
}

/** DELETE /api/files/[id] — 파일 레코드 삭제 */
export async function DELETE(_request: Request, { params }: RouteContext) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return apiUnauthorized()

  // 파일 레코드 조회 (Storage 경로 확인)
  const { data: record } = await supabase
    .from('file_records')
    .select('file_path')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!record) return apiNotFound('파일')

  // Storage에서 파일 삭제
  await supabase.storage.from('files').remove([record.file_path])

  // DB에서 레코드 삭제
  const { error } = await supabase
    .from('file_records')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return apiError(error.message)
  return apiSuccess({ message: '삭제되었습니다' })
}
