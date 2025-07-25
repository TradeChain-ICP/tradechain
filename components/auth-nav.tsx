"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  User,
  Settings,
  LogOut,
  ShoppingCart,
  Bell,
  MessageSquare,
  Heart,
  Package,
  BarChart3,
  Wallet,
} from "lucide-react"

export function AuthNav() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="flex items-center space-x-2">
        <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex items-center space-x-2">
        <Button variant="ghost" asChild>
          <Link href="/login">Sign In</Link>
        </Button>
        <Button asChild>
          <Link href="/register">Sign Up</Link>
        </Button>
      </div>
    )
  }

  const userRole = session.user?.role || "buyer"
  const userName = session.user?.name || "User"
  const userEmail = session.user?.email || ""
  const userImage = session.user?.image || ""

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
  }

  const buyerMenuItems = [
    { icon: User, label: "Profile", href: "/profile" },
    { icon: Package, label: "Orders", href: "/orders" },
    { icon: Heart, label: "Favorites", href: "/favorites" },
    { icon: BarChart3, label: "Portfolio", href: "/portfolio" },
    { icon: Wallet, label: "Wallet", href: "/wallet" },
  ]

  const sellerMenuItems = [
    { icon: User, label: "Profile", href: "/seller-profile" },
    { icon: Package, label: "Orders", href: "/seller-orders" },
    { icon: BarChart3, label: "Analytics", href: "/analytics" },
    { icon: Wallet, label: "Earnings", href: "/earnings" },
  ]

  const menuItems = userRole === "seller" ? sellerMenuItems : buyerMenuItems

  return (
    <div className="flex items-center space-x-2">
      {/* Shopping Cart - Only for buyers */}
      {userRole === "buyer" && (
        <Button variant="ghost" size="icon" className="relative" asChild>
          <Link href="/cart">
            <ShoppingCart className="h-5 w-5" />
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">3</Badge>
          </Link>
        </Button>
      )}

      {/* Notifications */}
      <Button variant="ghost" size="icon" className="relative" asChild>
        <Link href="/notifications">
          <Bell className="h-5 w-5" />
          <div className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full" />
        </Link>
      </Button>

      {/* Messages */}
      <Button variant="ghost" size="icon" className="relative" asChild>
        <Link href="/messages">
          <MessageSquare className="h-5 w-5" />
          <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">2</Badge>
        </Link>
      </Button>

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={userImage || "/placeholder.svg"} alt={userName} />
              <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{userName}</p>
              <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
              <Badge variant="outline" className="w-fit text-xs capitalize">
                {userRole}
              </Badge>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {menuItems.map((item) => (
            <DropdownMenuItem key={item.href} asChild>
              <Link href={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Link>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
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
  )
}
