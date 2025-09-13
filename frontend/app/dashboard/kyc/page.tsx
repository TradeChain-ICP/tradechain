// app/dashboard/kyc/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Upload,
  FileText,
  Camera,
  User,
  AlertTriangle,
  CheckCircle,
  Shield,
} from 'lucide-react';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/auth-context';
import { useContentPadding } from '@/contexts/sidebar-context';
import { useRouter } from 'next/navigation';

// KYC Form Data Interface
interface KYCFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  country: string;
  nationality: string;

  // Contact Information
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phoneNumber: string;

  // Document Information
  idType: string;
  idFrontUploaded: boolean;
  idBackUploaded: boolean;
  selfieUploaded: boolean;
  proofOfAddressUploaded: boolean;

  // Agreements
  termsAccepted: boolean;
  dataProcessingAccepted: boolean;
}

// Document Upload Result
interface DocumentUploadResult {
  success: boolean;
  documentId?: string;
  error?: string;
}

export default function KYCVerificationPage() {
  const { toast } = useToast();
  const { user, updateKYCStatus, updateProfile } = useAuth();
  const { contentPadding } = useContentPadding();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(25);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Initialize form with user data
  const [formData, setFormData] = useState<KYCFormData>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    dateOfBirth: '',
    country: '',
    nationality: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    phoneNumber: user?.phone || '',
    idType: '',
    idFrontUploaded: false,
    idBackUploaded: false,
    selfieUploaded: false,
    proofOfAddressUploaded: false,
    termsAccepted: false,
    dataProcessingAccepted: false,
  });

  // Check if user already completed KYC
  useEffect(() => {
    if (user?.kycStatus === 'completed') {
      router.push('/dashboard/profile');
      return;
    }

    if (user?.kycStatus === 'inReview') {
      router.push('/dashboard/kyc/submitted');
      return;
    }

    // Pre-populate form with existing user data
    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        phoneNumber: user.phone || prev.phoneNumber,
      }));
    }
  }, [user, router]);

  const steps = [
    { id: 1, name: 'Personal Info', icon: User, description: 'Basic information' },
    { id: 2, name: 'Contact Details', icon: FileText, description: 'Address & contact' },
    { id: 3, name: 'Documents', icon: Camera, description: 'Identity verification' },
    { id: 4, name: 'Review', icon: Check, description: 'Final review' },
  ];

  // Validation functions
  const validateStep1 = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
    if (!formData.country) errors.country = 'Country is required';
    if (!formData.nationality) errors.nationality = 'Nationality is required';

    // Validate age (must be 18+)
    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (age < 18 || (age === 18 && monthDiff < 0)) {
        errors.dateOfBirth = 'You must be at least 18 years old';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.address.trim()) errors.address = 'Address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.postalCode.trim()) errors.postalCode = 'Postal code is required';
    if (!formData.phoneNumber.trim()) errors.phoneNumber = 'Phone number is required';

    // Basic phone number validation
    if (
      formData.phoneNumber &&
      !/^\+?[1-9]\d{1,14}$/.test(formData.phoneNumber.replace(/[\s\-\(\)]/g, ''))
    ) {
      errors.phoneNumber = 'Please enter a valid phone number';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.idType) errors.idType = 'Please select an ID type';
    if (!formData.idFrontUploaded) errors.idFront = 'Please upload front side of ID';
    if (!formData.idBackUploaded) errors.idBack = 'Please upload back side of ID';
    if (!formData.selfieUploaded) errors.selfie = 'Please upload selfie with ID';
    if (!formData.proofOfAddressUploaded) errors.proofOfAddress = 'Please upload proof of address';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    let isValid = false;

    switch (currentStep) {
      case 1:
        isValid = validateStep1();
        break;
      case 2:
        isValid = validateStep2();
        break;
      case 3:
        isValid = validateStep3();
        break;
      default:
        isValid = true;
    }

    if (!isValid) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors below before continuing.',
        variant: 'destructive',
      });
      return;
    }

    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    setProgress(nextStep * 25);
    setValidationErrors({});
  };

  const handlePreviousStep = () => {
    const prevStep = currentStep - 1;
    setCurrentStep(prevStep);
    setProgress(prevStep * 25);
    setValidationErrors({});
  };

  // Simulate document upload with proper error handling
  const simulateDocumentUpload = async (type: string): Promise<DocumentUploadResult> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate 95% success rate
        const success = Math.random() > 0.05;

        if (success) {
          resolve({
            success: true,
            documentId: `doc_${Date.now()}_${type.toLowerCase().replace(/\s+/g, '_')}`,
          });
        } else {
          resolve({
            success: false,
            error: 'Upload failed. Please try again.',
          });
        }
      }, 1500 + Math.random() * 1000);
    });
  };

  const handleDocumentUpload = async (type: string) => {
    setIsLoading(true);

    try {
      const result = await simulateDocumentUpload(type);

      if (result.success) {
        // Update form state
        const updateKey = `${type
          .toLowerCase()
          .replace(/\s+/g, '')
          .replace('idfront', 'idFront')
          .replace('idback', 'idBack')
          .replace('proofofselfie', 'selfie')
          .replace('proofofaddress', 'proofOfAddress')}Uploaded` as keyof KYCFormData;

        setFormData((prev) => ({
          ...prev,
          [updateKey]: true,
        }));

        toast({
          title: 'Document Uploaded',
          description: `Your ${type} has been successfully uploaded and verified.`,
        });
      } else {
        toast({
          title: 'Upload Failed',
          description: result.error || 'Failed to upload document. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Upload Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    // Final validation
    if (!formData.termsAccepted || !formData.dataProcessingAccepted) {
      toast({
        title: 'Terms and Conditions',
        description: 'Please accept all terms and conditions to continue.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Update user profile with KYC data
      await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phoneNumber,
      });

      // Simulate KYC submission processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Update KYC status to 'inReview'
      await updateKYCStatus('inReview');

      toast({
        title: 'KYC Verification Submitted',
        description:
          "Your verification is being processed. You will be notified once it's complete.",
      });

      // Redirect to submission confirmation page
      router.push('/dashboard/kyc/submitted');
    } catch (error) {
      console.error('KYC submission error:', error);
      toast({
        title: 'Submission Failed',
        description: 'There was an error submitting your verification. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: keyof KYCFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const DocumentUploadCard = ({
    title,
    description,
    type,
    uploaded,
    icon: Icon,
    error,
  }: {
    title: string;
    description: string;
    type: string;
    uploaded: boolean;
    icon: any;
    error?: string;
  }) => (
    <Card
      className={`border-2 border-dashed transition-all hover:border-primary/50 ${
        uploaded
          ? 'border-green-200 bg-green-50/50'
          : error
          ? 'border-red-200 bg-red-50/50'
          : 'border-muted-foreground/25'
      }`}
    >
      <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
        {!uploaded ? (
          <>
            <div
              className={`h-16 w-16 rounded-full flex items-center justify-center ${
                error ? 'bg-red-100' : 'bg-muted'
              }`}
            >
              <Icon className={`h-8 w-8 ${error ? 'text-red-600' : 'text-muted-foreground'}`} />
            </div>
            <div className="text-center">
              <p className="font-medium">{title}</p>
              <p className="text-sm text-muted-foreground">{description}</p>
              {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
            </div>
            <Button
              variant="outline"
              onClick={() => handleDocumentUpload(type)}
              disabled={isLoading}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isLoading ? 'Uploading...' : `Upload ${title}`}
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
            <Button
              variant="outline"
              onClick={() => handleDocumentUpload(type)}
              className="w-full"
              disabled={isLoading}
            >
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
      <div className="mb-8 max-w-4xl mx-auto">
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
                    value={formData.firstName}
                    onChange={(e) => updateFormData('firstName', e.target.value)}
                    placeholder="Enter your first name"
                    className={validationErrors.firstName ? 'border-red-500' : ''}
                  />
                  {validationErrors.firstName && (
                    <p className="text-sm text-red-600">{validationErrors.firstName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name *</Label>
                  <Input
                    id="last-name"
                    value={formData.lastName}
                    onChange={(e) => updateFormData('lastName', e.target.value)}
                    placeholder="Enter your last name"
                    className={validationErrors.lastName ? 'border-red-500' : ''}
                  />
                  {validationErrors.lastName && (
                    <p className="text-sm text-red-600">{validationErrors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date-of-birth">Date of Birth *</Label>
                <Input
                  id="date-of-birth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
                  max={
                    new Date(new Date().setFullYear(new Date().getFullYear() - 18))
                      .toISOString()
                      .split('T')[0]
                  }
                  className={validationErrors.dateOfBirth ? 'border-red-500' : ''}
                />
                {validationErrors.dateOfBirth && (
                  <p className="text-sm text-red-600">{validationErrors.dateOfBirth}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Country of Residence *</Label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) => updateFormData('country', value)}
                  >
                    <SelectTrigger className={validationErrors.country ? 'border-red-500' : ''}>
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
                      <SelectItem value="za">South Africa</SelectItem>
                      <SelectItem value="in">India</SelectItem>
                      <SelectItem value="br">Brazil</SelectItem>
                    </SelectContent>
                  </Select>
                  {validationErrors.country && (
                    <p className="text-sm text-red-600">{validationErrors.country}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality *</Label>
                  <Select
                    value={formData.nationality}
                    onValueChange={(value) => updateFormData('nationality', value)}
                  >
                    <SelectTrigger className={validationErrors.nationality ? 'border-red-500' : ''}>
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
                      <SelectItem value="za">South African</SelectItem>
                      <SelectItem value="in">Indian</SelectItem>
                      <SelectItem value="br">Brazilian</SelectItem>
                    </SelectContent>
                  </Select>
                  {validationErrors.nationality && (
                    <p className="text-sm text-red-600">{validationErrors.nationality}</p>
                  )}
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
                  value={formData.address}
                  onChange={(e) => updateFormData('address', e.target.value)}
                  placeholder="Enter your street address"
                  className={validationErrors.address ? 'border-red-500' : ''}
                />
                {validationErrors.address && (
                  <p className="text-sm text-red-600">{validationErrors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => updateFormData('city', e.target.value)}
                    placeholder="Enter your city"
                    className={validationErrors.city ? 'border-red-500' : ''}
                  />
                  {validationErrors.city && (
                    <p className="text-sm text-red-600">{validationErrors.city}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => updateFormData('state', e.target.value)}
                    placeholder="Enter your state/province"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="postal-code">Postal Code *</Label>
                  <Input
                    id="postal-code"
                    value={formData.postalCode}
                    onChange={(e) => updateFormData('postalCode', e.target.value)}
                    placeholder="Enter postal code"
                    className={validationErrors.postalCode ? 'border-red-500' : ''}
                  />
                  {validationErrors.postalCode && (
                    <p className="text-sm text-red-600">{validationErrors.postalCode}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone-number">Phone Number *</Label>
                  <Input
                    id="phone-number"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => updateFormData('phoneNumber', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className={validationErrors.phoneNumber ? 'border-red-500' : ''}
                  />
                  {validationErrors.phoneNumber && (
                    <p className="text-sm text-red-600">{validationErrors.phoneNumber}</p>
                  )}
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
                <Select
                  value={formData.idType}
                  onValueChange={(value) => updateFormData('idType', value)}
                >
                  <SelectTrigger className={validationErrors.idType ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select ID type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="passport">Passport</SelectItem>
                    <SelectItem value="drivers-license">Driver's License</SelectItem>
                    <SelectItem value="national-id">National ID Card</SelectItem>
                    <SelectItem value="residence-permit">Residence Permit</SelectItem>
                  </SelectContent>
                </Select>
                {validationErrors.idType && (
                  <p className="text-sm text-red-600">{validationErrors.idType}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DocumentUploadCard
                  title="ID Front Side"
                  description="Upload a clear photo of the front of your ID"
                  type="ID Front"
                  uploaded={formData.idFrontUploaded}
                  icon={FileText}
                  error={validationErrors.idFront}
                />

                <DocumentUploadCard
                  title="ID Back Side"
                  description="Upload a clear photo of the back of your ID"
                  type="ID Back"
                  uploaded={formData.idBackUploaded}
                  icon={FileText}
                  error={validationErrors.idBack}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DocumentUploadCard
                  title="Selfie with ID"
                  description="Upload a photo of yourself holding your ID"
                  type="Selfie"
                  uploaded={formData.selfieUploaded}
                  icon={Camera}
                  error={validationErrors.selfie}
                />

                <DocumentUploadCard
                  title="Proof of Address"
                  description="Upload a utility bill or bank statement (max 3 months old)"
                  type="Proof of Address"
                  uploaded={formData.proofOfAddressUploaded}
                  icon={FileText}
                  error={validationErrors.proofOfAddress}
                />
              </div>

              {/* Document Requirements Alert */}
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Document Requirements:</strong>
                  <ul className="mt-2 list-disc list-inside space-y-1 text-sm">
                    <li>All documents must be clear and readable</li>
                    <li>No shadows, glare, or blurred images</li>
                    <li>All four corners of documents must be visible</li>
                    <li>Selfie must clearly show your face and the ID document</li>
                    <li>Proof of address must be dated within the last 3 months</li>
                  </ul>
                </AlertDescription>
              </Alert>
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
                        <span className="font-medium">First Name:</span> {formData.firstName}
                      </div>
                      <div>
                        <span className="font-medium">Last Name:</span> {formData.lastName}
                      </div>
                      <div>
                        <span className="font-medium">Date of Birth:</span> {formData.dateOfBirth}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">Country:</span> {formData.country}
                      </div>
                      <div>
                        <span className="font-medium">Nationality:</span> {formData.nationality}
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
                        <span className="font-medium">Address:</span> {formData.address}
                      </div>
                      <div>
                        <span className="font-medium">City:</span> {formData.city}
                      </div>
                      {formData.state && (
                        <div>
                          <span className="font-medium">State:</span> {formData.state}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">Postal Code:</span> {formData.postalCode}
                      </div>
                      <div>
                        <span className="font-medium">Phone:</span> {formData.phoneNumber}
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
                      <Badge variant="outline">{formData.idType}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>ID Front:</span>
                      <Badge variant={formData.idFrontUploaded ? 'default' : 'destructive'}>
                        {formData.idFrontUploaded ? 'Uploaded' : 'Missing'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>ID Back:</span>
                      <Badge variant={formData.idBackUploaded ? 'default' : 'destructive'}>
                        {formData.idBackUploaded ? 'Uploaded' : 'Missing'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Selfie with ID:</span>
                      <Badge variant={formData.selfieUploaded ? 'default' : 'destructive'}>
                        {formData.selfieUploaded ? 'Uploaded' : 'Missing'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Proof of Address:</span>
                      <Badge variant={formData.proofOfAddressUploaded ? 'default' : 'destructive'}>
                        {formData.proofOfAddressUploaded ? 'Uploaded' : 'Missing'}
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
                    checked={formData.termsAccepted}
                    onChange={(e) => updateFormData('termsAccepted', e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="terms" className="text-sm leading-relaxed">
                    I confirm that all the information provided is accurate and authentic. I
                    understand that providing false information may result in account suspension or
                    legal consequences.
                  </label>
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="data-processing"
                    checked={formData.dataProcessingAccepted}
                    onChange={(e) => updateFormData('dataProcessingAccepted', e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="data-processing" className="text-sm leading-relaxed">
                    I consent to the processing of my personal data for identity verification
                    purposes in accordance with TradeChain's{' '}
                    <Link href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>{' '}
                    and{' '}
                    <Link href="/terms" className="text-primary hover:underline">
                      Terms of Service
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
              disabled={isLoading || isSubmitting}
              className="w-full sm:w-auto"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          ) : (
            <div className="hidden sm:block"></div>
          )}

          {currentStep < 4 ? (
            <Button
              onClick={handleNextStep}
              disabled={isLoading || isSubmitting}
              className="w-full sm:w-auto"
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={
                isLoading ||
                isSubmitting ||
                !formData.termsAccepted ||
                !formData.dataProcessingAccepted
              }
              className="w-full sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Submitting Verification...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Submit Verification
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Security Notice */}
      <div className="mt-8 text-center max-w-4xl mx-auto">
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Security & Privacy:</strong> Your information is securely encrypted using
            industry-standard protocols. We comply with international data protection standards
            (GDPR, CCPA) and will never share your personal data with unauthorized parties. All
            uploaded documents are processed in secure environments and automatically deleted after
            verification completion.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
