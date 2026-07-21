import axios from 'axios'
import { APP_NAME } from '@/constants/app'

export const apiClient = axios.create({
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
  (error) => {
    const status = error?.response?.status
    const message = getErrorMessage(status, error?.response?.data)
    const normalizedError = new Error(message)
    normalizedError.status = status
    normalizedError.details = error?.response?.data
    return Promise.reject(normalizedError)
  },
)

export const normalizeEntityResponse = (payload) => {
  if (payload?.content && Array.isArray(payload.content)) return payload.content[0] || null
  if (payload?.data) return payload.data
  return payload
}

export const normalizePageResponse = (payload) => {
  if (Array.isArray(payload)) return payload
  if (payload?.content && Array.isArray(payload.content)) return payload.content
  if (payload?.data?.content && Array.isArray(payload.data.content)) return payload.data.content
  if (payload?.items && Array.isArray(payload.items)) return payload.items
  return []
}

function getErrorMessage(status, data) {
  // Default messages
  const messages = {
    400: 'خطأ في الطلب',
    401: 'غير مصرح به',
    403: 'غير مسموح بالوصول',
    404: 'غير موجود',
    409: 'تضارب في البيانات',
    500: 'خطأ داخلي في الخادم',
  }

  // Return message from response if available, otherwise use default
  if (data && data.message) return data.message
  return messages[status] || 'حدث خطأ غير متوقع'
}

export const API_ENDPOINTS = {
  companies: '/companies',
  suppliers: '/suppliers',
  materials: '/materials',
  inventory: '/inventory',
  products: '/products',
  purchases: '/purchases',
  productionOrders: '/production-orders',
  reports: '/reports',
  papers: '/papers',
  dashboard: '/dashboard',
  settings: '/settings',
}

export { APP_NAME }