'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { Note } from '@/lib/supabase/types'
import type { NoteInput } from '@/lib/schemas/note'

const NOTES_KEY = ['notes'] as const

/** 노트 목록 조회 */
async function fetchNotes(): Promise<Note[]> {
  const res = await fetch('/api/notes')
  if (!res.ok) throw new Error('노트 목록을 불러오지 못했습니다')
  const json = await res.json() as { data: Note[] }
  return json.data
}

/** 노트 생성 */
async function createNote(input: NoteInput): Promise<Note> {
  const res = await fetch('/api/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error('노트 생성에 실패했습니다')
  const json = await res.json() as { data: Note }
  return json.data
}

/** 노트 수정 */
async function updateNote({ id, input }: { id: string; input: NoteInput }): Promise<Note> {
  const res = await fetch(`/api/notes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error('노트 수정에 실패했습니다')
  const json = await res.json() as { data: Note }
  return json.data
}

/** 노트 삭제 */
async function deleteNote(id: string): Promise<void> {
  const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('노트 삭제에 실패했습니다')
}

/** @tanstack/react-query 기반 노트 CRUD 훅 */
export function useNotes() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: NOTES_KEY,
    queryFn: fetchNotes,
  })

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTES_KEY })
      toast.success('노트가 생성되었습니다')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTES_KEY })
      toast.success('노트가 수정되었습니다')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTES_KEY })
      toast.success('노트가 삭제되었습니다')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  return {
    notes: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    createNote: createMutation.mutate,
    updateNote: updateMutation.mutate,
    deleteNote: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
