import { apiClient, normalizePageResponse, normalizeEntityResponse } from '@/services/api'
import { API_ENDPOINTS } from '@/services/api'
import { paperService } from '@/features/papers/services/paperService'
import { inkService } from '@/features/materials/services/inkService'
import { chemicalService } from '@/features/materials/services/chemicalService'

const mapMaterial = (item = {}) => {
  // Map base fields from MaterialDto (excluding stock as material no longer owns stock)
  const base = {
    id: item.id,
    name: item.name || '-',
    type: item.type || '',
    unit: item.unit || '',
    notes: item.notes || '',
    createdAt: item.createdAt || '',
    updatedAt: item.updatedAt || '',
  }

  // Extract subtype data from nested arrays if present (for edit/view)
  const subtype = {}
  if (Array.isArray(item.papers) && item.papers.length > 0) {
    const paper = item.papers[0]
    subtype.paperType = paper.name ?? paper.type ?? ''
    subtype.weight = paper.weight
    subtype.brightness = paper.brightness
    subtype.color = paper.color ?? ''
  }
  if (Array.isArray(item.inks) && item.inks.length > 0) {
    const ink = item.inks[0]
    // join array into comma-separated string for the form field
    subtype.inkTypes = (Array.isArray(ink.inkTypes) && ink.inkTypes.length > 0) ? ink.inkTypes.join(', ') : ''
  }
  if (Array.isArray(item.chemicals) && item.chemicals.length > 0) {
    const chem = item.chemicals[0]
    // join array into comma-separated string for the form field
    subtype.chemicalTypes = (Array.isArray(chem.chemicalTypes) && chem.chemicalTypes.length > 0) ? chem.chemicalTypes.join(', ') : ''
  }

  return { ...base, ...subtype }
}

export const materialService = {
  getAll: async () => {
    console.log('materialService.getAll: Calling apiClient.get with', API_ENDPOINTS.materials)
    console.log('materialService.getAll: baseURL is', apiClient.defaults.baseURL)
    const response = await apiClient.get(API_ENDPOINTS.materials)
    console.log('materialService.getAll: Raw response received:', response)
    console.log('materialService.getAll: response.data is', response.data)
    const normalized = normalizePageResponse(response.data)
    console.log('materialService.getAll: normalized data is', normalized)
    const mapped = normalized.map(mapMaterial)
    console.log('materialService.getAll: mapped data is', mapped)
    return mapped
  },

  getById: async (id) => {
    const response = await apiClient.get(`${API_ENDPOINTS.materials}/${id}`)
    return mapMaterial(normalizeEntityResponse(response.data))
  },

  create: async (materialData) => {
    const response = await apiClient.post(API_ENDPOINTS.materials, materialData)
    return normalizeEntityResponse(response.data)
  },

  update: async (id, materialData) => {
    await apiClient.put(`${API_ENDPOINTS.materials}/${id}`, materialData)
    const response = await apiClient.get(`${API_ENDPOINTS.materials}/${id}`)
    return mapMaterial(normalizeEntityResponse(response.data))
  },

  delete: async (id) => {
    await apiClient.delete(`${API_ENDPOINTS.materials}/${id}`)
    return { success: true, id: Number(id) }
  },
}