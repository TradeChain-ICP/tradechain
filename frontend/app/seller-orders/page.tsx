"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertTriangle,
  MessageCircle,
  Download,
  RefreshCw,
} from "lucide-react"

import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function SellerOrdersPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [trackingNumber, setTrackingNumber] = useState("")
  const [shippingNotes, setShippingNotes] = useState("")

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status.toLowerCase() === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleOrderSelect = (id: string) => {
    setSelectedOrders((prev) => (prev.includes(id) ? prev.filter((orderId) => orderId !== id) : [...prev, id]))
  }

  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(filteredOrders.map((order) => order.id))
    }
  }

  const handleBulkAction = (action: string) => {
    if (selectedOrders.length === 0) {
      toast({
        title: "No Orders Selected",
        description: "Please select orders to perform bulk actions.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Bulk Action",
      description: `${action} applied to ${selectedOrders.length} orders.`,
    })
    setSelectedOrders([])
  }

  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    toast({
      title: "Order Updated",
      description: `Order ${orderId} status changed to ${newStatus}.`,
    })
  }

  const handleShipOrder = () => {
    if (!trackingNumber) {
      toast({
        title: "Missing Information",
        description: "Please enter a tracking number.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Order Shipped",
      description: "Customer has been notified with tracking information.",
    })
    setTrackingNumber("")
    setShippingNotes("")
  }

  const getStatusCounts = () => {
    return {
      all: mockOrders.length,
      pending: mockOrders.filter((o) => o.status === "Pending").length,
      processing: mockOrders.filter((o) => o.status === "Processing").length,
      shipped: mockOrders.filter((o) => o.status === "Shipped").length,
      delivered: mockOrders.filter((o) => o.status === "Delivered").length,
    }
  }

  const statusCounts = getStatusCounts()

  return (
    <DashboardLayout userRole="seller">
      <div className="container mx-auto px-4 py-6 pb-20 lg:pb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Order Management</h1>
            <p className="text-muted-foreground">Manage and fulfill your customer orders</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" className="bg-transparent">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Order Status Overview */}
        <div className="grid gap-4 md:grid-cols-5 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">All Orders</p>
                  <p className="text-2xl font-bold">{statusCounts.all}</p>
                </div>
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-amber-600">{statusCounts.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Processing</p>
                  <p className="text-2xl font-bold text-blue-600">{statusCounts.processing}</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Shipped</p>
                  <p className="text-2xl font-bold text-purple-600">{statusCounts.shipped}</p>
                </div>
                <Truck className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Delivered</p>
                  <p className="text-2xl font-bold text-green-600">{statusCounts.delivered}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
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
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" size="sm" className="bg-transparent">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedOrders.length > 0 && (
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{selectedOrders.length} orders selected</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction("Mark as Processing")}
                    className="bg-transparent"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Process
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction("Print Labels")}
                    className="bg-transparent"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Print Labels
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction("Export")}
                    className="bg-transparent"
                  >
                    Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Orders Table */}
        <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All ({statusCounts.all})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({statusCounts.pending})</TabsTrigger>
            <TabsTrigger value="processing">Processing ({statusCounts.processing})</TabsTrigger>
            <TabsTrigger value="shipped">Shipped ({statusCounts.shipped})</TabsTrigger>
            <TabsTrigger value="delivered">Delivered ({statusCounts.delivered})</TabsTrigger>
          </TabsList>

          <TabsContent value={statusFilter} className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Orders</CardTitle>
                <CardDescription>
                  {filteredOrders.length} of {mockOrders.length} orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedOrders.length === filteredOrders.length}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Order</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Products</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedOrders.includes(order.id)}
                            onCheckedChange={() => handleOrderSelect(order.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">#{order.id}</div>
                            {order.priority === "urgent" && (
                              <Badge variant="destructive" className="text-xs mt-1">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Urgent
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={order.customer.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{order.customer.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{order.customer.name}</div>
                              <div className="text-sm text-muted-foreground">{order.customer.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {order.items.slice(0, 2).map((item, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <div className="relative h-6 w-6 overflow-hidden rounded">
                                  <Image
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <span className="text-sm">{item.name}</span>
                                <span className="text-xs text-muted-foreground">×{item.quantity}</span>
                              </div>
                            ))}
                            {order.items.length > 2 && (
                              <div className="text-xs text-muted-foreground">+{order.items.length - 2} more items</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">${order.total}</TableCell>
                        <TableCell>
                          <Badge variant={getOrderStatusVariant(order.status)}>{order.status}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{order.date}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem asChild>
                                <Link href={`/seller-orders/${order.id}`}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {order.status === "Pending" && (
                                <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, "Processing")}>
                                  <Package className="h-4 w-4 mr-2" />
                                  Mark as Processing
                                </DropdownMenuItem>
                              )}
                              {order.status === "Processing" && (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                      <Truck className="h-4 w-4 mr-2" />
                                      Ship Order
                                    </DropdownMenuItem>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Ship Order #{order.id}</DialogTitle>
                                      <DialogDescription>
                                        Enter shipping details to mark this order as shipped.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div className="space-y-2">
                                        <Label htmlFor="tracking">Tracking Number</Label>
                                        <Input
                                          id="tracking"
                                          placeholder="Enter tracking number"
                                          value={trackingNumber}
                                          onChange={(e) => setTrackingNumber(e.target.value)}
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="notes">Shipping Notes (Optional)</Label>
                                        <Textarea
                                          id="notes"
                                          placeholder="Add any shipping notes..."
                                          value={shippingNotes}
                                          onChange={(e) => setShippingNotes(e.target.value)}
                                        />
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button onClick={handleShipOrder}>Ship Order</Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              )}
                              <DropdownMenuItem>
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Contact Customer
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Download className="h-4 w-4 mr-2" />
                                Print Invoice
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

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
  )
}

// Helper function
function getOrderStatusVariant(status: string) {
  switch (status) {
    case "Pending":
      return "secondary"
    case "Processing":
      return "outline"
    case "Shipped":
      return "default"
    case "Delivered":
      return "default"
    default:
      return "outline"
  }
}

// Mock data
const mockOrders = [
  {
    id: "ORD-7292",
    customer: {
      name: "Alex Johnson",
      email: "alex.johnson@email.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    items: [
      {
        name: "Gold Bullion - 1oz",
        quantity: 2,
        price: 1950.0,
        image: "/placeholder.svg?height=24&width=24",
      },
      {
        name: "Silver Bars - 10oz",
        quantity: 1,
        price: 280.0,
        image: "/placeholder.svg?height=24&width=24",
      },
    ],
    total: "4,180.00",
    status: "Pending",
    priority: "urgent",
    date: "Jul 25, 2024",
    paymentMethod: "ICP Tokens",
  },
  {
    id: "ORD-7291",
    customer: {
      name: "Sarah Mitchell",
      email: "sarah.mitchell@email.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    items: [
      {
        name: "Platinum Coin - 1oz",
        quantity: 1,
        price: 980.0,
        image: "/placeholder.svg?height=24&width=24",
      },
    ],
    total: "980.00",
    status: "Processing",
    priority: "normal",
    date: "Jul 24, 2024",
    paymentMethod: "Credit Card",
  },
  {
    id: "ORD-7290",
    customer: {
      name: "Michael Chen",
      email: "michael.chen@email.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    items: [
      {
        name: "Gold Bar - 10oz",
        quantity: 1,
        price: 19500.0,
        image: "/placeholder.svg?height=24&width=24",
      },
    ],
    total: "19,500.00",
    status: "Shipped",
    priority: "normal",
    date: "Jul 22, 2024",
    paymentMethod: "ICP Tokens",
  },
  {
    id: "ORD-7289",
    customer: {
      name: "Emily Rodriguez",
      email: "emily.rodriguez@email.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    items: [
      {
        name: "Silver Bars - 10oz",
        quantity: 3,
        price: 280.0,
        image: "/placeholder.svg?height=24&width=24",
      },
      {
        name: "Gold Bullion - 1oz",
        quantity: 1,
        price: 1950.0,
        image: "/placeholder.svg?height=24&width=24",
      },
    ],
    total: "2,790.00",
    status: "Delivered",
    priority: "normal",
    date: "Jul 20, 2024",
    paymentMethod: "Credit Card",
  },
  {
    id: "ORD-7288",
    customer: {
      name: "David Thompson",
      email: "david.thompson@email.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    items: [
      {
        name: "Premium Wheat",
        quantity: 100,
        price: 7.25,
        image: "/placeholder.svg?height=24&width=24",
      },
      {
        name: "Coffee Beans",
        quantity: 5,
        price: 180.0,
        image: "/placeholder.svg?height=24&width=24",
      },
    ],
    total: "1,625.00",
    status: "Processing",
    priority: "normal",
    date: "Jul 18, 2024",
    paymentMethod: "ICP Tokens",
  },
]
