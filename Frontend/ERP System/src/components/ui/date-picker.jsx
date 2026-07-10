import { Calendar } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/utils/cn'

export function DatePicker({ className, ...props }) {
  return (
    <div className={cn('relative', className)}>
      <Calendar className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      <Input type="date" className="ps-9" {...props} />
    </div>
  )
}
