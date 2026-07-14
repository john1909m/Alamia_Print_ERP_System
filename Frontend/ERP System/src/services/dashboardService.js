import { companyService } from '@/features/companies/services/companyService'
import { productService } from '@/features/products/services/productService'
import { materialService } from '@/features/materials/services/materialService'
import { productionOrderService } from '@/features/productionOrders/services/productionOrderService'

const toLocaleNumber = (value) => (Number.isFinite(value) ? value : 0)

export const dashboardService = {
  getAll: async () => {
    const [companies, products, materials, orders] = await Promise.all([
      companyService.getAll(),
      productService.getAll(),
      materialService.getAll(),
      productionOrderService.getAll(),
    ])

    const lowStockMaterials = materials.filter((material) => material.currentStock <= material.minStock).length
    const materialsInStock = materials.filter((material) => material.currentStock > 0).length
    const completedOrders = orders.filter((order) => order.status === 'completed' || order.status === 'delivered').length
    const pendingOrders = orders.filter((order) => order.status === 'pending' || order.status === 'approved').length

    return {
      quickStats: {
        totalCompanies: toLocaleNumber(companies.length),
        totalProducts: toLocaleNumber(products.length),
        materialsInStock,
        lowStockMaterials,
        todaysProductionOrders: orders.length,
        completedOrders,
        pendingOrders,
      },
      recentProductionOrders: orders.slice(0, 5).map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        company: order.companyName,
        product: order.productName,
        quantity: order.quantity,
        status: order.status,
        createdAt: order.createdAt || order.orderDate,
      })),
      inventoryOverview: {
        totalMaterials: materials.length,
        lowStock: lowStockMaterials,
        recentlyPurchased: 0,
        mostUsedMaterial: materials[0]?.name || '-',
      },
      activities: [
        {
          id: 'dashboard-1',
          type: 'production',
          title: 'أحدث أوامر الإنتاج',
          description: orders[0] ? `الطلب ${orders[0].orderNumber}` : 'لا توجد أوامر حالياً',
          time: 'الآن',
        },
      ],
      chartPlaceholders: [
        { id: 'inventory', titleKey: 'inventoryChart' },
        { id: 'production', titleKey: 'productionChart' },
        { id: 'monthly-orders', titleKey: 'monthlyOrdersChart' },
      ],
    }
  },
}