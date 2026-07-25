import { apiClient, normalizePageResponse, normalizeEntityResponse } from '@/services/api'
import { API_ENDPOINTS } from '@/services/api'

// Map variant DTO to frontend object
const mapVariant = (item = {}) => ({
  id: item.id,
  materialId: item.materialId,
  specification: item.specification || item.spec || '-', // fallback to spec if specification not present
  stock: item.stock ?? 0,
  createdAt: item.createdAt || '',
  updatedAt: item.updatedAt || '',
})

export const variantService = {
  // Get all variants (optional, but we might need it)
  getAll: async () => {
    const response = await apiClient.get(API_ENDPOINTS.materials) // maybe not correct, but we can leave as placeholder
    // Since there is no direct endpoint for all variants, we might not use this.
    // For safety, return empty array.
    return []
  },

  // Get variants by material ID
  getByMaterialId: async (materialId) => {
    console.log('variantService.getByMaterialId: Calling apiClient.get with', `${API_ENDPOINTS.materials}/${materialId}/variants`)
    console.log('variantService.getByMaterialId: baseURL is', apiClient.defaults.baseURL)
    const response = await apiClient.get(`${API_ENDPOINTS.materials}/${materialId}/variants`)
    console.log('variantService.getByMaterialId: Raw response received:', response)
    console.log('variantService.getByMaterialId: response.data is', response.data)
    const normalized = normalizePageResponse(response.data)
    console.log('variantService.getByMaterialId: normalized data is', normalized)
    const mapped = normalized.map(mapVariant)
    console.log('variantService.getByMaterialId: mapped data is', mapped)
    return normalized.map(mapVariant)
  },

  // Get variant by ID (if needed)
  getById: async (id) => {
    // We might need to get via material? Not sure. We'll assume endpoint /variants/{id} exists.
    const response = await apiClient.get(`${API_ENDPOINTS.variants || '/variants'}/${id}`)
    return mapVariant(normalizeEntityResponse(response.data))
  },

  // Create a new variant under a material
  create: async (variantData) => {
    const { materialId, ...variantWithoutMaterialId } = variantData
    const response = await apiClient.post(`${API_ENDPOINTS.materials}/${materialId}/variants`, variantWithoutMaterialId)
    return mapVariant(normalizeEntityResponse(response.data))
  },

  // Update an existing variant
  update: async (id, variantData) => {
    // We need materialId to construct URL; we can get it from variantData or assume we have it?
    // Since update may not need materialId in URL if we have /variants/{id} endpoint.
    // But we assumed nested under material. We'll need materialId.
    // We'll assume variantData contains materialId.
    const materialId = variantData.materialId
    if (!materialId) {
      throw new Error('materialId is required for updating variant')
    }
    const { materialId: _, ...payload } = variantData // remove materialId from payload
    await apiClient.put(`${API_ENDPOINTS.materials}/${materialId}/variants/${id}`, payload)
    const response = await apiClient.get(`${API_ENDPOINTS.materials}/${materialId}/variants/${id}`)
    return mapVariant(normalizeEntityResponse(response.data))
  },

  // Delete a variant
  delete: async (id, materialId) => {
    // Assuming delete also needs materialId in path
    if (!materialId) {
      throw new Error('materialId is required for deleting variant')
    }
    await apiClient.delete(`${API_ENDPOINTS.materials}/${materialId}/variants/${id}`)
    return { success: true, id: Number(id) }
  },

  // Add stock to a variant (increase by given quantity)
  addStock: async (variantId, quantity, materialId) => {
    // Assuming endpoint: PATCH /materials/{materialId}/variants/{variantId}/stock
    if (!materialId) {
      throw new Error('materialId is required for adding stock')
    }
    const response = await apiClient.patch(`${API_ENDPOINTS.materials}/${materialId}/variants/${variantId}/stock`, { quantity })
    return mapVariant(normalizeEntityResponse(response.data))
  },
}