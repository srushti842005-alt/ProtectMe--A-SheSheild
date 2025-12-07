"use client"

import { useAuth } from "@/lib/auth-context"
import type { Contact } from "@/lib/contacts-context"
import { useContacts } from "@/lib/contacts-context"
import { redirect } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { ContactCard } from "@/components/contacts/contact-card"
import { AddContactDialog } from "@/components/contacts/add-contact-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  UserPlus,
  Search,
  Users,
  Shield,
  Smartphone,
  Siren,
  MapPin,
  Phone,
  WifiOff,
  MessageSquare,
  PhoneCall,
  Send,
  RefreshCw,
  Check,
} from "lucide-react"

export default function ContactsPage() {
  const { user, isLoading: authLoading } = useAuth()
  const { contacts, importFromPhone, addNearbyPoliceStations } = useContacts()
  const [searchQuery, setSearchQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editContact, setEditContact] = useState<Contact | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [isLoadingPolice, setIsLoadingPolice] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [sendingSOS, setSendingSOS] = useState(false)
  const [sentTo, setSentTo] = useState<string[]>([])
  const [cachedLocation, setCachedLocation] = useState<{ lat: number; lng: number; address?: string } | null>(null)
  const [locationLoading, setLocationLoading] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      redirect("/login")
    }
  }, [user, authLoading])

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const refreshLocation = useCallback(async () => {
    setLocationLoading(true)

    if (!navigator.geolocation) {
      setLocationLoading(false)
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
          console.log("[v0] Reverse geocoding failed")
        }

        setCachedLocation({ lat: latitude, lng: longitude, address })
        setLocationLoading(false)

        // Also refresh police stations
        const policeExists = contacts.some((c) => c.isPoliceStation)
        if (!policeExists) {
          await addNearbyPoliceStations(latitude, longitude)
        }
      },
      (error) => {
        console.log("[v0] Location error:", error.message)
        setLocationLoading(false)
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    )
  }, [contacts, addNearbyPoliceStations])

  useEffect(() => {
    refreshLocation()
  }, [])

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emergency border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const personalContacts = contacts.filter((c) => !c.isPoliceStation)
  const policeStations = contacts.filter((c) => c.isPoliceStation)

  const filteredContacts = personalContacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.includes(searchQuery) ||
      contact.relationship.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleEdit = (contact: Contact) => {
    setEditContact(contact)
    setDialogOpen(true)
  }

  const handleCloseDialog = (open: boolean) => {
    setDialogOpen(open)
    if (!open) setEditContact(null)
  }

  const handleImportFromPhone = async () => {
    setIsImporting(true)
    try {
      await importFromPhone()
    } finally {
      setIsImporting(false)
    }
  }

  const handleRefreshPolice = async () => {
    setIsLoadingPolice(true)

    if (!navigator.geolocation) {
      setIsLoadingPolice(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setCachedLocation((prev) => ({ ...prev, lat: latitude, lng: longitude }) as any)
        await addNearbyPoliceStations(latitude, longitude)
        setIsLoadingPolice(false)
      },
      (error) => {
        console.log("[v0] GPS Error:", error.message)
        alert("Could not get your location. Please enable GPS.")
        setIsLoadingPolice(false)
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    )
  }

  const handleSendSOSToAll = async () => {
    setSendingSOS(true)
    setSentTo([])

    const sosContacts = contacts.filter((c) => c.notifyOnSOS)

    // Get fresh location
    let locationText = ""
    if (cachedLocation) {
      locationText = `\n\nMy Location: https://maps.google.com/?q=${cachedLocation.lat},${cachedLocation.lng}`
    }

    for (const contact of sosContacts) {
      const phoneClean = contact.phone.replace(/[^0-9]/g, "")
      const message = encodeURIComponent(
        `EMERGENCY SOS!\n\nI need immediate help! This is an emergency alert from ProtectMe SOS app.${locationText}\n\nPlease call me or come to my location immediately!`,
      )
      window.open(`https://wa.me/${phoneClean}?text=${message}`, "_blank")
      setSentTo((prev) => [...prev, contact.id])
      await new Promise((resolve) => setTimeout(resolve, 1500))
    }

    setSendingSOS(false)
  }

  const makeCall = (phone: string) => {
    const cleanPhone = phone.replace(/[^0-9+]/g, "")
    window.location.href = `tel:${cleanPhone}`
  }

  const sendSMS = (phone: string) => {
    const cleanPhone = phone.replace(/[^0-9+]/g, "")
    const locationText = cachedLocation
      ? `\nLocation: https://maps.google.com/?q=${cachedLocation.lat},${cachedLocation.lng}`
      : ""
    const message = encodeURIComponent(`EMERGENCY! I need help!${locationText}`)
    window.location.href = `sms:${cleanPhone}?body=${message}`
  }

  const openWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, "")
    const locationText = cachedLocation
      ? `\n\nMy Location: https://maps.google.com/?q=${cachedLocation.lat},${cachedLocation.lng}`
      : ""
    const message = encodeURIComponent(`EMERGENCY! I need help!${locationText}`)
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, "_blank")
  }

  const sosContacts = contacts.filter((c) => c.notifyOnSOS)
  const locationContacts = contacts.filter((c) => c.shareLocation)

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground">Emergency Contacts</h1>
                {!isOnline && (
                  <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                    <WifiOff className="w-3 h-3 mr-1" />
                    Offline
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">
                {isOnline
                  ? "Manage people who will be notified in emergencies"
                  : "Calls & SMS work offline with cellular signal"}
              </p>
              {cachedLocation && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3 text-green-500" />
                  <span>
                    {cachedLocation.address || `${cachedLocation.lat.toFixed(4)}, ${cachedLocation.lng.toFixed(4)}`}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={refreshLocation}
                    disabled={locationLoading}
                    className="h-6 px-2"
                  >
                    <RefreshCw className={`w-3 h-3 ${locationLoading ? "animate-spin" : ""}`} />
                  </Button>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleImportFromPhone}
                variant="outline"
                className="border-border text-foreground bg-transparent"
                disabled={isImporting}
              >
                {isImporting ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Smartphone className="w-4 h-4 mr-2" />
                )}
                Import from Phone
              </Button>
              <Button
                onClick={() => setDialogOpen(true)}
                className="bg-emergency hover:bg-emergency/90 text-emergency-foreground"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add Contact
              </Button>
            </div>
          </div>

          {sosContacts.length > 0 && (
            <Card className="border-emergency/30 bg-emergency/5">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emergency" />
                    <h2 className="font-semibold text-foreground">Quick Emergency Actions</h2>
                    {!isOnline && (
                      <Badge variant="outline" className="text-xs text-green-500 border-green-500">
                        Works Offline
                      </Badge>
                    )}
                  </div>
                  <Button
                    onClick={handleSendSOSToAll}
                    disabled={sendingSOS}
                    className="bg-emergency hover:bg-emergency/90 text-white"
                  >
                    {sendingSOS ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        SOS to All ({sosContacts.length})
                      </>
                    )}
                  </Button>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {sosContacts.slice(0, 6).map((contact) => (
                    <div
                      key={contact.id}
                      className="p-3 rounded-lg bg-card border border-border flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emergency/20 flex items-center justify-center">
                          <span className="text-emergency font-semibold">{contact.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{contact.name}</p>
                          <p className="text-xs text-muted-foreground">{contact.phone}</p>
                          {sentTo.includes(contact.id) && (
                            <Badge variant="outline" className="mt-1 text-xs text-green-500 border-green-500">
                              <Check className="w-3 h-3 mr-1" />
                              Sent
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => openWhatsApp(contact.phone)}
                          className="border-green-500/30 bg-transparent h-8 w-8 text-green-500 hover:bg-green-500/10"
                          title="WhatsApp with location"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => sendSMS(contact.phone)}
                          className="border-blue-500/30 bg-transparent h-8 w-8 text-blue-500 hover:bg-blue-500/10"
                          title="SMS with location"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          onClick={() => makeCall(contact.phone)}
                          className="bg-green-500 hover:bg-green-600 h-8 w-8"
                          title="Call now"
                        >
                          <PhoneCall className="w-4 h-4 text-white" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <Users className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{personalContacts.length}</p>
                  <p className="text-xs text-muted-foreground">Contacts</p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emergency/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-emergency" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{sosContacts.length}</p>
                  <p className="text-xs text-muted-foreground">SOS Alerts</p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{locationContacts.length}</p>
                  <p className="text-xs text-muted-foreground">Location</p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Siren className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{policeStations.length}</p>
                  <p className="text-xs text-muted-foreground">Police</p>
                </div>
              </div>
            </div>
          </div>

          {policeStations.length > 0 && (
            <Card className="border-blue-500/30 bg-blue-500/5">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Siren className="w-5 h-5 text-blue-500" />
                    <h2 className="font-semibold text-foreground">Nearby Police Stations</h2>
                    {!isOnline && (
                      <Badge variant="outline" className="text-xs text-green-500 border-green-500">
                        Calls Work Offline
                      </Badge>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleRefreshPolice}
                    disabled={isLoadingPolice}
                    className="border-blue-500/30 text-blue-500 bg-transparent"
                  >
                    {isLoadingPolice ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh GPS
                      </>
                    )}
                  </Button>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {policeStations.map((station) => (
                    <div
                      key={station.id}
                      className="p-3 rounded-lg bg-card border border-border flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <Siren className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{station.name}</p>
                          <p className="text-xs text-muted-foreground">{station.phone}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => makeCall(station.phone)}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        <Phone className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border text-foreground"
            />
          </div>

          {/* Contacts Grid */}
          {filteredContacts.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {searchQuery ? "No contacts found" : "No personal contacts yet"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? "Try a different search term" : "Add your family and friends to notify in emergencies"}
              </p>
              {!searchQuery && (
                <div className="flex justify-center gap-2">
                  <Button onClick={handleImportFromPhone} variant="outline" className="border-border bg-transparent">
                    <Smartphone className="w-4 h-4 mr-2" />
                    Import from Phone
                  </Button>
                  <Button
                    onClick={() => setDialogOpen(true)}
                    className="bg-emergency hover:bg-emergency/90 text-emergency-foreground"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Manually
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredContacts.map((contact) => (
                <ContactCard key={contact.id} contact={contact} onEdit={handleEdit} />
              ))}
            </div>
          )}
        </div>
      </main>

      <AddContactDialog open={dialogOpen} onOpenChange={handleCloseDialog} editContact={editContact} />
    </div>
  )
}
