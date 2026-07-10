import { products } from '@/data/mockData'

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

export const productService = {
  getAll: async () => {
    await delay()
    return Promise.resolve([...products])
  },
  getById: async (id) => {
    await delay()
    const product = products.find((p) => p.id === Number(id))
    return Promise.resolve(product || null)
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
