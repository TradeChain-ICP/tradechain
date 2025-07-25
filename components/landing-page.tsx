"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/placeholder.svg?height=32&width=32"
              alt="TradeChain Logo"
              width={32}
              height={32}
              className="rounded-md"
            />
            <span className="text-xl font-bold">TradeChain</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              How It Works
            </Link>
            <Link href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Testimonials
            </Link>
            <Link href="#faq" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              FAQ
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Log In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="container md:hidden py-4 border-t">
            <nav className="flex flex-col gap-4">
              <Link
                href="#features"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="#testimonials"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Testimonials
              </Link>
              <Link
                href="#faq"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </Link>
              <div className="flex flex-col gap-2 mt-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full bg-transparent">
                    Log In
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    Trade Real-World Commodities with Blockchain Security
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Buy and sell precious metals, oil, agricultural products, and timber using ICP tokens or tokenized
                    fiat currencies on our secure platform.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/register">
                    <Button size="lg" className="gap-1">
                      Get Started <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#how-it-works">
                    <Button size="lg" variant="outline">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[350px] w-full md:h-[420px] lg:h-[500px]">
                  <Image
                    src="/placeholder.svg?height=500&width=500"
                    alt="TradeChain Platform Preview"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-12 md:py-24 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Features</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Everything You Need to Trade Commodities
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  TradeChain provides a comprehensive platform for trading real-world commodities with the security and
                  transparency of blockchain technology.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="border-0 shadow-md">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Commodity Categories */}
        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Commodities</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Diverse Range of Commodities</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Explore and trade a wide variety of real-world commodities on our platform.
                </p>
              </div>
            </div>
            <div className="mt-12">
              <Tabs defaultValue="metals" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-8">
                  <TabsTrigger value="metals">Precious Metals</TabsTrigger>
                  <TabsTrigger value="oil">Oil & Gas</TabsTrigger>
                  <TabsTrigger value="agriculture">Agriculture</TabsTrigger>
                  <TabsTrigger value="timber">Timber</TabsTrigger>
                </TabsList>
                <TabsContent value="metals" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {commodities.metals.map((item) => (
                      <CommodityCard key={item.name} commodity={item} />
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="oil" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {commodities.oil.map((item) => (
                      <CommodityCard key={item.name} commodity={item} />
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="agriculture" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {commodities.agriculture.map((item) => (
                      <CommodityCard key={item.name} commodity={item} />
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="timber" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {commodities.timber.map((item) => (
                      <CommodityCard key={item.name} commodity={item} />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-12 md:py-24 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Process</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">How TradeChain Works</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform makes trading commodities simple, secure, and transparent.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-3">
              {steps.map((step, index) => (
                <div key={step.title} className="relative flex flex-col items-center space-y-4 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                  {index < steps.length - 1 && (
                    <div className="absolute left-[50%] top-8 hidden h-[2px] w-full bg-border lg:block" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Testimonials</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">What Our Users Say</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Hear from traders who have experienced the benefits of our platform.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="border-0 shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Image
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                      <div>
                        <h3 className="font-bold">{testimonial.name}</h3>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="mt-4 text-muted-foreground">{testimonial.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-12 md:py-24 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">FAQ</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Frequently Asked Questions</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Find answers to common questions about TradeChain.
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-3xl space-y-4 py-12">
              {faqs.map((faq, index) => (
                <FaqItem key={index} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Ready to Start Trading?</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join TradeChain today and experience the future of commodity trading.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/register">
                  <Button size="lg" className="gap-1">
                    Create Account <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline">
                    Log In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between md:py-12">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Image
                src="/placeholder.svg?height=32&width=32"
                alt="TradeChain Logo"
                width={32}
                height={32}
                className="rounded-md"
              />
              <span className="text-xl font-bold">TradeChain</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} TradeChain. All rights reserved.
            </p>
          </div>
          <div className="flex flex-wrap gap-6 md:gap-8">
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold">Platform</h3>
              <nav className="flex flex-col gap-2">
                <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground">
                  Features
                </Link>
                <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground">
                  How It Works
                </Link>
                <Link href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground">
                  Testimonials
                </Link>
                <Link href="#faq" className="text-sm text-muted-foreground hover:text-foreground">
                  FAQ
                </Link>
              </nav>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold">Resources</h3>
              <nav className="flex flex-col gap-2">
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Documentation
                </Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Help Center
                </Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Blog
                </Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  API
                </Link>
              </nav>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold">Legal</h3>
              <nav className="flex flex-col gap-2">
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Cookie Policy
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// FAQ Item Component
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border rounded-lg">
      <button className="flex w-full items-center justify-between p-4 text-left" onClick={() => setIsOpen(!isOpen)}>
        <span className="font-medium">{question}</span>
        <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="p-4 pt-0 text-muted-foreground">
          <p>{answer}</p>
        </div>
      )}
    </div>
  )
}

// Commodity Card Component
function CommodityCard({ commodity }: { commodity: Commodity }) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-square relative">
        <Image src={commodity.image || "/placeholder.svg"} alt={commodity.name} fill className="object-cover" />
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{commodity.name}</h3>
          <div className="text-sm font-medium text-primary">{commodity.price}</div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{commodity.description}</p>
      </CardContent>
    </Card>
  )
}

// Data
import { BarChart3, Lock, Wallet, ShieldCheck, LineChart, Globe } from "lucide-react"

interface Commodity {
  name: string
  description: string
  price: string
  image: string
}

const features = [
  {
    title: "Secure Transactions",
    description: "All trades are secured by blockchain technology and smart contracts for maximum security.",
    icon: ShieldCheck,
  },
  {
    title: "ICP Wallet Integration",
    description: "Seamlessly connect your ICP wallet or create a new one to start trading immediately.",
    icon: Wallet,
  },
  {
    title: "Escrow Protection",
    description: "Our smart contract escrow system ensures safe and transparent transactions.",
    icon: Lock,
  },
  {
    title: "AI-Powered Insights",
    description: "Get market intelligence and price predictions powered by advanced AI algorithms.",
    icon: LineChart,
  },
  {
    title: "Real-time Analytics",
    description: "Track market trends and your portfolio performance with comprehensive analytics.",
    icon: BarChart3,
  },
  {
    title: "Global Marketplace",
    description: "Connect with buyers and sellers from around the world in our diverse marketplace.",
    icon: Globe,
  },
]

const steps = [
  {
    title: "Create an Account",
    description: "Sign up and complete the KYC verification process to get started.",
  },
  {
    title: "Connect Your Wallet",
    description: "Link your existing ICP wallet or create a new one through our platform.",
  },
  {
    title: "Start Trading",
    description: "Browse the marketplace, place orders, and manage your commodity portfolio.",
  },
]

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Gold Trader",
    content:
      "TradeChain has revolutionized how I trade precious metals. The platform is intuitive and the AI insights have helped me make better investment decisions.",
    avatar: "/placeholder.svg?height=48&width=48",
  },
  {
    name: "Michael Chen",
    role: "Agricultural Investor",
    content:
      "As someone who trades agricultural commodities, I appreciate the security and transparency that TradeChain provides. The escrow system gives me peace of mind.",
    avatar: "/placeholder.svg?height=48&width=48",
  },
  {
    name: "Elena Rodriguez",
    role: "Oil & Gas Trader",
    content:
      "The analytics tools on TradeChain are exceptional. I can track market trends and make informed decisions about my oil investments in real-time.",
    avatar: "/placeholder.svg?height=48&width=48",
  },
]

const faqs = [
  {
    question: "How does TradeChain ensure the security of transactions?",
    answer:
      "TradeChain uses blockchain technology and smart contracts to secure all transactions. Our escrow system holds funds until both parties confirm the transaction is complete, providing an additional layer of security.",
  },
  {
    question: "What types of commodities can I trade on TradeChain?",
    answer:
      "You can trade a wide range of commodities including precious metals (gold, silver, platinum), oil and gas products, agricultural commodities (wheat, corn, soybeans), and timber products.",
  },
  {
    question: "How does the KYC verification process work?",
    answer:
      "Our KYC process involves identity verification through document uploads and biometric verification. This typically takes 1-2 business days to complete and is required for all users to ensure platform security.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "TradeChain accepts ICP tokens as the primary payment method. We also support various tokenized fiat currencies for users who prefer traditional currency options.",
  },
  {
    question: "How are commodity prices determined?",
    answer:
      "Commodity prices on TradeChain are determined by sellers, but our AI-powered insights provide market data and price recommendations to ensure fair pricing. All prices are transparent and visible to buyers.",
  },
]

const commodities = {
  metals: [
    {
      name: "Gold",
      description: "99.9% pure gold bullion",
      price: "1,950 ICP/oz",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Silver",
      description: "Fine silver bars and coins",
      price: "25 ICP/oz",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Platinum",
      description: "Investment grade platinum",
      price: "980 ICP/oz",
      image: "/placeholder.svg?height=300&width=300",
    },
  ],
  oil: [
    {
      name: "Crude Oil",
      description: "West Texas Intermediate",
      price: "75 ICP/barrel",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Natural Gas",
      description: "Clean burning natural gas",
      price: "3.50 ICP/MMBtu",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Gasoline",
      description: "Refined petroleum product",
      price: "2.50 ICP/gallon",
      image: "/placeholder.svg?height=300&width=300",
    },
  ],
  agriculture: [
    {
      name: "Wheat",
      description: "Premium hard red wheat",
      price: "7.25 ICP/bushel",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Coffee Beans",
      description: "Arabica coffee beans",
      price: "180 ICP/pound",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Soybeans",
      description: "Non-GMO soybeans",
      price: "14.50 ICP/bushel",
      image: "/placeholder.svg?height=300&width=300",
    },
  ],
  timber: [
    {
      name: "Pine Lumber",
      description: "Construction grade pine",
      price: "450 ICP/1000 board ft",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Oak Hardwood",
      description: "Premium oak hardwood",
      price: "750 ICP/1000 board ft",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Bamboo",
      description: "Sustainable bamboo",
      price: "350 ICP/1000 board ft",
      image: "/placeholder.svg?height=300&width=300",
    },
  ],
}
