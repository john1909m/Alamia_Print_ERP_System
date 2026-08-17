
import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '@/services/authService'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Fetch user on mount to check if we are authenticated
  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await authService.me()
        setUser(data)
      } catch (error) {
        // If me fails, we are not authenticated
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials)
      setUser(data)
      // Redirect to dashboard or home after login
      navigate('/', { replace: true })
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } finally {
      setUser(null)
      navigate('/login', { replace: true })
    }
  }

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  }

  if (loading) {
    return <>{children}</>
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

