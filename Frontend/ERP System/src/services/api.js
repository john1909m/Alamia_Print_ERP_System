// src/services/api.js
import axios from 'axios'
import { APP_NAME } from '@/constants/app'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
})

// Interceptor for Request
apiClient.interceptors.request.use(
  (config) => {
    // Log API Request
    console.log('🔐 API Request:', {
      method: config.method?.toUpperCase(),
      url: `${config.baseURL}${config.url}`,
      data: config.data,
      headers: config.headers,
    })
    
    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// Interceptor for Response
apiClient.interceptors.response.use(
  (response) => {
    // Log API Response
    console.log('✅ API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data,
    })
    return response
  },
  (error) => {
    const status = error?.response?.status
    const data = error?.response?.data
    const message = getErrorMessage(status, data)
    
    // Log API Error
    console.error('❌ API Error:', {
      status: status,
      message: message,
      data: data,
      config: error?.config,
    })
    
    // If token expired or invalid, redirect to login
    if (status === 401) {
      console.warn('🔒 Token expired or invalid, redirecting to login...')
      // Avoid redirecting on login requests
      if (!error.config.url?.includes('/auth/login')) {
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
      }
    }
    
    const normalizedError = new Error(message)
    normalizedError.status = status
    normalizedError.details = data
    return Promise.reject(normalizedError)
  }
)

// Utility functions for normalizing responses
export const normalizeEntityResponse = (payload) => {
  console.log('📦 Normalizing entity:', payload)
  
  if (!payload) return null
  
  if (payload.data) {
    return payload.data
  }
  
  if (payload?.content && Array.isArray(payload.content)) {
    return payload.content[0] || null
  }
  
  if (typeof payload === 'object' && !Array.isArray(payload)) {
    return payload
  }
  
  return payload
}

export const normalizePageResponse = (payload) => {
  console.log('📄 Normalizing page:', payload)
  
  if (!payload) return []
  
  if (Array.isArray(payload)) {
    return payload
  }
  
  if (payload?.content && Array.isArray(payload.content)) {
    return payload.content
  }
  
  if (payload?.data?.content && Array.isArray(payload.data.content)) {
    return payload.data.content
  }
  
  if (payload?.items && Array.isArray(payload.items)) {
    return payload.items
  }
  
  if (typeof payload === 'object' && !Array.isArray(payload)) {
    return [payload]
  }
  
  return []
}

function getErrorMessage(status, data) {
  const messages = {
    400: 'Bad request - Please check the input data',
    401: 'Unauthorized - Please log in again',
    403: 'Forbidden - You do not have permission to access this resource',
    404: 'Not found - The requested resource could not be found',
    409: 'Conflict - The resource already exists',
    500: 'Internal server error - Please try again later',
  }

  if (data) {
    if (data.message) return data.message
    if (data.error) return data.error
    if (data.detail) return data.detail
    if (data.msg) return data.msg
  }

  return messages[status] || `Error ${status}`
}

// API Endpoints
export const API_ENDPOINTS = {
// Auth
auth: '/auth',
login: '/auth/login',
register: '/auth/register',
logout: '/auth/logout',
me: '/auth/me',
// Materials
materials: '/materials',
papers: '/papers',
inks: '/inks',
chemicals: '/chemicals',
variants: '/variants',
// Others
companies: '/companies',
suppliers: '/suppliers',
inventory: '/inventory',
products: '/products',
purchases: '/purchases',
productionOrders: '/production-orders',
reports: '/reports',
dashboard: '/dashboard',
settings: '/settings',
}

export { APP_NAME }
