import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { cn } from '@/utils/cn'

export const Menu = ({ ...props }) => <DropdownMenu.Root {...props} />

export const MenuTrigger = ({ ...props }) => <DropdownMenu.Trigger {...props} />

export const MenuContent = ({ className, sideOffset = 4, ...props }) => (
  <DropdownMenu.Portal>
    <DropdownMenu.Content
      className={cn(
        'relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
        className,
      )}
      sideOffset={sideOffset}
      {...props}
    >
      <DropdownMenu.Viewport className="p-1">
        <slot />
      </DropdownMenu.Viewport>
    </DropdownMenu.Content>
  </DropdownMenu.Portal>
)

export const MenuItem = ({ className, ...props }) => (
  <DropdownMenu.Item
    className={cn(
      'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className,
    )}
    {...props}
  >
    <slot />
  </DropdownMenu.Item>
)

export const MenuSeparator = () => (
  <DropdownMenu.Separator className="-mx-1 my-1 h-0.5 bg-muted" />
)

export const MenuLabel = ({ ...props }) => (
  <DropdownMenu.Label
    className={cn('px-2 py-1.5 text-sm font-medium')}

    {...props}
  />
)