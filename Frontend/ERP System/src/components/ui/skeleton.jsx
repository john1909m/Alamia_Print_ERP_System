import { cn } from '@/utils/cn'

export function Skeleton({ className, ...props }) {
  return <div className={cn('animate-pulse rounded-sm bg-muted/50', className)} {...props} />
}

export function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-11 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}
