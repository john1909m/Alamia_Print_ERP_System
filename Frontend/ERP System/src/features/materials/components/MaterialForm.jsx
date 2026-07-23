import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
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
import { ar } from '@/constants/ar'
import { MATERIAL_TYPES, MATERIAL_UNITS } from '@/features/materials/utils/constants'

// Validation schema
const materialSchema = z.object({
  name: z.string().min(2, ar.shared.validation.nameMin),
  type: z.enum([...MATERIAL_TYPES.map(t => t.value)]),
  unit: z.enum([...MATERIAL_UNITS.map(u => u.value)]),
  // Common fields (from MaterialDto)
  stock: z.number().min(0),
  notes: z.string().max(500).optional(),
  // Paper-specific fields (maps to PaperDto)
  paperType: z.string().optional(),
  weight: z.number().positive().optional(),
  brightness: z.number().min(0).max(100).optional(),
  color: z.string().optional(),
  // Ink-specific fields (maps to InkDto)
  inkTypes: z.string().optional(),
  // Chemical-specific fields (maps to ChemicalDto)
  chemicalTypes: z.string().optional(),
})

// Refine to require paperType when type is PAPER (since PaperDto.name is required)
const paperRefined = materialSchema.refine(
  (data) => {
    if (data.type === 'PAPER') {
      return !!data.paperType
    }
    return true
  },
  {
    message: 'اسم الورق مطلوب عند اختيار نوع الورق',
    path: ['paperType'],
  }
)

const formSchema = paperRefined

const defaultValues = {
  name: '',
  type: 'PAPER',
  unit: 'KG',
  stock: 0,
  notes: '',
  paperType: '',
  weight: undefined,
  brightness: undefined,
  color: '',
  inkTypes: '',
  chemicalTypes: '',
}

export const MaterialForm = forwardRef(function MaterialForm(
  { defaultValues: initial, onSubmit },
  ref
) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { ...defaultValues, ...initial },
    mode: 'onBlur',
  })

  const type = watch('type')

  useEffect(() => {
    reset({ ...defaultValues, ...initial })
  }, [initial, reset])

  useImperativeHandle(ref, () => ({
    submit: () => handleSubmit(onSubmit)(),
  }), [handleSubmit, onSubmit])

  const handleSubmitWithSubtypes = async (data) => {
    // Extract subtype data based on type
    const { paperType, weight, brightness, color, inkTypes, chemicalTypes, ...materialData } = data

    let subtypeData = null
    if (type === 'PAPER') {
      subtypeData = {
        type: paperType,
        weight,
        brightness,
        color
        // material_id will be set by backend after material creation
      }
    } else if (type === 'INK') {
      subtypeData = {
        inkTypes: inkTypes.split(',').map(t => t.trim()).filter(t => t)
      }
    } else if (type === 'CHEMICAL') {
      subtypeData = {
        chemicalTypes: chemicalTypes.split(',').map(t => t.trim()).filter(t => t)
      }
    }
    // For ZINC, PLATE, GLUE, OTHER: no subtype data

    // Call onSubmit with materialData and subtypeData
    await onSubmit({ materialData, subtypeData, type })
  }

  return (
    <form onSubmit={handleSubmitWithSubtypes} className="space-y-6">
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

        <div>
          <FormField label={ar.materials.currentStock}>
            <Input
              type="number"
              {...register('stock')}
              placeholder={ar.materials.currentStock}
              min={0}
            />
            {errors.stock && <span className="text-sm text-destructive">{errors.stock.message}</span>}
          </FormField>
        </div>

        <div>
          <FormField label={ar.materials.description}>
            <Textarea
              {...register('notes')}
              placeholder={ar.materials.descriptionPlaceholder}
            />
            {errors.notes && <span className="text-sm text-destructive">{errors.notes.message}</span>}
          </FormField>
        </div>
      </div>

      {/* Conditional sections */}
      {type === 'PAPER' && (
        <div className="border-t pt-4">
          <fieldset className="space-y-4">
            <legend className="text-font-medium text-sm flex w-full items-center justify-between">
              <span className="flex items-center gap-2">
                <span>خصائص الورق</span>
              </span>
            </legend>
            <div className="space-y-2">
              <div>
                <FormField label={ar.materials.paperType}>
                  <Input
                    {...register('paperType')}
                    placeholder="مثال: لامع, مطفي"
                  />
                  {errors.paperType && <span className="text-sm text-destructive">{errors.paperType.message}</span>}
                </FormField>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <FormField label={ar.materials.weight}>
                    <Input
                      type="number"
                      {...register('weight')}
                      placeholder="مثال: 80"
                      min={0}
                      step={0.01}
                    />
                    {errors.weight && <span className="text-sm text-destructive">{errors.weight.message}</span>}
                  </FormField>
                </div>
                <div>
                  <FormField label={ar.materials.brightness}>
                    <Input
                      type="number"
                      {...register('brightness')}
                      placeholder="مثال: 95"
                      min={0}
                      max={100}
                      step={0.01}
                    />
                    {errors.brightness && <span className="text-sm text-destructive">{errors.brightness.message}</span>}
                  </FormField>
                </div>
              </div>
              <div>
                <FormField label={ar.materials.color}>
                  <Input
                    {...register('color')}
                    placeholder="مثال: أبيض"
                  />
                  {errors.color && <span className="text-sm text-destructive">{errors.color.message}</span>}
                </FormField>
              </div>
            </div>
          </fieldset>
        </div>
      )}

      {type === 'INK' && (
        <div className="border-t pt-4">
          <fieldset className="space-y-4">
            <legend className="text-font-medium text-sm flex w-full items-center justify-between">
              <span className="flex items-center gap-2">
                <span>خصائص الحبر</span>
              </span>
            </legend>
            <div>
              <FormField label={ar.materials.inkTypes}>
                <Input
                  {...register('inkTypes')}
                  placeholder="مثال: سياان، ماجنتي، أصفر، أسود (مفصولة بفواصل)"
                />
                {errors.inkTypes && <span className="text-sm text-destructive">{errors.inkTypes.message}</span>}
              </FormField>
            </div>
          </fieldset>
        </div>
      )}

      {type === 'CHEMICAL' && (
        <div className="border-t pt-4">
          <fieldset className="space-y-4">
            <legend className="text-font-medium text-sm flex w-full items-center justify-between">
              <span className="flex items-center gap-2">
                <span>خصائص الكيماويات</span>
              </span>
            </legend>
            <div>
              <FormField label={ar.materials.chemicalTypes}>
                <Input
                  {...register('chemicalTypes')}
                  placeholder="مثال: حمضي, قاعدي, مذيب (مفصولة بفواصل)"
                />
                {errors.chemicalTypes && <span className="text-sm text-destructive">{errors.chemicalTypes.message}</span>}
              </FormField>
            </div>
          </fieldset>
        </div>
      )}
    </form>
  )
})