import { apiClient, normalizePageResponse, normalizeEntityResponse } from '@/services/api'
import { API_ENDPOINTS } from '@/services/api'

const mapChemical = (item = {}) => {
  return {
    id: item.id,
    materialId: item.materialId || item.material_id,
    chemicalType: item.chemicalType || [],
    stock: item.stock || 0,
    notes: item.notes || '',
  }
}

export const chemicalService = {
  getAll: async () => {
    const response = await apiClient.get(API_ENDPOINTS.chemicals)
    return normalizePageResponse(response.data).map(mapChemical)
  },

  getById: async (id) => {
    const response = await apiClient.get(`${API_ENDPOINTS.chemicals}/${id}`)
    return mapChemical(normalizeEntityResponse(response.data))
  },

  create: async (data) => {
    const payload = {
      materialId: data.materialId,
      chemicalType: data.chemicalType || '',
      stock: data.stock || 0,
      notes: data.notes || '',
    }
    const response = await apiClient.post(API_ENDPOINTS.chemicals, payload)
    return mapChemical(normalizeEntityResponse(response.data))
  },

  update: async (id, data) => {
    const payload = {
      materialId: data.materialId,
      chemicalType: data.chemicalType || '',
      stock: data.stock || 0,
      notes: data.notes || '',
    }
    const response = await apiClient.put(`${API_ENDPOINTS.chemicals}/${id}`, payload)
    return mapChemical(normalizeEntityResponse(response.data))
  },

  delete: async (id) => {
    await apiClient.delete(`${API_ENDPOINTS.chemicals}/${id}`)
    return { success: true, id: Number(id) }
  },
}