import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Trash2 } from 'lucide-react'

export function PurchaseItemsTable({ items, materials, onChange, onAdd, onRemove, errors = {} }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Purchase Items</CardTitle>
        <Button type="button" onClick={onAdd}>
          <Plus className="ms-2 h-4 w-4" />
          Add Item
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item, index) => (
          <div key={item.id || index} className="rounded-lg border p-4">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              <div className="space-y-2 xl:col-span-2">
                <label className="text-sm font-medium">Material</label>
                <Select value={item.materialId?.toString() || ''} onValueChange={(value) => onChange(index, 'materialId', Number(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select material" />
                  </SelectTrigger>
                  <SelectContent>
                    {materials.map((material) => (
                      <SelectItem key={material.id} value={material.id.toString()}>
                        {material.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Quantity</label>
                <Input type="number" min="1" value={item.quantity || ''} onChange={(event) => onChange(index, 'quantity', Number(event.target.value))} />
                {errors?.[index]?.quantity && <p className="text-sm text-destructive">{errors[index].quantity}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Unit</label>
                <Input value={item.unit || ''} onChange={(event) => onChange(index, 'unit', event.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Unit Price</label>
                <Input type="number" min="1" value={item.unitPrice || ''} onChange={(event) => onChange(index, 'unitPrice', Number(event.target.value))} />
                {errors?.[index]?.unitPrice && <p className="text-sm text-destructive">{errors[index].unitPrice}</p>}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-md bg-muted/40 px-3 py-2">
              <span className="text-sm text-muted-foreground">Total Price</span>
              <span className="font-semibold">{((Number(item.quantity || 0) * Number(item.unitPrice || 0)).toLocaleString('ar-SA'))}</span>
            </div>

            <div className="mt-4 flex justify-end">
              <Button type="button" variant="outline" onClick={() => onRemove(index)}>
                <Trash2 className="ms-2 h-4 w-4" />
                Remove
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
