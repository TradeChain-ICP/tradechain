// app/role-selection/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ShoppingCart, Store, Package, TrendingUp, BarChart, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/auth-context';

export default function RoleSelectionPage() {
  const { toast } = useToast();
  const { setUserRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'buyer' | 'seller' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    if (!selectedRole) {
      toast({
        title: 'Role Required',
        description: 'Please select a role to continue.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      await setUserRole(selectedRole);
      toast({
        title: 'Welcome to TradeChain',
        description: `Your ${selectedRole} account is ready.`,
      });
    } catch (error) {
      toast({
        title: 'Setup Failed',
        description: 'There was an error setting up your account. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-gray-950">
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-5xl space-y-12">
          {/* Top Logo */}
          <header className="w-full px-6 backdrop-blur-sm">
            <Link
              href="/"
              className="text-2xl md:text-3xl font-extrabold tracking-tight text-primary hover:text-primary/90 transition-colors"
            >
              <span className="text-primary">Trade</span>
              <span className="text-foreground dark:text-foreground/80">Chain</span>
            </Link>
          </header>

          {/* Title & Subtitle */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold">Choose Your Role</h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Select how you want to participate in TradeChain’s marketplace. Don’t worry, you can
              change this anytime in your settings.
            </p>
          </div>

          {/* Role Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Buyer */}
            <Card
              className={`cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
                selectedRole === 'buyer'
                  ? 'border-primary ring-2 ring-primary/30 shadow-lg'
                  : 'hover:border-primary/50'
              }`}
              onClick={() => setSelectedRole('buyer')}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl md:text-2xl">Commodity Buyer</CardTitle>
                <CardDescription className="text-sm md:text-base">
                  Purchase commodities from verified suppliers worldwide
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  {[
                    {
                      icon: Package,
                      title: 'Browse & Purchase',
                      desc: 'Access global marketplace',
                    },
                    {
                      icon: TrendingUp,
                      title: 'Market Insights',
                      desc: 'Real-time price tracking',
                    },
                    {
                      icon: BarChart,
                      title: 'Portfolio Management',
                      desc: 'Track your investments',
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                      <div className="w-8 h-8 bg-primary/20 rounded flex items-center justify-center">
                        <item.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{item.title}</div>
                        <div className="text-xs text-muted-foreground">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t text-center">
                  <p className="text-xs text-muted-foreground">
                    Perfect for traders and procurement teams
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Seller */}
            <Card
              className={`cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
                selectedRole === 'seller'
                  ? 'border-primary ring-2 ring-primary/30 shadow-lg'
                  : 'hover:border-primary/50'
              }`}
              onClick={() => setSelectedRole('seller')}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Store className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl md:text-2xl">Commodity Seller</CardTitle>
                <CardDescription className="text-sm md:text-base">
                  List and sell your commodities to global buyers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  {[
                    {
                      icon: Package,
                      title: 'Inventory Management',
                      desc: 'List & manage stock',
                    },
                    {
                      icon: Zap,
                      title: 'Instant Settlements',
                      desc: 'Fast blockchain payments',
                    },
                    {
                      icon: BarChart,
                      title: 'Sales Analytics',
                      desc: 'Performance insights',
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                      <div className="w-8 h-8 bg-primary/20 rounded flex items-center justify-center">
                        <item.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{item.title}</div>
                        <div className="text-xs text-muted-foreground">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t text-center">
                  <p className="text-xs text-muted-foreground">
                    Ideal for producers and distributors
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Continue Button */}
          <div className="text-center">
            <Button
              onClick={handleContinue}
              disabled={!selectedRole || isLoading}
              className="px-8 py-3 text-base font-medium"
              size="lg"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  <span>Setting up account...</span>
                </div>
              ) : (
                <>
                  <span>
                    Continue as{' '}
                    {selectedRole
                      ? selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)
                      : 'User'}
                  </span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
            {selectedRole && (
              <p className="text-sm text-muted-foreground mt-4">
                You can change your role anytime in account settings
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
