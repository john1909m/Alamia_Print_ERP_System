// src/features/products/components/ProductStatusBadge.jsx
import { Badge } from '@/components/ui/badge'
import { STATUS_VARIANTS } from '@/constants/app'
import { STATUS_LABELS } from '@/constants/ar'

export function ProductStatusBadge({ status }) {
  return (
    <Badge variant={STATUS_VARIANTS?.[status] || 'secondary'}>
      {STATUS_LABELS?.[status] || status || 'Unknown'}
    </Badge>
  )
}