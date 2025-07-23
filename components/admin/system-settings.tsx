"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import {
  Settings,
  Save,
  RefreshCw,
  Bell,
  Shield,
  DollarSign,
  Database,
  Globe,
  Palette,
  Upload,
  Download,
} from "lucide-react"

export function SystemSettings() {
  const [isSaving, setIsSaving] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  // Mock system settings
  const [settings, setSettings] = useState({
    general: {
      siteName: "Nithub Space Management",
      siteDescription: "Nigeria's premier tech innovation hub",
      contactEmail: "admin@nithub.com",
      supportPhone: "+234 123 456 7890",
      timezone: "Africa/Lagos",
      currency: "NGN",
      language: "en",
      maintenanceMode: false,
    },
    booking: {
      maxAdvanceBookingDays: 90,
      minBookingDuration: 1,
      maxBookingDuration: 30,
      cancellationDeadlineHours: 24,
      autoConfirmBookings: true,
      requirePaymentUpfront: false,
      allowWeekendBookings: true,
      businessHoursStart: "08:00",
      businessHoursEnd: "22:00",
    },
    payments: {
      enableCardPayments: true,
      enableBankTransfer: true,
      enableNFCPayments: true,
      enableCashPayments: true,
      taxRate: 7.5,
      lateFeePercentage: 10,
      refundProcessingDays: 7,
      paymentGateway: "paystack",
      minimumPaymentAmount: 1000,
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      bookingReminders: true,
      paymentReminders: true,
      adminAlerts: true,
      reminderHoursBefore: 24,
      maxRetryAttempts: 3,
    },
    security: {
      requireEmailVerification: true,
      enableTwoFactor: false,
      sessionTimeoutMinutes: 30,
      maxLoginAttempts: 5,
      passwordMinLength: 8,
      requireStrongPasswords: true,
      enableApiRateLimit: true,
      maxApiRequestsPerHour: 1000,
    },
    appearance: {
      defaultTheme: "system",
      primaryColor: "#0EA5E9",
      secondaryColor: "#10B981",
      logoUrl: "",
      faviconUrl: "",
      customCSS: "",
    },
  })

  const updateSetting = (category: keyof typeof settings, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }))
  }

  const saveSettings = async () => {
    setIsSaving(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In a real app, this would save to the backend
      localStorage.setItem("systemSettings", JSON.stringify(settings))

      toast({
        title: "Settings Saved",
        description: "System settings have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Unable to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const exportSettings = async () => {
    setIsExporting(true)
    try {
      const dataStr = JSON.stringify(settings, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `nithub-settings-${new Date().toISOString().split("T")[0]}.json`
      link.click()
      URL.revokeObjectURL(url)

      toast({
        title: "Settings Exported",
        description: "Settings have been exported successfully.",
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Unable to export settings.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target?.result as string)
        setSettings(importedSettings)
        toast({
          title: "Settings Imported",
          description: "Settings have been imported successfully.",
        })
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Invalid settings file format.",
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                System Settings
              </CardTitle>
              <CardDescription>Configure system-wide settings and preferences</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportSettings} disabled={isExporting}>
                {isExporting ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                Export
              </Button>
              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={importSettings}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Import
                </Button>
              </div>
              <Button onClick={saveSettings} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="booking">Booking</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                General Settings
              </CardTitle>
              <CardDescription>Basic site configuration and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.general.siteName}
                    onChange={(e) => updateSetting("general", "siteName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.general.contactEmail}
                    onChange={(e) => updateSetting("general", "contactEmail", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.general.siteDescription}
                  onChange={(e) => updateSetting("general", "siteDescription", e.target.value)}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="supportPhone">Support Phone</Label>
                  <Input
                    id="supportPhone"
                    value={settings.general.supportPhone}
                    onChange={(e) => updateSetting("general", "supportPhone", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={settings.general.timezone}
                    onValueChange={(value) => updateSetting("general", "timezone", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Lagos">Africa/Lagos (WAT)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                      <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={settings.general.currency}
                    onValueChange={(value) => updateSetting("general", "currency", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NGN">Nigerian Naira (₦)</SelectItem>
                      <SelectItem value="USD">US Dollar ($)</SelectItem>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                      <SelectItem value="GBP">British Pound (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={settings.general.language}
                    onValueChange={(value) => updateSetting("general", "language", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="yo">Yoruba</SelectItem>
                      <SelectItem value="ig">Igbo</SelectItem>
                      <SelectItem value="ha">Hausa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">Enable maintenance mode to prevent new bookings</p>
                </div>
                <Switch
                  checked={settings.general.maintenanceMode}
                  onCheckedChange={(checked) => updateSetting("general", "maintenanceMode", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="booking">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Booking Configuration
              </CardTitle>
              <CardDescription>Configure booking rules and limitations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="maxAdvanceBooking">Max Advance Booking (days)</Label>
                  <Input
                    id="maxAdvanceBooking"
                    type="number"
                    value={settings.booking.maxAdvanceBookingDays}
                    onChange={(e) => updateSetting("booking", "maxAdvanceBookingDays", Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cancellationDeadline">Cancellation Deadline (hours)</Label>
                  <Input
                    id="cancellationDeadline"
                    type="number"
                    value={settings.booking.cancellationDeadlineHours}
                    onChange={(e) => updateSetting("booking", "cancellationDeadlineHours", Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="minBookingDuration">Min Booking Duration (hours)</Label>
                  <Input
                    id="minBookingDuration"
                    type="number"
                    value={settings.booking.minBookingDuration}
                    onChange={(e) => updateSetting("booking", "minBookingDuration", Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxBookingDuration">Max Booking Duration (days)</Label>
                  <Input
                    id="maxBookingDuration"
                    type="number"
                    value={settings.booking.maxBookingDuration}
                    onChange={(e) => updateSetting("booking", "maxBookingDuration", Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="businessHoursStart">Business Hours Start</Label>
                  <Input
                    id="businessHoursStart"
                    type="time"
                    value={settings.booking.businessHoursStart}
                    onChange={(e) => updateSetting("booking", "businessHoursStart", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessHoursEnd">Business Hours End</Label>
                  <Input
                    id="businessHoursEnd"
                    type="time"
                    value={settings.booking.businessHoursEnd}
                    onChange={(e) => updateSetting("booking", "businessHoursEnd", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Auto-confirm Bookings</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically confirm bookings without manual review
                    </p>
                  </div>
                  <Switch
                    checked={settings.booking.autoConfirmBookings}
                    onCheckedChange={(checked) => updateSetting("booking", "autoConfirmBookings", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Require Payment Upfront</Label>
                    <p className="text-sm text-muted-foreground">Require payment before confirming bookings</p>
                  </div>
                  <Switch
                    checked={settings.booking.requirePaymentUpfront}
                    onCheckedChange={(checked) => updateSetting("booking", "requirePaymentUpfront", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Allow Weekend Bookings</Label>
                    <p className="text-sm text-muted-foreground">Allow bookings on weekends</p>
                  </div>
                  <Switch
                    checked={settings.booking.allowWeekendBookings}
                    onCheckedChange={(checked) => updateSetting("booking", "allowWeekendBookings", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Payment Configuration
              </CardTitle>
              <CardDescription>Configure payment methods and pricing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Payment Methods</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Credit/Debit Cards</Label>
                    <p className="text-sm text-muted-foreground">Accept card payments via payment gateway</p>
                  </div>
                  <Switch
                    checked={settings.payments.enableCardPayments}
                    onCheckedChange={(checked) => updateSetting("payments", "enableCardPayments", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Bank Transfer</Label>
                    <p className="text-sm text-muted-foreground">Accept bank transfer payments</p>
                  </div>
                  <Switch
                    checked={settings.payments.enableBankTransfer}
                    onCheckedChange={(checked) => updateSetting("payments", "enableBankTransfer", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">NFC Payments</Label>
                    <p className="text-sm text-muted-foreground">Accept contactless NFC payments</p>
                  </div>
                  <Switch
                    checked={settings.payments.enableNFCPayments}
                    onCheckedChange={(checked) => updateSetting("payments", "enableNFCPayments", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Cash Payments</Label>
                    <p className="text-sm text-muted-foreground">Accept cash payments on arrival</p>
                  </div>
                  <Switch
                    checked={settings.payments.enableCashPayments}
                    onCheckedChange={(checked) => updateSetting("payments", "enableCashPayments", checked)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentGateway">Payment Gateway</Label>
                <Select
                  value={settings.payments.paymentGateway}
                  onValueChange={(value) => updateSetting("payments", "paymentGateway", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paystack">Paystack</SelectItem>
                    <SelectItem value="flutterwave">Flutterwave</SelectItem>
                    <SelectItem value="stripe">Stripe</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    step="0.1"
                    value={settings.payments.taxRate}
                    onChange={(e) => updateSetting("payments", "taxRate", Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lateFee">Late Fee (%)</Label>
                  <Input
                    id="lateFee"
                    type="number"
                    value={settings.payments.lateFeePercentage}
                    onChange={(e) => updateSetting("payments", "lateFeePercentage", Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="refundDays">Refund Processing (days)</Label>
                  <Input
                    id="refundDays"
                    type="number"
                    value={settings.payments.refundProcessingDays}
                    onChange={(e) => updateSetting("payments", "refundProcessingDays", Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minimumPayment">Minimum Payment Amount (₦)</Label>
                  <Input
                    id="minimumPayment"
                    type="number"
                    value={settings.payments.minimumPaymentAmount}
                    onChange={(e) => updateSetting("payments", "minimumPaymentAmount", Number(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>Configure system notifications and alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send notifications via email</p>
                  </div>
                  <Switch
                    checked={settings.notifications.emailNotifications}
                    onCheckedChange={(checked) => updateSetting("notifications", "emailNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send notifications via SMS</p>
                  </div>
                  <Switch
                    checked={settings.notifications.smsNotifications}
                    onCheckedChange={(checked) => updateSetting("notifications", "smsNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send browser push notifications</p>
                  </div>
                  <Switch
                    checked={settings.notifications.pushNotifications}
                    onCheckedChange={(checked) => updateSetting("notifications", "pushNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Booking Reminders</Label>
                    <p className="text-sm text-muted-foreground">Send reminders for upcoming bookings</p>
                  </div>
                  <Switch
                    checked={settings.notifications.bookingReminders}
                    onCheckedChange={(checked) => updateSetting("notifications", "bookingReminders", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Payment Reminders</Label>
                    <p className="text-sm text-muted-foreground">Send reminders for pending payments</p>
                  </div>
                  <Switch
                    checked={settings.notifications.paymentReminders}
                    onCheckedChange={(checked) => updateSetting("notifications", "paymentReminders", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Admin Alerts</Label>
                    <p className="text-sm text-muted-foreground">Send alerts to administrators</p>
                  </div>
                  <Switch
                    checked={settings.notifications.adminAlerts}
                    onCheckedChange={(checked) => updateSetting("notifications", "adminAlerts", checked)}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="reminderHours">Reminder Hours Before</Label>
                  <Input
                    id="reminderHours"
                    type="number"
                    value={settings.notifications.reminderHoursBefore}
                    onChange={(e) => updateSetting("notifications", "reminderHoursBefore", Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxRetries">Max Retry Attempts</Label>
                  <Input
                    id="maxRetries"
                    type="number"
                    value={settings.notifications.maxRetryAttempts}
                    onChange={(e) => updateSetting("notifications", "maxRetryAttempts", Number(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>Configure security and authentication settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Require Email Verification</Label>
                    <p className="text-sm text-muted-foreground">Users must verify their email address</p>
                  </div>
                  <Switch
                    checked={settings.security.requireEmailVerification}
                    onCheckedChange={(checked) => updateSetting("security", "requireEmailVerification", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Enable Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
                  </div>
                  <Switch
                    checked={settings.security.enableTwoFactor}
                    onCheckedChange={(checked) => updateSetting("security", "enableTwoFactor", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Require Strong Passwords</Label>
                    <p className="text-sm text-muted-foreground">Enforce strong password requirements</p>
                  </div>
                  <Switch
                    checked={settings.security.requireStrongPasswords}
                    onCheckedChange={(checked) => updateSetting("security", "requireStrongPasswords", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Enable API Rate Limiting</Label>
                    <p className="text-sm text-muted-foreground">Limit API requests to prevent abuse</p>
                  </div>
                  <Switch
                    checked={settings.security.enableApiRateLimit}
                    onCheckedChange={(checked) => updateSetting("security", "enableApiRateLimit", checked)}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.security.sessionTimeoutMinutes}
                    onChange={(e) => updateSetting("security", "sessionTimeoutMinutes", Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) => updateSetting("security", "maxLoginAttempts", Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">Min Password Length</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={settings.security.passwordMinLength}
                    onChange={(e) => updateSetting("security", "passwordMinLength", Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxApiRequests">Max API Requests/Hour</Label>
                  <Input
                    id="maxApiRequests"
                    type="number"
                    value={settings.security.maxApiRequestsPerHour}
                    onChange={(e) => updateSetting("security", "maxApiRequestsPerHour", Number(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance Settings
              </CardTitle>
              <CardDescription>Customize the look and feel of the application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-base">Default Theme</Label>
                  <p className="text-sm text-muted-foreground mb-3">Choose the default theme for the application</p>
                  <Select
                    value={settings.appearance.defaultTheme}
                    onValueChange={(value) => updateSetting("appearance", "defaultTheme", value)}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-base">Brand Colors</Label>
                  <p className="text-sm text-muted-foreground mb-3">Customize the primary brand colors</p>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="primaryColor">Primary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="primaryColor"
                          value={settings.appearance.primaryColor}
                          onChange={(e) => updateSetting("appearance", "primaryColor", e.target.value)}
                        />
                        <div
                          className="w-10 h-10 rounded border"
                          style={{ backgroundColor: settings.appearance.primaryColor }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="secondaryColor">Secondary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="secondaryColor"
                          value={settings.appearance.secondaryColor}
                          onChange={(e) => updateSetting("appearance", "secondaryColor", e.target.value)}
                        />
                        <div
                          className="w-10 h-10 rounded border"
                          style={{ backgroundColor: settings.appearance.secondaryColor }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="logoUrl">Logo URL</Label>
                    <Input
                      id="logoUrl"
                      placeholder="https://example.com/logo.png"
                      value={settings.appearance.logoUrl}
                      onChange={(e) => updateSetting("appearance", "logoUrl", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="faviconUrl">Favicon URL</Label>
                    <Input
                      id="faviconUrl"
                      placeholder="https://example.com/favicon.ico"
                      value={settings.appearance.faviconUrl}
                      onChange={(e) => updateSetting("appearance", "faviconUrl", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customCSS">Custom CSS</Label>
                  <Textarea
                    id="customCSS"
                    placeholder="/* Add your custom CSS here */"
                    className="font-mono text-sm"
                    rows={6}
                    value={settings.appearance.customCSS}
                    onChange={(e) => updateSetting("appearance", "customCSS", e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Add custom CSS to override default styles. Use with caution.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
