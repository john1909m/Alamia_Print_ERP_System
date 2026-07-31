import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { FormField } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const paperSchema = z.object({
  width: z.coerce.number().positive('العرض يجب أن يكون أكبر من 0'),
  height: z.coerce.number().positive('الارتفاع يجب أن يكون أكبر من 0'),
  weight: z.coerce.number().positive('الوزن يجب أن يكون أكبر من 0'),
  stock: z.coerce.number().min(0, 'المخزون يجب أن يكون أكبر من أو يساوي 0').default(0),
  notes: z.string().max(500).optional(),
})

const PaperForm = ({ onSubmit, defaultValues, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(paperSchema),
    defaultValues: defaultValues || {
      width: '',
      height: '',
      weight: '',
      stock: 0,
      notes: '',
    },
  })

  const handleSubmitWithValidation = async (data) => {
    try {
      await onSubmit(data)
      reset()
    } catch (error) {
      console.error('Failed to submit paper form:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleSubmitWithValidation)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="العرض">
          <Input type="number" {...register('width')} placeholder="أدخل العرض" step="0.01" />
          {errors.width && <span className="text-sm text-red-500">{errors.width.message}</span>}
        </FormField>

        <FormField label="الارتفاع">
          <Input type="number" {...register('height')} placeholder="أدخل الارتفاع" step="0.01" />
          {errors.height && <span className="text-sm text-red-500">{errors.height.message}</span>}
        </FormField>

        <FormField label="الوزن">
          <Input type="number" {...register('weight')} placeholder="أدخل الوزن" step="0.01" />
          {errors.weight && <span className="text-sm text-red-500">{errors.weight.message}</span>}
        </FormField>

        <FormField label="المخزون">
          <Input type="number" {...register('stock')} placeholder="أدخل المخزون" min="0" />
          {errors.stock && <span className="text-sm text-red-500">{errors.stock.message}</span>}
        </FormField>

        <div className="col-span-2">
          <FormField label="ملاحظات">
            <Input {...register('notes')} placeholder="أدخل ملاحظات (اختياري)" />
            {errors.notes && <span className="text-sm text-red-500">{errors.notes.message}</span>}
          </FormField>
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          {defaultValues?.id ? 'تحديث' : 'حفظ'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            إلغاء
          </Button>
        )}
      </div>
    </form>
  )
}

export default PaperForm