import { apiClient, normalizePageResponse, normalizeEntityResponse } from '@/services/api'
import { API_ENDPOINTS } from '@/services/api'

const buildTotals = (items = []) => {
  const subtotal = items.reduce((sum, item) => sum + Number(item.totalPrice || 0), 0)
  return {
    subtotal,
    totalItems: items.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
    grandTotal: subtotal,
  }
}

const mapPurchase = (item = {}) => ({
  ...item,
  id: item.id,
  purchaseNumber: item.purchaseNumber || item.orderNumber || `PO-${item.id || 'new'}`,
  supplierId: item.supplierId || item.supplier?.id || null,
  supplierName: item.supplierName || item.supplier?.name || '',
  purchaseDate: item.purchaseDate || item.date || item.createdAt || '',
  items: item.items || [],
  status: item.status || 'draft',
  notes: item.notes || '',
  createdAt: item.createdAt || item.created_at || '',
})

export const purchaseService = {
  getAll: async () => {
    const response = await apiClient.get(API_ENDPOINTS.purchases)
    return normalizePageResponse(response.data).map(mapPurchase)
  },

  getById: async (id) => {
    const response = await apiClient.get(`${API_ENDPOINTS.purchases}/${id}`)
    return mapPurchase(normalizeEntityResponse(response.data))
  },

  create: async (data) => {
    const payload = {
      purchaseNumber: data.purchaseNumber,
      supplierId: data.supplierId,
      supplierName: data.supplierName,
      purchaseDate: data.purchaseDate,
      status: data.status || 'draft',
      notes: data.notes || '',
      items: data.items || [],
      ...data,
    }
    const response = await apiClient.post(API_ENDPOINTS.purchases, payload)
    return mapPurchase(normalizeEntityResponse(response.data))
  },

  update: async (id, data) => {
    const payload = {
      purchaseNumber: data.purchaseNumber,
      supplierId: data.supplierId,
      supplierName: data.supplierName,
      purchaseDate: data.purchaseDate,
      status: data.status || 'draft',
      notes: data.notes || '',
      items: data.items || [],
      ...data,
    }
    const response = await apiClient.put(`${API_ENDPOINTS.purchases}/${id}`, payload)
    return mapPurchase(normalizeEntityResponse(response.data))
  },

  delete: async (id) => {
    await apiClient.delete(`${API_ENDPOINTS.purchases}/${id}`)
    return { success: true, id: Number(id) }
  },

  getSummary: async (items = []) => buildTotals(items),
}