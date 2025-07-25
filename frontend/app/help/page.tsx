"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import {
  Search,
  MessageCircle,
  Phone,
  Mail,
  FileText,
  Video,
  Users,
  ChevronDown,
  ExternalLink,
  Clock,
  CheckCircle,
} from "lucide-react"

import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useToast } from "@/components/ui/use-toast"

export default function HelpPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [contactForm, setContactForm] = useState({
    subject: "",
    category: "",
    message: "",
    priority: "medium",
  })

  const filteredFAQs = faqData.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!contactForm.subject || !contactForm.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Support Ticket Created",
      description: "We've received your message and will respond within 24 hours.",
    })

    setContactForm({
      subject: "",
      category: "",
      message: "",
      priority: "medium",
    })
  }

  return (
    <DashboardLayout userRole="buyer">
      <div className="container mx-auto px-4 py-6 pb-20 lg:pb-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Help & Support</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions, browse our guides, or get in touch with our support team.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-8 w-8 mx-auto mb-3 text-blue-600" />
              <h3 className="font-semibold mb-2">Live Chat</h3>
              <p className="text-sm text-muted-foreground mb-3">Chat with our support team</p>
              <Badge variant="default">Online</Badge>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <Phone className="h-8 w-8 mx-auto mb-3 text-green-600" />
              <h3 className="font-semibold mb-2">Phone Support</h3>
              <p className="text-sm text-muted-foreground mb-3">Call us for immediate help</p>
              <Badge variant="outline">+1 (555) 123-4567</Badge>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <Mail className="h-8 w-8 mx-auto mb-3 text-purple-600" />
              <h3 className="font-semibold mb-2">Email Support</h3>
              <p className="text-sm text-muted-foreground mb-3">Send us a detailed message</p>
              <Badge variant="outline">support@tradechain.com</Badge>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <Video className="h-8 w-8 mx-auto mb-3 text-red-600" />
              <h3 className="font-semibold mb-2">Video Tutorials</h3>
              <p className="text-sm text-muted-foreground mb-3">Learn with step-by-step guides</p>
              <Badge variant="outline">Watch Now</Badge>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="faq" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="guides">Guides</TabsTrigger>
            <TabsTrigger value="contact">Contact Us</TabsTrigger>
            <TabsTrigger value="status">System Status</TabsTrigger>
          </TabsList>

          <TabsContent value="faq" className="space-y-6">
            {/* FAQ Search */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search frequently asked questions..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="account">Account & Profile</SelectItem>
                      <SelectItem value="orders">Orders & Payments</SelectItem>
                      <SelectItem value="trading">Trading & Investing</SelectItem>
                      <SelectItem value="security">Security & Verification</SelectItem>
                      <SelectItem value="technical">Technical Issues</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Categories */}
            <div className="grid gap-6 md:grid-cols-2">
              {faqCategories.map((category) => (
                <Card key={category.id}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <category.icon className="h-6 w-6 text-primary" />
                      <div>
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                        <CardDescription>{category.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {category.questions.map((question, index) => (
                        <Link key={index} href="#" className="block p-2 rounded-md hover:bg-muted transition-colors">
                          <p className="text-sm font-medium">{question}</p>
                        </Link>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4 bg-transparent">
                      View All {category.name} Questions
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* FAQ List */}
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>{filteredFAQs.length} questions found</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredFAQs.map((faq) => (
                    <Collapsible key={faq.id}>
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left border rounded-lg hover:bg-muted transition-colors">
                        <div className="flex items-start gap-3">
                          <Badge variant="outline" className="mt-0.5">
                            {faq.category}
                          </Badge>
                          <span className="font-medium">{faq.question}</span>
                        </div>
                        <ChevronDown className="h-4 w-4 transition-transform" />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="px-4 pb-4">
                        <div className="pt-4 border-t">
                          <p className="text-muted-foreground">{faq.answer}</p>
                          {faq.relatedLinks && (
                            <div className="mt-4">
                              <p className="text-sm font-medium mb-2">Related Articles:</p>
                              <div className="space-y-1">
                                {faq.relatedLinks.map((link, index) => (
                                  <Link
                                    key={index}
                                    href="#"
                                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                                  >
                                    {link}
                                    <ExternalLink className="h-3 w-3" />
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guides" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {helpGuides.map((guide) => (
                <Card key={guide.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <guide.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">{guide.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{guide.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{guide.category}</Badge>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {guide.readTime}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Contact Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Send us a Message</CardTitle>
                  <CardDescription>Fill out the form below and we'll get back to you within 24 hours.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        placeholder="Brief description of your issue"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={contactForm.category}
                        onValueChange={(value) => setContactForm({ ...contactForm, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="account">Account Issues</SelectItem>
                          <SelectItem value="orders">Order Problems</SelectItem>
                          <SelectItem value="payments">Payment Issues</SelectItem>
                          <SelectItem value="technical">Technical Support</SelectItem>
                          <SelectItem value="general">General Inquiry</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={contactForm.priority}
                        onValueChange={(value) => setContactForm({ ...contactForm, priority: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        placeholder="Please provide as much detail as possible..."
                        rows={6}
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>Multiple ways to reach our support team</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <MessageCircle className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Live Chat</p>
                        <p className="text-sm text-muted-foreground">Available 24/7</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">+1 (555) 123-4567</p>
                        <p className="text-sm text-muted-foreground">Mon-Fri, 9AM-6PM EST</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="font-medium">support@tradechain.com</p>
                        <p className="text-sm text-muted-foreground">Response within 24 hours</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Business Hours</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span className="font-medium">9:00 AM - 6:00 PM EST</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span className="font-medium">10:00 AM - 4:00 PM EST</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span className="font-medium">Closed</span>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-sm text-muted-foreground">Live chat is available 24/7 for urgent issues.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="status" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  System Status - All Systems Operational
                </CardTitle>
                <CardDescription>Last updated: {new Date().toLocaleString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemStatus.map((system) => (
                    <div key={system.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            system.status === "operational"
                              ? "bg-green-500"
                              : system.status === "degraded"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                        />
                        <div>
                          <h4 className="font-medium">{system.name}</h4>
                          <p className="text-sm text-muted-foreground">{system.description}</p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          system.status === "operational"
                            ? "default"
                            : system.status === "degraded"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {system.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Incidents</CardTitle>
                <CardDescription>Past incidents and maintenance windows</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentIncidents.map((incident) => (
                    <div key={incident.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">{incident.title}</h4>
                        <Badge variant="outline">{incident.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{incident.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{incident.date}</span>
                        <span>Duration: {incident.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

// Mock data
const faqCategories = [
  {
    id: "account",
    name: "Account & Profile",
    description: "Account setup, profile management, and verification",
    icon: Users,
    questions: [
      "How do I verify my account?",
      "How to update my profile information?",
      "What are the account limits?",
      "How to enable two-factor authentication?",
    ],
  },
  {
    id: "orders",
    name: "Orders & Payments",
    description: "Order management, payment methods, and transactions",
    icon: FileText,
    questions: [
      "How to place an order?",
      "What payment methods are accepted?",
      "How to track my order?",
      "What is the refund policy?",
    ],
  },
  {
    id: "trading",
    name: "Trading & Investing",
    description: "Trading strategies, market analysis, and investment tips",
    icon: MessageCircle,
    questions: [
      "How to start trading commodities?",
      "What are the trading fees?",
      "How to read market charts?",
      "What is the minimum investment?",
    ],
  },
  {
    id: "security",
    name: "Security & Verification",
    description: "Account security, KYC process, and data protection",
    icon: CheckCircle,
    questions: [
      "How secure is my data?",
      "What is KYC verification?",
      "How to report suspicious activity?",
      "What if I forget my password?",
    ],
  },
]

const faqData = [
  {
    id: "1",
    category: "account",
    question: "How do I verify my account?",
    answer:
      "To verify your account, go to your profile settings and click on 'Verify Account'. You'll need to provide a government-issued ID and proof of address. The verification process typically takes 1-3 business days.",
    relatedLinks: ["Account Verification Guide", "Accepted Documents List"],
  },
  {
    id: "2",
    category: "orders",
    question: "What payment methods are accepted?",
    answer:
      "We accept major credit cards (Visa, MasterCard, American Express), bank transfers, and ICP tokens. All payments are processed securely through our encrypted payment system.",
    relatedLinks: ["Payment Security", "ICP Token Guide"],
  },
  {
    id: "3",
    category: "trading",
    question: "What are the trading fees?",
    answer:
      "Our trading fees are competitive and transparent. We charge a 0.5% fee on each transaction for buyers and 2% for sellers. There are no hidden fees or monthly charges.",
    relatedLinks: ["Fee Structure", "Pricing Guide"],
  },
  {
    id: "4",
    category: "security",
    question: "How secure is my data?",
    answer:
      "We use bank-level encryption and security measures to protect your data. All sensitive information is encrypted both in transit and at rest. We also offer two-factor authentication for additional security.",
    relatedLinks: ["Security Measures", "Privacy Policy"],
  },
]

const helpGuides = [
  {
    id: "1",
    title: "Getting Started with TradeChain",
    description: "Complete guide to setting up your account and making your first trade",
    category: "Beginner",
    readTime: "5 min read",
    icon: Users,
  },
  {
    id: "2",
    title: "Understanding Commodity Markets",
    description: "Learn the basics of commodity trading and market analysis",
    category: "Education",
    readTime: "10 min read",
    icon: MessageCircle,
  },
  {
    id: "3",
    title: "Security Best Practices",
    description: "How to keep your account and investments secure",
    category: "Security",
    readTime: "7 min read",
    icon: CheckCircle,
  },
  {
    id: "4",
    title: "Payment Methods Guide",
    description: "All about payment options and transaction processing",
    category: "Payments",
    readTime: "4 min read",
    icon: FileText,
  },
  {
    id: "5",
    title: "Mobile App Tutorial",
    description: "How to use TradeChain on your mobile device",
    category: "Mobile",
    readTime: "6 min read",
    icon: Phone,
  },
  {
    id: "6",
    title: "Advanced Trading Strategies",
    description: "Professional tips for experienced traders",
    category: "Advanced",
    readTime: "15 min read",
    icon: MessageCircle,
  },
]

const systemStatus = [
  {
    name: "Trading Platform",
    description: "Core trading functionality and order processing",
    status: "operational",
  },
  {
    name: "Payment Processing",
    description: "Credit card and bank transfer processing",
    status: "operational",
  },
  {
    name: "User Authentication",
    description: "Login and account access systems",
    status: "operational",
  },
  {
    name: "Market Data",
    description: "Real-time price feeds and market information",
    status: "operational",
  },
  {
    name: "Mobile App",
    description: "iOS and Android mobile applications",
    status: "operational",
  },
  {
    name: "API Services",
    description: "Third-party integrations and API endpoints",
    status: "operational",
  },
]

const recentIncidents = [
  {
    id: "1",
    title: "Scheduled Maintenance - Payment System",
    description: "Routine maintenance to improve payment processing reliability",
    status: "Resolved",
    date: "July 20, 2024",
    duration: "2 hours",
  },
  {
    id: "2",
    title: "Market Data Delay",
    description: "Brief delay in real-time price updates due to upstream provider issues",
    status: "Resolved",
    date: "July 15, 2024",
    duration: "15 minutes",
  },
  {
    id: "3",
    title: "Mobile App Update",
    description: "Deployed new mobile app version with enhanced security features",
    status: "Completed",
    date: "July 10, 2024",
    duration: "30 minutes",
  },
]
