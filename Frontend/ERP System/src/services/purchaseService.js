import { purchasesMockData } from '@/features/purchases/mock/purchasesData'

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

export const purchaseService = {
  getAll: async () => {
    await delay()
    return Promise.resolve(purchasesMockData.map((purchase) => ({ ...purchase, items: purchase.items.map((item) => ({ ...item })) })))
  },
  getById: async (id) => {
    await delay()
    const purchase = purchasesMockData.find((item) => item.id === Number(id))
    return Promise.resolve(purchase ? { ...purchase, items: purchase.items.map((item) => ({ ...item })) } : null)
  },
  create: async (data) => {
    await delay()
    return Promise.resolve({ id: Date.now(), ...data })
  },
  update: async (id, data) => {
    await delay()
    return Promise.resolve({ id: Number(id), ...data })
  },
  delete: async (id) => {
    await delay()
    return Promise.resolve({ success: true, id: Number(id) })
  },
}
