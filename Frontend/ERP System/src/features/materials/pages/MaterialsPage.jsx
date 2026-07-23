import { useMemo, useState } from 'react'
import { EntityCrudPage } from '@/features/shared/components/EntityCrudPage'
import { useEntityCrud } from '@/features/shared/hooks/useEntityCrud'
import { materialService } from '@/features/materials/services/materialService'
import { MaterialForm } from '@/features/materials/components/MaterialForm'
import { MaterialFilters } from '@/features/materials/components/MaterialFilters'
import { ar } from '@/constants/ar'
import { MATERIAL_TYPES, getMaterialUnitLabel } from '@/features/materials/utils/constants'

// Helper to get label from value
const getMaterialTypeLabel = (value) => {
  const found = MATERIAL_TYPES.find((t) => t.value === value)
  return found ? found.label : value
}

const columns = [
  { key: 'name', header: ar.materials.name, sortable: true },
  {
    key: 'type',
    header: ar.materials.type,
    sortable: true,
    render: (row) => {
      const label = getMaterialTypeLabel(row.type)
      return <span>{label}</span>
    }
  },
  { key: 'unit', header: ar.materials.unit },
]

function buildMaterialViewFields(item) {
  if (!item) return []
  return [
    { label: ar.materials.name, value: item.name },
    { label: ar.materials.type, value: getMaterialTypeLabel(item.type) },
    { label: ar.materials.unit, value: item.unit },
    { label: ar.materials.currentStock, value: item.stock },
    { label: ar.materials.description, value: item.notes },
    { label: ar.common.created, value: item.createdAt },
    { label: ar.common.updated, value: item.updatedAt },
  ]
}

export default function MaterialsPage() {
  const { data, loading, create, update, remove } = useEntityCrud(materialService)
  const [typeFilter, setTypeFilter] = useState('all')

  // Filter material types for the dropdown (excluding 'all')
  const filterTypes = [
    { value: 'all', label: ar.materials.allTypes },
    ...MATERIAL_TYPES.map((t) => ({
      value: t.value,
      label: t.label,
    })),
  ]

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (typeFilter !== 'all' && item.type !== typeFilter) return false
      return true
    })
  }, [data, typeFilter])

  return (
    <EntityCrudPage
      title={ar.materials.title}
      description={ar.materials.description}
      breadcrumb={[ { label: ar.nav.materials } ]}
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
      searchKeys={['name', 'type', 'unit']}
      FormComponent={MaterialForm}
      onCreate={create}
      onUpdate={update}
      onDelete={remove}
      filterSlot={
        <MaterialFilters
          typeFilter={typeFilter}
          onTypeChange={setTypeFilter}
          filterTypes={filterTypes}
        />
      }
    />
  )
}