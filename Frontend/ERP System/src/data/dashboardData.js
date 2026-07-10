export const dashboardQuickStats = {
  totalCompanies: 24,
  totalProducts: 48,
  materialsInStock: 156,
  lowStockMaterials: 5,
  todaysProductionOrders: 8,
  completedOrders: 32,
  pendingOrders: 6,
}

export const dashboardRecentProductionOrders = [
  {
    id: 1,
    orderNumber: 'PRO-2026-001',
    company: 'شركة عالمية للطباعة',
    product: 'بطاقات أعمال - فاخرة',
    quantity: 5000,
    status: 'in-progress',
    createdAt: '2026-07-07',
  },
  {
    id: 2,
    orderNumber: 'PRO-2026-002',
    company: 'شركة الخليج للتغليف',
    product: 'بروشور A4 ثلاثي الطي',
    quantity: 2000,
    status: 'pending',
    createdAt: '2026-07-07',
  },
  {
    id: 3,
    orderNumber: 'PRO-2026-003',
    company: 'مجموعة الإعلام السعودي',
    product: 'بانر فينيل 2×1 م',
    quantity: 50,
    status: 'completed',
    createdAt: '2026-07-06',
  },
  {
    id: 4,
    orderNumber: 'PRO-2026-004',
    company: 'حلول الطباعة المتقدمة',
    product: 'كتالوج 20 صفحة',
    quantity: 500,
    status: 'in-progress',
    createdAt: '2026-07-05',
  },
  {
    id: 5,
    orderNumber: 'PRO-2026-005',
    company: 'شركة التصاميم الإبداعية',
    product: 'طقم أوراق رسمية',
    quantity: 1200,
    status: 'pending',
    createdAt: '2026-07-04',
  },
]

export const dashboardInventoryOverview = {
  totalMaterials: 156,
  lowStock: 5,
  recentlyPurchased: 12,
  mostUsedMaterial: 'ورق لامع A4 300 جرام',
}

export const dashboardActivities = [
  {
    id: 1,
    type: 'company',
    title: 'تمت إضافة شركة جديدة',
    description: 'شركة التصاميم الإبداعية',
    time: 'منذ 30 دقيقة',
  },
  {
    id: 2,
    type: 'purchase',
    title: 'تم إنشاء أمر شراء',
    description: 'PO-2026-003 — المواد العالمية',
    time: 'منذ ساعتين',
  },
  {
    id: 3,
    type: 'inventory',
    title: 'تم تحديث المخزون',
    description: 'رول فينيل 1.2 م — المستودع ب',
    time: 'منذ 4 ساعات',
  },
  {
    id: 4,
    type: 'production-start',
    title: 'بدء الإنتاج',
    description: 'PRO-2026-001 — بطاقات أعمال',
    time: 'منذ 6 ساعات',
  },
  {
    id: 5,
    type: 'production-finish',
    title: 'اكتمل الإنتاج',
    description: 'PRO-2026-003 — بانر فينيل',
    time: 'منذ يوم',
  },
  {
    id: 6,
    type: 'inventory',
    title: 'تنبيه مخزون منخفض',
    description: 'طقم أحبار CMYK — 8 وحدات متبقية',
    time: 'منذ يومين',
  },
]

export const dashboardChartPlaceholders = [
  { id: 'inventory', titleKey: 'inventoryChart' },
  { id: 'production', titleKey: 'productionChart' },
  { id: 'monthly-orders', titleKey: 'monthlyOrdersChart' },
]
