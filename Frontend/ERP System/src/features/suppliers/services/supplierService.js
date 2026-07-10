import { suppliersMockData } from '@/features/suppliers/mock/suppliersData'

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

let store = suppliersMockData.map((item) => ({ ...item }))

export const supplierService = {
  getAll: async () => {
    await delay()
    return Promise.resolve(store.map((item) => ({ ...item })))
  },

  getById: async (id) => {
    await delay()
    const supplier = store.find((s) => s.id === Number(id))
    return Promise.resolve(supplier ? { ...supplier } : null)
  },

  create: async (data) => {
    await delay()
    const newSupplier = {
      id: Date.now(),
      materialsCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      ...data,
    }
    store = [newSupplier, ...store]
    return Promise.resolve({ ...newSupplier })
  },

  update: async (id, data) => {
    await delay()
    store = store.map((item) =>
      item.id === Number(id) ? { ...item, ...data, id: item.id } : item,
    )
    const updated = store.find((s) => s.id === Number(id))
    return Promise.resolve({ ...updated })
  },

  delete: async (id) => {
    await delay()
    store = store.filter((item) => item.id !== Number(id))
    return Promise.resolve({ success: true, id: Number(id) })
  },
}
