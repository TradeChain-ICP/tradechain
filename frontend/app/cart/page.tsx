"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react"

import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"

export default function CartPage() {
  const { toast } = useToast()
  const [cartItems, setCartItems] = useState(mockCartItems)

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return

    setCartItems((items) => items.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))

    toast({
      title: "Cart Updated",
      description: "Item quantity has been updated.",
    })
  }

  const removeItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id))
    toast({
      title: "Item Removed",
      description: "Item has been removed from your cart.",
    })
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 1000 ? 0 : 25
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is Empty",
        description: "Add some items to your cart before checking out.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Proceeding to Checkout",
      description: "Redirecting to secure checkout...",
    })

    // In real app, would navigate to checkout
    window.location.href = "/checkout"
  }

  if (cartItems.length === 0) {
    return (
      <DashboardLayout userRole="buyer">
        <div className="container mx-auto px-4 py-8 pb-20 lg:pb-8">
          <div className="text-center py-12">
            <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">Looks like you haven't added any items to your cart yet.</p>
            <Link href="/marketplace">
              <Button>
                Continue Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole="buyer">
      <div className="container mx-auto px-4 py-6 pb-20 lg:pb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Shopping Cart</h1>
          <Badge variant="secondary">{cartItems.length} items</Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {item.category}
                            </Badge>
                            {item.verified && (
                              <Badge variant="outline" className="text-xs">
                                Verified
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="px-3 py-1 min-w-[50px] text-center">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                          <div className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</div>
                        </div>
                      </div>

                      {item.quantity >= item.stock && (
                        <p className="text-sm text-amber-600">Only {item.stock} items available</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {shipping === 0 && (
                  <div className="bg-green-50 p-3 rounded-md">
                    <p className="text-sm text-green-700">🎉 You qualify for free shipping!</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Button onClick={handleCheckout} className="w-full" size="lg">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Link href="/marketplace">
                    <Button variant="outline" className="w-full bg-transparent">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Secure checkout with escrow protection</p>
                  <p>• 30-day return policy</p>
                  <p>• Fully insured shipping</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recommended Products */}
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {recommendedProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="aspect-square relative">
                  <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium line-clamp-2">{product.name}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold">${product.price}</span>
                    <Badge variant="secondary" className="text-xs">
                      {product.category}
                    </Badge>
                  </div>
                  <Link href={`/product/${product.id}`}>
                    <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent">
                      View Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

// Mock data
const mockCartItems = [
  {
    id: "1",
    name: "Gold Bullion - 1oz American Eagle",
    description: "99.9% pure gold bullion coin",
    price: 1950.0,
    quantity: 2,
    stock: 25,
    category: "Precious Metals",
    verified: true,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "2",
    name: "Silver Bars - 10oz",
    description: "Fine silver bars with certificate",
    price: 280.0,
    quantity: 1,
    stock: 50,
    category: "Precious Metals",
    verified: true,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: "3",
    name: "Premium Wheat",
    description: "Hard red winter wheat, grade A",
    price: 7.25,
    quantity: 100,
    stock: 500,
    category: "Agriculture",
    verified: true,
    image: "/placeholder.svg?height=80&width=80",
  },
]

const recommendedProducts = [
  {
    id: "4",
    name: "Platinum Coins - 1oz",
    price: "980.00",
    category: "Metals",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "5",
    name: "Coffee Beans - Premium",
    price: "180.00",
    category: "Agriculture",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "6",
    name: "Crude Oil Futures",
    price: "75.00",
    category: "Oil & Gas",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "7",
    name: "Pine Lumber",
    price: "450.00",
    category: "Timber",
    image: "/placeholder.svg?height=200&width=200",
  },
]
