// app/dashboard/seller/analytics/page.tsx
"use client"

import { useState } from "react"
import { BarChart3, TrendingUp, TrendingDown, Users, DollarSign, Eye, ShoppingCart, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
} from "recharts"
import { useContentPadding } from "@/contexts/sidebar-context"

export default function AnalyticsPage() {
  const { contentPadding } = useContentPadding();
  const [timeframe, setTimeframe] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  return (
    <div className={`py-6 pb-20 lg:pb-8 ${contentPadding}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into your business performance
          </p>
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
          <Button variant="outline" className="bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">$127,450</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">+18.2%</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">342</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">+12.5%</span>
                </div>
              </div>
              <ShoppingCart className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Order Value</p>
                <p className="text-2xl font-bold">$373</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">+5.1%</span>
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
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">3.8%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-600">-0.3%</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers" className="hidden lg:flex">
            Customers
          </TabsTrigger>
          <TabsTrigger value="traffic" className="hidden lg:flex">
            Traffic
          </TabsTrigger>
          <TabsTrigger value="financial" className="hidden lg:flex">
            Financial
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription>Track your sales performance over time</CardDescription>
                </div>
                <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="revenue">Revenue</SelectItem>
                    <SelectItem value="orders">Orders</SelectItem>
                    <SelectItem value="customers">Customers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="revenue"
                      fill="#10B981"
                      fillOpacity={0.3}
                      stroke="#10B981"
                    />
                    <Bar yAxisId="right" dataKey="orders" fill="#3B82F6" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Top Products */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Products</CardTitle>
                <CardDescription>Your best-selling items this period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{product.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {product.sales} sales • ${product.revenue}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {product.trend === 'up' ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                        <span className="text-sm">{product.change}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Sales by Category */}
            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
                <CardDescription>Revenue distribution across product categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {categoryData.map((category, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span className="text-sm truncate">{category.name}</span>
                      <span className="text-sm text-muted-foreground ml-auto">
                        {category.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Product Performance</CardTitle>
                <CardDescription>Detailed analytics for each product</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {productPerformance.map((product, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium truncate">{product.name}</h4>
                        <Badge variant="outline">{product.category}</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Views</p>
                          <p className="font-medium">{product.views}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Sales</p>
                          <p className="font-medium">{product.sales}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Conversion</p>
                          <p className="font-medium">{product.conversion}%</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Performance Score</span>
                          <span>{product.score}/100</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${product.score}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inventory Status</CardTitle>
                <CardDescription>Stock levels and reorder recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inventoryStatus.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium truncate">{item.product}</h4>
                        <p className="text-sm text-muted-foreground">
                          Current stock: {item.stock} units
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <Badge
                          variant={
                            item.status === 'Low Stock'
                              ? 'destructive'
                              : item.status === 'In Stock'
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {item.status}
                        </Badge>
                        {item.reorderPoint && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Reorder at {item.reorderPoint}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Customer Demographics</CardTitle>
                <CardDescription>Understanding your customer base</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Geographic Distribution</h4>
                    <div className="space-y-2">
                      {customerGeography.map((geo, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm">{geo.location}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${geo.percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-muted-foreground w-10">
                              {geo.percentage}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Customer Segments</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {customerSegments.map((segment, index) => (
                        <div key={index} className="p-3 bg-muted rounded-lg">
                          <h5 className="font-medium">{segment.name}</h5>
                          <p className="text-2xl font-bold">{segment.count}</p>
                          <p className="text-sm text-muted-foreground">
                            {segment.percentage}% of customers
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Lifetime Value</CardTitle>
                <CardDescription>CLV trends and cohort analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={clvData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="clv" stroke="#10B981" strokeWidth={2} />
                      <Line
                        type="monotone"
                        dataKey="newCustomers"
                        stroke="#3B82F6"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <h5 className="font-medium text-green-900 text-sm">Avg CLV</h5>
                    <p className="text-xl font-bold text-green-900">$2,847</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <h5 className="font-medium text-blue-900 text-sm">Retention Rate</h5>
                    <p className="text-xl font-bold text-blue-900">73%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>Where your visitors are coming from</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trafficSources.map((source, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: source.color }}
                        ></div>
                        <span className="font-medium">{source.source}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{source.visitors}</p>
                        <p className="text-sm text-muted-foreground">{source.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Page Views</CardTitle>
                <CardDescription>Most visited pages in your store</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pageViews.map((page, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{page.page}</p>
                        <p className="text-sm text-muted-foreground truncate">{page.path}</p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-medium">{page.views}</p>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{page.uniqueViews}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Traffic Trends</CardTitle>
              <CardDescription>Visitor patterns over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trafficTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="visitors"
                      stroke="#10B981"
                      fill="#10B981"
                      fillOpacity={0.3}
                    />
                    <Area
                      type="monotone"
                      dataKey="pageViews"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>Detailed financial analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueBreakdown.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium">{item.category}</h4>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="font-bold">${item.amount.toLocaleString()}</p>
                        <div className="flex items-center gap-1">
                          {item.change > 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                          <span
                            className={`text-sm ${
                              item.change > 0 ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {item.change > 0 ? '+' : ''}
                            {item.change}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Profit Margins</CardTitle>
                <CardDescription>Profitability analysis by product category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={profitMargins}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="margin" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Financial Forecast</CardTitle>
              <CardDescription>Projected revenue and expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={financialForecast}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      fill="#10B981"
                      fillOpacity={0.3}
                      stroke="#10B981"
                    />
                    <Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2} />
                    <Line type="monotone" dataKey="profit" stroke="#3B82F6" strokeWidth={2} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Mock data
const revenueData = [
  { date: 'Jan 1', revenue: 12000, orders: 45 },
  { date: 'Jan 8', revenue: 15000, orders: 52 },
  { date: 'Jan 15', revenue: 18000, orders: 48 },
  { date: 'Jan 22', revenue: 22000, orders: 61 },
  { date: 'Jan 29', revenue: 25000, orders: 67 },
  { date: 'Feb 5', revenue: 28000, orders: 73 },
  { date: 'Feb 12', revenue: 32000, orders: 78 },
];

const topProducts = [
  { name: 'Gold Bullion - 1oz', sales: 127, revenue: '247,650', trend: 'up', change: '+23%' },
  { name: 'Silver Bars - 10oz', sales: 89, revenue: '24,920', trend: 'up', change: '+18%' },
  { name: 'Platinum Coin - 1oz', sales: 45, revenue: '44,100', trend: 'down', change: '-8%' },
  { name: 'Gold Bar - 10oz', sales: 23, revenue: '449,400', trend: 'up', change: '+12%' },
];

const categoryData = [
  { name: 'Precious Metals', value: 85000, percentage: 67, color: '#FFD700' },
  { name: 'Oil & Gas', value: 25000, percentage: 20, color: '#4F4F4F' },
  { name: 'Agriculture', value: 12000, percentage: 9, color: '#8BC34A' },
  { name: 'Timber', value: 5450, percentage: 4, color: '#795548' },
];

const productPerformance = [
  {
    name: 'Gold Bullion - 1oz',
    category: 'Precious Metals',
    views: 2847,
    sales: 127,
    conversion: 4.5,
    score: 92,
  },
  {
    name: 'Silver Bars - 10oz',
    category: 'Precious Metals',
    views: 1923,
    sales: 89,
    conversion: 4.6,
    score: 88,
  },
  {
    name: 'Platinum Coin - 1oz',
    category: 'Precious Metals',
    views: 1456,
    sales: 45,
    conversion: 3.1,
    score: 75,
  },
  {
    name: 'Crude Oil Futures',
    category: 'Oil & Gas',
    views: 987,
    sales: 34,
    conversion: 3.4,
    score: 78,
  },
];

const inventoryStatus = [
  { product: 'Gold Bullion - 1oz', stock: 8, status: 'Low Stock', reorderPoint: '10 units' },
  { product: 'Silver Bars - 10oz', stock: 25, status: 'In Stock', reorderPoint: null },
  { product: 'Platinum Coin - 1oz', stock: 0, status: 'Out of Stock', reorderPoint: '5 units' },
  { product: 'Gold Bar - 10oz', stock: 15, status: 'In Stock', reorderPoint: null },
];

const customerGeography = [
  { location: 'United States', percentage: 45 },
  { location: 'Canada', percentage: 22 },
  { location: 'United Kingdom', percentage: 15 },
  { location: 'Germany', percentage: 10 },
  { location: 'Other', percentage: 8 },
];

const customerSegments = [
  { name: 'New Customers', count: 156, percentage: 35 },
  { name: 'Returning', count: 234, percentage: 52 },
  { name: 'VIP', count: 58, percentage: 13 },
];

const clvData = [
  { month: 'Jan', clv: 2400, newCustomers: 45 },
  { month: 'Feb', clv: 2520, newCustomers: 52 },
  { month: 'Mar', clv: 2680, newCustomers: 48 },
  { month: 'Apr', clv: 2750, newCustomers: 61 },
  { month: 'May', clv: 2820, newCustomers: 67 },
  { month: 'Jun', clv: 2847, newCustomers: 73 },
];

const trafficSources = [
  { source: 'Direct', visitors: 3247, percentage: 42, color: '#10B981' },
  { source: 'Search Engines', visitors: 2156, percentage: 28, color: '#3B82F6' },
  { source: 'Social Media', visitors: 1234, percentage: 16, color: '#8B5CF6' },
  { source: 'Referrals', visitors: 876, percentage: 11, color: '#F59E0B' },
  { source: 'Email', visitors: 234, percentage: 3, color: '#EF4444' },
];

const pageViews = [
  { page: 'Product Listings', path: '/marketplace', views: 12847, uniqueViews: 8234 },
  { page: 'Gold Bullion Detail', path: '/product/gold-1oz', views: 5623, uniqueViews: 4156 },
  { page: 'Silver Products', path: '/category/silver', views: 3456, uniqueViews: 2789 },
  { page: 'Checkout', path: '/checkout', views: 2134, uniqueViews: 1987 },
  { page: 'About Us', path: '/about', views: 1876, uniqueViews: 1654 },
];

const trafficTrends = [
  { date: 'Jan 1', visitors: 1200, pageViews: 3400 },
  { date: 'Jan 8', visitors: 1350, pageViews: 3800 },
  { date: 'Jan 15', visitors: 1450, pageViews: 4100 },
  { date: 'Jan 22', visitors: 1600, pageViews: 4500 },
  { date: 'Jan 29', visitors: 1750, pageViews: 4900 },
  { date: 'Feb 5', visitors: 1900, pageViews: 5300 },
  { date: 'Feb 12', visitors: 2100, pageViews: 5800 },
];

const revenueBreakdown = [
  {
    category: 'Product Sales',
    description: 'Direct product revenue',
    amount: 127450,
    change: 18.2,
  },
  { category: 'Shipping Fees', description: 'Shipping and handling', amount: 8950, change: 12.5 },
  {
    category: 'Premium Listings',
    description: 'Featured product fees',
    amount: 2340,
    change: -5.2,
  },
  { category: 'Other Income', description: 'Miscellaneous revenue', amount: 1250, change: 8.7 },
];

const profitMargins = [
  { category: 'Precious Metals', margin: 28 },
  { category: 'Oil & Gas', margin: 15 },
  { category: 'Agriculture', margin: 22 },
  { category: 'Timber', margin: 18 },
];

const financialForecast = [
  { month: 'Aug', revenue: 135000, expenses: 95000, profit: 40000 },
  { month: 'Sep', revenue: 142000, expenses: 98000, profit: 44000 },
  { month: 'Oct', revenue: 148000, expenses: 102000, profit: 46000 },
  { month: 'Nov', revenue: 155000, expenses: 105000, profit: 50000 },
  { month: 'Dec', revenue: 168000, expenses: 110000, profit: 58000 },
];