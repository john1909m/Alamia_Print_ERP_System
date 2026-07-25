import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

export const AddStockDialog = ({ variant, onConfirm, onCancel }) => {
  // Guard against null variant (can happen due to race conditions during close)
  if (!variant) {
    return null
  }

  const [quantity, setQuantity] = useState(1)

  const handleSubmit = () => {
    onConfirm(quantity)
  }

  return (
    <>
      <DialogContent className="w-[320px]">
        <DialogHeader>
          <DialogTitle>Add Stock to {variant.specification}</DialogTitle>
          <DialogDescription>
            Current stock: {variant.stock}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="space-x-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Add
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </>
  )
}