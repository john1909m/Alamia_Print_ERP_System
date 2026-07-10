import { companiesMockData } from '@/features/companies/mock/companiesData'

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

let store = companiesMockData.map((item) => ({ ...item }))

export const companyService = {
  getAll: async () => {
    await delay()
    return Promise.resolve(store.map((item) => ({ ...item })))
  },

  getById: async (id) => {
    await delay()
    const company = store.find((c) => c.id === Number(id))
    return Promise.resolve(company ? { ...company } : null)
  },

  create: async (data) => {
    await delay()
    const newCompany = {
      id: Date.now(),
      productsCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      ...data,
    }
    store = [newCompany, ...store]
    return Promise.resolve({ ...newCompany })
  },

  update: async (id, data) => {
    await delay()
    store = store.map((item) =>
      item.id === Number(id) ? { ...item, ...data, id: item.id } : item,
    )
    const updated = store.find((c) => c.id === Number(id))
    return Promise.resolve({ ...updated })
  },

  delete: async (id) => {
    await delay()
    store = store.filter((item) => item.id !== Number(id))
    return Promise.resolve({ success: true, id: Number(id) })
  },
}
