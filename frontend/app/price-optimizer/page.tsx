"use client"

import { useState } from "react"
import { TrendingUp, Target, Zap, BarChart3, Users, AlertTriangle, RefreshCw } from "lucide-react"

import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from "recharts"

export default function PriceOptimizerPage() {
  const { toast } = useToast()
  const [selectedProduct, setSelectedProduct] = useState("gold-1oz")
  const [optimizationGoal, setOptimizationGoal] = useState("revenue")
  const [priceRange, setPriceRange] = useState([1800, 2100])
  const [autoOptimization, setAutoOptimization] = useState(false)

  const handleApplyPricing = (productId: string, newPrice: number) => {
    toast({
      title: "Price Updated",
      description: `Product pricing has been updated to $${newPrice}. Changes will take effect immediately.`,
    })
  }

  const handleBulkOptimization = () => {
    toast({
      title: "Bulk Optimization Started",
      description: "AI is analyzing and optimizing prices for all selected products. This may take a few minutes.",
    })
  }

  return (
    <DashboardLayout userRole="seller">
      <div className="container mx-auto px-4 py-6 pb-20 lg:pb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">AI Price Optimizer</h1>
            <p className="text-muted-foreground">
              Maximize your profits with AI-powered dynamic pricing recommendations
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleBulkOptimization} className="bg-transparent">
              <Zap className="h-4 w-4 mr-2" />
              Bulk Optimize
            </Button>
            <Button variant="outline" className="bg-transparent">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Optimization Overview */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700">Revenue Impact</p>
                  <p className="text-2xl font-bold text-green-900">+$12,450</p>
                  <p className="text-xs text-green-600">From optimized pricing</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700">Products Optimized</p>
                  <p className="text-2xl font-bold text-blue-900">18/28</p>
                  <p className="text-xs text-blue-600">64% of inventory</p>
                </div>
                <Target className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-700">Avg Price Increase</p>
                  <p className="text-2xl font-bold text-purple-900">+8.5%</p>
                  <p className="text-xs text-purple-600">Without demand loss</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-amber-700">Opportunities</p>
                  <p className="text-2xl font-bold text-amber-900">7</p>
                  <p className="text-xs text-amber-600">Pricing improvements</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Selection and Analysis */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Price Analysis</CardTitle>
                    <CardDescription>Detailed pricing insights for selected product</CardDescription>
                  </div>
                  <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gold-1oz">Gold Bullion - 1oz</SelectItem>
                      <SelectItem value="silver-10oz">Silver Bars - 10oz</SelectItem>
                      <SelectItem value="platinum-1oz">Platinum Coin - 1oz</SelectItem>
                      <SelectItem value="gold-10oz">Gold Bar - 10oz</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Current vs Optimal Pricing */}
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium text-muted-foreground">Current Price</h4>
                      <p className="text-2xl font-bold">$1,920</p>
                      <p className="text-sm text-muted-foreground">per oz</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-700">AI Recommended</h4>
                      <p className="text-2xl font-bold text-green-900">$1,975</p>
                      <p className="text-sm text-green-600">+$55 (+2.9%)</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-700">Market Average</h4>
                      <p className="text-2xl font-bold text-blue-900">$1,950</p>
                      <p className="text-sm text-blue-600">Competitive range</p>
                    </div>
                  </div>

                  {/* Price Impact Chart */}
                  <div>
                    <h4 className="font-medium mb-4">Price vs Demand Analysis</h4>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart data={priceImpactData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="price" name="Price" />
                          <YAxis dataKey="demand" name="Demand" />
                          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                          <Scatter dataKey="revenue" fill="#10B981" />
                        </ScatterChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Optimization Controls */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Price Range</h4>
                      <span className="text-sm text-muted-foreground">
                        ${priceRange[0]} - ${priceRange[1]}
                      </span>
                    </div>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      min={1500}
                      max={2500}
                      step={25}
                      className="w-full"
                    />
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="goal">Optimization Goal</Label>
                        <Select value={optimizationGoal} onValueChange={setOptimizationGoal}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="revenue">Maximize Revenue</SelectItem>
                            <SelectItem value="profit">Maximize Profit</SelectItem>
                            <SelectItem value="volume">Maximize Volume</SelectItem>
                            <SelectItem value="market-share">Gain Market Share</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2 pt-6">
                        <Switch
                          id="auto-optimization"
                          checked={autoOptimization}
                          onCheckedChange={setAutoOptimization}
                        />
                        <Label htmlFor="auto-optimization">Auto-optimization</Label>
                      </div>
                    </div>
                  </div>

                  <Button onClick={() => handleApplyPricing(selectedProduct, 1975)} className="w-full">
                    Apply Recommended Pricing
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Pricing Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing Recommendations</CardTitle>
                <CardDescription>AI-powered suggestions for all your products</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pricingRecommendations.map((rec, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 overflow-hidden rounded-md">
                            <img
                              src={rec.image || "/placeholder.svg"}
                              alt={rec.product}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium">{rec.product}</h4>
                            <p className="text-sm text-muted-foreground">{rec.category}</p>
                          </div>
                        </div>
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

                      <div className="grid grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Current</p>
                          <p className="font-medium">${rec.currentPrice}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Suggested</p>
                          <p className="font-medium text-green-600">${rec.suggestedPrice}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Change</p>
                          <p className={`font-medium ${rec.change > 0 ? "text-green-600" : "text-red-600"}`}>
                            {rec.change > 0 ? "+" : ""}
                            {rec.change}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Impact</p>
                          <p className="font-medium">{rec.impact}</p>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">{rec.reason}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Demand: {rec.demandLevel}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Competition: {rec.competitionLevel}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="bg-transparent">
                            View Details
                          </Button>
                          <Button size="sm" onClick={() => handleApplyPricing(rec.id, rec.suggestedPrice)}>
                            Apply
                          </Button>
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
            {/* Market Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Market Insights</CardTitle>
                <CardDescription>Real-time market intelligence</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {marketInsights.map((insight, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <insight.icon className="h-4 w-4 text-blue-600" />
                        <h4 className="font-medium">{insight.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="outline">{insight.impact}</Badge>
                        <span className="text-xs text-muted-foreground">{insight.timeframe}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Optimization Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Optimization Settings</CardTitle>
                <CardDescription>Configure your pricing strategy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-adjust">Auto Price Adjustments</Label>
                    <Switch id="auto-adjust" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="competitor-tracking">Competitor Tracking</Label>
                    <Switch id="competitor-tracking" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="demand-based">Demand-Based Pricing</Label>
                    <Switch id="demand-based" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="seasonal-adjust">Seasonal Adjustments</Label>
                    <Switch id="seasonal-adjust" />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Price Change Limits</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Maximum increase per day</span>
                      <span>5%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Maximum decrease per day</span>
                      <span>3%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Optimization Performance</CardTitle>
                <CardDescription>Track your pricing success</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Revenue Increase</span>
                      <span className="font-medium text-green-600">+18.2%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: "82%" }}></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Profit Margin</span>
                      <span className="font-medium text-blue-600">+12.5%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: "75%" }}></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Conversion Rate</span>
                      <span className="font-medium text-purple-600">+8.7%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: "67%" }}></div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">This Month</h4>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-green-600">$12.4K</p>
                      <p className="text-xs text-muted-foreground">Extra Revenue</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-600">23</p>
                      <p className="text-xs text-muted-foreground">Price Changes</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common pricing tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Target className="h-4 w-4 mr-2" />
                  Set Profit Targets
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analyze Competitors
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Price History
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Set Price Alerts
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

// Mock data
const priceImpactData = [
  { price: 1800, demand: 95, revenue: 171000 },
  { price: 1850, demand: 88, revenue: 162800 },
  { price: 1900, demand: 82, revenue: 155800 },
  { price: 1950, demand: 75, revenue: 146250 },
  { price: 2000, demand: 68, revenue: 136000 },
  { price: 2050, demand: 60, revenue: 123000 },
  { price: 2100, demand: 52, revenue: 109200 },
]

const pricingRecommendations = [
  {
    id: "gold-1oz",
    product: "Gold Bullion - 1oz",
    category: "Precious Metals",
    currentPrice: 1920,
    suggestedPrice: 1975,
    change: 2.9,
    impact: "+$2,750/month",
    priority: "high",
    reason: "Market price increased 3% this week, competitors raised prices",
    demandLevel: "High",
    competitionLevel: "Medium",
    image: "/placeholder.svg?height=48&width=48",
  },
  {
    id: "silver-10oz",
    product: "Silver Bars - 10oz",
    category: "Precious Metals",
    currentPrice: 285,
    suggestedPrice: 275,
    change: -3.5,
    impact: "+15% volume",
    priority: "medium",
    reason: "High price sensitivity detected, small decrease will boost volume significantly",
    demandLevel: "Medium",
    competitionLevel: "High",
    image: "/placeholder.svg?height=48&width=48",
  },
  {
    id: "platinum-1oz",
    product: "Platinum Coin - 1oz",
    category: "Precious Metals",
    currentPrice: 980,
    suggestedPrice: 1020,
    change: 4.1,
    impact: "+$1,200/month",
    priority: "high",
    reason: "Limited supply in market, premium pricing opportunity",
    demandLevel: "Low",
    competitionLevel: "Low",
    image: "/placeholder.svg?height=48&width=48",
  },
  {
    id: "gold-10oz",
    product: "Gold Bar - 10oz",
    category: "Precious Metals",
    currentPrice: 19500,
    suggestedPrice: 19200,
    change: -1.5,
    impact: "+8% conversion",
    priority: "low",
    reason: "Slight price reduction could improve conversion rate",
    demandLevel: "Medium",
    competitionLevel: "Medium",
    image: "/placeholder.svg?height=48&width=48",
  },
]

const marketInsights = [
  {
    title: "Gold Demand Surge",
    description: "Institutional buying increased 25% this week",
    impact: "High Impact",
    timeframe: "This week",
    icon: TrendingUp,
  },
  {
    title: "Silver Supply Shortage",
    description: "Industrial demand outpacing supply",
    impact: "Medium Impact",
    timeframe: "Next month",
    icon: AlertTriangle,
  },
  {
    title: "Economic Uncertainty",
    description: "Safe-haven assets seeing increased interest",
    impact: "High Impact",
    timeframe: "Ongoing",
    icon: BarChart3,
  },
]
