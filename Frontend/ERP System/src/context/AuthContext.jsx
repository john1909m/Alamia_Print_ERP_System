// src/context/AuthContext.jsx
import React, { createContext, useContext, useState,useEffect, useCallback } from 'react'
import { authService } from '@/services/authService'

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)


useEffect(() => {
    // عند الـ reload، جرب تجيب الـ user من الـ backend
    authService.me()
      .then(userData => setUser(userData))
      .catch(() => setUser(null)) // مفيش cookie أو انتهت
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (credentials) => {
    const userData = await authService.login(credentials)
    setUser(userData)
    return userData
  }, [])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } finally {
      setUser(null)
    }
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      loading: false,
      login,
      logout,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  )
}