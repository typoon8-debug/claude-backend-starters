import { createClient } from '@/lib/supabase/server'
import { apiSuccess, apiError, apiUnauthorized, apiBadRequest } from '@/lib/api/response'
import { profileSchema } from '@/lib/schemas/profile'

/** GET /api/profile — 내 프로필 조회 */
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return apiUnauthorized()

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) return apiError(error.message)
  return apiSuccess(data)
}

/** PUT /api/profile — 프로필 수정 */
export async function PUT(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return apiUnauthorized()

  const body = await request.json() as unknown
  const parsed = profileSchema.safeParse(body)

  if (!parsed.success) {
    return apiBadRequest(parsed.error.errors[0]?.message ?? '입력값이 올바르지 않습니다')
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({
      full_name: parsed.data.fullName,
      bio: parsed.data.bio,
      website: parsed.data.website ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)
    .select()
    .single()

  if (error) return apiError(error.message)
  return apiSuccess(data)
}
