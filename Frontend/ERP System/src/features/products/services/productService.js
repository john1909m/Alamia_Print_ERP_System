import { productsMockData } from '@/features/products/mock/productsData'

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

let store = productsMockData.map((item) => ({ ...item }))

export const productService = {
  getAll: async () => {
    await delay()
    return Promise.resolve(store.map((item) => ({ ...item })))
  },

  getById: async (id) => {
    await delay()
    const product = store.find((p) => p.id === Number(id))
    return Promise.resolve(product ? { ...product } : null)
  },

  create: async (data) => {
    await delay()
    const newProduct = {
      id: Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      ...data,
    }
    store = [newProduct, ...store]
    return Promise.resolve({ ...newProduct })
  },

  update: async (id, data) => {
    await delay()
    store = store.map((item) =>
      item.id === Number(id)
        ? { ...item, ...data, id: item.id, updatedAt: new Date().toISOString().split('T')[0] }
        : item
    )
    const updated = store.find((p) => p.id === Number(id))
    return Promise.resolve({ ...updated })
  },

  delete: async (id) => {
    await delay()
    store = store.filter((item) => item.id !== Number(id))
    return Promise.resolve({ success: true, id: Number(id) })
  },
}