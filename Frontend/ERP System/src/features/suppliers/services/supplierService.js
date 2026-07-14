import { apiClient, normalizePageResponse, normalizeEntityResponse } from '@/services/api'
import { API_ENDPOINTS } from '@/services/api'

const mapSupplier = (item = {}) => ({
  ...item,
  id: item.id,
  name: item.name || item.supplierName || '-',
  phone: item.phone || '',
  email: item.email || '',
  address: item.address || '',
  notes: item.notes || '',
  materialsCount: item.materialsCount || item.materials?.length || 0,
  createdAt: item.createdAt || item.created_at || '',
})

export const supplierService = {
  getAll: async () => {
    const response = await apiClient.get(API_ENDPOINTS.suppliers)
    return normalizePageResponse(response.data).map(mapSupplier)
  },

  getById: async (id) => {
    const response = await apiClient.get(`${API_ENDPOINTS.suppliers}/${id}`)
    return mapSupplier(normalizeEntityResponse(response.data))
  },

  create: async (data) => {
    const payload = {
      name: data.name,
      email: data.email,
      address: data.address,
      phone: data.phone,
      notes: data.notes,
      type: data.type || 'supplier',
      ...data,
    }
    const response = await apiClient.post(API_ENDPOINTS.suppliers, payload)
    return mapSupplier(normalizeEntityResponse(response.data))
  },

  update: async (id, data) => {
    const payload = {
      name: data.name,
      email: data.email,
      address: data.address,
      phone: data.phone,
      notes: data.notes,
      type: data.type || 'supplier',
      ...data,
    }
    const response = await apiClient.put(`${API_ENDPOINTS.suppliers}/${id}`, payload)
    return mapSupplier(normalizeEntityResponse(response.data))
  },

  delete: async (id) => {
    await apiClient.delete(`${API_ENDPOINTS.suppliers}/${id}`)
    return { success: true, id }
  },
}