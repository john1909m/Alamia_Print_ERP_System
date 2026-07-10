import { useState } from 'react'
import { Plus } from 'lucide-react'
import { PageHeader } from '@/components/ui/page-header'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TableActions } from '@/components/common/TableActions'
import { FormModal } from '@/components/ui/modal'
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog'
import { STATUS_VARIANTS } from '@/constants/app'
import { ar } from '@/constants/ar'
import { formatStatus } from '@/utils/formatStatus'

export function StatusBadge({ status }) {
  const variant = STATUS_VARIANTS[status] || 'secondary'
  return <Badge variant={variant}>{formatStatus(status)}</Badge>
}

export function ListPage({
  title,
  description,
  breadcrumb,
  columns,
  data,
  loading,
  searchPlaceholder,
  searchKeys,
  onAdd,
  onEdit,
  onDelete,
  addLabel = ar.common.addNew,
  formContent,
  formTitle = ar.common.addNew,
  editFormTitle = ar.common.edit,
  deleteTitle = ar.common.deleteItemTitle,
  deleteDescription = ar.common.deleteItemDescription,
}) {
  const [formOpen, setFormOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  const tableColumns = [
    ...columns,
    {
      key: 'actions',
      header: ar.common.actions,
      className: 'w-[80px]',
      render: (row) => (
        <TableActions
          onEdit={() => {
            setSelectedItem(row)
            setFormOpen(true)
          }}
          onDelete={() => {
            setSelectedItem(row)
            setDeleteOpen(true)
          }}
        />
      ),
    },
  ]

  const handleFormSubmit = () => {
    if (selectedItem) {
      onEdit?.(selectedItem)
    } else {
      onAdd?.()
    }
    setFormOpen(false)
    setSelectedItem(null)
  }

  const handleDelete = () => {
    onDelete?.(selectedItem)
    setDeleteOpen(false)
    setSelectedItem(null)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        description={description}
        breadcrumb={breadcrumb}
        actions={
          <Button
            onClick={() => {
              setSelectedItem(null)
              setFormOpen(true)
            }}
          >
            <Plus className="h-4 w-4" />
            {addLabel}
          </Button>
        }
      />

      <DataTable
        columns={tableColumns}
        data={data}
        loading={loading}
        searchPlaceholder={searchPlaceholder}
        searchKeys={searchKeys}
      />

      {formContent && (
        <FormModal
          open={formOpen}
          onOpenChange={(open) => {
            setFormOpen(open)
            if (!open) setSelectedItem(null)
          }}
          title={selectedItem ? editFormTitle : formTitle}
          onSubmit={handleFormSubmit}
        >
          {formContent(selectedItem)}
        </FormModal>
      )}

      <ConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={deleteTitle}
        description={deleteDescription}
        onConfirm={handleDelete}
      />
    </div>
  )
}
