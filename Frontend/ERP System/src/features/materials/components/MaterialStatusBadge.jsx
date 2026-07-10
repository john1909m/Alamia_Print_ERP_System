import { Badge } from '@/components/ui/badge'
import { STATUS_VARIANTS } from '@/constants/app'
import { formatStatus } from '@/utils/formatStatus'

export function MaterialStatusBadge({ status }) {
  const variant = STATUS_VARIANTS[status] || 'secondary'
  return <Badge variant={variant}>{formatStatus(status)}</Badge>
}
