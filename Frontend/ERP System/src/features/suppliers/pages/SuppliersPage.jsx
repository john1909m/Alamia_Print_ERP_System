import { EntityCrudPage } from '@/features/shared/components/EntityCrudPage'
import { useEntityCrud } from '@/features/shared/hooks/useEntityCrud'
import { supplierService } from '@/features/suppliers/services/supplierService'
import { SupplierForm } from '@/features/suppliers/components/SupplierForm'
import { ar } from '@/constants/ar'

const TYPE_LABELS = {
  PAPER: 'ورق',
  INK: 'حبر',
  CHEMICAL: 'كيماويات',
  ZINC: 'زنك',
}

const columns = [
  { key: 'name', header: ar.suppliers.name, sortable: true },
  { key: 'phone', header: ar.common.phone, sortable: true },
  { key: 'email', header: ar.common.email, sortable: true },
  { key: 'address', header: ar.common.address },
  {
    key: 'type',
    header: 'النوع',
    render: (row) => TYPE_LABELS[row.type] ?? row.type,
  },
  {
    key: 'materialsCount',
    header: ar.suppliers.materialsCount,
    sortable: true,
    render: (row) => row.materialsCount?.toLocaleString('ar-SA'),
  },
  { key: 'createdAt', header: ar.common.created, sortable: true },
]

export default function SuppliersPage() {
  const { data, loading, create, update, remove } = useEntityCrud(supplierService)

  return (
    <EntityCrudPage
      title={ar.suppliers.title}
      description={ar.suppliers.description}
      breadcrumb={[ { label: ar.nav.suppliers } ]}
      addLabel={ar.suppliers.add}
      formTitles={{ add: ar.suppliers.addForm, edit: ar.suppliers.editForm }}
      deleteLabels={{
        title: ar.suppliers.deleteTitle,
        description: ar.suppliers.deleteDescription,
      }}
      viewTitle={ar.suppliers.viewTitle}
      viewLabels={{
        name: ar.suppliers.name,
        count: ar.suppliers.materialsCount,
        countKey: 'materialsCount',
      }}
      columns={columns}
      data={data}
      loading={loading}
      searchPlaceholder={ar.suppliers.search}
      searchKeys={['name', 'phone', 'email', 'address']}
      FormComponent={SupplierForm}
      onCreate={create}
      onUpdate={update}
      onDelete={remove}
    />
  )
}