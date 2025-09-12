// app/dashboard/kyc/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, Upload, FileText, Camera, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-context';
import { useContentPadding } from '@/contexts/sidebar-context';

export default function KYCVerificationPage() {
  const { toast } = useToast();
  const { user, updateKYCStatus } = useAuth();
  const { contentPadding } = useContentPadding();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(25);

  // Personal Information
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [country, setCountry] = useState('');
  const [nationality, setNationality] = useState('');

  // Contact Information
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Document Upload
  const [idType, setIdType] = useState('');
  const [idFrontUploaded, setIdFrontUploaded] = useState(false);
  const [idBackUploaded, setIdBackUploaded] = useState(false);
  const [selfieUploaded, setSelfieUploaded] = useState(false);
  const [proofOfAddressUploaded, setProofOfAddressUploaded] = useState(false);

  // Final Review
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [dataProcessingAccepted, setDataProcessingAccepted] = useState(false);

  const steps = [
    { id: 1, name: 'Personal Info', icon: User, description: 'Basic information' },
    { id: 2, name: 'Contact Details', icon: FileText, description: 'Address & contact' },
    { id: 3, name: 'Documents', icon: Camera, description: 'Identity verification' },
    { id: 4, name: 'Review', icon: Check, description: 'Final review' },
  ];

  const handleNextStep = () => {
    // Validate current step
    if (currentStep === 1) {
      if (!firstName || !lastName || !dateOfBirth || !country || !nationality) {
        toast({
          title: 'Missing Information',
          description: 'Please fill in all required fields.',
          variant: 'destructive',
        });
        return;
      }
    } else if (currentStep === 2) {
      if (!address || !city || !postalCode || !phoneNumber) {
        toast({
          title: 'Missing Information',
          description: 'Please fill in all required fields.',
          variant: 'destructive',
        });
        return;
      }
    } else if (currentStep === 3) {
      if (
        !idType ||
        !idFrontUploaded ||
        !idBackUploaded ||
        !selfieUploaded ||
        !proofOfAddressUploaded
      ) {
        toast({
          title: 'Missing Documents',
          description: 'Please upload all required documents.',
          variant: 'destructive',
        });
        return;
      }
    }

    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    setProgress(nextStep * 25);
  };

  const handlePreviousStep = () => {
    const prevStep = currentStep - 1;
    setCurrentStep(prevStep);
    setProgress(prevStep * 25);
  };

  const handleSubmit = async () => {
    if (!termsAccepted || !dataProcessingAccepted) {
      toast({
        title: 'Terms and Conditions',
        description: 'Please accept all terms and conditions to continue.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate KYC submission
      await new Promise((resolve) => setTimeout(resolve, 2000));

      updateKYCStatus('in-review');

      toast({
        title: 'KYC Verification Submitted',
        description:
          "Your verification is being processed. You will be notified once it's complete.",
      });

      // Redirect based on user role
      const redirectPath = '/dashboard/kyc/submitted';

      window.location.href = redirectPath;
    } catch (error) {
      toast({
        title: 'Submission Failed',
        description: 'There was an error submitting your verification. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const simulateFileUpload = (type: string) => {
    setIsLoading(true);

    // Simulate file upload
    setTimeout(() => {
      setIsLoading(false);

      toast({
        title: 'Document Uploaded',
        description: `Your ${type} has been successfully uploaded.`,
      });

      switch (type) {
        case 'ID Front':
          setIdFrontUploaded(true);
          break;
        case 'ID Back':
          setIdBackUploaded(true);
          break;
        case 'Selfie':
          setSelfieUploaded(true);
          break;
        case 'Proof of Address':
          setProofOfAddressUploaded(true);
          break;
      }
    }, 1500);
  };

  const DocumentUploadCard = ({
    title,
    description,
    type,
    uploaded,
    icon: Icon,
  }: {
    title: string;
    description: string;
    type: string;
    uploaded: boolean;
    icon: any;
  }) => (
    <Card
      className={`border-2 border-dashed transition-all hover:border-primary/50 ${
        uploaded ? 'border-green-200 bg-green-50/50' : 'border-muted-foreground/25'
      }`}
    >
      <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
        {!uploaded ? (
          <>
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
              <Icon className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="font-medium">{title}</p>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <Button
              variant="outline"
              onClick={() => simulateFileUpload(type)}
              disabled={isLoading}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload {title}
            </Button>
          </>
        ) : (
          <>
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <div className="text-center">
              <p className="font-medium">{title}</p>
              <p className="text-sm text-green-600">Successfully uploaded</p>
            </div>
            <Button variant="outline" onClick={() => simulateFileUpload(type)} className="w-full">
              Replace Document
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className={`min-h-screen bg-background py-8 ${contentPadding}`}>
      {/* Header */}
      <div className="mb-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">KYC Verification</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Complete your identity verification to start trading on TradeChain
          </p>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8">
        <Progress value={progress} className="h-3 mb-6" />

        {/* Step Indicators */}
        <div className="flex justify-between">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex flex-col items-center space-y-2 ${
                currentStep >= step.id ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                  currentStep >= step.id
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-muted-foreground/25'
                }`}
              >
                {currentStep > step.id ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">{step.name}</p>
                <p className="text-xs text-muted-foreground hidden sm:block">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{steps[currentStep - 1]?.name}</CardTitle>
        </CardHeader>

        <CardContent className="p-6 md:p-8">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                <p className="text-sm text-muted-foreground">
                  Please provide your personal details for verification.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First Name *</Label>
                  <Input
                    id="first-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter your first name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name *</Label>
                  <Input
                    id="last-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter your last name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date-of-birth">Date of Birth *</Label>
                <Input
                  id="date-of-birth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Country of Residence *</Label>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="au">Australia</SelectItem>
                      <SelectItem value="de">Germany</SelectItem>
                      <SelectItem value="fr">France</SelectItem>
                      <SelectItem value="jp">Japan</SelectItem>
                      <SelectItem value="sg">Singapore</SelectItem>
                      <SelectItem value="ng">Nigeria</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality *</Label>
                  <Select value={nationality} onValueChange={setNationality}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select nationality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">American</SelectItem>
                      <SelectItem value="ca">Canadian</SelectItem>
                      <SelectItem value="uk">British</SelectItem>
                      <SelectItem value="au">Australian</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="jp">Japanese</SelectItem>
                      <SelectItem value="sg">Singaporean</SelectItem>
                      <SelectItem value="ng">Nigerian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Contact Information</h3>
                <p className="text-sm text-muted-foreground">
                  Please provide your contact details for verification.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Street Address *</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your street address"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter your city"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Enter your state/province"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="postal-code">Postal Code *</Label>
                  <Input
                    id="postal-code"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="Enter postal code"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone-number">Phone Number *</Label>
                  <Input
                    id="phone-number"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Document Verification</h3>
                <p className="text-sm text-muted-foreground">
                  Please upload the required documents for identity verification.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="id-type">ID Type *</Label>
                <Select value={idType} onValueChange={setIdType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ID type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="passport">Passport</SelectItem>
                    <SelectItem value="drivers-license">Driver's License</SelectItem>
                    <SelectItem value="national-id">National ID Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DocumentUploadCard
                  title="ID Front Side"
                  description="Upload a clear photo of the front of your ID"
                  type="ID Front"
                  uploaded={idFrontUploaded}
                  icon={FileText}
                />

                <DocumentUploadCard
                  title="ID Back Side"
                  description="Upload a clear photo of the back of your ID"
                  type="ID Back"
                  uploaded={idBackUploaded}
                  icon={FileText}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DocumentUploadCard
                  title="Selfie with ID"
                  description="Upload a photo of yourself holding your ID"
                  type="Selfie"
                  uploaded={selfieUploaded}
                  icon={Camera}
                />

                <DocumentUploadCard
                  title="Proof of Address"
                  description="Upload a utility bill or bank statement"
                  type="Proof of Address"
                  uploaded={proofOfAddressUploaded}
                  icon={FileText}
                />
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Review and Submit</h3>
                <p className="text-sm text-muted-foreground">
                  Please review your information before submitting.
                </p>
              </div>

              <div className="space-y-4">
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-base">Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">First Name:</span> {firstName}
                      </div>
                      <div>
                        <span className="font-medium">Last Name:</span> {lastName}
                      </div>
                      <div>
                        <span className="font-medium">Date of Birth:</span> {dateOfBirth}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">Country:</span> {country}
                      </div>
                      <div>
                        <span className="font-medium">Nationality:</span> {nationality}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-base">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">Address:</span> {address}
                      </div>
                      <div>
                        <span className="font-medium">City:</span> {city}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">Postal Code:</span> {postalCode}
                      </div>
                      <div>
                        <span className="font-medium">Phone:</span> {phoneNumber}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-base">Documents</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>ID Type:</span>
                      <Badge variant="outline">{idType}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>ID Front:</span>
                      <Badge variant={idFrontUploaded ? 'default' : 'destructive'}>
                        {idFrontUploaded ? 'Uploaded' : 'Missing'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>ID Back:</span>
                      <Badge variant={idBackUploaded ? 'default' : 'destructive'}>
                        {idBackUploaded ? 'Uploaded' : 'Missing'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Selfie with ID:</span>
                      <Badge variant={selfieUploaded ? 'default' : 'destructive'}>
                        {selfieUploaded ? 'Uploaded' : 'Missing'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Proof of Address:</span>
                      <Badge variant={proofOfAddressUploaded ? 'default' : 'destructive'}>
                        {proofOfAddressUploaded ? 'Uploaded' : 'Missing'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4 border-t pt-6">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="terms" className="text-sm leading-relaxed">
                    I confirm that all the information provided is accurate and authentic. I
                    understand that providing false information may result in account suspension.
                  </label>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="data-processing"
                    checked={dataProcessingAccepted}
                    onChange={(e) => setDataProcessingAccepted(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="data-processing" className="text-sm leading-relaxed">
                    I consent to the processing of my personal data for identity verification
                    purposes in accordance with TradeChain's{' '}
                    <Link href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                    .
                  </label>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 p-6 md:p-8">
          {currentStep > 1 ? (
            <Button
              variant="outline"
              onClick={handlePreviousStep}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          ) : (
            <div className="hidden sm:block"></div>
          )}

          {currentStep < 4 ? (
            <Button onClick={handleNextStep} disabled={isLoading} className="w-full sm:w-auto">
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !termsAccepted || !dataProcessingAccepted}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Submitting...
                </>
              ) : (
                'Submit Verification'
              )}
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Security Notice */}
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          Your information is securely encrypted and will only be used for verification purposes. We
          comply with international data protection standards and will never share your personal
          data with unauthorized parties.
        </p>
      </div>
    </div>
  );
}
