// app/role-selection/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  ShoppingCart,
  Store,
  Package,
  TrendingUp,
  BarChart,
  Zap,
} from 'lucide-react';
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
    <div className="min-h-screen bg-background dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <Link
          href="/connect"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to connect
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Role</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select how you want to participate in TradeChain's marketplace. You can change this
            anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Buyer Card */}
          <Card
            className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
              selectedRole === 'buyer'
                ? 'border-primary ring-2 ring-primary/20 shadow-lg'
                : 'hover:border-primary/50'
            }`}
            onClick={() => setSelectedRole('buyer')}
          >
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Commodity Buyer</CardTitle>
              <CardDescription className="text-base">
                Purchase commodities from verified suppliers worldwide
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid gap-3">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-8 h-8 bg-primary/20 rounded flex items-center justify-center">
                    <Package className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Browse & Purchase</div>
                    <div className="text-xs text-muted-foreground">Access global marketplace</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-8 h-8 bg-primary/20 rounded flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Market Insights</div>
                    <div className="text-xs text-muted-foreground">Real-time price tracking</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-8 h-8 bg-primary/20 rounded flex items-center justify-center">
                    <BarChart className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Portfolio Management</div>
                    <div className="text-xs text-muted-foreground">Track your investments</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t text-center">
                <p className="text-xs text-muted-foreground">
                  Perfect for traders and procurement teams
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Seller Card */}
          <Card
            className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
              selectedRole === 'seller'
                ? 'border-primary ring-2 ring-primary/20 shadow-lg'
                : 'hover:border-primary/50'
            }`}
            onClick={() => setSelectedRole('seller')}
          >
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Store className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Commodity Seller</CardTitle>
              <CardDescription className="text-base">
                List and sell your commodities to global buyers
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid gap-3">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-8 h-8 bg-primary/20 rounded flex items-center justify-center">
                    <Package className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Inventory Management</div>
                    <div className="text-xs text-muted-foreground">List & manage stock</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-8 h-8 bg-primary/20 rounded flex items-center justify-center">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Instant Settlements</div>
                    <div className="text-xs text-muted-foreground">Fast blockchain payments</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-8 h-8 bg-primary/20 rounded flex items-center justify-center">
                    <BarChart className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Sales Analytics</div>
                    <div className="text-xs text-muted-foreground">Performance insights</div>
                  </div>
                </div>
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
    </div>
  );
}
