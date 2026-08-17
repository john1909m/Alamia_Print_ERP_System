// src/routes/index.jsx
import { createBrowserRouter } from 'react-router-dom'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { LazyPage } from '@/routes/LazyPage'
import { LoginPage } from '@/pages/login/LoginPage'
import { AuthProvider } from '@/context/AuthContext'
import {
  DashboardPage,
  CompaniesPage,
  SuppliersPage,
  MaterialsPage,
  InventoryPage,
  ProductsPage,
  PurchasesPage,
  ProductionOrdersPage,
  ProductionOrderDetailPage,
  ReportsPage,
  SettingsPage,
  NotFoundPage,
} from '@/routes/lazyPages'

export const router = createBrowserRouter([
  {
    element: <AuthProvider />,
    children: [
      {
        path: '/login',
        element: <LazyPage>
          <LoginPage />
        </LazyPage>,
      },
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
            path: 'production-orders/:id',
            element: (
              <LazyPage>
                <ProductionOrderDetailPage />
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
    ],
  },
])
