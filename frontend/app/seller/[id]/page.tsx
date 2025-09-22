"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { MapPin, Star, Shield, Calendar, Search, Filter, Grid3X3, List, MessageCircle } from "lucide-react"

import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

export async function generateStaticParams() {
  return [];
}

export default function SellerStorePage({ params }: { params: { id: string } }) {
  const sellerId = params.id
  const { toast } = useToast()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState("featured")

  // In a real app, you would fetch the seller data based on the ID
  const seller = mockSeller

  // Filter products based on search query and category
  const filteredProducts = seller.products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Sort products based on selected sort option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "newest":
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      default:
        return 0 // featured - no sorting
    }
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Searching",
      description: `Searching for "${searchQuery}" in ${seller.name}'s store...`,
    })
  }

  const handleContactSeller = () => {
    toast({
      title: "Contact Seller",
      description: "Opening chat with seller...",
    })
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6 pb-20 lg:pb-8">
        {/* Seller Profile Header */}
        <div className="flex flex-col md:flex-row gap-6 items-start mb-8">
          <div className="relative w-24 h-24 md:w-32 md:h-32">
            <Avatar className="w-full h-full">
              <AvatarImage src={seller.avatar || "/placeholder.svg"} alt={seller.name} />
              <AvatarFallback>{seller.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{seller.name}</h1>
                  {seller.verified && (
                    <Badge variant="outline" className="text-xs">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-1 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{seller.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">Member since {seller.joinDate}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{seller.rating}</span>
                    <span className="text-sm text-muted-foreground">({seller.reviewCount} reviews)</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">{seller.responseRate}%</span>{" "}
                    <span className="text-muted-foreground">response rate</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">{seller.responseTime}</span>{" "}
                    <span className="text-muted-foreground">response time</span>
                  </div>
                </div>
              </div>
              <Button onClick={handleContactSeller}>
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact Seller
              </Button>
            </div>
            <p className="mt-4 text-muted-foreground">{seller.description}</p>
          </div>
        </div>

        {/* Store Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{seller.totalSales}</div>
              <p className="text-sm text-muted-foreground">Total Sales</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{seller.products.length}</div>
              <p className="text-sm text-muted-foreground">Products</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{seller.successRate}%</div>
              <p className="text-sm text-muted-foreground">Success Rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{seller.avgShippingDays} days</div>
              <p className="text-sm text-muted-foreground">Avg. Shipping</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-4 md:flex-row mb-6">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={`Search in ${seller.name}'s store...`}
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          <div className="flex items-center gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Precious Metals">Precious Metals</SelectItem>
                <SelectItem value="Oil & Gas">Oil & Gas</SelectItem>
                <SelectItem value="Agriculture">Agriculture</SelectItem>
                <SelectItem value="Timber">Timber</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className={viewMode !== "grid" ? "bg-transparent" : ""}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
                className={viewMode !== "list" ? "bg-transparent" : ""}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="Precious Metals">Metals</TabsTrigger>
            <TabsTrigger value="Oil & Gas">Oil & Gas</TabsTrigger>
            <TabsTrigger value="Agriculture">Agriculture</TabsTrigger>
            <TabsTrigger value="Timber">Timber</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {sortedProducts.length} of {seller.products.length} products
          </p>
        </div>

        {/* Products Grid/List */}
        <div className={viewMode === "grid" ? "grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "space-y-4"}>
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} viewMode={viewMode} />
          ))}
        </div>

        {/* No Products Found */}
        {sortedProducts.length === 0 && (
          <div className="text-center py-12">
            <Filter className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No products found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filter to find what you're looking for.
            </p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Load More */}
        {sortedProducts.length > 0 && sortedProducts.length < seller.products.length && (
          <div className="flex justify-center mt-8">
            <Button variant="outline" size="lg" className="bg-transparent">
              Load More Products
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

// Product Card Component
function ProductCard({
  product,
  viewMode,
}: {
  product: Product
  viewMode: "grid" | "list"
}) {
  const { toast } = useToast()

  const handleAddToCart = (id: string) => {
    toast({
      title: "Added to Cart",
      description: "Product has been added to your cart.",
    })
  }

  if (viewMode === "list") {
    return (
      <Card className="overflow-hidden">
        <div className="flex">
          <div className="relative h-32 w-32 flex-shrink-0">
            <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
          </div>
          <div className="flex flex-1 flex-col justify-between p-4">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">${product.price.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">{product.unit}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  {product.category}
                </Badge>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs">{product.rating}</span>
                </div>
                <span className="text-xs text-muted-foreground">Stock: {product.stock}</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <Link href={`/product/${product.id}`}>
                <Button variant="outline" size="sm" className="bg-transparent">
                  View Details
                </Button>
              </Link>
              <Button size="sm" onClick={() => handleAddToCart(product.id)}>
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
      <div className="relative aspect-square">
        <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
        {product.featured && <Badge className="absolute top-2 left-2 text-xs">Featured</Badge>}
      </div>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold line-clamp-1">{product.name}</h3>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs">{product.rating}</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold">${product.price.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">{product.unit}</div>
            </div>
            <Badge variant="outline" className="text-xs">
              {product.category}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground">Stock: {product.stock}</div>
        </div>
        <div className="flex gap-2 mt-4">
          <Link href={`/product/${product.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full bg-transparent">
              View
            </Button>
          </Link>
          <Button size="sm" className="flex-1" onClick={() => handleAddToCart(product.id)}>
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Types
interface Product {
  id: string
  name: string
  description: string
  price: number
  unit: string
  category: string
  rating: number
  stock: number
  image: string
  featured: boolean
  date: string
}

// Mock data
const mockSeller = {
  id: "seller1",
  name: "Premium Metals Co.",
  avatar: "/placeholder.svg?height=128&width=128",
  location: "New York, NY",
  joinDate: "March 2020",
  verified: true,
  rating: 4.9,
  reviewCount: 1247,
  responseRate: 98,
  responseTime: "< 1 hour",
  description:
    "We are a trusted precious metals dealer with over 20 years of experience in the industry. We specialize in gold, silver, platinum, and palladium bullion and coins. All our products are certified and come with authenticity guarantees.",
  totalSales: "2,847",
  successRate: 99,
  avgShippingDays: 2,
  products: [
    {
      id: "1",
      name: "Gold Bullion - 1oz American Eagle",
      description: "99.9% pure gold bullion coin from certified mint",
      price: 1950,
      unit: "per oz",
      category: "Precious Metals",
      rating: 4.8,
      stock: 25,
      image: "/placeholder.svg?height=300&width=300",
      featured: true,
      date: "2024-07-20",
    },
    {
      id: "2",
      name: "Silver Bars - 10oz",
      description: "Fine silver bars with certificate of authenticity",
      price: 280,
      unit: "per bar",
      category: "Precious Metals",
      rating: 4.7,
      stock: 50,
      image: "/placeholder.svg?height=300&width=300",
      featured: false,
      date: "2024-07-18",
    },
    {
      id: "3",
      name: "Platinum Coins - 1oz",
      description: "Premium platinum coins for investment",
      price: 1050,
      unit: "per oz",
      category: "Precious Metals",
      rating: 4.9,
      stock: 15,
      image: "/placeholder.svg?height=300&width=300",
      featured: true,
      date: "2024-07-15",
    },
    {
      id: "4",
      name: "Palladium Bars - 1oz",
      description: "High-grade palladium bars for collectors",
      price: 2100,
      unit: "per oz",
      category: "Precious Metals",
      rating: 4.6,
      stock: 8,
      image: "/placeholder.svg?height=300&width=300",
      featured: false,
      date: "2024-07-12",
    },
    {
      id: "5",
      name: "Gold Coins - Canadian Maple",
      description: "Canadian Maple Leaf gold coins, 1oz",
      price: 1975,
      unit: "per coin",
      category: "Precious Metals",
      rating: 4.8,
      stock: 30,
      image: "/placeholder.svg?height=300&width=300",
      featured: false,
      date: "2024-07-10",
    },
    {
      id: "6",
      name: "Silver Coins - American Eagle",
      description: "1oz American Silver Eagle coins",
      price: 32,
      unit: "per coin",
      category: "Precious Metals",
      rating: 4.7,
      stock: 100,
      image: "/placeholder.svg?height=300&width=300",
      featured: false,
      date: "2024-07-08",
    },
  ],
}
