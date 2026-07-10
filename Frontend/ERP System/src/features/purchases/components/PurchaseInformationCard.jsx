import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function PurchaseInformationCard({ purchase }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Purchase Information</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2">
        <div>
          <p className="text-sm text-muted-foreground">Purchase Number</p>
          <p className="font-medium">{purchase.purchaseNumber}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Purchase Date</p>
          <p className="font-medium">{purchase.purchaseDate}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Status</p>
          <p className="font-medium">{purchase.status}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Created Date</p>
          <p className="font-medium">{purchase.createdAt}</p>
        </div>
      </CardContent>
    </Card>
  )
}
