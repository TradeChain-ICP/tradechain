"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Heart, Star, MapPin, User, ShoppingCart } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Product } from "@/data/products"

interface ProductCardProps {
  product: Product
  viewMode?: "grid" | "list"
  onAddToCart?: () => void
}

export function ProductCard({ product, viewMode = "grid", onAddToCart }: ProductCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const discountPercentage = product.previousPrice
    ? Math.round(((product.previousPrice - product.price) / product.previousPrice) * 100)
    : product.discount

  if (viewMode === "list") {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
        <div className="flex">
          <div className="relative w-48 h-32 flex-shrink-0">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className={cn("object-cover transition-opacity duration-300", imageLoading ? "opacity-0" : "opacity-100")}
              onLoad={() => setImageLoading(false)}
            />
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="destructive">Out of Stock</Badge>
              </div>
            )}
            {discountPercentage && product.inStock && (
              <Badge className="absolute top-2 left-2 bg-red-500 text-white">-{discountPercentage}%</Badge>
            )}
          </div>
          <div className="flex-1 p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs">
                    {product.category}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-muted-foreground">
                      {product.rating} ({product.reviewCount})
                    </span>
                  </div>
                </div>
                <Link href={`/product/${product.id}`}>
                  <h3 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{product.description}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {product.seller}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {product.origin}
                  </div>
                </div>
              </div>
              <div className="text-right ml-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-2xl font-bold">${product.price.toFixed(2)}</div>
                  <span className="text-sm text-muted-foreground">/{product.unit}</span>
                </div>
                {product.previousPrice && (
                  <div className="text-sm text-muted-foreground line-through">${product.previousPrice.toFixed(2)}</div>
                )}
                <div className="flex items-center gap-2 mt-3">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setIsFavorited(!isFavorited)}
                          className="h-8 w-8"
                        >
                          <Heart className={cn("h-4 w-4", isFavorited && "fill-red-500 text-red-500")} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{isFavorited ? "Remove from favorites" : "Add to favorites"}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Button onClick={onAddToCart} disabled={!product.inStock} className="flex-1">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {product.inStock ? "Add to Cart" : "Out of Stock"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className={cn(
            "object-cover transition-all duration-300 group-hover:scale-105",
            imageLoading ? "opacity-0" : "opacity-100",
          )}
          onLoad={() => setImageLoading(false)}
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

        {/* Favorite button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                onClick={() => setIsFavorited(!isFavorited)}
              >
                <Heart className={cn("h-4 w-4", isFavorited && "fill-red-500 text-red-500")} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isFavorited ? "Remove from favorites" : "Add to favorites"}</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Badges */}
        {discountPercentage && product.inStock && (
          <Badge className="absolute top-2 left-2 bg-red-500 text-white">-{discountPercentage}%</Badge>
        )}

        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive">Out of Stock</Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="text-xs">
            {product.category}
          </Badge>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-muted-foreground">
              {product.rating} ({product.reviewCount})
            </span>
          </div>
        </div>

        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-2 mb-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span className="truncate">{product.seller}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{product.origin}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
              <span className="text-sm text-muted-foreground">/{product.unit}</span>
            </div>
            {product.previousPrice && (
              <div className="text-sm text-muted-foreground line-through">${product.previousPrice.toFixed(2)}</div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button onClick={onAddToCart} disabled={!product.inStock} className="w-full">
          <ShoppingCart className="mr-2 h-4 w-4" />
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </CardFooter>
    </Card>
  )
}
