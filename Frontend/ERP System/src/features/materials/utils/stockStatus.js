export function getStockStatus(currentStock, minStock) {
  if (currentStock <= 0) return 'out-of-stock'
  if (currentStock <= minStock) return 'low-stock'
  return 'in-stock'
}

export function withStockStatus(material) {
  return {
    ...material,
    stockStatus: getStockStatus(material.currentStock, material.minStock),
  }
}
