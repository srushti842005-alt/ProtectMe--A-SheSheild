"use client"

import { useState, useEffect } from "react"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSafetyTriggers } from "@/lib/safety-triggers-context"
import { MapPin, Mic, Camera, Smartphone, Bell, CheckCircle2, XCircle, Loader2 } from "lucide-react"

export default function PermissionsPage() {
  const { permissions, requestPermission } = useSafetyTriggers()
  const [loading, setLoading] = useState<string | null>(null)
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default")

  useEffect(() => {
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission)
    }
  }, [])

  const handleRequestPermission = async (type: "location" | "microphone" | "camera" | "motion") => {
    setLoading(type)
    await requestPermission(type)
    setLoading(null)
  }

  const handleNotificationPermission = async () => {
    if ("Notification" in window) {
      const result = await Notification.requestPermission()
      setNotificationPermission(result)
    }
  }

  const PermissionRow = ({
    icon: Icon,
    title,
    description,
    granted,
    onRequest,
    permKey,
    color,
  }: {
    icon: any
    title: string
    description: string
    granted: boolean
    onRequest: () => void
    permKey: string
    color: string
  }) => (
    <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="font-medium text-foreground">{title}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {granted ? (
          <div className="flex items-center gap-2 text-emerald-500">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm font-medium">Granted</span>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={onRequest}
            disabled={loading === permKey}
            className="border-border bg-transparent"
          >
            {loading === permKey ? <Loader2 className="w-4 h-4 animate-spin" /> : "Grant Access"}
          </Button>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-foreground">Permissions Manager</h1>
            <p className="text-muted-foreground">Control what data ProtectMe can access</p>
          </div>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Required Permissions</CardTitle>
              <CardDescription>These permissions are needed for core safety features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <PermissionRow
                icon={MapPin}
                title="Location Access"
                description="Required for SOS alerts and live tracking"
                granted={permissions.location}
                onRequest={() => handleRequestPermission("location")}
                permKey="location"
                color="bg-blue-500"
              />

              <PermissionRow
                icon={Mic}
                title="Microphone Access"
                description="Required for voice activation and evidence recording"
                granted={permissions.microphone}
                onRequest={() => handleRequestPermission("microphone")}
                permKey="microphone"
                color="bg-emerald-500"
              />

              <PermissionRow
                icon={Camera}
                title="Camera Access"
                description="Required for video evidence and threat scanner"
                granted={permissions.camera}
                onRequest={() => handleRequestPermission("camera")}
                permKey="camera"
                color="bg-purple-500"
              />
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Optional Permissions</CardTitle>
              <CardDescription>Enhance your safety experience with these permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <PermissionRow
                icon={Smartphone}
                title="Motion Sensors"
                description="Enables shake-to-SOS and fall detection"
                granted={permissions.motion}
                onRequest={() => handleRequestPermission("motion")}
                permKey="motion"
                color="bg-orange-500"
              />

              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-red-500">
                    <Bell className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Push Notifications</h4>
                    <p className="text-sm text-muted-foreground">Receive alerts even when app is closed</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {notificationPermission === "granted" ? (
                    <div className="flex items-center gap-2 text-emerald-500">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="text-sm font-medium">Granted</span>
                    </div>
                  ) : notificationPermission === "denied" ? (
                    <div className="flex items-center gap-2 text-red-500">
                      <XCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">Denied</span>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNotificationPermission}
                      className="border-border bg-transparent"
                    >
                      Grant Access
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Permission Usage</CardTitle>
              <CardDescription>How we use each permission</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-1 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Location</p>
                    <p className="text-xs text-muted-foreground">
                      Only accessed during SOS, Walk With Me, or when you share location with contacts. Never tracked in
                      background without active feature.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mic className="w-4 h-4 mt-1 text-emerald-500" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Microphone</p>
                    <p className="text-xs text-muted-foreground">
                      Used for voice keyword detection (if enabled) and audio evidence recording during SOS. Voice data
                      is processed locally for keyword detection.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Camera className="w-4 h-4 mt-1 text-purple-500" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Camera</p>
                    <p className="text-xs text-muted-foreground">
                      Used for video evidence during SOS and threat scanner feature. Never accessed without your
                      explicit action.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Smartphone className="w-4 h-4 mt-1 text-orange-500" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Motion Sensors</p>
                    <p className="text-xs text-muted-foreground">
                      Used for shake detection and fall detection. Processed entirely on-device, no motion data is
                      transmitted.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-sm text-emerald-400">
              You can revoke any permission at any time from your device settings. Some features may not work without
              required permissions.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
