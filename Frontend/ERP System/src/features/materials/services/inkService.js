import { apiClient, normalizePageResponse, normalizeEntityResponse } from '@/services/api'
import { API_ENDPOINTS } from '@/services/api'

const mapInk = (item = {}) => {
  return {
    id: item.id,
    materialId: item.materialId || item.material_id,
    inkType: item.inkType || [],
    stock: item.stock || 0,
    notes: item.notes || '',
  }
}

export const inkService = {
  getAll: async () => {
    const response = await apiClient.get(API_ENDPOINTS.inks)
    return normalizePageResponse(response.data).map(mapInk)
  },

  getById: async (id) => {
    const response = await apiClient.get(`${API_ENDPOINTS.inks}/${id}`)
    return mapInk(normalizeEntityResponse(response.data))
  },

  create: async (data) => {
    const payload = {
      materialId: data.materialId,
      inkType: data.inkType || '',
      stock: data.stock || 0,
      notes: data.notes || '',
    }
    const response = await apiClient.post(API_ENDPOINTS.inks, payload)
    return mapInk(normalizeEntityResponse(response.data))
  },

  update: async (id, data) => {
    const payload = {
      materialId: data.materialId,
      inkType: data.inkType || '',
      stock: data.stock || 0,
      notes: data.notes || '',
    }
    const response = await apiClient.put(`${API_ENDPOINTS.inks}/${id}`, payload)
    return mapInk(normalizeEntityResponse(response.data))
  },

  delete: async (id) => {
    await apiClient.delete(`${API_ENDPOINTS.inks}/${id}`)
    return { success: true, id: Number(id) }
  },
}