"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { TrendingUp, TrendingDown, Star, BarChart3, Target, Search, MoreHorizontal } from "lucide-react"
import { useContentPadding } from "@/contexts/sidebar-context"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export default function ProductPerformancePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("revenue")
  const [timeframe, setTimeframe] = useState("30d")
  const { contentPadding, containerWidth } = useContentPadding()

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || product.category.toLowerCase() === categoryFilter
    return matchesSearch && matchesCategory
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "revenue":
        return b.revenue - a.revenue
      case "views":
        return b.views - a.views
      case "conversion":
        return b.conversionRate - a.conversionRate
      case "rating":
        return b.rating - a.rating
      default:
        return 0
    }
  })

  return (
    <div className={`min-h-screen ${contentPadding}`}>
      <div className={`mx-auto space-y-6 ${containerWidth}`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Product Performance</h1>
            <p className="text-muted-foreground">Analyze individual product metrics and optimization opportunities</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Products</p>
                  <p className="text-2xl font-bold">28</p>
                  <p className="text-xs text-muted-foreground">Active listings</p>
                </div>
                <BarChart3 className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Conversion</p>
                  <p className="text-2xl font-bold">4.2%</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-xs text-green-600">+0.8%</span>
                  </div>
                </div>
                <Target className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Top Performer</p>
                  <p className="text-2xl font-bold">Gold 1oz</p>
                  <p className="text-xs text-muted-foreground">$45K revenue</p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Needs Attention</p>
                  <p className="text-2xl font-bold">5</p>
                  <p className="text-xs text-muted-foreground">Low performers</p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filters and Search */}
            <Card>
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
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-[140px]">
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
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="revenue">Revenue</SelectItem>
                        <SelectItem value="views">Views</SelectItem>
                        <SelectItem value="conversion">Conversion</SelectItem>
                        <SelectItem value="rating">Rating</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Performance List */}
            <Card>
              <CardHeader>
                <CardTitle>Product Analytics</CardTitle>
                <CardDescription>Detailed performance metrics for {sortedProducts.length} products</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sortedProducts.map((product) => (
                    <div key={product.id} className="p-4 border rounded-lg">
                      <div className="flex items-start gap-4">
                        <div className="relative h-16 w-16 overflow-hidden rounded-md">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-medium">{product.name}</h4>
                              <p className="text-sm text-muted-foreground">{product.category}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={getPerformanceBadge(product.performanceScore)}>
                                {product.performanceScore}/100
                              </Badge>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem asChild>
                                    <Link href={`/dashboard/seller/products/${product.id}`}>View Product</Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <Link href={`/dashboard/seller/edit-product/${product.id}`}>Edit Product</Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>Optimize Pricing</DropdownMenuItem>
                                  <DropdownMenuItem>Boost Visibility</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-3">
                            <div>
                              <p className="text-sm text-muted-foreground">Revenue</p>
                              <p className="font-medium">${product.revenue.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Views</p>
                              <p className="font-medium">{product.views.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Sales</p>
                              <p className="font-medium">{product.sales}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Conversion</p>
                              <p className="font-medium">{product.conversionRate}%</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Rating</p>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">{product.rating}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                {product.trend === "up" ? (
                                  <TrendingUp className="h-4 w-4 text-green-600" />
                                ) : (
                                  <TrendingDown className="h-4 w-4 text-red-600" />
                                )}
                                <span className={product.trend === "up" ? "text-green-600" : "text-red-600"}>
                                  {product.change}
                                </span>
                              </div>
                              <span className="text-muted-foreground">vs last period</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {product.needsAttention && <Badge variant="destructive">Needs Attention</Badge>}
                              <Button variant="outline" size="sm" asChild className="bg-transparent">
                                <Link href={`/dashboard/seller/products/${product.id}`}>View Details</Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Performance Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Distribution</CardTitle>
                <CardDescription>How your products are performing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={performanceDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {performanceDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-1 gap-2 mt-4">
                  {performanceDistribution.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Opportunities */}
            <Card>
              <CardHeader>
                <CardTitle>Optimization Opportunities</CardTitle>
                <CardDescription>Products with improvement potential</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {optimizationOpportunities.map((opportunity, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="relative h-8 w-8 overflow-hidden rounded">
                          <Image
                            src={opportunity.image || "/placeholder.svg"}
                            alt={opportunity.product}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{opportunity.product}</h4>
                          <p className="text-xs text-muted-foreground">{opportunity.issue}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {opportunity.impact}
                        </Badge>
                        <Button variant="ghost" size="sm" className="h-auto p-0 text-blue-600">
                          Fix
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Category Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
                <CardDescription>Revenue by product category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryPerformance.map((category, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{category.name}</span>
                        <span className="font-medium">${category.revenue}K</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{category.products} products</span>
                        <span>{category.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Overall product performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="avgScore" stroke="#10B981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 p-3 bg-green-50 rounded-md">
                  <p className="text-sm text-green-700">
                    <strong>Trend:</strong> Average performance score improved by 12% this month.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function
function getPerformanceBadge(score: number) {
  if (score >= 80) return "default"
  if (score >= 60) return "secondary"
  return "destructive"
}

// Mock data
const mockProducts = [
  {
    id: "1",
    name: "Gold Bullion - 1oz",
    category: "Precious Metals",
    revenue: 45000,
    views: 2847,
    sales: 127,
    conversionRate: 4.5,
    rating: 4.8,
    performanceScore: 92,
    trend: "up",
    change: "+23%",
    needsAttention: false,
    image: "/placeholder.svg?height=64&width=64",
  },
  {
    id: "2",
    name: "Silver Bars - 10oz",
    category: "Precious Metals",
    revenue: 24920,
    views: 1923,
    sales: 89,
    conversionRate: 4.6,
    rating: 4.7,
    performanceScore: 88,
    trend: "up",
    change: "+18%",
    needsAttention: false,
    image: "/placeholder.svg?height=64&width=64",
  },
  {
    id: "3",
    name: "Platinum Coin - 1oz",
    category: "Precious Metals",
    revenue: 44100,
    views: 1456,
    sales: 45,
    conversionRate: 3.1,
    rating: 4.5,
    performanceScore: 75,
    trend: "down",
    change: "-8%",
    needsAttention: true,
    image: "/placeholder.svg?height=64&width=64",
  },
  {
    id: "4",
    name: "Gold Bar - 10oz",
    category: "Precious Metals",
    revenue: 195000,
    views: 987,
    sales: 10,
    conversionRate: 1.0,
    rating: 4.9,
    performanceScore: 95,
    trend: "up",
    change: "+12%",
    needsAttention: false,
    image: "/placeholder.svg?height=64&width=64",
  },
  {
    id: "5",
    name: "Crude Oil Futures",
    category: "Oil & Gas",
    revenue: 15600,
    views: 1234,
    sales: 34,
    conversionRate: 2.8,
    rating: 4.3,
    performanceScore: 72,
    trend: "up",
    change: "+5%",
    needsAttention: false,
    image: "/placeholder.svg?height=64&width=64",
  },
  {
    id: "6",
    name: "Premium Wheat",
    category: "Agriculture",
    revenue: 8750,
    views: 2156,
    sales: 156,
    conversionRate: 7.2,
    rating: 4.6,
    performanceScore: 85,
    trend: "up",
    change: "+15%",
    needsAttention: false,
    image: "/placeholder.svg?height=64&width=64",
  },
]

const performanceDistribution = [
  { name: "Excellent (80-100)", value: 8, color: "#10B981" },
  { name: "Good (60-79)", value: 12, color: "#3B82F6" },
  { name: "Needs Work (40-59)", value: 6, color: "#F59E0B" },
  { name: "Poor (0-39)", value: 2, color: "#EF4444" },
]

const optimizationOpportunities = [
  {
    product: "Platinum Coin - 1oz",
    issue: "Low conversion rate",
    impact: "High Impact",
    image: "/placeholder.svg?height=32&width=32",
  },
  {
    product: "Natural Gas Futures",
    issue: "Poor product photos",
    impact: "Medium Impact",
    image: "/placeholder.svg?height=32&width=32",
  },
  {
    product: "Coffee Beans",
    issue: "Pricing too high",
    impact: "High Impact",
    image: "/placeholder.svg?height=32&width=32",
  },
  {
    product: "Timber Logs",
    issue: "Missing description",
    impact: "Low Impact",
    image: "/placeholder.svg?height=32&width=32",
  },
]

const categoryPerformance = [
  { name: "Precious Metals", revenue: 309, products: 15, percentage: 85 },
  { name: "Oil & Gas", revenue: 42, products: 8, percentage: 35 },
  { name: "Agriculture", revenue: 28, products: 12, percentage: 25 },
  { name: "Timber", revenue: 15, products: 3, percentage: 15 },
]

const performanceTrends = [
  { date: "Jan", avgScore: 72 },
  { date: "Feb", avgScore: 75 },
  { date: "Mar", avgScore: 78 },
  { date: "Apr", avgScore: 81 },
  { date: "May", avgScore: 84 },
  { date: "Jun", avgScore: 87 },
  { date: "Jul", avgScore: 89 },
]