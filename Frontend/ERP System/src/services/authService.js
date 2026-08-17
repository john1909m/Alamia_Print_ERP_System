// src/services/authService.js
import { apiClient } from './api.js'
import { API_ENDPOINTS } from './api.js'

export const authService = {
  login: async (credentials) => {
    const response = await apiClient.post(API_ENDPOINTS.login, credentials)
    const { token, user } = response.data
    // We don't store the token; it's in the cookie.
    return user
  },
  logout: async () => {
    await apiClient.post(API_ENDPOINTS.logout)
    // The backend should clear the cookie.
  },
  me: async () => {
    const response = await apiClient.get(API_ENDPOINTS.me)
    // Assuming the me endpoint returns the user object directly
    // If it returns { token, user }, we extract the user
    if (response.data.token && response.data.user) {
      return response.data.user
    }
    return response.data
  }
}
