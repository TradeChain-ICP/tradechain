"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Star,
  BarChart3,
  Target,
  Search,
  MoreHorizontal,
  Calendar,
} from "lucide-react"

import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { RoleGuard } from "@/components/auth/role-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export default function ProductPerformanceSinglePage({ params }: { params: { id: string } }) {
  const productId = params.id
  const [timeframe, setTimeframe] = useState("30d")

  // In a real app, you would fetch the product data based on the ID
  const product = mockProduct

  return (
    <RoleGuard allowedRoles={["seller"]}>
      <DashboardLayout userRole="seller">
        <div className="container mx-auto px-4 py-6 pb-20 lg:pb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/product-performance">
              <Button variant="outline" size="sm" className="bg-transparent">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Performance
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">{product.name}</h1>
              <p className="text-muted-foreground">Product performance analytics</p>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Badge variant={getPerformanceBadge(product.performanceScore)}>
                Performance Score: {product.performanceScore}/100
              </Badge>
              <div className="flex items-center gap-1 text-sm">
                {product.trend === "up" ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span className={product.trend === "up" ? "text-green-600" : "text-red-600"}>
                  {product.change} vs last period
                </span>
              </div>
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="bg-transparent">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Export Data</DropdownMenuItem>
                  <DropdownMenuItem>Print Report</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Schedule Report</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Product Overview */}
          <div className="flex items-center gap-4 p-4 border rounded-lg mb-6">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              width={80}
              height={80}
              className="rounded-md"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{product.name}</h3>
                <Badge variant="outline" className="text-xs">
                  {product.category}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">{product.rating}</span>
                </div>
                <div className="text-sm">Price: ${product.price}</div>
                <div className="text-sm">Stock: {product.stock}</div>
                <div className="text-sm">SKU: {product.sku}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href={`/edit-product/${productId}`}>
                <Button variant="outline" size="sm" className="bg-transparent">
                  Edit Product
                </Button>
              </Link>
              <Link href={`/product/${productId}`}>
                <Button variant="outline" size="sm" className="bg-transparent">
                  View Listing
                </Button>
              </Link>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid gap-4 md:grid-cols-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="text-2xl font-bold">${product.revenue.toLocaleString()}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-xs text-green-600">+12.5%</span>
                    </div>
                  </div>
                  <BarChart3 className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Views</p>
                    <p className="text-2xl font-bold">{product.views.toLocaleString()}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-xs text-green-600">+8.3%</span>
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
                    <p className="text-sm text-muted-foreground">Conversion</p>
                    <p className="text-2xl font-bold">{product.conversionRate}%</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingDown className="h-4 w-4 text-red-600" />
                      <span className="text-xs text-red-600">-1.2%</span>
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
                    <p className="text-sm text-muted-foreground">Sales</p>
                    <p className="text-2xl font-bold">{product.sales}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-xs text-green-600">+15.7%</span>
                    </div>
                  </div>
                  <BarChart3 className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="sales">Sales</TabsTrigger>
              <TabsTrigger value="traffic">Traffic</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="optimization">Optimization</TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="overview" className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-3">
                  {/* Sales Trend */}
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle>Sales & Revenue Trend</CardTitle>
                      <CardDescription>Performance over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={salesTrendData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" />
                            <Tooltip />
                            <Line
                              yAxisId="left"
                              type="monotone"
                              dataKey="sales"
                              stroke="#3B82F6"
                              strokeWidth={2}
                              name="Sales"
                            />
                            <Line
                              yAxisId="right"
                              type="monotone"
                              dataKey="revenue"
                              stroke="#10B981"
                              strokeWidth={2}
                              name="Revenue"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Conversion Funnel */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Conversion Funnel</CardTitle>
                      <CardDescription>Visitor to buyer journey</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={conversionFunnelData}
                            layout="vertical"
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={100} />
                            <Tooltip />
                            <Bar dataKey="value" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="mt-4 p-3 bg-blue-50 rounded-md">
                        <p className="text-sm text-blue-700">
                          <strong>Insight:</strong> Your product page to cart conversion is strong at 15%, but checkout
                          completion could be improved.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Traffic Sources */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Traffic Sources</CardTitle>
                      <CardDescription>Where your visitors come from</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={trafficSourcesData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {trafficSourcesData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="grid grid-cols-1 gap-2 mt-4">
                        {trafficSourcesData.map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                              <span className="text-sm">{item.name}</span>
                            </div>
                            <span className="text-sm font-medium">{item.value}%</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Buyer Demographics */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Buyer Demographics</CardTitle>
                      <CardDescription>Who is purchasing your product</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Age Distribution</h4>
                          <div className="space-y-2">
                            {ageDistribution.map((item) => (
                              <div key={item.age} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span>{item.age}</span>
                                  <span>{item.percentage}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${item.percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium mb-2">Top Locations</h4>
                          <div className="space-y-2">
                            {topLocations.map((item) => (
                              <div key={item.location} className="flex justify-between text-sm">
                                <span>{item.location}</span>
                                <span>{item.percentage}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Competitor Analysis */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Competitor Analysis</CardTitle>
                      <CardDescription>How your product compares</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {competitorAnalysis.map((item) => (
                          <div key={item.name} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>{item.name}</span>
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span>{item.rating}</span>
                              </div>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>${item.price}</span>
                              <span>{item.sales} sales</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  item.name === "Your Product" ? "bg-green-600" : "bg-blue-600"
                                }`}
                                style={{ width: `${(item.sales / 150) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 p-3 bg-amber-50 rounded-md">
                        <p className="text-sm text-amber-700">
                          <strong>Insight:</strong> Your price is 5% higher than the average competitor, but your rating
                          is also higher.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="sales" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Sales Analysis</CardTitle>
                    <CardDescription>Detailed sales metrics and patterns</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={detailedSalesData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="sales" stroke="#3B82F6" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <div className="p-4 border rounded-lg">
                        <h4 className="text-sm font-medium text-muted-foreground">Total Sales</h4>
                        <p className="text-2xl font-bold">{product.sales}</p>
                        <div className="flex items-center gap-1 mt-1 text-xs">
                          <TrendingUp className="h-3 w-3 text-green-600" />
                          <span className="text-green-600">+15.7% vs last period</span>
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="text-sm font-medium text-muted-foreground">Average Order Value</h4>
                        <p className="text-2xl font-bold">${(product.revenue / product.sales).toFixed(2)}</p>
                        <div className="flex items-center gap-1 mt-1 text-xs">
                          <TrendingUp className="h-3 w-3 text-green-600" />
                          <span className="text-green-600">+3.2% vs last period</span>
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="text-sm font-medium text-muted-foreground">Repeat Purchases</h4>
                        <p className="text-2xl font-bold">18%</p>
                        <div className="flex items-center gap-1 mt-1 text-xs">
                          <TrendingDown className="h-3 w-3 text-red-600" />
                          <span className="text-red-600">-2.5% vs last period</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="traffic" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Traffic Analysis</CardTitle>
                    <CardDescription>Visitor behavior and engagement</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trafficData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="views" stroke="#3B82F6" strokeWidth={2} />
                          <Line type="monotone" dataKey="uniqueVisitors" stroke="#10B981" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <div className="p-4 border rounded-lg">
                        <h4 className="text-sm font-medium text-muted-foreground">Page Views</h4>
                        <p className="text-2xl font-bold">{product.views.toLocaleString()}</p>
                        <div className="flex items-center gap-1 mt-1 text-xs">
                          <TrendingUp className="h-3 w-3 text-green-600" />
                          <span className="text-green-600">+8.3% vs last period</span>
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="text-sm font-medium text-muted-foreground">Avg. Time on Page</h4>
                        <p className="text-2xl font-bold">2:45</p>
                        <div className="flex items-center gap-1 mt-1 text-xs">
                          <TrendingUp className="h-3 w-3 text-green-600" />
                          <span className="text-green-600">+0:15 vs last period</span>
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="text-sm font-medium text-muted-foreground">Bounce Rate</h4>
                        <p className="text-2xl font-bold">32%</p>
                        <div className="flex items-center gap-1 mt-1 text-xs">
                          <TrendingDown className="h-3 w-3 text-green-600" />
                          <span className="text-green-600">-5% vs last period</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Reviews</CardTitle>
                    <CardDescription>Feedback and ratings analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/3 p-4 border rounded-lg text-center">
                        <div className="text-5xl font-bold mb-2">{product.rating}</div>
                        <div className="flex items-center justify-center gap-1 mb-4">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-5 w-5 ${
                                star <= Math.round(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground">Based on 48 reviews</p>
                      </div>
                      <div className="md:w-2/3">
                        <div className="space-y-2">
                          {[5, 4, 3, 2, 1].map((rating) => (
                            <div key={rating} className="flex items-center gap-2">
                              <div className="flex items-center gap-1 w-12">
                                <span>{rating}</span>
                                <Star className="h-4 w-4" />
                              </div>
                              <div className="flex-1 h-2 bg-gray-200 rounded-full">
                                <div
                                  className="h-2 bg-yellow-400 rounded-full"
                                  style={{
                                    width: `${
                                      rating === 5
                                        ? "70"
                                        : rating === 4
                                          ? "20"
                                          : rating === 3
                                            ? "5"
                                            : rating === 2
                                              ? "3"
                                              : "2"
                                    }%`,
                                  }}
                                ></div>
                              </div>
                              <div className="w-8 text-right text-sm">
                                {rating === 5
                                  ? "70"
                                  : rating === 4
                                    ? "20"
                                    : rating === 3
                                      ? "5"
                                      : rating === 2
                                        ? "3"
                                        : "2"}
                                %
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-6 space-y-2">
                          <h4 className="font-medium">Common Feedback</h4>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary">Great quality (32)</Badge>
                            <Badge variant="secondary">Fast shipping (24)</Badge>
                            <Badge variant="secondary">As described (18)</Badge>
                            <Badge variant="secondary">Good value (15)</Badge>
                            <Badge variant="outline">Packaging issues (3)</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Recent Reviews</h4>
                        <Select defaultValue="newest">
                          <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Sort by" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="newest">Newest First</SelectItem>
                            <SelectItem value="highest">Highest Rated</SelectItem>
                            <SelectItem value="lowest">Lowest Rated</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-4">
                        {recentReviews.map((review, index) => (
                          <div key={index} className="p-4 border rounded-lg">
                            <div className="flex justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className="flex items-center">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-4 w-4 ${
                                        star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="font-medium">{review.title}</span>
                              </div>
                              <div className="text-sm text-muted-foreground">{review.date}</div>
                            </div>
                            <p className="text-sm mb-2">{review.comment}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{review.author}</span>
                              {review.verified && (
                                <Badge variant="outline" className="text-xs">
                                  Verified Purchase
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="optimization" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Optimization</CardTitle>
                    <CardDescription>AI-powered recommendations to improve performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="p-4 border rounded-lg bg-green-50">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-green-100 rounded-full">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-green-800">
                              Performance Score: {product.performanceScore}/100
                            </h4>
                            <p className="text-sm text-green-700 mt-1">
                              Your product is performing well overall. Here are some recommendations to further improve
                              its performance.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium">Optimization Recommendations</h4>
                        {optimizationRecommendations.map((rec, index) => (
                          <div key={index} className="p-4 border rounded-lg">
                            <div className="flex items-start gap-3">
                              <div
                                className={`p-2 rounded-full ${
                                  rec.priority === "high"
                                    ? "bg-red-100 text-red-600"
                                    : rec.priority === "medium"
                                      ? "bg-amber-100 text-amber-600"
                                      : "bg-blue-100 text-blue-600"
                                }`}
                              >
                                {rec.icon}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium">{rec.title}</h4>
                                  <Badge
                                    variant={
                                      rec.priority === "high"
                                        ? "destructive"
                                        : rec.priority === "medium"
                                          ? "secondary"
                                          : "outline"
                                    }
                                  >
                                    {rec.priority} priority
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                                <div className="mt-3">
                                  <Button variant="outline" size="sm" className="bg-transparent">
                                    Apply Recommendation
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-3">A/B Testing Opportunities</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Product Title Variations</span>
                            <Button variant="outline" size="sm" className="bg-transparent">
                              Start Test
                            </Button>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Price Point Testing</span>
                            <Button variant="outline" size="sm" className="bg-transparent">
                              Start Test
                            </Button>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Primary Image Variations</span>
                            <Button variant="outline" size="sm" className="bg-transparent">
                              Start Test
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DashboardLayout>
    </RoleGuard>
  )
}

// Helper function
function getPerformanceBadge(score: number) {
  if (score >= 80) return "default"
  if (score >= 60) return "secondary"
  return "destructive"
}

// Mock data
const mockProduct = {
  id: "1",
  name: "Gold Bullion - 1oz American Eagle",
  description: "99.9% pure gold bullion coin from certified mint",
  category: "Precious Metals",
  price: "1,950.00",
  unit: "per oz",
  stock: 25,
  sku: "GOLD-1OZ-AE-2024",
  rating: 4.8,
  verified: true,
  performanceScore: 92,
  trend: "up",
  change: "+23%",
  revenue: 45000,
  views: 2847,
  sales: 127,
  conversionRate: 4.5,
  image: "/placeholder.svg?height=80&width=80",
}

const salesTrendData = [
  { date: "Jan", sales: 10, revenue: 19500 },
  { date: "Feb", sales: 15, revenue: 29250 },
  { date: "Mar", sales: 12, revenue: 23400 },
  { date: "Apr", sales: 18, revenue: 35100 },
  { date: "May", sales: 22, revenue: 42900 },
  { date: "Jun", sales: 25, revenue: 48750 },
  { date: "Jul", sales: 35, revenue: 68250 },
]

const conversionFunnelData = [
  { name: "Page Views", value: 2847 },
  { name: "Product Views", value: 1423 },
  { name: "Add to Cart", value: 213 },
  { name: "Checkout", value: 156 },
  { name: "Purchase", value: 127 },
]

const trafficSourcesData = [
  { name: "Search", value: 45, color: "#3B82F6" },
  { name: "Direct", value: 25, color: "#10B981" },
  { name: "Referral", value: 15, color: "#F59E0B" },
  { name: "Social", value: 10, color: "#8B5CF6" },
  { name: "Other", value: 5, color: "#EC4899" },
]

const ageDistribution = [
  { age: "18-24", percentage: 15 },
  { age: "25-34", percentage: 35 },
  { age: "35-44", percentage: 25 },
  { age: "45-54", percentage: 15 },
  { age: "55+", percentage: 10 },
]

const topLocations = [
  { location: "United States", percentage: 65 },
  { location: "Canada", percentage: 12 },
  { location: "United Kingdom", percentage: 8 },
  { location: "Australia", percentage: 6 },
  { location: "Germany", percentage: 4 },
]

const competitorAnalysis = [
  { name: "Your Product", price: 1950, sales: 127, rating: 4.8 },
  { name: "Competitor A", price: 1920, sales: 145, rating: 4.6 },
  { name: "Competitor B", price: 1975, sales: 98, rating: 4.7 },
  { name: "Competitor C", price: 1899, sales: 112, rating: 4.3 },
]

const detailedSalesData = [
  { date: "Week 1", sales: 18 },
  { date: "Week 2", sales: 22 },
  { date: "Week 3", sales: 25 },
  { date: "Week 4", sales: 30 },
  { date: "Week 5", sales: 32 },
]

const trafficData = [
  { date: "Week 1", views: 350, uniqueVisitors: 280 },
  { date: "Week 2", views: 420, uniqueVisitors: 340 },
  { date: "Week 3", views: 510, uniqueVisitors: 410 },
  { date: "Week 4", views: 680, uniqueVisitors: 520 },
  { date: "Week 5", views: 890, uniqueVisitors: 680 },
]

const recentReviews = [
  {
    rating: 5,
    title: "Excellent investment",
    comment:
      "The gold coin arrived in perfect condition and exactly as described. Very pleased with the quality and the secure packaging.",
    author: "John D.",
    date: "Jul 20, 2024",
    verified: true,
  },
  {
    rating: 4,
    title: "Good product, slow shipping",
    comment:
      "The coin itself is beautiful and exactly what I wanted. Shipping took longer than expected, but it was worth the wait.",
    author: "Sarah M.",
    date: "Jul 15, 2024",
    verified: true,
  },
  {
    rating: 5,
    title: "Perfect addition to my collection",
    comment:
      "This is my third purchase from this seller and as always, the quality is outstanding. Will definitely buy again.",
    author: "Robert K.",
    date: "Jul 10, 2024",
    verified: true,
  },
]

const optimizationRecommendations = [
  {
    title: "Optimize Product Description",
    description:
      "Add more specific details about purity, weight, and certification to improve search visibility and conversion.",
    priority: "high",
    icon: <Search className="h-4 w-4" />,
  },
  {
    title: "Adjust Pricing Strategy",
    description:
      "Your price is 5% higher than market average. Consider testing a slight price reduction to increase conversion rate.",
    priority: "medium",
    icon: <Target className="h-4 w-4" />,
  },
  {
    title: "Add More Product Images",
    description: "Products with 5+ images have 35% higher conversion rates. Consider adding more detailed photos.",
    priority: "medium",
    icon: <Calendar className="h-4 w-4" />,
  },
]
