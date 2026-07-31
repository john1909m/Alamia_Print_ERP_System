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

// Interceptor للـ Request - إضافة الـ Token
apiClient.interceptors.request.use(
  (config) => {
    // جلب الـ Token من localStorage
    const token = localStorage.getItem('access_token') || localStorage.getItem('token')
    
    // Log للـ Request عشان تتابع في Console
    console.log('🚀 API Request:', {
      method: config.method?.toUpperCase(),
      url: `${config.baseURL}${config.url}`,
      data: config.data,
      headers: config.headers,
      token: token ? '✅ موجود' : '❌ غير موجود',
    })
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// Interceptor للـ Response
apiClient.interceptors.response.use(
  (response) => {
    // Log للـ Response
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
    
    // Log للـ Error
    console.error('❌ API Error:', {
      status: status,
      message: message,
      data: data,
      config: error?.config,
    })
    
    // لو الـ Token منتهي
    if (status === 401) {
      console.warn('⚠️ Token expired or invalid, redirecting to login...')
      localStorage.removeItem('access_token')
      localStorage.removeItem('token')
      // لو عايز تعمل Redirect للـ Login
      // window.location.href = '/login'
    }
    
    const normalizedError = new Error(message)
    normalizedError.status = status
    normalizedError.details = data
    return Promise.reject(normalizedError)
  }
)

// دوال مساعدة لتطبيع البيانات
export const normalizeEntityResponse = (payload) => {
  console.log('📦 Normalizing entity:', payload)
  
  if (!payload) return null
  
  // لو كانت فيها data
  if (payload.data) {
    return payload.data
  }
  
  // لو كانت صفحة وفيها content
  if (payload?.content && Array.isArray(payload.content)) {
    return payload.content[0] || null
  }
  
  // لو كانت object عادي
  if (typeof payload === 'object' && !Array.isArray(payload)) {
    return payload
  }
  
  return payload
}

export const normalizePageResponse = (payload) => {
  console.log('📦 Normalizing page:', payload)
  
  if (!payload) return []
  
  // لو كانت Array
  if (Array.isArray(payload)) {
    return payload
  }
  
  // لو كانت صفحة من Spring Boot (Page<T>)
  if (payload?.content && Array.isArray(payload.content)) {
    return payload.content
  }
  
  // لو كانت فيها data.content (زي response.data.content)
  if (payload?.data?.content && Array.isArray(payload.data.content)) {
    return payload.data.content
  }
  
  // لو فيها items
  if (payload?.items && Array.isArray(payload.items)) {
    return payload.items
  }
  
  // لو كانت object واحد
  if (typeof payload === 'object' && !Array.isArray(payload)) {
    return [payload]
  }
  
  return []
}

function getErrorMessage(status, data) {
  // رسائل الخطأ الافتراضية
  const messages = {
    400: 'خطأ في الطلب - تأكد من صحة البيانات',
    401: 'غير مصرح به - يرجى تسجيل الدخول مرة أخرى',
    403: 'غير مسموح بالوصول - ليس لديك صلاحية',
    404: 'غير موجود - العنصر المطلوب غير موجود',
    409: 'تضارب في البيانات - هذا العنصر موجود بالفعل',
    500: 'خطأ داخلي في الخادم - يرجى المحاولة لاحقاً',
  }

  // لو في رسالة من الـ Response
  if (data) {
    if (data.message) return data.message
    if (data.error) return data.error
    if (data.detail) return data.detail
    if (data.msg) return data.msg
  }

  // رسالة افتراضية حسب الـ Status
  return messages[status] || `حدث خطأ غير متوقع (${status})`
}

// الـ Endpoints
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