import { z } from 'zod'

/** 프로필 수정 폼 스키마 */
export const profileSchema = z.object({
  fullName: z.string().max(50, '이름은 50자 이하여야 합니다').optional(),
  bio: z.string().max(300, '소개는 300자 이하여야 합니다').optional(),
  website: z
    .string()
    .url('유효한 URL을 입력하세요')
    .optional()
    .or(z.literal('')),
})

export type ProfileInput = z.infer<typeof profileSchema>
