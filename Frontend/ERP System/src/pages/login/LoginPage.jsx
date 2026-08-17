import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { authService } from "@/services/authService"
import { useAuth } from "@/context/AuthContext"

export function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const { login, isAuthenticated, loading: authLoading } = useAuth()

  // Redirect to home if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate("/", { replace: true })
    }
  }, [authLoading, isAuthenticated, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await login({ email, password })
      // Login successful, login function already redirects
    } catch (err) {
      setError(err.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center">
      <div className="w-full max-w-md space-y-6 p-4 md:p-6 lg:p-8">
        <h2 className="text-2xl font-bold text-center">Login to Alamia Print ERP</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
          </div>
          {error && (
            <div className="rounded-md bg-red-50 p-2 text-sm text-red-600">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Alamia Print ERP System
        </p>
      </div>
    </div>
  )
}
