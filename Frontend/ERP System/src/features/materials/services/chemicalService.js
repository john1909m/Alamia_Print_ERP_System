import { apiClient, normalizePageResponse, normalizeEntityResponse } from '@/services/api'
import { API_ENDPOINTS } from '@/services/api'

const mapChemical = (item = {}) => {
  return {
    ...item,
    id: item.id,
    material_id: item.material_id,
    name: item.name || '-',
    chemicalTypes: Array.isArray(item.chemicalTypes) ? item.chemicalTypes : [],
  }
}

export const chemicalService = {
  getAll: async () => {
    const response = await apiClient.get('/api/chemicals')
    return normalizePageResponse(response.data).map(mapChemical)
  },

  getById: async (id) => {
    const response = await apiClient.get(`/api/chemicals/${id}`)
    return mapChemical(normalizeEntityResponse(response.data))
  },

  create: async (data) => {
    const response = await apiClient.post('/api/chemicals', data)
    return mapChemical(normalizeEntityResponse(response.data))
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/api/chemicals/${id}`, data)
    return mapChemical(normalizeEntityResponse(response.data))
  },

  delete: async (id) => {
    await apiClient.delete(`/api/chemicals/${id}`)
    return { success: true, id: Number(id) }
  },
}