import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/utils/cn'

export function SearchInput({ className, containerClassName, ...props }) {
  return (
    <div className={cn('relative', containerClassName)}>
      <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input className={cn('ps-9', className)} {...props} />
    </div>
  )
}
