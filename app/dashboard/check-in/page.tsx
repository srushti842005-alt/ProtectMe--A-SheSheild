"use client"

import { useState, useEffect } from "react"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSafetyTriggers } from "@/lib/safety-triggers-context"
import { useContacts } from "@/lib/contacts-context"
import { Clock, CheckCircle2, AlertTriangle, Bell, Users, MapPin, Loader2 } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

export default function CheckInPage() {
  const {
    checkInEnabled,
    setCheckInEnabled,
    checkInInterval,
    setCheckInInterval,
    lastCheckIn,
    checkIn,
    missedCheckIns,
  } = useSafetyTriggers()
  const { contacts } = useContacts()
  const [isCheckingIn, setIsCheckingIn] = useState(false)
  const [timeUntilNext, setTimeUntilNext] = useState<string>("")
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; address: string } | null>(null)

  // Get user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
          )
          const data = await res.json()
          setUserLocation({
            lat: latitude,
            lng: longitude,
            address: data.display_name?.split(",").slice(0, 3).join(",") || "Unknown location",
          })
        } catch {
          setUserLocation({ lat: latitude, lng: longitude, address: "Location detected" })
        }
      },
      () => {},
    )
  }, [])

  // Calculate time until next check-in
  useEffect(() => {
    if (!checkInEnabled || !lastCheckIn) {
      setTimeUntilNext("")
      return
    }

    const interval = setInterval(() => {
      const nextCheckIn = new Date(lastCheckIn.getTime() + checkInInterval * 60 * 1000)
      const now = new Date()
      const diff = nextCheckIn.getTime() - now.getTime()

      if (diff <= 0) {
        setTimeUntilNext("Overdue!")
      } else {
        const mins = Math.floor(diff / 60000)
        const secs = Math.floor((diff % 60000) / 1000)
        setTimeUntilNext(`${mins}m ${secs}s`)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [checkInEnabled, lastCheckIn, checkInInterval])

  const handleCheckIn = async () => {
    setIsCheckingIn(true)

    // Send check-in to contacts via WhatsApp
    const sosContacts = contacts.filter((c) => c.sosEnabled)
    const message = `✅ Safety Check-in from ProtectMe SOS

I'm checking in to let you know I'm safe!

📍 Location: ${userLocation?.address || "Unknown"}
🕐 Time: ${new Date().toLocaleString()}

This is an automated safety check-in.`

    for (const contact of sosContacts.slice(0, 2)) {
      const phone = contact.phone.replace(/\D/g, "")
      const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, "_blank")
      await new Promise((r) => setTimeout(r, 500))
    }

    checkIn()
    setIsCheckingIn(false)
  }

  const sosContacts = contacts.filter((c) => c.sosEnabled)

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-foreground">Safety Check-in</h1>
            <p className="text-muted-foreground">Let your contacts know you're safe</p>
          </div>

          {/* Quick Check-in Button */}
          <Card className="bg-card border-border">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div
                  className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${
                    missedCheckIns > 0 ? "bg-red-500/20" : "bg-emerald-500/20"
                  }`}
                >
                  {missedCheckIns > 0 ? (
                    <AlertTriangle className="w-12 h-12 text-red-500" />
                  ) : (
                    <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                  )}
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    {missedCheckIns > 0
                      ? `${missedCheckIns} Missed Check-in${missedCheckIns > 1 ? "s" : ""}`
                      : "You're Safe"}
                  </h2>
                  {lastCheckIn ? (
                    <p className="text-sm text-muted-foreground">Last check-in: {lastCheckIn.toLocaleString()}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">No check-ins yet today</p>
                  )}
                </div>

                {checkInEnabled && timeUntilNext && (
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <p className="text-sm text-muted-foreground">Next check-in due in</p>
                    <p
                      className={`text-lg font-bold ${timeUntilNext === "Overdue!" ? "text-red-500" : "text-foreground"}`}
                    >
                      {timeUntilNext}
                    </p>
                  </div>
                )}

                <Button
                  size="lg"
                  className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 text-white text-lg"
                  onClick={handleCheckIn}
                  disabled={isCheckingIn}
                >
                  {isCheckingIn ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      I'm Safe - Check In Now
                    </>
                  )}
                </Button>

                {userLocation && (
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{userLocation.address}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Check-in Settings */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Scheduled Check-ins
              </CardTitle>
              <CardDescription>Automatically remind you to check in</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-foreground">Enable Scheduled Check-ins</Label>
                  <p className="text-sm text-muted-foreground">Alert contacts if you miss check-ins</p>
                </div>
                <Switch checked={checkInEnabled} onCheckedChange={setCheckInEnabled} />
              </div>

              {checkInEnabled && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-foreground">Check-in Interval</Label>
                    <span className="text-sm font-medium text-foreground">{checkInInterval} minutes</span>
                  </div>
                  <Slider
                    value={[checkInInterval]}
                    onValueChange={([value]) => setCheckInInterval(value)}
                    min={5}
                    max={120}
                    step={5}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    If you miss 2 consecutive check-ins, your emergency contacts will be alerted
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contacts who will be notified */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Users className="w-5 h-5" />
                Check-in Recipients
              </CardTitle>
              <CardDescription>Contacts who receive your check-ins</CardDescription>
            </CardHeader>
            <CardContent>
              {sosContacts.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">No emergency contacts set up</p>
                  <Button variant="link" className="text-emergency" asChild>
                    <a href="/dashboard/contacts">Add contacts</a>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {sosContacts.map((contact) => (
                    <div key={contact.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <span className="text-emerald-500 font-medium">{contact.name.charAt(0)}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground text-sm">{contact.name}</p>
                        <p className="text-xs text-muted-foreground">{contact.phone}</p>
                      </div>
                      <Bell className="w-4 h-4 text-emerald-500" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <p className="text-sm text-blue-400">
              <strong>How it works:</strong> Check-ins let your loved ones know you're safe. If scheduled check-ins are
              enabled and you miss 2 in a row, your emergency contacts will automatically receive an alert with your
              last known location.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
