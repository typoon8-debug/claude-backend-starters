'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { noteSchema, type NoteInput } from '@/lib/schemas/note'
import type { Note } from '@/lib/supabase/types'

interface NoteFormProps {
  /** 수정 시 기존 노트 데이터 */
  defaultValues?: Note
  onSubmit: (data: NoteInput) => void
  isSubmitting: boolean
  onCancel?: () => void
}

/** 노트 생성/수정 폼 */
export function NoteForm({ defaultValues, onSubmit, isSubmitting, onCancel }: NoteFormProps) {
  const form = useForm<NoteInput>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: defaultValues?.title ?? '',
      content: defaultValues?.content ?? '',
      is_public: defaultValues?.is_public ?? false,
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>제목</FormLabel>
              <FormControl>
                <Input placeholder='노트 제목 입력' maxLength={100} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='content'
          render={({ field }) => (
            <FormItem>
              <FormLabel>내용</FormLabel>
              <FormControl>
                <Textarea placeholder='내용을 입력하세요' rows={5} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='is_public'
          render={({ field }) => (
            <FormItem className='flex items-center justify-between rounded-md border p-4'>
              <div>
                <FormLabel className='text-sm font-medium'>공개 노트</FormLabel>
                <FormDescription className='text-xs'>
                  다른 사용자가 이 노트를 볼 수 있습니다
                </FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className='flex gap-2 justify-end'>
          {onCancel && (
            <Button type='button' variant='outline' onClick={onCancel} disabled={isSubmitting}>
              취소
            </Button>
          )}
          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting ? '저장 중...' : defaultValues ? '수정' : '생성'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
