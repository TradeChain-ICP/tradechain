"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Download, Eye, RefreshCw, Search, Calendar, Package, Star } from "lucide-react"
import { useContentPadding } from "@/contexts/sidebar-context"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function PurchaseHistoryPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date-desc")
  const { contentPadding, containerWidth } = useContentPadding()

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = statusFilter === "all" || order.status.toLowerCase() === statusFilter
    const matchesCategory =
      categoryFilter === "all" || order.items.some((item) => item.category.toLowerCase() === categoryFilter)
    return matchesSearch && matchesStatus && matchesCategory
  })

  const handleReorder = (orderId: string) => {
    toast({
      title: "Items Added to Cart",
      description: "All items from this order have been added to your cart.",
    })
  }

  const handleDownloadInvoice = (orderId: string) => {
    toast({
      title: "Downloading Invoice",
      description: `Invoice for order ${orderId} is being downloaded.`,
    })
  }

  const handleLeaveReview = (orderId: string) => {
    toast({
      title: "Review Form",
      description: "Opening review form for this order.",
    })
  }

  return (
    <div className={`min-h-screen ${contentPadding}`}>
      <div className={`mx-auto space-y-6 ${containerWidth}`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Purchase History</h1>
            <p className="text-muted-foreground">View and manage your past orders</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
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

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="in transit">In Transit</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="metals">Precious Metals</SelectItem>
                  <SelectItem value="oil">Oil & Gas</SelectItem>
                  <SelectItem value="agriculture">Agriculture</SelectItem>
                  <SelectItem value="timber">Timber</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Newest First</SelectItem>
                  <SelectItem value="date-asc">Oldest First</SelectItem>
                  <SelectItem value="amount-desc">Highest Amount</SelectItem>
                  <SelectItem value="amount-asc">Lowest Amount</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="bg-transparent">
                <Calendar className="h-4 w-4 mr-2" />
                Date Range
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-4">
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
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold">
                    $
                    {mockOrders
                      .reduce((sum, order) => sum + Number.parseFloat(order.total.replace(/,/g, "")), 0)
                      .toLocaleString()}
                  </p>
                </div>
                <div className="text-green-600">$</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">
                    {mockOrders.filter((order) => order.date.includes("Jul")).length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Order</p>
                  <p className="text-2xl font-bold">
                    $
                    {(
                      mockOrders.reduce((sum, order) => sum + Number.parseFloat(order.total.replace(/,/g, "")), 0) /
                      mockOrders.length
                    ).toFixed(0)}
                  </p>
                </div>
                <div className="text-blue-600">≈</div>
              </div>
            </CardContent>
          </Card>
        </div>

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
                      <Link href={`/dashboard/buyer/orders/${order.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {order.items.map((item) => (
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
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{order.seller.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">{order.paymentMethod}</div>
                </div>

                {/* Order Actions */}
                <div className="flex items-center gap-2 pt-2">
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
                    onClick={() => handleDownloadInvoice(order.id)}
                    className="bg-transparent"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Invoice
                  </Button>

                  {order.status === "Delivered" && !order.reviewed && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleLeaveReview(order.id)}
                      className="bg-transparent"
                    >
                      <Star className="h-4 w-4 mr-2" />
                      Review
                    </Button>
                  )}

                  <Link href={`/dashboard/buyer/orders/${order.id}`}>
                    <Button variant="outline" size="sm" className="bg-transparent">
                      <Eye className="h-4 w-4 mr-2" />
                      Track Order
                    </Button>
                  </Link>
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
                setCategoryFilter("all")
              }}
              className="bg-transparent"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* AI Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>AI Reorder Suggestions</CardTitle>
            <CardDescription>Based on your purchase history and market trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockReorderSuggestions.map((suggestion) => (
                <div key={suggestion.id} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <Image
                      src={suggestion.image || "/placeholder.svg"}
                      alt={suggestion.name}
                      width={40}
                      height={40}
                      className="rounded-md"
                    />
                    <div>
                      <h4 className="font-medium text-sm">{suggestion.name}</h4>
                      <p className="text-xs text-muted-foreground">{suggestion.reason}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">${suggestion.currentPrice}</div>
                      <div className="text-xs text-muted-foreground">Last bought: ${suggestion.lastPrice}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="outline" size="sm" className="bg-transparent">
                        <Link href={`/dashboard/buyer/product/${suggestion.productId}`}>View</Link>
                      </Button>
                      <Button size="sm">Add to Cart</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
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
    reviewed: false,
    seller: {
      name: "Premium Metals Co.",
      verified: true,
      rating: 4.9,
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
    reviewed: false,
    seller: {
      name: "Golden Assets LLC",
      verified: true,
      rating: 4.8,
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
    reviewed: false,
    seller: {
      name: "AgriTrade Solutions",
      verified: true,
      rating: 4.7,
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
      {
        id: "6",
        name: "Soybeans",
        description: "Non-GMO soybeans, premium quality",
        price: 14.5,
        quantity: 100,
        category: "Agriculture",
        image: "/placeholder.svg?height=48&width=48",
      },
    ],
  },
  {
    id: "ORD-7289",
    date: "Jul 10, 2024",
    status: "Delivered",
    total: "750.00",
    paymentMethod: "ICP Tokens",
    reviewed: true,
    seller: {
      name: "Energy Commodities Inc.",
      verified: true,
      rating: 4.6,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    items: [
      {
        id: "7",
        name: "Crude Oil Futures",
        description: "West Texas Intermediate crude oil",
        price: 75.0,
        quantity: 10,
        category: "Oil & Gas",
        image: "/placeholder.svg?height=48&width=48",
      },
    ],
  },
  {
    id: "ORD-7288",
    date: "Jul 5, 2024",
    status: "Delivered",
    total: "450.00",
    paymentMethod: "Credit Card",
    reviewed: true,
    seller: {
      name: "Timber Direct LLC",
      verified: true,
      rating: 4.5,
      avatar: "/placeholder.svg?height=32&width=32",
    },
    items: [
      {
        id: "8",
        name: "Pine Lumber",
        description: "Construction grade pine lumber",
        price: 450.0,
        quantity: 1,
        category: "Timber",
        image: "/placeholder.svg?height=48&width=48",
      },
    ],
  },
]

const mockReorderSuggestions = [
  {
    id: "1",
    name: "Gold Bullion - 1oz",
    reason: "Price dropped 2% since last purchase",
    currentPrice: "1,910.00",
    lastPrice: "1,950.00",
    productId: "1",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Coffee Beans",
    reason: "Usually reorder monthly",
    currentPrice: "185.00",
    lastPrice: "180.00",
    productId: "5",
    image: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "Silver Bars - 10oz",
    reason: "Market trend suggests good timing",
    currentPrice: "275.00",
    lastPrice: "280.00",
    productId: "2",
    image: "/placeholder.svg?height=40&width=40",
  },
]