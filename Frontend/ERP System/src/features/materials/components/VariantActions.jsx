import { Button } from '@/components/ui/button'
import { Menu, MenuItem, MenuContent, MenuTrigger } from '@/components/ui/menu'
import { MoreHorizontal, Edit, Trash2, Plus } from 'lucide-react'

export const VariantActions = ({ variant, materialId, onEdit, onDelete, onAddStock }) => {
  return (
    <Menu>
      <MenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Actions">
          <MoreHorizontal />
        </Button>
      </MenuTrigger>
      <MenuContent align="end">
        <MenuItem onClick={() => onEdit(variant)}>
          Edit
        </MenuItem>
        <MenuItem onClick={() => onDelete(variant.id)}>
          Delete
        </MenuItem>
        <MenuItem onClick={() => onAddStock(variant)}>
          Add Stock
        </MenuItem>
      </MenuContent>
    </Menu>
  )
}