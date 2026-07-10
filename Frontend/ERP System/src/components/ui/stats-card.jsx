import { cn } from '@/utils/cn'
import { ar } from '@/constants/ar'

export function StatsCard({ title, value, change, changeType, icon: Icon, className }) {
  const isPositive = changeType === 'positive'
  const isNegative = changeType === 'negative'

  return (
    <div className={cn('rounded-lg border bg-card p-6 shadow-sm', className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {Icon && (
          <div className="rounded-md bg-primary/10 p-2">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        )}
      </div>
      <div className="mt-2">
        <p className="text-2xl font-bold">{value}</p>
        {change !== undefined && (
          <p
            className={cn(
              'mt-1 text-xs font-medium',
              isPositive && 'text-emerald-600',
              isNegative && 'text-red-600',
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
