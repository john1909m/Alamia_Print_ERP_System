// src/features/users/services/userService.js
import { apiClient, normalizePageResponse, normalizeEntityResponse } from '@/services/api'
import { API_ENDPOINTS } from '@/services/api'

const mapUser = (item = {}) => ({
  ...item,
  id: item.id,
  name: item.name || '',
  email: item.email || '',
  phoneNumber: item.phoneNumber || item.phone || '',
  role: item.role || '',
  // optional fields if present
  createdAt: item.createdAt || item.created_at || '',
})

export const userService = {
  getAll: async () => {
    const response = await apiClient.get(API_ENDPOINTS.users)
    return normalizePageResponse(response.data).map(mapUser)
  },

  getById: async (id) => {
    const response = await apiClient.get(`${API_ENDPOINTS.users}/${id}`)
    return mapUser(normalizeEntityResponse(response.data))
  },

  create: async (data) => {
    const payload = {
      ...data,
      // ensure phoneNumber is sent as phoneNumber (backend may expect phoneNumber)
      phoneNumber: data.phoneNumber || '',
    }
    const response = await apiClient.post(API_ENDPOINTS.users, payload)
    return mapUser(normalizeEntityResponse(response.data))
  },

  update: async (id, data) => {
    const payload = {
      ...data,
      phoneNumber: data.phoneNumber || '',
    }
    const response = await apiClient.put(`${API_ENDPOINTS.users}/${id}`, payload)
    return mapUser(normalizeEntityResponse(response.data))
  },

  delete: async (id) => {
    await apiClient.delete(`${API_ENDPOINTS.users}/${id}`)
    return { success: true, id }
  },
}