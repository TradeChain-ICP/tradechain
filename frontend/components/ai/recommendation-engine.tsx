"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Sparkles, TrendingUp, Users, Clock, Star, ArrowRight } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"

interface RecommendationEngineProps {
  userId?: string
  userRole?: "buyer" | "seller"
  context?: "marketplace" | "dashboard" | "product"
  productId?: string
}

export function RecommendationEngine({
  userId,
  userRole = "buyer",
  context = "marketplace",
  productId,
}: RecommendationEngineProps) {
  const { toast } = useToast()
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate AI recommendation loading
    const timer = setTimeout(() => {
      setRecommendations(getRecommendations(context, userRole))
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [context, userRole])

  const handleAddToCart = (productId: string, productName: string) => {
    toast({
      title: "Added to Cart",
      description: `${productName} has been added to your cart.`,
    })
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 animate-pulse" />
            <CardTitle>AI Recommendations</CardTitle>
          </div>
          <CardDescription>Generating personalized recommendations...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="h-16 w-16 bg-muted rounded-md"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-600" />
          <CardTitle>AI Recommendations</CardTitle>
        </div>
        <CardDescription>Personalized suggestions based on your activity and market trends</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="for-you" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="for-you">For You</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="similar">Similar</TabsTrigger>
            <TabsTrigger value="deals">Deals</TabsTrigger>
          </TabsList>

          <TabsContent value="for-you" className="space-y-4 mt-4">
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Based on your preferences</span>
            </div>
            {recommendations.slice(0, 3).map((item, index) => (
              <RecommendationItem key={index} item={item} onAddToCart={handleAddToCart} userRole={userRole} />
            ))}
          </TabsContent>

          <TabsContent value="trending" className="space-y-4 mt-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Popular right now</span>
            </div>
            {recommendations.slice(1, 4).map((item, index) => (
              <RecommendationItem key={index} item={item} onAddToCart={handleAddToCart} userRole={userRole} />
            ))}
          </TabsContent>

          <TabsContent value="similar" className="space-y-4 mt-4">
            <div className="flex items-center gap-2 mb-3">
              <Star className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium">Similar to your interests</span>
            </div>
            {recommendations.slice(2, 5).map((item, index) => (
              <RecommendationItem key={index} item={item} onAddToCart={handleAddToCart} userRole={userRole} />
            ))}
          </TabsContent>

          <TabsContent value="deals" className="space-y-4 mt-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium">Limited time offers</span>
            </div>
            {recommendations.slice(0, 3).map((item, index) => (
              <RecommendationItem
                key={index}
                item={{ ...item, discount: "15% OFF", urgent: true }}
                onAddToCart={handleAddToCart}
                userRole={userRole}
              />
            ))}
          </TabsContent>
        </Tabs>

        <div className="mt-6 pt-4 border-t">
          <Link href="/marketplace">
            <Button variant="outline" className="w-full bg-transparent">
              View All Recommendations
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

function RecommendationItem({
  item,
  onAddToCart,
  userRole,
}: {
  item: any
  onAddToCart: (id: string, name: string) => void
  userRole: string
}) {
  return (
    <div className="flex gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
      <div className="relative h-16 w-16 flex-shrink-0">
        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover rounded-md" />
        {item.discount && (
          <Badge className="absolute -top-1 -right-1 text-xs" variant="destructive">
            {item.discount}
          </Badge>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
            <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs">{item.rating}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {item.category}
              </Badge>
              {item.urgent && (
                <Badge variant="destructive" className="text-xs animate-pulse">
                  Limited
                </Badge>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="font-medium text-sm">${item.price.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">{item.unit}</div>
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          <Link href={`/product/${item.id}`}>
            <Button variant="outline" size="sm" className="text-xs bg-transparent">
              View
            </Button>
          </Link>
          {userRole === "buyer" && (
            <Button size="sm" className="text-xs" onClick={() => onAddToCart(item.id, item.name)}>
              Add to Cart
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// Mock recommendation data generator
function getRecommendations(context: string, userRole: string) {
  const baseRecommendations = [
    {
      id: "rec1",
      name: "Gold Bullion - 1oz Canadian Maple",
      description: "99.9% pure gold coin with maple leaf design",
      price: 1975,
      unit: "per oz",
      category: "Precious Metals",
      rating: 4.9,
      image: "/placeholder.svg?height=64&width=64",
    },
    {
      id: "rec2",
      name: "Silver Bars - 5oz",
      description: "Fine silver bars with certificate",
      price: 140,
      unit: "per bar",
      category: "Precious Metals",
      rating: 4.7,
      image: "/placeholder.svg?height=64&width=64",
    },
    {
      id: "rec3",
      name: "Platinum Coins - 1/2oz",
      description: "Premium platinum investment coins",
      price: 525,
      unit: "per coin",
      category: "Precious Metals",
      rating: 4.8,
      image: "/placeholder.svg?height=64&width=64",
    },
    {
      id: "rec4",
      name: "Crude Oil Futures Contract",
      description: "WTI crude oil futures for Q4 2024",
      price: 75,
      unit: "per barrel",
      category: "Oil & Gas",
      rating: 4.5,
      image: "/placeholder.svg?height=64&width=64",
    },
    {
      id: "rec5",
      name: "Wheat Futures - Dec 2024",
      description: "Premium wheat futures contract",
      price: 6.5,
      unit: "per bushel",
      category: "Agriculture",
      rating: 4.6,
      image: "/placeholder.svg?height=64&width=64",
    },
  ]

  return baseRecommendations
}
