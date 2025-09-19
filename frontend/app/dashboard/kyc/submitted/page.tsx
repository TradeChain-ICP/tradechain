// app/dashboard/kyc/submitted/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, ArrowRight, Clock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-context';
import { useContentPadding } from '@/contexts/sidebar-context';

export default function KYCSubmittedPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { contentPadding } = useContentPadding();
  const [progress, setProgress] = useState(0);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [shouldRedirect, setShouldRedirect] = useState<string | null>(null);

  // FIXED: Separate effect for routing decisions
  useEffect(() => {
    if (!user) return;

    // Check if user should be redirected based on KYC status
    if (user.kycStatus === 'completed') {
      setShouldRedirect('/dashboard/profile');
    } else if (user.kycStatus !== 'inReview') {
      setShouldRedirect('/dashboard/kyc');
    }
  }, [user]);

  // FIXED: Separate effect for actual navigation
  useEffect(() => {
    if (shouldRedirect) {
      // Use setTimeout to prevent "setState during render" error
      const redirectTimer = setTimeout(() => {
        router.push(shouldRedirect);
      }, 100);

      return () => clearTimeout(redirectTimer);
    }
  }, [shouldRedirect, router]);

  // Animation and auto-redirect effects
  useEffect(() => {
    // Only run animations if we're staying on this page
    if (shouldRedirect || !user || user.kycStatus !== 'inReview') {
      return;
    }

    // Animation sequence
    const checkmarkTimer = setTimeout(() => setShowCheckmark(true), 300);
    const progressTimer = setTimeout(() => setProgress(100), 800);

    // Auto redirect countdown (only if staying on page)
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          const dashboardPath = user?.role ? `/dashboard/${user.role}` : '/dashboard';
          router.push(dashboardPath);
          return 0;
        }
        return prev - 1;
      });
    }, 1000); // Changed from 3000 to 1000 for proper 1-second countdown

    return () => {
      clearTimeout(checkmarkTimer);
      clearTimeout(progressTimer);
      clearInterval(countdownInterval);
    };
  }, [user, router, shouldRedirect]);

  // Don't render anything if we're redirecting
  if (shouldRedirect) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't render if user data isn't loaded yet
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getDashboardPath = () => {
    return user?.role ? `/dashboard/${user.role}` : '/dashboard';
  };

  return (
    <div className={`min-h-screen bg-background py-8 ${contentPadding}`}>
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Back Button */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="hover:bg-transparent p-0"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Main Content */}
        <Card className="border-2">
          <CardHeader className="text-center pb-6">
            {/* Animated Checkmark */}
            <div
              className={`flex justify-center mb-6 transition-all duration-500 ${
                showCheckmark ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
              }`}
            >
              <div className="relative">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
                <div className="absolute inset-0 w-20 h-20 border-4 border-green-200 rounded-full animate-ping"></div>
              </div>
            </div>

            <div
              className={`transition-all duration-700 delay-200 ${
                showCheckmark ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
            >
              <CardTitle className="text-2xl mb-2 text-green-600">
                KYC Verification Submitted!
              </CardTitle>
              <p className="text-muted-foreground">
                Your identity verification is being processed. We'll notify you once it's complete.
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Progress Section */}
            <div
              className={`transition-all duration-700 delay-400 ${
                showCheckmark ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Verification Progress</span>
                  <Badge variant="outline">Processing</Badge>
                </div>
                <Progress value={progress} className="h-3" />
                <p className="text-xs text-muted-foreground text-center">
                  Estimated completion: 1-2 business days
                </p>
              </div>
            </div>

            {/* Status Timeline */}
            <div
              className={`transition-all duration-700 delay-600 ${
                showCheckmark ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
            >
              <div className="space-y-3">
                <h3 className="font-medium text-center mb-4">What happens next:</h3>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <div className="text-sm">
                      <div className="font-medium text-green-700">Documents Received</div>
                      <div className="text-green-600">
                        Your documents have been uploaded successfully
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                    <Clock className="h-4 w-4 text-blue-600 flex-shrink-0" />
                    <div className="text-sm">
                      <div className="font-medium text-blue-700">Under Review</div>
                      <div className="text-blue-600">Our team is verifying your information</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <div className="text-sm">
                      <div className="font-medium text-gray-700">Approval & Notification</div>
                      <div className="text-gray-600">You'll receive confirmation when complete</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reference Information */}
            <div
              className={`transition-all duration-700 delay-800 ${
                showCheckmark ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
            >
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Reference ID:</span>
                    <div className="font-mono text-xs mt-1">
                      KYC-{user?.id?.slice(-8)?.toUpperCase() || 'XXXXXXXX'}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <div className="mt-1">
                      <Badge variant="secondary">In Review</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div
              className={`flex flex-col sm:flex-row gap-3 transition-all duration-700 delay-1000 ${
                showCheckmark ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
            >
              <Button asChild className="flex-1">
                <Link href={getDashboardPath()}>
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button variant="outline" asChild className="flex-1 bg-transparent">
                <Link href="/dashboard/profile">View Profile</Link>
              </Button>
            </div>

            {/* Auto Redirect Notice */}
            <div
              className={`text-center transition-all duration-700 delay-1200 ${
                showCheckmark ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
            >
              <p className="text-xs text-muted-foreground">
                Redirecting to dashboard in {countdown} seconds...
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div
          className={`text-center max-w-lg mx-auto transition-all duration-700 delay-1400 ${
            showCheckmark ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <p className="text-xs text-muted-foreground">
            Your information is encrypted and stored securely. We'll email you updates at{' '}
            <span className="font-medium">{user?.email}</span>
          </p>
        </div>
      </div>
    </div>
  );
}