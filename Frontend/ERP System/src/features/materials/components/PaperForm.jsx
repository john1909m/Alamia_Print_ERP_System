// src/features/materials/components/PaperForm.jsx
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { FormField } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const paperSchema = z.object({
  paperType: z.enum(['WHITE', 'COATED', 'BRISTOL_COATED', 'STICKER', 'DUPLEX']).default('WHITE'),
  width: z.coerce.number().positive('العرض يجب أن يكون أكبر من 0'),
  height: z.coerce.number().positive('الارتفاع يجب أن يكون أكبر من 0'),
  weight: z.coerce.number().positive('الوزن يجب أن يكون أكبر من 0'),
  stock: z.coerce.number().min(0, 'المخزون يجب أن يكون أكبر من أو يساوي 0').default(0),
  notes: z.string().max(500).optional(),
})

const PaperForm = ({ onSubmit, defaultValues, onCancel }) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(paperSchema),
    defaultValues: defaultValues || {
      paperType: 'WHITE',
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

  // دالة للحصول على التسمية العربية لنوع الورق
  const getPaperTypeLabel = (type) => {
    const labels = {
      'WHITE': 'أبيض',
      'COATED': 'مغطى',
      'BRISTOL_COATED': 'بريستول مغطى',
      'STICKER': 'ستيكر',
      'DUPLEX': 'دوبلكس',
    }
    return labels[type] || type
  }

  return (
    <form onSubmit={handleSubmit(handleSubmitWithValidation)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* نوع الورق - جديد */}
        <div className="col-span-2">
          <FormField label="نوع الورق" error={errors.paperType?.message} required>
            <Controller
              control={control}
              name="paperType"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع الورق" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WHITE">أبيض</SelectItem>
                    <SelectItem value="COATED">مغطى</SelectItem>
                    <SelectItem value="BRISTOL_COATED">بريستول مغطى</SelectItem>
                    <SelectItem value="STICKER">ستيكر</SelectItem>
                    <SelectItem value="DUPLEX">دوبلكس</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>
        </div>

        <FormField label="العرض" error={errors.width?.message} required>
          <Input type="number" {...register('width')} placeholder="أدخل العرض" step="0.01" />
        </FormField>

        <FormField label="الارتفاع" error={errors.height?.message} required>
          <Input type="number" {...register('height')} placeholder="أدخل الارتفاع" step="0.01" />
        </FormField>

        <FormField label="الوزن" error={errors.weight?.message} required>
          <Input type="number" {...register('weight')} placeholder="أدخل الوزن" step="0.01" />
        </FormField>

        <FormField label="المخزون" error={errors.stock?.message} required>
          <Input type="number" {...register('stock')} placeholder="أدخل المخزون" min="0" />
        </FormField>

        <div className="col-span-2">
          <FormField label="ملاحظات" error={errors.notes?.message}>
            <Input {...register('notes')} placeholder="أدخل ملاحظات (اختياري)" />
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