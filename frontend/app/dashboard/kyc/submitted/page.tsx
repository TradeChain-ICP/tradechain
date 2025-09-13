// app/dashboard/kyc/submitted/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, ArrowRight, Clock, Shield, FileText, Bell, ArrowLeft } from 'lucide-react';

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
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/auth-context';
import { useContentPadding } from '@/contexts/sidebar-context';

export default function KYCSubmittedPage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const { contentPadding } = useContentPadding();
  const [progress, setProgress] = useState(0);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<'submitted' | 'processing' | 'review'>(
    'submitted'
  );

  useEffect(() => {
    // Redirect if user hasn't submitted KYC
    if (user && user.kycStatus !== 'inReview') {
      if (user.kycStatus === 'completed') {
        router.push('/dashboard/profile');
      } else {
        router.push('/dashboard/kyc');
      }
      return;
    }

    // Animation sequence
    const checkmarkTimer = setTimeout(() => setShowCheckmark(true), 300);
    const progressTimer = setTimeout(() => setProgress(100), 800);

    // Simulate status updates
    const statusTimer = setTimeout(() => setCurrentStatus('processing'), 2000);
    const reviewTimer = setTimeout(() => setCurrentStatus('review'), 4000);

    return () => {
      clearTimeout(checkmarkTimer);
      clearTimeout(progressTimer);
      clearTimeout(statusTimer);
      clearTimeout(reviewTimer);
    };
  }, [user, router]);

  const getDashboardPath = () => {
    return user?.role === 'seller' ? '/dashboard/seller' : '/dashboard/buyer';
  };

  const getStatusInfo = () => {
    switch (currentStatus) {
      case 'submitted':
        return {
          title: 'Verification Submitted',
          description: 'Your documents have been successfully uploaded',
          color: 'bg-blue-100 text-blue-600',
          progress: 33,
        };
      case 'processing':
        return {
          title: 'Processing Documents',
          description: 'Our AI systems are validating your documents',
          color: 'bg-yellow-100 text-yellow-600',
          progress: 66,
        };
      case 'review':
        return {
          title: 'Under Human Review',
          description: 'Our compliance team is reviewing your submission',
          color: 'bg-green-100 text-green-600',
          progress: 100,
        };
      default:
        return {
          title: 'Processing',
          description: 'Please wait...',
          color: 'bg-gray-100 text-gray-600',
          progress: 0,
        };
    }
  };

  const statusInfo = getStatusInfo();

  const expectedTimeframes = [
    {
      status: 'Document Validation',
      timeframe: 'Immediate',
      description: 'AI-powered document verification',
      completed: true,
    },
    {
      status: 'Identity Verification',
      timeframe: '2-4 hours',
      description: 'Cross-referencing with official databases',
      completed: currentStatus === 'review',
    },
    {
      status: 'Compliance Review',
      timeframe: '1-2 business days',
      description: 'Manual review by compliance specialists',
      completed: false,
    },
    {
      status: 'Final Approval',
      timeframe: 'Within 24 hours',
      description: 'Account activation and notification',
      completed: false,
    },
  ];

  return (
    <div className={`min-h-screen bg-background py-8 ${contentPadding}`}>
      <div className="max-w-4xl mx-auto space-y-8">
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

        {/* Main Status Card */}
        <div className="text-center">
          <div
            className={`flex flex-col items-center transition-all duration-500 ${
              showCheckmark ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
            }`}
          >
            <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>

            <div
              className={`transition-all duration-700 delay-200 ${
                showCheckmark ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
            >
              <h1 className="text-3xl font-bold mb-2">KYC Verification Submitted!</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Your identity verification is being processed. We'll notify you once it's complete.
              </p>
            </div>
          </div>
        </div>

        {/* Status Progress Card */}
        <Card
          className={`transition-all duration-700 delay-400 ${
            showCheckmark ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <div className={`w-3 h-3 rounded-full ${statusInfo.color}`}></div>
              Current Status: {statusInfo.title}
            </CardTitle>
            <CardDescription>{statusInfo.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Verification Progress</span>
                  <span className="font-medium">{statusInfo.progress}% Complete</span>
                </div>
                <Progress value={statusInfo.progress} className="h-3" />
                <p className="text-xs text-muted-foreground text-center">
                  Estimated completion: 1-2 business days
                </p>
              </div>

              {/* Timeline */}
              <div className="space-y-4">
                <h3 className="font-semibold text-center">Verification Timeline</h3>
                <div className="space-y-3">
                  {expectedTimeframes.map((step, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 rounded-lg border">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step.completed
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Clock className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm">{step.status}</p>
                          <Badge variant="outline" className="text-xs">
                            {step.timeframe}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Information Cards */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-700 delay-600 ${
            showCheckmark ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          {/* What Happens Next */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5" />
                What Happens Next?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-sm">Document Processing</p>
                    <p className="text-xs text-muted-foreground">
                      AI systems validate document authenticity and extract information
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-sm">Identity Verification</p>
                    <p className="text-xs text-muted-foreground">
                      Cross-reference with government databases and sanctions lists
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-sm">Compliance Review</p>
                    <p className="text-xs text-muted-foreground">
                      Manual review by certified compliance specialists
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-bold">
                    4
                  </div>
                  <div>
                    <p className="font-medium text-sm">Account Activation</p>
                    <p className="text-xs text-muted-foreground">
                      Instant notification and full platform access
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submission Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5" />
                Submission Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Reference ID:</span>
                  <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                    KYC-{user?.id?.slice(-8)?.toUpperCase() || 'XXXXXXXX'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Submitted:</span>
                  <span className="text-sm font-medium">
                    {user?.kycSubmittedAt
                      ? new Date(user.kycSubmittedAt).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : new Date().toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Priority:</span>
                  <Badge variant="secondary">Standard</Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">User Type:</span>
                  <Badge variant="outline" className="capitalize">
                    {user?.role || 'Buyer'}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="text-sm font-medium">Documents Submitted:</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>Government-issued ID (Front & Back)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>Selfie with ID</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>Proof of Address</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notification Preferences */}
        <Card
          className={`transition-all duration-700 delay-800 ${
            showCheckmark ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Preferences
            </CardTitle>
            <CardDescription>We'll keep you updated on your verification progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-sm">You will receive updates via:</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">In-app notifications</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Email updates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Dashboard status updates</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-sm">Expected notifications:</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Document processing complete</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Under compliance review</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Verification approved/completed</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Information Alert */}
        <Alert
          className={`transition-all duration-700 delay-1000 ${
            showCheckmark ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Important:</strong> While your verification is being processed, you can still
            explore the platform with limited access. Full trading functionality will be unlocked
            once verification is complete. If you need to update any information, please contact our
            support team.
          </AlertDescription>
        </Alert>

        {/* Action Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-1200 ${
            showCheckmark ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <Button asChild size="lg" className="min-w-[200px]">
            <Link href={getDashboardPath()}>
              <ArrowRight className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Link>
          </Button>

          <Button variant="outline" asChild size="lg" className="min-w-[200px] bg-transparent">
            <Link href="/dashboard/profile">View Profile</Link>
          </Button>

          <Button variant="outline" asChild size="lg" className="min-w-[200px] bg-transparent">
            <Link href="/help/kyc">KYC Help Center</Link>
          </Button>
        </div>

        {/* Footer Information */}
        <div
          className={`text-center space-y-4 transition-all duration-700 delay-1400 ${
            showCheckmark ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <Separator />

          <div className="max-w-3xl mx-auto space-y-2">
            <p className="text-sm text-muted-foreground">
              <strong>Security Notice:</strong> Your information is encrypted and stored securely in
              compliance with international data protection standards (GDPR, CCPA). We use
              bank-level security measures and never share your data with unauthorized parties.
            </p>

            <p className="text-sm text-muted-foreground">
              Questions about your verification? Contact our support team at{' '}
              <Link href="mailto:kyc@tradechain.com" className="text-primary hover:underline">
                kyc@tradechain.com
              </Link>{' '}
              or visit our{' '}
              <Link href="/help" className="text-primary hover:underline">
                Help Center
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}