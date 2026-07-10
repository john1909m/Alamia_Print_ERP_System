import { forwardRef, useEffect, useImperativeHandle } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
import { ar, MATERIAL_TYPE_LABELS } from '@/constants/ar'

const materialSchema = z.object({
  name: z.string().min(2, ar.shared.validation.nameMin),
  type: z.enum(['paper', 'ink', 'plate', 'chemical', 'glue', 'other'], {
    required_error: ar.shared.validation.typeRequired,
  }),
  unit: z.string().min(1, ar.shared.validation.unitRequired),
  minStock: z.coerce.number().min(0, ar.shared.validation.minStockMin),
  description: z.string().optional(),
})

const defaultValues = {
  name: '',
  type: 'paper',
  unit: '',
  minStock: 0,
  description: '',
}

export const MaterialForm = forwardRef(function MaterialForm(
  { defaultValues: initial, onSubmit },
  ref,
) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(materialSchema),
    defaultValues: { ...defaultValues, ...initial },
  })

  useEffect(() => {
    reset({ ...defaultValues, ...initial })
  }, [initial, reset])

  useImperativeHandle(ref, () => ({
    submit: () => handleSubmit(onSubmit)(),
  }), [handleSubmit, onSubmit])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField label={ar.materials.name} error={errors.name?.message} required>
        <Input {...register('name')} placeholder={ar.materials.namePlaceholder} />
      </FormField>
      <FormField label={ar.materials.type} error={errors.type?.message} required>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder={ar.materials.selectType} />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(MATERIAL_TYPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </FormField>
      <FormField label={ar.materials.unit} error={errors.unit?.message} required>
        <Input {...register('unit')} placeholder={ar.materials.unitPlaceholder} />
      </FormField>
      <FormField label={ar.materials.minStock} error={errors.minStock?.message} required>
        <Input {...register('minStock')} type="number" min={0} />
      </FormField>
      <FormField label={ar.materials.description} error={errors.description?.message}>
        <Textarea {...register('description')} placeholder={ar.materials.descriptionPlaceholder} rows={3} />
      </FormField>
    </form>
  )
})
