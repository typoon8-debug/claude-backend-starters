'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { UserAvatar } from '@/components/common/user-avatar'
import { useAuthStore } from '@/stores/auth-store'
import { profileSchema, type ProfileInput } from '@/lib/schemas/profile'

export default function ProfilePage() {
  const { user, profile, setProfile } = useAuthStore()

  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: profile?.full_name ?? '',
      bio: profile?.bio ?? '',
      website: profile?.website ?? '',
    },
  })

  // 프로필 데이터 로드 시 폼 업데이트
  useEffect(() => {
    if (profile) {
      form.reset({
        fullName: profile.full_name ?? '',
        bio: profile.bio ?? '',
        website: profile.website ?? '',
      })
    }
  }, [profile, form])

  const onSubmit = async (data: ProfileInput) => {
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      toast.error('프로필 저장에 실패했습니다')
      return
    }

    const json = await res.json() as { data: typeof profile }
    setProfile(json.data)
    toast.success('프로필이 저장되었습니다!')
  }

  return (
    <div>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold tracking-tight'>프로필 설정</h1>
        <p className='mt-1 text-sm text-muted-foreground'>계정 정보를 관리하세요</p>
      </div>

      <div className='grid gap-6 md:grid-cols-3'>
        {/* 아바타 섹션 */}
        <Card className='md:col-span-1'>
          <CardHeader>
            <CardTitle className='text-base'>프로필 사진</CardTitle>
            <CardDescription>Supabase Storage에 저장됩니다</CardDescription>
          </CardHeader>
          <CardContent className='flex flex-col items-center gap-4'>
            <UserAvatar
              name={profile?.full_name ?? user?.email}
              avatarUrl={profile?.avatar_url}
              size='lg'
            />
            <div className='text-center'>
              <p className='text-sm font-medium'>{profile?.full_name ?? '이름 미설정'}</p>
              <p className='text-xs text-muted-foreground'>{user?.email}</p>
            </div>
            <Button variant='outline' size='sm' disabled className='w-full'>
              사진 변경 (준비 중)
            </Button>
          </CardContent>
        </Card>

        {/* 프로필 폼 */}
        <Card className='md:col-span-2'>
          <CardHeader>
            <CardTitle className='text-base'>기본 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                <FormField
                  control={form.control}
                  name='fullName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>이름</FormLabel>
                      <FormControl>
                        <Input placeholder='홍길동' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='bio'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>소개</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='간단한 자기소개를 입력하세요 (최대 300자)'
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {(field.value?.length ?? 0)} / 300자
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='website'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>웹사이트</FormLabel>
                      <FormControl>
                        <Input
                          type='url'
                          placeholder='https://example.com'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <div className='flex items-center justify-between'>
                  <p className='text-xs text-muted-foreground'>
                    이메일: {user?.email}
                  </p>
                  <Button type='submit' disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? '저장 중...' : '저장'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
