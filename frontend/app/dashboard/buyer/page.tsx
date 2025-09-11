// app/dashboard/buyer/page.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  ChevronUp,
  Clock,
  DollarSign,
  ShoppingCart,
  TrendingUp,
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

export default function BuyerDashboardPage() {
  const { contentPadding } = useContentPadding();

  return (
    <div className={`flex flex-col gap-4 py-4 md:gap-8 md:py-8 pb-20 lg:pb-8 ${contentPadding}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, Alex! Here's an overview of your trading activity.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Clock className="mr-2 h-4 w-4" />
            Last 30 Days
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,580</div>
            <p className="text-xs text-muted-foreground">+18% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">2 in transit, 1 processing</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,650</div>
            <p className="text-xs text-muted-foreground">+24% from purchase price</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,245 ICP</div>
            <p className="text-xs text-muted-foreground">≈ $8,715 USD</p>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio and Market Trends */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Portfolio Performance</CardTitle>
            <CardDescription>Value of your commodity holdings over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={portfolioData}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="gold"
                    stackId="1"
                    stroke="#FFD700"
                    fill="#FFD700"
                    fillOpacity={0.5}
                  />
                  <Area
                    type="monotone"
                    dataKey="silver"
                    stackId="1"
                    stroke="#C0C0C0"
                    fill="#C0C0C0"
                    fillOpacity={0.5}
                  />
                  <Area
                    type="monotone"
                    dataKey="oil"
                    stackId="1"
                    stroke="#4F4F4F"
                    fill="#4F4F4F"
                    fillOpacity={0.5}
                  />
                  <Area
                    type="monotone"
                    dataKey="agriculture"
                    stackId="1"
                    stroke="#8BC34A"
                    fill="#8BC34A"
                    fillOpacity={0.5}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Market Trends</CardTitle>
            <CardDescription>Price changes in the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={marketTrendsData}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="change" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders and Recommendations */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-1">
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Your latest commodity purchases</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm" className="ml-auto gap-1">
              <Link href="/dashboard/buyer/orders">
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
                      <Badge variant={getBadgeVariant(order.status)}>{order.status}</Badge>
                      <span className="text-sm font-medium">{order.price}</span>
                    </div>
                  </div>
                  <div className="ml-auto">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/dashboard/buyer/orders/${order.id}`}>Details</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>AI Recommendations</CardTitle>
            <CardDescription>Personalized trading opportunities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.map((recommendation, index) => (
                <div key={index} className="rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`rounded-full p-1 ${getRecommendationColor(recommendation.type)}`}
                    >
                      {recommendation.type === 'buy' ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <TrendingUp className="h-4 w-4" />
                      )}
                    </div>
                    <div className="font-medium">{recommendation.title}</div>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{recommendation.description}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm font-medium">{recommendation.price}</span>
                    <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                      View <ArrowUpRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/dashboard/buyer/ai-insights">View All Insights</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Commodity Portfolio */}
      <Card>
        <CardHeader className="flex flex-row items-center">
          <div className="grid gap-1">
            <CardTitle>Your Commodity Portfolio</CardTitle>
            <CardDescription>Current holdings and allocation</CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm" className="ml-auto gap-1">
            <Link href="/dashboard/buyer/portfolio">
              Manage Portfolio <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {portfolio.map((item) => (
              <div key={item.commodity} className="grid gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="font-medium">{item.commodity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{item.amount}</span>
                    <span className="text-sm text-muted-foreground">{item.percentage}%</span>
                  </div>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper function to get badge variant based on order status
function getBadgeVariant(status: string) {
  switch (status) {
    case 'Delivered':
      return 'default';
    case 'In Transit':
      return 'secondary';
    case 'Processing':
      return 'outline';
    default:
      return 'default';
  }
}

// Helper function to get recommendation color
function getRecommendationColor(type: string) {
  switch (type) {
    case 'buy':
      return 'bg-green-100 text-green-600';
    case 'watch':
      return 'bg-blue-100 text-blue-600';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

// Sample data
const portfolioData = [
  { date: 'Jan', gold: 4000, silver: 2400, oil: 1200, agriculture: 800 },
  { date: 'Feb', gold: 3000, silver: 1398, oil: 1500, agriculture: 1000 },
  { date: 'Mar', gold: 2000, silver: 9800, oil: 1800, agriculture: 1200 },
  { date: 'Apr', gold: 2780, silver: 3908, oil: 2000, agriculture: 1500 },
  { date: 'May', gold: 1890, silver: 4800, oil: 2200, agriculture: 1700 },
  { date: 'Jun', gold: 2390, silver: 3800, oil: 2500, agriculture: 2000 },
  { date: 'Jul', gold: 3490, silver: 4300, oil: 2800, agriculture: 2200 },
];

const marketTrendsData = [
  { name: 'Gold', change: 12 },
  { name: 'Silver', change: 8 },
  { name: 'Crude Oil', change: -5 },
  { name: 'Wheat', change: 15 },
  { name: 'Coffee', change: 7 },
  { name: 'Timber', change: -3 },
];

const recentOrders = [
  {
    id: 'ORD-7291',
    product: 'Gold Bullion - 1oz',
    date: 'Jul 21, 2023',
    status: 'Delivered',
    price: '$1,950.00',
    image: '/placeholder.svg?height=64&width=64',
  },
  {
    id: 'ORD-7290',
    product: 'Silver Bars - 10oz',
    date: 'Jul 15, 2023',
    status: 'In Transit',
    price: '$280.00',
    image: '/placeholder.svg?height=64&width=64',
  },
  {
    id: 'ORD-7289',
    product: 'Crude Oil Futures - 10 barrels',
    date: 'Jul 10, 2023',
    status: 'Processing',
    price: '$750.00',
    image: '/placeholder.svg?height=64&width=64',
  },
];

const recommendations = [
  {
    type: 'buy',
    title: 'Gold is trending up',
    description: 'Gold prices are expected to rise 5% in the next month due to increasing demand.',
    price: 'Current: $1,950/oz',
  },
  {
    type: 'watch',
    title: 'Coffee market volatility',
    description:
      'Coffee prices showing unusual patterns. Consider diversifying your agricultural holdings.',
    price: 'Current: $180/lb',
  },
  {
    type: 'buy',
    title: 'Silver undervalued',
    description:
      'Silver is currently trading below market value. Good opportunity to increase position.',
    price: 'Current: $28/oz',
  },
];

const portfolio = [
  {
    commodity: 'Gold',
    amount: '3.5 oz',
    percentage: 45,
    color: '#FFD700',
  },
  {
    commodity: 'Silver',
    amount: '25 oz',
    percentage: 20,
    color: '#C0C0C0',
  },
  {
    commodity: 'Crude Oil',
    amount: '10 barrels',
    percentage: 15,
    color: '#4F4F4F',
  },
  {
    commodity: 'Agricultural Products',
    amount: 'Various',
    percentage: 12,
    color: '#8BC34A',
  },
  {
    commodity: 'Timber',
    amount: '500 board ft',
    percentage: 8,
    color: '#795548',
  },
];
