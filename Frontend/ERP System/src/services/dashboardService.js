import {
  dashboardQuickStats,
  dashboardRecentProductionOrders,
  dashboardInventoryOverview,
  dashboardActivities,
  dashboardChartPlaceholders,
} from '@/data/dashboardData'

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

export const dashboardService = {
  getAll: async () => {
    await delay()
    return Promise.resolve({
      quickStats: { ...dashboardQuickStats },
      recentProductionOrders: [...dashboardRecentProductionOrders],
      inventoryOverview: { ...dashboardInventoryOverview },
      activities: [...dashboardActivities],
      chartPlaceholders: [...dashboardChartPlaceholders],
    })
  },
}
