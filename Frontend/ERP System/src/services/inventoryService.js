const inventory = [
  { id: 1, materialName: 'Couche Paper 80gsm', transactionType: 'purchase', quantity: 120, unit: 'Rim', reference: 'PO-2026-001', notes: 'Initial delivery for brochure production.', date: '2026-06-28', currentStock: 120, minStock: 50 },
  { id: 2, materialName: 'Couche Paper 135gsm', transactionType: 'consumption', quantity: 18, unit: 'Rim', reference: 'PR-2026-014', notes: 'Used in premium catalog jobs.', date: '2026-06-30', currentStock: 82, minStock: 40 },
  { id: 3, materialName: 'Bristol Paper', transactionType: 'adjustment', quantity: -4, unit: 'Rim', reference: 'ADJ-2026-003', notes: 'Cycle count correction.', date: '2026-07-01', currentStock: 22, minStock: 30 },
  { id: 4, materialName: 'Black Ink', transactionType: 'purchase', quantity: 25, unit: 'L', reference: 'PO-2026-002', notes: 'Replenishment for offset press.', date: '2026-07-02', currentStock: 45, minStock: 20 },
  { id: 5, materialName: 'Cyan Ink', transactionType: 'consumption', quantity: 7, unit: 'L', reference: 'PR-2026-017', notes: 'Consumed during brochure production.', date: '2026-07-03', currentStock: 8, minStock: 15 },
  { id: 6, materialName: 'Glue', transactionType: 'consumption', quantity: 6, unit: 'Kg', reference: 'PR-2026-021', notes: 'Binding and finishing usage.', date: '2026-07-06', currentStock: 6, minStock: 10 },
  { id: 7, materialName: 'Chemicals', transactionType: 'adjustment', quantity: -1, unit: 'L', reference: 'ADJ-2026-006', notes: 'Waste handling adjustment.', date: '2026-07-06', currentStock: 0, minStock: 8 },
]

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

export const inventoryService = {
  getAll: async () => {
    await delay()
    return Promise.resolve(inventory.map((item) => ({ ...item })))
  },
  getById: async (id) => {
    await delay()
    const item = inventory.find((entry) => entry.id === Number(id))
    return Promise.resolve(item ? { ...item } : null)
  },
  create: async (data) => {
    await delay()
    return Promise.resolve({ id: Date.now(), ...data, date: new Date().toISOString().split('T')[0] })
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
