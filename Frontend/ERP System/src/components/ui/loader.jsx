import { Loader2 } from 'lucide-react'
import { ar } from '@/constants/ar'
import { cn } from '@/utils/cn'

export function Loader({ className, size = 'default', text }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-8 w-8',
    lg: 'h-12 w-12',
  }

  return (
    <div className={cn('flex flex-col items-center justify-center gap-2', className)}>
      <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  )
}

export function PageLoader({ text = ar.common.loading }) {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <Loader size="lg" text={text} />
    </div>
  )
}
