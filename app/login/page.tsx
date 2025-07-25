"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate login process
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Login Successful",
        description: "Redirecting to your dashboard...",
      })

      // Redirect based on user role (in a real app, this would be determined by the auth response)
      window.location.href = "/buyer-dashboard"
    }, 1500)
  }

  const handleInternetIdentityLogin = () => {
    setIsLoading(true)

    // Simulate Internet Identity authentication
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Internet Identity Authentication",
        description: "Successfully authenticated with Internet Identity",
      })

      // Redirect to role selection for new users or dashboard for existing users
      window.location.href = "/role-selection"
    }, 1500)
  }

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/"
        className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center text-sm font-medium text-muted-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to home
      </Link>

      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900">
          <Image
            src="/placeholder.svg?height=1080&width=1920"
            fill
            alt="Authentication background"
            className="object-cover opacity-30"
          />
        </div>
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Image
            src="/placeholder.svg?height=32&width=32"
            alt="TradeChain Logo"
            width={32}
            height={32}
            className="mr-2 rounded-md"
          />
          TradeChain
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "TradeChain has revolutionized how I trade commodities. The platform is secure, transparent, and
              incredibly easy to use."
            </p>
            <footer className="text-sm">Sarah Johnson, Gold Trader</footer>
          </blockquote>
        </div>
      </div>

      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Sign in to your account to continue</p>
          </div>

          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="internet-identity">Internet Identity</TabsTrigger>
            </TabsList>

            <TabsContent value="email">
              <Card>
                <form onSubmit={handleLogin}>
                  <CardHeader>
                    <CardTitle>Email Login</CardTitle>
                    <CardDescription>Enter your email and password to sign in</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                          Forgot password?
                        </Link>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="internet-identity">
              <Card>
                <CardHeader>
                  <CardTitle>Internet Identity</CardTitle>
                  <CardDescription>Sign in with your Internet Identity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-md bg-blue-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Info className="h-5 w-5 text-blue-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-blue-700">
                          Internet Identity is a blockchain-based authentication system that provides a secure way to
                          sign in without passwords.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleInternetIdentityLogin}
                    className="w-full bg-transparent"
                    variant="outline"
                    disabled={isLoading}
                  >
                    {isLoading ? "Authenticating..." : "Continue with Internet Identity"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>

          <p className="px-8 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="underline underline-offset-4 hover:text-primary">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
