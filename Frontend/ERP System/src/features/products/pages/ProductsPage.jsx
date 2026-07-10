import { EntityCrudPage } from '@/features/shared/components/EntityCrudPage'
import { useEntityCrud } from '@/features/shared/hooks/useEntityCrud'
import { productService } from '@/features/products/services/productService'
import { ProductForm } from '@/features/products/components/ProductForm.jsx'
import { ProductStatusBadge } from '@/features/products/components/ProductStatusBadge.jsx'
import { ar, STATUS_LABELS } from '@/constants/ar'

const columns = [
  { key: 'productCode', header: ar.products.productCode, sortable: true },
  { key: 'productName', header: ar.products.productName, sortable: true },
  { key: 'companyName', header: ar.common.company, sortable: true },
  { key: 'category', header: ar.products.category, sortable: true },
  {
    key: 'status',
    header: ar.common.status,
    render: (row) => <ProductStatusBadge status={row.status} />,
  },
  { key: 'createdAt', header: ar.common.created, sortable: true },
  { key: 'updatedAt', header: ar.common.updated, sortable: true },
]

function buildProductViewFields(item) {
  if (!item) return []
  return [
    { label: ar.products.productCode, value: item.productCode },
    { label: ar.products.productName, value: item.productName },
    { label: ar.common.company, value: item.companyName },
    { label: ar.products.category, value: item.category },
    { label: ar.products.status, value: STATUS_LABELS[item.status] || item.status },
    { label: ar.common.created, value: item.createdAt },
    { label: ar.common.updated, value: item.updatedAt },
    { label: ar.products.description, value: item.description },
  ]
}

export default function ProductsPage() {
  const { data, loading, create, update, remove } = useEntityCrud(productService)

  return (
    <EntityCrudPage
      title={ar.products.title}
      description={ar.products.description}
      breadcrumb={[{ label: ar.nav.products }]}
      addLabel={ar.products.add}
      formTitles={{ add: ar.products.addForm, edit: ar.products.editForm }}
      deleteLabels={{
        title: ar.products.deleteTitle,
        description: ar.products.deleteDescription,
      }}
      viewTitle={ar.products.viewTitle}
      getViewFields={buildProductViewFields}
      columns={columns}
      data={data}
      loading={loading}
      searchPlaceholder={ar.products.search}
      searchKeys={['productCode', 'productName', 'companyName', 'category', 'description']}
      FormComponent={ProductForm}
      onCreate={create}
      onUpdate={update}
      onDelete={remove}
    />
  )
}
