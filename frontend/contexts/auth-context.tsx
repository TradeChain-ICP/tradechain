"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "buyer" | "seller" | "admin"
  avatar?: string
  verified: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, role?: "buyer" | "seller") => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo users for testing
const DEMO_USERS = {
  buyer: {
    id: "1",
    email: "buyer@demo.com",
    firstName: "Alex",
    lastName: "Johnson",
    role: "buyer" as const,
    avatar: "/placeholder.svg?height=40&width=40",
    verified: true,
  },
  seller: {
    id: "2",
    email: "seller@demo.com",
    firstName: "Premium",
    lastName: "Metals Co.",
    role: "seller" as const,
    avatar: "/placeholder.svg?height=40&width=40",
    verified: true,
  },
  admin: {
    id: "3",
    email: "admin@demo.com",
    firstName: "Admin",
    lastName: "User",
    role: "admin" as const,
    avatar: "/placeholder.svg?height=40&width=40",
    verified: true,
  },
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem("tradechain_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string, role?: "buyer" | "seller") => {
    setIsLoading(true)

    // Demo login logic
    let demoUser: User | null = null

    if (email === "buyer@demo.com" || role === "buyer") {
      demoUser = DEMO_USERS.buyer
    } else if (email === "seller@demo.com" || role === "seller") {
      demoUser = DEMO_USERS.seller
    } else if (email === "admin@demo.com") {
      demoUser = DEMO_USERS.admin
    }

    if (demoUser) {
      setUser(demoUser)
      localStorage.setItem("tradechain_user", JSON.stringify(demoUser))
    } else {
      throw new Error("Invalid credentials")
    }

    setIsLoading(false)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("tradechain_user")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
