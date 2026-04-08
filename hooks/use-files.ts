'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { FileRecord } from '@/lib/supabase/types'

const FILES_KEY = ['files'] as const

/** 파일 목록 조회 */
async function fetchFiles(): Promise<FileRecord[]> {
  const res = await fetch('/api/files')
  if (!res.ok) throw new Error('파일 목록을 불러오지 못했습니다')
  const json = await res.json() as { data: FileRecord[] }
  return json.data
}

/** 파일 메타데이터 저장 */
async function saveFileRecord(
  record: Omit<FileRecord, 'id' | 'user_id' | 'created_at'>
): Promise<FileRecord> {
  const res = await fetch('/api/files', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(record),
  })
  if (!res.ok) throw new Error('파일 정보 저장에 실패했습니다')
  const json = await res.json() as { data: FileRecord }
  return json.data
}

/** 파일 삭제 */
async function deleteFile(id: string): Promise<void> {
  const res = await fetch(`/api/files/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('파일 삭제에 실패했습니다')
}

/** @tanstack/react-query 기반 파일 관리 훅 */
export function useFiles() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: FILES_KEY,
    queryFn: fetchFiles,
  })

  const saveMutation = useMutation({
    mutationFn: saveFileRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FILES_KEY })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FILES_KEY })
      toast.success('파일이 삭제되었습니다')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })

  return {
    files: query.data ?? [],
    isLoading: query.isLoading,
    saveFile: saveMutation.mutateAsync,
    deleteFile: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  }
}
