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
} from "lucide-react"

import { DashboardLayout } from "@/components/layouts/dashboard-layout"
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

export default function InventoryPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "table">("table")

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || product.status.toLowerCase() === statusFilter
    const matchesCategory = categoryFilter === "all" || product.category.toLowerCase() === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const handleBulkAction = (action: string) => {
    if (selectedItems.length === 0) {
      toast({
        title: "No Items Selected",
        description: "Please select items to perform bulk actions.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Bulk Action",
      description: `${action} applied to ${selectedItems.length} items.`,
    })
    setSelectedItems([])
  }

  const handleItemSelect = (id: string) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]))
  }

  const handleSelectAll = () => {
    if (selectedItems.length === filteredProducts.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredProducts.map((product) => product.id))
    }
  }

  return (
    <DashboardLayout userRole="seller">
      <div className="container mx-auto px-4 py-6 pb-20 lg:pb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Inventory Management</h1>
            <p className="text-muted-foreground">Manage your product listings and stock levels</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/add-product">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </Link>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Products</p>
                  <p className="text-2xl font-bold">{mockProducts.length}</p>
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
                  <p className="text-2xl font-bold">{mockProducts.filter((p) => p.status === "Active").length}</p>
                </div>
                <div className="text-green-600">●</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Low Stock</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {mockProducts.filter((p) => p.stock <= p.lowStockThreshold).length}
                  </p>
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
                  <p className="text-2xl font-bold text-red-600">{mockProducts.filter((p) => p.stock === 0).length}</p>
                </div>
                <div className="text-red-600">●</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="out of stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[160px]">
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
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{selectedItems.length} items selected</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction("Edit")}
                    className="bg-transparent"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction("Pause")}
                    className="bg-transparent"
                  >
                    Pause
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction("Delete")}
                    className="bg-transparent text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Products Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Products</CardTitle>
                <CardDescription>
                  {filteredProducts.length} of {mockProducts.length} products
                </CardDescription>
              </div>
              <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "grid" | "table")}>
                <TabsList>
                  <TabsTrigger value="table">Table</TabsTrigger>
                  <TabsTrigger value="grid">Grid</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            {viewMode === "table" ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedItems.length === filteredProducts.length}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.includes(product.id)}
                          onCheckedChange={() => handleItemSelect(product.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 overflow-hidden rounded-md">
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground line-clamp-1">{product.description}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        ${product.price} {product.unit}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={product.stock <= product.lowStockThreshold ? "text-amber-600" : ""}>
                            {product.stock}
                          </span>
                          {product.stock <= product.lowStockThreshold && (
                            <AlertTriangle className="h-4 w-4 text-amber-600" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(product.status)}>{product.status}</Badge>
                      </TableCell>
                      <TableCell>
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
                              <Link href={`/product/${product.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Product
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/edit-product/${product.id}`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Duplicate</DropdownMenuItem>
                            <DropdownMenuItem>{product.status === "Active" ? "Pause" : "Activate"}</DropdownMenuItem>
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
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden">
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
                        <Badge variant={getStatusVariant(product.status)}>{product.status}</Badge>
                      </div>
                      {product.stock <= product.lowStockThreshold && (
                        <div className="absolute bottom-2 left-2">
                          <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Low Stock
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
                          <span className="text-xs text-muted-foreground">{product.sku}</span>
                        </div>
                        <h3 className="font-semibold line-clamp-1">{product.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-bold">${product.price}</div>
                            <div className="text-xs text-muted-foreground">{product.unit}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm">Stock: {product.stock}</div>
                            <div className="text-xs text-muted-foreground">{product.totalSales} sold</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <div className="p-4 pt-0 flex gap-2">
                      <Link href={`/product/${product.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full bg-transparent">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </Link>
                      <Link href={`/edit-product/${product.id}`} className="flex-1">
                        <Button size="sm" className="w-full">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No products found</h2>
            <p className="text-muted-foreground mb-4">Try adjusting your search or filter criteria.</p>
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
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

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
