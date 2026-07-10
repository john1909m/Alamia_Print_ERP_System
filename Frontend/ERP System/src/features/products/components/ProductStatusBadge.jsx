import { STATUS_VARIANTS } from '@/constants/app'
import { STATUS_LABELS } from '@/constants/ar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/utils/cn'

export function ProductStatusBadge({ status }) {
  return (
    <Badge variant={STATUS_VARIANTS[status] || 'secondary'}>
      {STATUS_LABELS[status] || status}
    </Badge>
  )
}