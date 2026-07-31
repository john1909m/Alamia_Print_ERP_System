import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { FormField } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const chemicalSchema = z.object({
  chemicalType: z.string().max(500).optional(),
  stock: z.coerce.number().min(0, 'المخزون يجب أن يكون أكبر من أو يساوي 0').default(0),
  notes: z.string().max(500).optional(),
})

const ChemicalForm = ({ onSubmit, defaultValues, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(chemicalSchema),
    defaultValues: defaultValues || {
      chemicalType: '',
      stock: 0,
      notes: '',
    },
  })

  const handleSubmitWithValidation = async (data) => {
    try {
      await onSubmit(data)
      reset()
    } catch (error) {
      console.error('Failed to submit chemical form:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleSubmitWithValidation)} className="space-y-4">
      <FormField label="نوع المادة الكيميائية">
        <Input {...register('chemicalType')} placeholder="أدخل نوع المادة الكيميائية" />
        {errors.chemicalType && <span className="text-sm text-red-500">{errors.chemicalType.message}</span>}
      </FormField>

      <FormField label="المخزون">
        <Input type="number" {...register('stock')} placeholder="أدخل المخزون" min="0" />
        {errors.stock && <span className="text-sm text-red-500">{errors.stock.message}</span>}
      </FormField>

      <FormField label="ملاحظات">
        <Input {...register('notes')} placeholder="أدخل ملاحظات (اختياري)" />
        {errors.notes && <span className="text-sm text-red-500">{errors.notes.message}</span>}
      </FormField>

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

export default ChemicalForm