'use client'

import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Pencil, Trash2, Globe, Lock } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import { EditNoteDialog } from './note-dialog'
import { useNotes } from '@/hooks/use-notes'
import type { Note } from '@/lib/supabase/types'

interface NoteCardProps {
  note: Note
}

/** 노트 카드 컴포넌트 */
export function NoteCard({ note }: NoteCardProps) {
  const { deleteNote, isDeleting } = useNotes()

  return (
    <Card className='group flex flex-col transition-all hover:shadow-md hover:border-primary/30'>
      <CardHeader className='pb-2'>
        <div className='flex items-start justify-between gap-2'>
          <CardTitle className='line-clamp-1 text-base'>{note.title}</CardTitle>
          <Badge variant={note.is_public ? 'default' : 'secondary'} className='shrink-0 gap-1 text-xs'>
            {note.is_public ? (
              <><Globe className='size-3' /> 공개</>
            ) : (
              <><Lock className='size-3' /> 비공개</>
            )}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className='flex-1 pb-2'>
        <p className='line-clamp-3 text-sm text-muted-foreground'>{note.content}</p>
      </CardContent>

      <CardFooter className='flex items-center justify-between pt-2'>
        <span className='text-xs text-muted-foreground'>
          {format(new Date(note.updated_at), 'PPP', { locale: ko })}
        </span>

        {/* 수정/삭제 버튼 (hover 시 표시) */}
        <div className='flex gap-1 opacity-0 transition-opacity group-hover:opacity-100'>
          <EditNoteDialog note={note}>
            <Button variant='ghost' size='icon' className='size-7' aria-label='노트 수정'>
              <Pencil className='size-3.5' />
            </Button>
          </EditNoteDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='size-7 text-muted-foreground hover:text-destructive'
                aria-label='노트 삭제'
                disabled={isDeleting}
              >
                <Trash2 className='size-3.5' />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>노트를 삭제하시겠습니까?</AlertDialogTitle>
                <AlertDialogDescription>
                  &quot;{note.title}&quot; 노트가 영구적으로 삭제됩니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction
                  className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                  onClick={() => deleteNote(note.id)}
                >
                  삭제
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardFooter>
    </Card>
  )
}
