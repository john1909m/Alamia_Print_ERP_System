// src/features/users/components/UserForm.jsx
import { useEffect, useImperativeHandle, forwardRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FormField } from '@/components/ui/label'
import { ar } from '@/constants/ar'
import { createUserSchema, defaultUserValues } from '@/features/users/schemas/userSchema'

export const UserForm = forwardRef(function UserForm(
  { defaultValues, nameLabel, namePlaceholder, onSubmit },
  ref,
) {
  const schema = createUserSchema(ar.shared.validation)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { ...defaultUserValues, ...defaultValues },
  })

  useEffect(() => {
    reset({ ...defaultUserValues, ...defaultValues })
  }, [defaultValues, reset])

  useImperativeHandle(ref, () => ({
    submit: () => handleSubmit(onSubmit)(),
  }), [handleSubmit, onSubmit])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField label={nameLabel} error={errors.name?.message} required>
        <Input {...register('name')} placeholder={namePlaceholder} />
      </FormField>
      <FormField label={ar.common.email} error={errors.email?.message}>
        <Input {...register('email')} type="email" placeholder="email@example.com" dir="ltr" />
      </FormField>
      <FormField label={ar.common.phone} error={errors.phoneNumber?.message}>
        <Input {...register('phoneNumber')} placeholder="+20 1xx xxx xxxx" dir="ltr" />
      </FormField>
      <FormField label={ar.common.password} error={errors.password?.message} required>
        <Input {...register('password')} type="password" placeholder="••••••••" />
      </FormField>
      <FormField label={ar.shared.managerName} error={errors.role?.message} required>
        {/* We'll use a select for role options */}
        <select {...register('role')} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="">اختر الدور</option>
          <option value="MANAGER">مدير</option>
          <option value="EMPLOYEE">موظف</option>
          <option value="ADMIN">مسؤول</option>
        </select>
      </FormField>
    </form>
  )
})