import { BarChart3, Download, FileText, TrendingUp } from 'lucide-react'
import { PageHeader } from '@/components/ui/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FilterBar } from '@/components/ui/filter-bar'
import { DatePicker } from '@/components/ui/date-picker'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ar } from '@/constants/ar'

const reportTypes = [
  { title: ar.reports.sales, description: ar.reports.salesDesc, icon: TrendingUp },
  { title: ar.reports.inventory, description: ar.reports.inventoryDesc, icon: BarChart3 },
  { title: ar.reports.production, description: ar.reports.productionDesc, icon: FileText },
  { title: ar.reports.purchase, description: ar.reports.purchaseDesc, icon: Download },
]

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title={ar.reports.title}
        description={ar.reports.description}
        breadcrumb={[{ label: ar.nav.reports }]}
        actions={
          <Button variant="outline">
            <Download className="h-4 w-4" />
            {ar.common.exportAll}
          </Button>
        }
      />

      <FilterBar>
        <Select defaultValue="monthly">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={ar.common.reportPeriod} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">{ar.common.daily}</SelectItem>
            <SelectItem value="weekly">{ar.common.weekly}</SelectItem>
            <SelectItem value="monthly">{ar.common.monthly}</SelectItem>
            <SelectItem value="yearly">{ar.common.yearly}</SelectItem>
          </SelectContent>
        </Select>
        <DatePicker />
        <DatePicker />
      </FilterBar>

      <div className="grid gap-4 sm:grid-cols-2">
        {reportTypes.map((report) => (
          <Card key={report.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <report.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">{report.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{report.description}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex h-40 items-center justify-center rounded-lg border border-dashed bg-muted/30">
                <p className="text-sm text-muted-foreground">{ar.common.chartPlaceholder}</p>
              </div>
              <Button variant="outline" className="mt-4 w-full">
                <Download className="h-4 w-4" />
                {ar.common.downloadReport}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
