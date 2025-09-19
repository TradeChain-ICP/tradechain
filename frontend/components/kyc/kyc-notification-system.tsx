// components/kyc/kyc-notification-system.tsx
// Complete KYC notification system with banner and floating elements
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Shield,
  X,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  ChevronRight,
  Bell,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/components/ui/use-toast';

interface KYCNotificationSystemProps {
  className?: string;
}

export function KYCNotificationSystem({ className = '' }: KYCNotificationSystemProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [showBanner, setShowBanner] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [hasShownToast, setHasShownToast] = useState(false);

  // Determine if user needs KYC completion
  const needsKYC = user && user.kycStatus !== 'completed' && user.kycStatus !== 'inReview';
  const kycInReview = user && user.kycStatus === 'inReview';

  // Show different notifications based on KYC status
  useEffect(() => {
    if (!user || hasShownToast) return;

    // Show toast notification when user first loads dashboard
    if (needsKYC) {
      const timer = setTimeout(() => {
        toast({
          title: 'Complete Your Verification',
          description: 'Complete KYC verification to unlock all trading features.',
          action: (
            <Button size="sm" onClick={() => router.push('/dashboard/kyc')}>
              Verify Now
            </Button>
          ),
          duration: 6000,
        });
        setHasShownToast(true);
      }, 2000);

      return () => clearTimeout(timer);
    } else if (kycInReview && !hasShownToast) {
      const timer = setTimeout(() => {
        toast({
          title: 'Verification In Progress',
          description: 'Your KYC verification is being reviewed. You will be notified once complete.',
          duration: 4000,
        });
        setHasShownToast(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [user, needsKYC, kycInReview, hasShownToast, toast, router]);

  // Show modal after some time if KYC is still not started
  useEffect(() => {
    if (!needsKYC || user?.kycStatus !== 'pending') return;

    const modalTimer = setTimeout(() => {
      setShowModal(true);
    }, 10000); // Show modal after 10 seconds

    return () => clearTimeout(modalTimer);
  }, [needsKYC, user?.kycStatus]);

  // Don't render anything if user is verified or doesn't exist
  if (!user || user.kycStatus === 'completed') {
    return null;
  }

  const getStatusInfo = () => {
    switch (user.kycStatus) {
      case 'pending':
        return {
          icon: <AlertTriangle className="h-5 w-5 text-amber-600" />,
          title: 'Verification Required',
          description: 'Complete your KYC verification to unlock all features',
          buttonText: 'Start Verification',
          buttonHref: '/dashboard/kyc',
          bannerColor: 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950',
          progress: 0,
        };
      case 'inReview':
        return {
          icon: <Clock className="h-5 w-5 text-blue-600" />,
          title: 'Verification In Review',
          description: 'Your documents are being reviewed. This usually takes 1-2 business days.',
          buttonText: 'View Status',
          buttonHref: '/dashboard/kyc/submitted',
          bannerColor: 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950',
          progress: 75,
        };
      case 'rejected':
        return {
          icon: <X className="h-5 w-5 text-red-600" />,
          title: 'Verification Needs Attention',
          description: 'Please review and resubmit your verification documents',
          buttonText: 'Fix Issues',
          buttonHref: '/dashboard/kyc',
          bannerColor: 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950',
          progress: 25,
        };
      default:
        return null;
    }
  };

  const statusInfo = getStatusInfo();
  if (!statusInfo) return null;

  return (
    <>
      {/* Animated Banner Notification */}
      {showBanner && (
        <div className={`w-full ${className}`}>
          <div
            className={`animate-fade-in-down border rounded-lg p-4 mb-4 ${statusInfo.bannerColor} transition-all duration-300 hover:shadow-md`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="animate-pulse">{statusInfo.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm">{statusInfo.title}</h3>
                    <Badge variant="outline" className="text-xs">
                      {user.kycStatus === 'pending' && 'Action Required'}
                      {user.kycStatus === 'inReview' && 'In Progress'}
                      {user.kycStatus === 'rejected' && 'Needs Fix'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{statusInfo.description}</p>
                  <Progress value={statusInfo.progress} className="h-1.5 w-full max-w-xs" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" asChild className="animate-pulse">
                  <Link href={statusInfo.buttonHref}>
                    {statusInfo.buttonText}
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBanner(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button for Mobile */}
      {!showBanner && needsKYC && (
        <div className="fixed bottom-4 right-4 z-50 md:hidden">
          <Button
            onClick={() => router.push(statusInfo.buttonHref)}
            className="rounded-full h-14 w-14 shadow-lg animate-bounce"
          >
            <Shield className="h-6 w-6" />
          </Button>
        </div>
      )}

      {/* Modal Popup for Persistent Notification */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center pb-4">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-8 w-8 text-primary animate-pulse" />
            </div>
            <DialogTitle className="text-xl">Secure Your Account</DialogTitle>
            <DialogDescription className="text-base">
              Complete your identity verification to unlock all TradeChain features and start trading
              with confidence.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-lg border p-4 bg-muted/50">
              <h4 className="font-medium mb-2">What you'll get:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Full access to commodity marketplace
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Higher transaction limits
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  AI-powered trading insights
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Secure escrow protection
                </li>
              </ul>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mx-auto mb-1" />
              Takes only 3-5 minutes to complete
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowModal(false)} className="bg-transparent">
              Maybe Later
            </Button>
            <Button onClick={() => router.push('/dashboard/kyc')} className="flex-1">
              <FileText className="mr-2 h-4 w-4" />
              Start Verification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sidebar Quick Action (for desktop) */}
      {needsKYC && (
        <div className="hidden md:block fixed top-1/2 right-0 -translate-y-1/2 z-40">
          <Button
            onClick={() => setShowModal(true)}
            variant="outline"
            className="rounded-l-lg rounded-r-none border-r-0 bg-background/95 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 h-12 px-3"
          >
            <div className="flex items-center gap-2">
              <div className="relative">
                <Bell className="h-4 w-4" />
                <div className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full animate-ping"></div>
              </div>
              <span className="text-xs font-medium">KYC</span>
            </div>
          </Button>
        </div>
      )}
    </>
  );
}

// Compact version for header
export function KYCHeaderNotification() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user || user.kycStatus === 'completed') {
    return null;
  }

  const getStatusBadge = () => {
    switch (user.kycStatus) {
      case 'pending':
        return (
          <Badge variant="destructive" className="animate-pulse">
            Verification Required
          </Badge>
        );
      case 'inReview':
        return (
          <Badge variant="secondary" className="animate-pulse">
            Under Review
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive" className="animate-pulse">
            Action Needed
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Button
      onClick={() => router.push('/dashboard/kyc')}
      variant="ghost"
      size="sm"
      className="gap-2 hover:bg-primary/10"
    >
      <Shield className="h-4 w-4" />
      {getStatusBadge()}
      <ChevronRight className="h-3 w-3" />
    </Button>
  );
}

// Progress indicator component
export function KYCProgressIndicator() {
  const { user } = useAuth();

  if (!user || user.kycStatus === 'completed') {
    return null;
  }

  const getProgress = () => {
    switch (user.kycStatus) {
      case 'pending':
        return { value: 0, label: 'Not Started' };
      case 'inReview':
        return { value: 75, label: 'Under Review' };
      case 'rejected':
        return { value: 25, label: 'Needs Attention' };
      default:
        return { value: 0, label: 'Unknown' };
    }
  };

  const progress = getProgress();

  return (
    <div className="w-full max-w-sm">
      <div className="flex items-center justify-between text-sm mb-2">
        <span className="font-medium">KYC Verification</span>
        <span className="text-muted-foreground">{progress.label}</span>
      </div>
      <Progress value={progress.value} className="h-2" />
    </div>
  );
}