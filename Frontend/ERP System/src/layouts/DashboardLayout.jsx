import { Outlet } from "react-router-dom"
import { Sidebar } from "@/layouts/Sidebar"
import { Navbar } from "@/layouts/Navbar"
import { useSidebar } from "@/hooks/useSidebar"
import { useAuth } from "@/context/AuthContext"
import { useNavigate } from 'react-router-dom'
import { useEffect } from "react"
import { cn } from "@/utils/cn"

export function DashboardLayout() {
  const { isCollapsed, isTablet } = useSidebar()
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  // Redirect to login if not authenticated and not loading
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login", { replace: true })
    }
  }, [user, loading, navigate])

  return (
    <div className="min-h-screen bg-muted/30">
      <Sidebar />
      <Navbar />
      <main
        className={cn(
          "min-h-screen pt-16 transition-all duration-300",
          isTablet ? "ps-0" : isCollapsed ? "ps-[68px]" : "ps-64",
        )}
      >
        <div className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
