"use client"

import { useState } from "react"
import { Camera, Edit, Save, X, Shield, Star, MapPin, Calendar, Mail } from "lucide-react"

import { DashboardLayout } from "@/components/layouts/dashboard-layout"
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

export default function ProfilePage() {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: "Alex",
    lastName: "Johnson",
    email: "alex.johnson@email.com",
    phone: "+1 (555) 123-4567",
    bio: "Experienced commodity trader with a focus on precious metals and agricultural products. Active on TradeChain since 2019.",
    location: "New York, NY",
    website: "https://alexjohnson.com",
    company: "Johnson Trading LLC",
    avatar: "/placeholder.svg?height=120&width=120",
    joinDate: "March 2019",
    verified: true,
    rating: 4.8,
    totalTrades: 127,
    successRate: 98.5,
  })

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    marketAlerts: true,
    priceAlerts: true,
    orderUpdates: true,
    newsletter: false,
    twoFactorAuth: true,
    publicProfile: true,
    showTradingStats: true,
  })

  const handleSave = () => {
    setIsEditing(false)
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
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
    <DashboardLayout userRole="buyer">
      <div className="container mx-auto px-4 py-6 pb-20 lg:pb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Profile</h1>
            <p className="text-muted-foreground">Manage your account information and preferences</p>
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
                      <AvatarFallback className="text-lg">
                        {profileData.firstName.charAt(0)}
                        {profileData.lastName.charAt(0)}
                      </AvatarFallback>
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
                      <h2 className="text-xl font-bold">
                        {profileData.firstName} {profileData.lastName}
                      </h2>
                      {profileData.verified && (
                        <Badge variant="outline" className="text-xs">
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground">{profileData.company}</p>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{profileData.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Joined {profileData.joinDate}</span>
                    </div>
                  </div>

                  <div className="w-full pt-4 border-t">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold">{profileData.totalTrades}</div>
                        <div className="text-xs text-muted-foreground">Total Trades</div>
                      </div>
                      <div>
                        <div className="flex items-center justify-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-2xl font-bold">{profileData.rating}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">Rating</div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="text-lg font-bold text-green-600">{profileData.successRate}%</div>
                      <div className="text-xs text-muted-foreground">Success Rate</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Shield className="h-4 w-4 mr-2" />
                  Security Settings
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Star className="h-4 w-4 mr-2" />
                  Trading History
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
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details and contact information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={profileData.firstName}
                          onChange={(e) => setProfileData((prev) => ({ ...prev, firstName: e.target.value }))}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={profileData.lastName}
                          onChange={(e) => setProfileData((prev) => ({ ...prev, lastName: e.target.value }))}
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

                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={profileData.company}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, company: e.target.value }))}
                        disabled={!isEditing}
                      />
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
                      <Label htmlFor="bio">Bio</Label>
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

              <TabsContent value="preferences" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Choose how you want to receive notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                      <Switch
                        checked={preferences.emailNotifications}
                        onCheckedChange={(checked) =>
                          setPreferences((prev) => ({ ...prev, emailNotifications: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive push notifications in browser</p>
                      </div>
                      <Switch
                        checked={preferences.pushNotifications}
                        onCheckedChange={(checked) =>
                          setPreferences((prev) => ({ ...prev, pushNotifications: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Market Alerts</Label>
                        <p className="text-sm text-muted-foreground">Get notified about market changes</p>
                      </div>
                      <Switch
                        checked={preferences.marketAlerts}
                        onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, marketAlerts: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Price Alerts</Label>
                        <p className="text-sm text-muted-foreground">Notifications when prices hit your targets</p>
                      </div>
                      <Switch
                        checked={preferences.priceAlerts}
                        onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, priceAlerts: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Order Updates</Label>
                        <p className="text-sm text-muted-foreground">Updates about your orders and deliveries</p>
                      </div>
                      <Switch
                        checked={preferences.orderUpdates}
                        onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, orderUpdates: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Newsletter</Label>
                        <p className="text-sm text-muted-foreground">Weekly market insights and platform updates</p>
                      </div>
                      <Switch
                        checked={preferences.newsletter}
                        onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, newsletter: checked }))}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Privacy Settings</CardTitle>
                    <CardDescription>Control your privacy and data sharing preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Public Profile</Label>
                        <p className="text-sm text-muted-foreground">Make your profile visible to other users</p>
                      </div>
                      <Switch
                        checked={preferences.publicProfile}
                        onCheckedChange={(checked) => setPreferences((prev) => ({ ...prev, publicProfile: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Show Trading Stats</Label>
                        <p className="text-sm text-muted-foreground">Display your trading statistics publicly</p>
                      </div>
                      <Switch
                        checked={preferences.showTradingStats}
                        onCheckedChange={(checked) =>
                          setPreferences((prev) => ({ ...prev, showTradingStats: checked }))
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Manage your account security and authentication</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={preferences.twoFactorAuth ? "default" : "secondary"}>
                          {preferences.twoFactorAuth ? "Enabled" : "Disabled"}
                        </Badge>
                        <Button variant="outline" size="sm" className="bg-transparent">
                          {preferences.twoFactorAuth ? "Disable" : "Enable"}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Change Password</Label>
                      <div className="space-y-2">
                        <Input type="password" placeholder="Current password" />
                        <Input type="password" placeholder="New password" />
                        <Input type="password" placeholder="Confirm new password" />
                        <Button variant="outline" size="sm" className="bg-transparent">
                          Update Password
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Account Verification</CardTitle>
                    <CardDescription>Your verification status and documents</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Identity Verification</Label>
                        <p className="text-sm text-muted-foreground">KYC verification status</p>
                      </div>
                      <Badge variant="default">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Address Verification</Label>
                        <p className="text-sm text-muted-foreground">Proof of address verification</p>
                      </div>
                      <Badge variant="default">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Phone Verification</Label>
                        <p className="text-sm text-muted-foreground">Phone number verification</p>
                      </div>
                      <Badge variant="default">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Login Activity</CardTitle>
                    <CardDescription>Recent login sessions and devices</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockLoginActivity.map((activity, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">{activity.device}</div>
                            <div className="text-sm text-muted-foreground">
                              {activity.location} • {activity.time}
                            </div>
                          </div>
                          <Badge variant={activity.current ? "default" : "secondary"}>
                            {activity.current ? "Current" : "Previous"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

// Mock data
const mockLoginActivity = [
  {
    device: "Chrome on Windows",
    location: "New York, NY",
    time: "2 hours ago",
    current: true,
  },
  {
    device: "Safari on iPhone",
    location: "New York, NY",
    time: "1 day ago",
    current: false,
  },
  {
    device: "Firefox on macOS",
    location: "Boston, MA",
    time: "3 days ago",
    current: false,
  },
  {
    device: "Chrome on Android",
    location: "New York, NY",
    time: "1 week ago",
    current: false,
  },
]
