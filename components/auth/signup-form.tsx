'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { toast } from 'sonner'
import { Eye, EyeOff, CheckCircle } from 'lucide-react'
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
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { SocialAuthButtons } from './social-auth-buttons'
import { createClient } from '@/lib/supabase/client'
import { signupSchema, type SignupInput } from '@/lib/schemas/auth'

/** 회원가입 폼 */
export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: SignupInput) => {
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { full_name: data.fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      toast.error('회원가입 실패: ' + error.message)
      return
    }

    setIsSuccess(true)
  }

  // 이메일 인증 안내 화면
  if (isSuccess) {
    return (
      <Card className='w-full max-w-md'>
        <CardContent className='flex flex-col items-center gap-4 pt-8 pb-8 text-center'>
          <CheckCircle className='size-12 text-green-500' />
          <h2 className='text-xl font-bold'>이메일을 확인해주세요!</h2>
          <p className='text-sm text-muted-foreground'>
            {form.getValues('email')}으로 인증 이메일을 발송했습니다.
            이메일의 링크를 클릭하여 회원가입을 완료하세요.
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
        <CardTitle className='text-2xl'>회원가입</CardTitle>
        <CardDescription>새 계정을 만들어 시작하세요</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <SocialAuthButtons />

        <div className='relative'>
          <div className='absolute inset-0 flex items-center'>
            <Separator />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-card px-2 text-muted-foreground'>또는 이메일로 가입</span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='fullName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이름</FormLabel>
                  <FormControl>
                    <Input placeholder='홍길동' autoComplete='name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>비밀번호</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder='••••••••'
                        autoComplete='new-password'
                        {...field}
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='absolute right-0 top-0 size-9 text-muted-foreground'
                        onClick={() => setShowPassword((v) => !v)}
                      >
                        {showPassword ? <EyeOff className='size-4' /> : <Eye className='size-4' />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>비밀번호 확인</FormLabel>
                  <FormControl>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder='••••••••'
                      autoComplete='new-password'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Alert>
              <AlertDescription className='text-xs text-muted-foreground'>
                비밀번호는 8자 이상, 영문 대문자와 숫자를 포함해야 합니다.
              </AlertDescription>
            </Alert>

            <Button type='submit' className='w-full' disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? '가입 중...' : '회원가입'}
            </Button>
          </form>
        </Form>

        <p className='text-center text-sm text-muted-foreground'>
          이미 계정이 있으신가요?{' '}
          <Link href='/login' className='font-medium text-foreground hover:underline'>
            로그인
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
