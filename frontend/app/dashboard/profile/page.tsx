// app/dashboard/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Camera,
  Edit,
  Save,
  X,
  Shield,
  Star,
  MapPin,
  Calendar,
  Mail,
  Phone,
  Globe,
  Building,
  Wallet,
} from 'lucide-react';
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
import { useContentPadding } from '@/contexts/sidebar-context';
import { useAuth } from '@/contexts/auth-context';
import Link from 'next/link';

export default function ProfilePage() {
  const { toast } = useToast();
  const { contentPadding } = useContentPadding();
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize profile data from user context
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    website: '',
    company: '',
    avatar: '/placeholder.svg?height=120&width=120',
    joinDate: '',
    verified: false,
    rating: 0,
    totalTrades: 0,
    successRate: 0,
    walletAddress: '',
  });

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
    darkMode: false,
  });

  // Load user data when component mounts or user changes
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || 'User',
        lastName: user.lastName || 'Name',
        email: user.principalId || 'user@example.com',
        phone: user.phone || '',
        bio:
          user.bio ||
          (user.role === 'seller'
            ? 'Experienced commodity seller specializing in precious metals and agricultural products. Verified supplier with excellent ratings.'
            : 'Experienced commodity trader with a focus on precious metals and agricultural products. Active on TradeChain since 2024.'),
        location: user.location || 'Location not set',
        website: user.website || '',
        company: user.company || (user.role === 'seller' ? 'Premium Metals Co.' : 'Trading LLC'),
        avatar: '/placeholder.svg?height=120&width=120',
        joinDate: user.joinedAt
          ? new Date(user.joinedAt).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })
          : 'Recently',
        verified: user.verified || user.kycStatus === 'completed',
        rating: user.role === 'seller' ? 4.9 : 4.8,
        totalTrades: user.role === 'seller' ? 89 : 127,
        successRate: user.role === 'seller' ? 99.2 : 98.5,
        walletAddress: user.walletAddress || 'Not connected',
      });
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Update profile via context
      await updateProfile({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone,
        bio: profileData.bio,
        location: profileData.location,
        website: profileData.website,
        company: profileData.company,
      });

      setIsEditing(false);
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
      });
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: 'Update Failed',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original user data
    if (user) {
      setProfileData((prev) => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        phone: user.phone || prev.phone,
        bio: user.bio || prev.bio,
        location: user.location || prev.location,
        website: user.website || prev.website,
        company: user.company || prev.company,
      }));
    }
  };

  const handleAvatarChange = () => {
    toast({
      title: 'Avatar Upload',
      description: 'Avatar upload functionality will be available soon.',
    });
  };

  const getInitials = () => {
    return `${profileData.firstName.charAt(0)}${profileData.lastName.charAt(0)}`;
  };

  const StatCard = ({
    icon: Icon,
    label,
    value,
    color = 'default',
  }: {
    icon: any;
    label: string;
    value: string | number;
    color?: string;
  }) => (
    <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
      <div
        className={`p-2 rounded-full ${
          color === 'success'
            ? 'bg-green-100 text-green-600'
            : color === 'warning'
            ? 'bg-yellow-100 text-yellow-600'
            : color === 'primary'
            ? 'bg-primary/10 text-primary'
            : 'bg-muted text-muted-foreground'
        }`}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );

  return (
    <div className={`py-6 pb-20 lg:pb-8 ${contentPadding}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">Manage your account information and preferences</p>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                size="sm"
                className="bg-transparent"
                disabled={isSaving}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} size="sm" disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
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

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profileData.avatar || '/placeholder.svg'} />
                    <AvatarFallback className="text-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                      {getInitials()}
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

                <div className="space-y-2 w-full">
                  <div className="flex items-center justify-center gap-2">
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

                  <Badge variant="secondary" className="capitalize">
                    {user?.role}
                  </Badge>

                  <p className="text-muted-foreground text-sm">{profileData.company}</p>

                  <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{profileData.location}</span>
                  </div>

                  <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {profileData.joinDate}</span>
                  </div>
                </div>

                <div className="w-full pt-4 border-t space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{profileData.totalTrades}</div>
                      <div className="text-xs text-muted-foreground">
                        {user?.role === 'seller' ? 'Sales' : 'Trades'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-2xl font-bold">{profileData.rating}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">Rating</div>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">
                      {profileData.successRate}%
                    </div>
                    <div className="text-xs text-muted-foreground">Success Rate</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats for Mobile */}
          <div className="mt-6 lg:hidden grid grid-cols-1 gap-3">
            <StatCard
              icon={user?.role === 'seller' ? Building : Wallet}
              label={user?.role === 'seller' ? 'Total Revenue' : 'Portfolio Value'}
              value={user?.role === 'seller' ? '$45,231' : '$127,450'}
              color="success"
            />
            <StatCard icon={Star} label="Reputation Score" value="Excellent" color="primary" />
          </div>

          {/* Quick Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                <Link href="/dashboard/settings">
                  <Shield className="h-4 w-4 mr-2" />
                  Security Settings
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                <Link href={`/dashboard/${user?.role}`}>
                  <Star className="h-4 w-4 mr-2" />
                  {user?.role === 'seller' ? 'Sales History' : 'Trading History'}
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                <Link href="/help">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Support
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" value={profileData.email} disabled={true} />
                    <p className="text-xs text-muted-foreground">
                      Email is linked to your wallet and cannot be changed
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) =>
                          setProfileData((prev) => ({ ...prev, phone: e.target.value }))
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
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        type="url"
                        value={profileData.website}
                        onChange={(e) =>
                          setProfileData((prev) => ({ ...prev, website: e.target.value }))
                        }
                        disabled={!isEditing}
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, bio: e.target.value }))}
                      disabled={!isEditing}
                      rows={4}
                      placeholder="Tell others about yourself and your trading experience..."
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Wallet Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Wallet Information</CardTitle>
                  <CardDescription>Your connected wallet details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Connected Wallet</Label>
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                      <Wallet className="h-4 w-4 text-primary" />
                      <span className="font-mono text-sm">{profileData.walletAddress}</span>
                      <Badge variant="outline" className="ml-auto">
                        {user?.authMethod === 'nfid' ? 'NFID' : 'Internet Identity'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Your wallet is securely connected via{' '}
                      {user?.authMethod === 'nfid' ? 'NFID' : 'Internet Identity'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              {/* Notification Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Choose how you want to receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
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
                      <p className="text-sm text-muted-foreground">
                        Receive push notifications in browser
                      </p>
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
                    <div className="space-y-0.5">
                      <Label>Price Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Notifications when prices hit your targets
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
                    <div className="space-y-0.5">
                      <Label>Order Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Updates about your orders and deliveries
                      </p>
                    </div>
                    <Switch
                      checked={preferences.orderUpdates}
                      onCheckedChange={(checked) =>
                        setPreferences((prev) => ({ ...prev, orderUpdates: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Newsletter</Label>
                      <p className="text-sm text-muted-foreground">
                        Weekly market insights and platform updates
                      </p>
                    </div>
                    <Switch
                      checked={preferences.newsletter}
                      onCheckedChange={(checked) =>
                        setPreferences((prev) => ({ ...prev, newsletter: checked }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Privacy Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>
                    Control your privacy and data sharing preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Public Profile</Label>
                      <p className="text-sm text-muted-foreground">
                        Make your profile visible to other users
                      </p>
                    </div>
                    <Switch
                      checked={preferences.publicProfile}
                      onCheckedChange={(checked) =>
                        setPreferences((prev) => ({ ...prev, publicProfile: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Trading Stats</Label>
                      <p className="text-sm text-muted-foreground">
                        Display your trading statistics publicly
                      </p>
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
              {/* Security Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your account security and authentication</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={preferences.twoFactorAuth ? 'default' : 'secondary'}>
                        {preferences.twoFactorAuth ? 'Enabled' : 'Disabled'}
                      </Badge>
                      <Button variant="outline" size="sm" className="bg-transparent">
                        {preferences.twoFactorAuth ? 'Disable' : 'Enable'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Verification */}
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
                    <Badge variant={user?.kycStatus === 'completed' ? 'default' : 'secondary'}>
                      <Shield className="h-3 w-3 mr-1" />
                      {user?.kycStatus === 'completed'
                        ? 'Verified'
                        : user?.kycStatus === 'inReview'
                        ? 'In Review'
                        : user?.kycStatus === 'rejected'
                        ? 'Rejected'
                        : 'Pending'}
                    </Badge>
                  </div>

                  {user?.kycStatus !== 'completed' && (
                    <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        {user?.kycStatus === 'inReview'
                          ? 'Your KYC verification is currently being reviewed. You will be notified once complete.'
                          : user?.kycStatus === 'rejected'
                          ? 'Your KYC verification was rejected. Please resubmit with correct documents.'
                          : 'Complete your KYC verification to unlock all trading features.'}
                      </p>
                      {user?.kycStatus !== 'inReview' && (
                        <Button variant="outline" size="sm" className="mt-2" asChild>
                          <Link href="/dashboard/kyc">
                            {user?.kycStatus === 'rejected'
                              ? 'Resubmit Verification'
                              : 'Complete Verification'}
                          </Link>
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Login Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Login Activity</CardTitle>
                  <CardDescription>Your recent login sessions and devices</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockLoginActivity.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <div className="font-medium">{activity.device}</div>
                          <div className="text-sm text-muted-foreground">
                            {activity.location} • {activity.time}
                          </div>
                        </div>
                        <Badge variant={activity.current ? 'default' : 'secondary'}>
                          {activity.current ? 'Current' : 'Previous'}
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
  );
}

// Mock data
const mockLoginActivity = [
  {
    device: 'Chrome on Windows',
    location: 'Lagos, Nigeria',
    time: '2 hours ago',
    current: true,
  },
  {
    device: 'Safari on iPhone',
    location: 'Lagos, Nigeria',
    time: '1 day ago',
    current: false,
  },
  {
    device: 'Firefox on macOS',
    location: 'Abuja, Nigeria',
    time: '3 days ago',
    current: false,
  },
  {
    device: 'Chrome on Android',
    location: 'Lagos, Nigeria',
    time: '1 week ago',
    current: false,
  },
];
