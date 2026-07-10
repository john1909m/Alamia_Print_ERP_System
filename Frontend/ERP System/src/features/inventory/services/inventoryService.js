import { inventoryMockData } from '@/features/inventory/mock/inventoryData'

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

let store = [...inventoryMockData]

export const inventoryService = {
  getAll: async () => {
    await delay()
    return Promise.resolve(store)
  },
  getById: async (id) => {
    await delay()
    const item = store.find((entry) => entry.id === Number(id))
    return Promise.resolve(item || null)
  },
  create: async (data) => {
    await delay()
    const newItem = { id: Date.now(), date: new Date().toISOString().split('T')[0], ...data }
    store = [newItem, ...store]
    return Promise.resolve(newItem)
  },
  update: async (id, data) => {
    await delay()
    store = store.map((item) => (item.id === Number(id) ? { ...item, ...data } : item))
    return Promise.resolve(store.find((item) => item.id === Number(id)))
  },
  delete: async (id) => {
    await delay()
    store = store.filter((item) => item.id !== Number(id))
    return Promise.resolve({ success: true, id: Number(id) })
  },
}
