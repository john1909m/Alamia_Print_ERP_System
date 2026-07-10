export const suppliersMockData = [
  { id: 1, name: 'Alamia Paper Supply', contact: 'Ahmed Hassan', email: 'ahmed@paper-supply.com', phone: '+966 11 111 2222', address: 'Riyadh, King Fahd Road' },
  { id: 2, name: 'Ink Masters Co.', contact: 'Khalid Omar', email: 'khalid@inkmasters.com', phone: '+966 12 222 3333', address: 'Jeddah, Prince Muhammad Road' },
  { id: 3, name: 'Print Essentials', contact: 'Sara Ali', email: 'sara@printessentials.com', phone: '+966 13 333 4444', address: 'Dammam, Al Faisaliyah' },
]

export const materialsMockData = [
  { id: 1, name: 'Couche Paper 80gsm', unit: 'Rim' },
  { id: 2, name: 'Couche Paper 135gsm', unit: 'Rim' },
  { id: 3, name: 'Bristol Paper', unit: 'Rim' },
  { id: 4, name: 'Black Ink', unit: 'L' },
  { id: 5, name: 'Cyan Ink', unit: 'L' },
  { id: 6, name: 'Plate', unit: 'Pc' },
  { id: 7, name: 'Glue', unit: 'Kg' },
  { id: 8, name: 'Chemicals', unit: 'L' },
]

export const purchasesMockData = [
  {
    id: 1,
    purchaseNumber: 'PO-2026-001',
    supplierId: 1,
    supplierName: 'Alamia Paper Supply',
    purchaseDate: '2026-06-20',
    status: 'completed',
    notes: 'Initial stock replenishment for catalogue production.',
    createdAt: '2026-06-20',
    items: [
      { id: 1, materialId: 1, materialName: 'Couche Paper 80gsm', quantity: 120, unit: 'Rim', unitPrice: 180, totalPrice: 21600 },
      { id: 2, materialId: 2, materialName: 'Couche Paper 135gsm', quantity: 80, unit: 'Rim', unitPrice: 240, totalPrice: 19200 },
    ],
  },
  {
    id: 2,
    purchaseNumber: 'PO-2026-002',
    supplierId: 2,
    supplierName: 'Ink Masters Co.',
    purchaseDate: '2026-06-28',
    status: 'draft',
    notes: 'Pending approval for offset press jobs.',
    createdAt: '2026-06-28',
    items: [
      { id: 3, materialId: 4, materialName: 'Black Ink', quantity: 25, unit: 'L', unitPrice: 95, totalPrice: 2375 },
      { id: 4, materialId: 5, materialName: 'Cyan Ink', quantity: 18, unit: 'L', unitPrice: 100, totalPrice: 1800 },
    ],
  },
  {
    id: 3,
    purchaseNumber: 'PO-2026-003',
    supplierId: 3,
    supplierName: 'Print Essentials',
    purchaseDate: '2026-07-03',
    status: 'cancelled',
    notes: 'Order cancelled due to production rescheduling.',
    createdAt: '2026-07-03',
    items: [
      { id: 5, materialId: 6, materialName: 'Plate', quantity: 12, unit: 'Pc', unitPrice: 320, totalPrice: 3840 },
    ],
  },
]
