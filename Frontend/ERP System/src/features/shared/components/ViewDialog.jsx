import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export function ViewDialog({ open, onOpenChange, title, fields }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <dl className="space-y-3 text-sm">
          {fields.map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-1 sm:flex-row sm:gap-4">
              <dt className="min-w-[120px] font-medium text-muted-foreground">{label}</dt>
              <dd className="flex-1">{value || '—'}</dd>
            </div>
          ))}
        </dl>
      </DialogContent>
    </Dialog>
  )
}
