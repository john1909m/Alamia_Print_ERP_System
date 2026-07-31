// src/features/products/components/ProductDetailsCard.jsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { STATUS_VARIANTS } from '@/constants/app'
import { STATUS_LABELS } from '@/constants/ar'
import { ar } from '@/constants/ar'

export function ProductDetailsCard({ product }) {
  if (!product) return null

  return (
    <Card className="space-y-4">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">{product.productName}</CardTitle>
        <CardDescription className="text-muted-foreground">
          {product.productCode}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="space-y-1">
            <span className="font-medium">{ar.products?.productCode || 'Product Code'}:</span>
            <span>{product.productCode}</span>
          </div>
          <div className="space-y-1">
            <span className="font-medium">{ar.products?.productName || 'Product Name'}:</span>
            <span>{product.productName}</span>
          </div>
          <div className="space-y-1">
            <span className="font-medium">{ar.common?.company || 'Company'}:</span>
            <span>{product.companyName || 'غير محدد'}</span>
          </div>
          <div className="space-y-1">
            <span className="font-medium">{ar.products?.category || 'Category'}:</span>
            <span>{product.category}</span>
          </div>
          <div className="space-y-1">
            <span className="font-medium">{ar.common?.status || 'Status'}:</span>
            <Badge variant={STATUS_VARIANTS?.[product.status] || 'secondary'}>
              {STATUS_LABELS?.[product.status] || product.status}
            </Badge>
          </div>
          <div className="space-y-1">
            <span className="font-medium">{ar.common?.created || 'Created'}:</span>
            <span>{product.createdAt}</span>
          </div>
          {product.updatedAt && (
            <div className="space-y-1">
              <span className="font-medium">{ar.common?.updated || 'Updated'}:</span>
              <span>{product.updatedAt}</span>
            </div>
          )}
          {product.description && (
            <div className="space-y-1">
              <span className="font-medium">{ar.products?.description || 'Description'}:</span>
              <p className="whitespace-pre-wrap">{product.description}</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end pt-4">
        {/* Action buttons could go here if needed */}
      </CardFooter>
    </Card>
  )
}