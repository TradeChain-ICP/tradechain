// app/dashboard/seller/inventory/page.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Grid3X3,
  List,
  Download,
  RefreshCw,
  SortAsc,
  SortDesc,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useContentPadding } from "@/contexts/sidebar-context"

// Mock data
const mockProducts = [
  {
    id: "1",
    name: "Gold Bullion - 1oz American Eagle",
    description: "99.9% pure gold bullion coin from the U.S. Mint",
    sku: "GOLD-1OZ-AE-2024",
    category: "Precious Metals",
    price: "1950.00",
    unit: "per oz",
    stock: 25,
    lowStockThreshold: 10,
    status: "Active",
    totalSales: 127,
    salesTrend: "up",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "2",
    name: "Silver Bars - 10oz",
    description: "Fine silver bars with certificate of authenticity",
    sku: "SILVER-10OZ-BAR",
    category: "Precious Metals",
    price: "280.00",
    unit: "per 10oz bar",
    stock: 8,
    lowStockThreshold: 10,
    status: "Active",
    totalSales: 89,
    salesTrend: "up",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "3",
    name: "Platinum Coin - 1oz",
    description: "Premium platinum coin with high purity",
    sku: "PLAT-1OZ-COIN",
    category: "Precious Metals",
    price: "980.00",
    unit: "per oz",
    stock: 0,
    lowStockThreshold: 5,
    status: "Out of Stock",
    totalSales: 45,
    salesTrend: "down",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "4",
    name: "Premium Wheat",
    description: "Hard red winter wheat, grade A quality",
    sku: "WHEAT-GRADE-A",
    category: "Agriculture",
    price: "7.25",
    unit: "per bushel",
    stock: 500,
    lowStockThreshold: 100,
    status: "Active",
    totalSales: 234,
    salesTrend: "up",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "5",
    name: "Crude Oil Futures",
    description: "West Texas Intermediate crude oil contracts",
    sku: "OIL-WTI-FUT",
    category: "Oil & Gas",
    price: "75.00",
    unit: "per barrel",
    stock: 100,
    lowStockThreshold: 20,
    status: "Active",
    totalSales: 156,
    salesTrend: "up",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "6",
    name: "Pine Lumber",
    description: "Construction grade pine lumber, kiln dried",
    sku: "LUMBER-PINE-KD",
    category: "Timber",
    price: "450.00",
    unit: "per 1000 board ft",
    stock: 15,
    lowStockThreshold: 20,
    status: "Active",
    totalSales: 67,
    salesTrend: "down",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "7",
    name: "Coffee Beans - Premium Arabica",
    description: "Premium Arabica coffee beans from Colombia",
    sku: "COFFEE-ARABICA-COL",
    category: "Agriculture",
    price: "180.00",
    unit: "per 100 lbs",
    stock: 75,
    lowStockThreshold: 25,
    status: "Active",
    totalSales: 198,
    salesTrend: "up",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "8",
    name: "Gold Bar - 10oz",
    description: "LBMA certified gold bar, 99.99% pure",
    sku: "GOLD-10OZ-BAR",
    category: "Precious Metals",
    price: "19500.00",
    unit: "per 10oz bar",
    stock: 3,
    lowStockThreshold: 5,
    status: "Active",
    totalSales: 23,
    salesTrend: "up",
    image: "/placeholder.svg?height=200&width=200",
  },
]

// Helper function
function getStatusVariant(status: string) {
  switch (status) {
    case "Active":
      return "default"
    case "Draft":
      return "secondary"
    case "Paused":
      return "outline"
    case "Out of Stock":
      return "destructive"
    default:
      return "outline"
  }
}

export default function InventoryPage() {
  const { toast } = useToast()
  const { contentPadding } = useContentPadding()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [isLoading, setIsLoading] = useState(false)

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || product.status.toLowerCase() === statusFilter
    const matchesCategory = categoryFilter === "all" || product.category.toLowerCase() === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    let aValue = a[sortBy as keyof typeof a]
    let bValue = b[sortBy as keyof typeof b]
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase()
      bValue = (bValue as string).toLowerCase()
    }
    
    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    }
  })

  const handleBulkAction = async (action: string) => {
    if (selectedItems.length === 0) {
      toast({
        title: "No Items Selected",
        description: "Please select items to perform bulk actions.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "Bulk Action Complete",
        description: `${action} applied to ${selectedItems.length} items.`,
      })
      setSelectedItems([])
    } catch (error) {
      toast({
        title: "Action Failed",
        description: "Failed to perform bulk action. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleItemSelect = (id: string) => {
    setSelectedItems((prev) => 
      prev.includes(id) 
        ? prev.filter((itemId) => itemId !== id) 
        : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedItems.length === sortedProducts.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(sortedProducts.map((product) => product.id))
    }
  }

  const getStatusCounts = () => {
    return {
      total: mockProducts.length,
      active: mockProducts.filter((p) => p.status === "Active").length,
      draft: mockProducts.filter((p) => p.status === "Draft").length,
      paused: mockProducts.filter((p) => p.status === "Paused").length,
      outOfStock: mockProducts.filter((p) => p.status === "Out of Stock").length,
      lowStock: mockProducts.filter((p) => p.stock <= p.lowStockThreshold && p.stock > 0).length,
    }
  }

  const statusCounts = getStatusCounts()

  return (
    <div className={`py-6 pb-20 lg:pb-8 ${contentPadding}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground">Manage your product listings and stock levels</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-transparent" onClick={() => setIsLoading(true)}>
            <RefreshCw className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Button variant="outline" className="bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Link href="/dashboard/seller/add-product">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold">{statusCounts.total}</p>
              </div>
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Listings</p>
                <p className="text-2xl font-bold text-green-600">{statusCounts.active}</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Low Stock</p>
                <p className="text-2xl font-bold text-amber-600">{statusCounts.lowStock}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">{statusCounts.outOfStock}</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            {/* Search and View Toggle */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search products by name or SKU..."
                    className="pl-8 text-base"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={viewMode !== "grid" ? "bg-transparent" : ""}
                >
                  <Grid3X3 className="h-4 w-4" />
                  <span className="hidden sm:ml-2 sm:inline">Grid</span>
                </Button>
                <Button
                  variant={viewMode === "table" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                  className={viewMode !== "table" ? "bg-transparent" : ""}
                >
                  <List className="h-4 w-4" />
                  <span className="hidden sm:ml-2 sm:inline">Table</span>
                </Button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active ({statusCounts.active})</SelectItem>
                  <SelectItem value="draft">Draft ({statusCounts.draft})</SelectItem>
                  <SelectItem value="paused">Paused ({statusCounts.paused})</SelectItem>
                  <SelectItem value="out of stock">Out of Stock ({statusCounts.outOfStock})</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="precious metals">Precious Metals</SelectItem>
                  <SelectItem value="oil & gas">Oil & Gas</SelectItem>
                  <SelectItem value="agriculture">Agriculture</SelectItem>
                  <SelectItem value="timber">Timber</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[120px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="stock">Stock</SelectItem>
                  <SelectItem value="totalSales">Sales</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="bg-transparent"
              >
                {sortOrder === "asc" ? (
                  <SortAsc className="h-4 w-4" />
                ) : (
                  <SortDesc className="h-4 w-4" />
                )}
              </Button>

              <Button variant="outline" size="sm" className="bg-transparent">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-sm font-medium">
                {selectedItems.length} items selected
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("Edit")}
                  className="bg-transparent"
                  disabled={isLoading}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("Activate")}
                  className="bg-transparent"
                  disabled={isLoading}
                >
                  Activate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("Pause")}
                  className="bg-transparent"
                  disabled={isLoading}
                >
                  Pause
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("Delete")}
                  className="bg-transparent text-destructive hover:text-destructive"
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Products Display */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Products</CardTitle>
              <CardDescription>
                {sortedProducts.length} of {mockProducts.length} products
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === "grid" ? (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sortedProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative aspect-square">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <Checkbox
                        checked={selectedItems.includes(product.id)}
                        onCheckedChange={() => handleItemSelect(product.id)}
                        className="bg-white/80 border-white"
                      />
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge variant={getStatusVariant(product.status)}>
                        {product.status}
                      </Badge>
                    </div>
                    {product.stock <= product.lowStockThreshold && (
                      <div className="absolute bottom-2 left-2">
                        <Badge variant="secondary" className="bg-amber-100 text-amber-700 text-xs">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {product.stock === 0 ? "No Stock" : "Low Stock"}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {product.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground font-mono">
                          {product.sku}
                        </span>
                      </div>
                      <h3 className="font-semibold line-clamp-1">{product.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold">${product.price}</div>
                          <div className="text-xs text-muted-foreground">{product.unit}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm">
                            Stock: {product.stock}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            {product.salesTrend === "up" ? (
                              <TrendingUp className="h-3 w-3 text-green-600" />
                            ) : (
                              <TrendingDown className="h-3 w-3 text-red-600" />
                            )}
                            {product.totalSales} sold
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <div className="p-4 pt-0 flex gap-2">
                    <Link href={`/dashboard/seller/products/${product.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </Link>
                    <Link href={`/dashboard/seller/edit-product/${product.id}`} className="flex-1">
                      <Button size="sm" className="w-full">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedItems.length === sortedProducts.length}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead className="hidden md:table-cell">SKU</TableHead>
                    <TableHead className="hidden sm:table-cell">Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead className="hidden lg:table-cell">Status</TableHead>
                    <TableHead className="hidden xl:table-cell">Performance</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.includes(product.id)}
                          onCheckedChange={() => handleItemSelect(product.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 overflow-hidden rounded-md flex-shrink-0">
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium truncate">{product.name}</div>
                            <div className="text-sm text-muted-foreground line-clamp-1 sm:hidden">
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm hidden md:table-cell">
                        {product.sku}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant="outline">{product.category}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div>${product.price}</div>
                        <div className="text-xs text-muted-foreground">{product.unit}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={product.stock <= product.lowStockThreshold ? "text-amber-600 font-medium" : ""}>
                            {product.stock}
                          </span>
                          {product.stock <= product.lowStockThreshold && (
                            <AlertTriangle className="h-4 w-4 text-amber-600" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Badge variant={getStatusVariant(product.status)}>
                          {product.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        <div className="flex items-center gap-1">
                          {product.salesTrend === "up" ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                          <span className="text-sm">{product.totalSales} sold</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/seller/products/${product.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Product
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/seller/edit-product/${product.id}`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              {product.status === "Active" ? "Pause" : "Activate"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {sortedProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No products found</h2>
              <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter !== "all" || categoryFilter !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Get started by adding your first product."}
              </p>
              {searchQuery || statusFilter !== "all" || categoryFilter !== "all" ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("")
                    setStatusFilter("all")
                    setCategoryFilter("all")
                  }}
                  className="bg-transparent"
                >
                  Clear Filters
                </Button>
              ) : (
                <Link href="/dashboard/seller/add-product">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}