import { apiClient, normalizePageResponse, normalizeEntityResponse } from '@/services/api'
import { API_ENDPOINTS } from '@/services/api'

const mapProductionOrder = (item = {}) => {
  const company = item.company || item.companyName || ''
  const product = item.product || item.productName || ''

  return {
    ...item,
    id: item.id,
    orderNumber: item.orderNumber || item.order_number || `PO-${item.id || 'new'}`,
    companyId: item.companyId || item.company_id || item.company?.id || null,
    companyName: item.companyName || item.company?.name || company,
    productId: item.productId || item.product_id || item.product?.id || null,
    productName: item.productName || item.product?.name || product,
    quantity: item.quantity || item.requiredSheets || 0,
    orderDate: item.orderDate || item.createdAt || '',
    expectedDeliveryDate: item.expectedDeliveryDate || item.dueDate || '',
    status: item.status || 'pending',
    notes: item.notes || item.description || '',
    createdAt: item.createdAt || item.created_at || '',
    updatedAt: item.updatedAt || item.updated_at || '',
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
    const payload = {
      orderNumber: data.orderNumber,
      companyId: data.companyId,
      company: data.companyName || data.company,
      productId: data.productId,
      product: data.productName || data.product,
      quantity: Number(data.quantity || 0),
      orderDate: data.orderDate,
      expectedDeliveryDate: data.expectedDeliveryDate,
      status: data.status || 'pending',
      notes: data.notes || data.description || '',
      description: data.notes || data.description || '',
      requiredSheets: Number(data.quantity || 0),
      paper: data.paper || null,
      material: data.material || null,
      ...data,
    }
    const response = await apiClient.post(API_ENDPOINTS.productionOrders, payload)
    return mapProductionOrder(normalizeEntityResponse(response.data))
  },

  update: async (id, data) => {
    const payload = {
      orderNumber: data.orderNumber,
      companyId: data.companyId,
      company: data.companyName || data.company,
      productId: data.productId,
      product: data.productName || data.product,
      quantity: Number(data.quantity || 0),
      orderDate: data.orderDate,
      expectedDeliveryDate: data.expectedDeliveryDate,
      status: data.status || 'pending',
      notes: data.notes || data.description || '',
      description: data.notes || data.description || '',
      requiredSheets: Number(data.quantity || 0),
      paper: data.paper || null,
      material: data.material || null,
      ...data,
    }
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
  },
}