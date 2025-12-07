"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Shield, MapPin, AlertTriangle, Save, RefreshCw } from "lucide-react"

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    // Alert Settings
    autoDispatchEnabled: true,
    fakeCallThreshold: 40,
    autoResolveTimeout: 30,
    maxActiveIncidentsPerOfficer: 3,

    // Notification Settings
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    alertSound: "critical",

    // Security Settings
    twoFactorAuth: true,
    sessionTimeout: 60,
    ipWhitelist: "",

    // Zone Settings
    dangerZoneRadius: 500,
    autoAlertInDangerZone: true,
    patrolRefreshInterval: 5,
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((r) => setTimeout(r, 1500))
    setIsSaving(false)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Settings</h1>
          <p className="text-muted-foreground">Configure system behavior and preferences</p>
        </div>
        <Button className="bg-emergency hover:bg-emergency/90" onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
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

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Alert Settings */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Alert Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-foreground">Auto Dispatch Officers</Label>
                <p className="text-xs text-muted-foreground">
                  Automatically dispatch nearest officer for high-priority alerts
                </p>
              </div>
              <Switch
                checked={settings.autoDispatchEnabled}
                onCheckedChange={(v) => setSettings((s) => ({ ...s, autoDispatchEnabled: v }))}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-foreground">Fake Call Detection Threshold</Label>
                <span className="text-sm text-muted-foreground">{settings.fakeCallThreshold}%</span>
              </div>
              <Slider
                value={[settings.fakeCallThreshold]}
                onValueChange={([v]) => setSettings((s) => ({ ...s, fakeCallThreshold: v }))}
                min={20}
                max={80}
                step={5}
              />
              <p className="text-xs text-muted-foreground">
                Calls with trust score below this threshold will be flagged as suspected fake
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Auto-resolve Timeout (minutes)</Label>
              <Input
                type="number"
                value={settings.autoResolveTimeout}
                onChange={(e) => setSettings((s) => ({ ...s, autoResolveTimeout: Number(e.target.value) }))}
                className="border-border"
              />
              <p className="text-xs text-muted-foreground">
                Automatically resolve incidents with no activity after this duration
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Max Active Incidents per Officer</Label>
              <Input
                type="number"
                value={settings.maxActiveIncidentsPerOfficer}
                onChange={(e) => setSettings((s) => ({ ...s, maxActiveIncidentsPerOfficer: Number(e.target.value) }))}
                className="border-border"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-foreground">Email Notifications</Label>
                <p className="text-xs text-muted-foreground">Receive incident alerts via email</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(v) => setSettings((s) => ({ ...s, emailNotifications: v }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-foreground">SMS Notifications</Label>
                <p className="text-xs text-muted-foreground">Receive critical alerts via SMS</p>
              </div>
              <Switch
                checked={settings.smsNotifications}
                onCheckedChange={(v) => setSettings((s) => ({ ...s, smsNotifications: v }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-foreground">Push Notifications</Label>
                <p className="text-xs text-muted-foreground">Browser push notifications</p>
              </div>
              <Switch
                checked={settings.pushNotifications}
                onCheckedChange={(v) => setSettings((s) => ({ ...s, pushNotifications: v }))}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Alert Sound</Label>
              <Select value={settings.alertSound} onValueChange={(v) => setSettings((s) => ({ ...s, alertSound: v }))}>
                <SelectTrigger className="border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical (Loud)</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="subtle">Subtle</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-foreground">Two-Factor Authentication</Label>
                <p className="text-xs text-muted-foreground">Require 2FA for admin login</p>
              </div>
              <Switch
                checked={settings.twoFactorAuth}
                onCheckedChange={(v) => setSettings((s) => ({ ...s, twoFactorAuth: v }))}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Session Timeout (minutes)</Label>
              <Input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings((s) => ({ ...s, sessionTimeout: Number(e.target.value) }))}
                className="border-border"
              />
              <p className="text-xs text-muted-foreground">Auto logout after inactivity</p>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">IP Whitelist (comma separated)</Label>
              <Input
                value={settings.ipWhitelist}
                onChange={(e) => setSettings((s) => ({ ...s, ipWhitelist: e.target.value }))}
                placeholder="e.g., 192.168.1.1, 10.0.0.1"
                className="border-border"
              />
              <p className="text-xs text-muted-foreground">Leave empty to allow all IPs</p>
            </div>
          </CardContent>
        </Card>

        {/* Zone Settings */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Zone Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-foreground">Danger Zone Radius</Label>
                <span className="text-sm text-muted-foreground">{settings.dangerZoneRadius}m</span>
              </div>
              <Slider
                value={[settings.dangerZoneRadius]}
                onValueChange={([v]) => setSettings((s) => ({ ...s, dangerZoneRadius: v }))}
                min={100}
                max={2000}
                step={100}
              />
              <p className="text-xs text-muted-foreground">Radius around incident to mark as danger zone</p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-foreground">Auto-alert in Danger Zones</Label>
                <p className="text-xs text-muted-foreground">Automatically alert users entering danger zones</p>
              </div>
              <Switch
                checked={settings.autoAlertInDangerZone}
                onCheckedChange={(v) => setSettings((s) => ({ ...s, autoAlertInDangerZone: v }))}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Patrol Refresh Interval (minutes)</Label>
              <Input
                type="number"
                value={settings.patrolRefreshInterval}
                onChange={(e) => setSettings((s) => ({ ...s, patrolRefreshInterval: Number(e.target.value) }))}
                className="border-border"
              />
              <p className="text-xs text-muted-foreground">How often to refresh patrol officer positions</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
