import { useEffect } from 'react'
import { useSidebarStore } from '@/store/uiStore'
import { useIsTablet } from '@/hooks/useMediaQuery'

export function useSidebar() {
  const isTablet = useIsTablet()
  const { isCollapsed, isMobileOpen, toggleCollapsed, setMobileOpen, closeMobile } = useSidebarStore()

  useEffect(() => {
    if (isTablet) {
      useSidebarStore.setState({ isCollapsed: true })
    }
  }, [isTablet])

  return {
    isCollapsed: isTablet ? true : isCollapsed,
    isMobileOpen,
    isTablet,
    toggleCollapsed,
    setMobileOpen,
    closeMobile,
  }
}
