import { BarChart3 } from 'lucide-react'
import { ar } from '@/constants/ar'
import { DashboardCard, DashboardCardContent } from '@/features/dashboard/components/DashboardCard'

export function ChartPlaceholder({ title }) {
  return (
    <DashboardCard className="h-full">
      <DashboardCardContent className="flex h-full min-h-[220px] flex-col">
        <p className="text-sm font-medium">{title}</p>
        <div className="mt-4 flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed bg-muted/30">
          <BarChart3 className="h-8 w-8 text-muted-foreground/50" />
          <p className="mt-2 text-xs text-muted-foreground">{ar.common.chartPlaceholder}</p>
        </div>
      </DashboardCardContent>
    </DashboardCard>
  )
}
