import { ActionDropdown } from '@/features/shared/components/ActionDropdown'
import { Button } from '@/components/ui/button'
import { ar } from '@/constants/ar'

export function MaterialActions({ row, onView, onEdit, onDelete, onVariants }) {
  return (
    <div className="flex space-x-2">
      <ActionDropdown onView={() => onView(row)} onEdit={() => onEdit(row)} onDelete={() => onDelete(row)} />
      <Button variant="outline" size="sm" onClick={() => onVariants(row)} aria-label={ar.materials.variants}>
        {ar.materials.variants}
      </Button>
    </div>
  )
}