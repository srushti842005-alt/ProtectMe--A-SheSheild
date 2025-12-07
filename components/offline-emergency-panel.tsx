"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Phone,
  MessageSquare,
  MapPin,
  Wifi,
  WifiOff,
  Shield,
  Siren,
  Heart,
  Flame,
  Users,
  AlertTriangle,
  X,
  PhoneCall,
  Send,
  Building2,
  Baby,
  Ambulance,
  RefreshCw,
  Navigation,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useContacts } from "@/lib/contacts-context"

const EMERGENCY_SERVICES = [
  { name: "Police Control Room", number: "100", icon: Siren, color: "bg-blue-600" },
  { name: "Ambulance (EMRI)", number: "108", icon: Ambulance, color: "bg-red-600" },
  { name: "Women Helpline", number: "1091", icon: Shield, color: "bg-pink-600" },
  { name: "Fire Emergency", number: "101", icon: Flame, color: "bg-orange-600" },
]

const WHITEFIELD_POLICE_STATIONS = [
  { name: "Whitefield Police Station", number: "080-28452317", area: "ITPL Main Road" },
  { name: "Kadugodi Police Station", number: "080-28450481", area: "Old Madras Road" },
  { name: "Varthur Police Station", number: "080-25743624", area: "Varthur Main Road" },
  { name: "Mahadevapura Police Station", number: "080-28524550", area: "Outer Ring Road" },
]

const GOVT_HELPLINES = [
  { name: "Child Helpline", number: "1098", icon: Baby, color: "bg-yellow-600" },
  { name: "Bangalore City Police", number: "080-22943500", icon: Building2, color: "bg-indigo-600" },
]

export function OfflineEmergencyPanel() {
  const { contacts } = useContacts()
  const [isOnline, setIsOnline] = useState(true)
  const [showPanel, setShowPanel] = useState(false)
  const [cachedLocation, setCachedLocation] = useState<{ lat: number; lng: number; address?: string } | null>(null)
  const [sendingToAll, setSendingToAll] = useState(false)
  const [sentContacts, setSentContacts] = useState<string[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)

  const refreshLocation = useCallback(() => {
    setIsRefreshing(true)
    setLocationError(null)

    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported")
      setIsRefreshing(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        let address = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1&zoom=18`,
            { headers: { "User-Agent": "ProtectMeSOS/1.0" } },
          )
          const data = await response.json()
          if (data.display_name) {
            address = data.display_name.split(",").slice(0, 4).join(", ")
          }
        } catch (e) {
          console.log("[v0] Reverse geocoding failed, using coordinates")
        }

        setCachedLocation({ lat: latitude, lng: longitude, address })
        setIsRefreshing(false)
      },
      (error) => {
        setLocationError(error.message)
        setIsRefreshing(false)
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    )
  }, [])

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => {
      setIsOnline(false)
      setShowPanel(true)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Get initial location
    refreshLocation()

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [refreshLocation])

  const sosContacts = contacts.filter((c) => c.notifyOnSOS && !c.isPoliceStation && !c.isEmergencyService)

  const handleCallContact = (phone: string) => {
    const cleanPhone = phone.replace(/[^0-9+]/g, "")
    window.location.href = `tel:${cleanPhone}`
  }

  const handleSMSContact = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/[^0-9+]/g, "")
    const locationText = cachedLocation
      ? `My location: ${cachedLocation.address || ""}\nGoogle Maps: https://maps.google.com/?q=${cachedLocation.lat},${cachedLocation.lng}`
      : ""
    const message = encodeURIComponent(
      `EMERGENCY SOS!\n\nI need immediate help!\n\n${locationText}\n\nPlease call me or come to my location immediately!\n\n- Sent from ProtectMe SOS`,
    )
    window.location.href = `sms:${cleanPhone}?body=${message}`
  }

  const handleWhatsAppContact = (phone: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, "")
    const locationText = cachedLocation
      ? `\n\nMy live location: https://maps.google.com/?q=${cachedLocation.lat},${cachedLocation.lng}`
      : ""
    const message = encodeURIComponent(
      `EMERGENCY SOS!\n\nI need immediate help!${locationText}\n\nPlease call me or come to my location immediately!`,
    )
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, "_blank")
  }

  const handleSendSOSToAll = async () => {
    setSendingToAll(true)
    setSentContacts([])

    for (const contact of sosContacts) {
      handleWhatsAppContact(contact.phone)
      setSentContacts((prev) => [...prev, contact.phone])
      await new Promise((resolve) => setTimeout(resolve, 1500))
    }

    setSendingToAll(false)
  }

  if (!showPanel) {
    return (
      <button
        onClick={() => setShowPanel(true)}
        className={`fixed bottom-24 right-4 z-50 p-3 rounded-full shadow-lg ${
          isOnline ? "bg-green-500" : "bg-red-500 animate-pulse"
        }`}
      >
        {isOnline ? <Wifi className="w-5 h-5 text-white" /> : <WifiOff className="w-5 h-5 text-white" />}
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${isOnline ? "bg-green-500/20" : "bg-red-500/20"}`}>
              {isOnline ? <Wifi className="w-5 h-5 text-green-500" /> : <WifiOff className="w-5 h-5 text-red-500" />}
            </div>
            <div>
              <CardTitle className="text-foreground">Emergency Calling</CardTitle>
              <p className="text-sm text-muted-foreground">
                {isOnline ? "Online - All features available" : "Offline - Calls & SMS still work"}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setShowPanel(false)}>
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>

        <CardContent className="p-4 space-y-6">
          {/* Offline Notice */}
          {!isOnline && (
            <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-500">You are offline</p>
                  <p className="text-xs text-muted-foreground">
                    Phone calls and SMS work without internet as long as you have cellular signal.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="p-3 rounded-lg bg-secondary">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-foreground">Your Location</span>
              </div>
              <Button size="sm" variant="ghost" onClick={refreshLocation} disabled={isRefreshing} className="h-8 px-2">
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
              </Button>
            </div>
            {locationError ? (
              <p className="text-xs text-red-400">{locationError}</p>
            ) : cachedLocation ? (
              <>
                <p className="text-xs text-muted-foreground">{cachedLocation.address}</p>
                <Button
                  size="sm"
                  variant="link"
                  className="p-0 h-auto text-xs text-blue-400"
                  onClick={() =>
                    window.open(`https://maps.google.com/?q=${cachedLocation.lat},${cachedLocation.lng}`, "_blank")
                  }
                >
                  <Navigation className="w-3 h-3 mr-1" />
                  Open in Google Maps
                </Button>
              </>
            ) : (
              <p className="text-xs text-muted-foreground">Getting location...</p>
            )}
          </div>

          {/* Emergency Services */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Siren className="w-4 h-4 text-emergency" />
              Emergency Services (24/7)
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {EMERGENCY_SERVICES.map((service) => (
                <button
                  key={service.number}
                  onClick={() => handleCallContact(service.number)}
                  className={`p-3 rounded-lg ${service.color} text-white flex items-center gap-3 hover:opacity-90 transition-opacity active:scale-95`}
                >
                  <service.icon className="w-5 h-5" />
                  <div className="text-left">
                    <p className="font-medium text-sm">{service.name}</p>
                    <p className="text-xs opacity-80">{service.number}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Whitefield Police Stations */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-500" />
              Whitefield Area Police Stations
            </h3>
            <div className="space-y-2">
              {WHITEFIELD_POLICE_STATIONS.map((station) => (
                <div
                  key={station.number}
                  className="w-full p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-between"
                >
                  <div className="text-left">
                    <p className="font-medium text-foreground text-sm">{station.name}</p>
                    <p className="text-xs text-muted-foreground">{station.area}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-blue-400">{station.number}</span>
                    <Button
                      size="icon"
                      onClick={() => handleCallContact(station.number)}
                      className="bg-green-500 hover:bg-green-600 h-8 w-8"
                    >
                      <Phone className="w-4 h-4 text-white" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Helplines */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Additional Helplines</h3>
            <div className="grid grid-cols-2 gap-2">
              {GOVT_HELPLINES.map((helpline) => (
                <button
                  key={helpline.number}
                  onClick={() => handleCallContact(helpline.number)}
                  className={`p-3 rounded-lg ${helpline.color} text-white flex items-center gap-2 hover:opacity-90 transition-opacity active:scale-95`}
                >
                  <helpline.icon className="w-4 h-4" />
                  <div className="text-left">
                    <p className="font-medium text-xs">{helpline.name}</p>
                    <p className="text-[10px] opacity-80">{helpline.number}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Your Emergency Contacts */}
          {sosContacts.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Users className="w-4 h-4 text-emergency" />
                  Your Contacts ({sosContacts.length})
                </h3>
                <Button
                  size="sm"
                  onClick={handleSendSOSToAll}
                  disabled={sendingToAll}
                  className="bg-emergency hover:bg-emergency/90 text-white"
                >
                  {sendingToAll ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-3 h-3 mr-2" />
                      SOS All
                    </>
                  )}
                </Button>
              </div>

              <div className="space-y-2">
                {sosContacts.map((contact) => (
                  <div key={contact.id} className="p-3 rounded-lg bg-secondary flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emergency/20 flex items-center justify-center">
                        <span className="text-emergency font-semibold">{contact.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">{contact.name}</p>
                        <p className="text-xs text-muted-foreground">{contact.phone}</p>
                        {sentContacts.includes(contact.phone) && (
                          <Badge variant="outline" className="mt-1 text-xs text-green-500 border-green-500">
                            WhatsApp Opened
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleWhatsAppContact(contact.phone)}
                        className="border-green-500/30 bg-transparent h-9 w-9 text-green-500 hover:bg-green-500/10"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleSMSContact(contact.phone, contact.name)}
                        className="border-blue-500/30 bg-transparent h-9 w-9 text-blue-500 hover:bg-blue-500/10"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        onClick={() => handleCallContact(contact.phone)}
                        className="bg-green-500 hover:bg-green-600 h-9 w-9"
                      >
                        <PhoneCall className="w-4 h-4 text-white" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Contacts - Mom, Dad, Best Friend */}
          <div className="pt-4 border-t border-border">
            <h3 className="text-sm font-semibold text-foreground mb-3">Quick Call</h3>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleCallContact("+17813680539")}
                className="p-3 rounded-lg bg-pink-500/10 border border-pink-500/30 flex flex-col items-center gap-1 hover:bg-pink-500/20 active:scale-95"
              >
                <Heart className="w-6 h-6 text-pink-500" />
                <span className="text-xs font-medium text-foreground">Mom</span>
              </button>
              <button
                onClick={() => handleCallContact("+919741589059")}
                className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 flex flex-col items-center gap-1 hover:bg-blue-500/20 active:scale-95"
              >
                <Shield className="w-6 h-6 text-blue-500" />
                <span className="text-xs font-medium text-foreground">Dad</span>
              </button>
              <button
                onClick={() => handleCallContact("+918050253556")}
                className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30 flex flex-col items-center gap-1 hover:bg-purple-500/20 active:scale-95"
              >
                <Users className="w-6 h-6 text-purple-500" />
                <span className="text-xs font-medium text-foreground">Friend</span>
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Calls and SMS use your phone's cellular network. Works offline with cellular signal.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
