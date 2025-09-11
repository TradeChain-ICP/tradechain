'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Shield, Wallet, Info, Lock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/auth-context';

export default function ConnectPage() {
  const { toast } = useToast();
  const { connectWallet } = useAuth();

  const [isConnecting, setIsConnecting] = useState(false);
  const [connectingWith, setConnectingWith] = useState<'nfid' | 'internet-identity' | null>(null);

  const handleConnect = async (method: 'nfid' | 'internet-identity') => {
    setIsConnecting(true);
    setConnectingWith(method);
    try {
      await connectWallet(method);
      toast({
        title: 'Connected Successfully',
        description: `Connected with ${method === 'nfid' ? 'NFID' : 'Internet Identity'}`,
      });
      // You can navigate here if needed
      // router.push('/dashboard')
    } catch (error) {
      toast({
        title: 'Connection Failed',
        description: `Failed to connect with ${
          method === 'nfid' ? 'NFID' : 'Internet Identity'
        }. Please try again.`,
        variant: 'destructive',
      });
    } finally {
      setIsConnecting(false);
      setConnectingWith(null);
    }
  };

  return (
    <div className="container relative min-h-screen w-full grid flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* Left visual panel (matches Login page) */}
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900">
          <Image
            src="/images/auth-background.jpeg"
            fill
            alt="Authentication background"
            className="object-cover opacity-30"
          />
        </div>
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Image
            src="/images/tradechain-logo.png"
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
              "TradeChain has revolutionized how I trade commodities. The platform is secure,
              transparent, and incredibly easy to use."
            </p>
            <footer className="text-sm">Peter Wilson, Gold Trader</footer>
          </blockquote>
        </div>
      </div>

      {/* Right panel – now TABBED like the Login page */}
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[380px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Sign in to your account to continue</p>
          </div>

          <Tabs defaultValue="nfid" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="nfid">NFID Wallet</TabsTrigger>
              <TabsTrigger value="internet-identity">Internet Identity</TabsTrigger>
            </TabsList>

            {/* NFID TAB */}
            <TabsContent value="nfid">
              <Card className="border-2 border-primary/20">
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                    <Wallet className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">NFID Wallet</CardTitle>
                  <CardDescription className="text-center">
                    User‑friendly Web3 wallet with email recovery
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="space-y-2">
                        <p className="font-semibold text-primary">Recommended for beginners</p>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                            <span>Email‑based recovery system</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                            <span>Built‑in ICP wallet integration</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                            <span>Biometric authentication</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handleConnect('nfid')}
                    disabled={isConnecting}
                    className="w-full h-12 text-base font-semibold"
                    size="lg"
                  >
                    {connectingWith === 'nfid' ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                        Connecting…
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2">
                        <Wallet className="h-5 w-5" />
                        Connect with NFID
                      </span>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* INTERNET IDENTITY TAB */}
            <TabsContent value="internet-identity">
              <Card className="border-2">
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                    <Shield className="h-8 w-8 text-foreground" />
                  </div>
                  <CardTitle className="text-xl">Internet Identity</CardTitle>
                  <CardDescription className="text-center">
                    Native ICP authentication system
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg bg-muted p-4">
                    <div className="flex items-start gap-3">
                      <Lock className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="space-y-2">
                        <p className="font-semibold">For advanced users</p>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />
                            <span>Anonymous and private</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />
                            <span>Supports hardware security keys</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />
                            <span>No personal data required</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handleConnect('internet-identity')}
                    disabled={isConnecting}
                    variant="outline"
                    className="w-full h-12 text-base font-semibold border-2"
                    size="lg"
                  >
                    {connectingWith === 'internet-identity' ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                        Connecting…
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Connect with Internet Identity
                      </span>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Footer */}
          <p className="text-sm text-muted-foreground whitespace-nowrap">
            By connecting, you agree to our{' '}
            <Link href="/terms" className="text-primary hover:underline underline-offset-2">
              Terms
            </Link>{' '}
            &{' '}
            <Link href="/privacy" className="text-primary hover:underline underline-offset-2">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
