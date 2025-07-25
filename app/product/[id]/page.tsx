"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, Minus, Plus, Share2, Star, Truck, Shield, MessageCircle } from "lucide-react"

import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)

  // Mock product data - in real app, this would be fetched based on params.id
  const product = {
    id: params.id,
    name: "Gold Bullion - 1oz American Eagle",
    description:
      "99.9% pure gold bullion coin from the U.S. Mint. Each coin contains one troy ounce of gold and is backed by the U.S. government for weight, content, and purity.",
    price: 1950.0,
    originalPrice: 2100.0,
    unit: "per oz",
    category: "Precious Metals",
    rating: 4.8,
    reviewCount: 127,
    verified: true,
    stock: 25,
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

  const handleAddToCart = () => {
    toast({
      title: "Added to Cart",
      description: `${quantity} x ${product.name} added to your cart.`,
    })
  }

  const handleBuyNow = () => {
    toast({
      title: "Redirecting to Checkout",
      description: "Taking you to secure checkout...",
    })
    // In real app, would redirect to checkout with this product
    window.location.href = "/checkout"
  }

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite)
    toast({
      title: isFavorite ? "Removed from Favorites" : "Added to Favorites",
      description: isFavorite ? "Product removed from your wishlist." : "Product saved to your wishlist.",
    })
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Link Copied",
      description: "Product link copied to clipboard.",
    })
  }

  return (
    <DashboardLayout userRole="buyer">
      <div className="container mx-auto px-4 py-6 pb-20 lg:pb-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link href="/marketplace" className="hover:text-foreground">
            Marketplace
          </Link>
          <span>/</span>
          <Link href="/marketplace?category=metals" className="hover:text-foreground">
            Precious Metals
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg border">
              <Image
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                width={500}
                height={500}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square overflow-hidden rounded-md border-2 ${
                    selectedImage === index ? "border-primary" : "border-muted"
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
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{product.category}</Badge>
                {product.verified && <Badge variant="outline">Verified</Badge>}
              </div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <div className="flex items-center gap-2 mt-2">
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
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-green-100 text-green-700">
                        AI Analysis: {product.aiInsights.priceAnalysis}
                      </Badge>
                      <span className="text-sm text-green-600">{product.aiInsights.confidence}% confidence</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Price is {product.aiInsights.priceChange} vs market average. {product.aiInsights.marketSentiment}{" "}
                      sentiment.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
                {product.originalPrice > product.price && (
                  <span className="text-lg text-muted-foreground line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
                <span className="text-sm text-muted-foreground">{product.unit}</span>
              </div>
              {product.originalPrice > product.price && (
                <div className="text-sm text-green-600">
                  Save ${(product.originalPrice - product.price).toFixed(2)} (
                  {(((product.originalPrice - product.price) / product.originalPrice) * 100).toFixed(0)}% off)
                </div>
              )}
              <div className="text-sm text-muted-foreground">{product.stock} units available</div>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">Total: ${(product.price * quantity).toFixed(2)}</div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleBuyNow} className="flex-1">
                  Buy Now
                </Button>
                <Button variant="outline" onClick={handleAddToCart} className="flex-1 bg-transparent">
                  Add to Cart
                </Button>
                <Button variant="outline" size="icon" onClick={handleToggleFavorite} className="bg-transparent">
                  <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
                <Button variant="outline" size="icon" onClick={handleShare} className="bg-transparent">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Shipping Info */}
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{product.shipping.cost}</div>
                      <div className="text-muted-foreground">{product.shipping.time}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{product.shipping.insurance}</div>
                      <div className="text-muted-foreground">{product.shipping.tracking}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Seller Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={product.seller.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{product.seller.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{product.seller.name}</span>
                        {product.seller.verified && (
                          <Badge variant="outline" className="text-xs">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{product.seller.rating}</span>
                        <span>•</span>
                        <span>{product.seller.totalSales} sales</span>
                        <span>•</span>
                        <span>Member since {product.seller.memberSince}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="bg-transparent">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contact
                    </Button>
                    <Link href={`/seller/${product.seller.name}`}>
                      <Button variant="outline" size="sm" className="bg-transparent">
                        View Store
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="price-history">Price History</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                  <div className="mt-4 space-y-2">
                    <h4 className="font-medium">Key Features:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Government-backed authenticity guarantee</li>
                      <li>Brilliant uncirculated condition</li>
                      <li>Comes with certificate of authenticity</li>
                      <li>Secure packaging and insured shipping</li>
                      <li>Eligible for IRA investment</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b">
                        <span className="font-medium">{key}:</span>
                        <span className="text-muted-foreground">{value}</span>
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
                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div key={rating} className="flex items-center gap-2">
                            <span className="text-sm w-8">{rating}★</span>
                            <Progress
                              value={rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 8 : 2}
                              className="flex-1"
                            />
                            <span className="text-sm text-muted-foreground w-8">
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
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={review.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{review.name}</span>
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
                            <p className="text-sm text-muted-foreground">{review.comment}</p>
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
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={priceHistoryData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="price" stroke="#10B981" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedProducts.map((relatedProduct) => (
              <Card key={relatedProduct.id} className="overflow-hidden">
                <div className="aspect-square relative">
                  <Image
                    src={relatedProduct.image || "/placeholder.svg"}
                    alt={relatedProduct.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium line-clamp-2">{relatedProduct.name}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold">${relatedProduct.price}</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">{relatedProduct.rating}</span>
                    </div>
                  </div>
                  <Link href={`/product/${relatedProduct.id}`}>
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
