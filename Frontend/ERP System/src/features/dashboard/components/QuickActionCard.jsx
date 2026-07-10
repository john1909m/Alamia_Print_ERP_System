import { Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { cn } from '@/utils/cn'

export function QuickActionCard({ title, description, icon: Icon, to, className }) {
  return (
    <Link
      to={to}
      className={cn(
        'group flex flex-col rounded-xl border bg-card p-5 shadow-sm transition-all hover:border-foreground/15 hover:shadow-md',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
          <Icon className="h-5 w-5 text-foreground/70" />
        </div>
        <ChevronLeft className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <h3 className="mt-4 text-sm font-semibold">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      )}
    </Link>
  )
}
