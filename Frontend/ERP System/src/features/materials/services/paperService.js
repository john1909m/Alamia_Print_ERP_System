// src/features/materials/services/paperService.js
import { apiClient, normalizePageResponse, normalizeEntityResponse } from '@/services/api'
import { API_ENDPOINTS } from '@/services/api'

const mapPaper = (item = {}) => {
  console.log('📦 Mapping paper:', item)
  return {
    id: item.id,
    materialId: item.materialId || item.material_id,
    paperType: item.paperType || item.type || 'WHITE',
    width: item.width || 0,
    height: item.height || 0,
    weight: item.weight || 0,
    stock: item.stock || 0,
    notes: item.notes || '',
  }
}

export const paperService = {
  getAll: async () => {
    console.log('📦 Fetching all papers...')
    try {
      const response = await apiClient.get(API_ENDPOINTS.papers)
      console.log('📦 Papers response:', response.data)
      const normalized = normalizePageResponse(response.data)
      return normalized.map(mapPaper)
    } catch (error) {
      console.error('❌ Error fetching papers:', error)
      throw error
    }
  },

  getById: async (id) => {
    console.log(`📦 Fetching paper ${id}...`)
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.papers}/${id}`)
      console.log('📦 Paper response:', response.data)
      return mapPaper(normalizeEntityResponse(response.data))
    } catch (error) {
      console.error(`❌ Error fetching paper ${id}:`, error)
      throw error
    }
  },

  create: async (data) => {
    console.log('📦 Creating paper with data:', data)
    try {
      const payload = {
        materialId: data.materialId,
        paperType: data.paperType || 'WHITE',
        width: data.width || 0,
        height: data.height || 0,
        weight: data.weight || 0,
        stock: data.stock || 0,
        notes: data.notes || '',
      }
      console.log('📦 Paper payload:', payload)
      
      const response = await apiClient.post(API_ENDPOINTS.papers, payload)
      console.log('📦 Create paper response:', response.data)
      return mapPaper(normalizeEntityResponse(response.data))
    } catch (error) {
      console.error('❌ Error creating paper:', error)
      throw error
    }
  },

  update: async (id, data) => {
    console.log(`📦 Updating paper ${id} with data:`, data)
    try {
      const payload = {
        materialId: data.materialId,
        paperType: data.paperType || 'WHITE',
        width: data.width || 0,
        height: data.height || 0,
        weight: data.weight || 0,
        stock: data.stock || 0,
        notes: data.notes || '',
      }
      console.log('📦 Paper update payload:', payload)
      
      const response = await apiClient.put(`${API_ENDPOINTS.papers}/${id}`, payload)
      console.log('📦 Update paper response:', response.data)
      return mapPaper(normalizeEntityResponse(response.data))
    } catch (error) {
      console.error(`❌ Error updating paper ${id}:`, error)
      throw error
    }
  },

  delete: async (id) => {
    console.log(`📦 Deleting paper ${id}...`)
    try {
      const response = await apiClient.delete(`${API_ENDPOINTS.papers}/${id}`)
      console.log('📦 Delete paper response:', response.data)
      return { success: true, id: Number(id) }
    } catch (error) {
      console.error(`❌ Error deleting paper ${id}:`, error)
      throw error
    }
  },
}