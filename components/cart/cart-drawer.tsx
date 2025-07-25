"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, X, Plus, Minus, Trash2, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useToast } from "@/components/ui/use-toast"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  unit: string
  image: string
  seller: string
  category: string
  stock: number
}

interface CartDrawerProps {
  children: React.ReactNode
}

export function CartDrawer({ children }: CartDrawerProps) {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>(mockCartItems)

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id)
      return
    }

    const item = cartItems.find((item) => item.id === id)
    if (item && newQuantity > item.stock) {
      toast({
        title: "Stock Limit Reached",
        description: `Only ${item.stock} items available in stock.`,
        variant: "destructive",
      })
      return
    }

    setCartItems((items) => items.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const removeItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id))
    toast({
      title: "Item Removed",
      description: "Item has been removed from your cart.",
    })
  }

  const clearCart = () => {
    setCartItems([])
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart.",
    })
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 1000 ? 0 : 25 // Free shipping over $1000
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + shipping + tax

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <div className="relative">
          {children}
          {totalItems > 0 && (
            <Badge
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
              variant="destructive"
            >
              {totalItems > 99 ? "99+" : totalItems}
            </Badge>
          )}
        </div>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Shopping Cart ({totalItems} {totalItems === 1 ? "item" : "items"})
          </SheetTitle>
          <SheetDescription>Review your items and proceed to checkout</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto py-4">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
                <p className="text-muted-foreground mb-6">Add some products to get started</p>
                <Button onClick={() => setIsOpen(false)}>Continue Shopping</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 border rounded-lg">
                    <div className="relative h-16 w-16 flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
                          <p className="text-xs text-muted-foreground">{item.seller}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {item.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">Stock: {item.stock}</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-6 w-6 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-6 w-6 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-sm">${(item.price * item.quantity).toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">
                            ${item.price.toLocaleString()} {item.unit}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Summary */}
          {cartItems.length > 0 && (
            <div className="border-t pt-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping}`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {shipping === 0 && (
                <div className="bg-green-50 p-3 rounded-md">
                  <p className="text-sm text-green-700">🎉 You qualify for free shipping!</p>
                </div>
              )}

              {subtotal < 1000 && (
                <div className="bg-blue-50 p-3 rounded-md">
                  <p className="text-sm text-blue-700">Add ${(1000 - subtotal).toFixed(2)} more for free shipping</p>
                </div>
              )}

              <div className="space-y-2">
                <Link href="/cart" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full bg-transparent">
                    View Full Cart
                  </Button>
                </Link>
                <Link href="/checkout" onClick={() => setIsOpen(false)}>
                  <Button className="w-full">
                    Checkout
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>

              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCart}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Cart
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

// Mock cart data
const mockCartItems: CartItem[] = [
  {
    id: "1",
    name: "Gold Bullion - 1oz American Eagle",
    price: 1950,
    quantity: 2,
    unit: "per oz",
    image: "/placeholder.svg?height=64&width=64",
    seller: "Premium Metals Co.",
    category: "Precious Metals",
    stock: 25,
  },
  {
    id: "2",
    name: "Silver Bars - 10oz",
    price: 280,
    quantity: 1,
    unit: "per bar",
    image: "/placeholder.svg?height=64&width=64",
    seller: "Silver Traders Inc.",
    category: "Precious Metals",
    stock: 50,
  },
  {
    id: "3",
    name: "Platinum Coins - 1oz",
    price: 1050,
    quantity: 1,
    unit: "per oz",
    image: "/placeholder.svg?height=64&width=64",
    seller: "Premium Metals Co.",
    category: "Precious Metals",
    stock: 15,
  },
]
