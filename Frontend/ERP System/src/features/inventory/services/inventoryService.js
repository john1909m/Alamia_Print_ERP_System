import { apiClient, normalizePageResponse } from '@/services/api'
import { API_ENDPOINTS } from '@/services/api'

const buildInventoryTransactions = (materials = []) => {
  return materials.flatMap((material) => [
    {
      id: `${material.id}-initial`,
      materialId: material.id,
      materialName: material.name,
      transactionType: 'adjustment',
      quantity: material.currentStock,
      unit: material.unit,
      reference: 'Backend material stock',
      notes: material.description || '',
      date: material.createdAt || new Date().toISOString().slice(0, 10),
      currentStock: material.currentStock,
      minStock: material.minStock,
      materialType: material.type,
    },
  ])
}

export const inventoryService = {
  getAll: async () => {
    const response = await apiClient.get(API_ENDPOINTS.materials)
    const materials = normalizePageResponse(response.data)
    return buildInventoryTransactions(materials)
  },
  getById: async (id) => {
    const response = await apiClient.get(`${API_ENDPOINTS.inventory}/${id}`)
    return response.data
  },
  create: async (data) => {
    const response = await apiClient.post(API_ENDPOINTS.inventory, { date: new Date().toISOString().split('T')[0], ...data })
    return response.data
  },
  update: async (id, data) => {
    const response = await apiClient.put(`${API_ENDPOINTS.inventory}/${id}`, data)
    return response.data
  },
  delete: async (id) => {
    await apiClient.delete(`${API_ENDPOINTS.inventory}/${id}`)
    return { success: true, id: Number(id) }
  },
}