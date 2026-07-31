// src/features/products/pages/ProductsPage.jsx
import { EntityCrudPage } from '@/features/shared/components/EntityCrudPage'
import { useEntityCrud } from '@/features/shared/hooks/useEntityCrud'
import { productService } from '@/features/products/services/productService'
import { ProductForm } from '@/features/products/components/ProductForm'
import { ProductStatusBadge } from '@/features/products/components/ProductStatusBadge'
import { ar, STATUS_LABELS } from '@/constants/ar'

const getProductTypeLabel = (type) => {
  const labels = {
    'LEAFLET': 'نشرة',
    'BOX': 'علبة',
  }
  return labels[type] || type || '-'
}

const getProductTypeColor = (type) => {
  const colors = {
    'LEAFLET': 'bg-blue-100 text-blue-800',
    'BOX': 'bg-green-100 text-green-800',
  }
  return colors[type] || 'bg-gray-100 text-gray-800'
}

const columns = [
  { key: 'productCode', header: ar.products?.productCode || 'Code', sortable: true },
  { key: 'productName', header: ar.products?.productName || 'Name', sortable: true },
  { 
    key: 'companyName', 
    header: ar.common?.company || 'Company', 
    sortable: true,
    render: (row) => row.companyName || 'غير محدد' // Fallback
  },
  {
    key: 'category',
    header: ar.products?.productType || 'Type',
    sortable: true,
    render: (row) => (
      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getProductTypeColor(row.category)}`}>
        {getProductTypeLabel(row.category)}
      </span>
    ),
  },
  {
    key: 'status',
    header: ar.common?.status || 'Status',
    render: (row) => <ProductStatusBadge status={row.status} />,
  },
  { key: 'createdAt', header: ar.common?.created || 'Created', sortable: true },
]

function buildProductViewFields(item) {
  if (!item) return []
  return [
    { label: ar.products?.productName || 'Name', value: item.productName },
    { label: ar.products?.productCode || 'Code', value: item.productCode || '-' },
    { label: ar.common?.company || 'Company', value: item.companyName || 'غير محدد' },
    { label: ar.products?.productType || 'Type', value: getProductTypeLabel(item.category) },
    { label: ar.common?.status || 'Status', value: STATUS_LABELS?.[item.status] || item.status },
    { label: ar.products?.description || 'Description', value: item.description || '-' },
    { label: ar.common?.created || 'Created', value: item.createdAt || '-' },
  ]
}

export default function ProductsPage() {
  const { data, loading, create, update, remove } = useEntityCrud(productService)

  return (
    <EntityCrudPage
      title={ar.products?.title || 'Products'}
      description={ar.products?.description || 'Manage your products'}
      breadcrumb={[{ label: ar.nav?.products || 'Products' }]}
      addLabel={ar.products?.add || 'Add Product'}
      formTitles={{ 
        add: ar.products?.addForm || 'Add Product', 
        edit: ar.products?.editForm || 'Edit Product' 
      }}
      deleteLabels={{
        title: ar.products?.deleteTitle || 'Delete Product',
        description: ar.products?.deleteDescription || 'Are you sure you want to delete this product?',
      }}
      viewTitle={ar.products?.viewTitle || 'Product Details'}
      getViewFields={buildProductViewFields}
      columns={columns}
      data={data}
      loading={loading}
      searchPlaceholder={ar.products?.search || 'Search products...'}
      searchKeys={['productName', 'productCode', 'companyName', 'category']}
      FormComponent={ProductForm}
      onCreate={create}
      onUpdate={update}
      onDelete={remove}
    />
  )
}