/** @jsxImportSource react */
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { FormField } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ar } from '@/constants/ar'

// InkDto fields: inkType (string with max length), stock (no name field as per backend DTO)
const inkSchema = z.object({
  inkType: z.string().max(500, { message: 'Ink type must not exceed 500 characters' }).optional(),
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

const InkForm = ({ onSubmit, defaultValues }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(inkSchema),
    defaultValues: defaultValues || {
      inkType: '',
      stock: '',
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
          <FormField label={ar.materials.inkType}>
            <Input
              {...register('inkType')}
              placeholder={ar.materials.inkTypePlaceholder || 'Enter ink type'}
            />
            {errors.inkType && <span className="text-sm text-destructive">{errors.inkType.message}</span>}
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

export default InkForm