"use client"

import { useState } from "react"
import type { Contact } from "@/lib/contacts-context"
import { useContacts } from "@/lib/contacts-context"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  User,
  Phone,
  Mail,
  MoreVertical,
  Star,
  Trash2,
  Edit,
  MapPin,
  Bell,
  MessageCircle,
  Shield,
  Send,
  Check,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ContactCardProps {
  contact: Contact
  onEdit: (contact: Contact) => void
}

export function ContactCard({ contact, onEdit }: ContactCardProps) {
  const { updateContact, deleteContact, setPrimaryContact } = useContacts()
  const [whatsappSent, setWhatsappSent] = useState(false)
  const [smsSent, setSmsSent] = useState(false)
  const [isCalling, setIsCalling] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null)

  const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"))
        return
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => reject(err),
        { enableHighAccuracy: true, timeout: 10000 },
      )
    })
  }

  const openWhatsApp = async () => {
    const phoneClean = contact.phone.replace(/[^0-9]/g, "")
    let locationText = ""

    try {
      const loc = await getCurrentLocation()
      setCurrentLocation(loc)
      locationText = `\n\nMy live location: https://maps.google.com/?q=${loc.lat},${loc.lng}`
    } catch (e) {
      console.log("[v0] Could not get location for WhatsApp")
    }

    const message = encodeURIComponent(`Hi! I'm sharing my location with you from ProtectMe SOS app.${locationText}`)
    window.open(`https://wa.me/${phoneClean}?text=${message}`, "_blank")
    setWhatsappSent(true)
    setTimeout(() => setWhatsappSent(false), 3000)
  }

  const makeCall = () => {
    setIsCalling(true)
    const phoneClean = contact.phone.replace(/[^0-9+]/g, "")
    window.location.href = `tel:${phoneClean}`
    setTimeout(() => setIsCalling(false), 1000)
  }

  const sendSOSNotification = async () => {
    const phoneClean = contact.phone.replace(/[^0-9+]/g, "")
    let locationText = ""

    try {
      const loc = await getCurrentLocation()
      setCurrentLocation(loc)
      locationText = `\nMy Location: https://maps.google.com/?q=${loc.lat},${loc.lng}`
    } catch (e) {
      console.log("[v0] Could not get location for SMS")
    }

    const message = encodeURIComponent(
      `EMERGENCY SOS!\n\nI need your help immediately! This is an emergency alert from ProtectMe SOS.${locationText}\n\nPlease call me or come to my location!`,
    )
    window.location.href = `sms:${phoneClean}?body=${message}`
    setSmsSent(true)
    setTimeout(() => setSmsSent(false), 3000)
  }

  const shareLocation = async () => {
    const phoneClean = contact.phone.replace(/[^0-9]/g, "")

    try {
      const loc = await getCurrentLocation()
      setCurrentLocation(loc)
      const message = encodeURIComponent(
        `Here's my current live location:\nhttps://maps.google.com/?q=${loc.lat},${loc.lng}\n\nShared via ProtectMe SOS`,
      )
      window.open(`https://wa.me/${phoneClean}?text=${message}`, "_blank")
    } catch (e) {
      alert("Could not get your location. Please enable GPS.")
    }
  }

  return (
    <div
      className={cn(
        "p-4 rounded-xl bg-card border transition-colors",
        contact.isPrimary ? "border-emergency/50" : contact.isPoliceStation ? "border-blue-500/50" : "border-border",
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center",
              contact.isPrimary ? "bg-emergency/10" : contact.isPoliceStation ? "bg-blue-500/10" : "bg-secondary",
            )}
          >
            {contact.isPoliceStation ? (
              <Shield className="w-6 h-6 text-blue-500" />
            ) : (
              <User className={cn("w-6 h-6", contact.isPrimary ? "text-emergency" : "text-foreground")} />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground">{contact.name}</h3>
              {contact.isPrimary && <Star className="w-4 h-4 text-emergency fill-emergency" />}
              {contact.isPoliceStation && (
                <span className="px-2 py-0.5 text-xs bg-blue-500/20 text-blue-400 rounded-full">Police</span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{contact.relationship}</p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card border-border">
            <DropdownMenuItem onClick={() => onEdit(contact)} className="cursor-pointer">
              <Edit className="w-4 h-4 mr-2" />
              Edit Contact
            </DropdownMenuItem>
            {!contact.isPrimary && !contact.isPoliceStation && (
              <DropdownMenuItem onClick={() => setPrimaryContact(contact.id)} className="cursor-pointer">
                <Star className="w-4 h-4 mr-2" />
                Set as Primary
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem
              onClick={() => deleteContact(contact.id)}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Contact
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="w-4 h-4" />
          <span>{contact.phone}</span>
        </div>
        {contact.email && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="w-4 h-4" />
            <span>{contact.email}</span>
          </div>
        )}
      </div>

      <div className="flex gap-2 mb-4">
        <Button
          size="sm"
          variant="outline"
          className={cn(
            "flex-1 border-green-500/30 hover:bg-green-500/10 bg-transparent",
            whatsappSent ? "text-green-500" : "text-green-500",
          )}
          onClick={openWhatsApp}
        >
          {whatsappSent ? (
            <>
              <Check className="w-4 h-4 mr-1" />
              Opened
            </>
          ) : (
            <>
              <MessageCircle className="w-4 h-4 mr-1" />
              WhatsApp
            </>
          )}
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1 border-blue-500/30 text-blue-500 hover:bg-blue-500/10 bg-transparent"
          onClick={makeCall}
          disabled={isCalling}
        >
          {isCalling ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Phone className="w-4 h-4 mr-1" />}
          Call
        </Button>
      </div>

      <div className="space-y-3 pt-3 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Bell className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground">Notify on SOS</span>
          </div>
          <div className="flex items-center gap-2">
            {contact.notifyOnSOS && (
              <Button
                size="sm"
                variant="ghost"
                onClick={sendSOSNotification}
                className="h-7 px-2 text-xs text-emergency hover:text-emergency hover:bg-emergency/10"
              >
                {smsSent ? <Check className="w-3 h-3 mr-1" /> : <Send className="w-3 h-3 mr-1" />}
                {smsSent ? "Sent" : "Test"}
              </Button>
            )}
            <Switch
              checked={contact.notifyOnSOS}
              onCheckedChange={(checked) => updateContact(contact.id, { notifyOnSOS: checked })}
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground">Share Location</span>
          </div>
          <div className="flex items-center gap-2">
            {contact.shareLocation && (
              <Button
                size="sm"
                variant="ghost"
                onClick={shareLocation}
                className="h-7 px-2 text-xs text-green-500 hover:text-green-500 hover:bg-green-500/10"
              >
                <MapPin className="w-3 h-3 mr-1" />
                Share Now
              </Button>
            )}
            <Switch
              checked={contact.shareLocation}
              onCheckedChange={(checked) => updateContact(contact.id, { shareLocation: checked })}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
