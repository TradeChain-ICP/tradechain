"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  BarChart3,
  Bell,
  DollarSign,
  Home,
  Menu,
  Package,
  Settings,
  ShoppingCart,
  Users,
  Wallet,
  Heart,
  History,
  HelpCircle,
  MessageSquare,
  Plus,
  Eye,
  Target,
  Zap,
  LogOut,
  User,
  ChevronsLeft,
  ChevronsRight,
  TrendingUp,
} from "lucide-react"
import { Logo } from "@/components/logo"
import { ColorModeSwitcher } from "@/components/color-mode-switcher"
import { CartDrawer } from "@/components/cart/cart-drawer"
import { signOut } from "next-auth/react"

interface DashboardLayoutProps {
  children: React.ReactNode
  userRole?: "buyer" | "seller"
}

const buyerNavItems = [
  {
    title: "Dashboard",
    href: "/buyer-dashboard",
    icon: Home,
  },
  {
    title: "Marketplace",
    href: "/marketplace",
    icon: ShoppingCart,
  },
  {
    title: "Portfolio",
    href: "/portfolio",
    icon: TrendingUp,
  },
  {
    title: "Orders",
    href: "/orders",
    icon: Package,
  },
  {
    title: "Favorites",
    href: "/favorites",
    icon: Heart,
  },
  {
    title: "Purchase History",
    href: "/purchase-history",
    icon: History,
  },
  {
    title: "Wallet",
    href: "/wallet",
    icon: Wallet,
  },
  {
    title: "AI Insights",
    href: "/ai-insights",
    icon: Zap,
  },
  {
    title: "Messages",
    href: "/messages",
    icon: MessageSquare,
  },
]

const sellerNavItems = [
  {
    title: "Dashboard",
    href: "/seller-dashboard",
    icon: Home,
  },
  {
    title: "Add Product",
    href: "/add-product",
    icon: Plus,
  },
  {
    title: "Inventory",
    href: "/inventory",
    icon: Package,
  },
  {
    title: "Orders",
    href: "/seller-orders",
    icon: ShoppingCart,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Performance",
    href: "/product-performance",
    icon: Eye,
  },
  {
    title: "Earnings",
    href: "/earnings",
    icon: DollarSign,
  },
  {
    title: "Price Optimizer",
    href: "/price-optimizer",
    icon: Target,
  },
  {
    title: "AI Insights",
    href: "/ai-insights",
    icon: Zap,
  },
  {
    title: "Messages",
    href: "/messages",
    icon: MessageSquare,
  },
]

const bottomNavItems = [
  {
    title: "Profile",
    href: "/profile",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    title: "Help",
    href: "/help",
    icon: HelpCircle,
  },
]

export function DashboardLayout({ children, userRole }: DashboardLayoutProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const role = userRole || session?.user?.role || "buyer"
  const navItems = role === "seller" ? sellerNavItems : buyerNavItems
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
  }

  const Sidebar = ({ className, isMobile = false }: { className?: string; isMobile?: boolean }) => (
    <div className={cn("flex h-full flex-col", className)}>
      {/* Logo Section */}
      <div className="flex h-14 items-center border-b px-4">
        {!sidebarCollapsed || isMobile ? (
          <Logo />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-bold">TC</span>
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-2">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant={pathname === item.href ? "secondary" : "ghost"}
              className={cn("w-full justify-start", sidebarCollapsed && !isMobile && "px-2")}
              asChild
            >
              <Link href={item.href}>
                <item.icon className={cn("h-4 w-4", !sidebarCollapsed || isMobile ? "mr-2" : "")} />
                {(!sidebarCollapsed || isMobile) && item.title}
              </Link>
            </Button>
          ))}
        </div>
      </ScrollArea>

      {/* Bottom Section */}
      <div className="border-t p-3">
        <div className="space-y-2">
          {bottomNavItems.map((item) => (
            <Button
              key={item.href}
              variant={pathname === item.href ? "secondary" : "ghost"}
              className={cn("w-full justify-start", sidebarCollapsed && !isMobile && "px-2")}
              asChild
            >
              <Link href={item.href}>
                <item.icon className={cn("h-4 w-4", !sidebarCollapsed || isMobile ? "mr-2" : "")} />
                {(!sidebarCollapsed || isMobile) && item.title}
              </Link>
            </Button>
          ))}
        </div>

        {/* User Profile Section */}
        <div className="mt-4 pt-4 border-t">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn("w-full justify-start p-2", sidebarCollapsed && !isMobile && "px-2")}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session?.user?.image || ""} />
                  <AvatarFallback>{session?.user?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                {(!sidebarCollapsed || isMobile) && (
                  <div className="ml-2 flex flex-col items-start">
                    <span className="text-sm font-medium">{session?.user?.name || "User"}</span>
                    <span className="text-xs text-muted-foreground capitalize">{role}</span>
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4">
          {/* Mobile Menu */}
          <div className="mr-4 flex lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] p-0">
                <Sidebar isMobile />
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Collapse Button */}
          <div className="hidden lg:flex mr-4">
            <Button variant="ghost" size="icon" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
              {sidebarCollapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
            </Button>
          </div>

          {/* Mobile Logo */}
          <div className="flex lg:hidden">
            <Logo />
          </div>

          <div className="flex flex-1 items-center justify-end space-x-2">
            <nav className="flex items-center space-x-2">
              {role === "buyer" && (
                <CartDrawer>
                  <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
                      3
                    </span>
                  </Button>
                </CartDrawer>
              )}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500"></span>
              </Button>
              <ColorModeSwitcher />
            </nav>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside
          className={cn(
            "hidden lg:block border-r bg-background transition-all duration-300",
            sidebarCollapsed ? "w-16" : "w-64",
          )}
        >
          <div className="sticky top-14 h-[calc(100vh-3.5rem)]">
            <Sidebar />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 pb-16 lg:pb-0">{children}</main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:hidden">
        <div className="grid grid-cols-5 gap-1 p-2">
          {navItems.slice(0, 4).map((item) => (
            <Button
              key={item.href}
              variant={pathname === item.href ? "secondary" : "ghost"}
              size="sm"
              className="flex flex-col h-12 px-2"
              asChild
            >
              <Link href={item.href}>
                <item.icon className="h-4 w-4" />
                <span className="text-xs mt-1">{item.title}</span>
              </Link>
            </Button>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex flex-col h-12 px-2">
                <Menu className="h-4 w-4" />
                <span className="text-xs mt-1">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {navItems.slice(4).map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link href={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              {bottomNavItems.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link href={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
