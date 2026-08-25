// src/features/users/schemas/userSchema.js
import { z } from 'zod'

const phoneRegex = /^(\+20|0)?1[0125]\d{8}$/

export const createUserSchema = (messages) => {
  return z.object({
    name: z.string().min(2, messages.nameMin),
    email: z.string().email(messages.emailInvalid),
    phoneNumber: z
      .string()
      .optional()
      .refine((val) => !val || phoneRegex.test(val.replace(/[\s-]/g, '')), {
        message: messages.phoneInvalid,
      }),
    password: z.string().min(6, messages.passwordMin),
    role: z.string().min(1, messages.roleRequired),
  })
}

export const defaultUserValues = {
  name: '',
  email: '',
  phoneNumber: '',
  password: '',
  role: '',
}