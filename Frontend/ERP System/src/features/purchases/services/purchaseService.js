import { purchasesMockData } from '@/features/purchases/mock/purchasesData'

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

let store = [...purchasesMockData]

function buildTotals(items = []) {
  const subtotal = items.reduce((sum, item) => sum + Number(item.totalPrice || 0), 0)
  return {
    subtotal,
    totalItems: items.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
    grandTotal: subtotal,
  }
}

export const purchaseService = {
  getAll: async () => {
    await delay()
    return Promise.resolve(store.map((purchase) => ({ ...purchase, items: purchase.items.map((item) => ({ ...item })) })))
  },
  getById: async (id) => {
    await delay()
    const purchase = store.find((item) => item.id === Number(id))
    return Promise.resolve(purchase ? { ...purchase, items: purchase.items.map((item) => ({ ...item })) } : null)
  },
  create: async (data) => {
    await delay()
    const newPurchase = {
      id: Date.now(),
      purchaseNumber: data.purchaseNumber || `PO-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`,
      createdAt: new Date().toISOString().split('T')[0],
      ...data,
      items: (data.items || []).map((item, index) => ({ id: Date.now() + index, ...item })),
    }
    store = [newPurchase, ...store]
    return Promise.resolve({ ...newPurchase })
  },
  update: async (id, data) => {
    await delay()
    store = store.map((purchase) => (purchase.id === Number(id) ? { ...purchase, ...data, items: (data.items || purchase.items).map((item, index) => ({ id: item.id || Date.now() + index, ...item })) } : purchase))
    return Promise.resolve(store.find((purchase) => purchase.id === Number(id)))
  },
  delete: async (id) => {
    await delay()
    store = store.filter((purchase) => purchase.id !== Number(id))
    return Promise.resolve({ success: true, id: Number(id) })
  },
  getSummary: async (items = []) => {
    await delay()
    return Promise.resolve(buildTotals(items))
  },
}
