import { z } from 'zod'

const phoneRegex = /^(\+20|0)?1[0125]\d{8}$/

export const createCompanySchema = (messages) => {
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
    managerName: z.string().min(2, messages.managerNameMin).max(100, messages.managerNameMax),
  })
}

export const defaultCompanyValues = {
  name: '',
  phone: '',
  email: '',
  address: '',
  notes: '',
  managerName: '',
}