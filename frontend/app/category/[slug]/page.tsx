"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Filter, Grid, List, SlidersHorizontal, Star, Heart, ShoppingCart, TrendingUp, Eye } from "lucide-react"

import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("popularity")
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedRatings, setSelectedRatings] = useState<number[]>([])

  const categoryInfo = getCategoryInfo(slug)
  const products = getProductsByCategory(slug)

  const filteredProducts = products.filter((product) => {
    const priceInRange = product.price >= priceRange[0] && product.price <= priceRange[1]
    const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(product.brand)
    const ratingMatch = selectedRatings.length === 0 || selectedRatings.includes(Math.floor(product.rating))
    return priceInRange && brandMatch && ratingMatch
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "newest":
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
      default:
        return b.popularity - a.popularity
    }
  })

  return (
    <DashboardLayout userRole="buyer">
      <div className="container mx-auto px-4 py-6 pb-20 lg:pb-8">
        {/* Category Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link href="/marketplace" className="hover:text-foreground">
              Marketplace
            </Link>
            <span>/</span>
            <span className="text-foreground">{categoryInfo.name}</span>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{categoryInfo.name}</h1>
              <p className="text-muted-foreground max-w-2xl">{categoryInfo.description}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{products.length}</p>
              <p className="text-sm text-muted-foreground">Products</p>
            </div>
          </div>
        </div>

        {/* Category Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Price</p>
                  <p className="text-xl font-bold">${categoryInfo.avgPrice}</p>
                </div>
                <TrendingUp className="h-6 w-6 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Top Rated</p>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-xl font-bold">{categoryInfo.topRating}</span>
                  </div>
                </div>
                <Star className="h-6 w-6 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Most Popular</p>
                  <p className="text-xl font-bold">{categoryInfo.mostPopular}</p>
                </div>
                <Eye className="h-6 w-6 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Price Range</p>
                  <p className="text-xl font-bold">${categoryInfo.priceRange}</p>
                </div>
                <SlidersHorizontal className="h-6 w-6 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-6">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-64 space-y-6">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">Filters</h3>

                {/* Price Range */}
                <div className="space-y-3 mb-6">
                  <Label>Price Range</Label>
                  <Slider value={priceRange} onValueChange={setPriceRange} max={10000} step={100} className="w-full" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Brands */}
                <div className="space-y-3 mb-6">
                  <Label>Brands</Label>
                  <div className="space-y-2">
                    {categoryInfo.brands.map((brand) => (
                      <div key={brand} className="flex items-center space-x-2">
                        <Checkbox
                          id={brand}
                          checked={selectedBrands.includes(brand)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedBrands([...selectedBrands, brand])
                            } else {
                              setSelectedBrands(selectedBrands.filter((b) => b !== brand))
                            }
                          }}
                        />
                        <Label htmlFor={brand} className="text-sm">
                          {brand}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Rating */}
                <div className="space-y-3">
                  <Label>Minimum Rating</Label>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center space-x-2">
                        <Checkbox
                          id={`rating-${rating}`}
                          checked={selectedRatings.includes(rating)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedRatings([...selectedRatings, rating])
                            } else {
                              setSelectedRatings(selectedRatings.filter((r) => r !== rating))
                            }
                          }}
                        />
                        <Label htmlFor={`rating-${rating}`} className="flex items-center gap-1 text-sm">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          & up
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <p className="text-sm text-muted-foreground">
                  Showing {sortedProducts.length} of {products.length} products
                </p>

                {/* Mobile Filter Button */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden bg-transparent">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                      <SheetDescription>Refine your search results</SheetDescription>
                    </SheetHeader>
                    <div className="mt-6 space-y-6">
                      {/* Mobile filters content - same as desktop */}
                      <div className="space-y-3">
                        <Label>Price Range</Label>
                        <Slider
                          value={priceRange}
                          onValueChange={setPriceRange}
                          max={10000}
                          step={100}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>${priceRange[0]}</span>
                          <span>${priceRange[1]}</span>
                        </div>
                      </div>
                      {/* Add other filter sections here */}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              <div className="flex items-center gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularity">Most Popular</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {viewMode === "grid" ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {sortedProducts.map((product) => (
                  <Card key={product.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
                    <Link href={`/product/${product.id}`}>
                      <div className="relative aspect-square overflow-hidden rounded-t-lg">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute top-2 right-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 rounded-full bg-white/80 hover:bg-white"
                            onClick={(e) => {
                              e.preventDefault()
                              // Handle favorite toggle
                            }}
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                        {product.badge && (
                          <Badge className="absolute top-2 left-2" variant="secondary">
                            {product.badge}
                          </Badge>
                        )}
                      </div>
                    </Link>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold line-clamp-1">{product.name}</h3>
                            <p className="text-sm text-muted-foreground">{product.brand}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">${product.price.toLocaleString()}</p>
                            {product.originalPrice && (
                              <p className="text-sm text-muted-foreground line-through">
                                ${product.originalPrice.toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{product.rating}</span>
                            <span className="text-sm text-muted-foreground">({product.reviews})</span>
                          </div>
                          <Badge variant="outline">{product.availability}</Badge>
                        </div>

                        <Button className="w-full" asChild>
                          <Link href={`/product/${product.id}`}>
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {sortedProducts.map((product) => (
                  <Card key={product.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <Link href={`/product/${product.id}`} className="relative h-24 w-24 overflow-hidden rounded-md">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        </Link>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <Link href={`/product/${product.id}`}>
                                <h3 className="font-semibold hover:text-primary">{product.name}</h3>
                              </Link>
                              <p className="text-sm text-muted-foreground">{product.brand}</p>
                              <div className="flex items-center gap-1 mt-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium">{product.rating}</span>
                                <span className="text-sm text-muted-foreground">({product.reviews})</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg">${product.price.toLocaleString()}</p>
                              {product.originalPrice && (
                                <p className="text-sm text-muted-foreground line-through">
                                  ${product.originalPrice.toLocaleString()}
                                </p>
                              )}
                              <Badge variant="outline" className="mt-1">
                                {product.availability}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{product.description}</p>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2">
                              {product.badge && <Badge variant="secondary">{product.badge}</Badge>}
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" className="bg-transparent">
                                <Heart className="h-4 w-4" />
                              </Button>
                              <Button size="sm" asChild>
                                <Link href={`/product/${product.id}`}>
                                  <ShoppingCart className="h-4 w-4 mr-2" />
                                  View Details
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {sortedProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h2 className="text-xl font-semibold mb-2">No products found</h2>
                <p className="text-muted-foreground mb-4">Try adjusting your filters or search criteria.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setPriceRange([0, 5000])
                    setSelectedBrands([])
                    setSelectedRatings([])
                  }}
                  className="bg-transparent"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

// Helper functions
function getCategoryInfo(slug: string) {
  const categories = {
    "precious-metals": {
      name: "Precious Metals",
      description:
        "Invest in gold, silver, platinum, and other precious metals. Secure your wealth with physical commodities.",
      avgPrice: "1,847",
      topRating: "4.9",
      mostPopular: "Gold Bullion",
      priceRange: "$25 - $50K",
      brands: ["PAMP Suisse", "Perth Mint", "Royal Canadian Mint", "American Eagle", "Krugerrand"],
    },
    "oil-gas": {
      name: "Oil & Gas",
      description:
        "Trade in crude oil, natural gas, and refined petroleum products. Energy commodities for your portfolio.",
      avgPrice: "2,340",
      topRating: "4.6",
      mostPopular: "Crude Oil",
      priceRange: "$500 - $10K",
      brands: ["WTI", "Brent", "NYMEX", "ICE", "CME"],
    },
    agriculture: {
      name: "Agriculture",
      description: "Invest in agricultural commodities including grains, livestock, and soft commodities.",
      avgPrice: "156",
      topRating: "4.7",
      mostPopular: "Premium Wheat",
      priceRange: "$5 - $500",
      brands: ["Cargill", "ADM", "Bunge", "Louis Dreyfus", "COFCO"],
    },
    timber: {
      name: "Timber",
      description: "Sustainable timber investments and forestry products. Natural resource commodities.",
      avgPrice: "890",
      topRating: "4.5",
      mostPopular: "Oak Lumber",
      priceRange: "$50 - $2K",
      brands: ["Weyerhaeuser", "International Paper", "UPM", "Stora Enso", "Suzano"],
    },
  }

  return categories[slug as keyof typeof categories] || categories["precious-metals"]
}

function getProductsByCategory(slug: string) {
  // Mock products data - in real app, this would come from API
  const allProducts = [
    {
      id: "1",
      name: "Gold Bullion - 1oz",
      brand: "PAMP Suisse",
      price: 1950,
      originalPrice: null,
      rating: 4.8,
      reviews: 127,
      image: "/placeholder.svg?height=300&width=300",
      availability: "In Stock",
      badge: "Best Seller",
      category: "precious-metals",
      description: "Premium 1oz gold bullion bar with certificate of authenticity.",
      popularity: 95,
      dateAdded: "2024-07-01",
    },
    {
      id: "2",
      name: "Silver Bars - 10oz",
      brand: "Perth Mint",
      price: 280,
      originalPrice: 295,
      rating: 4.7,
      reviews: 89,
      image: "/placeholder.svg?height=300&width=300",
      availability: "In Stock",
      badge: "Sale",
      category: "precious-metals",
      description: "High-quality 10oz silver bars from the Perth Mint.",
      popularity: 88,
      dateAdded: "2024-07-05",
    },
    // Add more products for different categories...
  ]

  return allProducts.filter((product) => product.category === slug)
}
