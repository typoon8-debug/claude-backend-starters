'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { NoteForm } from './note-form'
import { useNotes } from '@/hooks/use-notes'
import type { Note } from '@/lib/supabase/types'
import type { NoteInput } from '@/lib/schemas/note'

interface CreateNoteDialogProps {
  children: React.ReactNode
}

interface EditNoteDialogProps {
  note: Note
  children: React.ReactNode
}

/** 노트 생성 다이얼로그 */
export function CreateNoteDialog({ children }: CreateNoteDialogProps) {
  const [open, setOpen] = useState(false)
  const { createNote, isCreating } = useNotes()

  const handleSubmit = (data: NoteInput) => {
    createNote(data, {
      onSuccess: () => setOpen(false),
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>새 노트 작성</DialogTitle>
        </DialogHeader>
        <NoteForm onSubmit={handleSubmit} isSubmitting={isCreating} onCancel={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

/** 노트 수정 다이얼로그 */
export function EditNoteDialog({ note, children }: EditNoteDialogProps) {
  const [open, setOpen] = useState(false)
  const { updateNote, isUpdating } = useNotes()

  const handleSubmit = (data: NoteInput) => {
    updateNote({ id: note.id, input: data }, {
      onSuccess: () => setOpen(false),
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>노트 수정</DialogTitle>
        </DialogHeader>
        <NoteForm defaultValues={note} onSubmit={handleSubmit} isSubmitting={isUpdating} onCancel={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
