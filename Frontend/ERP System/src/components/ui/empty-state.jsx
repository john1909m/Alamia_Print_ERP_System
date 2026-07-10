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
    <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
      <div className="mb-4 rounded-full bg-muted p-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-4">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
