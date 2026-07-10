import { Menu, Bell, Search } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ar } from '@/constants/ar'
import { useSidebar } from '@/hooks/useSidebar'
import { cn } from '@/utils/cn'

export function Navbar() {
  const { isCollapsed, isTablet, setMobileOpen } = useSidebar()

  return (
    <header
      className={cn(
        'fixed top-0 end-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 transition-all duration-300',
        isTablet ? 'start-0' : isCollapsed ? 'start-[68px]' : 'start-64',
      )}
    >
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute start-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
        </Button>
        <div className="flex items-center gap-2 pe-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">ع</AvatarFallback>
          </Avatar>
          <div className="hidden sm:block">
            <p className="text-sm font-medium leading-none">{ar.common.admin}</p>
            <p className="text-xs text-muted-foreground">{ar.common.manager}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder={ar.common.search} className="w-64 ps-9" />
        </div>
        {isTablet && (
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
        )}
      </div>
    </header>
  )
}
