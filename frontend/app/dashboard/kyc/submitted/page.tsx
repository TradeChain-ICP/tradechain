// app/dashboard/kyc/submitted/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/auth-context';
import { useContentPadding } from '@/contexts/sidebar-context';

export default function KYCSubmitted() {
  const router = useRouter();
  const { user } = useAuth();
  const { contentPadding } = useContentPadding();
  const [progress, setProgress] = useState(0);
  const [showCheckmark, setShowCheckmark] = useState(false);

  useEffect(() => {
    // First show the checkmark with animation
    const checkmarkTimer = setTimeout(() => setShowCheckmark(true), 300);

    // Then animate the progress bar
    const progressTimer = setTimeout(() => setProgress(100), 800);

    return () => {
      clearTimeout(checkmarkTimer);
      clearTimeout(progressTimer);
    };
  }, []);

  const getDashboardPath = () => {
    return user?.role === 'seller' ? '/dashboard/seller' : '/dashboard/buyer';
  };

  return (
    <div
      className={`min-h-screen bg-background flex flex-col items-center justify-center p-4 ${contentPadding}`}
    >
      <div className="mx-auto w-full max-w-md text-center">
        {/* Animated Success Icon */}
        <div className="mb-8 flex flex-col items-center">
          <div
            className={`flex h-20 w-20 items-center justify-center rounded-full bg-green-100 transition-all duration-500 ${
              showCheckmark ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
            }`}
          >
            <CheckCircle
              className={`h-10 w-10 text-green-600 transition-all duration-300 ${
                showCheckmark ? 'scale-100' : 'scale-0'
              }`}
            />
          </div>

          <div
            className={`mt-4 transition-all duration-700 delay-200 ${
              showCheckmark ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            <h1 className="text-2xl font-bold">KYC Submitted!</h1>
            <p className="mt-2 text-muted-foreground">
              Your KYC verification is being processed. We'll notify you once it's approved.
            </p>
          </div>
        </div>

        {/* Status Card */}
        <Card
          className={`transition-all duration-700 delay-400 ${
            showCheckmark ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
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
            <Button asChild className="w-full">
              <Link href={getDashboardPath()}>
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full bg-transparent">
              <Link href="/dashboard/profile">View Profile</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Security Notice */}
        <div
          className={`mt-8 text-center transition-all duration-700 delay-600 ${
            showCheckmark ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Your information is securely encrypted and will only be used for verification purposes.
            We comply with international data protection standards and will never share your
            personal data with unauthorized parties.
          </p>
        </div>
      </div>
    </div>
  );
}
