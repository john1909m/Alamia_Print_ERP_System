import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FormField } from '@/components/ui/label'
import { ar } from '@/constants/ar'

// ChemicalDto fields: name, chemicalType (array of strings), notes
const chemicalSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  chemicalType: z
    .string()
    .transform((val) => {
      if (val === '') return []
      return val
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t)
    })
    .refine((arr) => arr.length <= 500, {
      message: 'يجب ألا يتجاوز عدد الأنواع 500', // "Must not exceed 500 types"
    }),
  notes: z.string().max(500).optional(),
})

const ChemicalForm = ({ onSubmit, defaultValues }) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodReducer(chemicalSchema),
    defaultValues: defaultValues || {
      name: '',
      chemicalType: '',
      notes: '',
    },
  })

  const handleSubmitWithValidation = async (data) => {
    try {
      await onSubmit(data)
    } catch (error) {
      console.error('Failed to submit chemical form:', error)
      throw error
    }
  }

  return (
    <form onSubmit={handleSubmit(handleSubmitWithValidation)} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FormField label={ar.materials.name}>
            <Input
              {...register('name')}
              placeholder={ar.materials.namePlaceholder}
            />
            {errors.name && <span className="text-sm text-destructive">{errors.name.message}</span>}
          </FormField>
        </div>

        <div>
          <FormField label={ar.materials.chemicalType}>
            <Input
              {...register('chemicalType')}
              placeholder={ar.materials.chemicalTypesPlaceholder || 'Enter chemical types (comma-separated)'}
            />
            {errors.chemicalType && <span className="text-sm text-destructive">{errors.chemicalType.message}</span>}
          </FormField>
        </div>

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
}

export default ChemicalForm