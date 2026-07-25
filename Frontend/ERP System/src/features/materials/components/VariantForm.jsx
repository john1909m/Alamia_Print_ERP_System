import { forwardRef, useEffect, useImperativeHandle } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FormField } from '@/components/ui/label'
import { ar } from '@/constants/ar'

// Validation schema - only VariantDto fields
const variantSchema = z.object({
  materialId: z.string(),
  specification: z.string().min(1, 'Specification is required'),
  stock: z.number().min(0, 'Stock must be at least 0'),
})

const formSchema = variantSchema

const defaultValues = {
  materialId: '',
  specification: '',
  stock: 0,
}

export const VariantForm = forwardRef(function VariantForm(
  { defaultValues: initial, onSubmit, materialId },
  ref
) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { ...defaultValues, ...initial },
    mode: 'onBlur',
  })

  useEffect(() => {
    reset({ ...defaultValues, ...initial })
  }, [initial, reset])

  useImperativeHandle(ref, () => ({
    submit: () => handleSubmit(onSubmit)(),
  }), [handleSubmit, onSubmit])

  const handleSubmitSimple = async (data) => {
    // Submit only variant data
    await onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmitSimple} className="space-y-6">
      {/* Conditionally render materialId field */}
      {!materialId && (
        <div>
          {/* We don't have a material select because we are only creating variants from a material row.
              If we need to support standalone variant creation, we would add a material select here.
              But per requirements, material_id is injected automatically, so we hide it when materialId is provided.
              If materialId is not provided (fallback), we show a placeholder? We'll leave it out for now and assume materialId is always provided in our usage.
          */}
          <div className="text-sm text-muted-foreground">
            Material ID: {initial.materialId || 'Not provided'}
          </div>
        </div>
      )}
      {materialId && (
        <input
          type="hidden"
          {...register('materialId')}
          defaultValue={materialId}
        />
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="col-span-2">
          <FormField label={ar.materials.specification || 'Specification'}>
            <Input
              {...register('specification')}
              placeholder="Enter specification (e.g., 60 GSM, Red, etc.)"
            />
            {errors.specification && <span className="text-sm text-destructive">{errors.specification.message}</span>}
          </FormField>
        </div>

        <div>
          <FormField label={ar.materials.currentStock || 'Stock'}>
            <Input
              type="number"
              {...register('stock')}
              placeholder="Enter stock"
              min={0}
            />
            {errors.stock && <span className="text-sm text-destructive">{errors.stock.message}</span>}
          </FormField>
        </div>
      </div>
    </form>
  )
})