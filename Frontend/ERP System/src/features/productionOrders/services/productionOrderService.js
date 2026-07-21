import { apiClient, normalizePageResponse, normalizeEntityResponse } from '@/services/api'
import { API_ENDPOINTS } from '@/services/api'

const mapProductionOrder = (item = {}) => {
  // Extract IDs from the response (these come directly from the DTO)
  const companyId = item.company_id ?? null
  const productIds = item.product_ids ?? []
  const paperId = item.paper_id ?? null
  const materialIds = item.material_ids ?? []

  return {
    ...item,
    id: item.id,
    // For form submission, we'll use the ID fields directly
    companyId: companyId,
    productIds: productIds,
    paperId: paperId,
    materialIds: materialIds,
    quantity: item.quantity,
    requiredSheets: item.requiredSheets,
    status: item.status || 'pending',
    description: item.description || '',
    createdAt: item.createdAt || item.created_at || '',
    updatedAt: item.updatedAt || item.updated_at || ''
  }
}

export const productionOrderService = {
  getAll: async () => {
    const response = await apiClient.get(API_ENDPOINTS.productionOrders)
    return normalizePageResponse(response.data).map(mapProductionOrder)
  },

  getById: async (id) => {
    const response = await apiClient.get(`${API_ENDPOINTS.productionOrders}/${id}`)
    return mapProductionOrder(normalizeEntityResponse(response.data))
  },

  create: async (data) => {
    // Map form field names to DTO field names
    const payload = {
      company_id: data.companyId,
      product_ids: data.productIds || [],
      quantity: data.quantity,
      paper_id: data.paperId,
      material_ids: data.materialIds || [],
      requiredSheets: data.requiredSheets ?? data.quantity, // Default to quantity if not provided
      status: data.status || 'pending',
      description: data.description || data.notes || '' // Map notes to description for backward compatibility
    }

    // Remove undefined/null values
    Object.keys(payload).forEach(key => {
      if (payload[key] === undefined || payload[key] === null) {
        delete payload[key]
      }
    })

    const response = await apiClient.post(API_ENDPOINTS.productionOrders, payload)
    return mapProductionOrder(normalizeEntityResponse(response.data))
  },

  update: async (id, data) => {
    // Map form field names to DTO field names (same as create)
    const payload = {
      company_id: data.companyId,
      product_ids: data.productIds || [],
      quantity: data.quantity,
      paper_id: data.paperId,
      material_ids: data.materialIds || [],
      requiredSheets: data.requiredSheets ?? data.quantity, // Default to quantity if not provided
      status: data.status || 'pending',
      description: data.description || data.notes || ''
    }

    // Remove undefined/null values
    Object.keys(payload).forEach(key => {
      if (payload[key] === undefined || payload[key] === null) {
        delete payload[key]
      }
    })

    const response = await apiClient.put(`${API_ENDPOINTS.productionOrders}/${id}`, payload)
    return mapProductionOrder(normalizeEntityResponse(response.data))
  },

  delete: async (id) => {
    await apiClient.delete(`${API_ENDPOINTS.productionOrders}/${id}`)
    return { success: true, id: Number(id) }
  },

  updateStatus: async (id, status) => {
    const response = await apiClient.put(`${API_ENDPOINTS.productionOrders}/${id}`, { status })
    return mapProductionOrder(normalizeEntityResponse(response.data))
  }
}