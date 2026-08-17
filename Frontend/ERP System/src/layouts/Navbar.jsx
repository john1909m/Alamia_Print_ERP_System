import { Menu, Bell, Search, LogOut } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ar } from "@/constants/ar"
import { useSidebar } from "@/hooks/useSidebar"
import { useAuth } from "@/context/AuthContext"
import { cn } from "@/utils/cn"

export function Navbar() {
  const { isCollapsed, isTablet, setMobileOpen } = useSidebar()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    // The logout function in auth context already navigates to login
  }

  return (
    <header
      className={cn(
        "fixed top-0 end-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 transition-all duration-300",
        isTablet ? "start-0" : isCollapsed ? "start-[68px]" : "start-64",
      )}
    >
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute start-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
        </Button>
        <div className="flex items-center gap-3 pe-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {user?.name ? user.name.match(/\b\w/g)?.join("").toUpperCase() : "Ø¥"}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {isTablet && (
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
        )}
        {!isTablet && (
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        )}
      </div>
    </header>
  )
}
