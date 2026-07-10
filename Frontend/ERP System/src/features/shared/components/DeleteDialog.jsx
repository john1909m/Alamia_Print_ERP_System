import { ConfirmationDialog } from '@/components/ui/confirmation-dialog'

export function DeleteDialog(props) {
  return <ConfirmationDialog variant="destructive" {...props} />
}
