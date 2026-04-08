'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { toast } from 'sonner'
import { Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/schemas/auth'

/** 비밀번호 찾기 폼 */
export function ForgotPasswordForm() {
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = async (data: ForgotPasswordInput) => {
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      toast.error('이메일 발송 실패: ' + error.message)
      return
    }

    setIsSuccess(true)
  }

  if (isSuccess) {
    return (
      <Card className='w-full max-w-md'>
        <CardContent className='flex flex-col items-center gap-4 pt-8 pb-8 text-center'>
          <Mail className='size-12 text-primary' />
          <h2 className='text-xl font-bold'>이메일을 확인해주세요!</h2>
          <p className='text-sm text-muted-foreground'>
            비밀번호 재설정 링크를 {form.getValues('email')}으로 발송했습니다.
          </p>
          <Link href='/login' className='text-sm font-medium hover:underline'>
            로그인 페이지로 돌아가기
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className='w-full max-w-md'>
      <CardHeader className='text-center'>
        <CardTitle className='text-2xl'>비밀번호 찾기</CardTitle>
        <CardDescription>이메일 주소를 입력하면 재설정 링크를 보내드립니다</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이메일</FormLabel>
                  <FormControl>
                    <Input type='email' placeholder='name@example.com' autoComplete='email' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' className='w-full' disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? '발송 중...' : '재설정 이메일 발송'}
            </Button>
          </form>
        </Form>

        <p className='text-center text-sm text-muted-foreground'>
          <Link href='/login' className='font-medium text-foreground hover:underline'>
            로그인으로 돌아가기
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
