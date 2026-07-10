import { cn } from '@/utils/cn'

export function DashboardCard({ className, children, ...props }) {
  return (
    <div
      className={cn(
        'rounded-xl border bg-card text-card-foreground shadow-sm',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function DashboardCardHeader({ className, children }) {
  return <div className={cn('border-b px-6 py-4', className)}>{children}</div>
}

export function DashboardCardContent({ className, children }) {
  return <div className={cn('p-6', className)}>{children}</div>
}
