import { useMemo, useState } from 'react'
import { EntityCrudPage } from '@/features/shared/components/EntityCrudPage'
import { useEntityCrud } from '@/features/shared/hooks/useEntityCrud'
import { materialService } from '@/features/materials/services/materialService'
import { MaterialForm } from '@/features/materials/components/MaterialForm'
import { MaterialStatusBadge } from '@/features/materials/components/MaterialStatusBadge'
import { MaterialFilters } from '@/features/materials/components/MaterialFilters'
import { ar, MATERIAL_TYPE_LABELS, STATUS_LABELS } from '@/constants/ar'

const columns = [
  { key: 'name', header: ar.materials.name, sortable: true },
  {
    key: 'type',
    header: ar.materials.type,
    sortable: true,
    render: (row) => MATERIAL_TYPE_LABELS[row.type] || row.type,
  },
  { key: 'unit', header: ar.materials.unit },
  {
    key: 'currentStock',
    header: ar.materials.currentStock,
    sortable: true,
    render: (row) => row.currentStock?.toLocaleString('ar-SA'),
  },
  {
    key: 'minStock',
    header: ar.materials.minStock,
    sortable: true,
    render: (row) => row.minStock?.toLocaleString('ar-SA'),
  },
  {
    key: 'stockStatus',
    header: ar.common.status,
    render: (row) => <MaterialStatusBadge status={row.stockStatus} />,
  },
  { key: 'createdAt', header: ar.common.created, sortable: true },
]

function buildMaterialViewFields(item) {
  if (!item) return []
  return [
    { label: ar.materials.name, value: item.name },
    { label: ar.materials.type, value: MATERIAL_TYPE_LABELS[item.type] },
    { label: ar.materials.unit, value: item.unit },
    { label: ar.materials.currentStock, value: item.currentStock?.toLocaleString('ar-SA') },
    { label: ar.materials.minStock, value: item.minStock?.toLocaleString('ar-SA') },
    { label: ar.common.status, value: STATUS_LABELS[item.stockStatus] },
    { label: ar.common.created, value: item.createdAt },
    { label: ar.materials.description, value: item.description },
  ]
}

export default function MaterialsPage() {
  const { data, loading, create, update, remove } = useEntityCrud(materialService)
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (typeFilter !== 'all' && item.type !== typeFilter) return false
      if (statusFilter !== 'all' && item.stockStatus !== statusFilter) return false
      return true
    })
  }, [data, typeFilter, statusFilter])

  return (
    <EntityCrudPage
      title={ar.materials.title}
      description={ar.materials.description}
      breadcrumb={[{ label: ar.nav.materials }]}
      addLabel={ar.materials.add}
      formTitles={{ add: ar.materials.addForm, edit: ar.materials.editForm }}
      deleteLabels={{
        title: ar.materials.deleteTitle,
        description: ar.materials.deleteDescription,
      }}
      viewTitle={ar.materials.viewTitle}
      getViewFields={buildMaterialViewFields}
      columns={columns}
      data={filteredData}
      loading={loading}
      searchPlaceholder={ar.materials.search}
      searchKeys={['name', 'type', 'unit', 'description']}
      FormComponent={MaterialForm}
      onCreate={create}
      onUpdate={update}
      onDelete={remove}
      filterSlot={
        <MaterialFilters
          typeFilter={typeFilter}
          statusFilter={statusFilter}
          onTypeChange={setTypeFilter}
          onStatusChange={setStatusFilter}
        />
      }
    />
  )
}
