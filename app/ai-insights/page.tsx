"use client"

import { useState } from "react"
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  Target,
  BarChart3,
  Users,
  Clock,
  Zap,
  Brain,
} from "lucide-react"

import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
} from "recharts"

export default function AIInsightsPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("7d")

  return (
    <DashboardLayout userRole="seller">
      <div className="container mx-auto px-4 py-6 pb-20 lg:pb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">AI Insights Hub</h1>
            <p className="text-muted-foreground">
              AI-powered recommendations and market intelligence for your business
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="bg-transparent">
              <Brain className="h-4 w-4 mr-2" />
              AI Settings
            </Button>
          </div>
        </div>

        {/* AI Overview Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700">AI Confidence</p>
                  <p className="text-2xl font-bold text-blue-900">94%</p>
                </div>
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-xs text-blue-600 mt-1">High accuracy predictions</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700">Revenue Impact</p>
                  <p className="text-2xl font-bold text-green-900">+18%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-xs text-green-600 mt-1">From AI recommendations</p>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-amber-700">Active Alerts</p>
                  <p className="text-2xl font-bold text-amber-900">7</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-amber-600" />
              </div>
              <p className="text-xs text-amber-600 mt-1">Require your attention</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-700">Opportunities</p>
                  <p className="text-2xl font-bold text-purple-900">12</p>
                </div>
                <Lightbulb className="h-8 w-8 text-purple-600" />
              </div>
              <p className="text-xs text-purple-600 mt-1">Growth opportunities</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="recommendations" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="market">Market Trends</TabsTrigger>
            <TabsTrigger value="competition">Competition</TabsTrigger>
            <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
          </TabsList>

          <TabsContent value="recommendations" className="space-y-6">
            {/* Priority Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Priority Recommendations
                </CardTitle>
                <CardDescription>High-impact actions to improve your business performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {priorityRecommendations.map((rec, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-l-4 ${
                        rec.priority === "high"
                          ? "border-red-500 bg-red-50"
                          : rec.priority === "medium"
                            ? "border-amber-500 bg-amber-50"
                            : "border-blue-500 bg-blue-50"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{rec.title}</h4>
                            <Badge
                              variant={
                                rec.priority === "high"
                                  ? "destructive"
                                  : rec.priority === "medium"
                                    ? "secondary"
                                    : "default"
                              }
                            >
                              {rec.priority} priority
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Target className="h-4 w-4 text-green-600" />
                              <span className="text-green-600">Impact: {rec.impact}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-blue-600" />
                              <span className="text-blue-600">Effort: {rec.effort}</span>
                            </div>
                          </div>
                        </div>
                        <Button size="sm" className="ml-4">
                          {rec.action}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Insights */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Product Performance Insights</CardTitle>
                  <CardDescription>AI analysis of your top-performing products</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {productInsights.map((insight, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                        <div className="relative h-12 w-12 overflow-hidden rounded-md">
                          <img
                            src={insight.image || "/placeholder.svg"}
                            alt={insight.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{insight.name}</h4>
                          <p className="text-sm text-muted-foreground">{insight.insight}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {insight.trend === "up" ? (
                              <TrendingUp className="h-4 w-4 text-green-600" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-600" />
                            )}
                            <span className="text-sm font-medium">{insight.change}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Behavior Analysis</CardTitle>
                  <CardDescription>Understanding your buyers' patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Peak Shopping Hours</span>
                        <span className="font-medium">2-4 PM EST</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Average Order Value</span>
                        <span className="font-medium">$1,247</span>
                      </div>
                      <Progress value={72} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Customer Retention</span>
                        <span className="font-medium">68%</span>
                      </div>
                      <Progress value={68} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Mobile vs Desktop</span>
                        <span className="font-medium">60% / 40%</span>
                      </div>
                      <Progress value={60} className="h-2" />
                    </div>

                    <div className="bg-blue-50 p-3 rounded-md mt-4">
                      <p className="text-sm text-blue-700">
                        💡 <strong>Insight:</strong> Your customers prefer shopping in the afternoon. Consider running
                        promotions during 2-4 PM for maximum impact.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Dynamic Pricing Recommendations</CardTitle>
                  <CardDescription>AI-optimized pricing for maximum profitability</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pricingRecommendations.map((rec, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{rec.product}</h4>
                          <Badge variant={rec.action === "increase" ? "default" : "secondary"}>
                            {rec.action === "increase" ? "Increase" : "Decrease"}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Current</p>
                            <p className="font-medium">${rec.currentPrice}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Suggested</p>
                            <p className="font-medium text-green-600">${rec.suggestedPrice}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Impact</p>
                            <p className="font-medium">{rec.impact}</p>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">{rec.reason}</p>
                        <Button size="sm" className="mt-3 w-full">
                          Apply Pricing
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Price Elasticity Analysis</CardTitle>
                  <CardDescription>How price changes affect demand for your products</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={priceElasticityData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="price" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="demand" stroke="#10B981" strokeWidth={2} />
                        <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 p-3 bg-green-50 rounded-md">
                    <p className="text-sm text-green-700">
                      <strong>Optimal Price Point:</strong> $1,950 maximizes revenue while maintaining healthy demand.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="market" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Market Trend Analysis</CardTitle>
                  <CardDescription>Real-time commodity market insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={marketTrendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="gold" stackId="1" stroke="#FFD700" fill="#FFD700" />
                        <Area type="monotone" dataKey="silver" stackId="1" stroke="#C0C0C0" fill="#C0C0C0" />
                        <Area type="monotone" dataKey="oil" stackId="1" stroke="#4F4F4F" fill="#4F4F4F" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Market Sentiment</CardTitle>
                  <CardDescription>AI analysis of market sentiment across commodities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {marketSentiment.map((sentiment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: sentiment.color }}></div>
                          <div>
                            <h4 className="font-medium">{sentiment.commodity}</h4>
                            <p className="text-sm text-muted-foreground">{sentiment.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={
                              sentiment.sentiment === "Bullish"
                                ? "default"
                                : sentiment.sentiment === "Bearish"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {sentiment.sentiment}
                          </Badge>
                          <p className="text-sm text-muted-foreground mt-1">{sentiment.confidence}% confidence</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Supply & Demand Indicators</CardTitle>
                <CardDescription>Key factors affecting commodity prices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {supplyDemandFactors.map((factor, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <factor.icon className="h-5 w-5 text-blue-600" />
                        <h4 className="font-medium">{factor.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{factor.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Impact Level</span>
                        <Badge variant={factor.impact === "High" ? "destructive" : "secondary"}>{factor.impact}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="competition" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Competitive Analysis</CardTitle>
                  <CardDescription>How you compare to similar sellers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {competitiveAnalysis.map((metric, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">{metric.metric}</span>
                          <span className="text-sm text-muted-foreground">
                            You: {metric.yourValue} | Avg: {metric.avgValue}
                          </span>
                        </div>
                        <Progress value={metric.percentile} className="h-2" />
                        <p className="text-xs text-muted-foreground">{metric.insight}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Competitor Price Tracking</CardTitle>
                  <CardDescription>Monitor competitor pricing for similar products</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {competitorPricing.map((comp, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{comp.product}</h4>
                          <Badge variant="outline">{comp.category}</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Your Price</p>
                            <p className="font-medium">${comp.yourPrice}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Market Avg</p>
                            <p className="font-medium">${comp.marketAvg}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Position</p>
                            <p
                              className={`font-medium ${comp.position === "Above" ? "text-red-600" : "text-green-600"}`}
                            >
                              {comp.position}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">{comp.recommendation}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="forecasting" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales Forecasting</CardTitle>
                <CardDescription>AI predictions for your business performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={salesForecastData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="actual" stroke="#10B981" strokeWidth={2} name="Actual Sales" />
                      <Line
                        type="monotone"
                        dataKey="predicted"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="Predicted Sales"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid gap-4 md:grid-cols-3 mt-6">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900">Next Month</h4>
                    <p className="text-2xl font-bold text-green-900">$52,000</p>
                    <p className="text-sm text-green-600">+15% vs this month</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900">Next Quarter</h4>
                    <p className="text-2xl font-bold text-blue-900">$148,000</p>
                    <p className="text-sm text-blue-600">+22% vs last quarter</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-900">Confidence</h4>
                    <p className="text-2xl font-bold text-purple-900">87%</p>
                    <p className="text-sm text-purple-600">High accuracy</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Seasonal Trends</CardTitle>
                  <CardDescription>Historical patterns in your sales data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={seasonalTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="sales" fill="#10B981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Risk Factors</CardTitle>
                  <CardDescription>Potential challenges that could affect forecasts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {riskFactors.map((risk, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{risk.factor}</h4>
                          <Badge
                            variant={
                              risk.severity === "High"
                                ? "destructive"
                                : risk.severity === "Medium"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {risk.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{risk.description}</p>
                        <div className="flex items-center justify-between text-sm">
                          <span>Probability: {risk.probability}%</span>
                          <span>Impact: {risk.impact}</span>
                        </div>
                      </div>
                    ))}
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

// Mock data
const priorityRecommendations = [
  {
    title: "Optimize Gold Pricing",
    description:
      "Your gold products are priced 8% below market average. Increasing prices could boost revenue by $12,000/month.",
    priority: "high",
    impact: "+$12k/month",
    effort: "Low",
    action: "Apply Pricing",
  },
  {
    title: "Expand Silver Inventory",
    description:
      "Silver demand has increased 25% in your market. Consider adding more silver products to your catalog.",
    priority: "medium",
    impact: "+$8k/month",
    effort: "Medium",
    action: "View Products",
  },
  {
    title: "Improve Product Photos",
    description: "Products with high-quality images convert 40% better. 12 of your listings need photo updates.",
    priority: "medium",
    impact: "+15% conversion",
    effort: "High",
    action: "Update Photos",
  },
  {
    title: "Enable Bulk Discounts",
    description: "67% of your customers buy multiple items. Bulk pricing could increase average order value.",
    priority: "low",
    impact: "+$3k/month",
    effort: "Low",
    action: "Configure",
  },
]

const productInsights = [
  {
    name: "Gold Bullion - 1oz",
    insight: "Top performer with 40% higher conversion than category average",
    trend: "up",
    change: "+23% this month",
    image: "/placeholder.svg?height=48&width=48",
  },
  {
    name: "Silver Bars - 10oz",
    insight: "Strong demand but inventory running low",
    trend: "up",
    change: "+18% this month",
    image: "/placeholder.svg?height=48&width=48",
  },
  {
    name: "Platinum Coin - 1oz",
    insight: "Price sensitivity detected, consider promotional pricing",
    trend: "down",
    change: "-8% this month",
    image: "/placeholder.svg?height=48&width=48",
  },
]

const pricingRecommendations = [
  {
    product: "Gold Bullion - 1oz",
    currentPrice: "1,920",
    suggestedPrice: "1,975",
    action: "increase",
    impact: "+$2,750/month",
    reason: "Market price increased 3% this week, competitors raised prices",
  },
  {
    product: "Silver Bars - 10oz",
    currentPrice: "285",
    suggestedPrice: "275",
    action: "decrease",
    impact: "+15% sales volume",
    reason: "High price sensitivity detected, small decrease will boost volume significantly",
  },
  {
    product: "Platinum Coin - 1oz",
    currentPrice: "980",
    suggestedPrice: "1,020",
    action: "increase",
    impact: "+$1,200/month",
    reason: "Limited supply in market, premium pricing opportunity",
  },
]

const priceElasticityData = [
  { price: 1800, demand: 95, revenue: 171000 },
  { price: 1850, demand: 88, revenue: 162800 },
  { price: 1900, demand: 82, revenue: 155800 },
  { price: 1950, demand: 75, revenue: 146250 },
  { price: 2000, demand: 68, revenue: 136000 },
  { price: 2050, demand: 60, revenue: 123000 },
  { price: 2100, demand: 52, revenue: 109200 },
]

const marketTrendData = [
  { date: "Jan", gold: 1850, silver: 24, oil: 75 },
  { date: "Feb", gold: 1920, silver: 26, oil: 78 },
  { date: "Mar", gold: 1980, silver: 28, oil: 72 },
  { date: "Apr", gold: 1950, silver: 27, oil: 80 },
  { date: "May", gold: 2020, silver: 29, oil: 85 },
  { date: "Jun", gold: 1975, silver: 28, oil: 82 },
  { date: "Jul", gold: 2050, silver: 30, oil: 88 },
]

const marketSentiment = [
  {
    commodity: "Gold",
    sentiment: "Bullish",
    confidence: 87,
    description: "Strong institutional demand, inflation hedge",
    color: "#FFD700",
  },
  {
    commodity: "Silver",
    sentiment: "Bullish",
    confidence: 82,
    description: "Industrial demand growth, supply constraints",
    color: "#C0C0C0",
  },
  {
    commodity: "Oil",
    sentiment: "Neutral",
    confidence: 65,
    description: "Mixed signals from geopolitical factors",
    color: "#4F4F4F",
  },
  {
    commodity: "Agriculture",
    sentiment: "Bearish",
    confidence: 73,
    description: "Good harvest season, oversupply concerns",
    color: "#8BC34A",
  },
]

const supplyDemandFactors = [
  {
    title: "Central Bank Policies",
    description: "Interest rate changes affecting precious metals demand",
    impact: "High",
    icon: BarChart3,
  },
  {
    title: "Industrial Demand",
    description: "Manufacturing sector growth driving silver consumption",
    impact: "Medium",
    icon: Users,
  },
  {
    title: "Geopolitical Events",
    description: "Global tensions increasing safe-haven asset demand",
    impact: "High",
    icon: AlertTriangle,
  },
]

const competitiveAnalysis = [
  {
    metric: "Average Response Time",
    yourValue: "2.3 hours",
    avgValue: "4.1 hours",
    percentile: 85,
    insight: "You respond 43% faster than competitors",
  },
  {
    metric: "Product Variety",
    yourValue: "28 products",
    avgValue: "35 products",
    percentile: 65,
    insight: "Consider expanding your product catalog",
  },
  {
    metric: "Customer Rating",
    yourValue: "4.8/5",
    avgValue: "4.3/5",
    percentile: 92,
    insight: "Excellent customer satisfaction scores",
  },
  {
    metric: "Price Competitiveness",
    yourValue: "Market +3%",
    avgValue: "Market avg",
    percentile: 45,
    insight: "Slightly above market average pricing",
  },
]

const competitorPricing = [
  {
    product: "Gold Bullion - 1oz",
    category: "Precious Metals",
    yourPrice: "1,950",
    marketAvg: "1,925",
    position: "Above",
    recommendation: "Consider matching market average to increase competitiveness",
  },
  {
    product: "Silver Bars - 10oz",
    category: "Precious Metals",
    yourPrice: "280",
    marketAvg: "285",
    position: "Below",
    recommendation: "Good positioning, maintain current pricing strategy",
  },
  {
    product: "Platinum Coin - 1oz",
    category: "Precious Metals",
    yourPrice: "980",
    marketAvg: "995",
    position: "Below",
    recommendation: "Opportunity to increase price by $15 to match market",
  },
]

const salesForecastData = [
  { month: "Jan", actual: 32000, predicted: null },
  { month: "Feb", actual: 35000, predicted: null },
  { month: "Mar", actual: 38000, predicted: null },
  { month: "Apr", actual: 42000, predicted: null },
  { month: "May", actual: 45000, predicted: null },
  { month: "Jun", actual: 48000, predicted: null },
  { month: "Jul", actual: 45000, predicted: null },
  { month: "Aug", actual: null, predicted: 52000 },
  { month: "Sep", actual: null, predicted: 55000 },
  { month: "Oct", actual: null, predicted: 58000 },
  { month: "Nov", actual: null, predicted: 62000 },
  { month: "Dec", actual: null, predicted: 68000 },
]

const seasonalTrends = [
  { month: "Jan", sales: 32000 },
  { month: "Feb", sales: 28000 },
  { month: "Mar", sales: 35000 },
  { month: "Apr", sales: 38000 },
  { month: "May", sales: 42000 },
  { month: "Jun", sales: 45000 },
  { month: "Jul", sales: 48000 },
  { month: "Aug", sales: 52000 },
  { month: "Sep", sales: 55000 },
  { month: "Oct", sales: 58000 },
  { month: "Nov", sales: 65000 },
  { month: "Dec", sales: 72000 },
]

const riskFactors = [
  {
    factor: "Economic Recession",
    description: "Potential economic downturn could reduce luxury commodity demand",
    severity: "High",
    probability: 25,
    impact: "-30% revenue",
  },
  {
    factor: "Supply Chain Disruption",
    description: "Shipping delays could affect inventory availability",
    severity: "Medium",
    probability: 40,
    impact: "-15% sales",
  },
  {
    factor: "Regulatory Changes",
    description: "New commodity trading regulations could affect operations",
    severity: "Low",
    probability: 15,
    impact: "-5% margin",
  },
]
