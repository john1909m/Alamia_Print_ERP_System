import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function SupplierCard({ supplier }) {
  if (!supplier) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Supplier Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p className="font-semibold">{supplier.name}</p>
        <p className="text-muted-foreground">{supplier.contact}</p>
        <p className="text-muted-foreground">{supplier.phone}</p>
        <p className="text-muted-foreground">{supplier.email}</p>
        <p className="text-muted-foreground">{supplier.address}</p>
      </CardContent>
    </Card>
  )
}
