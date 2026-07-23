import { apiClient, normalizePageResponse, normalizeEntityResponse } from '@/services/api'
import { API_ENDPOINTS } from '@/services/api'

const mapInk = (item = {}) => {
  return {
    ...item,
    id: item.id,
    material_id: item.material_id,
    name: item.name || '-',
    inkTypes: Array.isArray(item.inkTypes) ? item.inkTypes : [],
  }
}

export const inkService = {
  getAll: async () => {
    const response = await apiClient.get('/api/inks')
    return normalizePageResponse(response.data).map(mapInk)
  },

  getById: async (id) => {
    const response = await apiClient.get(`/api/inks/${id}`)
    return mapInk(normalizeEntityResponse(response.data))
  },

  create: async (data) => {
    const response = await apiClient.post('/api/inks', data)
    return mapInk(normalizeEntityResponse(response.data))
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/api/inks/${id}`, data)
    return mapInk(normalizeEntityResponse(response.data))
  },

  delete: async (id) => {
    await apiClient.delete(`/api/inks/${id}`)
    return { success: true, id: Number(id) }
  },
}