import { useEffect, useMemo, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FormField } from '@/components/ui/label'
import { PurchaseItemsTable } from '@/features/purchases/components/PurchaseItemsTable'
import { PurchaseSummary } from '@/features/purchases/components/PurchaseSummary'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { suppliersMockData, materialsMockData } from '@/features/purchases/mock/purchasesData'

const itemSchema = z.object({
  materialId: z.number().min(1, 'Material is required'),
  quantity: z.number().min(1, 'Quantity must be greater than zero'),
  unit: z.string().min(1, 'Unit is required'),
  unitPrice: z.number().min(1, 'Unit price must be greater than zero'),
  totalPrice: z.number().optional(),
})

const purchaseSchema = z.object({
  supplierId: z.number({ required_error: 'Supplier is required' }).min(1, 'Supplier is required'),
  purchaseDate: z.string().min(1, 'Purchase date is required'),
  status: z.enum(['draft', 'completed', 'cancelled']),
  notes: z.string().optional(),
  items: z.array(itemSchema).min(1, 'At least one purchase item is required'),
})

const emptyItem = () => ({ materialId: '', quantity: 1, unit: '', unitPrice: 1, totalPrice: 1 })

export function PurchaseForm({ defaultValues, onSubmit }) {
  const [materials] = useState(materialsMockData)
  const [supplierOptions] = useState(suppliersMockData)
  const [itemErrors, setItemErrors] = useState({})

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      supplierId: defaultValues?.supplierId || '',
      purchaseDate: defaultValues?.purchaseDate || '',
      status: defaultValues?.status || 'draft',
      notes: defaultValues?.notes || '',
      items: defaultValues?.items?.length ? defaultValues.items.map((item) => ({ ...item, materialId: item.materialId || '' })) : [emptyItem()],
    },
  })

  const watchedItems = watch('items', [])
  const watchedSupplierId = watch('supplierId')

  useEffect(() => {
    reset({
      supplierId: defaultValues?.supplierId || '',
      purchaseDate: defaultValues?.purchaseDate || '',
      status: defaultValues?.status || 'draft',
      notes: defaultValues?.notes || '',
      items: defaultValues?.items?.length ? defaultValues.items.map((item) => ({ ...item, materialId: item.materialId || '' })) : [emptyItem()],
    })
  }, [defaultValues, reset])

  const summaryItems = useMemo(() => watchedItems.map((item) => ({ ...item, totalPrice: (Number(item.quantity || 0) * Number(item.unitPrice || 0)) })), [watchedItems])

  const updateItem = (index, field, value) => {
    const nextItems = [...watchedItems]
    nextItems[index] = { ...nextItems[index], [field]: value }

    if (field === 'materialId') {
      const selectedMaterial = materials.find((material) => material.id === Number(value))
      nextItems[index] = { ...nextItems[index], unit: selectedMaterial?.unit || '', materialName: selectedMaterial?.name || '' }
    }

    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = Number(nextItems[index].quantity || 0)
      const unitPrice = Number(nextItems[index].unitPrice || 0)
      nextItems[index].totalPrice = quantity * unitPrice
    }

    setValue('items', nextItems)
  }

  const addItem = () => {
    setValue('items', [...watchedItems, emptyItem()])
  }

  const removeItem = (index) => {
    const nextItems = watchedItems.filter((_, itemIndex) => itemIndex !== index)
    setValue('items', nextItems)
  }

  const handleFormSubmit = (values) => {
    const normalizedItems = values.items.map((item) => ({
      ...item,
      quantity: Number(item.quantity || 0),
      unitPrice: Number(item.unitPrice || 0),
      totalPrice: Number(item.quantity || 0) * Number(item.unitPrice || 0),
      materialName: materials.find((material) => material.id === Number(item.materialId))?.name || '',
    }))

    const errors = {}
    normalizedItems.forEach((item, index) => {
      if (!item.materialId) errors[index] = { ...errors[index], material: 'Material is required' }
      if (!item.quantity || item.quantity <= 0) errors[index] = { ...errors[index], quantity: 'Quantity must be greater than zero' }
      if (!item.unitPrice || item.unitPrice <= 0) errors[index] = { ...errors[index], unitPrice: 'Unit price must be greater than zero' }
    })
    setItemErrors(errors)

    if (Object.keys(errors).length > 0) return

    onSubmit({
      ...values,
      supplierId: Number(values.supplierId),
      status: values.status || 'draft',
      items: normalizedItems,
      supplierName: supplierOptions.find((supplier) => supplier.id === Number(values.supplierId))?.name || '',
    })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Purchase Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <FormField label="Supplier" error={errors.supplierId?.message} required>
                <Controller
                  name="supplierId"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value?.toString() || ''} onValueChange={(value) => field.onChange(Number(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        {supplierOptions.map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.id.toString()}>
                            {supplier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>

              <FormField label="Purchase Date" error={errors.purchaseDate?.message} required>
                <Input type="date" {...register('purchaseDate')} />
              </FormField>

              <FormField label="Status" error={errors.status?.message}>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>

              <FormField label="Notes" error={errors.notes?.message}>
                <Textarea {...register('notes')} rows={4} placeholder="Add notes for this purchase" />
              </FormField>
            </CardContent>
          </Card>

          <PurchaseItemsTable
            items={watchedItems}
            materials={materials}
            onChange={updateItem}
            onAdd={addItem}
            onRemove={removeItem}
            errors={itemErrors}
          />
        </div>

        <div className="space-y-6">
          <PurchaseSummary items={summaryItems} />
          <Card>
            <CardHeader>
              <CardTitle>Selected Supplier</CardTitle>
            </CardHeader>
            <CardContent>
              {watchedSupplierId ? (
                <div className="space-y-2 text-sm">
                  {supplierOptions.find((supplier) => supplier.id === Number(watchedSupplierId))?.name}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Choose a supplier to see details.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit">Save Purchase</Button>
      </div>
    </form>
  )
}
