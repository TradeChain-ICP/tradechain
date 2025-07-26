"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: ("buyer" | "seller" | "admin")[]
  fallbackPath?: string
}

export function RoleGuard({ children, allowedRoles, fallbackPath }: RoleGuardProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login")
        return
      }

      if (!allowedRoles.includes(user.role)) {
        const defaultPath =
          user.role === "buyer" ? "/buyer-dashboard" : user.role === "seller" ? "/seller-dashboard" : "/admin-dashboard"
        router.push(fallbackPath || defaultPath)
        return
      }
    }
  }, [user, isLoading, allowedRoles, router, fallbackPath])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return null
  }

  return <>{children}</>
}
