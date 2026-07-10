import { useState, useCallback, useRef } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/features/shared/components/PageHeader'
import { DataTable } from '@/features/shared/components/DataTable'
import { ActionDropdown } from '@/features/shared/components/ActionDropdown'
import { DeleteDialog } from '@/features/shared/components/DeleteDialog'
import { FormModal } from '@/features/shared/components/FormModal'
import { ViewDialog } from '@/features/shared/components/ViewDialog'
import { buildViewFields } from '@/features/shared/utils/buildViewFields'
import { LoadingState } from '@/features/shared/components/LoadingState'
import { ar } from '@/constants/ar'

export function EntityCrudPage({
  title,
  description,
  breadcrumb,
  addLabel,
  formTitles,
  deleteLabels,
  viewTitle,
  viewLabels,
  columns,
  data,
  loading,
  searchPlaceholder,
  searchKeys,
  FormComponent,
  formProps,
  onCreate,
  onUpdate,
  onDelete,
  filterSlot,
  getViewFields,
}) {
  const [formOpen, setFormOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [saving, setSaving] = useState(false)
  const formRef = useRef(null)

  const isEditing = Boolean(selectedItem?.id)

  const openCreate = () => {
    setSelectedItem(null)
    setFormOpen(true)
  }

  const openEdit = (item) => {
    setSelectedItem(item)
    setFormOpen(true)
  }

  const openView = (item) => {
    setSelectedItem(item)
    setViewOpen(true)
  }

  const openDelete = (item) => {
    setSelectedItem(item)
    setDeleteOpen(true)
  }

  const handleFormSave = useCallback(async () => {
    formRef.current?.submit()
  }, [])

  const handleFormSubmit = async (values) => {
    setSaving(true)
    try {
      if (isEditing) {
        await onUpdate(selectedItem.id, values)
      } else {
        await onCreate(values)
      }
      setFormOpen(false)
      setSelectedItem(null)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (selectedItem) {
      await onDelete(selectedItem.id)
    }
    setDeleteOpen(false)
    setSelectedItem(null)
  }

  const tableColumns = [
    ...columns,
    {
      key: 'actions',
      header: ar.common.actions,
      className: 'w-[80px]',
      render: (row) => (
        <ActionDropdown
          onView={() => openView(row)}
          onEdit={() => openEdit(row)}
          onDelete={() => openDelete(row)}
        />
      ),
    },
  ]

  if (loading && data.length === 0) {
    return <LoadingState text={ar.common.loading} />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        description={description}
        breadcrumb={breadcrumb}
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            {addLabel}
          </Button>
        }
      />

      {filterSlot}

      <DataTable
        columns={tableColumns}
        data={data}
        loading={loading}
        searchPlaceholder={searchPlaceholder}
        searchKeys={searchKeys}
        pageSize={10}
        stickyHeader
        showPageSizeSelector={false}
      />

      <FormModal
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open)
          if (!open) setSelectedItem(null)
        }}
        title={isEditing ? formTitles.edit : formTitles.add}
        onSubmit={handleFormSave}
        loading={saving}
      >
        <FormComponent
          ref={formRef}
          defaultValues={selectedItem}
          onSubmit={handleFormSubmit}
          {...formProps}
        />
      </FormModal>

      <ViewDialog
        open={viewOpen}
        onOpenChange={setViewOpen}
        title={viewTitle}
        fields={
          getViewFields
            ? getViewFields(selectedItem)
            : buildViewFields(selectedItem, viewLabels)
        }
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={deleteLabels.title}
        description={deleteLabels.description}
        onConfirm={handleDelete}
      />
    </div>
  )
}
