import { apiClient, normalizePageResponse, normalizeEntityResponse } from '@/services/api'
import { API_ENDPOINTS } from '@/services/api'

const mapMaterial = (item = {}) => {
  return {
    ...item,
    id: item.id,
    name: item.name || '-',
    type: item.type || '',
    unit: item.unit || '',
    notes: item.notes,
  }
}

export const materialService = {
  getAll: async () => {
    const response = await apiClient.get(API_ENDPOINTS.materials)
    return normalizePageResponse(response.data).map(mapMaterial)
  },

  getById: async (id) => {
    const response = await apiClient.get(`${API_ENDPOINTS.materials}/${id}`)
    return mapMaterial(normalizeEntityResponse(response.data))
  },

  create: async (data) => {
    console.log('materialService.create data:', data)
    const response = await apiClient.post(API_ENDPOINTS.materials, data)
    return mapMaterial(normalizeEntityResponse(response.data))
  },

  update: async (id, data) => {
    const response = await apiClient.put(`${API_ENDPOINTS.materials}/${id}`, data)
    return mapMaterial(normalizeEntityResponse(response.data))
  },

  delete: async (id) => {
    await apiClient.delete(`${API_ENDPOINTS.materials}/${id}`)
    return { success: true, id: Number(id) }
  },
}