import { apiClient, normalizePageResponse, normalizeEntityResponse } from '@/services/api'
import { API_ENDPOINTS } from '@/services/api'

const mapProduct = (item = {}) => ({
  ...item,
  id: item.id,
  productCode: item.code || item.productCode || '',
  productName: item.name || item.productName || '-',
  companyId: item.company_id || item.companyId || null,
  companyName: item.companyName || item.company?.name || '',
  category: item.type || item.category || '',
  status: item.status || 'active',
  description: item.notes || item.description || '',
  createdAt: item.createdAt || item.created_at || '',
  updatedAt: item.updatedAt || item.updated_at || '',
})

export const productService = {
  getAll: async () => {
    const response = await apiClient.get(API_ENDPOINTS.products)
    return normalizePageResponse(response.data).map(mapProduct)
  },

  getById: async (id) => {
    const response = await apiClient.get(`${API_ENDPOINTS.products}/${id}`)
    return mapProduct(normalizeEntityResponse(response.data))
  },

  create: async (data) => {
    const payload = {
      name: data.productName || data.name,
      code: data.productCode || data.code,
      company_id: data.companyId || data.company_id,
      type: data.category || data.type,
      notes: data.description || data.notes || '',
      status: data.status || 'active',
      ...data,
    }
    const response = await apiClient.post(API_ENDPOINTS.products, payload)
    return mapProduct(normalizeEntityResponse(response.data))
  },

  update: async (id, data) => {
    const payload = {
      name: data.productName || data.name,
      code: data.productCode || data.code,
      company_id: data.companyId || data.company_id,
      type: data.category || data.type,
      notes: data.description || data.notes || '',
      status: data.status || 'active',
      ...data,
    }
    const response = await apiClient.put(`${API_ENDPOINTS.products}/${id}`, payload)
    return mapProduct(normalizeEntityResponse(response.data))
  },

  delete: async (id) => {
    await apiClient.delete(`${API_ENDPOINTS.products}/${id}`)
    return { success: true, id: Number(id) }
  },
}