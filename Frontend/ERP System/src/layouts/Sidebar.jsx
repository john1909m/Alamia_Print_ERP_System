import { NavLink } from 'react-router-dom'
import { ChevronRight, Printer } from 'lucide-react'
import { NAV_ITEMS } from '@/constants/navigation'
import { APP_NAME } from '@/constants/app'
import { ar } from '@/constants/ar'
import { useSidebar } from '@/hooks/useSidebar'
import { cn } from '@/utils/cn'
import { Button } from '@/components/ui/button'
import logo from '@/assets/logo.png'

export function Sidebar() {
  const { isCollapsed, isMobileOpen, isTablet, toggleCollapsed, closeMobile } = useSidebar()

  return (
    <>
      {isTablet && isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden"
          onClick={closeMobile}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 start-0 z-50 flex h-full flex-col border-e bg-sidebar transition-all duration-300 ease-in-out',
          isCollapsed ? 'w-[68px]' : 'w-64',
          isTablet && !isMobileOpen && 'translate-x-full',
          isTablet && isMobileOpen && 'translate-x-0',
        )}
      >
        <div className={cn('flex h-16 items-center border-b px-4', isCollapsed && 'justify-center px-2')}>
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center ">
              <img src={logo} alt="company logo" />
            </div>
            {!isCollapsed && (
              <span className="truncate text-sm font-bold text-sidebar-foreground">{APP_NAME}</span>
            )}
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={closeMobile}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isCollapsed && 'justify-center px-2',
                  isActive
                    ? 'bg-sidebar-active text-sidebar-active-foreground'
                    : 'text-sidebar-foreground hover:bg-accent hover:text-accent-foreground',
                )
              }
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {!isTablet && (
          <div className="border-t p-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleCollapsed}
              className={cn('w-full', isCollapsed && 'px-2')}
            >
              <ChevronRight className={cn('h-4 w-4 transition-transform', isCollapsed && 'rotate-180')} />
              {!isCollapsed && <span>{ar.common.collapse}</span>}
            </Button>
          </div>
        )}
      </aside>
    </>
  )
}
