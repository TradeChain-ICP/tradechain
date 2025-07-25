"use client"

import { useState } from "react"
import {
  Bell,
  Check,
  X,
  Eye,
  EyeOff,
  Search,
  MoreHorizontal,
  AlertTriangle,
  CheckCircle,
  Info,
  Zap,
} from "lucide-react"

import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function NotificationsPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([])

  const filteredNotifications = mockNotifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterType === "all" || notification.type === filterType
    return matchesSearch && matchesFilter
  })

  const unreadCount = mockNotifications.filter((n) => !n.read).length

  const handleMarkAsRead = (id: string) => {
    toast({
      title: "Notification marked as read",
      description: "The notification has been marked as read.",
    })
  }

  const handleMarkAllAsRead = () => {
    toast({
      title: "All notifications marked as read",
      description: `${unreadCount} notifications have been marked as read.`,
    })
  }

  const handleDeleteNotification = (id: string) => {
    toast({
      title: "Notification deleted",
      description: "The notification has been deleted.",
    })
  }

  const handleBulkAction = (action: string) => {
    if (selectedNotifications.length === 0) {
      toast({
        title: "No notifications selected",
        description: "Please select notifications to perform bulk actions.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Bulk action completed",
      description: `${action} applied to ${selectedNotifications.length} notifications.`,
    })
    setSelectedNotifications([])
  }

  const handleNotificationSelect = (id: string) => {
    setSelectedNotifications((prev) => (prev.includes(id) ? prev.filter((notifId) => notifId !== id) : [...prev, id]))
  }

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([])
    } else {
      setSelectedNotifications(filteredNotifications.map((n) => n.id))
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "order":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "price":
        return <Zap className="h-5 w-5 text-yellow-600" />
      case "system":
        return <Info className="h-5 w-5 text-blue-600" />
      case "alert":
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getNotificationCounts = () => {
    return {
      all: mockNotifications.length,
      unread: mockNotifications.filter((n) => !n.read).length,
      order: mockNotifications.filter((n) => n.type === "order").length,
      price: mockNotifications.filter((n) => n.type === "price").length,
      system: mockNotifications.filter((n) => n.type === "system").length,
      alert: mockNotifications.filter((n) => n.type === "alert").length,
    }
  }

  const counts = getNotificationCounts()

  return (
    <DashboardLayout userRole="buyer">
      <div className="container mx-auto px-4 py-6 pb-20 lg:pb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-muted-foreground">Stay updated with your orders, price alerts, and system updates</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleMarkAllAsRead} className="bg-transparent">
              <Check className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
          </div>
        </div>

        {/* Notification Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{counts.all}</p>
                </div>
                <Bell className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Unread</p>
                  <p className="text-2xl font-bold text-blue-600">{counts.unread}</p>
                </div>
                <EyeOff className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Price Alerts</p>
                  <p className="text-2xl font-bold text-yellow-600">{counts.price}</p>
                </div>
                <Zap className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Orders</p>
                  <p className="text-2xl font-bold text-green-600">{counts.order}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search notifications..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="order">Orders</SelectItem>
                    <SelectItem value="price">Price Alerts</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="alert">Alerts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedNotifications.length > 0 && (
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{selectedNotifications.length} notifications selected</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction("Mark as Read")}
                    className="bg-transparent"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Mark as Read
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction("Delete")}
                    className="bg-transparent"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notifications Tabs */}
        <Tabs value={filterType} onValueChange={setFilterType} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
            <TabsTrigger value="order">Orders ({counts.order})</TabsTrigger>
            <TabsTrigger value="price">Price Alerts ({counts.price})</TabsTrigger>
            <TabsTrigger value="system">System ({counts.system})</TabsTrigger>
            <TabsTrigger value="alert">Alerts ({counts.alert})</TabsTrigger>
          </TabsList>

          <TabsContent value={filterType} className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>
                      {filteredNotifications.length} of {mockNotifications.length} notifications
                    </CardDescription>
                  </div>
                  <Checkbox
                    checked={selectedNotifications.length === filteredNotifications.length}
                    onCheckedChange={handleSelectAll}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border rounded-lg transition-colors ${
                        !notification.read ? "bg-blue-50 border-blue-200" : "bg-background"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <Checkbox
                          checked={selectedNotifications.includes(notification.id)}
                          onCheckedChange={() => handleNotificationSelect(notification.id)}
                        />

                        <div className="flex-shrink-0">{getNotificationIcon(notification.type)}</div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium">{notification.title}</h4>
                                {!notification.read && (
                                  <Badge variant="secondary" className="text-xs">
                                    New
                                  </Badge>
                                )}
                                <Badge variant="outline" className="text-xs">
                                  {notification.type}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>{notification.timestamp}</span>
                                {notification.sender && (
                                  <div className="flex items-center gap-1">
                                    <Avatar className="h-4 w-4">
                                      <AvatarImage src={notification.sender.avatar || "/placeholder.svg"} />
                                      <AvatarFallback className="text-xs">
                                        {notification.sender.name.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span>{notification.sender.name}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                {!notification.read ? (
                                  <DropdownMenuItem onClick={() => handleMarkAsRead(notification.id)}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    Mark as Read
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem>
                                    <EyeOff className="h-4 w-4 mr-2" />
                                    Mark as Unread
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDeleteNotification(notification.id)}
                                  className="text-red-600"
                                >
                                  <X className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          {notification.actionUrl && (
                            <div className="mt-3">
                              <Button variant="outline" size="sm" className="bg-transparent">
                                {notification.actionText || "View Details"}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {filteredNotifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No notifications found</h2>
            <p className="text-muted-foreground mb-4">
              {searchQuery || filterType !== "all"
                ? "Try adjusting your search or filter criteria."
                : "You're all caught up! No new notifications at the moment."}
            </p>
            {(searchQuery || filterType !== "all") && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setFilterType("all")
                }}
                className="bg-transparent"
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

// Mock data
const mockNotifications = [
  {
    id: "1",
    type: "order",
    title: "Order Shipped",
    message: "Your order #ORD-7292 for Gold Bullion - 1oz has been shipped and is on its way.",
    timestamp: "2 hours ago",
    read: false,
    actionUrl: "/order-tracking/ORD-7292",
    actionText: "Track Order",
    sender: {
      name: "Premium Metals Co.",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  },
  {
    id: "2",
    type: "price",
    title: "Price Alert: Gold Bullion",
    message: "Gold Bullion - 1oz has reached your target price of $1,950. Current price: $1,948.",
    timestamp: "4 hours ago",
    read: false,
    actionUrl: "/product/gold-1oz",
    actionText: "View Product",
    sender: null,
  },
  {
    id: "3",
    type: "system",
    title: "Account Verification Complete",
    message: "Your KYC verification has been approved. You can now make purchases up to $50,000.",
    timestamp: "1 day ago",
    read: true,
    actionUrl: "/profile",
    actionText: "View Profile",
    sender: null,
  },
  {
    id: "4",
    type: "order",
    title: "Order Delivered",
    message: "Your order #ORD-7289 for Silver Bars - 10oz has been delivered successfully.",
    timestamp: "2 days ago",
    read: true,
    actionUrl: "/order-tracking/ORD-7289",
    actionText: "Leave Review",
    sender: {
      name: "Silver Solutions Ltd.",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  },
  {
    id: "5",
    type: "alert",
    title: "Market Alert: High Volatility",
    message: "Precious metals market is experiencing high volatility. Consider reviewing your positions.",
    timestamp: "3 days ago",
    read: false,
    actionUrl: "/marketplace",
    actionText: "View Market",
    sender: null,
  },
  {
    id: "6",
    type: "price",
    title: "Price Drop: Silver Bars",
    message: "Silver Bars - 10oz price dropped by 5% to $275. Great buying opportunity!",
    timestamp: "3 days ago",
    read: true,
    actionUrl: "/product/silver-10oz",
    actionText: "Buy Now",
    sender: null,
  },
  {
    id: "7",
    type: "system",
    title: "New Feature: AI Insights",
    message: "Discover our new AI-powered market insights to make better investment decisions.",
    timestamp: "1 week ago",
    read: true,
    actionUrl: "/ai-insights",
    actionText: "Explore",
    sender: null,
  },
  {
    id: "8",
    type: "order",
    title: "Payment Confirmed",
    message: "Payment for order #ORD-7291 has been confirmed. Your order is being processed.",
    timestamp: "1 week ago",
    read: true,
    actionUrl: "/order-tracking/ORD-7291",
    actionText: "View Order",
    sender: {
      name: "TradeChain Platform",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  },
]
