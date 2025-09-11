// app/profile/page.tsx
'use client';

import { useState } from 'react';
import { Edit, Save, X, Shield, Wallet, Copy, User, Settings, TrendingUp } from 'lucide-react';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/auth-context';

export default function ProfilePage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || 'Alex',
    lastName: user?.lastName || 'Johnson',
    company: 'Johnson Trading LLC',
    location: 'New York, NY',
    bio: 'Commodity trader with focus on precious metals and agricultural products.',
    principalId: user?.principalId || 'nfid_abc123def456ghi789',
    walletAddress: user?.walletAddress || 'wallet_xyz123abc456def789',
    authMethod: user?.authMethod || 'nfid',
    kycStatus: user?.kycStatus || 'pending',
    verified: user?.verified || false,
  });

  const [preferences, setPreferences] = useState({
    notifications: true,
    marketAlerts: true,
    priceAlerts: true,
    publicProfile: true,
  });

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: 'Profile Updated',
      description: 'Your profile has been successfully updated.',
    });
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied',
      description: `${type} copied to clipboard.`,
    });
  };

  return (
    <DashboardLayout userRole={user?.role || 'buyer'}>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Profile</h1>
            <p className="text-muted-foreground">Manage your account and preferences</p>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)} size="sm">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave} size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6 text-center">
                <Avatar className="h-20 w-20 mx-auto mb-4">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="text-lg">
                    {profileData.firstName.charAt(0)}
                    {profileData.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <h2 className="text-xl font-bold mb-1">
                  {profileData.firstName} {profileData.lastName}
                </h2>

                <p className="text-muted-foreground mb-3">{profileData.company}</p>

                <div className="flex justify-center gap-2 mb-4">
                  {profileData.verified && (
                    <Badge variant="outline">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  <Badge variant={profileData.kycStatus === 'completed' ? 'default' : 'secondary'}>
                    KYC {profileData.kycStatus}
                  </Badge>
                </div>

                <div className="text-sm text-muted-foreground">{profileData.location}</div>
              </CardContent>
            </Card>

            {/* Wallet Info */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Wallet
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Authentication</Label>
                  <div className="flex items-center justify-between mt-1">
                    <Badge variant={profileData.authMethod === 'nfid' ? 'default' : 'secondary'}>
                      {profileData.authMethod === 'nfid' ? 'NFID' : 'Internet Identity'}
                    </Badge>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Principal ID</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-xs bg-muted p-2 rounded flex-1 font-mono truncate">
                      {profileData.principalId}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(profileData.principalId, 'Principal ID')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={profileData.firstName}
                          onChange={(e) =>
                            setProfileData((prev) => ({ ...prev, firstName: e.target.value }))
                          }
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={profileData.lastName}
                          onChange={(e) =>
                            setProfileData((prev) => ({ ...prev, lastName: e.target.value }))
                          }
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={profileData.company}
                        onChange={(e) =>
                          setProfileData((prev) => ({ ...prev, company: e.target.value }))
                        }
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={profileData.location}
                        onChange={(e) =>
                          setProfileData((prev) => ({ ...prev, location: e.target.value }))
                        }
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profileData.bio}
                        onChange={(e) =>
                          setProfileData((prev) => ({ ...prev, bio: e.target.value }))
                        }
                        disabled={!isEditing}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* KYC Status */}
                <Card>
                  <CardHeader>
                    <CardTitle>Verification Status</CardTitle>
                    <CardDescription>Your account verification progress</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">KYC Verification</div>
                        <div className="text-sm text-muted-foreground">
                          {profileData.kycStatus === 'completed'
                            ? 'Your identity has been verified'
                            : 'Complete KYC to unlock full trading features'}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={profileData.kycStatus === 'completed' ? 'default' : 'secondary'}
                        >
                          {profileData.kycStatus}
                        </Badge>
                        {profileData.kycStatus !== 'completed' && (
                          <Button size="sm" variant="outline" asChild>
                            <a href="/kyc">Complete KYC</a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preferences" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>Manage your notification preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications in browser
                        </p>
                      </div>
                      <Switch
                        checked={preferences.notifications}
                        onCheckedChange={(checked) =>
                          setPreferences((prev) => ({ ...prev, notifications: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Market Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified about market changes
                        </p>
                      </div>
                      <Switch
                        checked={preferences.marketAlerts}
                        onCheckedChange={(checked) =>
                          setPreferences((prev) => ({ ...prev, marketAlerts: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Price Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Notifications for price targets
                        </p>
                      </div>
                      <Switch
                        checked={preferences.priceAlerts}
                        onCheckedChange={(checked) =>
                          setPreferences((prev) => ({ ...prev, priceAlerts: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Public Profile</Label>
                        <p className="text-sm text-muted-foreground">
                          Make profile visible to others
                        </p>
                      </div>
                      <Switch
                        checked={preferences.publicProfile}
                        onCheckedChange={(checked) =>
                          setPreferences((prev) => ({ ...prev, publicProfile: checked }))
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <a href="/trading-history">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        View Trading History
                      </a>
                    </Button>
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <a href="/settings">
                        <Settings className="h-4 w-4 mr-2" />
                        Account Settings
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
