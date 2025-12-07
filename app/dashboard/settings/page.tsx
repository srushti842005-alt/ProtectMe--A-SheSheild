"use client"

import { useAuth } from "@/lib/auth-context"
import { redirect } from "next/navigation"
import { useEffect, useState } from "react"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { useSafetyTriggers } from "@/lib/safety-triggers-context"
import { Bell, Shield, MapPin, Mic, Save, Loader2, Smartphone, Activity, Clock, Lock, ChevronRight } from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  const { user, isLoading } = useAuth()
  const [isSaving, setIsSaving] = useState(false)
  const {
    shakeEnabled,
    setShakeEnabled,
    shakeThreshold,
    setShakeThreshold,
    voiceEnabled,
    setVoiceEnabled,
    voiceKeyword,
    setVoiceKeyword,
    fallDetectionEnabled,
    setFallDetectionEnabled,
    checkInEnabled,
    setCheckInEnabled,
    checkInInterval,
    setCheckInInterval,
    permissions,
    requestPermission,
  } = useSafetyTriggers()

  const [settings, setSettings] = useState({
    name: "",
    email: "",
    phone: "",
    locationSharing: true,
    autoRecording: true,
    pushNotifications: true,
    sosSound: true,
  })

  useEffect(() => {
    if (!isLoading && !user) {
      redirect("/login")
    }
    if (user) {
      setSettings((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }))
    }
  }, [user, isLoading])

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emergency border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">Manage your account and safety preferences</p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-3">
            <Link href="/dashboard/settings/privacy">
              <Card className="bg-card border-border hover:border-emergency/50 transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/20">
                    <Lock className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm">Privacy Policy</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
            <Link href="/dashboard/settings/permissions">
              <Card className="bg-card border-border hover:border-emergency/50 transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <Shield className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm">Permissions</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Profile Settings */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Profile Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-foreground">Full Name</Label>
                <Input
                  value={settings.name}
                  onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  className="bg-secondary border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Email</Label>
                <Input
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  type="email"
                  className="bg-secondary border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Phone Number</Label>
                <Input
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  type="tel"
                  placeholder="+91 00000 00000"
                  className="bg-secondary border-border text-foreground"
                />
              </div>
            </CardContent>
          </Card>

          {/* SOS Trigger Settings */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Shield className="w-5 h-5 text-emergency" />
                SOS Triggers
              </CardTitle>
              <CardDescription>Configure how to activate emergency SOS</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Shake to SOS */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-foreground flex items-center gap-2">
                      <Smartphone className="w-4 h-4" />
                      Shake to SOS
                    </Label>
                    <p className="text-sm text-muted-foreground">Shake device 3 times to trigger SOS</p>
                  </div>
                  <Switch checked={shakeEnabled} onCheckedChange={setShakeEnabled} />
                </div>
                {shakeEnabled && (
                  <div className="pl-6 space-y-2">
                    <Label className="text-sm text-muted-foreground">Sensitivity: {shakeThreshold}</Label>
                    <Slider
                      value={[shakeThreshold]}
                      onValueChange={([value]) => setShakeThreshold(value)}
                      min={15}
                      max={40}
                      step={1}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">Lower = more sensitive</p>
                  </div>
                )}
              </div>

              {/* Voice Activation */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-foreground flex items-center gap-2">
                      <Mic className="w-4 h-4" />
                      Voice Activation
                    </Label>
                    <p className="text-sm text-muted-foreground">Say keyword to trigger SOS</p>
                  </div>
                  <Switch
                    checked={voiceEnabled}
                    onCheckedChange={(checked) => {
                      if (checked && !permissions.microphone) {
                        requestPermission("microphone").then((granted) => {
                          if (granted) setVoiceEnabled(true)
                        })
                      } else {
                        setVoiceEnabled(checked)
                      }
                    }}
                  />
                </div>
                {voiceEnabled && (
                  <div className="pl-6 space-y-2">
                    <Label className="text-sm text-muted-foreground">Keyword phrase</Label>
                    <Input
                      value={voiceKeyword}
                      onChange={(e) => setVoiceKeyword(e.target.value)}
                      placeholder="help me now"
                      className="bg-secondary border-border text-foreground"
                    />
                    <p className="text-xs text-emerald-500">Always listening for: "{voiceKeyword}"</p>
                  </div>
                )}
              </div>

              {/* Fall Detection */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-foreground flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Fall Detection
                  </Label>
                  <p className="text-sm text-muted-foreground">Auto-trigger SOS on hard fall</p>
                </div>
                <Switch checked={fallDetectionEnabled} onCheckedChange={setFallDetectionEnabled} />
              </div>

              {/* Check-in */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-foreground flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Scheduled Check-in
                    </Label>
                    <p className="text-sm text-muted-foreground">Alert contacts if you miss check-ins</p>
                  </div>
                  <Switch checked={checkInEnabled} onCheckedChange={setCheckInEnabled} />
                </div>
                {checkInEnabled && (
                  <div className="pl-6 space-y-2">
                    <Label className="text-sm text-muted-foreground">Check-in interval: {checkInInterval} min</Label>
                    <Slider
                      value={[checkInInterval]}
                      onValueChange={([value]) => setCheckInInterval(value)}
                      min={5}
                      max={120}
                      step={5}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Location Settings */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-500" />
                Location & Recording
              </CardTitle>
              <CardDescription>Configure location sharing and evidence recording</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-foreground">Location Sharing</Label>
                  <p className="text-sm text-muted-foreground">Share location with emergency contacts</p>
                </div>
                <Switch
                  checked={settings.locationSharing}
                  onCheckedChange={(checked) => setSettings({ ...settings, locationSharing: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-foreground">Auto Recording</Label>
                  <p className="text-sm text-muted-foreground">Record audio/video when SOS activated</p>
                </div>
                <Switch
                  checked={settings.autoRecording}
                  onCheckedChange={(checked) => setSettings({ ...settings, autoRecording: checked })}
                />
              </div>

              <Link href="/dashboard/settings/safe-zones">
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer">
                  <div className="space-y-0.5">
                    <Label className="text-foreground cursor-pointer">Safe Zones (Geofencing)</Label>
                    <p className="text-sm text-muted-foreground">Configure home, work, and safe areas</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </Link>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </CardTitle>
              <CardDescription>Manage how you receive alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-foreground">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive alerts on your device</p>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, pushNotifications: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-foreground">SOS Sound</Label>
                  <p className="text-sm text-muted-foreground">Play alarm when SOS is activated</p>
                </div>
                <Switch
                  checked={settings.sosSound}
                  onCheckedChange={(checked) => setSettings({ ...settings, sosSound: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handleSave}
            className="w-full bg-emergency hover:bg-emergency/90 text-emergency-foreground h-11"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </main>
    </div>
  )
}
