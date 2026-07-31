import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ar } from '@/constants/ar'

const materialSchema = z.object({
  name: z.string().min(2, { message: ar.shared?.validation?.nameMin || 'Name must be at least 2 characters' }),
  type: z.enum(['PAPER', 'INK', 'CHEMICAL', 'ZINC', 'PLATE', 'GLUE', 'OTHER']),
  unit: z.enum(['SHEET', 'KG', 'LITER', 'PIECE', 'METER', 'ROLL']),
  notes: z.string().max(500).optional()
})

const MaterialForm = ({ onSubmit, defaultValues, onCancel }) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(materialSchema),
    defaultValues: defaultValues || {
      name: '',
      type: 'PAPER',
      unit: 'KG',
      notes: '',
    },
  })

  const handleSubmitWithValidation = async (data) => {
    try {
      await onSubmit(data)
      reset()
    } catch (error) {
      console.error('Failed to submit material form:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleSubmitWithValidation)} className="space-y-4">
      <div className="grid gap-4">
        <FormField label={ar.materials?.name || 'Name'}>
          <Input {...register('name')} placeholder="Enter material name" />
          {errors.name && <span className="text-sm text-red-500">{errors.name.message}</span>}
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label={ar.materials?.type || 'Type'}>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PAPER">Paper</SelectItem>
                    <SelectItem value="INK">Ink</SelectItem>
                    <SelectItem value="CHEMICAL">Chemical</SelectItem>
                    <SelectItem value="ZINC">Zinc</SelectItem>
                    <SelectItem value="PLATE">Plate</SelectItem>
                    <SelectItem value="GLUE">Glue</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type && <span className="text-sm text-red-500">{errors.type.message}</span>}
          </FormField>

          <FormField label={ar.materials?.unit || 'Unit'}>
            <Controller
              name="unit"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SHEET">Sheet</SelectItem>
                    <SelectItem value="KG">KG</SelectItem>
                    <SelectItem value="LITER">Liter</SelectItem>
                    <SelectItem value="PIECE">Piece</SelectItem>
                    <SelectItem value="METER">Meter</SelectItem>
                    <SelectItem value="ROLL">Roll</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.unit && <span className="text-sm text-red-500">{errors.unit.message}</span>}
          </FormField>
        </div>

        <FormField label={ar.materials?.description || 'Notes'}>
          <Textarea {...register('notes')} placeholder="Enter notes (optional)" rows={3} />
          {errors.notes && <span className="text-sm text-red-500">{errors.notes.message}</span>}
        </FormField>

        <div className="flex gap-2 pt-2">
          <Button type="submit" className="flex-1">
            {defaultValues?.id ? 'Update' : 'Save'}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
          )}
        </div>
      </div>
    </form>
  )
}

export default MaterialForm