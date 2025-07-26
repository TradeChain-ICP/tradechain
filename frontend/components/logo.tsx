"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center space-x-2", className)}>
      <div className="relative">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
          <span className="text-white font-bold text-lg">TC</span>
        </div>
        <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse" />
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          TradeChain
        </span>
        <span className="text-xs text-muted-foreground -mt-1">Commodity Trading</span>
      </div>
    </Link>
  )
}
