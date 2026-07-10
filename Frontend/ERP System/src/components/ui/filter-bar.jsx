import { cn } from '@/utils/cn'

export function FilterBar({ children, className }) {
  return (
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
      {children}
    </div>
  )
}
