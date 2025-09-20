// components/cart/cart-drawer.tsx
'use client';

import type React from 'react';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingCart,
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Package,
  AlertCircle,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  image: string;
  seller: string;
  category: string;
  stock: number;
}

interface CartDrawerProps {
  children: React.ReactNode;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CartDrawer({
  children,
  cartItems = [],
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  isOpen = false,
  onOpenChange,
}: CartDrawerProps) {
  const { toast } = useToast();
  const [localOpen, setLocalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  // Dialog states for confirmations
  const [itemToRemove, setItemToRemove] = useState<CartItem | null>(null);
  const [showClearDialog, setShowClearDialog] = useState(false);

  // Use controlled or uncontrolled state based on props
  const open = onOpenChange ? isOpen : localOpen;
  const setOpen = onOpenChange || setLocalOpen;

  // Auto-close drawer after successful actions
  useEffect(() => {
    if (cartItems.length === 0 && open) {
      const timer = setTimeout(() => setOpen(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [cartItems.length, open, setOpen]);

  // Computed values
  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const shipping = useMemo(() => (subtotal > 1000 ? 0 : 25), [subtotal]);
  const tax = useMemo(() => subtotal * 0.08, [subtotal]);
  const total = useMemo(() => subtotal + shipping + tax, [subtotal, shipping, tax]);

  // Check for out of stock items
  const outOfStockItems = useMemo(
    () => cartItems.filter((item) => item.quantity > item.stock),
    [cartItems]
  );

  const hasOutOfStockItems = outOfStockItems.length > 0;

  // Enhanced quantity update with optimistic updates
  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    if (isUpdating === id) return;

    setIsUpdating(id);

    try {
      // Add a small delay to show loading state
      await new Promise((resolve) => setTimeout(resolve, 200));
      onUpdateQuantity(id, newQuantity);
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'Failed to update item quantity. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(null);
    }
  };

  // Enhanced remove item with proper dialog confirmation
  const handleRemoveItem = (item: CartItem) => {
    setItemToRemove(item);
  };

  const confirmRemoveItem = () => {
    if (itemToRemove) {
      onRemoveItem(itemToRemove.id);
      setItemToRemove(null);
    }
  };

  // Clear cart with proper dialog confirmation
  const handleClearCart = () => {
    if (cartItems.length === 0) return;
    setShowClearDialog(true);
  };

  const confirmClearCart = () => {
    onClearCart();
    setShowClearDialog(false);
  };

  // Quick fix for out of stock items
  const handleFixOutOfStock = () => {
    outOfStockItems.forEach((item) => {
      if (item.stock > 0) {
        onUpdateQuantity(item.id, item.stock);
      } else {
        onRemoveItem(item.id);
      }
    });

    toast({
      title: 'Cart Updated',
      description: 'Out of stock items have been adjusted.',
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <div className="relative">
          {children}
          {totalItems > 0 && (
            <Badge
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
              variant="destructive"
            >
              {totalItems > 99 ? '99+' : totalItems}
            </Badge>
          )}
        </div>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Shopping Cart
            {totalItems > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </Badge>
            )}
          </SheetTitle>
          <SheetDescription>
            {cartItems.length === 0
              ? 'Your cart is empty'
              : 'Review your items and proceed to checkout'}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col flex-1 min-h-0">
          {/* Out of Stock Alert */}
          {hasOutOfStockItems && (
            <Alert className="mb-4 border-yellow-200 bg-yellow-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span className="text-sm">
                  {outOfStockItems.length} item{outOfStockItems.length > 1 ? 's' : ''} exceed
                  {outOfStockItems.length === 1 ? 's' : ''} available stock
                </span>
                <Button size="sm" variant="outline" onClick={handleFixOutOfStock}>
                  Fix
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Cart Items */}
          <ScrollArea className="flex-1 -mx-6 px-6">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="p-4 bg-muted rounded-full mb-4">
                  <Package className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
                <p className="text-muted-foreground mb-6 max-w-sm">
                  Add some premium commodities to get started with your trading journey
                </p>
                <Button onClick={() => setOpen(false)} variant="outline">
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4 pb-4">
                {cartItems.map((item) => {
                  const isItemUpdating = isUpdating === item.id;
                  const isOutOfStock = item.quantity > item.stock;
                  const itemTotal = item.price * item.quantity;

                  return (
                    <div
                      key={item.id}
                      className={`flex gap-3 p-3 border rounded-lg transition-colors ${
                        isOutOfStock ? 'border-yellow-300 bg-yellow-50' : ''
                      } ${isItemUpdating ? 'opacity-50' : ''}`}
                    >
                      <div className="relative h-16 w-16 flex-shrink-0">
                        <Image
                          src={item.image || '/placeholder.svg'}
                          alt={item.name}
                          fill
                          className="object-cover rounded-md"
                        />
                        {isOutOfStock && (
                          <div className="absolute inset-0 bg-yellow-400/20 rounded-md flex items-center justify-center">
                            <AlertCircle className="h-4 w-4 text-yellow-600" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
                            <p className="text-xs text-muted-foreground">{item.seller}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {item.category}
                              </Badge>
                              <span
                                className={`text-xs ${
                                  isOutOfStock ? 'text-yellow-600' : 'text-muted-foreground'
                                }`}
                              >
                                Stock: {item.stock}
                              </span>
                            </div>
                            {isOutOfStock && (
                              <p className="text-xs text-yellow-600 mt-1">
                                Quantity exceeds available stock
                              </p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item)}
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                            disabled={isItemUpdating}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              className="h-6 w-6 p-0"
                              disabled={isItemUpdating || item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm font-medium w-8 text-center">
                              {isItemUpdating ? '...' : item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              className="h-6 w-6 p-0"
                              disabled={isItemUpdating || item.quantity >= item.stock}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-sm">${itemTotal.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">
                              ${item.price.toLocaleString()} per {item.unit}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>

          {/* Cart Summary */}
          {cartItems.length > 0 && (
            <div className="border-t pt-4 space-y-4 mt-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `${shipping}`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium text-base">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Shipping Info */}
              {shipping === 0 ? (
                <div className="bg-green-50 p-3 rounded-md border border-green-200">
                  <p className="text-sm text-green-700 font-medium">
                    🎉 You qualify for free shipping!
                  </p>
                </div>
              ) : (
                <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                  <p className="text-sm text-blue-700">
                    Add <span className="font-medium">${(1000 - subtotal).toFixed(2)}</span> more
                    for free shipping
                  </p>
                  <div className="w-full bg-blue-100 rounded-full h-2 mt-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((subtotal / 1000) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Link href="/cart" onClick={() => setOpen(false)} className="flex-1">
                    <Button variant="outline" className="w-full bg-transparent">
                      View Full Cart
                    </Button>
                  </Link>
                  <Link href="/checkout" onClick={() => setOpen(false)} className="flex-1">
                    <Button className="w-full" disabled={hasOutOfStockItems}>
                      Checkout
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>

                {hasOutOfStockItems && (
                  <p className="text-xs text-yellow-600 text-center">
                    Please fix out of stock items before checkout
                  </p>
                )}
              </div>

              {/* Clear Cart Button */}
              <div className="flex justify-center pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearCart}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Cart
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Remove Item Confirmation Dialog */}
        <AlertDialog open={!!itemToRemove} onOpenChange={() => setItemToRemove(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Item from Cart</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove{' '}
                <span className="font-medium">{itemToRemove?.name}</span> from your cart?
                {itemToRemove && itemToRemove.price * itemToRemove.quantity > 1000 && (
                  <span className="block mt-2 text-amber-600">
                    This item has a value of $
                    {(itemToRemove.price * itemToRemove.quantity).toLocaleString()}.
                  </span>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmRemoveItem}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Remove Item
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Clear Cart Confirmation Dialog */}
        <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear Shopping Cart</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove all {totalItems} items from your cart? This action
                cannot be undone.
                {subtotal > 500 && (
                  <span className="block mt-2 text-amber-600">
                    Your cart contains items worth ${subtotal.toLocaleString()}.
                  </span>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Items</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmClearCart}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Clear Cart
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SheetContent>
    </Sheet>
  );
}
