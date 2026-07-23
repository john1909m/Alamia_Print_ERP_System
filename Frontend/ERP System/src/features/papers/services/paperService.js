import { apiClient, normalizePageResponse, normalizeEntityResponse } from '@/services/api'
import { API_ENDPOINTS } from '@/services/api'

const mapPaper = (item = {}) => {
  return {
    ...item,
    id: item.id,
    material_id: item.material_id,
    name: item.name || '-',
    type: item.type || '',
    weight: item.weight,
    brightness: item.brightness,
    color: item.color,
  }
}

export const paperService = {
  getAll: async () => {
    const response = await apiClient.get(API_ENDPOINTS.papers)
    return normalizePageResponse(response.data).map(mapPaper)
  },

  getById: async (id) => {
    const response = await apiClient.get(`${API_ENDPOINTS.papers}/${id}`)
    return mapPaper(normalizeEntityResponse(response.data))
  },

  create: async (data) => {
    const response = await apiClient.post(API_ENDPOINTS.papers, data)
    return mapPaper(normalizeEntityResponse(response.data))
  },

  update: async (id, data) => {
    const response = await apiClient.put(`${API_ENDPOINTS.papers}/${id}`, data)
    return mapPaper(normalizeEntityResponse(response.data))
  },

  delete: async (id) => {
    await apiClient.delete(`${API_ENDPOINTS.papers}/${id}`)
    return { success: true, id: Number(id) }
  },
}