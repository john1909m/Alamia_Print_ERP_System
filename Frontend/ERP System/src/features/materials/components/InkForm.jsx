/** @jsxImportSource react */
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FormField } from '@/components/ui/label'
import { ar } from '@/constants/ar'

// InkDto fields: name, inkType (array of strings), notes
const inkSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  inkType: z
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

const InkForm = ({ onSubmit, defaultValues }) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(inkSchema),
    defaultValues: defaultValues || {
      name: '',
      inkType: '',
      notes: '',
    },
  })

  const handleSubmitWithValidation = async (data) => {
    try {
      await onSubmit(data)
    } catch (error) {
      console.error('Failed to submit ink form:', error)
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
          <FormField label={ar.materials.inkType}>
            <Input
              {...register('inkType')}
              placeholder={ar.materials.inkTypesPlaceholder || 'Enter ink types (comma-separated)'}
            />
            {errors.inkType && <span className="text-sm text-destructive">{errors.inkType.message}</span>}
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

export default InkForm