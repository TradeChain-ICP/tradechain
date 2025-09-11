// app/kyc/page.tsx
'use client';

import { useState } from 'react';
import { Upload, FileText, CheckCircle, Clock, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-context';

type KYCStep = 'personal' | 'documents' | 'verification' | 'completed';

export default function KYCPage() {
  const { toast } = useToast();
  const { user, updateKYCStatus } = useAuth();
  const [currentStep, setCurrentStep] = useState<KYCStep>('personal');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [personalInfo, setPersonalInfo] = useState({
    dateOfBirth: '',
    nationality: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  const [documents, setDocuments] = useState({
    idDocument: null as File | null,
    proofOfAddress: null as File | null,
  });

  const handleFileUpload = (type: 'idDocument' | 'proofOfAddress', file: File) => {
    setDocuments((prev) => ({ ...prev, [type]: file }));
    toast({
      title: 'File Uploaded',
      description: `${file.name} has been uploaded successfully.`,
    });
  };

  const handleSubmitKYC = async () => {
    setIsSubmitting(true);

    // Simulate KYC submission
    setTimeout(() => {
      setCurrentStep('verification');
      updateKYCStatus('in-review');
      setIsSubmitting(false);
      toast({
        title: 'KYC Submitted',
        description: 'Your verification documents have been submitted for review.',
      });
    }, 2000);
  };

  const steps = [
    { id: 'personal', label: 'Personal Info', icon: FileText },
    { id: 'documents', label: 'Documents', icon: Upload },
    { id: 'verification', label: 'Verification', icon: Clock },
  ];

  const getStepStatus = (stepId: string) => {
    const stepIndex = steps.findIndex((s) => s.id === stepId);
    const currentIndex = steps.findIndex((s) => s.id === currentStep);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  const countries = [
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
    { value: 'au', label: 'Australia' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
    { value: 'jp', label: 'Japan' },
  ];

  return (
    <DashboardLayout userRole={user?.role || 'buyer'}>
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <Link
          href="/profile"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to profile
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">KYC Verification</h1>
          <p className="text-muted-foreground">
            Complete your identity verification to unlock full trading features
          </p>
        </div>

        {/* Progress Steps */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const status = getStepStatus(step.id);
                const Icon = step.icon;

                return (
                  <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          status === 'completed'
                            ? 'bg-primary text-primary-foreground'
                            : status === 'current'
                            ? 'bg-primary/20 text-primary border-2 border-primary'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {status === 'completed' ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </div>
                      <span
                        className={`text-sm mt-2 ${
                          status === 'current'
                            ? 'text-primary font-medium'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-16 h-0.5 mx-4 ${
                          status === 'completed' ? 'bg-primary' : 'bg-muted'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        {currentStep === 'personal' && (
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Please provide your personal details for identity verification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={personalInfo.dateOfBirth}
                    onChange={(e) =>
                      setPersonalInfo((prev) => ({ ...prev, dateOfBirth: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality</Label>
                  <select
                    value={personalInfo.nationality}
                    onChange={(e) =>
                      setPersonalInfo((prev) => ({ ...prev, nationality: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  >
                    <option value="">Select nationality</option>
                    {countries.map((country) => (
                      <option key={country.value} value={country.value}>
                        {country.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={personalInfo.address}
                  onChange={(e) =>
                    setPersonalInfo((prev) => ({ ...prev, address: e.target.value }))
                  }
                  placeholder="Street address"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={personalInfo.city}
                    onChange={(e) => setPersonalInfo((prev) => ({ ...prev, city: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    value={personalInfo.postalCode}
                    onChange={(e) =>
                      setPersonalInfo((prev) => ({ ...prev, postalCode: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <select
                    value={personalInfo.country}
                    onChange={(e) =>
                      setPersonalInfo((prev) => ({ ...prev, country: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  >
                    <option value="">Select country</option>
                    {countries.map((country) => (
                      <option key={country.value} value={country.value}>
                        {country.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={() => setCurrentStep('documents')}>Next: Upload Documents</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 'documents' && (
          <Card>
            <CardHeader>
              <CardTitle>Document Upload</CardTitle>
              <CardDescription>
                Upload the required documents for identity verification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* ID Document */}
              <div className="space-y-3">
                <Label>Government-issued ID</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload your passport, driver's license, or national ID
                  </p>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload('idDocument', file);
                    }}
                    className="hidden"
                    id="id-upload"
                  />
                  <Button variant="outline" asChild>
                    <label htmlFor="id-upload" className="cursor-pointer">
                      Choose File
                    </label>
                  </Button>
                  {documents.idDocument && (
                    <p className="text-sm text-primary mt-2">✓ {documents.idDocument.name}</p>
                  )}
                </div>
              </div>

              {/* Proof of Address */}
              <div className="space-y-3">
                <Label>Proof of Address</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload a utility bill or bank statement (last 3 months)
                  </p>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload('proofOfAddress', file);
                    }}
                    className="hidden"
                    id="address-upload"
                  />
                  <Button variant="outline" asChild>
                    <label htmlFor="address-upload" className="cursor-pointer">
                      Choose File
                    </label>
                  </Button>
                  {documents.proofOfAddress && (
                    <p className="text-sm text-primary mt-2">✓ {documents.proofOfAddress.name}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setCurrentStep('personal')}>
                  Back
                </Button>
                <Button
                  onClick={handleSubmitKYC}
                  disabled={!documents.idDocument || !documents.proofOfAddress || isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 'verification' && (
          <Card>
            <CardHeader>
              <CardTitle>Verification in Progress</CardTitle>
              <CardDescription>Your documents are being reviewed by our team</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-primary" />
              </div>

              <h3 className="text-lg font-semibold mb-2">Verification Submitted</h3>
              <p className="text-muted-foreground mb-6">
                We'll review your documents within 1-2 business days and notify you once
                verification is complete.
              </p>

              <div className="bg-muted/50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center gap-2 text-sm">
                  <AlertCircle className="w-4 h-4 text-muted-foreground" />
                  <span>You can continue using the platform with limited features</span>
                </div>
              </div>

              <Button variant="outline" asChild>
                <Link href="/profile">Return to Profile</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
