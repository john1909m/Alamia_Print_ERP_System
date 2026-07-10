import { materialsMockData } from '@/features/materials/mock/materialsData'
import { withStockStatus } from '@/features/materials/utils/stockStatus'

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

let store = materialsMockData.map((item) => withStockStatus({ ...item }))

function enrich(item) {
  return withStockStatus({ ...item })
}

export const materialService = {
  getAll: async () => {
    await delay()
    return Promise.resolve(store.map(enrich))
  },

  getById: async (id) => {
    await delay()
    const material = store.find((m) => m.id === Number(id))
    return Promise.resolve(material ? enrich(material) : null)
  },

  create: async (data) => {
    await delay()
    const newMaterial = enrich({
      id: Date.now(),
      currentStock: 0,
      createdAt: new Date().toISOString().split('T')[0],
      ...data,
    })
    store = [newMaterial, ...store]
    return Promise.resolve({ ...newMaterial })
  },

  update: async (id, data) => {
    await delay()
    store = store.map((item) =>
      item.id === Number(id) ? enrich({ ...item, ...data, id: item.id }) : item,
    )
    const updated = store.find((m) => m.id === Number(id))
    return Promise.resolve({ ...updated })
  },

  delete: async (id) => {
    await delay()
    store = store.filter((item) => item.id !== Number(id))
    return Promise.resolve({ success: true, id: Number(id) })
  },
}
