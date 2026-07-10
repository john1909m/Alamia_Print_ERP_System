import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ar } from '@/constants/ar'
import { cn } from '@/utils/cn'

export function ErrorState({
  title = ar.common.errorTitle,
  description = ar.common.errorDescription,
  onRetry,
  className,
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
      <div className="mb-4 rounded-full bg-red-50 p-4">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="mt-4">
          {ar.common.tryAgain}
        </Button>
      )}
    </div>
  )
}
