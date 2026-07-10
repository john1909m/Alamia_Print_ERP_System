import { ar } from '@/constants/ar'
import { getFormattedDate, getGreeting } from '@/features/dashboard/utils/greeting'

export function WelcomeHeader() {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{getGreeting()}</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          {ar.dashboard.welcomeBack}
        </h1>
      </div>
      <p className="text-sm text-muted-foreground">{getFormattedDate()}</p>
    </div>
  )
}
