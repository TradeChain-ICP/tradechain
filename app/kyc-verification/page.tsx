"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Check, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"

export default function KYCVerificationPage() {
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(25)

  // Personal Information
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [country, setCountry] = useState("")

  // Contact Information
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")

  // Document Upload
  const [idType, setIdType] = useState("")
  const [idFrontUploaded, setIdFrontUploaded] = useState(false)
  const [idBackUploaded, setIdBackUploaded] = useState(false)
  const [selfieUploaded, setSelfieUploaded] = useState(false)

  // Final Review
  const [termsAccepted, setTermsAccepted] = useState(false)

  const handleNextStep = () => {
    // Validate current step
    if (currentStep === 1) {
      if (!firstName || !lastName || !dateOfBirth || !country) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        })
        return
      }
    } else if (currentStep === 2) {
      if (!address || !city || !postalCode || !phoneNumber) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        })
        return
      }
    } else if (currentStep === 3) {
      if (!idType || !idFrontUploaded || !idBackUploaded || !selfieUploaded) {
        toast({
          title: "Missing Documents",
          description: "Please upload all required documents.",
          variant: "destructive",
        })
        return
      }
    }

    const nextStep = currentStep + 1
    setCurrentStep(nextStep)
    setProgress(nextStep * 25)
  }

  const handlePreviousStep = () => {
    const prevStep = currentStep - 1
    setCurrentStep(prevStep)
    setProgress(prevStep * 25)
  }

  const handleSubmit = () => {
    if (!termsAccepted) {
      toast({
        title: "Terms and Conditions",
        description: "Please accept the terms and conditions to continue.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate KYC submission
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "KYC Verification Submitted",
        description: "Your verification is being processed. You will be notified once it's complete.",
      })

      // Redirect to onboarding complete page
      window.location.href = "/onboarding-complete"
    }, 2000)
  }

  const simulateFileUpload = (type: string) => {
    setIsLoading(true)

    // Simulate file upload
    setTimeout(() => {
      setIsLoading(false)

      toast({
        title: "Document Uploaded",
        description: `Your ${type} has been successfully uploaded.`,
      })

      if (type === "ID Front") {
        setIdFrontUploaded(true)
      } else if (type === "ID Back") {
        setIdBackUploaded(true)
      } else if (type === "Selfie") {
        setSelfieUploaded(true)
      }
    }, 1500)
  }

  return (
    <div className="container relative min-h-screen flex flex-col py-10">
      <Link
        href="/role-selection"
        className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center text-sm font-medium text-muted-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Link>

      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">KYC Verification</h1>
          <p className="text-muted-foreground mt-2">
            Complete your identity verification to start trading on TradeChain
          </p>
        </div>

        <div className="mb-8">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <div className={currentStep >= 1 ? "text-primary font-medium" : ""}>Personal Info</div>
            <div className={currentStep >= 2 ? "text-primary font-medium" : ""}>Contact Details</div>
            <div className={currentStep >= 3 ? "text-primary font-medium" : ""}>Documents</div>
            <div className={currentStep >= 4 ? "text-primary font-medium" : ""}>Review</div>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">Personal Information</h2>
                  <p className="text-sm text-muted-foreground">
                    Please provide your personal details for verification.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input id="first-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input id="last-name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date-of-birth">Date of Birth</Label>
                  <Input
                    id="date-of-birth"
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country of Residence</Label>
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
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">Contact Information</h2>
                  <p className="text-sm text-muted-foreground">Please provide your contact details for verification.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postal-code">Postal Code</Label>
                    <Input
                      id="postal-code"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone-number">Phone Number</Label>
                  <Input
                    id="phone-number"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">Document Verification</h2>
                  <p className="text-sm text-muted-foreground">
                    Please upload the required documents for identity verification.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="id-type">ID Type</Label>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-dashed">
                    <CardContent className="p-4 flex flex-col items-center justify-center space-y-2">
                      {!idFrontUploaded ? (
                        <>
                          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                            <Upload className="h-10 w-10 text-muted-foreground" />
                          </div>
                          <div className="text-center">
                            <p className="font-medium">ID Front Side</p>
                            <p className="text-sm text-muted-foreground">
                              Upload a clear photo of the front of your ID
                            </p>
                          </div>
                          <Button variant="outline" onClick={() => simulateFileUpload("ID Front")} disabled={isLoading}>
                            Upload
                          </Button>
                        </>
                      ) : (
                        <>
                          <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
                            <Check className="h-10 w-10 text-green-600" />
                          </div>
                          <div className="text-center">
                            <p className="font-medium">ID Front Side</p>
                            <p className="text-sm text-green-600">Successfully uploaded</p>
                          </div>
                          <Button variant="outline" onClick={() => simulateFileUpload("ID Front")}>
                            Replace
                          </Button>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border-dashed">
                    <CardContent className="p-4 flex flex-col items-center justify-center space-y-2">
                      {!idBackUploaded ? (
                        <>
                          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                            <Upload className="h-10 w-10 text-muted-foreground" />
                          </div>
                          <div className="text-center">
                            <p className="font-medium">ID Back Side</p>
                            <p className="text-sm text-muted-foreground">Upload a clear photo of the back of your ID</p>
                          </div>
                          <Button variant="outline" onClick={() => simulateFileUpload("ID Back")} disabled={isLoading}>
                            Upload
                          </Button>
                        </>
                      ) : (
                        <>
                          <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
                            <Check className="h-10 w-10 text-green-600" />
                          </div>
                          <div className="text-center">
                            <p className="font-medium">ID Back Side</p>
                            <p className="text-sm text-green-600">Successfully uploaded</p>
                          </div>
                          <Button variant="outline" onClick={() => simulateFileUpload("ID Back")}>
                            Replace
                          </Button>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-dashed">
                  <CardContent className="p-4 flex flex-col items-center justify-center space-y-2">
                    {!selfieUploaded ? (
                      <>
                        <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                          <Upload className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <div className="text-center">
                          <p className="font-medium">Selfie with ID</p>
                          <p className="text-sm text-muted-foreground">Upload a photo of yourself holding your ID</p>
                        </div>
                        <Button variant="outline" onClick={() => simulateFileUpload("Selfie")} disabled={isLoading}>
                          Upload
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
                          <Check className="h-10 w-10 text-green-600" />
                        </div>
                        <div className="text-center">
                          <p className="font-medium">Selfie with ID</p>
                          <p className="text-sm text-green-600">Successfully uploaded</p>
                        </div>
                        <Button variant="outline" onClick={() => simulateFileUpload("Selfie")}>
                          Replace
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">Review and Submit</h2>
                  <p className="text-sm text-muted-foreground">Please review your information before submitting.</p>
                </div>

                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-md">
                    <h3 className="font-medium mb-2">Personal Information</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>First Name:</div>
                      <div>{firstName}</div>
                      <div>Last Name:</div>
                      <div>{lastName}</div>
                      <div>Date of Birth:</div>
                      <div>{dateOfBirth}</div>
                      <div>Country:</div>
                      <div>
                        {country === "us"
                          ? "United States"
                          : country === "ca"
                            ? "Canada"
                            : country === "uk"
                              ? "United Kingdom"
                              : country === "au"
                                ? "Australia"
                                : country === "de"
                                  ? "Germany"
                                  : country === "fr"
                                    ? "France"
                                    : country === "jp"
                                      ? "Japan"
                                      : country === "sg"
                                        ? "Singapore"
                                        : country}
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-md">
                    <h3 className="font-medium mb-2">Contact Information</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Address:</div>
                      <div>{address}</div>
                      <div>City:</div>
                      <div>{city}</div>
                      <div>Postal Code:</div>
                      <div>{postalCode}</div>
                      <div>Phone Number:</div>
                      <div>{phoneNumber}</div>
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-md">
                    <h3 className="font-medium mb-2">Document Information</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>ID Type:</div>
                      <div>
                        {idType === "passport"
                          ? "Passport"
                          : idType === "drivers-license"
                            ? "Driver's License"
                            : idType === "national-id"
                              ? "National ID Card"
                              : idType}
                      </div>
                      <div>ID Front:</div>
                      <div>{idFrontUploaded ? "Uploaded" : "Not uploaded"}</div>
                      <div>ID Back:</div>
                      <div>{idBackUploaded ? "Uploaded" : "Not uploaded"}</div>
                      <div>Selfie with ID:</div>
                      <div>{selfieUploaded ? "Uploaded" : "Not uploaded"}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I confirm that all the information provided is accurate and authentic.
                  </label>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between">
            {currentStep > 1 ? (
              <Button variant="outline" onClick={handlePreviousStep} disabled={isLoading}>
                Back
              </Button>
            ) : (
              <div></div>
            )}

            {currentStep < 4 ? (
              <Button onClick={handleNextStep} disabled={isLoading}>
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit Verification"}
              </Button>
            )}
          </CardFooter>
        </Card>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Your information is securely encrypted and will only be used for verification purposes.</p>
        </div>
      </div>
    </div>
  )
}
