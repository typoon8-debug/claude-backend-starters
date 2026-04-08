'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Info, AlertTriangle } from 'lucide-react'

/** 폼 예제용 Zod 스키마 */
const demoFormSchema = z.object({
  username: z.string().min(2, '2자 이상 입력하세요').max(20, '20자 이하여야 합니다'),
  email: z.string().email('올바른 이메일을 입력하세요'),
  role: z.string({ required_error: '역할을 선택하세요' }),
  notifications: z.boolean(),
  plan: z.enum(['free', 'pro', 'enterprise'], { required_error: '플랜을 선택하세요' }),
})
type DemoFormValues = z.infer<typeof demoFormSchema>

/** shadcn/ui 컴포넌트 인터랙티브 쇼케이스 */
export function ComponentShowcase() {
  const [progress, setProgress] = useState(40)
  const [isChecked, setIsChecked] = useState(false)
  const [isSwitched, setIsSwitched] = useState(false)

  const form = useForm<DemoFormValues>({
    resolver: zodResolver(demoFormSchema),
    defaultValues: { username: '', email: '', notifications: false },
  })

  const onDemoFormSubmit = (data: DemoFormValues) => {
    toast.success(`제출 완료! ${data.username}님 환영합니다.`)
  }

  return (
    <Tabs defaultValue='basic' className='w-full'>
      <TabsList className='grid w-full grid-cols-5'>
        <TabsTrigger value='basic'>기본</TabsTrigger>
        <TabsTrigger value='input'>입력</TabsTrigger>
        <TabsTrigger value='feedback'>피드백</TabsTrigger>
        <TabsTrigger value='data'>데이터</TabsTrigger>
        <TabsTrigger value='form'>폼 예제</TabsTrigger>
      </TabsList>

      {/* ─── Tab 1: 기본 컴포넌트 ─── */}
      <TabsContent value='basic' className='space-y-6 pt-4'>
        {/* Button variants */}
        <Card>
          <CardHeader><CardTitle className='text-base'>Button</CardTitle></CardHeader>
          <CardContent className='flex flex-wrap gap-2'>
            <Button>기본</Button>
            <Button variant='secondary'>Secondary</Button>
            <Button variant='outline'>Outline</Button>
            <Button variant='ghost'>Ghost</Button>
            <Button variant='destructive'>Destructive</Button>
            <Button disabled>비활성</Button>
            <Button size='sm'>Small</Button>
            <Button size='lg'>Large</Button>
          </CardContent>
        </Card>

        {/* Badge variants */}
        <Card>
          <CardHeader><CardTitle className='text-base'>Badge</CardTitle></CardHeader>
          <CardContent className='flex flex-wrap gap-2'>
            <Badge>기본</Badge>
            <Badge variant='secondary'>Secondary</Badge>
            <Badge variant='outline'>Outline</Badge>
            <Badge variant='destructive'>Destructive</Badge>
          </CardContent>
        </Card>

        {/* Avatar */}
        <Card>
          <CardHeader><CardTitle className='text-base'>Avatar</CardTitle></CardHeader>
          <CardContent className='flex flex-wrap gap-4 items-center'>
            <Avatar className='size-12'>
              <AvatarImage src='https://github.com/shadcn.png' alt='shadcn' />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <Avatar className='size-10'>
              <AvatarFallback>홍길</AvatarFallback>
            </Avatar>
            <Avatar className='size-8'>
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
          </CardContent>
        </Card>

        {/* Skeleton */}
        <Card>
          <CardHeader><CardTitle className='text-base'>Skeleton (로딩 상태)</CardTitle></CardHeader>
          <CardContent className='flex flex-col gap-3'>
            <div className='flex items-center gap-3'>
              <Skeleton className='size-10 rounded-full' />
              <div className='space-y-2'>
                <Skeleton className='h-3 w-32' />
                <Skeleton className='h-3 w-24' />
              </div>
            </div>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-3/4' />
          </CardContent>
        </Card>

        {/* Accordion */}
        <Card>
          <CardHeader><CardTitle className='text-base'>Accordion</CardTitle></CardHeader>
          <CardContent>
            <Accordion type='single' collapsible className='w-full'>
              <AccordionItem value='item-1'>
                <AccordionTrigger>Supabase Auth란?</AccordionTrigger>
                <AccordionContent>이메일/비밀번호, 소셜 로그인, Magic Link 등 다양한 인증 방식을 지원하는 Supabase의 인증 시스템입니다.</AccordionContent>
              </AccordionItem>
              <AccordionItem value='item-2'>
                <AccordionTrigger>Row Level Security(RLS)란?</AccordionTrigger>
                <AccordionContent>데이터베이스 레벨에서 행(Row) 단위로 접근 권한을 제어하는 PostgreSQL 기능입니다. Supabase에서 핵심 보안 레이어 역할을 합니다.</AccordionContent>
              </AccordionItem>
              <AccordionItem value='item-3'>
                <AccordionTrigger>Zustand vs. Redux?</AccordionTrigger>
                <AccordionContent>Zustand는 보일러플레이트가 거의 없고 API가 단순한 경량 상태관리 라이브러리입니다. 작은~중간 규모 앱에 이상적입니다.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </TabsContent>

      {/* ─── Tab 2: 입력 컴포넌트 ─── */}
      <TabsContent value='input' className='space-y-6 pt-4'>
        <Card>
          <CardHeader><CardTitle className='text-base'>Input & Textarea</CardTitle></CardHeader>
          <CardContent className='space-y-3'>
            <Input placeholder='텍스트 입력' />
            <Input type='email' placeholder='이메일 입력' />
            <Input disabled placeholder='비활성 입력' />
            <Textarea placeholder='여러 줄 텍스트 입력' rows={3} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className='text-base'>Select</CardTitle></CardHeader>
          <CardContent>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder='역할 선택' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='admin'>관리자</SelectItem>
                <SelectItem value='user'>일반 사용자</SelectItem>
                <SelectItem value='guest'>게스트</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className='text-base'>Checkbox & Switch</CardTitle></CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center gap-2'>
              <Checkbox
                id='demo-checkbox'
                checked={isChecked}
                onCheckedChange={(v) => setIsChecked(v === true)}
              />
              <Label htmlFor='demo-checkbox'>
                알림 수신 동의 {isChecked ? '(✓ 체크됨)' : '(미체크)'}
              </Label>
            </div>
            <div className='flex items-center gap-2'>
              <Switch
                id='demo-switch'
                checked={isSwitched}
                onCheckedChange={setIsSwitched}
              />
              <Label htmlFor='demo-switch'>
                다크 모드 {isSwitched ? '켜짐' : '꺼짐'}
              </Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className='text-base'>Progress</CardTitle></CardHeader>
          <CardContent className='space-y-3'>
            <Progress value={progress} />
            <p className='text-sm text-muted-foreground'>현재 진행률: {progress}%</p>
            <div className='flex gap-2'>
              <Button size='sm' variant='outline' onClick={() => setProgress((p) => Math.max(0, p - 10))}>-10%</Button>
              <Button size='sm' variant='outline' onClick={() => setProgress((p) => Math.min(100, p + 10))}>+10%</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* ─── Tab 3: 피드백 컴포넌트 ─── */}
      <TabsContent value='feedback' className='space-y-6 pt-4'>
        <Card>
          <CardHeader><CardTitle className='text-base'>Toast (Sonner)</CardTitle></CardHeader>
          <CardContent className='flex flex-wrap gap-2'>
            <Button variant='outline' onClick={() => toast('기본 토스트 메시지')}>기본</Button>
            <Button variant='outline' onClick={() => toast.success('성공했습니다!')}>성공</Button>
            <Button variant='outline' onClick={() => toast.error('오류가 발생했습니다')}>에러</Button>
            <Button variant='outline' onClick={() => toast.warning('주의하세요!')}>경고</Button>
            <Button variant='outline' onClick={() => toast.info('참고하세요')}>정보</Button>
            <Button
              variant='outline'
              onClick={() =>
                toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
                  loading: '처리 중...',
                  success: '완료되었습니다!',
                  error: '실패했습니다',
                })
              }
            >
              Promise
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className='text-base'>Alert</CardTitle></CardHeader>
          <CardContent className='space-y-3'>
            <Alert>
              <Info className='size-4' />
              <AlertTitle>정보</AlertTitle>
              <AlertDescription>일반적인 안내 메시지입니다.</AlertDescription>
            </Alert>
            <Alert variant='destructive'>
              <AlertTriangle className='size-4' />
              <AlertTitle>오류</AlertTitle>
              <AlertDescription>문제가 발생했습니다. 다시 시도해주세요.</AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className='text-base'>Dialog & AlertDialog</CardTitle></CardHeader>
          <CardContent className='flex flex-wrap gap-2'>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant='outline'>Dialog 열기</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Dialog 예제</DialogTitle>
                  <DialogDescription>
                    이것은 shadcn/ui Dialog 컴포넌트 예제입니다. 모달 창으로 추가 정보나 폼을 표시할 때 사용합니다.
                  </DialogDescription>
                </DialogHeader>
                <div className='py-2'>
                  <Input placeholder='여기에 입력하세요' />
                </div>
                <DialogFooter>
                  <Button variant='outline'>취소</Button>
                  <Button>확인</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant='destructive'>삭제 확인</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
                  <AlertDialogDescription>
                    이 작업은 되돌릴 수 없습니다. 데이터가 영구적으로 삭제됩니다.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction onClick={() => toast.success('삭제되었습니다')}>
                    삭제
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </TabsContent>

      {/* ─── Tab 4: 데이터 컴포넌트 ─── */}
      <TabsContent value='data' className='space-y-6 pt-4'>
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Table</CardTitle>
            <CardDescription>데이터를 표 형식으로 표시합니다</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='rounded-md border'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='border-b bg-muted/50'>
                    <th className='px-4 py-3 text-left font-medium'>이름</th>
                    <th className='px-4 py-3 text-left font-medium'>이메일</th>
                    <th className='px-4 py-3 text-left font-medium'>역할</th>
                    <th className='px-4 py-3 text-left font-medium'>상태</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: '홍길동', email: 'hong@example.com', role: '관리자', status: '활성' },
                    { name: '김영희', email: 'kim@example.com', role: '사용자', status: '활성' },
                    { name: '이철수', email: 'lee@example.com', role: '게스트', status: '비활성' },
                  ].map((row) => (
                    <tr key={row.email} className='border-b last:border-0 hover:bg-muted/30'>
                      <td className='px-4 py-3 font-medium'>{row.name}</td>
                      <td className='px-4 py-3 text-muted-foreground'>{row.email}</td>
                      <td className='px-4 py-3'><Badge variant='outline'>{row.role}</Badge></td>
                      <td className='px-4 py-3'>
                        <Badge variant={row.status === '활성' ? 'default' : 'secondary'}>
                          {row.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* ─── Tab 5: 완전한 폼 예제 ─── */}
      <TabsContent value='form' className='pt-4'>
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>React Hook Form + Zod 예제</CardTitle>
            <CardDescription>실제 폼 검증 패턴을 보여주는 데모입니다</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onDemoFormSubmit)} className='space-y-4'>
                <div className='grid gap-4 sm:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='username'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>사용자명</FormLabel>
                        <FormControl>
                          <Input placeholder='홍길동' {...field} />
                        </FormControl>
                        <FormDescription>2~20자 사이로 입력하세요</FormDescription>
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
                          <Input type='email' placeholder='name@example.com' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name='role'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>역할</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='역할 선택' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='admin'>관리자</SelectItem>
                          <SelectItem value='user'>일반 사용자</SelectItem>
                          <SelectItem value='guest'>게스트</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='plan'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>플랜</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className='flex gap-4'
                        >
                          <div className='flex items-center gap-2'>
                            <RadioGroupItem value='free' id='plan-free' />
                            <Label htmlFor='plan-free'>무료</Label>
                          </div>
                          <div className='flex items-center gap-2'>
                            <RadioGroupItem value='pro' id='plan-pro' />
                            <Label htmlFor='plan-pro'>Pro</Label>
                          </div>
                          <div className='flex items-center gap-2'>
                            <RadioGroupItem value='enterprise' id='plan-enterprise' />
                            <Label htmlFor='plan-enterprise'>Enterprise</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='notifications'
                  render={({ field }) => (
                    <FormItem className='flex items-center gap-3 rounded-md border p-4'>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div>
                        <FormLabel className='text-sm font-medium'>이메일 알림</FormLabel>
                        <FormDescription className='text-xs'>
                          새로운 업데이트를 이메일로 받습니다
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                {form.formState.errors.root && (
                  <Alert variant='destructive'>
                    <AlertTriangle className='size-4' />
                    <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
                  </Alert>
                )}

                <div className='flex gap-2'>
                  <Button type='submit' disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? '제출 중...' : '제출'}
                  </Button>
                  <Button type='button' variant='outline' onClick={() => form.reset()}>
                    초기화
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
