import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ar } from '@/constants/ar'

export function PurchaseSummary({ items, className }) {
  const subtotal = items.reduce((sum, item) => sum + Number(item.totalPrice || 0), 0)
  const totalItems = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Purchase Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">{subtotal.toLocaleString('ar-SA')} {ar.common.currency}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total Items</span>
          <span className="font-medium">{totalItems}</span>
        </div>
        <div className="flex items-center justify-between border-t pt-3 text-base font-semibold">
          <span>Grand Total</span>
          <span>{subtotal.toLocaleString('ar-SA')} {ar.common.currency}</span>
        </div>
      </CardContent>
    </Card>
  )
}
