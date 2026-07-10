import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ar } from '@/constants/ar'

export function TableActions({ onEdit, onDelete, extraActions = [] }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {onEdit && (
          <DropdownMenuItem onClick={onEdit}>
            <Pencil className="ms-2 h-4 w-4" />
            {ar.common.edit}
          </DropdownMenuItem>
        )}
        {extraActions.map((action) => (
          <DropdownMenuItem key={action.label} onClick={action.onClick}>
            {action.icon && <action.icon className="ms-2 h-4 w-4" />}
            {action.label}
          </DropdownMenuItem>
        ))}
        {onDelete && (
          <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
            <Trash2 className="ms-2 h-4 w-4" />
            {ar.common.delete}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
