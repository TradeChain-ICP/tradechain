// app/dashboard/seller/orders/page.tsx
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
  Edit,
  ArrowUpRight,
  Mail,
  Phone,
  MapPin,
} from "lucide-react"

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
import { useContentPadding } from "@/contexts/sidebar-context"

export default function SellerOrdersPage() {
  const { toast } = useToast()
  const { contentPadding } = useContentPadding()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [trackingNumber, setTrackingNumber] = useState("")
  const [shippingNotes, setShippingNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards")

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status.toLowerCase() === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleOrderSelect = (id: string) => {
    setSelectedOrders((prev) => 
      prev.includes(id) 
        ? prev.filter((orderId) => orderId !== id) 
        : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(filteredOrders.map((order) => order.id))
    }
  }

  const handleBulkAction = async (action: string) => {
    if (selectedOrders.length === 0) {
      toast({
        title: "No Orders Selected",
        description: "Please select orders to perform bulk actions.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "Bulk Action Complete",
        description: `${action} applied to ${selectedOrders.length} orders.`,
      })
      setSelectedOrders([])
    } catch (error) {
      toast({
        title: "Action Failed",
        description: "Failed to perform bulk action.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "Order Updated",
        description: `Order ${orderId} status changed to ${newStatus}.`,
      })
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update order status.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleShipOrder = async () => {
    if (!trackingNumber) {
      toast({
        title: "Missing Information",
        description: "Please enter a tracking number.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "Order Shipped",
        description: "Customer has been notified with tracking information.",
      })
      setTrackingNumber("")
      setShippingNotes("")
    } catch (error) {
      toast({
        title: "Shipping Failed",
        description: "Failed to ship order.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
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
    <div className={`py-6 pb-20 lg:pb-8 ${contentPadding}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order Management</h1>
          <p className="text-muted-foreground">Manage and fulfill your customer orders</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button variant="outline" className="bg-transparent" onClick={() => setIsLoading(true)}>
            <RefreshCw className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Order Status Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-6">
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
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search orders by ID or customer name..."
                    className="pl-8 text-base"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending ({statusCounts.pending})</SelectItem>
                    <SelectItem value="processing">
                      Processing ({statusCounts.processing})
                    </SelectItem>
                    <SelectItem value="shipped">Shipped ({statusCounts.shipped})</SelectItem>
                    <SelectItem value="delivered">Delivered ({statusCounts.delivered})</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" size="sm" className="bg-transparent">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-sm font-medium">{selectedOrders.length} orders selected</span>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('Mark as Processing')}
                  className="bg-transparent"
                  disabled={isLoading}
                >
                  <Package className="h-4 w-4 mr-2" />
                  Process
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('Print Labels')}
                  className="bg-transparent"
                  disabled={isLoading}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Print Labels
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('Export')}
                  className="bg-transparent"
                  disabled={isLoading}
                >
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Orders Display */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Orders</CardTitle>
              <CardDescription>
                {filteredOrders.length} of {mockOrders.length} orders
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'cards' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('cards')}
                className={viewMode !== 'cards' ? 'bg-transparent' : ''}
              >
                Cards
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
                className={viewMode !== 'table' ? 'bg-transparent' : ''}
              >
                Table
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'cards' ? (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <Card key={order.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Order Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={selectedOrders.includes(order.id)}
                            onCheckedChange={() => handleOrderSelect(order.id)}
                          />
                          <div>
                            <div className="font-semibold text-lg">#{order.id}</div>
                            <div className="text-sm text-muted-foreground">
                              {order.date} • {order.paymentMethod}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={getOrderStatusVariant(order.status)}>
                            {order.status}
                          </Badge>
                          {order.priority === 'urgent' && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Urgent
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={order.customer.avatar || '/placeholder.svg'} />
                            <AvatarFallback>{order.customer.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{order.customer.name}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                              <Mail className="h-3 w-3" />
                              {order.customer.email}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-xl">${order.total}</div>
                          <div className="text-sm text-muted-foreground">
                            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-sm">Order Items:</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {order.items.slice(0, 4).map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3 p-2 border rounded-lg"
                            >
                              <div className="relative h-12 w-12 overflow-hidden rounded">
                                <Image
                                  src={item.image || '/placeholder.svg'}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm truncate">{item.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  Qty: {item.quantity} • ${item.price.toFixed(2)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        {order.items.length > 4 && (
                          <div className="text-sm text-muted-foreground text-center">
                            +{order.items.length - 4} more items
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 pt-4 border-t">
                        <Link href={`/dashboard/seller/orders/${order.id}`}>
                          <Button variant="outline" size="sm" className="bg-transparent">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </Link>

                        {order.status === 'Pending' && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateStatus(order.id, 'Processing')}
                            disabled={isLoading}
                          >
                            <Package className="h-4 w-4 mr-2" />
                            Process Order
                          </Button>
                        )}

                        {order.status === 'Processing' && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm">
                                <Truck className="h-4 w-4 mr-2" />
                                Ship Order
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
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
                                    rows={3}
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button onClick={handleShipOrder} disabled={isLoading}>
                                  {isLoading ? 'Shipping...' : 'Ship Order'}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}

                        <Button variant="outline" size="sm" className="bg-transparent">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Contact
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>More Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Print Invoice
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Print Shipping Label
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Order
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
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
                    <TableHead className="hidden md:table-cell">Products</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden lg:table-cell">Date</TableHead>
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
                          {order.priority === 'urgent' && (
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
                            <AvatarImage src={order.customer.avatar || '/placeholder.svg'} />
                            <AvatarFallback>{order.customer.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{order.customer.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {order.customer.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="space-y-1">
                          {order.items.slice(0, 2).map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div className="relative h-6 w-6 overflow-hidden rounded">
                                <Image
                                  src={item.image || '/placeholder.svg'}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <span className="text-sm truncate">{item.name}</span>
                              <span className="text-xs text-muted-foreground">
                                ×{item.quantity}
                              </span>
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{order.items.length - 2} more items
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">${order.total}</TableCell>
                      <TableCell>
                        <Badge variant={getOrderStatusVariant(order.status)}>{order.status}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground hidden lg:table-cell">
                        {order.date}
                      </TableCell>
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
                              <Link href={`/dashboard/seller/orders/${order.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {order.status === 'Pending' && (
                              <DropdownMenuItem
                                onClick={() => handleUpdateStatus(order.id, 'Processing')}
                              >
                                <Package className="h-4 w-4 mr-2" />
                                Mark as Processing
                              </DropdownMenuItem>
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
            </div>
          )}

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No orders found</h2>
              <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : "You haven't received any orders yet."}
              </p>
              {searchQuery || statusFilter !== 'all' ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }}
                  className="bg-transparent"
                >
                  Clear Filters
                </Button>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Start by adding products to your inventory
                  </p>
                  <Link href="/dashboard/seller/add-product">
                    <Button>
                      <Package className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
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
    id: 'ORD-7292',
    customer: {
      name: 'Alex Johnson',
      email: 'alex.johnson@email.com',
      avatar: '/placeholder.svg?height=32&width=32',
    },
    items: [
      {
        name: 'Gold Bullion - 1oz',
        quantity: 2,
        price: 1950.0,
        image: '/placeholder.svg?height=48&width=48',
      },
      {
        name: 'Silver Bars - 10oz',
        quantity: 1,
        price: 280.0,
        image: '/placeholder.svg?height=48&width=48',
      },
    ],
    total: '4,180.00',
    status: 'Pending',
    priority: 'urgent',
    date: 'Jul 25, 2024',
    paymentMethod: 'ICP Tokens',
  },
  {
    id: 'ORD-7291',
    customer: {
      name: 'Sarah Mitchell',
      email: 'sarah.mitchell@email.com',
      avatar: '/placeholder.svg?height=32&width=32',
    },
    items: [
      {
        name: 'Platinum Coin - 1oz',
        quantity: 1,
        price: 980.0,
        image: '/placeholder.svg?height=48&width=48',
      },
    ],
    total: '980.00',
    status: 'Processing',
    priority: 'normal',
    date: 'Jul 24, 2024',
    paymentMethod: 'Credit Card',
  },
  {
    id: 'ORD-7290',
    customer: {
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      avatar: '/placeholder.svg?height=32&width=32',
    },
    items: [
      {
        name: 'Gold Bar - 10oz',
        quantity: 1,
        price: 19500.0,
        image: '/placeholder.svg?height=48&width=48',
      },
    ],
    total: '19,500.00',
    status: 'Shipped',
    priority: 'normal',
    date: 'Jul 22, 2024',
    paymentMethod: 'ICP Tokens',
  },
  {
    id: 'ORD-7289',
    customer: {
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@email.com',
      avatar: '/placeholder.svg?height=32&width=32',
    },
    items: [
      {
        name: 'Silver Bars - 10oz',
        quantity: 3,
        price: 280.0,
        image: '/placeholder.svg?height=48&width=48',
      },
      {
        name: 'Gold Bullion - 1oz',
        quantity: 1,
        price: 1950.0,
        image: '/placeholder.svg?height=48&width=48',
      },
    ],
    total: '2,790.00',
    status: 'Delivered',
    priority: 'normal',
    date: 'Jul 20, 2024',
    paymentMethod: 'Credit Card',
  },
  {
    id: 'ORD-7288',
    customer: {
      name: 'David Thompson',
      email: 'david.thompson@email.com',
      avatar: '/placeholder.svg?height=32&width=32',
    },
    items: [
      {
        name: 'Premium Wheat',
        quantity: 100,
        price: 7.25,
        image: '/placeholder.svg?height=48&width=48',
      },
      {
        name: 'Coffee Beans',
        quantity: 5,
        price: 180.0,
        image: '/placeholder.svg?height=48&width=48',
      },
    ],
    total: '1,625.00',
    status: 'Processing',
    priority: 'normal',
    date: 'Jul 18, 2024',
    paymentMethod: 'ICP Tokens',
  },
  {
    id: 'ORD-7287',
    customer: {
      name: 'Lisa Chen',
      email: 'lisa.chen@email.com',
      avatar: '/placeholder.svg?height=32&width=32',
    },
    items: [
      {
        name: 'Crude Oil Futures',
        quantity: 10,
        price: 75.0,
        image: '/placeholder.svg?height=48&width=48',
      },
    ],
    total: '750.00',
    status: 'Pending',
    priority: 'normal',
    date: 'Jul 17, 2024',
    paymentMethod: 'Credit Card',
  },
  {
    id: 'ORD-7286',
    customer: {
      name: 'Robert Wilson',
      email: 'robert.wilson@email.com',
      avatar: '/placeholder.svg?height=32&width=32',
    },
    items: [
      {
        name: 'Pine Lumber',
        quantity: 2,
        price: 450.0,
        image: '/placeholder.svg?height=48&width=48',
      },
      {
        name: 'Premium Wheat',
        quantity: 50,
        price: 7.25,
        image: '/placeholder.svg?height=48&width=48',
      },
    ],
    total: '1,262.50',
    status: 'Shipped',
    priority: 'normal',
    date: 'Jul 15, 2024',
    paymentMethod: 'ICP Tokens',
  },
];