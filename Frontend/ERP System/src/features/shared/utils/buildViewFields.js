import { ar } from '@/constants/ar'

export function buildViewFields(item, labels) {
  if (!item) return []
  return [
    { label: labels.name, value: item.name },
    { label: ar.common.phone, value: item.phone },
    { label: ar.common.email, value: item.email },
    { label: ar.common.address, value: item.address },
    { label: labels.count, value: item[labels.countKey]?.toLocaleString('ar-SA') },
    { label: ar.common.created, value: item.createdAt },
    { label: ar.common.notes, value: item.notes },
  ]
}
