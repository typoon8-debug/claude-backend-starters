import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface UserAvatarProps {
  name?: string | null
  avatarUrl?: string | null
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: 'size-7',
  md: 'size-9',
  lg: 'size-12',
}

/**
 * 사용자 아바타 컴포넌트
 * 이미지가 없으면 이름의 첫 글자를 표시
 */
export function UserAvatar({ name, avatarUrl, className, size = 'md' }: UserAvatarProps) {
  const fallback = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?'

  return (
    <Avatar className={cn(sizeMap[size], className)}>
      <AvatarImage src={avatarUrl ?? undefined} alt={name ?? '사용자'} />
      <AvatarFallback className='text-xs font-medium'>{fallback}</AvatarFallback>
    </Avatar>
  )
}
