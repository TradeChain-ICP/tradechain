"use client"

import { useState } from "react"
import { Camera, Edit, Save, X, Shield, Star, MapPin, Calendar, Mail, Store, Package, Users, Award } from "lucide-react"

import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { RoleGuard } from "@/components/auth/role-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Switch } from "@/components/ui/switch"

export default function SellerProfilePage() {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    businessName: "Premium Metals Co.",
    contactName: "John Smith",
    email: "contact@premiummetals.com",
    phone: "+1 (555) 987-6543",
    bio: "Leading supplier of precious metals with over 15 years of experience in the commodity trading industry. We specialize in gold, silver, platinum, and palladium products.",
    location: "New York, NY",
    website: "https://premiummetals.com",
    businessType: "Corporation",
    taxId: "12-3456789",
    avatar: "/placeholder.svg?height=120&width=120",
    joinDate: "January 2019",
    verified: true,
    rating: 4.9,
    totalSales: 1247,
    successRate: 99.2,
    responseTime: "< 1 hour",
  })

  const [storeSettings, setStoreSettings] = useState({
    storeVisible: true,
    showStats: true,
    allowMessages: true,
    autoReply: true,
    businessHours: "9:00 AM - 6:00 PM EST",
    shippingPolicy: "We offer fast and secure shipping worldwide with full insurance coverage.",
    returnPolicy: "30-day return policy on all items. Items must be in original condition.",
  })

  const handleSave = () => {
    setIsEditing(false)
    toast({
      title: "Profile Updated",
      description: "Your seller profile has been successfully updated.",
    })
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset form data here if needed
  }

  const handleAvatarChange = () => {
    toast({
      title: "Avatar Upload",
      description: "Avatar upload functionality would be implemented here.",
    })
  }

  return (
    <RoleGuard allowedRoles={["seller"]}>
      <DashboardLayout userRole="seller">
        <div className="container mx-auto px-4 py-6 pb-20 lg:pb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Seller Profile</h1>
              <p className="text-muted-foreground">Manage your business profile and store settings</p>
            </div>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={handleCancel} size="sm" className="bg-transparent">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave} size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Profile Overview */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={profileData.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-lg">{profileData.businessName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <Button
                          size="icon"
                          variant="outline"
                          className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-background"
                          onClick={handleAvatarChange}
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold">{profileData.businessName}</h2>
                        {profileData.verified && (
                          <Badge variant="outline" className="text-xs">
                            <Shield className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground">{profileData.businessType}</p>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{profileData.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Member since {profileData.joinDate}</span>
                      </div>
                    </div>

                    <div className="w-full pt-4 border-t">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold">{profileData.totalSales}</div>
                          <div className="text-xs text-muted-foreground">Total Sales</div>
                        </div>
                        <div>
                          <div className="flex items-center justify-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-2xl font-bold">{profileData.rating}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">Rating</div>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-green-600">{profileData.successRate}%</div>
                          <div className="text-xs text-muted-foreground">Success Rate</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-blue-600">{profileData.responseTime}</div>
                          <div className="text-xs text-muted-foreground">Response Time</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Store Status */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Store className="h-5 w-5" />
                    Store Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Store Visibility</Label>
                      <p className="text-sm text-muted-foreground">Make your store visible to buyers</p>
                    </div>
                    <Switch
                      checked={storeSettings.storeVisible}
                      onCheckedChange={(checked) => setStoreSettings((prev) => ({ ...prev, storeVisible: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Statistics</Label>
                      <p className="text-sm text-muted-foreground">Display your performance stats</p>
                    </div>
                    <Switch
                      checked={storeSettings.showStats}
                      onCheckedChange={(checked) => setStoreSettings((prev) => ({ ...prev, showStats: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Allow Messages</Label>
                      <p className="text-sm text-muted-foreground">Let buyers contact you directly</p>
                    </div>
                    <Switch
                      checked={storeSettings.allowMessages}
                      onCheckedChange={(checked) => setStoreSettings((prev) => ({ ...prev, allowMessages: checked }))}
                    />
                  </div>

                  <Button variant="outline" className="w-full bg-transparent">
                    <Store className="h-4 w-4 mr-2" />
                    View Public Store
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Package className="h-4 w-4 mr-2" />
                    Manage Products
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Users className="h-4 w-4 mr-2" />
                    Customer Reviews
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Award className="h-4 w-4 mr-2" />
                    Performance Analytics
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="business" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="business">Business Info</TabsTrigger>
                  <TabsTrigger value="store">Store Settings</TabsTrigger>
                  <TabsTrigger value="policies">Policies</TabsTrigger>
                </TabsList>

                <TabsContent value="business" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Business Information</CardTitle>
                      <CardDescription>Update your business details and contact information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="businessName">Business Name</Label>
                          <Input
                            id="businessName"
                            value={profileData.businessName}
                            onChange={(e) => setProfileData((prev) => ({ ...prev, businessName: e.target.value }))}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contactName">Contact Name</Label>
                          <Input
                            id="contactName"
                            value={profileData.contactName}
                            onChange={(e) => setProfileData((prev) => ({ ...prev, contactName: e.target.value }))}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData((prev) => ({ ...prev, email: e.target.value }))}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData((prev) => ({ ...prev, phone: e.target.value }))}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="businessType">Business Type</Label>
                          <Input
                            id="businessType"
                            value={profileData.businessType}
                            onChange={(e) => setProfileData((prev) => ({ ...prev, businessType: e.target.value }))}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="taxId">Tax ID</Label>
                          <Input
                            id="taxId"
                            value={profileData.taxId}
                            onChange={(e) => setProfileData((prev) => ({ ...prev, taxId: e.target.value }))}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={profileData.location}
                          onChange={(e) => setProfileData((prev) => ({ ...prev, location: e.target.value }))}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          type="url"
                          value={profileData.website}
                          onChange={(e) => setProfileData((prev) => ({ ...prev, website: e.target.value }))}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Business Description</Label>
                        <Textarea
                          id="bio"
                          value={profileData.bio}
                          onChange={(e) => setProfileData((prev) => ({ ...prev, bio: e.target.value }))}
                          disabled={!isEditing}
                          rows={4}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="store" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Store Configuration</CardTitle>
                      <CardDescription>Configure your store settings and preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="businessHours">Business Hours</Label>
                        <Input
                          id="businessHours"
                          value={storeSettings.businessHours}
                          onChange={(e) => setStoreSettings((prev) => ({ ...prev, businessHours: e.target.value }))}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Auto-Reply Messages</Label>
                          <p className="text-sm text-muted-foreground">Automatically respond to customer inquiries</p>
                        </div>
                        <Switch
                          checked={storeSettings.autoReply}
                          onCheckedChange={(checked) => setStoreSettings((prev) => ({ ...prev, autoReply: checked }))}
                          disabled={!isEditing}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="policies" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Store Policies</CardTitle>
                      <CardDescription>Define your shipping, return, and other policies</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="shippingPolicy">Shipping Policy</Label>
                        <Textarea
                          id="shippingPolicy"
                          value={storeSettings.shippingPolicy}
                          onChange={(e) => setStoreSettings((prev) => ({ ...prev, shippingPolicy: e.target.value }))}
                          disabled={!isEditing}
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="returnPolicy">Return Policy</Label>
                        <Textarea
                          id="returnPolicy"
                          value={storeSettings.returnPolicy}
                          onChange={(e) => setStoreSettings((prev) => ({ ...prev, returnPolicy: e.target.value }))}
                          disabled={!isEditing}
                          rows={3}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </RoleGuard>
  )
}
