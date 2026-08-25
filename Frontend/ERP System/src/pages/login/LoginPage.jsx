// src/pages/login/LoginPage.jsx
import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

export function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const { login, isAuthenticated, loading: authLoading } = useAuth()

  // ✅ التوجيه عند تغير حالة المصادقة
  useEffect(() => {
    console.log('🔍 LoginPage - authLoading:', authLoading, 'isAuthenticated:', isAuthenticated)
    
    // لو خلص التحميل والمستخدم مسجل → روح للداشبورد
    if (!authLoading && isAuthenticated) {
      console.log('✅ Redirecting to dashboard...')
      navigate("/", { replace: true })
    }
  }, [authLoading, isAuthenticated, navigate])

  // ✅ عرض loader أثناء التحقق الأولي
  if (authLoading) {
    console.log('⏳ Showing loader...')
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // ✅ لو مسجل، ماتعرضش حاجة (الـ useEffect هيتولى التوجيه)
  if (isAuthenticated) {
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    
    try {
      console.log('🔐 Attempting login...')
      await login({ email, password })
      console.log('✅ Login completed, waiting for redirect...')
      // التوجيه هيحصل تلقائياً من الـ useEffect
    } catch (err) {
      console.error('❌ Login failed:', err)
      setError(err.message || "فشل تسجيل الدخول. تأكد من البريد الإلكتروني وكلمة المرور.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md space-y-6 p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">تسجيل الدخول</h2>
          <p className="text-sm text-gray-600 mt-1">أدخل بياناتك للوصول إلى النظام</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
              placeholder="admin@alamia.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              كلمة المرور
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isSubmitting}
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-3 border border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                جاري تسجيل الدخول...
              </span>
            ) : (
              "تسجيل الدخول"
            )}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} نظام إدارة الطباعة علامية. جميع الحقوق محفوظة.
        </p>
      </div>
    </div>
  )
}