import { z } from 'zod'

const phoneRegex = /^(\+20|0)?1[0125]\d{8}$/

export function createContactEntitySchema(messages) {
  return z.object({
    name: z.string().min(2, messages.nameMin),
    phone: z
      .string()
      .optional()
      .refine((val) => !val || phoneRegex.test(val.replace(/[\s-]/g, '')), {
        message: messages.phoneInvalid,
      }),
    email: z
      .string()
      .optional()
      .refine((val) => !val || z.string().email().safeParse(val).success, {
        message: messages.emailInvalid,
      }),
    address: z.string().optional(),
    notes: z.string().optional(),
  })
}

export const defaultContactValues = {
  name: '',
  phone: '',
  email: '',
  address: '',
  notes: '',
}
