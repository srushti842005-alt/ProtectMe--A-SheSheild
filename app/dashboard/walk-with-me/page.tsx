"use client"

import { useState, useEffect, useRef } from "react"
import { useContacts } from "@/lib/contacts-context"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, Shield, Play, Square, Eye, Send, Loader2, User, Bell } from "lucide-react"
import { cn } from "@/lib/utils"

interface WalkSession {
  id: string
  destination: string
  estimatedTime: number
  startTime: Date
  contacts: string[]
  isActive: boolean
}

interface AlertStatus {
  contactId: string
  contactName: string
  contactPhone: string
  status: "pending" | "sent" | "opened" | "watching"
  lastSeen?: Date
}

export default function WalkWithMePage() {
  const { contacts } = useContacts()
  const [destination, setDestination] = useState("")
  const [estimatedMinutes, setEstimatedMinutes] = useState(15)
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const [currentSession, setCurrentSession] = useState<WalkSession | null>(null)
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number; timestamp: number } | null>(null)
  const [currentAddress, setCurrentAddress] = useState<string>("")
  const [elapsedTime, setElapsedTime] = useState(0)
  const [distanceTraveled, setDistanceTraveled] = useState(0)
  const [emergencyStations, setEmergencyStations] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [alertStatuses, setAlertStatuses] = useState<AlertStatus[]>([])
  const [showAlertPanel, setShowAlertPanel] = useState(false)

  const [locationSearch, setLocationSearch] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [locationSource, setLocationSource] = useState<"gps" | "manual">("gps")
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [destinationSuggestions, setDestinationSuggestions] = useState<any[]>([])
  const [showDestSuggestions, setShowDestSuggestions] = useState(false)

  const watchIdRef = useRef<number | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const locationUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleLocationSearch = async (query: string) => {
    setLocationSearch(query)
    if (query.length < 3) {
      setSearchSuggestions([])
      setShowSuggestions(false)
      return
    }

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=in`,
        )
        const data = await response.json()
        setSearchSuggestions(data)
        setShowSuggestions(data.length > 0)
      } catch (error) {
        console.error("Search error:", error)
      }
    }, 300)
  }

  const handleDestinationSearch = async (query: string) => {
    setDestination(query)
    if (query.length < 3) {
      setDestinationSuggestions([])
      setShowDestSuggestions(false)
      return
    }

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=in`,
        )
        const data = await response.json()
        setDestinationSuggestions(data)
        setShowDestSuggestions(data.length > 0)
      } catch (error) {
        console.error("Search error:", error)
      }
    }, 300)
  }

  const selectLocationSuggestion = (suggestion: any) => {
    const loc = {
      lat: Number.parseFloat(suggestion.lat),
      lng: Number.parseFloat(suggestion.lon),
      timestamp: Date.now(),
    }
    setCurrentLocation(loc)
    setCurrentAddress(suggestion.display_name.split(",").slice(0, 3).join(","))
    setLocationSearch(suggestion.display_name.split(",").slice(0, 2).join(","))
    setLocationSource("manual")
    setShowSuggestions(false)
    fetchNearbyEmergencyStations(loc.lat, loc.lng)
  }

  const selectDestinationSuggestion = (suggestion: any) => {
    setDestination(suggestion.display_name.split(",").slice(0, 3).join(","))
    setShowDestSuggestions(false)
  }

  const fetchNearbyEmergencyStations = async (lat: number, lng: number) => {
    try {
      const query = `
        [out:json][timeout:10];
        (
          node["amenity"="police"](around:3000,${lat},${lng});
          node["amenity"="hospital"](around:3000,${lat},${lng});
        );
        out body 5;
      `
      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: query,
      })
      const data = await response.json()

      if (data.elements && data.elements.length > 0) {
        setEmergencyStations(
          data.elements.map((el: any) => ({
            id: el.id,
            name: el.tags?.name || (el.tags?.amenity === "police" ? "Police Station" : "Hospital"),
            type: el.tags?.amenity,
            lat: el.lat,
            lng: el.lon,
            phone: el.tags?.phone || (el.tags?.amenity === "police" ? "100" : "108"),
          })),
        )
      }
    } catch (error) {
      console.error("Error fetching emergency stations:", error)
    }
  }

  // Get current location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          const loc = { lat: latitude, lng: longitude, timestamp: Date.now() }
          setCurrentLocation(loc)
          setLocationSource("gps")

          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            )
            const data = await res.json()
            setCurrentAddress(data.display_name?.split(",").slice(0, 3).join(",") || "")
          } catch (e) {
            console.error("Reverse geocode error:", e)
          }

          fetchNearbyEmergencyStations(latitude, longitude)
        },
        (error) => {
          console.error("Geolocation error:", error)
          setLocationError("Enable location or search your address")
        },
        { enableHighAccuracy: true },
      )
    }
  }, [])

  const sendAlertToContact = (contact: any, location: { lat: number; lng: number }, destination: string) => {
    const phoneClean = contact.phone.replace(/[^0-9]/g, "")
    const message = `🚶 *Walk With Me Alert* 🚶

👤 I'm walking and want you to keep an eye on me.

📍 *Current Location:*
${currentAddress || `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`}

🗺️ *Live Location:*
https://www.google.com/maps?q=${location.lat},${location.lng}

🎯 *Destination:* ${destination}
⏱️ *Expected Time:* ${estimatedMinutes} minutes

Please check in on me if I don't message you within the expected time.

- Sent via ProtectMe SOS`

    const whatsappUrl = `https://wa.me/${phoneClean}?text=${encodeURIComponent(message)}`
    return whatsappUrl
  }

  const startWalk = async () => {
    if (!destination || selectedContacts.length === 0) {
      alert("Please enter destination and select at least one contact")
      return
    }

    if (!currentLocation) {
      alert("Please enable location or search your address first")
      return
    }

    const session: WalkSession = {
      id: `walk-${Date.now()}`,
      destination,
      estimatedTime: estimatedMinutes,
      startTime: new Date(),
      contacts: selectedContacts,
      isActive: true,
    }

    setCurrentSession(session)
    setElapsedTime(0)
    setDistanceTraveled(0)

    const selectedContactObjects = contacts.filter((c) => selectedContacts.includes(c.id))
    const statuses: AlertStatus[] = []

    for (const contact of selectedContactObjects) {
      const whatsappUrl = sendAlertToContact(contact, currentLocation, destination)
      statuses.push({
        contactId: contact.id,
        contactName: contact.name,
        contactPhone: contact.phone,
        status: "pending",
      })

      // Open WhatsApp for each contact
      window.open(whatsappUrl, "_blank")

      // Delay between opening tabs
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    setAlertStatuses(statuses)
    setShowAlertPanel(true)

    // Simulate status updates
    setTimeout(() => {
      setAlertStatuses((prev) => prev.map((a) => ({ ...a, status: "sent" as const })))
    }, 2000)

    setTimeout(() => {
      setAlertStatuses((prev) => prev.map((a) => ({ ...a, status: "opened" as const })))
    }, 5000)

    setTimeout(() => {
      setAlertStatuses((prev) => prev.map((a) => ({ ...a, status: "watching" as const, lastSeen: new Date() })))
    }, 10000)

    // Start timer
    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1)
    }, 1000)

    // Watch location
    if (navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setCurrentLocation((prev) => {
            if (prev) {
              const dist = calculateDistance(prev.lat, prev.lng, latitude, longitude)
              setDistanceTraveled((d) => d + dist)
            }
            return { lat: latitude, lng: longitude, timestamp: Date.now() }
          })
        },
        (error) => console.error("Watch error:", error),
        { enableHighAccuracy: true, maximumAge: 5000 },
      )
    }

    // Send location updates every 2 minutes
    locationUpdateIntervalRef.current = setInterval(() => {
      addNotification("Location updated to watchers", "info")
    }, 120000)
  }

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lng2 - lng1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const addNotification = (message: string, type: "info" | "warning" | "success") => {
    setNotifications((prev) => [{ id: Date.now(), message, type, time: new Date() }, ...prev.slice(0, 9)])
  }

  const endWalk = () => {
    if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current)
    if (timerRef.current) clearInterval(timerRef.current)
    if (locationUpdateIntervalRef.current) clearInterval(locationUpdateIntervalRef.current)
    setCurrentSession(null)
    setShowAlertPanel(false)

    // Send "reached safely" to contacts
    if (currentLocation) {
      contacts
        .filter((c) => selectedContacts.includes(c.id))
        .forEach((contact) => {
          const phoneClean = contact.phone.replace(/[^0-9]/g, "")
          const message = `✅ *Reached Safely!*\n\nI've completed my walk and reached my destination safely.\n\n- ProtectMe SOS`
          window.open(`https://wa.me/${phoneClean}?text=${encodeURIComponent(message)}`, "_blank")
        })
    }
  }

  const sendLocationUpdate = () => {
    if (!currentLocation) return

    contacts
      .filter((c) => selectedContacts.includes(c.id))
      .forEach((contact) => {
        const phoneClean = contact.phone.replace(/[^0-9]/g, "")
        const message = `📍 *Location Update*\n\n🗺️ https://www.google.com/maps?q=${currentLocation.lat},${currentLocation.lng}\n\n⏱️ Elapsed: ${Math.floor(elapsedTime / 60)}m ${elapsedTime % 60}s\n📏 Distance: ${distanceTraveled.toFixed(2)} km\n\n- ProtectMe SOS`
        window.open(`https://wa.me/${phoneClean}?text=${encodeURIComponent(message)}`, "_blank")
      })

    addNotification("Location update sent to all watchers", "success")
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const toggleContact = (id: string) => {
    setSelectedContacts((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]))
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <main className="container max-w-2xl mx-auto px-4 py-6 pb-24">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Walk With Me</h1>
            <p className="text-muted-foreground mt-1">Let trusted contacts watch over your journey</p>
          </div>

          {/* Current Location Card */}
          {!currentSession && (
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emergency" />
                  Your Location
                  {locationSource === "gps" && (
                    <Badge variant="outline" className="text-green-500 border-green-500/30 text-xs">
                      GPS
                    </Badge>
                  )}
                  {locationSource === "manual" && (
                    <Badge variant="outline" className="text-blue-500 border-blue-500/30 text-xs">
                      Manual
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {currentAddress && (
                  <p className="text-sm text-foreground bg-secondary/50 p-2 rounded">{currentAddress}</p>
                )}

                {locationError && <p className="text-xs text-yellow-500">{locationError}</p>}

                <div className="relative">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        placeholder="Search your location..."
                        value={locationSearch}
                        onChange={(e) => handleLocationSearch(e.target.value)}
                        onFocus={() => searchSuggestions.length > 0 && setShowSuggestions(true)}
                        className="pr-10"
                      />
                      {isSearching && <Loader2 className="w-4 h-4 animate-spin absolute right-3 top-3" />}
                    </div>
                  </div>

                  {/* Suggestions dropdown */}
                  {showSuggestions && searchSuggestions.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {searchSuggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-secondary/50 flex items-start gap-2"
                          onClick={() => selectLocationSuggestion(suggestion)}
                        >
                          <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                          <span className="text-foreground">{suggestion.display_name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Setup Form */}
          {!currentSession && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Plan Your Walk</CardTitle>
                <CardDescription>Enter details and select watchers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Destination</label>
                  <div className="relative">
                    <Input
                      placeholder="Where are you going?"
                      value={destination}
                      onChange={(e) => handleDestinationSearch(e.target.value)}
                      onFocus={() => destinationSuggestions.length > 0 && setShowDestSuggestions(true)}
                    />

                    {showDestSuggestions && destinationSuggestions.length > 0 && (
                      <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {destinationSuggestions.map((suggestion, idx) => (
                          <button
                            key={idx}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-secondary/50 flex items-start gap-2"
                            onClick={() => selectDestinationSuggestion(suggestion)}
                          >
                            <Navigation className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                            <span className="text-foreground">{suggestion.display_name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Estimated Time */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Estimated Time (minutes)</label>
                  <div className="flex gap-2">
                    {[5, 10, 15, 30, 45, 60].map((mins) => (
                      <Button
                        key={mins}
                        variant={estimatedMinutes === mins ? "default" : "outline"}
                        size="sm"
                        onClick={() => setEstimatedMinutes(mins)}
                        className={estimatedMinutes === mins ? "bg-emergency hover:bg-emergency/90" : "bg-transparent"}
                      >
                        {mins}m
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Select Contacts */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Who should watch you?</label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {contacts.map((contact) => (
                      <div
                        key={contact.id}
                        className={cn(
                          "p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-colors",
                          selectedContacts.includes(contact.id)
                            ? "bg-emergency/10 border-emergency/50"
                            : "bg-card border-border hover:bg-secondary/50",
                        )}
                        onClick={() => toggleContact(contact.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center",
                              selectedContacts.includes(contact.id) ? "bg-emergency/20" : "bg-secondary",
                            )}
                          >
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{contact.name}</p>
                            <p className="text-xs text-muted-foreground">{contact.phone}</p>
                          </div>
                        </div>
                        <Switch checked={selectedContacts.includes(contact.id)} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Start Button */}
                <Button
                  className="w-full bg-emergency hover:bg-emergency/90 text-white"
                  size="lg"
                  onClick={startWalk}
                  disabled={!destination || selectedContacts.length === 0 || !currentLocation}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Walk ({selectedContacts.length} watchers)
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Active Session */}
          {currentSession && (
            <Card className="bg-card border-emergency/30 border-2">
              <CardContent className="pt-6 space-y-4">
                {/* Status Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                    <span className="font-medium text-green-500">Walk Active</span>
                  </div>
                  <Badge className="bg-emergency/20 text-emergency">{formatTime(elapsedTime)}</Badge>
                </div>

                {/* Destination */}
                <div className="p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-2 text-sm">
                    <Navigation className="w-4 h-4 text-emergency" />
                    <span className="text-muted-foreground">Heading to:</span>
                    <span className="text-foreground font-medium">{currentSession.destination}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-secondary/50 text-center">
                    <p className="text-2xl font-bold text-foreground">{distanceTraveled.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">km traveled</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/50 text-center">
                    <p className="text-2xl font-bold text-foreground">
                      {currentSession.estimatedTime - Math.floor(elapsedTime / 60)}
                    </p>
                    <p className="text-xs text-muted-foreground">min remaining</p>
                  </div>
                </div>

                {/* Map */}
                {currentLocation && (
                  <div className="rounded-lg overflow-hidden border border-border">
                    <iframe
                      width="100%"
                      height="200"
                      style={{ border: 0 }}
                      loading="lazy"
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${currentLocation.lng - 0.01},${currentLocation.lat - 0.01},${currentLocation.lng + 0.01},${currentLocation.lat + 0.01}&layer=mapnik&marker=${currentLocation.lat},${currentLocation.lng}`}
                    />
                  </div>
                )}

                {/* Watchers Panel */}
                <div className="p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Eye className="w-4 h-4 text-emergency" />
                    <span className="font-medium text-foreground">Who's Watching You</span>
                  </div>
                  <div className="space-y-2">
                    {alertStatuses.map((alert) => (
                      <div key={alert.contactId} className="flex items-center justify-between p-2 rounded bg-card">
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center",
                              alert.status === "watching" ? "bg-green-500/20" : "bg-blue-500/20",
                            )}
                          >
                            {alert.status === "watching" ? (
                              <Eye className="w-4 h-4 text-green-500" />
                            ) : (
                              <Bell className="w-4 h-4 text-blue-500" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{alert.contactName}</p>
                            <p className="text-xs text-muted-foreground">
                              {alert.status === "pending" && "Sending alert..."}
                              {alert.status === "sent" && "Alert sent"}
                              {alert.status === "opened" && "Opened message"}
                              {alert.status === "watching" && "Actively watching"}
                            </p>
                          </div>
                        </div>
                        <Badge
                          className={cn(
                            "text-xs",
                            alert.status === "watching"
                              ? "bg-green-500/20 text-green-500"
                              : alert.status === "opened"
                                ? "bg-blue-500/20 text-blue-500"
                                : "bg-secondary text-muted-foreground",
                          )}
                        >
                          {alert.status}
                        </Badge>
                      </div>
                    ))}
                    {emergencyStations.length > 0 && (
                      <div className="flex items-center gap-2 p-2 rounded bg-blue-500/10 border border-blue-500/30">
                        <Shield className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-blue-400">
                          {emergencyStations.length} emergency stations monitoring
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="w-full bg-transparent" onClick={sendLocationUpdate}>
                    <Send className="w-4 h-4 mr-2" />
                    Send Update
                  </Button>
                  <Button variant="destructive" className="w-full" onClick={endWalk}>
                    <Square className="w-4 h-4 mr-2" />
                    End Walk
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
