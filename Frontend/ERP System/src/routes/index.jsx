// src/routes/index.jsx
import { createBrowserRouter, Outlet } from 'react-router-dom'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { LazyPage } from '@/routes/LazyPage'
import { LoginPage } from '@/pages/login/LoginPage'
import { ProtectedRoute } from '@/components/ProtectedRoute'
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
  UsersPage,
} from '@/routes/lazyPages'

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    ),
    children: [
      {
        path: 'login',
        element: (
          <LazyPage>
            <LoginPage />
          </LazyPage>
        ),
      },
      {
        path: '',
        element: (
          <ProtectedRoute>
            <LazyPage>
              <DashboardLayout />
            </LazyPage>
          </ProtectedRoute>
        ),
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
            path: 'users',
            element: (
              <LazyPage>
                <UsersPage />
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