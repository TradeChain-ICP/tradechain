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
  ShoppingCart,
  DollarSign,
  TrendingUp as Growth,
} from "lucide-react"
import { useContentPadding } from "@/contexts/sidebar-context"

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

export default function BuyerAIInsightsPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("7d")
  const { contentPadding, containerWidth } = useContentPadding()

  return (
    <div className={`min-h-screen ${contentPadding}`}>
      <div className={`mx-auto space-y-6 ${containerWidth}`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">AI Investment Insights</h1>
            <p className="text-muted-foreground">
              AI-powered market intelligence and investment recommendations
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
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700">AI Confidence</p>
                  <p className="text-2xl font-bold text-blue-900">92%</p>
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
                  <p className="text-sm text-green-700">Portfolio Growth</p>
                  <p className="text-2xl font-bold text-green-900">+15.2%</p>
                </div>
                <Growth className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-xs text-green-600 mt-1">From AI recommendations</p>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-amber-700">Buy Alerts</p>
                  <p className="text-2xl font-bold text-amber-900">5</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-amber-600" />
              </div>
              <p className="text-xs text-amber-600 mt-1">Opportunities identified</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-700">Smart Suggestions</p>
                  <p className="text-2xl font-bold text-purple-900">8</p>
                </div>
                <Lightbulb className="h-8 w-8 text-purple-600" />
              </div>
              <p className="text-xs text-purple-600 mt-1">Investment opportunities</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="recommendations" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="market">Market Analysis</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio Insights</TabsTrigger>
            <TabsTrigger value="timing">Timing Signals</TabsTrigger>
            <TabsTrigger value="risks">Risk Assessment</TabsTrigger>
          </TabsList>

          <TabsContent value="recommendations" className="space-y-6">
            {/* Priority Investment Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Priority Investment Opportunities
                </CardTitle>
                <CardDescription>AI-identified high-potential investments based on your profile</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {buyerRecommendations.map((rec, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-l-4 ${
                        rec.priority === "high"
                          ? "border-green-500 bg-green-50"
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
                                  ? "default"
                                  : rec.priority === "medium"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {rec.priority} priority
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Target className="h-4 w-4 text-green-600" />
                              <span className="text-green-600">Potential: {rec.potential}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-blue-600" />
                              <span className="text-blue-600">Timeline: {rec.timeline}</span>
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

            {/* Smart Shopping Insights */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Smart Buying Opportunities</CardTitle>
                  <CardDescription>AI analysis of current market deals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {smartDeals.map((deal, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                        <div className="relative h-12 w-12 overflow-hidden rounded-md">
                          <img
                            src={deal.image || "/placeholder.svg"}
                            alt={deal.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{deal.name}</h4>
                          <p className="text-sm text-muted-foreground">{deal.insight}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {deal.savings} below market
                            </Badge>
                            <span className="text-sm font-medium text-green-600">{deal.timeLeft}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Investment Profile Analysis</CardTitle>
                  <CardDescription>Understanding your investment patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Risk Tolerance</span>
                        <span className="font-medium">Moderate</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Diversification Score</span>
                        <span className="font-medium">8.2/10</span>
                      </div>
                      <Progress value={82} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Investment Frequency</span>
                        <span className="font-medium">2.3x/month</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Avg. Hold Period</span>
                        <span className="font-medium">8.5 months</span>
                      </div>
                      <Progress value={70} className="h-2" />
                    </div>

                    <div className="bg-blue-50 p-3 rounded-md mt-4">
                      <p className="text-sm text-blue-700">
                        💡 <strong>AI Insight:</strong> Your investment style suggests a balanced approach with room for
                        strategic diversification into emerging commodities.
                      </p>
                    </div>
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
                  <CardDescription>Real-time commodity market insights for buyers</CardDescription>
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
                  <CardTitle>Buy/Sell Signals</CardTitle>
                  <CardDescription>AI-generated investment timing signals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {buySignals.map((signal, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              signal.signal === "Buy" ? "bg-green-500" :
                              signal.signal === "Sell" ? "bg-red-500" : "bg-yellow-500"
                            }`}
                          ></div>
                          <div>
                            <h4 className="font-medium">{signal.commodity}</h4>
                            <p className="text-sm text-muted-foreground">{signal.reason}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={
                              signal.signal === "Buy"
                                ? "default"
                                : signal.signal === "Sell"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {signal.signal}
                          </Badge>
                          <p className="text-sm text-muted-foreground mt-1">{signal.confidence}% confidence</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Optimization Suggestions</CardTitle>
                <CardDescription>AI recommendations to improve your portfolio performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {portfolioSuggestions.map((suggestion, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <suggestion.icon className="h-5 w-5 text-blue-600" />
                        <h4 className="font-medium">{suggestion.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{suggestion.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-green-600">{suggestion.impact}</span>
                        <Button size="sm" variant="outline">
                          {suggestion.action}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Market Timing Intelligence</CardTitle>
                <CardDescription>AI analysis of optimal buying and selling windows</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timingData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="buyScore" stroke="#10B981" strokeWidth={2} name="Buy Score" />
                      <Line type="monotone" dataKey="sellScore" stroke="#EF4444" strokeWidth={2} name="Sell Score" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid gap-4 md:grid-cols-3 mt-6">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900">Best Buy Window</h4>
                    <p className="text-lg font-bold text-green-900">Next 2 weeks</p>
                    <p className="text-sm text-green-600">Gold & Silver markets</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900">Current Signal</h4>
                    <p className="text-lg font-bold text-blue-900">Accumulate</p>
                    <p className="text-sm text-blue-600">Precious metals</p>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-lg">
                    <h4 className="font-medium text-amber-900">Next Review</h4>
                    <p className="text-lg font-bold text-amber-900">5 days</p>
                    <p className="text-sm text-amber-600">Market reassessment</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Investment Risk Assessment</CardTitle>
                <CardDescription>AI analysis of potential risks to your investments</CardDescription>
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
                        <span>Portfolio Impact: {risk.impact}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Mock data for buyer AI insights
const buyerRecommendations = [
  {
    title: "Accumulate Gold Before Q4",
    description: "Historical data shows gold performs strongly in Q4. Current prices are 5% below seasonal average.",
    priority: "high",
    potential: "+12-18% ROI",
    timeline: "3-6 months",
    action: "View Products",
  },
  {
    title: "Diversify into Silver",
    description: "Your portfolio is 85% gold. Adding silver could reduce risk while maintaining growth potential.",
    priority: "medium",
    potential: "+8% portfolio stability",
    timeline: "1-2 months",
    action: "Explore Silver",
  },
  {
    title: "Consider Platinum Entry",
    description: "Platinum showing oversold conditions with strong industrial demand recovery signals.",
    priority: "medium",
    potential: "+15-25% potential",
    timeline: "6-12 months",
    action: "Learn More",
  },
  {
    title: "Dollar-Cost Average Oil",
    description: "Oil volatility creates opportunity for systematic accumulation strategy.",
    priority: "low",
    potential: "+6-10% steady gains",
    timeline: "12+ months",
    action: "Setup Plan",
  },
]

const smartDeals = [
  {
    name: "Gold Bullion - 1oz American Eagle",
    insight: "3.2% below market average, seller offering quick settlement",
    savings: "5.8%",
    timeLeft: "2 days left",
    image: "/placeholder.svg?height=48&width=48",
  },
  {
    name: "Silver Bars - 10oz",
    insight: "Bulk discount opportunity, limited inventory",
    savings: "4.1%",
    timeLeft: "5 hours left",
    image: "/placeholder.svg?height=48&width=48",
  },
  {
    name: "Platinum Coin - 1oz",
    insight: "Seasonal low pricing, strong recovery expected",
    savings: "7.2%",
    timeLeft: "1 day left",
    image: "/placeholder.svg?height=48&width=48",
  },
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

const buySignals = [
  {
    commodity: "Gold",
    signal: "Buy",
    confidence: 87,
    reason: "Technical breakout confirmed, institutional accumulation",
  },
  {
    commodity: "Silver",
    signal: "Buy",
    confidence: 82,
    reason: "Industrial demand surge, supply deficit emerging",
  },
  {
    commodity: "Oil",
    signal: "Hold",
    confidence: 65,
    reason: "Mixed signals, await geopolitical clarity",
  },
  {
    commodity: "Copper",
    signal: "Sell",
    confidence: 73,
    reason: "Overbought conditions, profit-taking recommended",
  },
]

const portfolioSuggestions = [
  {
    title: "Rebalance Allocation",
    description: "Reduce gold exposure from 85% to 70%, add silver and platinum",
    impact: "+12% risk-adjusted returns",
    action: "Rebalance",
    icon: BarChart3,
  },
  {
    title: "Add Defensive Assets",
    description: "Include treasury-backed assets to hedge against volatility",
    impact: "+8% portfolio stability",
    action: "Explore Options",
    icon: Users,
  },
  {
    title: "Increase Position Size",
    description: "Your positions are smaller than optimal for your risk profile",
    impact: "+15% profit potential",
    action: "Size Calculator",
    icon: Target,
  },
  {
    title: "Setup Auto-Investment",
    description: "Dollar-cost averaging can reduce timing risk",
    impact: "+5% consistency",
    action: "Setup Plan",
    icon: Clock,
  },
]

const timingData = [
  { week: "W1", buyScore: 65, sellScore: 35 },
  { week: "W2", buyScore: 78, sellScore: 22 },
  { week: "W3", buyScore: 85, sellScore: 15 },
  { week: "W4", buyScore: 92, sellScore: 8 },
  { week: "W5", buyScore: 88, sellScore: 12 },
  { week: "W6", buyScore: 75, sellScore: 25 },
  { week: "W7", buyScore: 60, sellScore: 40 },
  { week: "W8", buyScore: 45, sellScore: 55 },
]

const riskFactors = [
  {
    factor: "Market Volatility",
    description: "Increased price swings could affect short-term positions",
    severity: "Medium",
    probability: 65,
    impact: "±15% value fluctuation",
  },
  {
    factor: "Economic Recession",
    description: "Potential economic downturn affecting commodity demand",
    severity: "High",
    probability: 25,
    impact: "-20% portfolio value",
  },
  {
    factor: "Currency Fluctuation",
    description: "USD strength could impact commodity prices",
    severity: "Low",
    probability: 45,
    impact: "±5% price impact",
  },
  {
    factor: "Regulatory Changes",
    description: "New regulations could affect trading conditions",
    severity: "Low",
    probability: 20,
    impact: "±3% transaction costs",
  },
]