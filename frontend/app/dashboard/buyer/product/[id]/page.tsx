// app/dashboard/buyer/product/[id]/page.tsx
"use client"

import { useState, use, useCallback, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Heart, Minus, Plus, Share2, Star, Truck, Shield, MessageCircle, ArrowLeft, Zap, Copy, Check, ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useContentPadding } from "@/contexts/sidebar-context"
import { CartDrawer } from "@/components/cart/cart-drawer"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Enhanced CartItem interface to match the cart drawer
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

export async function generateStaticParams() {
  return [];
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { toast } = useToast()
  const { contentPadding } = useContentPadding()
  const router = useRouter()
  
  // Unwrap the params Promise using React.use()
  const resolvedParams = use(params)
  
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isBuying, setIsBuying] = useState(false)
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [shareLink, setShareLink] = useState("")
  const [linkCopied, setLinkCopied] = useState(false)

  // Cart state management
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false)

  // Mock product data - in real app, this would be fetched based on resolvedParams.id
  const product = {
    id: resolvedParams.id,
    name: "Gold Bullion - 1oz American Eagle",
    description:
      "99.9% pure gold bullion coin from the U.S. Mint. Each coin contains one troy ounce of gold and is backed by the U.S. government for weight, content, and purity.",
    price: 1950.0,
    originalPrice: 2100.0,
    unit: "oz",
    category: "Precious Metals",
    rating: 4.8,
    reviewCount: 127,
    verified: true,
    inStock: true,
    stockQuantity: 25,
    images: [
      "/placeholder.svg?height=500&width=500",
      "/placeholder.svg?height=500&width=500",
      "/placeholder.svg?height=500&width=500",
      "/placeholder.svg?height=500&width=500",
    ],
    seller: {
      name: "Premium Metals Co.",
      rating: 4.9,
      totalSales: 1250,
      verified: true,
      avatar: "/placeholder.svg?height=40&width=40",
      responseTime: "< 1 hour",
      memberSince: "2019",
      description: "Leading precious metals dealer with over 5 years of experience in the commodity trading industry. We specialize in authentic, certified precious metals with a focus on customer satisfaction and secure transactions.",
      location: "New York, USA",
      certifications: ["LBMA Certified", "NGC Authorized", "PCGS Dealer"],
    },
    specifications: {
      Purity: "99.9% Gold",
      Weight: "1 Troy Ounce",
      Diameter: "32.7mm",
      Thickness: "2.87mm",
      Mint: "U.S. Mint",
      Year: "2024",
      Condition: "Brilliant Uncirculated",
      Certificate: "Included",
    },
    shipping: {
      cost: "Free shipping",
      time: "2-3 business days",
      insurance: "Fully insured",
      tracking: "Real-time tracking",
    },
    aiInsights: {
      priceAnalysis: "Good Deal",
      confidence: 85,
      recommendation: "Buy",
      priceChange: "+2.5%",
      marketSentiment: "Bullish",
    },
  }

  // Computed cart values
  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  )

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  )

  // Cart management functions
  const addToCart = useCallback(
    (product: any, quantity: number = 1) => {
      const existingItem = cartItems.find((item) => item.id === product.id)

      if (existingItem) {
        // Update quantity if item already exists
        const newQuantity = existingItem.quantity + quantity
        if (newQuantity > product.stockQuantity) {
          toast({
            title: 'Stock Limit Reached',
            description: `Only ${product.stockQuantity} items available in stock.`,
            variant: 'destructive',
          })
          return
        }

        setCartItems((prev) =>
          prev.map((item) => (item.id === product.id ? { ...item, quantity: newQuantity } : item))
        )
      } else {
        // Add new item to cart
        if (quantity > product.stockQuantity) {
          toast({
            title: 'Stock Limit Reached',
            description: `Only ${product.stockQuantity} items available in stock.`,
            variant: 'destructive',
          })
          return
        }

        const cartItem: CartItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity,
          unit: product.unit || 'each',
          image: product.images[0],
          seller: product.seller.name,
          category: product.category,
          stock: product.stockQuantity,
        }

        setCartItems((prev) => [...prev, cartItem])
      }

      // Show success toast and open cart drawer briefly
      toast({
        title: 'Added to Cart',
        description: `${product.name} has been added to your cart.`,
      })

      // Open cart drawer to show the item was added
      setCartDrawerOpen(true)
    },
    [cartItems, toast]
  )

  const updateCartQuantity = useCallback(
    (id: string, newQuantity: number) => {
      if (newQuantity <= 0) {
        removeFromCart(id)
        return
      }

      const item = cartItems.find((item) => item.id === id)
      if (item && newQuantity > item.stock) {
        toast({
          title: 'Stock Limit Reached',
          description: `Only ${item.stock} items available in stock.`,
          variant: 'destructive',
        })
        return
      }

      setCartItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
      )
    },
    [cartItems, toast]
  )

  const removeFromCart = useCallback(
    (id: string) => {
      const item = cartItems.find((item) => item.id === id)
      setCartItems((prev) => prev.filter((item) => item.id !== id))

      if (item) {
        toast({
          title: 'Item Removed',
          description: `${item.name} has been removed from your cart.`,
        })
      }
    },
    [cartItems, toast]
  )

  const clearCart = useCallback(() => {
    setCartItems([])
    toast({
      title: 'Cart Cleared',
      description: 'All items have been removed from your cart.',
    })
  }, [toast])

  const handleAddToCart = async () => {
    if (!product.inStock) {
      toast({
        title: 'Out of Stock',
        description: 'This item is currently out of stock.',
        variant: 'destructive',
      })
      return
    }

    setIsAddingToCart(true)
    try {
      // Add a small delay for smooth UX
      await new Promise(resolve => setTimeout(resolve, 300))
      addToCart(product, quantity)
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleBuyNow = async () => {
    if (!product.inStock) {
      toast({
        title: 'Out of Stock',
        description: 'This item is currently out of stock.',
        variant: 'destructive',
      })
      return
    }

    setIsBuying(true)
    try {
      // Add item to cart first
      addToCart(product, quantity)
      
      // Add a small delay for smooth transition
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Navigate to checkout
      router.push('/dashboard/buyer/checkout')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to proceed to checkout.',
        variant: 'destructive',
      })
    } finally {
      setIsBuying(false)
    }
  }

  const handleToggleFavorite = async () => {
    setIsTogglingFavorite(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 200))
      setIsFavorite(!isFavorite)
      toast({
        title: isFavorite ? "Removed from Favorites" : "Added to Favorites",
        description: isFavorite ? "Product removed from your wishlist." : "Product saved to your wishlist.",
      })
    } finally {
      setIsTogglingFavorite(false)
    }
  }

  const generateShareableLink = useCallback(() => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    const productUrl = `${baseUrl}/dashboard/buyer/product/${product.id}`
    
    // Add UTM parameters for tracking
    const shareableUrl = new URL(productUrl)
    shareableUrl.searchParams.set('utm_source', 'share')
    shareableUrl.searchParams.set('utm_medium', 'link')
    shareableUrl.searchParams.set('utm_campaign', 'product_share')
    shareableUrl.searchParams.set('shared_at', Date.now().toString())
    
    return shareableUrl.toString()
  }, [product.id])

  const handleShare = async () => {
    const shareableLink = generateShareableLink()
    setShareLink(shareableLink)

    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out this ${product.category.toLowerCase()}: ${product.name} - $${product.price}`,
          url: shareableLink,
        })
        
        toast({
          title: "Shared Successfully",
          description: "Product has been shared.",
        })
      } catch (error) {
        // If sharing fails, show the share dialog
        setShareDialogOpen(true)
      }
    } else {
      // Fallback to share dialog
      setShareDialogOpen(true)
    }
  }

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink)
      setLinkCopied(true)
      
      toast({
        title: "Link Copied",
        description: "Shareable link copied to clipboard.",
      })

      setTimeout(() => {
        setLinkCopied(false)
        setShareDialogOpen(false)
      }, 1500)
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Could not copy link to clipboard.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className={`py-6 pb-20 lg:pb-8 ${contentPadding}`}>
      {/* Mobile Back Button */}
      <div className="lg:hidden mb-4">
        <Button variant="ghost" onClick={() => router.back()} className="p-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Breadcrumb - Hidden on mobile */}
      <nav className="hidden lg:flex items-center space-x-2 text-sm text-muted-foreground mb-6">
        <Link href="/dashboard/buyer/marketplace" className="hover:text-foreground">
          Marketplace
        </Link>
        <span>/</span>
        <Link href="/dashboard/buyer/marketplace?category=metals" className="hover:text-foreground">
          Precious Metals
        </Link>
        <span>/</span>
        <span className="text-foreground truncate">{product.name}</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-5">
        {/* Product Images */}
        <div className="space-y-4 xl:col-span-2">
          <div className="aspect-square overflow-hidden rounded-lg border bg-muted">
            <Image
              src={product.images[selectedImage] || "/placeholder.svg"}
              alt={product.name}
              width={500}
              height={500}
              className="h-full w-full object-cover"
              priority
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square overflow-hidden rounded-md border-2 transition-colors ${
                  selectedImage === index ? "border-primary" : "border-muted hover:border-primary/50"
                }`}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} ${index + 1}`}
                  width={100}
                  height={100}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6 xl:col-span-3">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="secondary">{product.category}</Badge>
              {product.verified && (
                <Badge variant="outline" className="border-green-200 text-green-700">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
              {!product.inStock && (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold leading-tight">{product.name}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>
          </div>

          {/* AI Price Analysis */}
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <Zap className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                      AI Analysis: {product.aiInsights.priceAnalysis}
                    </Badge>
                    <span className="text-sm text-green-600 font-medium">
                      {product.aiInsights.confidence}% confidence
                    </span>
                  </div>
                  <p className="text-sm text-green-700">
                    Price is {product.aiInsights.priceChange} vs market average. {product.aiInsights.marketSentiment}{" "}
                    sentiment detected.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
              {product.originalPrice > product.price && (
                <span className="text-xl text-muted-foreground line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
              <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                per {product.unit}
              </span>
            </div>
            {product.originalPrice > product.price && (
              <div className="inline-flex items-center gap-1 text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
                <span className="font-medium">
                  Save ${(product.originalPrice - product.price).toFixed(2)} (
                  {(((product.originalPrice - product.price) / product.originalPrice) * 100).toFixed(0)}% off)
                </span>
              </div>
            )}
            <div className="text-sm text-muted-foreground">
              <span className={product.stockQuantity <= 10 ? "text-amber-600 font-medium" : ""}>
                {product.stockQuantity} units available
              </span>
              {product.stockQuantity <= 10 && product.inStock && <span className="ml-2 text-amber-600">• Limited stock!</span>}
            </div>
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="flex items-center border rounded-lg overflow-hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || !product.inStock}
                  className="px-3 h-10"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="px-4 py-2 min-w-[60px] text-center border-x bg-muted">{quantity}</div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                  disabled={quantity >= product.stockQuantity || !product.inStock}
                  className="px-3 h-10"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-sm text-muted-foreground sm:ml-auto">
                Total: <span className="font-bold text-foreground">${(product.price * quantity).toFixed(2)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:flex sm:gap-2">
              <Button 
                onClick={handleBuyNow} 
                className="h-12 text-base font-medium" 
                disabled={isBuying || !product.inStock}
              >
                {isBuying ? "Processing..." : "Buy Now"}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleAddToCart} 
                className="h-12 text-base bg-transparent" 
                disabled={isAddingToCart || !product.inStock}
              >
                {isAddingToCart ? "Adding..." : product.inStock ? "Add to Cart" : "Out of Stock"}
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleToggleFavorite} 
                className="bg-transparent h-12 w-12"
                disabled={isTogglingFavorite}
              >
                <Heart className={`h-5 w-5 transition-all duration-200 ${
                  isFavorite ? "fill-red-500 text-red-500 scale-110" : ""
                } ${isTogglingFavorite ? "scale-75" : ""}`} />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleShare} 
                className="bg-transparent h-12 w-12"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Shipping Info */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <Truck className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">{product.shipping.cost}</div>
                    <div className="text-muted-foreground">{product.shipping.time}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Shield className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium">{product.shipping.insurance}</div>
                    <div className="text-muted-foreground">{product.shipping.tracking}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-8 lg:mt-12">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-6">
            <TabsTrigger value="description" className="text-xs sm:text-sm">Description</TabsTrigger>
            <TabsTrigger value="specifications" className="text-xs sm:text-sm">Specs</TabsTrigger>
            <TabsTrigger value="reviews" className="text-xs sm:text-sm">Reviews</TabsTrigger>
            <TabsTrigger value="price-history" className="text-xs sm:text-sm">Price History</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Main Description */}
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground leading-relaxed mb-6">{product.description}</p>
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg">Key Features:</h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                          Government-backed authenticity guarantee
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                          Brilliant uncirculated condition
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                          Certificate of authenticity included
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                          Secure packaging and insured shipping
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                          Eligible for IRA investment
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                          Backed by U.S. government guarantee
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Seller Info - Moved to Description Tab */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">About the Seller</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={product.seller.avatar || '/placeholder.svg'} />
                        <AvatarFallback>{product.seller.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{product.seller.name}</h4>
                          {product.seller.verified && (
                            <Badge variant="outline" className="text-xs border-green-200 text-green-700">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{product.seller.rating}</span>
                          </div>
                          <span>•</span>
                          <span>{product.seller.totalSales.toLocaleString()} sales</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {product.seller.description}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Member since:</span>
                        <span className="font-medium">{product.seller.memberSince}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Response time:</span>
                        <span className="font-medium">{product.seller.responseTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location:</span>
                        <span className="font-medium">{product.seller.location}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">Certifications:</h5>
                      <div className="flex flex-wrap gap-1">
                        {product.seller.certifications.map((cert, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 bg-transparent"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Contact
                      </Button>
                      <Link href={`/dashboard/buyer/sellers/${product.seller.name}`}>
                        <Button variant="outline" size="sm" className="bg-transparent">
                          View Store
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="specifications" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center py-3 border-b border-muted">
                      <span className="font-medium text-muted-foreground">{key}:</span>
                      <span className="font-semibold">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Reviews</CardTitle>
                  <CardDescription>
                    {product.reviewCount} reviews • Average rating: {product.rating}/5
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Rating breakdown */}
                    <div className="space-y-3">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center gap-3">
                          <span className="text-sm w-12 flex items-center gap-1">
                            {rating}<Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          </span>
                          <Progress
                            value={rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 8 : 2}
                            className="flex-1 h-2"
                          />
                          <span className="text-sm text-muted-foreground w-8 text-right">
                            {rating === 5 ? "89" : rating === 4 ? "25" : rating === 3 ? "10" : "3"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Individual Reviews */}
              <div className="space-y-4">
                {mockReviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={review.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="font-medium">{review.name}</span>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">{review.date}</span>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="price-history" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Price History</CardTitle>
                <CardDescription>Gold price trends over the last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={priceHistoryData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`$${value}`, 'Price']}
                        labelFormatter={(label) => `Date: ${label}`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#10B981" 
                        strokeWidth={2}
                        dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      <div className="mt-8 lg:mt-12">
        <h2 className="text-2xl font-bold mb-6">Related Products</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {relatedProducts.map((relatedProduct) => (
            <Card key={relatedProduct.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square relative bg-muted">
                <Image
                  src={relatedProduct.image || "/placeholder.svg"}
                  alt={relatedProduct.name}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium line-clamp-2 text-sm mb-2">{relatedProduct.name}</h3>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold">${relatedProduct.price}</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs">{relatedProduct.rating}</span>
                  </div>
                </div>
                <Link href={`/dashboard/buyer/product/${relatedProduct.id}`}>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Cart Drawer Integration */}
      <CartDrawer
        cartItems={cartItems}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        onClearCart={clearCart}
        isOpen={cartDrawerOpen}
        onOpenChange={setCartDrawerOpen}
      >
        <div /> {/* Empty trigger since we control the drawer programmatically */}
      </CartDrawer>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Product</DialogTitle>
            <DialogDescription>
              Share this amazing {product.category.toLowerCase()} with others
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <label htmlFor="share-link" className="sr-only">
                  Share link
                </label>
                <input
                  id="share-link"
                  value={shareLink}
                  readOnly
                  className="w-full px-3 py-2 bg-muted rounded-md text-sm font-mono"
                />
              </div>
              <Button 
                onClick={copyShareLink} 
                className="px-3"
                variant={linkCopied ? "default" : "outline"}
              >
                {linkCopied ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            
            <div className="flex flex-col gap-2">
              <p className="text-xs text-muted-foreground">
                This link includes tracking parameters to help measure sharing effectiveness.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    const text = `Check out this ${product.category.toLowerCase()}: ${product.name} - $${product.price}`
                    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareLink)}`
                    window.open(url, '_blank')
                  }}
                  className="bg-transparent"
                >
                  Share on Twitter
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`
                    window.open(url, '_blank')
                  }}
                  className="bg-transparent"
                >
                  Share on Facebook
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    const text = `Check out this ${product.category.toLowerCase()}: ${product.name} - $${product.price}`
                    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareLink)}&summary=${encodeURIComponent(text)}`
                    window.open(url, '_blank')
                  }}
                  className="bg-transparent"
                >
                  Share on LinkedIn
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mobile Cart Summary Footer */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-background border-t p-4 z-40">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="font-medium">
                {totalItems} item{totalItems !== 1 ? 's' : ''}
              </div>
              <div className="text-sm text-muted-foreground">${subtotal.toLocaleString()}</div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCartDrawerOpen(true)}
                className="bg-transparent"
              >
                View Cart
              </Button>
              <Link href="/dashboard/buyer/checkout">
                <Button>Checkout</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Mock data
const mockReviews = [
  {
    id: 1,
    name: "John D.",
    rating: 5,
    date: "2 days ago",
    comment: "Excellent quality gold coin. Fast shipping and secure packaging. Highly recommended!",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 2,
    name: "Sarah M.",
    rating: 5,
    date: "1 week ago",
    comment: "Beautiful coin, exactly as described. Great seller with fast communication.",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 3,
    name: "Mike R.",
    rating: 4,
    date: "2 weeks ago",
    comment: "Good quality coin, though shipping took a bit longer than expected. Overall satisfied.",
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

const priceHistoryData = [
  { date: "Jan 1", price: 1920 },
  { date: "Jan 5", price: 1935 },
  { date: "Jan 10", price: 1945 },
  { date: "Jan 15", price: 1930 },
  { date: "Jan 20", price: 1955 },
  { date: "Jan 25", price: 1950 },
  { date: "Jan 30", price: 1950 },
]

const relatedProducts = [
  {
    id: "2",
    name: "Silver Eagle - 1oz",
    price: "28.50",
    rating: 4.7,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "3",
    name: "Platinum Coin - 1oz",
    price: "980.00",
    rating: 4.6,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "4",
    name: "Gold Bar - 10oz",
    price: "19500.00",
    rating: 4.9,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "5",
    name: "Silver Bar - 100oz",
    price: "2850.00",
    rating: 4.5,
    image: "/placeholder.svg?height=200&width=200",
  },
]