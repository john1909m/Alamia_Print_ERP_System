import { useEffect, useImperativeHandle, forwardRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FormField } from '@/components/ui/label'
import { ar } from '@/constants/ar'
import { createCompanySchema, defaultCompanyValues } from '@/features/companies/schemas/companySchema'

export const CompanyForm = forwardRef(function CompanyForm(
  { defaultValues, nameLabel, namePlaceholder, onSubmit },
  ref,
) {
  const schema = createCompanySchema(ar.shared.validation)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { ...defaultCompanyValues, ...defaultValues },
  })

  useEffect(() => {
    reset({ ...defaultCompanyValues, ...defaultValues })
  }, [defaultValues, reset])

  useImperativeHandle(ref, () => ({
    submit: () => handleSubmit(onSubmit)(),
  }), [handleSubmit, onSubmit])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField label={nameLabel} error={errors.name?.message} required>
        <Input {...register('name')} placeholder={namePlaceholder} />
      </FormField>
      <FormField label={ar.common.phone} error={errors.phone?.message}>
        <Input {...register('phone')} placeholder="+20 1xx xxx xxxx" dir="ltr" />
      </FormField>
      <FormField label={ar.common.email} error={errors.email?.message}>
        <Input {...register('email')} type="email" placeholder="email@example.com" dir="ltr" />
      </FormField>
      <FormField label={ar.common.address} error={errors.address?.message}>
        <Input {...register('address')} placeholder={ar.shared.addressPlaceholder} />
      </FormField>
      <FormField label={ar.shared.managerName} error={errors.managerName?.message} required>
        <Input {...register('managerName')} placeholder={ar.shared.managerNamePlaceholder} />
      </FormField>
      <FormField label={ar.common.notes} error={errors.notes?.message}>
        <Textarea {...register('notes')} placeholder={ar.shared.notesPlaceholder} rows={3} />
      </FormField>
    </form>
  )
})