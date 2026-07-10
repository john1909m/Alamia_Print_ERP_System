const materials = [
  { id: 1, name: 'Couche Paper 80gsm', type: 'paper', unit: 'Rim', minStock: 50, currentStock: 120, description: 'Premium coated paper for brochures and catalogs.', createdAt: '2026-06-10' },
  { id: 2, name: 'Couche Paper 135gsm', type: 'paper', unit: 'Rim', minStock: 40, currentStock: 82, description: 'Heavier stock for covers and premium print jobs.', createdAt: '2026-06-12' },
  { id: 3, name: 'Bristol Paper', type: 'paper', unit: 'Rim', minStock: 30, currentStock: 22, description: 'Board paper for cards and packaging.', createdAt: '2026-06-15' },
  { id: 4, name: 'Black Ink', type: 'ink', unit: 'L', minStock: 20, currentStock: 45, description: 'Offset black ink for standard production.', createdAt: '2026-06-18' },
  { id: 5, name: 'Cyan Ink', type: 'ink', unit: 'L', minStock: 15, currentStock: 8, description: 'Cyan process ink for CMYK jobs.', createdAt: '2026-06-20' },
  { id: 6, name: 'Plate', type: 'plate', unit: 'Pc', minStock: 10, currentStock: 35, description: 'Printing plates for flexographic runs.', createdAt: '2026-06-22' },
  { id: 7, name: 'Glue', type: 'glue', unit: 'Kg', minStock: 10, currentStock: 6, description: 'Binding adhesive for finishing operations.', createdAt: '2026-06-24' },
  { id: 8, name: 'Chemicals', type: 'chemical', unit: 'L', minStock: 8, currentStock: 0, description: 'Cleaning chemicals for press maintenance.', createdAt: '2026-06-26' },
]

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms))

export const materialService = {
  getAll: async () => {
    await delay()
    return Promise.resolve(materials.map((item) => ({ ...item })))
  },
  getById: async (id) => {
    await delay()
    const material = materials.find((m) => m.id === Number(id))
    return Promise.resolve(material ? { ...material } : null)
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
