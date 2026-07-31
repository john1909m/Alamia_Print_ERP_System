// src/features/products/components/ProductForm.jsx
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
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
import { companyService } from '@/features/companies/services/companyService'
import { createProductSchema, defaultProductValues } from '@/features/products/schemas/productSchema'

const schema = createProductSchema({
  productNameRequired: ar.products?.productNameRequired || 'Product name is required',
  companyRequired: ar.products?.companyRequired || 'Company is required',
})

export const ProductForm = forwardRef(function ProductForm(
  { defaultValues, onSubmit, onCancel },
  ref,
) {
  const [companyOptions, setCompanyOptions] = useState([])
  const [loadingCompanies, setLoadingCompanies] = useState(true)

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        setLoadingCompanies(true)
        const companies = await companyService.getAll()
        setCompanyOptions(companies || [])
      } catch (error) {
        console.error('Failed to load companies', error)
      } finally {
        setLoadingCompanies(false)
      }
    }

    loadCompanies()
  }, [])

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
      <FormField 
        label={ar.products?.productName || 'Product Name'} 
        error={errors.productName?.message} 
        required
      >
        <Input 
          {...register('productName')} 
          placeholder={ar.products?.productNamePlaceholder || 'Enter product name'} 
        />
      </FormField>

      <FormField 
        label={ar.products?.productCode || 'Product Code'} 
        error={errors.productCode?.message}
      >
        <Input 
          {...register('productCode')} 
          placeholder={ar.products?.productCodePlaceholder || 'Enter product code (optional)'} 
        />
      </FormField>

      <FormField 
        label={ar.common?.company || 'Company'} 
        error={errors.companyId?.message} 
        required
      >
        <Controller
          control={control}
          name="companyId"
          render={({ field }) => (
            <Select
              value={field.value ? String(field.value) : ''}
              onValueChange={(value) => field.onChange(value ? Number(value) : 0)}
            >
              <SelectTrigger>
                <SelectValue placeholder={ar.products?.selectCompany || 'Select company'} />
              </SelectTrigger>
              <SelectContent>
                {loadingCompanies ? (
                  <SelectItem value="" disabled>Loading...</SelectItem>
                ) : (
                  <>
                    <SelectItem value="">{ar.products?.selectCompany || 'Select company'}</SelectItem>
                    {companyOptions.map((company) => (
                      <SelectItem key={company.id} value={String(company.id)}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </>
                )}
              </SelectContent>
            </Select>
          )}
        />
      </FormField>

      {/* حقل نوع المنتج - Enum من الـ Backend */}
      <FormField 
        label={ar.products?.productType || 'Product Type'} 
        error={errors.category?.message}
        required
      >
        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <Select value={field.value || 'LEAFLET'} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder={ar.products?.selectType || 'Select product type'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LEAFLET">{ar.products?.leaflet || 'Leaflet'}</SelectItem>
                <SelectItem value="BOX">{ar.products?.box || 'Box'}</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </FormField>

      <FormField 
        label={ar.products?.description || 'Description'} 
        error={errors.description?.message}
      >
        <Input 
          {...register('description')} 
          placeholder={ar.products?.descriptionPlaceholder || 'Enter description (optional)'} 
        />
      </FormField>

      <FormField 
        label={ar.common?.status || 'Status'} 
        error={errors.status?.message}
      >
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder={ar.common?.selectStatus || 'Select status'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">{ar.products?.active || 'Active'}</SelectItem>
                <SelectItem value="inactive">{ar.products?.inactive || 'Inactive'}</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </FormField>

      <div className="flex gap-2 pt-2">
        <button type="submit" className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          {defaultValues?.id ? 'تحديث' : 'حفظ'}
        </button>
        {onCancel && (
          <button type="button" className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400" onClick={onCancel}>
            إلغاء
          </button>
        )}
      </div>
    </form>
  )
})