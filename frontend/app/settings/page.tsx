"use client"

import { useState } from "react"
import { Shield, Bell, CreditCard, Globe, User } from "lucide-react"

import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"

export default function SettingsPage() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [settings, setSettings] = useState({
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    marketAlerts: true,
    priceAlerts: true,
    orderUpdates: true,
    promotionalEmails: false,
    weeklyDigest: true,

    // Privacy Settings
    profileVisibility: "public",
    showTradingHistory: true,
    showContactInfo: false,
    allowDirectMessages: true,

    // Security Settings
    twoFactorAuth: true,
    loginAlerts: true,
    sessionTimeout: "30",

    // Display Settings
    theme: "system",
    language: "en",
    timezone: "America/New_York",
    currency: "USD",

    // Trading Settings
    defaultOrderType: "market",
    confirmationRequired: true,
    autoSave: true,
  })

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been successfully updated.",
    })
  }

  const handleReset2FA = () => {
    toast({
      title: "2FA Reset",
      description: "Two-factor authentication has been reset. Please set it up again.",
    })
  }

  const handleExportData = () => {
    toast({
      title: "Data Export",
      description: "Your data export has been initiated. You'll receive an email when ready.",
    })
  }

  return (
    <DashboardLayout userRole={user?.role === "buyer" || user?.role === "seller" ? user.role : undefined}>
      <div className="container mx-auto px-4 py-6 pb-20 lg:pb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your account preferences and security settings</p>
          </div>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>

        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="display">Display</TabsTrigger>
            <TabsTrigger value="trading">Trading</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Choose how you want to receive notifications and updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Delivery Methods</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                      <Switch
                        checked={settings.emailNotifications}
                        onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, emailNotifications: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive push notifications in browser</p>
                      </div>
                      <Switch
                        checked={settings.pushNotifications}
                        onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, pushNotifications: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>SMS Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive important alerts via SMS</p>
                      </div>
                      <Switch
                        checked={settings.smsNotifications}
                        onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, smsNotifications: checked }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Notification Types</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Market Alerts</Label>
                        <p className="text-sm text-muted-foreground">Price changes and market updates</p>
                      </div>
                      <Switch
                        checked={settings.marketAlerts}
                        onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, marketAlerts: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Price Alerts</Label>
                        <p className="text-sm text-muted-foreground">When prices hit your target levels</p>
                      </div>
                      <Switch
                        checked={settings.priceAlerts}
                        onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, priceAlerts: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Order Updates</Label>
                        <p className="text-sm text-muted-foreground">Status changes for your orders</p>
                      </div>
                      <Switch
                        checked={settings.orderUpdates}
                        onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, orderUpdates: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Promotional Emails</Label>
                        <p className="text-sm text-muted-foreground">Special offers and promotions</p>
                      </div>
                      <Switch
                        checked={settings.promotionalEmails}
                        onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, promotionalEmails: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Weekly Digest</Label>
                        <p className="text-sm text-muted-foreground">Weekly summary of market activity</p>
                      </div>
                      <Switch
                        checked={settings.weeklyDigest}
                        onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, weeklyDigest: checked }))}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Privacy Settings
                </CardTitle>
                <CardDescription>Control your privacy and data sharing preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="profileVisibility">Profile Visibility</Label>
                    <Select
                      value={settings.profileVisibility}
                      onValueChange={(value) => setSettings((prev) => ({ ...prev, profileVisibility: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public - Visible to everyone</SelectItem>
                        <SelectItem value="members">Members Only - Visible to registered users</SelectItem>
                        <SelectItem value="private">Private - Only visible to you</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Trading History</Label>
                      <p className="text-sm text-muted-foreground">Display your trading statistics publicly</p>
                    </div>
                    <Switch
                      checked={settings.showTradingHistory}
                      onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, showTradingHistory: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Contact Information</Label>
                      <p className="text-sm text-muted-foreground">Allow others to see your contact details</p>
                    </div>
                    <Switch
                      checked={settings.showContactInfo}
                      onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, showContactInfo: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Allow Direct Messages</Label>
                      <p className="text-sm text-muted-foreground">Let other users send you direct messages</p>
                    </div>
                    <Switch
                      checked={settings.allowDirectMessages}
                      onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, allowDirectMessages: checked }))}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Data Export</h4>
                      <p className="text-sm text-muted-foreground">Download a copy of your data</p>
                    </div>
                    <Button variant="outline" onClick={handleExportData} className="bg-transparent">
                      Export Data
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>Manage your account security and authentication</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={settings.twoFactorAuth ? "default" : "secondary"}>
                        {settings.twoFactorAuth ? "Enabled" : "Disabled"}
                      </Badge>
                      <Button variant="outline" size="sm" onClick={handleReset2FA} className="bg-transparent">
                        {settings.twoFactorAuth ? "Reset" : "Enable"}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Login Alerts</Label>
                      <p className="text-sm text-muted-foreground">Get notified of new login attempts</p>
                    </div>
                    <Switch
                      checked={settings.loginAlerts}
                      onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, loginAlerts: checked }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Select
                      value={settings.sessionTimeout}
                      onValueChange={(value) => setSettings((prev) => ({ ...prev, sessionTimeout: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="space-y-4">
                    <h4 className="font-medium">Password</h4>
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" placeholder="Enter current password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" placeholder="Enter new password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
                    </div>
                    <Button variant="outline" className="bg-transparent">
                      Update Password
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="display" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Display Settings
                </CardTitle>
                <CardDescription>Customize your interface and regional preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select
                      value={settings.theme}
                      onValueChange={(value) => setSettings((prev) => ({ ...prev, theme: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select
                      value={settings.language}
                      onValueChange={(value) => setSettings((prev) => ({ ...prev, language: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="zh">Chinese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={settings.timezone}
                      onValueChange={(value) => setSettings((prev) => ({ ...prev, timezone: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                        <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                        <SelectItem value="Europe/London">London (GMT)</SelectItem>
                        <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                        <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={settings.currency}
                      onValueChange={(value) => setSettings((prev) => ({ ...prev, currency: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                        <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trading" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Trading Preferences
                </CardTitle>
                <CardDescription>Configure your default trading settings and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="defaultOrderType">Default Order Type</Label>
                    <Select
                      value={settings.defaultOrderType}
                      onValueChange={(value) => setSettings((prev) => ({ ...prev, defaultOrderType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="market">Market Order</SelectItem>
                        <SelectItem value="limit">Limit Order</SelectItem>
                        <SelectItem value="stop">Stop Order</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Confirmation Required</Label>
                      <p className="text-sm text-muted-foreground">Require confirmation before placing orders</p>
                    </div>
                    <Switch
                      checked={settings.confirmationRequired}
                      onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, confirmationRequired: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-Save Drafts</Label>
                      <p className="text-sm text-muted-foreground">Automatically save order drafts</p>
                    </div>
                    <Switch
                      checked={settings.autoSave}
                      onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, autoSave: checked }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
