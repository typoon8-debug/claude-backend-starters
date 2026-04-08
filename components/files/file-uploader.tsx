'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, FileIcon, ImageIcon, FileTextIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useFiles } from '@/hooks/use-files'
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '@/types'
import { useAuthStore } from '@/stores/auth-store'

interface UploadingFile {
  file: File
  progress: number
  error?: string
}

/** 파일 아이콘 선택 */
function FileTypeIcon({ contentType }: { contentType: string }) {
  if (contentType.startsWith('image/')) return <ImageIcon className='size-5 text-blue-500' />
  if (contentType === 'application/pdf') return <FileTextIcon className='size-5 text-red-500' />
  return <FileIcon className='size-5 text-muted-foreground' />
}

/** react-dropzone 기반 파일 업로드 컴포넌트 */
export function FileUploader() {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
  const { saveFile } = useFiles()
  const { user } = useAuthStore()

  const uploadFile = async (file: File) => {
    if (!user) {
      toast.error('로그인이 필요합니다')
      return
    }

    const supabase = createClient()
    // 파일 경로: {user_id}/{uuid}/{파일명}
    const filePath = `${user.id}/${crypto.randomUUID()}/${file.name}`

    // 진행률 업데이트
    setUploadingFiles((prev) =>
      prev.map((f) => (f.file === file ? { ...f, progress: 30 } : f))
    )

    const { error: uploadError } = await supabase.storage
      .from('files')
      .upload(filePath, file, { upsert: false })

    if (uploadError) {
      setUploadingFiles((prev) =>
        prev.map((f) => (f.file === file ? { ...f, error: uploadError.message, progress: 0 } : f))
      )
      toast.error(`업로드 실패: ${uploadError.message}`)
      return
    }

    setUploadingFiles((prev) =>
      prev.map((f) => (f.file === file ? { ...f, progress: 80 } : f))
    )

    // 메타데이터 저장
    try {
      await saveFile({
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        content_type: file.type,
      })

      setUploadingFiles((prev) => prev.filter((f) => f.file !== file))
      toast.success(`${file.name} 업로드 완료!`)
    } catch {
      setUploadingFiles((prev) =>
        prev.map((f) => (f.file === file ? { ...f, error: '메타데이터 저장 실패', progress: 0 } : f))
      )
    }
  }

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file) => ({ file, progress: 0 }))
      setUploadingFiles((prev) => [...prev, ...newFiles])
      acceptedFiles.forEach(uploadFile)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ALLOWED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
    onDropRejected: (rejectedFiles) => {
      rejectedFiles.forEach(({ file, errors }) => {
        const message = errors[0]?.code === 'file-too-large'
          ? `${file.name}: 파일 크기가 50MB를 초과합니다`
          : `${file.name}: 지원하지 않는 파일 형식입니다`
        toast.error(message)
      })
    },
  })

  return (
    <div className='space-y-4'>
      {/* 드롭존 */}
      <div
        {...getRootProps()}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors',
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50 hover:bg-muted/30'
        )}
      >
        <input {...getInputProps()} />
        <Upload className={cn('mb-3 size-10', isDragActive ? 'text-primary' : 'text-muted-foreground')} />
        <p className='font-medium'>
          {isDragActive ? '파일을 여기에 놓으세요' : '파일을 드래그하거나 클릭해서 업로드'}
        </p>
        <p className='mt-1 text-sm text-muted-foreground'>
          이미지, PDF, 텍스트, ZIP (최대 50MB)
        </p>
        <div className='mt-3 flex flex-wrap justify-center gap-1'>
          {['JPG', 'PNG', 'GIF', 'WebP', 'PDF', 'TXT', 'ZIP'].map((ext) => (
            <Badge key={ext} variant='secondary' className='text-xs'>{ext}</Badge>
          ))}
        </div>
      </div>

      {/* 업로드 진행 중인 파일 목록 */}
      {uploadingFiles.length > 0 && (
        <div className='space-y-2'>
          {uploadingFiles.map((item, i) => (
            <div key={i} className='flex items-center gap-3 rounded-md border p-3'>
              <FileTypeIcon contentType={item.file.type} />
              <div className='flex-1 min-w-0'>
                <p className='truncate text-sm font-medium'>{item.file.name}</p>
                {item.error ? (
                  <p className='text-xs text-destructive'>{item.error}</p>
                ) : (
                  <Progress value={item.progress} className='mt-1 h-1.5' />
                )}
              </div>
              {item.error && (
                <Button
                  variant='ghost'
                  size='icon'
                  className='size-7 shrink-0'
                  onClick={() => setUploadingFiles((prev) => prev.filter((_, idx) => idx !== i))}
                >
                  <X className='size-3.5' />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
