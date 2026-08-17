import { Inbox } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ar } from '@/constants/ar'
import { cn } from '@/utils/cn'

export function EmptyState({
  icon: Icon = Inbox,
  title = ar.common.noData,
  description = ar.common.noDataDescription,
  actionLabel,
  onAction,
  className,
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-10 text-center', className)}>
      <div className="mb-5 rounded-full bg-muted/50 p-5">
        <Icon className="h-10 w-10 text-muted-foreground/60" />
      </div>
      <h3 className="text-xl font-semibold text-foreground/90">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground/80">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-5">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
