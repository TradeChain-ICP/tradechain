// app/dashboard/help/page.tsx
"use client"

import { useState } from "react"
import {
  Search,
  MessageCircle,
  ExternalLink,
  ChevronDown,
  BookOpen,
  Shield,
  Users,
  CreditCard,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useToast } from "@/components/ui/use-toast"
import { useContentPadding } from "@/contexts/sidebar-context"

export default function HelpPage() {
  const { toast } = useToast()
  const { contentPadding } = useContentPadding()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredFAQs = quickFAQs.filter((faq) =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "chat":
        toast({
          title: "Live Chat",
          description: "Opening live chat...",
        })
        break
      case "full-support":
        window.open("/support", "_blank")
        break
      case "documentation":
        toast({
          title: "Documentation",
          description: "Opening documentation...",
        })
        break
    }
  }

  return (
    <div className={`py-6 pb-20 lg:pb-8 ${contentPadding}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight mb-2">Quick Help</h1>
        <p className="text-muted-foreground max-w-lg mx-auto text-sm lg:text-base">
          Find quick answers or access our full support resources
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card 
          className="cursor-pointer hover:shadow-md transition-all hover:scale-[1.02] group border-2 hover:border-primary/20"
          onClick={() => handleQuickAction("chat")}
        >
          <CardContent className="p-4 lg:p-5 text-center">
            <div className="mx-auto mb-3 p-2 bg-primary/10 rounded-lg w-fit group-hover:bg-primary/20 transition-colors">
              <MessageCircle className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-semibold text-sm lg:text-base mb-1">Live Chat</h3>
            <p className="text-xs lg:text-sm text-muted-foreground mb-2">Quick support</p>
            <Badge variant="default" className="bg-green-500 text-xs">Online</Badge>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-all hover:scale-[1.02] group border-2 hover:border-blue-500/20"
          onClick={() => handleQuickAction("full-support")}
        >
          <CardContent className="p-4 lg:p-5 text-center">
            <div className="mx-auto mb-3 p-2 bg-blue-50 rounded-lg w-fit group-hover:bg-blue-100 transition-colors">
              <ExternalLink className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-sm lg:text-base mb-1">Full Support</h3>
            <p className="text-xs lg:text-sm text-muted-foreground mb-2">Complete help center</p>
            <Badge variant="outline" className="text-xs">Visit Page</Badge>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-all hover:scale-[1.02] group border-2 hover:border-purple-500/20 sm:col-span-2 lg:col-span-1"
          onClick={() => handleQuickAction("documentation")}
        >
          <CardContent className="p-4 lg:p-5 text-center">
            <div className="mx-auto mb-3 p-2 bg-purple-50 rounded-lg w-fit group-hover:bg-purple-100 transition-colors">
              <BookOpen className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-sm lg:text-base mb-1">Documentation</h3>
            <p className="text-xs lg:text-sm text-muted-foreground mb-2">API & guides</p>
            <Badge variant="outline" className="text-xs">Learn More</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Quick FAQ Search */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Quick FAQ Search</CardTitle>
          <CardDescription className="text-sm">Find answers to common dashboard questions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search FAQ..."
              className="pl-10 text-sm lg:text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.slice(0, 6).map((faq) => (
                <Collapsible key={faq.id}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-3 text-left border rounded-lg hover:bg-muted/50 transition-colors group">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="p-1.5 bg-primary/10 rounded-md mt-0.5 flex-shrink-0">
                        <faq.icon className="h-3 w-3 text-primary" />
                      </div>
                      <span className="font-medium text-sm lg:text-base pr-2">{faq.question}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180 flex-shrink-0" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-3 pb-3">
                    <div className="pt-3 pl-8 border-t ml-3">
                      <p className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
                      {faq.actionText && (
                        <Button variant="outline" size="sm" className="mt-3 text-xs h-8">
                          {faq.actionText}
                        </Button>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))
            ) : (
              <div className="text-center py-6">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No results found. Try different keywords.</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSearchQuery("")}
                  className="mt-2 text-xs"
                >
                  Clear Search
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Help Categories - Compact Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {helpCategories.map((category) => (
          <Card key={category.id} className="hover:shadow-sm transition-shadow cursor-pointer group">
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <category.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium text-sm">{category.name}</h3>
                  <p className="text-xs text-muted-foreground">{category.count} articles</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contact Support CTA */}
      <Card className="mt-6 border-dashed border-2 border-muted-foreground/20">
        <CardContent className="p-6 text-center">
          <h3 className="font-semibold mb-2 text-sm lg:text-base">Need More Help?</h3>
          <p className="text-muted-foreground text-xs lg:text-sm mb-4">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button 
              size="sm" 
              onClick={() => handleQuickAction("chat")}
              className="text-xs lg:text-sm"
            >
              Start Live Chat
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleQuickAction("full-support")}
              className="text-xs lg:text-sm bg-transparent"
            >
              Visit Support Center
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Minimal data for dashboard help
const quickFAQs = [
  {
    id: '1',
    question: 'How do I navigate the dashboard?',
    answer: 'Use the sidebar menu to access different sections. On mobile, tap the menu button to open the navigation drawer. Your main overview is on the home page.',
    icon: Users,
    actionText: 'Take Tour',
  },
  {
    id: '2',
    question: 'How to place my first order?',
    answer: 'Go to Marketplace, browse products, click on an item you want to buy, and follow the checkout process. Make sure your payment method is set up first.',
    icon: CreditCard,
    actionText: 'Go to Marketplace',
  },
  {
    id: '3',
    question: 'Where can I see my trading history?',
    answer: 'Your complete trading history is available in the Orders section. You can filter by date, status, or transaction type to find specific trades.',
    icon: BookOpen,
    actionText: 'View Orders',
  },
  {
    id: '4',
    question: 'How do I update my profile?',
    answer: 'Click on your profile picture in the top right corner, then select Settings. You can update personal information, payment methods, and security settings.',
    icon: Users,
    actionText: 'Go to Settings',
  },
  {
    id: '5',
    question: 'What if my payment fails?',
    answer: 'Check your payment method details in Settings. Ensure your card has sufficient funds and isn\'t expired. Contact support if the issue persists.',
    icon: CreditCard,
    actionText: 'Check Payment Methods',
  },
  {
    id: '6',
    question: 'How do I enable notifications?',
    answer: 'Go to Settings > Notifications to customize your alert preferences. You can choose email, SMS, or push notifications for different types of updates.',
    icon: Shield,
    actionText: 'Notification Settings',
  },
]

const helpCategories = [
  {
    id: 'getting-started',
    name: 'Getting Started',
    icon: Users,
    count: 8,
  },
  {
    id: 'orders',
    name: 'Orders & Trading',
    icon: CreditCard,
    count: 12,
  },
  {
    id: 'account',
    name: 'Account Settings',
    icon: Shield,
    count: 6,
  },
  {
    id: 'guides',
    name: 'User Guides',
    icon: BookOpen,
    count: 15,
  },
]