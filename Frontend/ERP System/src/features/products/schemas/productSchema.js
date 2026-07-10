import { z } from 'zod'

export function createProductSchema(messages) {
  return z.object({
    productCode: z.string().min(1, messages.productCodeRequired),
    productName: z.string().min(1, messages.productNameRequired),
    companyId: z.number().int().positive(messages.companyRequired),
    category: z.string().min(1, messages.categoryRequired),
    description: z.string().optional(),
    status: z.enum(['active', 'inactive']).default('active'),
  })
}

export const defaultProductValues = {
  productCode: '',
  productName: '',
  companyId: 0, // will be overridden by actual value
  category: '',
  description: '',
  status: 'active',
}