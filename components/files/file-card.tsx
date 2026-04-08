'use client'

import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Trash2, FileIcon, FileTextIcon, Download } from 'lucide-react'
import Image from 'next/image'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
import { createClient } from '@/lib/supabase/client'
import { useFiles } from '@/hooks/use-files'
import type { FileRecord } from '@/lib/supabase/types'

interface FileCardProps {
  file: FileRecord
}

/** 파일 크기를 사람이 읽기 좋은 형식으로 변환 */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/** 파일 카드 컴포넌트 */
export function FileCard({ file }: FileCardProps) {
  const { deleteFile, isDeleting } = useFiles()
  const supabase = createClient()
  const isImage = file.content_type.startsWith('image/')

  // Supabase Storage 서명된 URL 다운로드
  const handleDownload = async () => {
    const { data } = await supabase.storage
      .from('files')
      .createSignedUrl(file.file_path, 60) // 60초 유효

    if (data?.signedUrl) {
      window.open(data.signedUrl, '_blank')
    }
  }

  // 파일 삭제 (Storage + DB)
  const handleDelete = async () => {
    await supabase.storage.from('files').remove([file.file_path])
    deleteFile(file.id)
  }

  return (
    <Card className='group overflow-hidden'>
      {/* 이미지 미리보기 */}
      <div className='relative h-32 bg-muted/30'>
        {isImage ? (
          <div className='relative h-full w-full'>
            <Image
              src={supabase.storage.from('files').getPublicUrl(file.file_path).data.publicUrl}
              alt={file.file_name}
              fill
              className='object-cover'
              onError={(e) => {
                // 이미지 로드 실패 시 아이콘 표시
                ;(e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          </div>
        ) : (
          <div className='flex h-full items-center justify-center'>
            {file.content_type === 'application/pdf' ? (
              <FileTextIcon className='size-10 text-red-400' />
            ) : (
              <FileIcon className='size-10 text-muted-foreground' />
            )}
          </div>
        )}
      </div>

      <CardContent className='p-3'>
        <p className='truncate text-sm font-medium' title={file.file_name}>{file.file_name}</p>
        <div className='mt-1 flex items-center gap-2'>
          <Badge variant='secondary' className='text-xs'>{formatFileSize(file.file_size)}</Badge>
          <span className='text-xs text-muted-foreground'>
            {format(new Date(file.created_at), 'MM/dd', { locale: ko })}
          </span>
        </div>
      </CardContent>

      <CardFooter className='gap-1 p-3 pt-0'>
        <Button
          variant='outline'
          size='sm'
          className='flex-1 gap-1 text-xs'
          onClick={handleDownload}
        >
          <Download className='size-3' /> 다운로드
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              className='size-8 text-muted-foreground hover:text-destructive'
              disabled={isDeleting}
            >
              <Trash2 className='size-3.5' />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>파일을 삭제하시겠습니까?</AlertDialogTitle>
              <AlertDialogDescription>
                &quot;{file.file_name}&quot; 파일이 영구적으로 삭제됩니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction
                className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                onClick={handleDelete}
              >
                삭제
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  )
}
