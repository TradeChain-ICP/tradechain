// app/role-selection/page.tsx
'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowRight, 
  ArrowLeft, 
  ShoppingCart, 
  Store, 
  Upload, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Globe, 
  FileText, 
  CheckCircle,
  Camera
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ProfileFormData {
  role: 'buyer' | 'seller' | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  location: string;
  company: string;
  website: string;
  profilePicture: File | null;
  profilePicturePreview: string | null;
}

export default function OptimizedRoleSelectionPage() {
  const { toast } = useToast();
  const { setUserRole } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const [formData, setFormData] = useState<ProfileFormData>({
    role: null,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    company: '',
    website: '',
    profilePicture: null,
    profilePicturePreview: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = [
    { id: 1, title: 'Choose Role', description: 'Select your role on TradeChain' },
    { id: 2, title: 'Personal Info', description: 'Tell us about yourself' },
    { id: 3, title: 'Profile Details', description: 'Complete your profile' },
    { id: 4, title: 'Complete', description: 'All done!' },
  ];

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.role) {
          newErrors.role = 'Please select a role';
        }
        break;
      case 2:
        if (!formData.firstName.trim()) {
          newErrors.firstName = 'First name is required';
        }
        if (!formData.lastName.trim()) {
          newErrors.lastName = 'Last name is required';
        }
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Please enter a valid email';
        }
        break;
      case 3:
        if (!formData.location.trim()) {
          newErrors.location = 'Location is required';
        }
        if (formData.role === 'seller' && !formData.company.trim()) {
          newErrors.company = 'Company name is required for sellers';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast({
          title: 'File Too Large',
          description: 'Please select an image smaller than 5MB.',
          variant: 'destructive',
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          profilePicture: file,
          profilePicturePreview: e.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!formData.role) return;

    setIsLoading(true);
    try {
      // Convert profile picture to blob if exists
      let profilePictureBlob: ArrayBuffer | null = null;
      if (formData.profilePicture) {
        profilePictureBlob = await formData.profilePicture.arrayBuffer();
      }

      await setUserRole({
        role: formData.role,
        bio: formData.bio,
        location: formData.location,
        company: formData.company,
        website: formData.website,
      });

      setIsCompleted(true);
      setCurrentStep(4);

      // Start countdown
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            const dashboardPath = `/dashboard/${formData.role}`;
            router.push(dashboardPath);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      toast({
        title: 'Profile Complete!',
        description: `Welcome to TradeChain as a ${formData.role}!`,
      });
    } catch (error) {
      console.error('Profile setup error:', error);
      toast({
        title: 'Setup Failed',
        description: 'There was an error setting up your profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getProgress = () => {
    return (currentStep / 4) * 100;
  };

  const updateFormData = (field: keyof ProfileFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const getInitials = () => {
    return `${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="w-full p-6">
        <Link
          href="/"
          className="text-2xl md:text-3xl font-extrabold tracking-tight text-primary hover:text-primary/90 transition-colors"
        >
          <span className="text-primary">Trade</span>
          <span className="text-foreground">Chain</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl space-y-8">
          {/* Progress Indicator */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl md:text-3xl font-bold">
                {isCompleted ? 'Welcome to TradeChain!' : 'Complete Your Profile'}
              </h1>
              {!isCompleted && (
                <Badge variant="outline" className="text-xs">
                  Step {currentStep} of 3
                </Badge>
              )}
            </div>

            <Progress value={getProgress()} className="h-2" />

            <div className="flex justify-between text-sm text-muted-foreground">
              {steps.slice(0, 3).map((step, index) => (
                <div
                  key={step.id}
                  className={`flex items-center ${
                    currentStep >= step.id ? 'text-primary font-medium' : ''
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-2 text-xs ${
                      currentStep >= step.id
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-muted-foreground'
                    }`}
                  >
                    {currentStep > step.id ? <CheckCircle className="w-3 h-3" /> : step.id}
                  </div>
                  <span className="hidden sm:inline">{step.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <Card className="border-2">
            <CardContent className="p-6 md:p-8">
              {/* Step 1: Role Selection */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-xl font-semibold">Choose Your Role</h2>
                    <p className="text-muted-foreground">
                      How would you like to participate in TradeChain?
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Buyer Card */}
                    <div
                      className={`cursor-pointer transition-all duration-300 p-6 rounded-lg border-2 ${
                        formData.role === 'buyer'
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                          : 'border-muted hover:border-primary/50'
                      }`}
                      onClick={() => updateFormData('role', 'buyer')}
                    >
                      <div className="text-center space-y-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                          <ShoppingCart className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">Commodity Buyer</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Purchase commodities from verified suppliers
                          </p>
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div>✓ Browse global marketplace</div>
                          <div>✓ AI-powered insights</div>
                          <div>✓ Secure escrow payments</div>
                        </div>
                      </div>
                    </div>

                    {/* Seller Card */}
                    <div
                      className={`cursor-pointer transition-all duration-300 p-6 rounded-lg border-2 ${
                        formData.role === 'seller'
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                          : 'border-muted hover:border-primary/50'
                      }`}
                      onClick={() => updateFormData('role', 'seller')}
                    >
                      <div className="text-center space-y-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                          <Store className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">Commodity Seller</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            List and sell your commodities globally
                          </p>
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div>✓ List your inventory</div>
                          <div>✓ AI price optimization</div>
                          <div>✓ Instant settlements</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {errors.role && <p className="text-sm text-red-600 text-center">{errors.role}</p>}
                </div>
              )}

              {/* Step 2: Personal Information */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-xl font-semibold">Personal Information</h2>
                    <p className="text-muted-foreground">Let's get to know you better</p>
                  </div>

                  {/* Profile Picture Upload */}
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={formData.profilePicturePreview || undefined} />
                        <AvatarFallback className="text-lg bg-muted">
                          {formData.firstName && formData.lastName ? (
                            getInitials()
                          ) : (
                            <User className="h-8 w-8" />
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        Upload a profile picture (optional)
                      </p>
                      <p className="text-xs text-muted-foreground">Max 5MB • JPG, PNG, GIF</p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => updateFormData('firstName', e.target.value)}
                        placeholder="Enter your first name"
                        className={errors.firstName ? 'border-red-500' : ''}
                      />
                      {errors.firstName && (
                        <p className="text-sm text-red-600">{errors.firstName}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => updateFormData('lastName', e.target.value)}
                        placeholder="Enter your last name"
                        className={errors.lastName ? 'border-red-500' : ''}
                      />
                      {errors.lastName && <p className="text-sm text-red-600">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      placeholder="Enter your email address"
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                    <p className="text-xs text-muted-foreground">
                      Optional but recommended for account security
                    </p>
                  </div>
                </div>
              )}

              {/* Step 3: Profile Details */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-xl font-semibold">Complete Your Profile</h2>
                    <p className="text-muted-foreground">
                      Add some details to help others connect with you
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => updateFormData('bio', e.target.value)}
                        placeholder={`Tell others about yourself as a ${formData.role}...`}
                        rows={3}
                      />
                      <p className="text-xs text-muted-foreground">
                        Share your experience, specialties, or what you're looking for
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="location">Location *</Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => updateFormData('location', e.target.value)}
                          placeholder="City, Country"
                          className={errors.location ? 'border-red-500' : ''}
                        />
                        {errors.location && (
                          <p className="text-sm text-red-600">{errors.location}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="company">Company {formData.role === 'seller' && '*'}</Label>
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) => updateFormData('company', e.target.value)}
                          placeholder="Your company name"
                          className={errors.company ? 'border-red-500' : ''}
                        />
                        {errors.company && <p className="text-sm text-red-600">{errors.company}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        type="url"
                        value={formData.website}
                        onChange={(e) => updateFormData('website', e.target.value)}
                        placeholder="https://your-website.com"
                      />
                    </div>
                  </div>

                  {/* Role-specific information */}
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h3 className="font-medium mb-2">
                      {formData.role === 'buyer' ? 'As a Buyer' : 'As a Seller'}
                    </h3>
                    <div className="text-sm text-muted-foreground space-y-1">
                      {formData.role === 'buyer' ? (
                        <>
                          <div>• Browse and purchase commodities from verified sellers</div>
                          <div>• Get AI-powered market insights and recommendations</div>
                          <div>• Secure payments with escrow protection</div>
                          <div>• Track your portfolio and investment performance</div>
                        </>
                      ) : (
                        <>
                          <div>• List your commodity inventory for global buyers</div>
                          <div>• Get AI-powered price optimization suggestions</div>
                          <div>• Receive payments automatically through escrow</div>
                          <div>• Access detailed sales analytics and insights</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Completion */}
              {currentStep === 4 && isCompleted && (
                <div className="text-center space-y-6">
                  {/* Animated checkmark */}
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
                        <CheckCircle className="w-12 h-12 text-green-600 animate-bounce" />
                      </div>
                      <div className="absolute inset-0 w-20 h-20 border-4 border-green-200 rounded-full animate-ping"></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-green-600">Profile Complete!</h2>
                    <p className="text-lg text-muted-foreground">
                      Welcome to TradeChain, {formData.firstName}!
                    </p>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-green-700">
                        Your {formData.role} account has been successfully created. You'll be
                        redirected to your dashboard in {countdown} seconds.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={() => router.push(`/dashboard/${formData.role}`)}
                      className="w-full"
                      size="lg"
                    >
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>

                    <div className="text-xs text-muted-foreground">
                      Auto-redirecting in {countdown} seconds...
                    </div>
                  </div>
                </div>
              )}
            </CardContent>

            {/* Navigation Footer */}
            {currentStep < 4 && (
              <div className="flex justify-between items-center p-6 pt-0">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 1 || isLoading}
                  className="bg-transparent"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>

                <Button onClick={handleNext} disabled={isLoading} className="min-w-[120px]">
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Setting up...
                    </div>
                  ) : currentStep === 3 ? (
                    <>
                      Complete Setup
                      <CheckCircle className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </Card>

          {/* Security Notice */}
          {currentStep < 4 && (
            <div className="text-center text-xs text-muted-foreground max-w-md mx-auto">
              <p>
                By continuing, you agree to TradeChain's{' '}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
                . Your data is encrypted and secure.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}