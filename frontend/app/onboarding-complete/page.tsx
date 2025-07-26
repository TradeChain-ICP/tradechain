"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { CheckCircle, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function OnboardingCompletePage() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setProgress(100), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="container relative min-h-screen flex flex-col items-center justify-center">
      <div className="mx-auto w-full max-w-md text-center">
        <div className="mb-8 flex flex-col items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="mt-4 text-2xl font-bold">Onboarding Complete!</h1>
          <p className="mt-2 text-muted-foreground">
            Your KYC verification is being processed. We'll notify you once it's approved.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Verification Status</CardTitle>
            <CardDescription>Your verification is in progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Processing</span>
                  <span>Estimated: 1-2 business days</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="rounded-md bg-muted p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium">What happens next?</h3>
                    <div className="mt-2 text-sm text-muted-foreground">
                      <ul className="list-disc space-y-1 pl-5">
                        <li>Our team will review your submitted documents</li>
                        <li>You'll receive an email notification once verified</li>
                        <li>After approval, you can start trading on TradeChain</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Link href="/marketplace" className="w-full">
              <Button className="w-full">
                Explore Marketplace <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/buyer-dashboard" className="w-full">
              <Button variant="outline" className="w-full bg-transparent">
                Go to Dashboard
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <div className="mt-8 space-y-4">
          <h2 className="text-lg font-medium">While you wait, you can:</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Card>
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Image src="/placeholder.svg?height=24&width=24" alt="Wallet" width={24} height={24} />
                </div>
                <h3 className="font-medium">Set Up Your Wallet</h3>
                <p className="text-sm text-muted-foreground">Configure your ICP wallet for trading</p>
                <Link href="/wallet" className="mt-2 text-sm text-primary hover:underline">
                  Get Started
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Image src="/placeholder.svg?height=24&width=24" alt="Learn" width={24} height={24} />
                </div>
                <h3 className="font-medium">Learn About Trading</h3>
                <p className="text-sm text-muted-foreground">Explore our guides on commodity trading</p>
                <Link href="/help" className="mt-2 text-sm text-primary hover:underline">
                  View Guides
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
