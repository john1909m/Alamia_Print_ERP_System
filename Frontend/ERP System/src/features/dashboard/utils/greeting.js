import { ar } from '@/constants/ar'

export function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return ar.dashboard.goodMorning
  if (hour < 17) return ar.dashboard.goodAfternoon
  return ar.dashboard.goodEvening
}

export function getFormattedDate() {
  return new Intl.DateTimeFormat('ar-SA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date())
}
