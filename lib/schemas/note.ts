import { z } from 'zod'

/** 노트 생성/수정 폼 스키마 */
export const noteSchema = z.object({
  title: z
    .string()
    .min(1, '제목을 입력하세요')
    .max(100, '제목은 100자 이하여야 합니다'),
  content: z.string().min(1, '내용을 입력하세요'),
  is_public: z.boolean(),
})

export type NoteInput = z.infer<typeof noteSchema>
