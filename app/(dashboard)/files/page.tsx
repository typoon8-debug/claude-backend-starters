import type { Metadata } from 'next'
import { FileUploader } from '@/components/files/file-uploader'
import { FileGrid } from '@/components/files/file-grid'
import { Separator } from '@/components/ui/separator'

export const metadata: Metadata = { title: '파일 업로드' }

export default function FilesPage() {
  return (
    <div>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold tracking-tight'>파일 업로드</h1>
        <p className='mt-1 text-sm text-muted-foreground'>
          react-dropzone + Supabase Storage 연동 파일 업로드 예제
        </p>
      </div>

      {/* 파일 업로더 */}
      <FileUploader />

      <Separator className='my-6' />

      {/* 업로드된 파일 목록 */}
      <div>
        <h2 className='mb-4 text-base font-semibold'>업로드된 파일</h2>
        <FileGrid />
      </div>
    </div>
  )
}
