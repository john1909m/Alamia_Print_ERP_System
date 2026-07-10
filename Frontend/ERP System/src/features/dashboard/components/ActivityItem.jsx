import {
  Building2,
  ShoppingCart,
  Warehouse,
  Factory,
  Package,
} from 'lucide-react'
import { cn } from '@/utils/cn'

const ACTIVITY_ICONS = {
  company: Building2,
  purchase: ShoppingCart,
  inventory: Warehouse,
  'production-start': Factory,
  'production-finish': Package,
}

const ACTIVITY_COLORS = {
  company: 'bg-blue-50 text-blue-600',
  purchase: 'bg-slate-100 text-slate-600',
  inventory: 'bg-amber-50 text-amber-600',
  'production-start': 'bg-violet-50 text-violet-600',
  'production-finish': 'bg-emerald-50 text-emerald-600',
}

export function ActivityItem({ type, title, description, time, isLast = false }) {
  const Icon = ACTIVITY_ICONS[type] || Package
  const colorClass = ACTIVITY_COLORS[type] || 'bg-muted text-muted-foreground'

  return (
    <div className="relative flex gap-4 pb-6 last:pb-0">
      {!isLast && (
        <span
          className="absolute start-[15px] top-8 h-[calc(100%-8px)] w-px bg-border"
          aria-hidden
        />
      )}
      <div
        className={cn(
          'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          colorClass,
        )}
      >
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium">{title}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <span className="shrink-0 text-xs text-muted-foreground">{time}</span>
        </div>
      </div>
    </div>
  )
}
