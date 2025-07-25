"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
} from "recharts"
import { TrendingUp, DollarSign, BarChart3, Target, AlertTriangle, Plus, Eye, ArrowUpRight } from "lucide-react"

export default function PortfolioPage() {
  const [timeRange, setTimeRange] = useState("30d")

  return (
    <DashboardLayout userRole="buyer">
      <div className="flex flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Portfolio</h1>
            <p className="text-muted-foreground">Track your commodity investments and performance</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
                <SelectItem value="90d">90 Days</SelectItem>
                <SelectItem value="1y">1 Year</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Investment
            </Button>
          </div>
        </div>

        {/* Portfolio Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,650.00</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="mr-1 h-3 w-3" />
                +12.5% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$38,200.00</div>
              <div className="flex items-center text-xs text-muted-foreground">Across 8 commodities</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Gain/Loss</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">+$7,450.00</div>
              <div className="flex items-center text-xs text-green-600">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                +19.5% return
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Medium</div>
              <div className="flex items-center text-xs text-yellow-600">Diversification: Good</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="holdings">Holdings</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              {/* Portfolio Performance Chart */}
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>Portfolio Performance</CardTitle>
                  <CardDescription>Your portfolio value over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={portfolioPerformanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="value" stroke="#10B981" fill="#10B981" fillOpacity={0.2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Asset Allocation */}
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Asset Allocation</CardTitle>
                  <CardDescription>Distribution of your investments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={allocationData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {allocationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Performers */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>Your best performing investments this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPerformers.map((performer) => (
                    <div key={performer.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                          {performer.symbol}
                        </div>
                        <div>
                          <div className="font-medium">{performer.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {performer.amount} • ${performer.value}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-medium ${performer.change > 0 ? "text-green-600" : "text-red-600"}`}>
                          {performer.change > 0 ? "+" : ""}
                          {performer.change}%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {performer.change > 0 ? "+" : ""}${performer.changeValue}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="holdings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Current Holdings</CardTitle>
                <CardDescription>Detailed view of all your commodity investments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {holdings.map((holding) => (
                    <div key={holding.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                          {holding.symbol}
                        </div>
                        <div>
                          <div className="font-medium">{holding.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {holding.amount} • Avg. ${holding.avgPrice}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${holding.currentValue}</div>
                        <div className={`text-sm ${holding.change > 0 ? "text-green-600" : "text-red-600"}`}>
                          {holding.change > 0 ? "+" : ""}
                          {holding.change}% (${holding.changeValue})
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Detailed performance analysis of your portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Sharpe Ratio</div>
                    <div className="text-2xl font-bold">1.24</div>
                    <div className="text-xs text-muted-foreground">Risk-adjusted return</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Max Drawdown</div>
                    <div className="text-2xl font-bold text-red-600">-8.5%</div>
                    <div className="text-xs text-muted-foreground">Largest peak-to-trough decline</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Volatility</div>
                    <div className="text-2xl font-bold">15.2%</div>
                    <div className="text-xs text-muted-foreground">Standard deviation</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Returns</CardTitle>
                <CardDescription>Your portfolio returns over the past 12 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyReturns}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="return" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Risk Analysis</CardTitle>
                  <CardDescription>Portfolio risk breakdown by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {riskAnalysis.map((risk) => (
                      <div key={risk.category} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{risk.category}</span>
                          <span>{risk.percentage}%</span>
                        </div>
                        <Progress value={risk.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Diversification Score</CardTitle>
                  <CardDescription>How well diversified is your portfolio</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <div className="text-4xl font-bold text-green-600">8.2/10</div>
                    <div className="text-sm text-muted-foreground">
                      Your portfolio is well diversified across multiple commodity sectors
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Good Diversification
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

// Sample data
const portfolioPerformanceData = [
  { date: "Jan", value: 35000 },
  { date: "Feb", value: 37500 },
  { date: "Mar", value: 36800 },
  { date: "Apr", value: 39200 },
  { date: "May", value: 41500 },
  { date: "Jun", value: 43200 },
  { date: "Jul", value: 45650 },
]

const allocationData = [
  { name: "Precious Metals", value: 35, color: "#FFD700" },
  { name: "Energy", value: 25, color: "#4F4F4F" },
  { name: "Agriculture", value: 20, color: "#8BC34A" },
  { name: "Industrial Metals", value: 15, color: "#FF6B6B" },
  { name: "Livestock", value: 5, color: "#4ECDC4" },
]

const topPerformers = [
  {
    name: "Gold Bullion",
    symbol: "AU",
    amount: "3.5 oz",
    value: "6,825.00",
    change: 15.2,
    changeValue: "900.50",
  },
  {
    name: "Silver Bars",
    symbol: "AG",
    amount: "25 oz",
    value: "700.00",
    change: 12.8,
    changeValue: "79.68",
  },
  {
    name: "Crude Oil",
    symbol: "OIL",
    amount: "10 barrels",
    value: "750.00",
    change: 8.5,
    changeValue: "58.75",
  },
]

const holdings = [
  {
    id: 1,
    name: "Gold Bullion",
    symbol: "AU",
    amount: "3.5 oz",
    avgPrice: "1,950.00",
    currentValue: "6,825.00",
    change: 15.2,
    changeValue: "900.50",
  },
  {
    id: 2,
    name: "Silver Bars",
    symbol: "AG",
    amount: "25 oz",
    avgPrice: "28.00",
    currentValue: "700.00",
    change: 12.8,
    changeValue: "79.68",
  },
  {
    id: 3,
    name: "Crude Oil Futures",
    symbol: "OIL",
    amount: "10 barrels",
    avgPrice: "75.00",
    currentValue: "750.00",
    change: 8.5,
    changeValue: "58.75",
  },
  {
    id: 4,
    name: "Wheat Futures",
    symbol: "WHT",
    amount: "100 bushels",
    avgPrice: "6.50",
    currentValue: "650.00",
    change: -2.3,
    changeValue: "-15.30",
  },
]

const monthlyReturns = [
  { month: "Jan", return: 5.2 },
  { month: "Feb", return: 7.1 },
  { month: "Mar", return: -1.8 },
  { month: "Apr", return: 6.5 },
  { month: "May", return: 5.9 },
  { month: "Jun", return: 4.1 },
  { month: "Jul", return: 5.7 },
  { month: "Aug", return: 3.2 },
  { month: "Sep", return: -0.5 },
  { month: "Oct", return: 8.3 },
  { month: "Nov", return: 6.7 },
  { month: "Dec", return: 4.9 },
]

const riskAnalysis = [
  { category: "Market Risk", percentage: 65 },
  { category: "Credit Risk", percentage: 15 },
  { category: "Liquidity Risk", percentage: 10 },
  { category: "Operational Risk", percentage: 10 },
]
