// src/app/App.jsx
import { RouterProvider } from 'react-router-dom'
import { router } from '@/routes'
import { Toaster } from '@/features/shared/components/Toast'

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  )
}
