import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  badge?: string
  badgeVariant?: 'default' | 'secondary' | 'outline' | 'destructive'
}

/** 기능 소개 카드 컴포넌트 */
export function FeatureCard({
  icon,
  title,
  description,
  badge,
  badgeVariant = 'secondary',
}: FeatureCardProps) {
  return (
    <Card className='group relative overflow-hidden transition-all hover:shadow-md hover:border-primary/50'>
      <CardHeader className='pb-3'>
        <div className='flex items-start justify-between gap-3'>
          <div className='flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground'>
            {icon}
          </div>
          {badge && (
            <Badge variant={badgeVariant} className='text-xs'>
              {badge}
            </Badge>
          )}
        </div>
        <CardTitle className='mt-4 text-lg'>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className='text-sm leading-relaxed'>
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  )
}
