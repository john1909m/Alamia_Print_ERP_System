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
    <div className={cn('flex flex-col items-center justify-center py-10 text-center', className)}>
      <div className="mb-5 rounded-full bg-red-50 p-5">
        <AlertCircle className="h-10 w-10 text-destructive/80" />
      </div>
      <h3 className="text-xl font-semibold text-foreground/90">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground/80">{description}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="mt-5">
          {ar.common.tryAgain}
        </Button>
      )}
    </div>
  )
}
