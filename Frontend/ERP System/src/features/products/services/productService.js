// src/features/products/services/productService.js
import { apiClient, normalizePageResponse, normalizeEntityResponse } from '@/services/api'
import { API_ENDPOINTS } from '@/services/api'
import { companyService } from '@/features/companies/services/companyService'

const mapProductType = (type) => {
  const types = {
    'LEAFLET': 'LEAFLET',
    'BOX': 'BOX',
    'leaflet': 'LEAFLET',
    'box': 'BOX',
  }
  return types[type] || type || 'LEAFLET'
}

// Cache للـ Companies
let companiesCache = []

const loadCompaniesCache = async () => {
  if (companiesCache.length === 0) {
    try {
      const response = await companyService.getAll()
      companiesCache = response || []
    } catch (error) {
      console.error('Failed to load companies cache:', error)
    }
  }
  return companiesCache
}

const getCompanyName = (companyId, companies) => {
  if (!companyId) return ''
  const company = companies.find(c => c.id === companyId)
  return company?.name || ''
}

const mapProduct = (item = {}, companies = []) => {
  console.log('📦 Mapping product:', item)
  return {
    id: item.id,
    productCode: item.code || '',
    productName: item.name || '',
    companyId: item.companyId || null,
    companyName: getCompanyName(item.companyId, companies),
    category: mapProductType(item.type),
    status: item.status || 'active',
    description: item.notes || '',
    createdAt: item.createdAt || item.created_at || '',
    updatedAt: item.updatedAt || item.updated_at || '',
    orders: item.orders || [],
  }
}

export const productService = {
  getAll: async () => {
    console.log('📦 Fetching all products...')
    try {
      // جلب الـ Companies أولاً
      const companies = await loadCompaniesCache()
      
      const response = await apiClient.get(API_ENDPOINTS.products)
      console.log('📦 Products response:', response.data)
      const normalized = normalizePageResponse(response.data)
      return normalized.map(item => mapProduct(item, companies))
    } catch (error) {
      console.error('❌ Error fetching products:', error)
      throw error
    }
  },

  getById: async (id) => {
    console.log(`📦 Fetching product ${id}...`)
    try {
      const companies = await loadCompaniesCache()
      const response = await apiClient.get(`${API_ENDPOINTS.products}/${id}`)
      console.log('📦 Product response:', response.data)
      return mapProduct(normalizeEntityResponse(response.data), companies)
    } catch (error) {
      console.error(`❌ Error fetching product ${id}:`, error)
      throw error
    }
  },

  create: async (data) => {
    console.log('📦 Creating product with data:', data)
    try {
      const payload = {
        name: data.productName || data.name,
        code: data.productCode || data.code || '',
        type: data.category || data.type || 'LEAFLET',
        notes: data.description || data.notes || '',
        companyId: data.companyId || data.company_id,
        status: data.status || 'active',
      }
      console.log('📦 Product payload:', payload)
      
      const response = await apiClient.post(API_ENDPOINTS.products, payload)
      console.log('📦 Create product response:', response.data)
      
      // إعادة تحميل الـ Cache عشان يضيف الشركة الجديدة لو موجودة
      const companies = await loadCompaniesCache()
      return mapProduct(normalizeEntityResponse(response.data), companies)
    } catch (error) {
      console.error('❌ Error creating product:', error)
      throw error
    }
  },

  update: async (id, data) => {
    console.log(`📦 Updating product ${id} with data:`, data)
    try {
      const payload = {
        name: data.productName || data.name,
        code: data.productCode || data.code || '',
        type: data.category || data.type || 'LEAFLET',
        notes: data.description || data.notes || '',
        companyId: data.companyId || data.company_id,
        status: data.status || 'active',
      }
      console.log('📦 Product update payload:', payload)
      
      const response = await apiClient.put(`${API_ENDPOINTS.products}/${id}`, payload)
      console.log('📦 Update product response:', response.data)
      
      const companies = await loadCompaniesCache()
      return mapProduct(normalizeEntityResponse(response.data), companies)
    } catch (error) {
      console.error(`❌ Error updating product ${id}:`, error)
      throw error
    }
  },

  delete: async (id) => {
    console.log(`📦 Deleting product ${id}...`)
    try {
      const response = await apiClient.delete(`${API_ENDPOINTS.products}/${id}`)
      console.log('📦 Delete product response:', response.data)
      return { success: true, id: Number(id) }
    } catch (error) {
      console.error(`❌ Error deleting product ${id}:`, error)
      throw error
    }
  },
}