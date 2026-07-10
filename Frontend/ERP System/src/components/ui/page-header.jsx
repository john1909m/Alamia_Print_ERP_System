import { Breadcrumb } from '@/components/ui/breadcrumb'
import { cn } from '@/utils/cn'

export function PageTitle({ children, className }) {
  return <h1 className={cn('text-2xl font-bold tracking-tight', className)}>{children}</h1>
}

export function SectionHeader({ title, description, action, className }) {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

export function PageHeader({ title, description, breadcrumb = [], actions, className }) {
  return (
    <div className={cn('space-y-4', className)}>
      {breadcrumb.length > 0 && <Breadcrumb items={breadcrumb} />}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <PageTitle>{title}</PageTitle>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  )
}
