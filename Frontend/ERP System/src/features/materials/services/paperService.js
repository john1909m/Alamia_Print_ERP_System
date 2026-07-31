import { apiClient, normalizePageResponse, normalizeEntityResponse } from '@/services/api'
import { API_ENDPOINTS } from '@/services/api'

const mapPaper = (item = {}) => {
  return {
    id: item.id,
    materialId: item.materialId || item.material_id,
    width: item.width,
    height: item.height,
    weight: item.weight,
    stock: item.stock || 0,
    notes: item.notes || '',
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
    // تأكد من إرسال البيانات بالشكل الصحيح للـ API
    const payload = {
      materialId: data.materialId,
      width: data.width,
      height: data.height,
      weight: data.weight,
      stock: data.stock || 0,
      notes: data.notes || '',
    }
    const response = await apiClient.post(API_ENDPOINTS.papers, payload)
    return mapPaper(normalizeEntityResponse(response.data))
  },

  update: async (id, data) => {
    const payload = {
      materialId: data.materialId,
      width: data.width,
      height: data.height,
      weight: data.weight,
      stock: data.stock || 0,
      notes: data.notes || '',
    }
    const response = await apiClient.put(`${API_ENDPOINTS.papers}/${id}`, payload)
    return mapPaper(normalizeEntityResponse(response.data))
  },

  delete: async (id) => {
    await apiClient.delete(`${API_ENDPOINTS.papers}/${id}`)
    return { success: true, id: Number(id) }
  },
}