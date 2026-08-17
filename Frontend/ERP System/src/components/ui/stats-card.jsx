import { cn } from '@/utils/cn'
import { ar } from '@/constants/ar'

export function StatsCard({ title, value, change, changeType, icon: Icon, className }) {
  const isPositive = changeType === 'positive'
  const isNegative = changeType === 'negative'

  return (
    <div
      className={cn(
        'rounded-xl border bg-card p-6 shadow-sm transition-shadow duration-200 hover:shadow-md hover:-translate-y-0.5',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {Icon && (
          <div className="rounded-md bg-primary/80 p-2">
            <Icon className="h-4 w-4 text-primary-foreground" />
          </div>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-foreground">{value}</p>
        {change !== undefined && (
          <p
            className={cn(
              'mt-1 text-xs font-medium',
              isPositive && 'text-success-foreground',
              isNegative && 'text-destructive-foreground',
              !isPositive && !isNegative && 'text-muted-foreground',
            )}
          >
            {isPositive && '+'}
            {change}% {ar.common.fromLastMonth}
          </p>
        )}
      </div>
    </div>
  )
}
