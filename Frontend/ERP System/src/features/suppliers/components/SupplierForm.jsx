import { forwardRef, useEffect, useImperativeHandle } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FormField } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ar } from '@/constants/ar'
import {
  createContactEntitySchema,
  defaultContactValues,
} from '@/features/shared/schemas/contactEntitySchema'

const schema = createContactEntitySchema(ar.shared.validation)

export const SupplierForm = forwardRef(function SupplierForm(
  { defaultValues, nameLabel, namePlaceholder, onSubmit },
  ref,
) {
  const {
    control,
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { ...defaultContactValues, ...defaultValues },
  })

  useEffect(() => {
    reset({ ...defaultContactValues, ...defaultValues })
  }, [defaultValues, reset])

  useImperativeHandle(ref, () => ({
    submit: () => handleSubmit(onSubmit)(),
  }), [handleSubmit, onSubmit])

  // Supplier type options (Arabic labels)
  const typeOptions = [
    { value: 'PAPER', label: 'ورق' },
    { value: 'INK', label: 'حبر' },
    { value: 'CHEMICAL', label: 'كيماويات' },
    { value: 'ZINC', label: 'زنك' },
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField label={nameLabel} error={errors.name?.message} required>
        <Input {...register('name')} placeholder={namePlaceholder} />
      </FormField>
      <FormField label={ar.common.phone} error={errors.phone?.message}>
        <Input {...register('phone')} placeholder="+20 1xx xxx xxxx" dir="ltr" />
      </FormField>
      <FormField label={ar.common.email} error={errors.email?.message} required>
        <Input {...register('email')} type="email" placeholder="email@example.com" dir="ltr" />
      </FormField>
      <FormField label={ar.common.address} error={errors.address?.message} required>
        <Input {...register('address')} placeholder={ar.shared.addressPlaceholder} />
      </FormField>
      <FormField label={ar.common.notes} error={errors.notes?.message}>
        <Textarea {...register('notes')} placeholder={ar.shared.notesPlaceholder} rows={3} />
      </FormField>
      <FormField label="نوع المورد" error={errors.type?.message}>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر النوع" />
              </SelectTrigger>
              <SelectContent>
                {typeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </FormField>
    </form>
  )
})