// src/features/productionOrders/services/productionOrderService.js
import { apiClient, normalizePageResponse, normalizeEntityResponse } from '@/services/api'
import { API_ENDPOINTS } from '@/services/api'

const mapProductionOrder = (item = {}) => {
  console.log('📦 Mapping production order:', item)
  return {
    id: item.id,
    companyId: item.companyId || item.company_id || null,
    productId: item.productId || item.product_id || null,
    quantity: item.quantity || 0,
    paperId: item.paperId || item.paper_id || null,
    inkIds: Array.isArray(item.inkIds) ? item.inkIds : 
            Array.isArray(item.ink_ids) ? item.ink_ids : [],
    chemicalIds: Array.isArray(item.chemicalIds) ? item.chemicalIds : 
                 Array.isArray(item.chemical_ids) ? item.chemical_ids : [],
    requiredSheets: item.requiredSheets || item.required_sheets || 0,
    numberInMontage: item.numberInMontage || item.number_in_montage || 1,
    requiredChemicals: item.requiredChemicals || item.required_chemicals || 0,
    requiredInks: item.requiredInks || item.required_inks || 0,
    status: item.status || 'SENT_PO',
    description: item.description || '',
    createdAt: item.createdAt || item.created_at || '',
    updatedAt: item.updatedAt || item.updated_at || '',
  }
}

export const productionOrderService = {
  getAll: async () => {
    console.log('📦 Fetching all production orders...')
    try {
      const response = await apiClient.get(API_ENDPOINTS.productionOrders)
      console.log('📦 Production orders response:', response.data)
      const normalized = normalizePageResponse(response.data)
      return normalized.map(mapProductionOrder)
    } catch (error) {
      console.error('❌ Error fetching production orders:', error)
      throw error
    }
  },

  getById: async (id) => {
    console.log(`📦 Fetching production order ${id}...`)
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.productionOrders}/${id}`)
      console.log('📦 Production order response:', response.data)
      return mapProductionOrder(normalizeEntityResponse(response.data))
    } catch (error) {
      console.error(`❌ Error fetching production order ${id}:`, error)
      throw error
    }
  },

  create: async (data) => {
    console.log('📦 Creating production order with data:', data)
    try {
      const payload = {
        companyId: data.companyId,
        productId: data.productId,
        quantity: data.quantity,
        paperId: data.paperId,
        inkIds: Array.isArray(data.inkIds) ? data.inkIds : [],
        chemicalIds: Array.isArray(data.chemicalIds) ? data.chemicalIds : [],
        requiredSheets: data.requiredSheets || 0,
        numberInMontage: data.numberInMontage || 1,
        requiredChemicals: data.requiredChemicals || 0,
        requiredInks: data.requiredInks || 0,
        status: data.status || 'SENT_PO',
        description: data.description || '',
      }
      console.log('📦 Production order payload:', payload)
      
      const response = await apiClient.post(API_ENDPOINTS.productionOrders, payload)
      console.log('📦 Create production order response:', response.data)
      return mapProductionOrder(normalizeEntityResponse(response.data))
    } catch (error) {
      console.error('❌ Error creating production order:', error)
      throw error
    }
  },

  update: async (id, data) => {
    console.log(`📦 Updating production order ${id} with data:`, data)
    try {
      const payload = {
        companyId: data.companyId,
        productId: data.productId,
        quantity: data.quantity,
        paperId: data.paperId,
        inkIds: Array.isArray(data.inkIds) ? data.inkIds : [],
        chemicalIds: Array.isArray(data.chemicalIds) ? data.chemicalIds : [],
        requiredSheets: data.requiredSheets || 0,
        numberInMontage: data.numberInMontage || 1,
        requiredChemicals: data.requiredChemicals || 0,
        requiredInks: data.requiredInks || 0,
        status: data.status || 'SENT_PO',
        description: data.description || '',
      }
      console.log('📦 Production order update payload:', payload)
      
      const response = await apiClient.put(`${API_ENDPOINTS.productionOrders}/${id}`, payload)
      console.log('📦 Update production order response:', response.data)
      return mapProductionOrder(normalizeEntityResponse(response.data))
    } catch (error) {
      console.error(`❌ Error updating production order ${id}:`, error)
      throw error
    }
  },

  delete: async (id) => {
    console.log(`📦 Deleting production order ${id}...`)
    try {
      const response = await apiClient.delete(`${API_ENDPOINTS.productionOrders}/${id}`)
      console.log('📦 Delete production order response:', response.data)
      return { success: true, id: Number(id) }
    } catch (error) {
      console.error(`❌ Error deleting production order ${id}:`, error)
      throw error
    }
  },

  updateStatus: async (id, status) => {
    console.log(`📦 Updating status of production order ${id} to ${status}...`)
    try {
      const response = await apiClient.put(`${API_ENDPOINTS.productionOrders}/${id}`, { status })
      console.log('📦 Update status response:', response.data)
      return mapProductionOrder(normalizeEntityResponse(response.data))
    } catch (error) {
      console.error(`❌ Error updating status of production order ${id}:`, error)
      throw error
    }
  }
}