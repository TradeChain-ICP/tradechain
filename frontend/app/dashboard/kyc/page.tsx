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
  X,
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

interface KYCFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  country: string;
  nationality: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phoneNumber: string;
  idType: string;
  documents: {
    idFront: File | null;
    idBack: File | null;
    selfie: File | null;
    proofOfAddress: File | null;
  };
  uploadedDocs: {
    idFront: string | null;
    idBack: string | null;
    selfie: string | null;
    proofOfAddress: string | null;
  };
  termsAccepted: boolean;
  dataProcessingAccepted: boolean;
}

export default function KYCVerificationPage() {
  const { toast } = useToast();
  const { contentPadding } = useContentPadding();
  const { user, updateKYCStatus, uploadKYCDocument, submitKYCForReview, getUserDocuments } = useAuth();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(25);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

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
    documents: {
      idFront: null,
      idBack: null,
      selfie: null,
      proofOfAddress: null,
    },
    uploadedDocs: {
      idFront: null,
      idBack: null,
      selfie: null,
      proofOfAddress: null,
    },
    termsAccepted: false,
    dataProcessingAccepted: false,
  });

  useEffect(() => {
    if (user?.kycStatus === 'completed') {
      router.push('/dashboard/profile');
      return;
    }

    if (user?.kycStatus === 'inReview') {
      router.push('/dashboard/kyc/submitted');
      return;
    }

    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        phoneNumber: user.phone || prev.phoneNumber,
      }));
    }

    // Load existing documents if any
    loadExistingDocuments();
  }, [user, router]);

  const loadExistingDocuments = async () => {
    try {
      const docs = await getUserDocuments();
      const uploadedDocs = {
        idFront: null,
        idBack: null,
        selfie: null,
        proofOfAddress: null,
      };

      docs.forEach((doc: any) => {
        switch (doc.docType) {
          case 'id_front':
            uploadedDocs.idFront = doc.id;
            break;
          case 'id_back':
            uploadedDocs.idBack = doc.id;
            break;
          case 'selfie':
            uploadedDocs.selfie = doc.id;
            break;
          case 'proof_address':
            uploadedDocs.proofOfAddress = doc.id;
            break;
        }
      });

      setFormData(prev => ({ ...prev, uploadedDocs }));
    } catch (error) {
      console.error('Failed to load existing documents:', error);
    }
  };

  const steps = [
    { id: 1, name: 'Personal Info', icon: User, description: 'Basic information' },
    { id: 2, name: 'Contact Details', icon: FileText, description: 'Address & contact' },
    { id: 3, name: 'Documents', icon: Camera, description: 'Identity verification' },
    { id: 4, name: 'Review', icon: Check, description: 'Final review' },
  ];

  const validateStep1 = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
    if (!formData.country) errors.country = 'Country is required';
    if (!formData.nationality) errors.nationality = 'Nationality is required';

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
    
    const requiredDocs = ['idFront', 'idBack', 'selfie', 'proofOfAddress'];
    requiredDocs.forEach(doc => {
      if (!formData.uploadedDocs[doc as keyof typeof formData.uploadedDocs]) {
        errors[doc] = `Please upload ${doc.replace(/([A-Z])/g, ' $1').toLowerCase()}`;
      }
    });

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

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    docType: string
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'File Too Large',
        description: 'Please select a file smaller than 10MB.',
        variant: 'destructive',
      });
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Invalid File Type',
        description: 'Please upload JPG, PNG, or PDF files only.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setUploadProgress({ ...uploadProgress, [docType]: 0 });

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const currentProgress = prev[docType] || 0;
          if (currentProgress >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return { ...prev, [docType]: currentProgress + 10 };
        });
      }, 200);

      const documentId = await uploadKYCDocument({
        docType: docType,
        fileName: file.name,
        file: file,
      });

      clearInterval(progressInterval);
      setUploadProgress({ ...uploadProgress, [docType]: 100 });

      setFormData(prev => ({
        ...prev,
        documents: { ...prev.documents, [docType]: file },
        uploadedDocs: { ...prev.uploadedDocs, [docType]: documentId },
      }));

      // Clear error for this field
      if (validationErrors[docType]) {
        setValidationErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[docType];
          return newErrors;
        });
      }

      toast({
        title: 'Document Uploaded',
        description: `Your ${docType.replace(/([A-Z])/g, ' $1').toLowerCase()} has been uploaded successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload document. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[docType];
          return newProgress;
        });
      }, 2000);
    }
  };

  const handleSubmit = async () => {
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
      await submitKYCForReview();

      toast({
        title: 'KYC Verification Submitted',
        description: "Your verification is being processed. You will be notified once it's complete.",
      });

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
    setFormData(prev => ({ ...prev, [field]: value }));

    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const DocumentUploadCard = ({
    title,
    description,
    docType,
    uploaded,
    icon: Icon,
    error,
  }: {
    title: string;
    description: string;
    docType: string;
    uploaded: boolean;
    icon: any;
    error?: string;
  }) => (
    <Card className={`border-2 transition-all ${uploaded ? 'border-green-200 bg-green-50/50' : error ? 'border-red-200 bg-red-50/50' : 'border-dashed border-muted-foreground/25'}`}>
      <CardContent className="p-6 flex flex-col items-center justify-center space-y-4">
        {uploadProgress[docType] !== undefined ? (
          <>
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
            <div className="w-full space-y-2">
              <Progress value={uploadProgress[docType]} className="h-2" />
              <p className="text-sm text-center text-blue-600">
                Uploading... {uploadProgress[docType]}%
              </p>
            </div>
          </>
        ) : uploaded ? (
          <>
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="text-center">
              <p className="font-medium">{title}</p>
              <p className="text-sm text-green-600">Successfully uploaded</p>
            </div>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => handleFileUpload(e, docType)}
              className="hidden"
              id={`${docType}-replace`}
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById(`${docType}-replace`)?.click()}
              className="w-full"
              disabled={isLoading}
            >
              Replace Document
            </Button>
          </>
        ) : (
          <>
            <div className={`h-16 w-16 rounded-full flex items-center justify-center ${error ? 'bg-red-100' : 'bg-muted'}`}>
              <Icon className={`h-8 w-8 ${error ? 'text-red-600' : 'text-muted-foreground'}`} />
            </div>
            <div className="text-center">
              <p className="font-medium">{title}</p>
              <p className="text-sm text-muted-foreground">{description}</p>
              {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
            </div>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => handleFileUpload(e, docType)}
              className="hidden"
              id={docType}
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById(docType)?.click()}
              disabled={isLoading}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload {title}
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
          {/* Step 1: Personal Information */}
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
                  max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
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

          {/* Step 2: Contact Information */}
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
                    className={validationErrors.phoneNumber ? 'border-red-500' : ''}
                  />
                  {validationErrors.phoneNumber && (
                    <p className="text-sm text-red-600">{validationErrors.phoneNumber}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Document Upload */}
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
                  </SelectContent>
                </Select>
                {validationErrors.idType && (
                  <p className="text-sm text-red-600">{validationErrors.idType}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DocumentUploadCard
                  title="ID Front Side"
                  description="Upload the front of your ID"
                  docType="idFront"
                  uploaded={!!formData.uploadedDocs.idFront}
                  icon={FileText}
                  error={validationErrors.idFront}
                />

                <DocumentUploadCard
                  title="ID Back Side"
                  description="Upload the back of your ID"
                  docType="idBack"
                  uploaded={!!formData.uploadedDocs.idBack}
                  icon={FileText}
                  error={validationErrors.idBack}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DocumentUploadCard
                  title="Selfie with ID"
                  description="Photo of yourself holding your ID"
                  docType="selfie"
                  uploaded={!!formData.uploadedDocs.selfie}
                  icon={Camera}
                  error={validationErrors.selfie}
                />

                <DocumentUploadCard
                  title="Proof of Address"
                  description="Utility bill or bank statement"
                  docType="proofOfAddress"
                  uploaded={!!formData.uploadedDocs.proofOfAddress}
                  icon={FileText}
                  error={validationErrors.proofOfAddress}
                />
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Requirements:</strong> All documents must be clear and readable. 
                  Accepted formats: JPG, PNG, PDF (max 10MB each).
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Review and Submit</h3>
                <p className="text-sm text-muted-foreground">
                  Please review your information before submitting.
                </p>
              </div>

              {/* Review content here */}
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
                    I confirm that all information provided is accurate and authentic.
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
                    I consent to the processing of my personal data for verification purposes.
                  </label>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between p-6 md:p-8">
          {currentStep > 1 ? (
            <Button
              variant="outline"
              onClick={handlePreviousStep}
              disabled={isLoading || isSubmitting}
              className="bg-transparent"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          ) : (
            <div></div>
          )}

          {currentStep < 4 ? (
            <Button
              onClick={handleNextStep}
              disabled={isLoading || isSubmitting}
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
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Submitting...
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
    </div>
  );
}