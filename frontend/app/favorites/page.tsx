"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, Grid3X3, List, Search, Star, Trash2, ShoppingCart } from "lucide-react"

import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export default function FavoritesPage() {
  const { toast } = useToast()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [favorites, setFavorites] = useState(mockFavorites)

  const filteredFavorites = favorites.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleRemoveFromFavorites = (id: string) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id))
    setSelectedItems((prev) => prev.filter((itemId) => itemId !== id))
    toast({
      title: "Removed from Favorites",
      description: "Item has been removed from your favorites.",
    })
  }

  const handleAddToCart = (id: string) => {
    toast({
      title: "Added to Cart",
      description: "Item has been added to your cart.",
    })
  }

  const handleBulkRemove = () => {
    if (selectedItems.length === 0) {
      toast({
        title: "No Items Selected",
        description: "Please select items to remove.",
        variant: "destructive",
      })
      return
    }

    setFavorites((prev) => prev.filter((item) => !selectedItems.includes(item.id)))
    setSelectedItems([])
    toast({
      title: "Items Removed",
      description: `${selectedItems.length} items removed from favorites.`,
    })
  }

  const handleBulkAddToCart = () => {
    if (selectedItems.length === 0) {
      toast({
        title: "No Items Selected",
        description: "Please select items to add to cart.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Added to Cart",
      description: `${selectedItems.length} items added to cart.`,
    })
    setSelectedItems([])
  }

  const handleSelectAll = () => {
    if (selectedItems.length === filteredFavorites.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredFavorites.map((item) => item.id))
    }
  }

  const handleItemSelect = (id: string) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]))
  }

  if (favorites.length === 0) {
    return (
      <DashboardLayout userRole="buyer">
        <div className="container mx-auto px-4 py-8 pb-20 lg:pb-8">
          <div className="text-center py-12">
            <Heart className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">No favorites yet</h1>
            <p className="text-muted-foreground mb-6">Start adding items to your favorites to see them here.</p>
            <Link href="/marketplace">
              <Button>Browse Marketplace</Button>
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
          <div>
            <h1 className="text-2xl font-bold">Favorites</h1>
            <p className="text-muted-foreground">
              {favorites.length} saved items • {selectedItems.length} selected
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-4 md:flex-row mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search favorites..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="metals">Precious Metals</SelectItem>
                <SelectItem value="oil">Oil & Gas</SelectItem>
                <SelectItem value="agriculture">Agriculture</SelectItem>
                <SelectItem value="timber">Timber</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="date-added">
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-added">Date Added</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bulk Actions */}
        {filteredFavorites.length > 0 && (
          <div className="flex items-center justify-between mb-4 p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <Checkbox checked={selectedItems.length === filteredFavorites.length} onCheckedChange={handleSelectAll} />
              <span className="text-sm font-medium">
                {selectedItems.length === filteredFavorites.length ? "Deselect All" : "Select All"}
              </span>
            </div>

            {selectedItems.length > 0 && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleBulkAddToCart} className="bg-transparent">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart ({selectedItems.length})
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkRemove}
                  className="bg-transparent text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove ({selectedItems.length})
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All ({favorites.length})</TabsTrigger>
            <TabsTrigger value="metals">Metals ({favorites.filter((f) => f.category === "metals").length})</TabsTrigger>
            <TabsTrigger value="oil">Oil & Gas ({favorites.filter((f) => f.category === "oil").length})</TabsTrigger>
            <TabsTrigger value="agriculture">
              Agriculture ({favorites.filter((f) => f.category === "agriculture").length})
            </TabsTrigger>
            <TabsTrigger value="timber">Timber ({favorites.filter((f) => f.category === "timber").length})</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Favorites Grid/List */}
        <div className={viewMode === "grid" ? "grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "space-y-4"}>
          {filteredFavorites.map((item) => (
            <FavoriteCard
              key={item.id}
              item={item}
              viewMode={viewMode}
              isSelected={selectedItems.includes(item.id)}
              onSelect={() => handleItemSelect(item.id)}
              onRemove={() => handleRemoveFromFavorites(item.id)}
              onAddToCart={() => handleAddToCart(item.id)}
            />
          ))}
        </div>

        {filteredFavorites.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No items found</h2>
            <p className="text-muted-foreground mb-4">Try adjusting your search or filter criteria.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
              }}
              className="bg-transparent"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Price Alerts Section */}
        {favorites.length > 0 && (
          <Card className="mt-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Price Alerts</h3>
                  <p className="text-sm text-muted-foreground">
                    Get notified when your favorite items reach your target price
                  </p>
                </div>
                <Button variant="outline" className="bg-transparent">
                  Manage Alerts
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockPriceAlerts.map((alert) => (
                  <div key={alert.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{alert.productName}</span>
                      <Badge variant={alert.status === "active" ? "default" : "secondary"}>{alert.status}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>Target: ${alert.targetPrice}</p>
                      <p>Current: ${alert.currentPrice}</p>
                      <p className={alert.difference > 0 ? "text-red-600" : "text-green-600"}>
                        {alert.difference > 0 ? "+" : ""}${alert.difference} ({alert.percentage}%)
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}

// Favorite Card Component
function FavoriteCard({
  item,
  viewMode,
  isSelected,
  onSelect,
  onRemove,
  onAddToCart,
}: {
  item: FavoriteItem
  viewMode: "grid" | "list"
  isSelected: boolean
  onSelect: () => void
  onRemove: () => void
  onAddToCart: () => void
}) {
  if (viewMode === "list") {
    return (
      <Card className="overflow-hidden">
        <div className="flex">
          <div className="p-3 flex items-center">
            <Checkbox checked={isSelected} onCheckedChange={onSelect} />
          </div>
          <div className="relative h-24 w-24 flex-shrink-0">
            <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
          </div>
          <div className="flex flex-1 flex-col justify-between p-4">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="secondary">{item.category}</Badge>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current text-yellow-400" />
                  <span className="text-xs">{item.rating}</span>
                </div>
                <span className="text-xs text-muted-foreground">Added {item.dateAdded}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold">${item.price}</div>
                <div className="text-sm text-muted-foreground">{item.unit}</div>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/product/${item.id}`}>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    View
                  </Button>
                </Link>
                <Button size="sm" onClick={onAddToCart}>
                  Add to Cart
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRemove}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
      <div className="relative aspect-square">
        <Image
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform"
        />
        <div className="absolute top-2 left-2">
          <Checkbox checked={isSelected} onCheckedChange={onSelect} className="bg-white/80 border-white" />
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-2 top-2 bg-white/80 hover:bg-white text-red-500 hover:text-red-600"
          onClick={onRemove}
        >
          <Heart className="h-4 w-4 fill-current" />
        </Button>
        <Badge className="absolute left-2 bottom-2">Added {item.dateAdded}</Badge>
      </div>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              {item.category}
            </Badge>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-current text-yellow-400" />
              <span className="text-xs">{item.rating}</span>
            </div>
          </div>
          <h3 className="font-semibold line-clamp-1">{item.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold">${item.price}</div>
              <div className="text-xs text-muted-foreground">{item.unit}</div>
            </div>
            {item.priceChange && (
              <div className={`text-xs ${item.priceChange > 0 ? "text-red-600" : "text-green-600"}`}>
                {item.priceChange > 0 ? "+" : ""}
                {item.priceChange}%
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 space-y-2">
        <Link href={`/product/${item.id}`} className="w-full">
          <Button variant="outline" className="w-full bg-transparent">
            View Details
          </Button>
        </Link>
        <Button className="w-full" onClick={onAddToCart}>
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}

// Types
interface FavoriteItem {
  id: string
  name: string
  description: string
  price: string
  unit: string
  category: string
  rating: number
  image: string
  dateAdded: string
  priceChange?: number
}

// Mock data
const mockFavorites: FavoriteItem[] = [
  {
    id: "1",
    name: "Gold Bullion - 1oz American Eagle",
    description: "99.9% pure gold bullion coin",
    price: "1950.00",
    unit: "per oz",
    category: "metals",
    rating: 4.8,
    image: "/placeholder.svg?height=300&width=300",
    dateAdded: "2 days ago",
    priceChange: 2.5,
  },
  {
    id: "2",
    name: "Silver Bars - 10oz",
    description: "Fine silver bars with certificate",
    price: "280.00",
    unit: "per 10oz bar",
    category: "metals",
    rating: 4.6,
    image: "/placeholder.svg?height=300&width=300",
    dateAdded: "1 week ago",
    priceChange: -1.2,
  },
  {
    id: "3",
    name: "Crude Oil Futures",
    description: "West Texas Intermediate crude oil",
    price: "75.00",
    unit: "per barrel",
    category: "oil",
    rating: 4.2,
    image: "/placeholder.svg?height=300&width=300",
    dateAdded: "3 days ago",
    priceChange: 3.8,
  },
  {
    id: "4",
    name: "Premium Wheat",
    description: "Hard red winter wheat, grade A",
    price: "7.25",
    unit: "per bushel",
    category: "agriculture",
    rating: 4.5,
    image: "/placeholder.svg?height=300&width=300",
    dateAdded: "5 days ago",
    priceChange: -0.5,
  },
  {
    id: "5",
    name: "Pine Lumber",
    description: "Construction grade pine lumber",
    price: "450.00",
    unit: "per 1000 board ft",
    category: "timber",
    rating: 4.3,
    image: "/placeholder.svg?height=300&width=300",
    dateAdded: "1 week ago",
    priceChange: 1.8,
  },
  {
    id: "6",
    name: "Coffee Beans - Premium Arabica",
    description: "Premium Arabica coffee beans from Colombia",
    price: "180.00",
    unit: "per 100 lbs",
    category: "agriculture",
    rating: 4.7,
    image: "/placeholder.svg?height=300&width=300",
    dateAdded: "4 days ago",
    priceChange: 2.1,
  },
]

const mockPriceAlerts = [
  {
    id: "1",
    productName: "Gold Bullion - 1oz",
    targetPrice: "1900.00",
    currentPrice: "1950.00",
    difference: 50.0,
    percentage: 2.6,
    status: "active",
  },
  {
    id: "2",
    productName: "Silver Bars - 10oz",
    targetPrice: "270.00",
    currentPrice: "280.00",
    difference: 10.0,
    percentage: 3.7,
    status: "active",
  },
  {
    id: "3",
    productName: "Crude Oil Futures",
    targetPrice: "80.00",
    currentPrice: "75.00",
    difference: -5.0,
    percentage: -6.3,
    status: "triggered",
  },
]
