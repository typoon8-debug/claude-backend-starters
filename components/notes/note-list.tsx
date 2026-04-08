'use client'

import { useEffect } from 'react'
import { FileText } from 'lucide-react'
import { NoteCard } from './note-card'
import { Skeleton } from '@/components/ui/skeleton'
import { useNotes } from '@/hooks/use-notes'
import { useNotesStore } from '@/stores/notes-store'
import { useNotesRealtime } from '@/hooks/use-realtime'

/** 노트 목록 컴포넌트 (Realtime 구독 포함) */
export function NoteList() {
  const { notes: queryNotes, isLoading, isError } = useNotes()
  const { notes: storeNotes, setNotes } = useNotesStore()

  // React Query 데이터를 Zustand 스토어에 동기화
  useEffect(() => {
    setNotes(queryNotes)
  }, [queryNotes, setNotes])

  // Realtime 구독 (INSERT/UPDATE/DELETE 이벤트를 스토어에 반영)
  useNotesRealtime()

  if (isLoading) {
    return (
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className='space-y-3 rounded-lg border p-4'>
            <Skeleton className='h-4 w-3/4' />
            <Skeleton className='h-3 w-full' />
            <Skeleton className='h-3 w-2/3' />
          </div>
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className='flex flex-col items-center justify-center py-12 text-muted-foreground'>
        <FileText className='mb-3 size-10' />
        <p>노트를 불러오지 못했습니다. 다시 시도해주세요.</p>
      </div>
    )
  }

  if (storeNotes.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-16 text-muted-foreground'>
        <FileText className='mb-4 size-12 opacity-30' />
        <p className='text-sm font-medium'>노트가 없습니다</p>
        <p className='mt-1 text-xs'>첫 번째 노트를 작성해보세요!</p>
      </div>
    )
  }

  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      {storeNotes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  )
}
