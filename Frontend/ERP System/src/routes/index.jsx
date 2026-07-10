import { createBrowserRouter } from 'react-router-dom'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { LazyPage } from '@/routes/LazyPage'
import {
  DashboardPage,
  CompaniesPage,
  SuppliersPage,
  MaterialsPage,
  InventoryPage,
  ProductsPage,
  PurchasesPage,
  ProductionOrdersPage,
  ReportsPage,
  SettingsPage,
  NotFoundPage,
} from '@/routes/lazyPages'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: (
          <LazyPage>
            <DashboardPage />
          </LazyPage>
        ),
      },
      {
        path: 'companies',
        element: (
          <LazyPage>
            <CompaniesPage />
          </LazyPage>
        ),
      },
      {
        path: 'suppliers',
        element: (
          <LazyPage>
            <SuppliersPage />
          </LazyPage>
        ),
      },
      {
        path: 'materials',
        element: (
          <LazyPage>
            <MaterialsPage />
          </LazyPage>
        ),
      },
      {
        path: 'inventory',
        element: (
          <LazyPage>
            <InventoryPage />
          </LazyPage>
        ),
      },
      {
        path: 'products',
        element: (
          <LazyPage>
            <ProductsPage />
          </LazyPage>
        ),
      },
      {
        path: 'purchases',
        element: (
          <LazyPage>
            <PurchasesPage />
          </LazyPage>
        ),
      },
      {
        path: 'production-orders',
        element: (
          <LazyPage>
            <ProductionOrdersPage />
          </LazyPage>
        ),
      },
      {
        path: 'reports',
        element: (
          <LazyPage>
            <ReportsPage />
          </LazyPage>
        ),
      },
      {
        path: 'settings',
        element: (
          <LazyPage>
            <SettingsPage />
          </LazyPage>
        ),
      },
      {
        path: '*',
        element: (
          <LazyPage>
            <NotFoundPage />
          </LazyPage>
        ),
      },
    ],
  },
])
