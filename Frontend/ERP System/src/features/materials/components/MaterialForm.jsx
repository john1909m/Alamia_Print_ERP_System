import { forwardRef, useEffect, useImperativeHandle } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
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
import { MATERIAL_TYPES, MATERIAL_UNITS } from '@/features/materials/utils/constants'

// Validation schema - only MaterialDto fields (stock removed as per requirement)
const materialSchema = z.object({
  name: z.string().min(2, ar.shared.validation.nameMin),
  type: z.enum([...MATERIAL_TYPES.map(t => t.value)]),
  unit: z.enum([...MATERIAL_UNITS.map(u => u.value)]),
  // Removed stock field
  notes: z.string().max(500).optional(),
})

const formSchema = materialSchema

const defaultValues = {
  name: '',
  type: 'PAPER',
  unit: 'KG',
  // Removed stock
  notes: '',
}

export const MaterialForm = forwardRef(function MaterialForm(
  { defaultValues: initialData, onSubmit },
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
    defaultValues: { ...defaultValues, ...(initialData || {}) },
    mode: 'onBlur',
  })

  useEffect(() => {
    reset({ ...defaultValues, ...(initialData || {}) })
  }, [initialData, reset])

  useImperativeHandle(ref, () => ({
    submit: () => handleSubmit(onSubmit)(),
  }), [handleSubmit, onSubmit])

  const handleSubmitSimple = async (data) => {
    // Submit only the material data (no transformation needed)
    try {
      await onSubmit(data)
    } catch (error) {
      console.error('Failed to submit form:', error)
      throw error
    }
  }

  return (
    <form onSubmit={handleSubmitSimple} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="col-span-2">
          <FormField label={ar.materials.name}>
            <Input
              {...register('name')}
              placeholder={ar.materials.namePlaceholder}
            />
            {errors.name && <span className="text-sm text-destructive">{errors.name.message}</span>}
          </FormField>
        </div>

        <div>
          <FormField label={ar.materials.type}>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={ar.materials.selectType} />
                  </SelectTrigger>
                  <SelectContent>
                    {MATERIAL_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type && <span className="text-sm text-destructive">{errors.type.message}</span>}
          </FormField>
        </div>

        <div>
          <FormField label={ar.materials.unit}>
            <Controller
              name="unit"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={ar.materials.unitPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {MATERIAL_UNITS.map((u) => (
                      <SelectItem key={u.value} value={u.value}>
                        {u.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.unit && <span className="text-sm text-destructive">{errors.unit.message}</span>}
          </FormField>
        </div>

        {/* Stock field removed */}

        <div className="col-span-2">
          <FormField label={ar.materials.description}>
            <Textarea
              {...register('notes')}
              placeholder={ar.materials.descriptionPlaceholder}
            />
            {errors.notes && <span className="text-sm text-destructive">{errors.notes.message}</span>}
          </FormField>
        </div>
      </div>
    </form>
  )
})