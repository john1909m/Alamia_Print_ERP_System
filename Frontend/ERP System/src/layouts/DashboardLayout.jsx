import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/layouts/Sidebar'
import { Navbar } from '@/layouts/Navbar'
import { useSidebar } from '@/hooks/useSidebar'
import { cn } from '@/utils/cn'

export function DashboardLayout() {
  const { isCollapsed, isTablet } = useSidebar()

  return (
    <div className="min-h-screen bg-muted/30">
      <Sidebar />
      <Navbar />
      <main
        className={cn(
          'min-h-screen pt-16 transition-all duration-300',
          isTablet ? 'ps-0' : isCollapsed ? 'ps-[68px]' : 'ps-64',
        )}
      >
        <div className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
