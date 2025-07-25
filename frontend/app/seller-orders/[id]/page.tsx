"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  MessageSquare,
  Download,
  Eye,
  MapPin,
  Phone,
  Mail,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { RoleGuard } from "@/components/auth/role-guard"

interface OrderItem {
  id: string
  name: string
  image: string
  price: number
  quantity: number
  sku: string
}

interface Order {
  id: string
  orderNumber: string
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
  items: OrderItem[]
  total: number
  subtotal: number
  shipping: number
  tax: number
  escrowStatus: "pending" | "held" | "released" | "disputed"
  buyer: {
    id: string
    name: string
    email: string
    avatar?: string
    phone?: string
    rating: number
    totalOrders: number
  }
  shippingAddress: {
    name: string
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  paymentMethod: string
  createdAt: string
  updatedAt: string
  estimatedDelivery: string
  trackingNumber?: string
  notes?: string
}

const statusSteps = [
  { key: "pending", label: "Order Placed", icon: Clock },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle },
  { key: "processing", label: "Processing", icon: Package },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle },
]

export default function SellerOrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [newStatus, setNewStatus] = useState("")
  const [trackingNumber, setTrackingNumber] = useState("")
  const [notes, setNotes] = useState("")

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockOrder: Order = {
          id: params.id as string,
          orderNumber: `TC-${(params.id as string).toUpperCase()}`,
          status: "processing",
          items: [
            {
              id: "1",
              name: "Premium Wireless Headphones",
              image: "/placeholder.svg?height=80&width=80",
              price: 299.99,
              quantity: 1,
              sku: "WH-001",
            },
            {
              id: "2",
              name: "Wireless Charging Pad",
              image: "/placeholder.svg?height=80&width=80",
              price: 49.99,
              quantity: 2,
              sku: "CP-002",
            },
          ],
          subtotal: 399.97,
          shipping: 15.99,
          tax: 32.0,
          total: 447.96,
          escrowStatus: "held",
          buyer: {
            id: "buyer-1",
            name: "John Smith",
            email: "john.smith@email.com",
            avatar: "/placeholder.svg?height=40&width=40",
            phone: "+1 (555) 123-4567",
            rating: 4.8,
            totalOrders: 23,
          },
          shippingAddress: {
            name: "John Smith",
            street: "123 Main Street, Apt 4B",
            city: "New York",
            state: "NY",
            zipCode: "10001",
            country: "United States",
          },
          paymentMethod: "Credit Card ending in 4242",
          createdAt: "2024-01-20T10:30:00Z",
          updatedAt: "2024-01-21T14:15:00Z",
          estimatedDelivery: "2024-01-25T18:00:00Z",
          trackingNumber: "TC123456789",
          notes: "Please handle with care - fragile items",
        }

        setOrder(mockOrder)
        setNewStatus(mockOrder.status)
        setTrackingNumber(mockOrder.trackingNumber || "")
        setNotes(mockOrder.notes || "")
      } catch (error) {
        console.error("Failed to fetch order:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [params.id])

  const handleStatusUpdate = async () => {
    if (!order || !newStatus) return

    setUpdating(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setOrder((prev) => (prev ? { ...prev, status: newStatus as any, updatedAt: new Date().toISOString() } : null))
    } catch (error) {
      console.error("Failed to update order status:", error)
    } finally {
      setUpdating(false)
    }
  }

  const getStatusProgress = (status: string) => {
    const statusIndex = statusSteps.findIndex((step) => step.key === status)
    return ((statusIndex + 1) / statusSteps.length) * 100
  }

  const getEscrowStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "held":
        return "bg-blue-500"
      case "released":
        return "bg-green-500"
      case "disputed":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-6">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-6">
            The order you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <RoleGuard allowedRoles={["seller"]}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Order {order.orderNumber}</h1>
              <p className="text-gray-600">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className={getEscrowStatusColor(order.escrowStatus)}>
              Escrow: {order.escrowStatus}
            </Badge>
            <Badge variant="secondary">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Progress value={getStatusProgress(order.status)} className="h-2" />
                  <div className="flex justify-between">
                    {statusSteps.map((step, index) => {
                      const Icon = step.icon
                      const isCompleted = statusSteps.findIndex((s) => s.key === order.status) >= index
                      const isCurrent = step.key === order.status

                      return (
                        <div key={step.key} className="flex flex-col items-center space-y-2">
                          <div
                            className={`p-2 rounded-full ${
                              isCompleted
                                ? "bg-green-500 text-white"
                                : isCurrent
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-200 text-gray-500"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <span
                            className={`text-xs text-center ${
                              isCurrent ? "font-medium text-blue-600" : "text-gray-600"
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="h-16 w-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Management */}
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="status" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="status">Update Status</TabsTrigger>
                    <TabsTrigger value="tracking">Tracking</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                  </TabsList>

                  <TabsContent value="status" className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Order Status</label>
                        <Select value={newStatus} onValueChange={setNewStatus}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        onClick={handleStatusUpdate}
                        disabled={updating || newStatus === order.status}
                        className="w-full"
                      >
                        {updating ? "Updating..." : "Update Status"}
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="tracking" className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Tracking Number</label>
                        <input
                          type="text"
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                          placeholder="Enter tracking number"
                        />
                      </div>
                      <Button className="w-full">Update Tracking</Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="notes" className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Order Notes</label>
                        <Textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Add notes about this order..."
                          rows={4}
                        />
                      </div>
                      <Button className="w-full">Save Notes</Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Buyer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Buyer Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={order.buyer.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{order.buyer.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{order.buyer.name}</p>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600">{order.buyer.rating}</span>
                        <span className="text-sm text-gray-600">({order.buyer.totalOrders} orders)</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{order.buyer.email}</span>
                    </div>
                    {order.buyer.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{order.buyer.phone}</span>
                      </div>
                    )}
                  </div>

                  <Button variant="outline" className="w-full bg-transparent">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Contact Buyer
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium">{order.shippingAddress.name}</p>
                      <p>{order.shippingAddress.street}</p>
                      <p>
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                      </p>
                      <p>{order.shippingAddress.country}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>${order.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${order.tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-2">Payment: {order.paymentMethod}</div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-2">
              <Button variant="outline" className="w-full bg-transparent">
                <Download className="mr-2 h-4 w-4" />
                Download Invoice
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                <Eye className="mr-2 h-4 w-4" />
                Print Shipping Label
              </Button>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  )
}
