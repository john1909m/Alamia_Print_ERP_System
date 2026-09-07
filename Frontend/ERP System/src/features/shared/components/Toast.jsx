import { useState, useEffect, useCallback } from 'react'
import { Portal } from '@radix-ui/react-portal'
import { ar } from '@/constants/ar'

// Simple event emitter for toast notifications
let toastListeners = []

export function addToastListener(listener) {
  toastListeners.push(listener)
  return () => {
    toastListeners = toastListeners.filter(l => l !== listener)
  }
}

export function removeToastListener(listener) {
  toastListeners = toastListeners.filter(l => l !== listener)
}

export function triggerToast(message, options = {}) {
  toastListeners.forEach(listener => listener(message, options))
}

export function Toast({ message, duration = 5000, onClose }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (message) {
      setVisible(true)

      const timer = setTimeout(() => {
        setVisible(false)
        if (onClose) onClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [message, duration, onClose])

  if (!visible || !message) return null

  return (
    <Portal>
      <div className="fixed bottom-4 right-4 z-50">
        <div className="flex w-[320px] items-center p-4 bg-border text-black rounded-lg shadow-lg space-x-3">
          <div className="flex-shrink-0">
            {/* Warning icon */}
            <svg className="h-5 w-5 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c.77-1.333-.262-2.854-1.732-3H6.938c-.77 1.333-2.305 1.732-1.732 3z"></path>
            </svg>
          </div>
          <div className="flex-1 text-right">
            <p className="font-medium">{message}</p>
          </div>
        </div>
      </div>
    </Portal>
  )
}

export function Toaster() {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, options = {}) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, ...options }])
    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  // Set up listener when component mounts
  useEffect(() => {
    const listener = (message, options) => {
      addToast(message, options)
    }
    addToastListener(listener)
    return () => removeToastListener(listener)
  }, [addToast, removeToastListener])

  return (
    <>
      {toasts.map((toast, index) => (
        <Toast
          key={toast.id}
          message={toast.message}
          duration={toast.duration || 5000}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  )
}