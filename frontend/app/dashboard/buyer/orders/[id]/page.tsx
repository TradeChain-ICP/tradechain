// app/dashboard/buyer/orders/[id]/page.tsx
"use client"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Package, Truck, CheckCircle, Clock, MapPin, MessageCircle, Download, Star } from "lucide-react"
import { useContentPadding } from "@/contexts/sidebar-context"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"

export async function generateStaticParams() {
  return [];
}

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const orderId = params.id
  const { contentPadding, containerWidth } = useContentPadding()

  // Find the order (in real app, this would be fetched from API)
  const order = mockOrderDetails

  const handleContactSeller = () => {
    toast({
      title: "Opening Chat",
      description: "Opening chat with seller...",
    })
  }

  const handleReleaseEscrow = () => {
    toast({
      title: "Escrow Released",
      description: "Funds have been released to the seller.",
    })
  }

  const handleReportIssue = () => {
    toast({
      title: "Issue Reported",
      description: "Your issue has been reported to our support team.",
    })
  }

  return (
    <div className={`min-h-screen ${contentPadding}`}>
      <div className={`mx-auto space-y-6 ${containerWidth}`}>
        <div className="flex items-center gap-4">
          <Link href="/dashboard/buyer/orders">
            <Button variant="outline" size="sm" className="bg-transparent">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Order {orderId}</h1>
            <p className="text-muted-foreground">Placed on {order.date}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
                <CardDescription>Track your order progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <Progress value={getProgressValue(order.status)} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Order Placed</span>
                      <span>Processing</span>
                      <span>Shipped</span>
                      <span>Delivered</span>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="space-y-4">
                    {order.timeline.map((event, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div
                          className={`rounded-full p-2 ${
                            event.completed ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {getTimelineIcon(event.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{event.title}</h4>
                            <span className="text-sm text-muted-foreground">{event.time}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{event.description}</p>
                          {event.location && (
                            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              <span>{event.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
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
                    <div key={item.id} className="flex items-center gap-4 p-3 border rounded-lg">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={60}
                        height={60}
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
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Shipping Address</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Alex Johnson</p>
                      <p>123 Main Street</p>
                      <p>New York, NY 10001</p>
                      <p>United States</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Shipping Method</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Express Shipping</p>
                      <p>Tracking: {order.trackingNumber}</p>
                      <p>Carrier: FedEx</p>
                      <p>Est. Delivery: {order.estimatedDelivery}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${order.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{order.shipping === "0.00" ? "Free" : `$${order.shipping}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${order.tax}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-medium text-lg">
                      <span>Total</span>
                      <span>${order.total}</span>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>Payment Method: {order.paymentMethod}</p>
                  <p>Order ID: {order.id}</p>
                </div>
              </CardContent>
            </Card>

            {/* Seller Information */}
            <Card>
              <CardHeader>
                <CardTitle>Seller Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={order.seller.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{order.seller.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{order.seller.name}</span>
                        {order.seller.verified && (
                          <Badge variant="outline" className="text-xs">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{order.seller.rating}</span>
                        <span>• Response time: {order.seller.responseTime}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={handleContactSeller}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contact Seller
                    </Button>
                    <Link href={`/seller/${order.seller.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        View Store
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Escrow Status */}
            {order.escrow && (
              <Card>
                <CardHeader>
                  <CardTitle>Escrow Status</CardTitle>
                  <CardDescription>Your payment is securely held</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Escrow Amount:</span>
                      <span className="font-medium">${order.escrow.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <Badge variant={order.escrow.status === "held" ? "secondary" : "default"}>
                        {order.escrow.status === "held" ? "Funds Held" : "Released"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Auto-release:</span>
                      <span className="text-sm text-muted-foreground">{order.escrow.autoRelease}</span>
                    </div>
                  </div>

                  {order.escrow.status === "held" && order.status === "Delivered" && (
                    <div className="bg-green-50 p-3 rounded-md">
                      <p className="text-sm text-green-700 mb-2">
                        Order has been delivered. You can now release the escrow funds.
                      </p>
                      <Button size="sm" className="w-full" onClick={handleReleaseEscrow}>
                        Release Escrow Funds
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Download Invoice
                </Button>
                <Button variant="outline" className="w-full bg-transparent" onClick={handleReportIssue}>
                  Report Issue
                </Button>
                {order.status === "Delivered" && (
                  <Link href={`/dashboard/buyer/product/${order.items[0].id}/review`}>
                    <Button className="w-full">
                      <Star className="h-4 w-4 mr-2" />
                      Leave Review
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper functions
function getProgressValue(status: string) {
  switch (status) {
    case "Processing":
      return 25
    case "Shipped":
    case "In Transit":
      return 75
    case "Delivered":
      return 100
    default:
      return 0
  }
}

function getTimelineIcon(type: string) {
  switch (type) {
    case "order":
      return <Package className="h-4 w-4" />
    case "processing":
      return <Clock className="h-4 w-4" />
    case "shipped":
      return <Truck className="h-4 w-4" />
    case "delivered":
      return <CheckCircle className="h-4 w-4" />
    default:
      return <Clock className="h-4 w-4" />
  }
}

// Mock data
const mockOrderDetails = {
  id: "ORD-7292",
  date: "Jul 25, 2024",
  status: "In Transit",
  subtotal: "4,180.00",
  shipping: "0.00",
  tax: "334.40",
  total: "4,514.40",
  paymentMethod: "ICP Tokens",
  trackingNumber: "1Z999AA1234567890",
  estimatedDelivery: "Jul 28, 2024",
  seller: {
    id: "seller1",
    name: "Premium Metals Co.",
    verified: true,
    rating: 4.9,
    responseTime: "< 1 hour",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  escrow: {
    amount: "4,514.40",
    status: "held",
    autoRelease: "3 days after delivery",
  },
  timeline: [
    {
      type: "order",
      title: "Order Placed",
      description: "Your order has been successfully placed and payment confirmed.",
      time: "Jul 25, 10:30 AM",
      location: null,
      completed: true,
    },
    {
      type: "processing",
      title: "Order Processing",
      description: "Seller is preparing your items for shipment.",
      time: "Jul 25, 2:15 PM",
      location: "Premium Metals Co. Warehouse",
      completed: true,
    },
    {
      type: "shipped",
      title: "Order Shipped",
      description: "Your order has been shipped and is on its way.",
      time: "Jul 26, 9:00 AM",
      location: "New York, NY",
      completed: true,
    },
    {
      type: "delivered",
      title: "Out for Delivery",
      description: "Your package is out for delivery and will arrive today.",
      time: "Jul 28, 8:00 AM",
      location: "Local Delivery Hub",
      completed: false,
    },
  ],
  items: [
    {
      id: "1",
      name: "Gold Bullion - 1oz American Eagle",
      description: "99.9% pure gold bullion coin",
      price: 1950.0,
      quantity: 2,
      category: "Precious Metals",
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "2",
      name: "Silver Bars - 10oz",
      description: "Fine silver bars with certificate",
      price: 280.0,
      quantity: 1,
      category: "Precious Metals",
      image: "/placeholder.svg?height=60&width=60",
    },
  ],
}