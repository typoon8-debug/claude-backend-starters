import type { Metadata } from 'next'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NoteList } from '@/components/notes/note-list'
import { CreateNoteDialog } from '@/components/notes/note-dialog'

export const metadata: Metadata = { title: '노트 CRUD' }

export default function NotesPage() {
  return (
    <div>
      {/* 페이지 헤더 */}
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>노트</h1>
          <p className='mt-1 text-sm text-muted-foreground'>
            Supabase PostgreSQL + RLS + Realtime 연동 CRUD 예제
          </p>
        </div>
        <CreateNoteDialog>
          <Button className='gap-2'>
            <Plus className='size-4' />
            새 노트
          </Button>
        </CreateNoteDialog>
      </div>

      {/* 노트 목록 */}
      <NoteList />
    </div>
  )
}
