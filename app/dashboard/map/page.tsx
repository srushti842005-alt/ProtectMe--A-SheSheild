"use client"

import { useAuth } from "@/lib/auth-context"
import { useContacts } from "@/lib/contacts-context"
import { redirect } from "next/navigation"
import { useEffect, useState } from "react"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { IncidentMap, generateNearbyIncidents, type Incident } from "@/components/map/incident-map"
import { ReportIncidentDialog } from "@/components/map/report-incident-dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, MapPin, Users, Clock, Share2, Shield, RefreshCw, ShieldCheck, ShieldAlert } from "lucide-react"
import { cn } from "@/lib/utils"

interface SafePlace {
  id: string
  lat: number
  lng: number
  name: string
  type: "safe" | "unsafe"
  addedBy: string
  timestamp: Date
}

export default function MapPage() {
  const { user, isLoading: authLoading } = useAuth()
  const { contacts } = useContacts()
  const [reportDialogOpen, setReportDialogOpen] = useState(false)
  const [isSharing, setIsSharing] = useState(true)
  const [recentIncidents, setRecentIncidents] = useState<Incident[]>([])
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [safePlaces, setSafePlaces] = useState<SafePlace[]>([])
  const [markingMode, setMarkingMode] = useState<"safe" | "unsafe" | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      redirect("/login")
    }
  }, [user, authLoading])

  useEffect(() => {
    // Load saved places from localStorage
    const saved = localStorage.getItem("protectme_safe_places")
    if (saved) {
      setSafePlaces(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude })
          const incidents = generateNearbyIncidents(position.coords.latitude, position.coords.longitude)
          setRecentIncidents(incidents.slice(0, 5))
          setLastUpdate(new Date())
        },
        () => {
          const incidents = generateNearbyIncidents(12.9716, 77.5946)
          setRecentIncidents(incidents.slice(0, 5))
        },
      )
    }
  }, [])

  const refreshIncidents = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const incidents = generateNearbyIncidents(position.coords.latitude, position.coords.longitude)
        setRecentIncidents(incidents.slice(0, 5))
        setLastUpdate(new Date())
      })
    }
  }

  const markCurrentLocation = (type: "safe" | "unsafe") => {
    if (!userLocation) {
      alert("Getting your location... Please try again.")
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude })
      })
      return
    }

    const newPlace: SafePlace = {
      id: crypto.randomUUID(),
      lat: userLocation.lat,
      lng: userLocation.lng,
      name: type === "safe" ? "Safe Zone" : "Danger Zone",
      type,
      addedBy: user?.name || "You",
      timestamp: new Date(),
    }

    const updated = [...safePlaces, newPlace]
    setSafePlaces(updated)
    localStorage.setItem("protectme_safe_places", JSON.stringify(updated))
    setMarkingMode(null)

    // Broadcast to nearby users (simulated)
    alert(`Location marked as ${type}! Nearby ProtectMe users will be notified.`)
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emergency border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const shareContacts = contacts.filter((c) => c.shareLocation)

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - new Date(date).getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor(diff / (1000 * 60))
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return "Just now"
  }

  const safePlaceCount = safePlaces.filter((p) => p.type === "safe").length
  const unsafePlaceCount = safePlaces.filter((p) => p.type === "unsafe").length

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <main className="pt-16 h-screen flex flex-col">
        {/* Top Info Bar */}
        <div className="bg-card border-b border-border px-4 py-3">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div
                  className={cn("w-2 h-2 rounded-full", isSharing ? "bg-success animate-pulse" : "bg-muted-foreground")}
                />
                <span className="text-sm text-foreground">{isSharing ? "Live location active" : "Paused"}</span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsSharing(!isSharing)}
                className={cn("text-xs", isSharing ? "text-success" : "text-muted-foreground")}
              >
                <Share2 className="w-3 h-3 mr-1" />
                {isSharing ? "Sharing" : "Share"}
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => markCurrentLocation("safe")}
                className="border-green-500/30 text-green-500 hover:bg-green-500/10"
              >
                <ShieldCheck className="w-4 h-4 mr-1" />
                Mark Safe
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => markCurrentLocation("unsafe")}
                className="border-red-500/30 text-red-500 hover:bg-red-500/10"
              >
                <ShieldAlert className="w-4 h-4 mr-1" />
                Mark Unsafe
              </Button>
              <Button
                size="sm"
                onClick={() => setReportDialogOpen(true)}
                className="bg-emergency hover:bg-emergency/90 text-emergency-foreground"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Report
              </Button>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          <IncidentMap safePlaces={safePlaces} />

          {/* Side Panel - Recent Incidents */}
          <div className="hidden lg:block absolute top-4 left-4 w-80 bg-card/95 backdrop-blur border border-border rounded-xl shadow-lg z-10 max-h-[calc(100%-2rem)] overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Live Incidents
                </h2>
                <p className="text-xs text-muted-foreground">Updated {formatTime(lastUpdate)}</p>
              </div>
              <Button size="icon" variant="ghost" onClick={refreshIncidents} className="h-8 w-8">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>

            <div className="overflow-y-auto max-h-64">
              {recentIncidents.map((incident) => (
                <div
                  key={incident.id}
                  className="p-4 border-b border-border hover:bg-secondary/50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-sm font-medium text-foreground">{incident.title}</h3>
                    <span
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full",
                        incident.severity === "high" && "bg-destructive/20 text-destructive",
                        incident.severity === "medium" && "bg-orange-500/20 text-orange-500",
                        incident.severity === "low" && "bg-yellow-500/20 text-yellow-500",
                      )}
                    >
                      {incident.severity}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground capitalize">{incident.type.replace("_", " ")}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {incident.distance}
                    </span>
                    <span>{formatTime(incident.timestamp)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-border">
              <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Community Marked Places
              </h3>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-muted-foreground">{safePlaceCount} Safe</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-muted-foreground">{unsafePlaceCount} Unsafe</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contacts Sharing Panel */}
          {shareContacts.length > 0 && isSharing && (
            <div className="hidden lg:block absolute top-4 right-20 bg-card/95 backdrop-blur border border-border rounded-xl shadow-lg z-10 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-success" />
                <span className="text-sm font-medium text-foreground">Sharing with</span>
              </div>
              <div className="space-y-2">
                {shareContacts.map((contact) => (
                  <div key={contact.id} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-xs text-foreground">
                      {contact.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{contact.name}</p>
                      <p className="text-xs text-muted-foreground">{contact.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <ReportIncidentDialog open={reportDialogOpen} onOpenChange={setReportDialogOpen} />
    </div>
  )
}
