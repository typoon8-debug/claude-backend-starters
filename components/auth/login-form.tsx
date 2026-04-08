'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { loginSchema, type LoginInput } from '@/lib/schemas/auth'

/** 이메일/비밀번호 로그인 폼 */
export function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data: LoginInput) => {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      toast.error('로그인 실패: ' + error.message)
      return
    }

    toast.success('로그인 성공!')
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <Card className='w-full max-w-sm'>
      <CardHeader className='space-y-1'>
        <CardTitle className='text-2xl font-bold tracking-tight'>로그인</CardTitle>
        <CardDescription>이메일과 비밀번호로 로그인하세요</CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이메일</FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      placeholder='name@example.com'
                      autoComplete='email'
                      autoFocus
                      {...field}
                    />
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
                  <div className='flex items-center justify-between'>
                    <FormLabel>비밀번호</FormLabel>
                    <Link
                      href='/forgot-password'
                      className='text-xs text-muted-foreground underline-offset-4 hover:underline'
                    >
                      비밀번호 찾기
                    </Link>
                  </div>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder='••••••••'
                        autoComplete='current-password'
                        {...field}
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='absolute right-0 top-0 size-9 text-muted-foreground'
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                      >
                        {showPassword ? <EyeOff className='size-4' /> : <Eye className='size-4' />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type='submit'
              className='w-full'
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? '로그인 중...' : '로그인하기'}
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className='justify-center'>
        <p className='text-sm text-muted-foreground'>
          계정이 없으신가요?{' '}
          <Link
            href='/signup'
            className='font-semibold text-primary underline-offset-4 hover:underline'
          >
            회원가입
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
