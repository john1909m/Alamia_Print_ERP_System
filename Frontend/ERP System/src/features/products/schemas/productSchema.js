// src/features/products/schemas/productSchema.js
import { z } from 'zod'

export function createProductSchema(messages) {
  return z.object({
    productCode: z.string().optional(),
    productName: z.string().min(1, messages.productNameRequired || 'Product name is required'),
    companyId: z.coerce.number().int().positive(messages.companyRequired || 'Company is required'),
    category: z.enum(['LEAFLET', 'BOX']).default('LEAFLET'),
    width: z.coerce.number().positive().optional(),      // ✅ جديد
    height: z.coerce.number().positive().optional(),     // ✅ جديد
    description: z.string().max(500).optional(),
    status: z.enum(['active', 'inactive']).default('active'),
  })
}

export const defaultProductValues = {
  productCode: '',
  productName: '',
  companyId: 0,
  category: 'LEAFLET',
  width: '',      // ✅ جديد
  height: '',     // ✅ جديد
  description: '',
  status: 'active',
}