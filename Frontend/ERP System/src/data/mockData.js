export const companies = [
  { id: 1, name: 'شركة عالمية للطباعة', email: 'info@alamiaprint.com', phone: '+966 11 234 5678', city: 'الرياض', status: 'active', createdAt: '2025-01-15' },
  { id: 2, name: 'شركة الخليج للتغليف', email: 'contact@gulfpack.com', phone: '+966 12 345 6789', city: 'جدة', status: 'active', createdAt: '2025-02-20' },
  { id: 3, name: 'مجموعة الإعلام السعودي', email: 'orders@saudimedia.sa', phone: '+966 13 456 7890', city: 'الدمام', status: 'inactive', createdAt: '2025-03-10' },
  { id: 4, name: 'حلول الطباعة المتقدمة', email: 'hello@printsolutions.com', phone: '+966 11 567 8901', city: 'الرياض', status: 'active', createdAt: '2025-04-05' },
  { id: 5, name: 'شركة التصاميم الإبداعية', email: 'info@creativedesigns.sa', phone: '+966 12 678 9012', city: 'جدة', status: 'active', createdAt: '2025-05-12' },
]

export const suppliers = [
  { id: 1, name: 'عالم الورق للتجارة', contact: 'أحمد حسن', email: 'ahmed@paperworld.com', phone: '+966 11 111 2222', category: 'ورق', status: 'active' },
  { id: 2, name: 'ماسترز للأحبار', contact: 'خالد عمر', email: 'khalid@inkmasters.com', phone: '+966 12 222 3333', category: 'أحبار', status: 'active' },
  { id: 3, name: 'المواد العالمية', contact: 'فيصل علي', email: 'faisal@globalmat.com', phone: '+966 13 333 4444', category: 'مواد', status: 'active' },
  { id: 4, name: 'تك للمعدات الطباعية', contact: 'عمر صالح', email: 'omar@techprint.com', phone: '+966 11 444 5555', category: 'معدات', status: 'inactive' },
]

export const materials = [
  { id: 1, name: 'ورق لامع A4 300 جرام', sku: 'MAT-001', unit: 'رزمة', category: 'ورق', minStock: 50, status: 'active' },
  { id: 2, name: 'طقم أحبار CMYK', sku: 'MAT-002', unit: 'طقم', category: 'أحبار', minStock: 10, status: 'active' },
  { id: 3, name: 'رول فينيل 1.2 م', sku: 'MAT-003', unit: 'رول', category: 'فينيل', minStock: 20, status: 'active' },
  { id: 4, name: 'فيلم تلميع', sku: 'MAT-004', unit: 'رول', category: 'تشطيب', minStock: 15, status: 'active' },
  { id: 5, name: 'سلك تجليد', sku: 'MAT-005', unit: 'صندوق', category: 'تجليد', minStock: 30, status: 'inactive' },
]

export const inventory = [
  { id: 1, materialId: 1, materialName: 'ورق لامع A4 300 جرام', quantity: 120, location: 'المستودع أ', status: 'active', lastUpdated: '2026-07-01' },
  { id: 2, materialId: 2, materialName: 'طقم أحبار CMYK', quantity: 8, location: 'المستودع أ', status: 'low-stock', lastUpdated: '2026-07-03' },
  { id: 3, materialId: 3, materialName: 'رول فينيل 1.2 م', quantity: 45, location: 'المستودع ب', status: 'active', lastUpdated: '2026-07-05' },
  { id: 4, materialId: 4, materialName: 'فيلم تلميع', quantity: 0, location: 'المستودع ب', status: 'out-of-stock', lastUpdated: '2026-07-06' },
  { id: 5, materialId: 5, materialName: 'سلك تجليد', quantity: 65, location: 'المستودع أ', status: 'active', lastUpdated: '2026-07-07' },
]

export const products = [
  { id: 1, name: 'بطاقات أعمال - فاخرة', sku: 'PRD-001', category: 'بطاقات', price: 150, status: 'active' },
  { id: 2, name: 'بروشور A4 ثلاثي الطي', sku: 'PRD-002', category: 'بروشورات', price: 350, status: 'active' },
  { id: 3, name: 'بانر فينيل 2×1 م', sku: 'PRD-003', category: 'بانرات', price: 280, status: 'active' },
  { id: 4, name: 'طقم أوراق رسمية', sku: 'PRD-004', category: 'قرطاسية', price: 120, status: 'inactive' },
  { id: 5, name: 'كتالوج 20 صفحة', sku: 'PRD-005', category: 'كتالوجات', price: 850, status: 'active' },
]

export const purchases = [
  { id: 1, orderNumber: 'PO-2026-001', supplier: 'عالم الورق للتجارة', items: 3, total: 12500, status: 'completed', date: '2026-06-15' },
  { id: 2, orderNumber: 'PO-2026-002', supplier: 'ماسترز للأحبار', items: 2, total: 4800, status: 'pending', date: '2026-06-28' },
  { id: 3, orderNumber: 'PO-2026-003', supplier: 'المواد العالمية', items: 5, total: 8900, status: 'in-progress', date: '2026-07-02' },
  { id: 4, orderNumber: 'PO-2026-004', supplier: 'عالم الورق للتجارة', items: 1, total: 2100, status: 'cancelled', date: '2026-07-05' },
]

export const productionOrders = [
  { id: 1, orderNumber: 'PRO-2026-001', product: 'بطاقات أعمال - فاخرة', quantity: 5000, status: 'in-progress', dueDate: '2026-07-10', company: 'شركة عالمية للطباعة' },
  { id: 2, orderNumber: 'PRO-2026-002', product: 'بروشور A4 ثلاثي الطي', quantity: 2000, status: 'pending', dueDate: '2026-07-15', company: 'شركة الخليج للتغليف' },
  { id: 3, orderNumber: 'PRO-2026-003', product: 'بانر فينيل 2×1 م', quantity: 50, status: 'completed', dueDate: '2026-07-01', company: 'مجموعة الإعلام السعودي' },
  { id: 4, orderNumber: 'PRO-2026-004', product: 'كتالوج 20 صفحة', quantity: 500, status: 'in-progress', dueDate: '2026-07-20', company: 'حلول الطباعة المتقدمة' },
]

export const dashboardStats = {
  totalCompanies: 24,
  activeOrders: 12,
  lowStockItems: 5,
  monthlyRevenue: 185000,
  companiesChange: 8,
  ordersChange: -3,
  stockChange: 2,
  revenueChange: 15,
}

export const recentActivity = [
  { id: 1, action: 'اكتمل أمر الإنتاج', entity: 'PRO-2026-003', time: 'منذ ساعتين', type: 'production' },
  { id: 2, action: 'تم إنشاء أمر شراء جديد', entity: 'PO-2026-003', time: 'منذ 5 ساعات', type: 'purchase' },
  { id: 3, action: 'تنبيه مخزون منخفض', entity: 'طقم أحبار CMYK', time: 'منذ يوم', type: 'inventory' },
  { id: 4, action: 'تمت إضافة شركة جديدة', entity: 'شركة التصاميم الإبداعية', time: 'منذ يومين', type: 'company' },
  { id: 5, action: 'تم تحديث المخزون', entity: 'رول فينيل 1.2 م', time: 'منذ 3 أيام', type: 'inventory' },
]

export const inventorySummary = [
  { category: 'ورق', total: 450, lowStock: 1 },
  { category: 'أحبار', total: 85, lowStock: 2 },
  { category: 'فينيل', total: 120, lowStock: 0 },
  { category: 'تشطيب', total: 65, lowStock: 1 },
  { category: 'تجليد', total: 200, lowStock: 0 },
]

export const productionSummary = [
  { status: 'قيد الانتظار', count: 4 },
  { status: 'قيد التنفيذ', count: 8 },
  { status: 'مكتمل', count: 32 },
  { status: 'ملغى', count: 2 },
]
