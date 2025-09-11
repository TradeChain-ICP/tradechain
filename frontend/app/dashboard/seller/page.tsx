// app/dashboard/seller/page.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  DollarSign,
  Package,
  Plus,
  ShoppingCart,
  TrendingUp,
  Users,
  Eye,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useContentPadding } from '@/contexts/sidebar-context';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export default function SellerDashboardPage() {
  const { contentPadding } = useContentPadding();

  return (
    <div className={`flex flex-col gap-4 py-4 md:gap-8 md:py-8 pb-20 lg:pb-8 ${contentPadding}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Seller Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, Premium Metals Co.! Here's your business overview.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/seller/add-product">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">5 pending fulfillment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products Listed</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">3 out of stock</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2%</div>
            <p className="text-xs text-muted-foreground">+0.5% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue and Orders Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Your sales performance over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={revenueData}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
            <CardDescription>Sales by product category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryData}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders and Top Products */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-1">
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest orders requiring your attention</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm" className="ml-auto gap-1">
              <Link href="/dashboard/seller/orders">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center gap-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-md">
                    <Image
                      src={order.image || '/placeholder.svg'}
                      alt={order.product}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="grid gap-1">
                    <div className="font-medium">{order.product}</div>
                    <div className="text-sm text-muted-foreground">
                      Order #{order.id} • {order.date}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getOrderBadgeVariant(order.status)}>{order.status}</Badge>
                      <span className="text-sm font-medium">{order.amount}</span>
                    </div>
                  </div>
                  <div className="ml-auto flex gap-2">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/dashboard/seller/orders/${order.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    {order.status === 'Pending' && <Button size="sm">Process</Button>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Top Performing Products</CardTitle>
            <CardDescription>Your best-selling items this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium">
                    {index + 1}
                  </div>
                  <div className="relative h-12 w-12 overflow-hidden rounded-md">
                    <Image
                      src={product.image || '/placeholder.svg'}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="grid gap-1 flex-1">
                    <div className="font-medium text-sm">{product.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {product.sales} sold • ${product.revenue}
                    </div>
                  </div>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/dashboard/seller/products/${product.id}`}>
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/dashboard/seller/performance">View All Products</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* AI Insights and Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>AI Business Insights</CardTitle>
            <CardDescription>Personalized recommendations to grow your business</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aiInsights.map((insight, index) => (
                <div
                  key={index}
                  className={`rounded-lg border p-4 ${getInsightColor(insight.type)}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`rounded-full p-2 ${getInsightIconColor(insight.type)}`}>
                      {getInsightIcon(insight.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{insight.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                      {insight.action && (
                        <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                          {insight.action}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/dashboard/seller/ai-insights">View All Insights</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/seller/add-product">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Plus className="h-4 w-4 mr-2" />
                Add New Product
              </Button>
            </Link>
            <Link href="/dashboard/seller/inventory">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Package className="h-4 w-4 mr-2" />
                Manage Inventory
              </Button>
            </Link>
            <Link href="/dashboard/seller/orders">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Process Orders
              </Button>
            </Link>
            <Link href="/dashboard/seller/analytics">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
            </Link>
            <Link href="/dashboard/seller/earnings">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <DollarSign className="h-4 w-4 mr-2" />
                Earnings Report
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader className="flex flex-row items-center">
          <div className="grid gap-1">
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Key performance indicators for your business</CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm" className="ml-auto gap-1">
            <Link href="/dashboard/seller/analytics">
              View Details <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {performanceMetrics.map((metric) => (
              <div key={metric.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{metric.label}</span>
                  <span className="text-sm text-muted-foreground">{metric.value}%</span>
                </div>
                <Progress value={metric.value} className="h-2" />
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {metric.change > 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingUp className="h-3 w-3 text-red-600 rotate-180" />
                  )}
                  <span className={metric.change > 0 ? 'text-green-600' : 'text-red-600'}>
                    {metric.change > 0 ? '+' : ''}
                    {metric.change}% vs last month
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper functions
function getOrderBadgeVariant(status: string) {
  switch (status) {
    case 'Pending':
      return 'secondary';
    case 'Processing':
      return 'outline';
    case 'Shipped':
      return 'default';
    default:
      return 'outline';
  }
}

function getInsightColor(type: string) {
  switch (type) {
    case 'opportunity':
      return 'border-green-200 bg-green-50';
    case 'warning':
      return 'border-amber-200 bg-amber-50';
    case 'info':
      return 'border-blue-200 bg-blue-50';
    default:
      return 'border-gray-200 bg-gray-50';
  }
}

function getInsightIconColor(type: string) {
  switch (type) {
    case 'opportunity':
      return 'bg-green-100 text-green-600';
    case 'warning':
      return 'bg-amber-100 text-amber-600';
    case 'info':
      return 'bg-blue-100 text-blue-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
}

function getInsightIcon(type: string) {
  switch (type) {
    case 'opportunity':
      return <TrendingUp className="h-4 w-4" />;
    case 'warning':
      return <BarChart3 className="h-4 w-4" />;
    case 'info':
      return <Users className="h-4 w-4" />;
    default:
      return <BarChart3 className="h-4 w-4" />;
  }
}

// Mock data
const revenueData = [
  { month: 'Jan', revenue: 12000 },
  { month: 'Feb', revenue: 15000 },
  { month: 'Mar', revenue: 18000 },
  { month: 'Apr', revenue: 22000 },
  { month: 'May', revenue: 28000 },
  { month: 'Jun', revenue: 35000 },
];

const categoryData = [
  { category: 'Gold', sales: 25000 },
  { category: 'Silver', sales: 18000 },
  { category: 'Platinum', sales: 12000 },
  { category: 'Palladium', sales: 8000 },
];

const recentOrders = [
  {
    id: 'ORD-7292',
    product: 'Gold Bullion - 1oz American Eagle',
    date: '2 hours ago',
    status: 'Pending',
    amount: '$3,900.00',
    image: '/placeholder.svg?height=64&width=64',
  },
  {
    id: 'ORD-7291',
    product: 'Silver Bars - 10oz',
    date: '4 hours ago',
    status: 'Processing',
    amount: '$280.00',
    image: '/placeholder.svg?height=64&width=64',
  },
  {
    id: 'ORD-7290',
    product: 'Platinum Coin - 1oz',
    date: '1 day ago',
    status: 'Shipped',
    amount: '$980.00',
    image: '/placeholder.svg?height=64&width=64',
  },
];

const topProducts = [
  {
    id: '1',
    name: 'Gold Bullion - 1oz',
    sales: 45,
    revenue: '87,750',
    image: '/placeholder.svg?height=48&width=48',
  },
  {
    id: '2',
    name: 'Silver Bars - 10oz',
    sales: 32,
    revenue: '8,960',
    image: '/placeholder.svg?height=48&width=48',
  },
  {
    id: '3',
    name: 'Platinum Coin - 1oz',
    sales: 18,
    revenue: '17,640',
    image: '/placeholder.svg?height=48&width=48',
  },
  {
    id: '4',
    name: 'Gold Bar - 10oz',
    sales: 12,
    revenue: '234,000',
    image: '/placeholder.svg?height=48&width=48',
  },
];

const aiInsights = [
  {
    type: 'opportunity',
    title: 'Price Optimization Opportunity',
    description:
      'Your gold products are priced 5% below market average. Consider increasing prices to maximize revenue.',
    action: 'Optimize Pricing',
  },
  {
    type: 'warning',
    title: 'Low Stock Alert',
    description:
      '3 of your top-selling products are running low on inventory. Restock soon to avoid missed sales.',
    action: 'Manage Inventory',
  },
  {
    type: 'info',
    title: 'Market Trend',
    description:
      'Silver demand is increasing by 15% this month. Consider expanding your silver product line.',
    action: 'View Trends',
  },
];

const performanceMetrics = [
  {
    label: 'Order Fulfillment Rate',
    value: 98,
    change: 2,
  },
  {
    label: 'Customer Satisfaction',
    value: 96,
    change: 1,
  },
  {
    label: 'Response Time',
    value: 92,
    change: -3,
  },
  {
    label: 'Product Quality Score',
    value: 94,
    change: 4,
  },
];
