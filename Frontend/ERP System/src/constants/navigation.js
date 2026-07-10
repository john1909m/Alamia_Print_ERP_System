import {
  LayoutDashboard,
  Building2,
  Truck,
  Package,
  Warehouse,
  ShoppingBag,
  ShoppingCart,
  Factory,
  BarChart3,
  Settings,
} from 'lucide-react'
import { ROUTES } from '@/constants/routes'
import { ar } from '@/constants/ar'

export const NAV_ITEMS = [
  { label: ar.nav.dashboard, path: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: ar.nav.companies, path: ROUTES.COMPANIES, icon: Building2 },
  { label: ar.nav.suppliers, path: ROUTES.SUPPLIERS, icon: Truck },
  { label: ar.nav.materials, path: ROUTES.MATERIALS, icon: Package },
  { label: ar.nav.inventory, path: ROUTES.INVENTORY, icon: Warehouse },
  { label: ar.nav.products, path: ROUTES.PRODUCTS, icon: ShoppingBag },
  { label: ar.nav.purchases, path: ROUTES.PURCHASES, icon: ShoppingCart },
  { label: ar.nav.productionOrders, path: ROUTES.PRODUCTION_ORDERS, icon: Factory },
  { label: ar.nav.reports, path: ROUTES.REPORTS, icon: BarChart3 },
  { label: ar.nav.settings, path: ROUTES.SETTINGS, icon: Settings },
]
