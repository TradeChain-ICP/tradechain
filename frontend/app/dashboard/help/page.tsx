// app/dashboard/help/page.tsx
"use client"

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
  HelpCircle,
  BookOpen,
  Shield,
  Headphones,
  Zap,
} from "lucide-react"

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
import { useContentPadding } from "@/contexts/sidebar-context"
import { useAuth } from "@/contexts/auth-context"

export default function HelpPage() {
  const { toast } = useToast()
  const { contentPadding } = useContentPadding()
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [contactForm, setContactForm] = useState({
    subject: "",
    category: "",
    message: "",
    priority: "medium",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredFAQs = faqData.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!contactForm.subject || !contactForm.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
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
    } catch (error) {
      toast({
        title: "Failed to Submit",
        description: "There was an error submitting your request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "chat":
        toast({
          title: "Live Chat",
          description: "Opening live chat window...",
        })
        break
      case "call":
        window.open("tel:+15551234567")
        break
      case "email":
        window.open("mailto:support@tradechain.com")
        break
      case "videos":
        toast({
          title: "Video Tutorials",
          description: "Opening video tutorial library...",
        })
        break
      default:
        break
    }
  }

  return (
    <div className={`py-6 pb-20 lg:pb-8 ${contentPadding}`}>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Help & Support</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Find answers to common questions, browse our guides, or get in touch with our support team.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card 
          className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 group"
          onClick={() => handleQuickAction("chat")}
        >
          <CardContent className="p-6 text-center">
            <div className="mx-auto mb-3 p-2 bg-blue-50 rounded-full w-fit group-hover:bg-blue-100 transition-colors">
              <MessageCircle className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Live Chat</h3>
            <p className="text-sm text-muted-foreground mb-3">Chat with our support team</p>
            <Badge variant="default" className="bg-green-500">Online</Badge>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 group"
          onClick={() => handleQuickAction("call")}
        >
          <CardContent className="p-6 text-center">
            <div className="mx-auto mb-3 p-2 bg-green-50 rounded-full w-fit group-hover:bg-green-100 transition-colors">
              <Phone className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Phone Support</h3>
            <p className="text-sm text-muted-foreground mb-3">Call us for immediate help</p>
            <Badge variant="outline">+1 (555) 123-4567</Badge>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 group"
          onClick={() => handleQuickAction("email")}
        >
          <CardContent className="p-6 text-center">
            <div className="mx-auto mb-3 p-2 bg-purple-50 rounded-full w-fit group-hover:bg-purple-100 transition-colors">
              <Mail className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-2">Email Support</h3>
            <p className="text-sm text-muted-foreground mb-3">Send us a detailed message</p>
            <Badge variant="outline">support@tradechain.com</Badge>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 group"
          onClick={() => handleQuickAction("videos")}
        >
          <CardContent className="p-6 text-center">
            <div className="mx-auto mb-3 p-2 bg-red-50 rounded-full w-fit group-hover:bg-red-100 transition-colors">
              <Video className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="font-semibold mb-2">Video Tutorials</h3>
            <p className="text-sm text-muted-foreground mb-3">Learn with step-by-step guides</p>
            <Badge variant="outline">Watch Now</Badge>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="faq" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-6">
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="contact" className="hidden lg:flex">Contact Us</TabsTrigger>
          <TabsTrigger value="status" className="hidden lg:flex">System Status</TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="space-y-6">
          {/* FAQ Search */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search frequently asked questions..."
                      className="pl-8 text-base"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full lg:w-[180px]">
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

          {/* FAQ Categories - Mobile Optimized */}
          <div className="grid gap-4 lg:gap-6 lg:grid-cols-2">
            {faqCategories.map((category) => (
              <Card key={category.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <category.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <CardDescription className="text-sm">{category.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {category.questions.slice(0, 3).map((question, index) => (
                      <Link 
                        key={index} 
                        href="#" 
                        className="block p-2 rounded-md hover:bg-muted transition-colors text-sm"
                      >
                        <p className="font-medium truncate">{question}</p>
                      </Link>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4 bg-transparent" size="sm">
                    View All {category.questions.length} Questions
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQ List */}
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                {filteredFAQs.length} question{filteredFAQs.length !== 1 ? 's' : ''} found
                {searchQuery && ` for "${searchQuery}"`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredFAQs.length > 0 ? (
                  filteredFAQs.map((faq) => (
                    <Collapsible key={faq.id}>
                      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left border rounded-lg hover:bg-muted transition-colors group">
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          <Badge variant="outline" className="mt-0.5 flex-shrink-0 text-xs">
                            {faq.category}
                          </Badge>
                          <span className="font-medium text-sm sm:text-base">{faq.question}</span>
                        </div>
                        <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180 flex-shrink-0 ml-2" />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="px-4 pb-4">
                        <div className="pt-4 border-t">
                          <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
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
                                    <ExternalLink className="h-3 w-3 flex-shrink-0" />
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <HelpCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No FAQs Found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your search query or browse our help categories.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchQuery("")
                        setSelectedCategory("all")
                      }}
                      className="bg-transparent"
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guides" className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {helpGuides.map((guide) => (
              <Card key={guide.id} className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 group">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <guide.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold mb-2 line-clamp-2">{guide.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{guide.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">{guide.category}</Badge>
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
                      className="text-base"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      className="text-base resize-none"
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Sending Message..." : "Send Message"}
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
                  <div className="flex items-center gap-3 p-3 rounded-lg border">
                    <MessageCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">Live Chat</p>
                      <p className="text-sm text-muted-foreground">Available 24/7 for immediate assistance</p>
                    </div>
                    <Badge className="bg-green-500">Online</Badge>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg border">
                    <Phone className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">+1 (555) 123-4567</p>
                      <p className="text-sm text-muted-foreground">Mon-Fri, 9AM-6PM EST</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg border">
                    <Mail className="h-5 w-5 text-purple-600 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">support@tradechain.com</p>
                      <p className="text-sm text-muted-foreground">Response within 24 hours</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Business Hours</CardTitle>
                  <CardDescription>When our support team is available</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm">Monday - Friday</span>
                    <span className="font-medium text-sm">9:00 AM - 6:00 PM EST</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm">Saturday</span>
                    <span className="font-medium text-sm">10:00 AM - 4:00 PM EST</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm">Sunday</span>
                    <span className="font-medium text-sm text-muted-foreground">Closed</span>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-700">
                        <strong>24/7 Support:</strong> Live chat is available around the clock for urgent issues.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {user && (
                <Card>
                  <CardHeader>
                    <CardTitle>Your Account</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Account Type</span>
                      <span className="font-medium capitalize">{user.role}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Member Since</span>
                      <span className="font-medium">Jan 2024</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Support Tickets</span>
                      <span className="font-medium">3 resolved</span>
                    </div>
                  </CardContent>
                </Card>
              )}
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
              <CardDescription>
                Last updated: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {systemStatus.map((system) => (
                  <div key={system.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div
                        className={`w-3 h-3 rounded-full flex-shrink-0 ${
                          system.status === "operational"
                            ? "bg-green-500"
                            : system.status === "degraded"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-sm">{system.name}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-1">{system.description}</p>
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
                      className="ml-4 flex-shrink-0 text-xs"
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
                {recentIncidents.length > 0 ? (
                  recentIncidents.map((incident) => (
                    <div key={incident.id} className="p-4 border rounded-lg">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                        <h4 className="font-medium">{incident.title}</h4>
                        <Badge variant="outline" className="w-fit">{incident.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{incident.description}</p>
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {incident.date}
                        </span>
                        <span>Duration: {incident.duration}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Recent Incidents</h3>
                    <p className="text-muted-foreground">All systems have been running smoothly.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
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
      "How to delete my account?",
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
      "How to cancel an order?",
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
      "How does escrow work?",
    ],
  },
  {
    id: "security",
    name: "Security & Verification",
    description: "Account security, KYC process, and data protection",
    icon: Shield,
    questions: [
      "How secure is my data?",
      "What is KYC verification?",
      "How to report suspicious activity?",
      "What if I forget my password?",
      "How to enable 2FA?",
    ],
  },
]

const faqData = [
  {
    id: '1',
    category: 'account',
    question: 'How do I verify my account?',
    answer:
      "To verify your account, go to your profile settings and click on 'Verify Account'. You'll need to provide a government-issued ID and proof of address. The verification process typically takes 1-3 business days.",
    relatedLinks: ['Account Verification Guide', 'Accepted Documents List'],
  },
  {
    id: '2',
    category: 'orders',
    question: 'What payment methods are accepted?',
    answer:
      'We accept major credit cards (Visa, MasterCard, American Express), bank transfers, and ICP tokens. All payments are processed securely through our encrypted payment system.',
    relatedLinks: ['Payment Security', 'ICP Token Guide'],
  },
  {
    id: '3',
    category: 'trading',
    question: 'What are the trading fees?',
    answer:
      'Our trading fees are competitive and transparent. We charge a 0.5% fee on each transaction for buyers and 2% for sellers. There are no hidden fees or monthly charges.',
    relatedLinks: ['Fee Structure', 'Pricing Guide'],
  },
  {
    id: '4',
    category: 'security',
    question: 'How secure is my data?',
    answer:
      'We use bank-level encryption and security measures to protect your data. All sensitive information is encrypted both in transit and at rest. We also offer two-factor authentication for additional security.',
    relatedLinks: ['Security Measures', 'Privacy Policy'],
  },
  {
    id: '5',
    category: 'account',
    question: 'How to enable two-factor authentication?',
    answer:
      "Go to Settings > Security and click 'Enable 2FA'. You can use any authenticator app like Google Authenticator or Authy. Scan the QR code and enter the verification code to complete setup.",
    relatedLinks: ['2FA Setup Guide', 'Recommended Authenticator Apps'],
  },
  {
    id: '6',
    category: 'orders',
    question: 'How to track my order?',
    answer:
      "You can track your order by going to your Orders page in the dashboard. Each order has a status indicator and tracking number. You'll also receive email notifications for status updates.",
    relatedLinks: ['Order Status Guide', 'Tracking Information'],
  },
  {
    id: '7',
    category: 'trading',
    question: 'How to start trading commodities?',
    answer:
      'First, complete your account verification. Then deposit funds using your preferred payment method. Browse the marketplace, research products, and start with small investments to learn the platform.',
    relatedLinks: ['Getting Started Guide', 'Trading Tutorial'],
  },
  {
    id: '8',
    category: 'technical',
    question: 'The platform is running slowly, what should I do?',
    answer:
      'Try clearing your browser cache, disabling browser extensions, or switching to a different browser. If the issue persists, it might be a temporary server issue. Contact support if problems continue.',
    relatedLinks: ['Troubleshooting Guide', 'Browser Requirements'],
  },
];

const helpGuides = [
  {
    id: '1',
    title: 'Getting Started with TradeChain',
    description: 'Complete guide to setting up your account and making your first trade',
    category: 'Beginner',
    readTime: '5 min read',
    icon: Users,
  },
  {
    id: '2',
    title: 'Understanding Commodity Markets',
    description: 'Learn the basics of commodity trading and market analysis',
    category: 'Education',
    readTime: '10 min read',
    icon: BookOpen,
  },
  {
    id: '3',
    title: 'Security Best Practices',
    description: 'How to keep your account and investments secure',
    category: 'Security',
    readTime: '7 min read',
    icon: Shield,
  },
  {
    id: '4',
    title: 'Payment Methods Guide',
    description: 'All about payment options and transaction processing',
    category: 'Payments',
    readTime: '4 min read',
    icon: FileText,
  },
  {
    id: '5',
    title: 'Mobile App Tutorial',
    description: 'How to use TradeChain on your mobile device',
    category: 'Mobile',
    readTime: '6 min read',
    icon: Phone,
  },
  {
    id: '6',
    title: 'Advanced Trading Strategies',
    description: 'Professional tips for experienced traders',
    category: 'Advanced',
    readTime: '15 min read',
    icon: Zap,
  },
  {
    id: '7',
    title: 'KYC Verification Process',
    description: 'Step-by-step guide to account verification',
    category: 'Verification',
    readTime: '8 min read',
    icon: CheckCircle,
  },
  {
    id: '8',
    title: 'Understanding Escrow',
    description: 'How our secure escrow system protects your transactions',
    category: 'Security',
    readTime: '6 min read',
    icon: Shield,
  },
  {
    id: '9',
    title: 'API Documentation',
    description: 'Integration guide for developers',
    category: 'Developer',
    readTime: '20 min read',
    icon: FileText,
  },
];

const systemStatus = [
  {
    name: 'Trading Platform',
    description: 'Core trading functionality and order processing',
    status: 'operational',
  },
  {
    name: 'Payment Processing',
    description: 'Credit card and bank transfer processing',
    status: 'operational',
  },
  {
    name: 'User Authentication',
    description: 'Login and account access systems',
    status: 'operational',
  },
  {
    name: 'Market Data',
    description: 'Real-time price feeds and market information',
    status: 'operational',
  },
  {
    name: 'Mobile App',
    description: 'iOS and Android mobile applications',
    status: 'operational',
  },
  {
    name: 'API Services',
    description: 'Third-party integrations and API endpoints',
    status: 'operational',
  },
  {
    name: 'Email Notifications',
    description: 'System emails and alerts',
    status: 'operational',
  },
  {
    name: 'Customer Support',
    description: 'Live chat and support ticket system',
    status: 'operational',
  },
];

const recentIncidents = [
  {
    id: '1',
    title: 'Scheduled Maintenance - Payment System',
    description:
      'Routine maintenance to improve payment processing reliability and add new security features',
    status: 'Resolved',
    date: 'July 20, 2024',
    duration: '2 hours',
  },
  {
    id: '2',
    title: 'Market Data Delay',
    description: 'Brief delay in real-time price updates due to upstream data provider maintenance',
    status: 'Resolved',
    date: 'July 15, 2024',
    duration: '15 minutes',
  },
  {
    id: '3',
    title: 'Mobile App Update Deployment',
    description:
      'Deployed new mobile app version with enhanced security features and improved performance',
    status: 'Completed',
    date: 'July 10, 2024',
    duration: '30 minutes',
  },
  {
    id: '4',
    title: 'Database Performance Optimization',
    description:
      'Scheduled database maintenance to improve query performance and system responsiveness',
    status: 'Resolved',
    date: 'July 5, 2024',
    duration: '1 hour',
  },
];