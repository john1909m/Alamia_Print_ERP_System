import { apiClient, normalizePageResponse, normalizeEntityResponse } from '@/services/api'
import { API_ENDPOINTS } from '@/services/api'
import { paperService } from '@/features/papers/services/paperService'
import { inkService } from '@/features/materials/services/inkService'
import { chemicalService } from '@/features/materials/services/chemicalService'

const mapMaterial = (item = {}) => {
  // Map base fields from MaterialDto
  const base = {
    ...item,
    id: item.id,
    name: item.name || '-',
    type: item.type || '',
    unit: item.unit || '',
    stock: item.stock ?? 0,
    notes: item.notes || '',
    createdAt: item.createdAt || item.created_at || '',
    updatedAt: item.updatedAt || item.updated_at || '',
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
                subtype.chemicalTypes = (Array.isArray(chem.chemicalTypes) && chem.chemicalTypes.length > 0) ? chem.chemicalTypes.join(', ') : ''
  }

  return { ...base, ...subtype }
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
    const { materialData, subtypeData, type } = data

    // Create the material
    const materialResponse = await apiClient.post(API_ENDPOINTS.materials, materialData)
    const createdMaterial = normalizeEntityResponse(materialResponse.data)

    // Prepare subtype data based on type
    if (type === 'PAPER') {
      const paperData = {
        material_id: createdMaterial.id,
        name: subtypeData.paperType || '', // paper name (required)
        type: subtypeData.paperType || '', // paper type (e.g., GLOSSY)
        weight: subtypeData.weight,
        brightness: subtypeData.brightness,
        color: subtypeData.color,
      }
      await paperService.create(paperData)
    } else if (type === 'INK') {
      const inkData = {
        material_id: createdMaterial.id,
        name: materialData.name, // reuse material name as ink name (optional)
        inkTypes: subtypeData.inkTypes
          ? subtypeData.inkTypes.split(',').map((t) => t.trim()).filter((t) => t)
          : [],
      }
      await inkService.create(inkData)
    } else if (type === 'CHEMICAL') {
      const chemicalData = {
        material_id: createdMaterial.id,
        name: materialData.name,
        chemicalTypes: subtypeData.chemicalTypes
          ? subtypeData.chemicalTypes.split(',').map((t) => t.trim()).filter((t) => t)
          : [],
      }
      await chemicalService.create(chemicalData)
    }
    // For ZINC, PLATE, GLUE, OTHER: no subtype data

    // Refetch to get updated material with relations
    const refreshed = await materialService.getById(createdMaterial.id)
    return refreshed
  },

  update: async (id, data) => {
    const { materialData, subtypeData, type } = data

    // First update the material
    await apiClient.put(`${API_ENDPOINTS.materials}/${id}`, materialData)

    // Prepare subtype data based on type
    if (type === 'PAPER') {
      const paperData = {
        material_id: id,
        name: subtypeData.paperType || '',
        type: subtypeData.paperType || '',
        weight: subtypeData.weight,
        brightness: subtypeData.brightness,
        color: subtypeData.color,
      }
      await paperService.create(paperData) // create; if duplicate, backend should handle
    } else if (type === 'INK') {
      const inkData = {
        material_id: id,
        name: materialData.name,
        inkTypes: subtypeData.inkTypes
          ? subtypeData.inkTypes.split(',').map((t) => t.trim()).filter((t) => t)
          : [],
      }
      await inkService.create(inkData)
    } else if (type === 'CHEMICAL') {
      const chemicalData = {
        material_id: id,
        name: materialData.name,
        chemicalTypes: subtypeData.chemicalTypes
          ? subtypeData.chemicalTypes.split(',').map((t) => t.trim()).filter((t) => t)
          : [],
      }
      await chemicalService.create(chemicalData)
    }

    // Refetch to get updated state
    const refreshed = await materialService.getById(id)
    return refreshed
  },

  delete: async (id) => {
    await apiClient.delete(`${API_ENDPOINTS.materials}/${id}`)
    return { success: true, id: Number(id) }
  },
}