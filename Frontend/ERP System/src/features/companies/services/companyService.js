import { apiClient, normalizePageResponse, normalizeEntityResponse } from '@/services/api'
import { API_ENDPOINTS } from '@/services/api'

const mapCompany = (item = {}) => ({
  ...item,
  id: item.id,
  name: item.name || item.companyName || '-',
  phone: item.phone || '',
  email: item.email || '',
  address: item.address || item.location || '',
  notes: item.notes || '',
  managerName: item.managerName || '',
  productsCount: item.products?.length || item.productsCount || 0,
  createdAt: item.createdAt || item.created_at || '',
})

export const companyService = {
  getAll: async () => {
    const response = await apiClient.get(API_ENDPOINTS.companies)
    return normalizePageResponse(response.data).map(mapCompany)
  },

  getById: async (id) => {
    const response = await apiClient.get(`${API_ENDPOINTS.companies}/${id}`)
    return mapCompany(normalizeEntityResponse(response.data))
  },

  create: async (data) => {
    const payload = {
      ...data,
      managerName: data.managerName || '',
    };
    const response = await apiClient.post(API_ENDPOINTS.companies, payload)
    return mapCompany(normalizeEntityResponse(response.data))
  },

  update: async (id, data) => {
    const payload = {
      ...data,
      managerName: data.managerName || '',
    };
    const response = await apiClient.put(`${API_ENDPOINTS.companies}/${id}`, payload)
    return mapCompany(normalizeEntityResponse(response.data))
  },

  delete: async (id) => {
    await apiClient.delete(`${API_ENDPOINTS.companies}/${id}`)
    return { success: true, id }
  },
}