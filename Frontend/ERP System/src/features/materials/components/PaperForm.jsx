import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { FormField } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ar } from '@/constants/ar'

// PaperDto fields: material_id, width, height, weight, notes, stock, orders (no name field as per backend DTO)
const paperSchema = z.object({
  width: z
    .preprocess((val) => {
      if (val === '' || val === null || val === undefined) {
        return undefined
      }
      const num = parseFloat(val)
      return isNaN(num) ? undefined : num
    })
    .refine((val) => {
      return val === undefined || val > 0
    }, {
      message: 'Width must be greater than 0',
    }),
  height: z
    .preprocess((val) => {
      if (val === '' || val === null || val === undefined) {
        return undefined
      }
      const num = parseFloat(val)
      return isNaN(num) ? undefined : num
    })
    .refine((val) => {
      return val === undefined || val > 0
    }, {
      message: 'Height must be greater than 0',
    }),
  weight: z
    .preprocess((val) => {
      if (val === '' || val === null || val === undefined) {
        return undefined
      }
      const num = parseFloat(val)
      return isNaN(num) ? undefined : num
    })
    .refine((val) => {
      return val === undefined || val > 0
    }, {
      message: 'Weight must be greater than 0',
    }),
  notes: z.string().max(500, { message: 'Notes must not exceed 500 characters' }).optional(),
  stock: z
    .preprocess((val) => {
      if (val === '' || val === null || val === undefined) {
        return undefined
      }
      const num = parseInt(val)
      return isNaN(num) ? undefined : num
    })
    .refine((val) => {
      return val === undefined || val >= 0
    }, {
      message: 'Stock must be a non-negative integer',
    })
})

const PaperForm = ({ onSubmit, defaultValues }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(paperSchema),
    defaultValues: defaultValues || {
      width: '',
      height: '',
      weight: '',
      notes: '',
      stock: '',
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
    <form onSubmit={handleSubmit(handleSubmitWithValidation)} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
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
              {...register('height')}
              placeholder={ar.materials.heightPlaceholder || 'Enter height'}
              min="0"
              step="0.01"
            />
            {errors.height && <span className="text-sm text-destructive">{errors.height.message}</span>}
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

        <div>
          <FormField label={ar.materials.notes}>
            <Input
              {...register('notes')}
              placeholder={ar.materials.notesPlaceholder || 'Enter notes (optional)'}
            />
            {errors.notes && <span className="text-sm text-destructive">{errors.notes.message}</span>}
          </FormField>
        </div>

        <div>
          <FormField label={ar.materials.stock}>
            <Input
              type="number"
              {...register('stock')}
              placeholder={ar.materials.stockPlaceholder || 'Enter stock quantity'}
              min="0"
            />
            {errors.stock && <span className="text-sm text-destructive">{errors.stock.message}</span>}
          </FormField>
        </div>

        <div className="col-span-2">
          <Button type="submit" className="w-full">
            Save
          </Button>
        </div>
      </div>
    </form>
  )
}

export default PaperForm