import { STATUS_LABELS } from '@/constants/ar'

export function formatStatus(status) {
  return STATUS_LABELS[status] || status
}
