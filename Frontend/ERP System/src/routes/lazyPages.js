// src/routes/lazyPages.js
import { lazy } from 'react'

export const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'))
export const CompaniesPage = lazy(() => import('@/pages/companies/CompaniesPage'))
export const SuppliersPage = lazy(() => import('@/pages/suppliers/SuppliersPage'))
export const MaterialsPage = lazy(() => import('@/pages/materials/MaterialsPage'))
export const InventoryPage = lazy(() => import('@/pages/inventory/InventoryPage'))
export const ProductsPage = lazy(() => import('@/pages/products/ProductsPage'))
export const PurchasesPage = lazy(() => import('@/pages/purchases/PurchasesPage'))
export const ProductionOrdersPage = lazy(() => import('@/features/productionOrders/pages/ProductionOrdersPage'))
export const ProductionOrderDetailPage = lazy(() => import('@/features/productionOrders/pages/ProductionOrderDetailPage'))
export const ReportsPage = lazy(() => import('@/pages/reports/ReportsPage'))
export const SettingsPage = lazy(() => import('@/pages/settings/SettingsPage'))
export const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))