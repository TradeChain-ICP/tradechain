"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ArrowRight, ShoppingCart, Store } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"

export default function RoleSelectionPage() {
  const { toast } = useToast()
  const { login } = useAuth()
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<"buyer" | "seller" | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleContinue = async () => {
    if (!selectedRole) {
      toast({
        title: "Role Selection Required",
        description: "Please select a role to continue.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Use demo credentials based on role
      const email = selectedRole === "buyer" ? "buyer@demo.com" : "seller@demo.com"
      await login(email, "demo123", selectedRole)

      // Redirect based on role
      const redirectPath = selectedRole === "buyer" ? "/buyer-dashboard" : "/seller-dashboard"
      router.push(redirectPath)

      toast({
        title: "Welcome to TradeChain!",
        description: `You've been logged in as a ${selectedRole}.`,
      })
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "There was an error logging you in. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container relative min-h-screen flex flex-col items-center justify-center">
      <Link
        href="/login"
        className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center text-sm font-medium text-muted-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to login
      </Link>

      <div className="mx-auto flex w-full max-w-3xl flex-col justify-center space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Choose Your Role</h1>
          <p className="text-muted-foreground">Select how you want to use TradeChain. You can change this later.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Card
            className={`cursor-pointer transition-all ${
              selectedRole === "buyer" ? "border-primary ring-2 ring-primary ring-opacity-50" : ""
            }`}
            onClick={() => setSelectedRole("buyer")}
          >
            <CardHeader>
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
                <ShoppingCart className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Buyer</CardTitle>
              <CardDescription>I want to purchase commodities on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Browse and purchase commodities</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Track orders and deliveries</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Access AI-powered market insights</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Manage your commodity portfolio</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all ${
              selectedRole === "seller" ? "border-primary ring-2 ring-primary ring-opacity-50" : ""
            }`}
            onClick={() => setSelectedRole("seller")}
          >
            <CardHeader>
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
                <Store className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Seller</CardTitle>
              <CardDescription>I want to sell commodities on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>List and manage commodity inventory</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Process orders and track shipments</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Get AI-powered pricing recommendations</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Access detailed sales analytics</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center">
          <Button onClick={handleContinue} disabled={!selectedRole || isLoading} className="w-full max-w-xs">
            {isLoading ? "Processing..." : "Continue"}
            {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">Demo Credentials:</p>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Buyer: buyer@demo.com / demo123</p>
            <p>Seller: seller@demo.com / demo123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
