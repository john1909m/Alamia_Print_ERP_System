import { cva } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/90 focus-visible:ring-primary/20',
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 focus-visible:ring-secondary/20',
        destructive: 'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/90 focus-visible:ring-destructive/20',
        outline: 'text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-accent/20',
        success: 'border-transparent bg-success/20 text-success-foreground hover:bg-success/30 focus-visible:ring-success/20',
        warning: 'border-transparent bg-warning/20 text-warning-foreground hover:bg-warning/30 focus-visible:ring-warning/20',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

// eslint-disable-next-line react-refresh/only-export-components
export { badgeVariants }
