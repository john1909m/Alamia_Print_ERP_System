import { Link } from 'react-router-dom'
import {
  Building2,
  Package,
  Warehouse,
  AlertTriangle,
  Factory,
  CheckCircle2,
  Clock,
  Plus,
  ShoppingCart,
} from 'lucide-react'
import { PageLoader } from '@/components/ui/loader'
import { ErrorState } from '@/components/ui/error-state'
import { Button } from '@/components/ui/button'
import { dashboardService } from '@/services/dashboardService'
import { useFetchData } from '@/hooks/useFetchData'
import { ROUTES } from '@/constants/routes'
import { ar } from '@/constants/ar'
import { WelcomeHeader } from '@/features/dashboard/components/WelcomeHeader'
import { StatCard } from '@/features/dashboard/components/StatCard'
import { SectionHeader } from '@/features/dashboard/components/SectionHeader'
import {
  DashboardCard,
  DashboardCardHeader,
  DashboardCardContent,
} from '@/features/dashboard/components/DashboardCard'
import { DashboardTable } from '@/features/dashboard/components/DashboardTable'
import { ActivityItem } from '@/features/dashboard/components/ActivityItem'
import { QuickActionCard } from '@/features/dashboard/components/QuickActionCard'
import { ChartPlaceholder } from '@/features/dashboard/components/ChartPlaceholder'

const STAT_CARDS = [
  { key: 'totalCompanies', label: ar.dashboard.totalCompanies, icon: Building2 },
  { key: 'totalProducts', label: ar.dashboard.totalProducts, icon: Package },
  { key: 'materialsInStock', label: ar.dashboard.materialsInStock, icon: Warehouse },
  { key: 'lowStockMaterials', label: ar.dashboard.lowStockMaterials, icon: AlertTriangle },
  { key: 'todaysProductionOrders', label: ar.dashboard.todaysProductionOrders, icon: Factory },
  { key: 'completedOrders', label: ar.dashboard.completedOrders, icon: CheckCircle2 },
  { key: 'pendingOrders', label: ar.dashboard.pendingOrders, icon: Clock },
]

const INVENTORY_CARDS = [
  { key: 'totalMaterials', label: ar.dashboard.totalMaterials },
  { key: 'lowStock', label: ar.dashboard.lowStock },
  { key: 'recentlyPurchased', label: ar.dashboard.recentlyPurchased },
  { key: 'mostUsedMaterial', label: ar.dashboard.mostUsedMaterial, isText: true },
]

const QUICK_ACTIONS = [
  {
    title: ar.dashboard.newProductionOrder,
    description: ar.productionOrders.description,
    icon: Factory,
    to: ROUTES.PRODUCTION_ORDERS,
  },
  {
    title: ar.dashboard.addCompany,
    description: ar.companies.description,
    icon: Plus,
    to: ROUTES.COMPANIES,
  },
  {
    title: ar.dashboard.addMaterial,
    description: ar.materials.description,
    icon: Package,
    to: ROUTES.MATERIALS,
  },
  {
    title: ar.dashboard.createPurchase,
    description: ar.purchases.description,
    icon: ShoppingCart,
    to: ROUTES.PURCHASES,
  },
]

const CHART_TITLES = {
  inventoryChart: ar.dashboard.inventoryChart,
  productionChart: ar.dashboard.productionChart,
  monthlyOrdersChart: ar.dashboard.monthlyOrdersChart,
}

export default function DashboardPage() {
  const { data, loading, error, refetch } = useFetchData(dashboardService.getAll, null)

  if (loading) return <PageLoader text={ar.dashboard.loading} />
  if (error || !data) return <ErrorState onRetry={refetch} />

  const {
    quickStats,
    recentProductionOrders,
    inventoryOverview,
    activities,
    chartPlaceholders,
  } = data

  return (
    <div className="space-y-8">
      <WelcomeHeader />

      <section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7">
          {STAT_CARDS.map(({ key, label, icon }) => (
            <StatCard
              key={key}
              title={label}
              value={
                typeof quickStats[key] === 'number'
                  ? quickStats[key].toLocaleString('ar-SA')
                  : quickStats[key]
              }
              icon={icon}
            />
          ))}
        </div>
      </section>

      <section>
        <DashboardCard>
          <DashboardCardHeader>
            <SectionHeader
              title={ar.dashboard.recentProductionOrders}
              description={ar.dashboard.recentProductionOrdersDesc}
              action={
                <Button variant="outline" size="sm" asChild>
                  <Link to={ROUTES.PRODUCTION_ORDERS}>{ar.dashboard.viewAll}</Link>
                </Button>
              }
            />
          </DashboardCardHeader>
          <DashboardTable orders={recentProductionOrders} />
        </DashboardCard>
      </section>

      <section className="grid gap-6 lg:grid-cols-5">
        <DashboardCard className="lg:col-span-2">
          <DashboardCardHeader>
            <SectionHeader
              title={ar.dashboard.inventorySummary}
              description={ar.dashboard.inventorySummaryDesc}
            />
          </DashboardCardHeader>
          <DashboardCardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {INVENTORY_CARDS.map(({ key, label, isText }) => (
                <div
                  key={key}
                  className="rounded-lg border bg-muted/30 px-4 py-3.5"
                >
                  <p className="text-xs font-medium text-muted-foreground">{label}</p>
                  <p className="mt-1.5 text-lg font-semibold tracking-tight">
                    {isText
                      ? inventoryOverview[key]
                      : inventoryOverview[key].toLocaleString('ar-SA')}
                  </p>
                </div>
              ))}
            </div>
          </DashboardCardContent>
        </DashboardCard>

        <DashboardCard className="lg:col-span-3">
          <DashboardCardHeader>
            <SectionHeader
              title={ar.dashboard.recentActivities}
              description={ar.dashboard.recentActivitiesDesc}
            />
          </DashboardCardHeader>
          <DashboardCardContent>
            {activities.map((item, index) => (
              <ActivityItem
                key={item.id}
                type={item.type}
                title={item.title}
                description={item.description}
                time={item.time}
                isLast={index === activities.length - 1}
              />
            ))}
          </DashboardCardContent>
        </DashboardCard>
      </section>

      <section>
        <SectionHeader
          title={ar.dashboard.quickActions}
          description={ar.dashboard.quickActionsDesc}
          className="mb-4"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_ACTIONS.map((action) => (
            <QuickActionCard key={action.title} {...action} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader
          title={ar.dashboard.chartsSection}
          description={ar.dashboard.chartsSectionDesc}
          className="mb-4"
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {chartPlaceholders.map((chart) => (
            <ChartPlaceholder
              key={chart.id}
              title={CHART_TITLES[chart.titleKey]}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
