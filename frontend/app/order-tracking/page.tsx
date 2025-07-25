"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Package, Truck, CheckCircle, Clock, MapPin, MessageCircle } from "lucide-react"

import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function OrderTrackingPage() {
  const [selectedOrder, setSelectedOrder] = useState("ORD-7292")

  return (
    <DashboardLayout userRole="buyer">
      <div className="container mx-auto px-4 py-6 pb-20 lg:pb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Order Tracking</h1>
            <p className="text-muted-foreground">Track your orders and delivery status</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Orders List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Click on an order to view details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockOrders.map((order) => (
                  <div
                    key={order.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedOrder === order.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedOrder(order.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{order.id}</span>
                      <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>{order.date}</p>
                      <p>
                        {order.itemCount} items • ${order.total}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Details */}
          <div className="lg:col-span-2">
            {mockOrders.map(
              (order) =>
                selectedOrder === order.id && (
                  <div key={order.id} className="space-y-6">
                    {/* Order Header */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>Order {order.id}</CardTitle>
                            <CardDescription>
                              Placed on {order.date} • {order.itemCount} items
                            </CardDescription>
                          </div>
                          <Badge variant={getStatusVariant(order.status)} className="text-sm">
                            {order.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Total Amount</span>
                            <p className="text-muted-foreground">${order.total}</p>
                          </div>
                          <div>
                            <span className="font-medium">Payment Method</span>
                            <p className="text-muted-foreground">{order.paymentMethod}</p>
                          </div>
                          <div>
                            <span className="font-medium">Estimated Delivery</span>
                            <p className="text-muted-foreground">{order.estimatedDelivery}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Tracking Progress */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Tracking Progress</CardTitle>
                        <CardDescription>Real-time updates on your order status</CardDescription>
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

                    {/* Seller Information */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Seller Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
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
                              <div className="text-sm text-muted-foreground">
                                Response time: {order.seller.responseTime}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="bg-transparent">
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Contact Seller
                            </Button>
                            <Link href={`/seller/${order.seller.name}`}>
                              <Button variant="outline" size="sm" className="bg-transparent">
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
                          <CardDescription>Your payment is securely held until delivery</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span>Escrow Amount:</span>
                              <span className="font-medium">${order.escrow.amount}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Status:</span>
                              <Badge variant={order.escrow.status === "held" ? "secondary" : "default"}>
                                {order.escrow.status === "held" ? "Funds Held" : "Released"}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Auto-release:</span>
                              <span className="text-sm text-muted-foreground">{order.escrow.autoRelease}</span>
                            </div>

                            {order.escrow.status === "held" && order.status === "Delivered" && (
                              <div className="bg-green-50 p-3 rounded-md">
                                <p className="text-sm text-green-700 mb-2">
                                  Order has been delivered. You can now release the escrow funds.
                                </p>
                                <Button size="sm" className="w-full">
                                  Release Escrow Funds
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Actions */}
                    <div className="flex gap-4">
                      <Button variant="outline" className="flex-1 bg-transparent">
                        Download Invoice
                      </Button>
                      <Button variant="outline" className="flex-1 bg-transparent">
                        Report Issue
                      </Button>
                      {order.status === "Delivered" && (
                        <Link href={`/product/${order.items[0].id}/review`} className="flex-1">
                          <Button className="w-full">Leave Review</Button>
                        </Link>
                      )}
                    </div>
                  </div>
                ),
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

// Helper functions
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
const mockOrders = [
  {
    id: "ORD-7292",
    date: "Jul 25, 2024",
    status: "In Transit",
    itemCount: 2,
    total: "4,180.00",
    paymentMethod: "ICP Tokens",
    estimatedDelivery: "Jul 28, 2024",
    seller: {
      name: "Premium Metals Co.",
      verified: true,
      responseTime: "< 1 hour",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    escrow: {
      amount: "4,180.00",
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
  },
  {
    id: "ORD-7291",
    date: "Jul 21, 2024",
    status: "Delivered",
    itemCount: 1,
    total: "1,950.00",
    paymentMethod: "Credit Card",
    estimatedDelivery: "Jul 23, 2024",
    seller: {
      name: "Golden Assets LLC",
      verified: true,
      responseTime: "< 2 hours",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    escrow: {
      amount: "1,950.00",
      status: "released",
      autoRelease: "Released on delivery",
    },
    timeline: [
      {
        type: "order",
        title: "Order Placed",
        description: "Your order has been successfully placed.",
        time: "Jul 21, 3:45 PM",
        location: null,
        completed: true,
      },
      {
        type: "processing",
        title: "Order Processed",
        description: "Order has been processed and packaged.",
        time: "Jul 21, 5:30 PM",
        location: "Golden Assets Facility",
        completed: true,
      },
      {
        type: "shipped",
        title: "Order Shipped",
        description: "Package shipped via FedEx Express.",
        time: "Jul 22, 10:00 AM",
        location: "Chicago, IL",
        completed: true,
      },
      {
        type: "delivered",
        title: "Delivered",
        description: "Package delivered successfully.",
        time: "Jul 23, 2:15 PM",
        location: "Your Address",
        completed: true,
      },
    ],
    items: [
      {
        id: "3",
        name: "Gold Bullion - 1oz Canadian Maple",
        description: "99.99% pure gold coin from Royal Canadian Mint",
        price: 1950.0,
        quantity: 1,
        category: "Precious Metals",
        image: "/placeholder.svg?height=60&width=60",
      },
    ],
  },
  {
    id: "ORD-7290",
    date: "Jul 15, 2024",
    status: "Processing",
    itemCount: 3,
    total: "2,890.00",
    paymentMethod: "ICP Tokens",
    estimatedDelivery: "Jul 30, 2024",
    seller: {
      name: "AgriTrade Solutions",
      verified: true,
      responseTime: "< 4 hours",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    escrow: {
      amount: "2,890.00",
      status: "held",
      autoRelease: "7 days after delivery",
    },
    timeline: [
      {
        type: "order",
        title: "Order Placed",
        description: "Your agricultural commodities order has been placed.",
        time: "Jul 15, 11:20 AM",
        location: null,
        completed: true,
      },
      {
        type: "processing",
        title: "Order Processing",
        description: "Seller is preparing your agricultural products.",
        time: "Jul 15, 4:00 PM",
        location: "AgriTrade Warehouse",
        completed: true,
      },
      {
        type: "shipped",
        title: "Awaiting Shipment",
        description: "Order is being prepared for shipment.",
        time: "Pending",
        location: "Processing Facility",
        completed: false,
      },
      {
        type: "delivered",
        title: "Delivery",
        description: "Estimated delivery date.",
        time: "Jul 30, 2024",
        location: "Your Address",
        completed: false,
      },
    ],
    items: [
      {
        id: "4",
        name: "Premium Wheat",
        description: "Hard red winter wheat, grade A",
        price: 7.25,
        quantity: 100,
        category: "Agriculture",
        image: "/placeholder.svg?height=60&width=60",
      },
      {
        id: "5",
        name: "Coffee Beans",
        description: "Premium Arabica coffee beans",
        price: 180.0,
        quantity: 5,
        category: "Agriculture",
        image: "/placeholder.svg?height=60&width=60",
      },
      {
        id: "6",
        name: "Soybeans",
        description: "Non-GMO soybeans, premium quality",
        price: 14.5,
        quantity: 100,
        category: "Agriculture",
        image: "/placeholder.svg?height=60&width=60",
      },
    ],
  },
]
