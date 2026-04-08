'use client'

import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Zap, Circle, Plus, Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useNotesRealtime } from '@/hooks/use-realtime'
import { cn } from '@/lib/utils'

const EVENT_ICONS = {
  INSERT: <Plus className='size-3.5' />,
  UPDATE: <Pencil className='size-3.5' />,
  DELETE: <Trash2 className='size-3.5' />,
}

const EVENT_COLORS = {
  INSERT: 'text-green-600 bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800',
  UPDATE: 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800',
  DELETE: 'text-red-600 bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800',
}

export default function RealtimePage() {
  const { events, isConnected } = useNotesRealtime()

  return (
    <div>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold tracking-tight'>Realtime 구독</h1>
        <p className='mt-1 text-sm text-muted-foreground'>
          Supabase Realtime으로 notes 테이블 변경사항을 실시간 수신합니다
        </p>
      </div>

      {/* 연결 상태 */}
      <Card className='mb-6'>
        <CardHeader className='pb-3'>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-base flex items-center gap-2'>
              <Zap className='size-4 text-primary' /> 연결 상태
            </CardTitle>
            <Badge
              variant={isConnected ? 'default' : 'secondary'}
              className='gap-1.5'
            >
              <Circle className={cn('size-2 fill-current', isConnected ? 'text-green-400' : 'text-muted-foreground')} />
              {isConnected ? '연결됨' : '연결 중...'}
            </Badge>
          </div>
          <CardDescription>
            notes 테이블의 모든 변경사항(INSERT, UPDATE, DELETE)을 구독합니다.
            노트 페이지에서 노트를 생성·수정·삭제하면 아래 피드에 즉시 표시됩니다.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* 사용 방법 안내 */}
      <Card className='mb-6 border-dashed'>
        <CardContent className='pt-4'>
          <p className='text-sm font-medium mb-2'>테스트 방법</p>
          <ol className='space-y-1 text-sm text-muted-foreground list-decimal list-inside'>
            <li>브라우저 탭 2개를 열어 이 페이지를 유지하세요</li>
            <li>다른 탭에서 <a href='/notes' className='underline text-foreground'>/notes</a> 페이지로 이동하세요</li>
            <li>노트를 생성, 수정, 삭제해보세요</li>
            <li>이 페이지 피드에 실시간으로 이벤트가 나타납니다 ✨</li>
          </ol>
        </CardContent>
      </Card>

      {/* 이벤트 피드 */}
      <Card>
        <CardHeader className='pb-2'>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-base'>이벤트 피드</CardTitle>
            <Badge variant='outline'>{events.length}개 이벤트</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-12 text-muted-foreground'>
              <Zap className='mb-3 size-8 opacity-30' />
              <p className='text-sm'>이벤트를 기다리는 중...</p>
              <p className='text-xs mt-1'>노트를 생성하면 여기에 표시됩니다</p>
            </div>
          ) : (
            <ScrollArea className='h-80'>
              <div className='space-y-2'>
                {events.map((event) => (
                  <div
                    key={event.id}
                    className={cn(
                      'flex items-start gap-3 rounded-md border px-3 py-2 text-sm',
                      EVENT_COLORS[event.eventType]
                    )}
                  >
                    <div className='mt-0.5 shrink-0'>
                      {EVENT_ICONS[event.eventType]}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center gap-2'>
                        <span className='font-medium'>{event.eventType}</span>
                        <span className='text-xs opacity-70'>{event.table}</span>
                      </div>
                      {event.record.title && (
                        <p className='mt-0.5 truncate text-xs opacity-80'>
                          &quot;{event.record.title}&quot;
                        </p>
                      )}
                    </div>
                    <span className='shrink-0 text-xs opacity-60'>
                      {format(new Date(event.timestamp), 'HH:mm:ss', { locale: ko })}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      <Separator className='my-6' />

      {/* 코드 예제 */}
      <Card>
        <CardHeader>
          <CardTitle className='text-base'>구현 패턴</CardTitle>
          <CardDescription>hooks/use-realtime.ts의 핵심 코드</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className='overflow-x-auto rounded-md bg-muted p-4 text-xs'>
{`// Supabase Realtime 구독
const channel = supabase
  .channel('realtime-notes')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'notes' },
    (payload) => {
      if (payload.eventType === 'INSERT') addNote(payload.new)
      if (payload.eventType === 'UPDATE') updateNote(payload.new)
      if (payload.eventType === 'DELETE') removeNote(payload.old.id)
    }
  )
  .subscribe()

// cleanup
return () => { supabase.removeChannel(channel) }`}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}
