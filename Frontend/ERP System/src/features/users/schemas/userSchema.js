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
      .nullable()
      .transform((val) => {
        // لو القيمة فاضية أو null أو undefined => نرجع undefined عشان تترمى من الـ object
        if (!val || val.trim() === '') {
          return undefined
        }
        // لو فيها قيمة ننظفها من المسافات والـ dashes
        return val.replace(/[\s-]/g, '')
      })
      .refine((val) => !val || phoneRegex.test(val), {
        message: messages.phoneInvalid,
      }),
    password: z.string().min(6, messages.passwordMin),
    role: z.string().min(1, messages.roleRequired),
  })
}

export const defaultUserValues = {
  name: '',
  email: '',
  phoneNumber: '', // فاضية عادي
  password: '',
  role: '',
}

// ✅ الـ function اللي هتنضف الـ object قبل ما يتبعت للـ backend
export const sanitizeUserData = (data) => {
  const sanitized = { ...data }
  
  // نشيل أي key قيمتها null أو undefined أو empty string
  Object.keys(sanitized).forEach((key) => {
    const value = sanitized[key]
    if (
      value === null ||
      value === undefined ||
      value === '' ||
      (typeof value === 'string' && value.trim() === '')
    ) {
      delete sanitized[key]
    }
  })
  
  return sanitized
}