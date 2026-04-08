'use client'

import { FolderOpen } from 'lucide-react'
import { FileCard } from './file-card'
import { Skeleton } from '@/components/ui/skeleton'
import { useFiles } from '@/hooks/use-files'

/** 파일 그리드 컴포넌트 */
export function FileGrid() {
  const { files, isLoading } = useFiles()

  if (isLoading) {
    return (
      <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className='rounded-lg border overflow-hidden'>
            <Skeleton className='h-32 w-full' />
            <div className='p-3 space-y-2'>
              <Skeleton className='h-3 w-3/4' />
              <Skeleton className='h-3 w-1/2' />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (files.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-16 text-muted-foreground'>
        <FolderOpen className='mb-4 size-12 opacity-30' />
        <p className='text-sm font-medium'>업로드된 파일이 없습니다</p>
        <p className='mt-1 text-xs'>위에서 파일을 업로드해보세요!</p>
      </div>
    )
  }

  return (
    <div className='grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
      {files.map((file) => (
        <FileCard key={file.id} file={file} />
      ))}
    </div>
  )
}
