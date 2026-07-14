import { apiClient, normalizePageResponse, normalizeEntityResponse } from '@/services/api'
import { API_ENDPOINTS } from '@/services/api'
import { withStockStatus } from '@/features/materials/utils/stockStatus'

const mapMaterial = (item = {}) => {
  const currentStock = item.stock ?? item.currentStock ?? 0
  const minStock = item.minStock ?? 0

  return withStockStatus({
    ...item,
    id: item.id,
    name: item.name || '-',
    type: item.type || 'other',
    unit: item.unit || '',
    currentStock,
    minStock,
    description: item.description || item.notes || '',
    createdAt: item.createdAt || item.created_at || '',
  })
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
    const payload = {
      name: data.name,
      type: data.type,
      unit: data.unit,
      stock: Number(data.stock ?? data.currentStock ?? 0),
      minStock: Number(data.minStock ?? 0),
      notes: data.description || data.notes || '',
      ...data,
    }
    const response = await apiClient.post(API_ENDPOINTS.materials, payload)
    return mapMaterial(normalizeEntityResponse(response.data))
  },

  update: async (id, data) => {
    const payload = {
      name: data.name,
      type: data.type,
      unit: data.unit,
      stock: Number(data.stock ?? data.currentStock ?? 0),
      minStock: Number(data.minStock ?? 0),
      notes: data.description || data.notes || '',
      ...data,
    }
    const response = await apiClient.put(`${API_ENDPOINTS.materials}/${id}`, payload)
    return mapMaterial(normalizeEntityResponse(response.data))
  },

  delete: async (id) => {
    await apiClient.delete(`${API_ENDPOINTS.materials}/${id}`)
    return { success: true, id: Number(id) }
  },
}