"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Package, Search, Eye, MessageCircle, RefreshCw, Download } from "lucide-react"

import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { RoleGuard } from "@/components/auth/role-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function OrdersPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date-desc")

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = statusFilter === "all" || order.status.toLowerCase() === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleReorder = (orderId: string) => {
    toast({
      title: "Items Added to Cart",
      description: "All items from this order have been added to your cart.",
    })
  }

  const handleContactSeller = (sellerId: string) => {
    toast({
      title: "Opening Chat",
      description: "Opening chat with seller...",
    })
  }

  return (
    <RoleGuard allowedRoles={["buyer"]}>
      <DashboardLayout userRole="buyer">
        <div className="container mx-auto px-4 py-6 pb-20 lg:pb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">My Orders</h1>
              <p className="text-muted-foreground">Track and manage your commodity orders</p>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                    <p className="text-2xl font-bold">{mockOrders.length}</p>
                  </div>
                  <Package className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">In Transit</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {mockOrders.filter((o) => o.status === "In Transit").length}
                    </p>
                  </div>
                  <div className="text-blue-600">🚚</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Delivered</p>
                    <p className="text-2xl font-bold text-green-600">
                      {mockOrders.filter((o) => o.status === "Delivered").length}
                    </p>
                  </div>
                  <div className="text-green-600">✅</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Processing</p>
                    <p className="text-2xl font-bold text-amber-600">
                      {mockOrders.filter((o) => o.status === "Processing").length}
                    </p>
                  </div>
                  <div className="text-amber-600">⏳</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search orders..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="in transit">In Transit</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date-desc">Newest First</SelectItem>
                      <SelectItem value="date-asc">Oldest First</SelectItem>
                      <SelectItem value="amount-desc">Highest Amount</SelectItem>
                      <SelectItem value="amount-asc">Lowest Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Order {order.id}</CardTitle>
                      <CardDescription>
                        {order.date} • {order.items.length} items • ${order.total}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/orders/${order.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    {order.items.slice(0, 2).map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={48}
                          height={48}
                          className="rounded-md"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {item.category}
                            </Badge>
                            <span className="text-sm">Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                          <div className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</div>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <div className="text-center text-sm text-muted-foreground">
                        +{order.items.length - 2} more items
                      </div>
                    )}
                  </div>

                  {/* Seller Info */}
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={order.seller.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{order.seller.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{order.seller.name}</span>
                          {order.seller.verified && (
                            <Badge variant="outline" className="text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">Response time: {order.seller.responseTime}</div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">{order.paymentMethod}</div>
                  </div>

                  {/* Order Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <Link href={`/orders/${order.id}`}>
                      <Button variant="outline" size="sm" className="bg-transparent">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </Link>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReorder(order.id)}
                      className="bg-transparent"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reorder
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleContactSeller(order.seller.id)}
                      className="bg-transparent"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contact Seller
                    </Button>

                    <Button variant="outline" size="sm" className="bg-transparent">
                      <Download className="h-4 w-4 mr-2" />
                      Invoice
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No orders found</h2>
              <p className="text-muted-foreground mb-4">Try adjusting your search or filter criteria.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setStatusFilter("all")
                }}
                className="bg-transparent"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </DashboardLayout>
    </RoleGuard>
  )
}

// Helper function
function getStatusVariant(status: string) {
  switch (status) {
    case "Delivered":
      return "default"
    case "In Transit":
      return "secondary"
    case "Processing":
      return "outline"
    case "Cancelled":
      return "destructive"
    default:
      return "outline"
  }
}

// Mock data
const mockOrders = [
  {
    id: "ORD-7292",
    date: "Jul 25, 2024",
    status: "In Transit",
    total: "4,180.00",
    paymentMethod: "ICP Tokens",
    seller: {
      id: "seller1",
      name: "Premium Metals Co.",
      verified: true,
      responseTime: "< 1 hour",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    items: [
      {
        id: "1",
        name: "Gold Bullion - 1oz American Eagle",
        description: "99.9% pure gold bullion coin",
        price: 1950.0,
        quantity: 2,
        category: "Precious Metals",
        image: "/placeholder.svg?height=48&width=48",
      },
      {
        id: "2",
        name: "Silver Bars - 10oz",
        description: "Fine silver bars with certificate",
        price: 280.0,
        quantity: 1,
        category: "Precious Metals",
        image: "/placeholder.svg?height=48&width=48",
      },
    ],
  },
  {
    id: "ORD-7291",
    date: "Jul 21, 2024",
    status: "Delivered",
    total: "1,950.00",
    paymentMethod: "Credit Card",
    seller: {
      id: "seller2",
      name: "Golden Assets LLC",
      verified: true,
      responseTime: "< 2 hours",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    items: [
      {
        id: "3",
        name: "Gold Bullion - 1oz Canadian Maple",
        description: "99.99% pure gold coin from Royal Canadian Mint",
        price: 1950.0,
        quantity: 1,
        category: "Precious Metals",
        image: "/placeholder.svg?height=48&width=48",
      },
    ],
  },
  {
    id: "ORD-7290",
    date: "Jul 15, 2024",
    status: "Processing",
    total: "2,890.00",
    paymentMethod: "ICP Tokens",
    seller: {
      id: "seller3",
      name: "AgriTrade Solutions",
      verified: true,
      responseTime: "< 4 hours",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    items: [
      {
        id: "4",
        name: "Premium Wheat",
        description: "Hard red winter wheat, grade A",
        price: 7.25,
        quantity: 100,
        category: "Agriculture",
        image: "/placeholder.svg?height=48&width=48",
      },
      {
        id: "5",
        name: "Coffee Beans",
        description: "Premium Arabica coffee beans",
        price: 180.0,
        quantity: 5,
        category: "Agriculture",
        image: "/placeholder.svg?height=48&width=48",
      },
    ],
  },
]
