"use client"

import type React from "react"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Search, Grid, List, Star, Heart, ShoppingCart, TrendingUp } from "lucide-react"

import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [searchQuery, setSearchQuery] = useState(query)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("relevance")
  const [activeTab, setActiveTab] = useState("all")

  const searchResults = getSearchResults(query)
  const filteredResults = filterResultsByTab(searchResults, activeTab)

  const sortedResults = [...filteredResults].sort((a, b) => {
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
        return b.relevance - a.relevance
    }
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.history.pushState({}, "", `/search?q=${encodeURIComponent(searchQuery)}`)
      // In a real app, this would trigger a new search
    }
  }

  return (
    <DashboardLayout userRole="buyer">
      <div className="container mx-auto px-4 py-6 pb-20 lg:pb-8">
        {/* Search Header */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for commodities, metals, oil, agriculture..."
                className="pl-10 pr-4 py-3 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2">
                Search
              </Button>
            </div>
          </form>

          {query && (
            <div>
              <h1 className="text-2xl font-bold mb-2">Search results for "{query}"</h1>
              <p className="text-muted-foreground">
                Found {searchResults.length} results in {Math.random() * 0.5 + 0.1}s
              </p>
            </div>
          )}
        </div>

        {/* Search Suggestions */}
        {!query && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Popular Searches</h2>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((search, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchQuery(search)}
                  className="bg-transparent"
                >
                  {search}
                </Button>
              ))}
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Trending Now</h2>
              <div className="grid gap-4 md:grid-cols-3">
                {trendingItems.map((item, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
                    <Link href={`/search?q=${encodeURIComponent(item.name)}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 overflow-hidden rounded-md">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{item.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <TrendingUp className="h-4 w-4 text-green-600" />
                              <span className="text-sm text-green-600">{item.trend}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Search Results */}
        {query && (
          <>
            {/* Search Filters and Tabs */}
            <div className="mb-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="flex items-center justify-between mb-4">
                  <TabsList>
                    <TabsTrigger value="all">All ({searchResults.length})</TabsTrigger>
                    <TabsTrigger value="products">
                      Products ({searchResults.filter((r) => r.type === "product").length})
                    </TabsTrigger>
                    <TabsTrigger value="sellers">
                      Sellers ({searchResults.filter((r) => r.type === "seller").length})
                    </TabsTrigger>
                    <TabsTrigger value="categories">
                      Categories ({searchResults.filter((r) => r.type === "category").length})
                    </TabsTrigger>
                  </TabsList>

                  <div className="flex items-center gap-2">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relevance">Most Relevant</SelectItem>
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

                <TabsContent value="all">
                  <SearchResultsDisplay results={sortedResults} viewMode={viewMode} />
                </TabsContent>

                <TabsContent value="products">
                  <SearchResultsDisplay
                    results={sortedResults.filter((r) => r.type === "product")}
                    viewMode={viewMode}
                  />
                </TabsContent>

                <TabsContent value="sellers">
                  <SearchResultsDisplay
                    results={sortedResults.filter((r) => r.type === "seller")}
                    viewMode={viewMode}
                  />
                </TabsContent>

                <TabsContent value="categories">
                  <SearchResultsDisplay
                    results={sortedResults.filter((r) => r.type === "category")}
                    viewMode={viewMode}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </>
        )}

        {/* No Results */}
        {query && sortedResults.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold mb-2">No results found</h2>
            <p className="text-muted-foreground mb-6">
              We couldn't find anything matching "{query}". Try different keywords or browse our categories.
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Suggestions:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Check your spelling</li>
                  <li>• Try more general keywords</li>
                  <li>• Use different search terms</li>
                </ul>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {popularSearches.slice(0, 5).map((search, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setSearchQuery(search)}
                    className="bg-transparent"
                  >
                    Try "{search}"
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

// Search Results Display Component
function SearchResultsDisplay({
  results,
  viewMode,
}: {
  results: any[]
  viewMode: "grid" | "list"
}) {
  if (viewMode === "grid") {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {results.map((result) => (
          <SearchResultCard key={result.id} result={result} />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {results.map((result) => (
        <SearchResultListItem key={result.id} result={result} />
      ))}
    </div>
  )
}

// Search Result Card Component
function SearchResultCard({ result }: { result: any }) {
  if (result.type === "product") {
    return (
      <Card className="group cursor-pointer hover:shadow-lg transition-shadow">
        <Link href={`/product/${result.id}`}>
          <div className="relative aspect-square overflow-hidden rounded-t-lg">
            <Image
              src={result.image || "/placeholder.svg"}
              alt={result.name}
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
            {result.badge && (
              <Badge className="absolute top-2 left-2" variant="secondary">
                {result.badge}
              </Badge>
            )}
          </div>
        </Link>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold line-clamp-1">{result.name}</h3>
                <p className="text-sm text-muted-foreground">{result.seller}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">${result.price.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{result.rating}</span>
                <span className="text-sm text-muted-foreground">({result.reviews})</span>
              </div>
              <Badge variant="outline">{result.availability}</Badge>
            </div>

            <Button className="w-full" asChild>
              <Link href={`/product/${result.id}`}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                View Details
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (result.type === "seller") {
    return (
      <Card className="group cursor-pointer hover:shadow-lg transition-shadow">
        <Link href={`/seller/${result.id}`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-full">
                <Image src={result.avatar || "/placeholder.svg"} alt={result.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{result.name}</h3>
                <p className="text-sm text-muted-foreground">{result.description}</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{result.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{result.products} products</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Link>
      </Card>
    )
  }

  if (result.type === "category") {
    return (
      <Card className="group cursor-pointer hover:shadow-lg transition-shadow">
        <Link href={`/category/${result.slug}`}>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-4xl mb-2">{result.icon}</div>
              <h3 className="font-semibold">{result.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{result.productCount} products</p>
            </div>
          </CardContent>
        </Link>
      </Card>
    )
  }

  return null
}

// Search Result List Item Component
function SearchResultListItem({ result }: { result: any }) {
  if (result.type === "product") {
    return (
      <Card className="group cursor-pointer hover:shadow-lg transition-shadow">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <Link href={`/product/${result.id}`} className="relative h-24 w-24 overflow-hidden rounded-md">
              <Image
                src={result.image || "/placeholder.svg"}
                alt={result.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
              />
            </Link>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <Link href={`/product/${result.id}`}>
                    <h3 className="font-semibold hover:text-primary">{result.name}</h3>
                  </Link>
                  <p className="text-sm text-muted-foreground">{result.seller}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{result.rating}</span>
                    <span className="text-sm text-muted-foreground">({result.reviews})</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">${result.price.toLocaleString()}</p>
                  <Badge variant="outline" className="mt-1">
                    {result.availability}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{result.description}</p>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  {result.badge && <Badge variant="secondary">{result.badge}</Badge>}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="bg-transparent">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button size="sm" asChild>
                    <Link href={`/product/${result.id}`}>
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
    )
  }

  // Similar implementations for seller and category list items...
  return <SearchResultCard result={result} />
}

// Helper functions and mock data
function getSearchResults(query: string) {
  if (!query) return []

  // Mock search results - in real app, this would come from API
  return [
    {
      id: "1",
      type: "product",
      name: "Gold Bullion - 1oz",
      seller: "Premium Metals Co.",
      price: 1950,
      rating: 4.8,
      reviews: 127,
      image: "/placeholder.svg?height=300&width=300",
      availability: "In Stock",
      badge: "Best Seller",
      description: "Premium 1oz gold bullion bar with certificate of authenticity.",
      relevance: 95,
      dateAdded: "2024-07-01",
    },
    {
      id: "2",
      type: "seller",
      name: "Premium Metals Co.",
      description: "Trusted precious metals dealer since 1985",
      rating: 4.9,
      products: 28,
      avatar: "/placeholder.svg?height=64&width=64",
      relevance: 88,
      dateAdded: "2024-01-01",
    },
    {
      id: "3",
      type: "category",
      name: "Precious Metals",
      slug: "precious-metals",
      icon: "🥇",
      productCount: 156,
      relevance: 82,
      dateAdded: "2024-01-01",
    },
    // Add more mock results...
  ]
}

function filterResultsByTab(results: any[], tab: string) {
  if (tab === "all") return results
  return results.filter((result) => result.type === tab.slice(0, -1)) // Remove 's' from tab name
}

const popularSearches = [
  "gold bullion",
  "silver bars",
  "crude oil",
  "wheat futures",
  "platinum coins",
  "natural gas",
  "coffee beans",
  "timber logs",
]

const trendingItems = [
  {
    name: "Gold Bullion",
    trend: "+12% this week",
    image: "/placeholder.svg?height=48&width=48",
  },
  {
    name: "Silver Bars",
    trend: "+8% this week",
    image: "/placeholder.svg?height=48&width=48",
  },
  {
    name: "Crude Oil",
    trend: "+15% this week",
    image: "/placeholder.svg?height=48&width=48",
  },
]
