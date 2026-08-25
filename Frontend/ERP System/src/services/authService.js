// src/services/authService.js
import { apiClient } from './api.js'
import { API_ENDPOINTS } from './api.js'

export const authService = {
  login: async (credentials) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.login, credentials)
      const { token, user } = response.data

      if (token) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
      }

      return user
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  },

  logout: async () => {
    try {
      await apiClient.post(API_ENDPOINTS.logout)
    } catch (error) {
      console.error('Logout API error:', error)
    } finally {
      delete apiClient.defaults.headers.common['Authorization']
    }
  },

  me: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.me)
      return response.data.user || response.data
    } catch (error) {
      console.error('Me error:', error)
      throw error
    }
  }
}