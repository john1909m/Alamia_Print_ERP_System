import { forwardRef, useEffect, useImperativeHandle } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { FormField } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ar } from '@/constants/ar'
import { companiesMockData } from '@/features/companies/mock/companiesData'
import { createProductSchema, defaultProductValues } from '@/features/products/schemas/productSchema'

const schema = createProductSchema({
  productCodeRequired: ar.products.productCodeRequired,
  productNameRequired: ar.products.productNameRequired,
  companyRequired: ar.products.companyRequired,
  categoryRequired: ar.products.categoryRequired,
})

export const ProductForm = forwardRef(function ProductForm(
  { defaultValues, onSubmit },
  ref,
) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { ...defaultProductValues, ...defaultValues },
  })

  useEffect(() => {
    reset({ ...defaultProductValues, ...defaultValues })
  }, [defaultValues, reset])

  useImperativeHandle(
    ref,
    () => ({
      submit: () => handleSubmit(onSubmit)(),
    }),
    [handleSubmit, onSubmit],
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField label={ar.products.productCode} error={errors.productCode?.message} required>
        <Input {...register('productCode')} placeholder={ar.products.productCodePlaceholder} />
      </FormField>
      <FormField label={ar.products.productName} error={errors.productName?.message} required>
        <Input {...register('productName')} placeholder={ar.products.productNamePlaceholder} />
      </FormField>
      <FormField label={ar.products.companyName} error={errors.companyId?.message} required>
        <Controller
          control={control}
          name="companyId"
          render={({ field }) => (
            <Select
              value={field.value ? String(field.value) : ''}
              onValueChange={(value) => field.onChange(value ? Number(value) : 0)}
            >
              <SelectTrigger>
                <SelectValue placeholder={ar.products.selectCompany} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{ar.products.selectCompany}</SelectItem>
                {companiesMockData.map((company) => (
                  <SelectItem key={company.id} value={String(company.id)}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </FormField>
      <FormField label={ar.products.category} error={errors.category?.message} required>
        <Input {...register('category')} placeholder={ar.products.categoryPlaceholder} />
      </FormField>
      <FormField label={ar.products.description} error={errors.description?.message}>
        <Input {...register('description')} placeholder={ar.products.descriptionPlaceholder} />
      </FormField>
      <FormField label={ar.products.status} error={errors.status?.message}>
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder={ar.common.selectStatus} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">{ar.products.active}</SelectItem>
                <SelectItem value="inactive">{ar.products.inactive}</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </FormField>
    </form>
  )
})