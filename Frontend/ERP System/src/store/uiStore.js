import { create } from 'zustand'

export const useSidebarStore = create((set) => ({
  isCollapsed: false,
  isMobileOpen: false,
  toggleCollapsed: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
  setMobileOpen: (isMobileOpen) => set({ isMobileOpen }),
  closeMobile: () => set({ isMobileOpen: false }),
}))

export const useUIStore = create((set) => ({
  globalLoading: false,
  setGlobalLoading: (globalLoading) => set({ globalLoading }),
}))
