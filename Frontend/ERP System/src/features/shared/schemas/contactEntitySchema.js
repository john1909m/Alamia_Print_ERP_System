import { z } from 'zod'

export function createContactEntitySchema(messages) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(1, 'الاسم مطلوب')
      .max(100, 'الاسم يجب ألا يتجاوز 100 أحرف'),
    email: z
      .string()
      .trim()
      .min(1, 'البريد الإلكتروني مطلوب')
      .email(messages.emailInvalid)
      .max(100, 'البريد الإلكتروني يجب ألا يتجاوز 100 أحرف'),
    phone: z
      .string()
      .trim()
      .max(20, 'رقم الهاتف يجب ألا يتجاوز 20 أحرف')
      .optional(),
    address: z
      .string()
      .trim()
      .min(1, 'العنوان مطلوب')
      .max(200, 'العنوان يجب ألا يتجاوز 200 أحرف'),
    notes: z
      .string()
      .trim()
      .max(500, 'الملاحظات يجب ألا يتجاوز 500 أحرف')
      .optional(),
    type: z.enum(['PAPER', 'INK', 'CHEMICAL', 'ZINC']).optional(),
  })
}

export const defaultContactValues = {
  name: '',
  phone: '',
  email: '',
  address: '',
  notes: '',
  type: undefined,
}