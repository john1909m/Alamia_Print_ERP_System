import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FormField } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ar } from '@/constants/ar'

// PaperDto fields: name, paperType, width, height, brightness, color, weight, notes
const paperSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  paperType: z.string().min(1, 'Paper Type is required'),
  width: z
    .preprocess((val) => {
      if (val === '' || val === null || val === undefined) return undefined
      const num = parseFloat(val)
      return isNaN(num) ? undefined : num
    })
    .refine((val) => val === undefined || val > 0, {
      message: 'Width must be greater than 0',
    }),
  height: z
    .preprocess((val) => {
      if (val === '' || val === null || val === undefined) return undefined
      const num = parseFloat(val)
      return isNaN(num) ? undefined : num
    })
    .refine((val) => val === undefined || val > 0, {
      message: 'Height must be greater than 0',
    }),
  brightness: z
    .preprocess((val) => {
      if (val === '' || val === null || val === undefined) return undefined
      const num = parseFloat(val)
      return isNaN(num) ? undefined : num
    })
    .refine((val) => val === undefined || (val >= 0 && val <= 100), {
      message: 'Brightness must be between 0 and 100',
    }),
  color: z.string().optional(),
  weight: z
    .preprocess((val) => {
      if (val === '' || val === null || val === undefined) return undefined
      const num = parseFloat(val)
      return isNaN(num) ? undefined : num
    })
    .refine((val) => val === undefined || val > 0, {
      message: 'Weight must be greater than 0',
    }),
  notes: z.string().max(500).optional(),
})

const PaperForm = ({ onSubmit, defaultValues }) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(paperSchema),
    defaultValues: defaultValues || {
      name: '',
      paperType: '',
      width: '',
      height: '',
      brightness: '',
      color: '',
      weight: '',
      notes: '',
    },
  })

  const handleSubmitWithValidation = async (data) => {
    try {
      await onSubmit(data)
    } catch (error) {
      console.error('Failed to submit paper form:', error)
      throw error
    }
  }

  return (
    <form onSubmit={handleSubmitWithValidation} className="space-y-6">
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
          <FormField label={ar.materials.paperType}>
            <Input
              {...register('paperType')}
              placeholder={ar.materials.paperTypePlaceholder || 'Enter paper type'}
            />
            {errors.paperType && <span className="text-sm text-destructive">{errors.paperType.message}</span>}
          </FormField>
        </div>

        <div>
          <FormField label={ar.materials.width}>
            <Input
              type="number"
              {...register('width')}
              placeholder={ar.materials.widthPlaceholder || 'Enter width'}
              min="0"
              step="0.01"
            />
            {errors.width && <span className="text-sm text-destructive">{errors.width.message}</span>}
          </FormField>
        </div>

        <div>
          <FormField label={ar.materials.height}>
            <Input
              type="number"
              {[register('height')]}
              placeholder={ar.materials.heightPlaceholder || 'Enter height'}
              min="0"
              step="0.01"
            />
            {errors.height && <span className="text-sm text-destructive">{errors.height.message}</span>}
          </FormField>
        </div>

        <div>
          <FormField label={ar.materials.brightness}>
            <Input
              type="number"
              {...register('brightness')}
              placeholder={ar.materials.brightnessPlaceholder || 'Enter brightness (0-100)'}
              min="0"
              max="100"
            />
            {errors.brightness && <span className="text-sm text-destructive">{errors.brightness.message}</span>}
          </FormField>
        </div>

        <div>
          <FormField label={ar.materials.color}>
            <Input
              {...register('color')}
              placeholder={ar.materials.colorPlaceholder || 'Enter color'}
            />
            {errors.color && <span className="text-sm text-destructive">{errors.color.message}</span>}
          </FormField>
        </div>

        <div>
          <FormField label={ar.materials.weight}>
            <Input
              type="number"
              {...register('weight')}
              placeholder={ar.materials.weightPlaceholder || 'Enter weight'}
              min="0"
              step="0.01"
            />
            {errors.weight && <span className="text-sm text-destructive">{errors.weight.message}</span>}
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

export default PaperForm