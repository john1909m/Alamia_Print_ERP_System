import { productionOrders } from '@/data/mockData'

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

export const productionService = {
  getAll: async () => {
    await delay()
    return Promise.resolve([...productionOrders])
  },
  getById: async (id) => {
    await delay()
    const order = productionOrders.find((o) => o.id === Number(id))
    return Promise.resolve(order || null)
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
