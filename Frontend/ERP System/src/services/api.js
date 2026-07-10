import axios from 'axios'
import { APP_NAME } from '@/constants/app'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
)

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
)

export default apiClient

export const API_ENDPOINTS = {
  companies: '/companies',
  suppliers: '/suppliers',
  materials: '/materials',
  inventory: '/inventory',
  products: '/products',
  purchases: '/purchases',
  productionOrders: '/production-orders',
  reports: '/reports',
  dashboard: '/dashboard',
  settings: '/settings',
}

export { APP_NAME }
