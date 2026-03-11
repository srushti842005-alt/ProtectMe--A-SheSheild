"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { sendOfflineSMS } from "@/lib/offline-manager"

export interface Contact {
  id: string
  name: string
  phone: string
  email?: string
  relationship: string
  isPrimary: boolean
  notifyOnSOS: boolean
  shareLocation: boolean
  createdAt: Date
  isPoliceStation?: boolean
  isEmergencyService?: boolean
  distance?: string
}

interface SOSSession {
  sessionId: string
  isActive: boolean
  startTime: Date
  contacts: Contact[]
}

interface ContactsContextType {
  contacts: Contact[]
  addContact: (contact: Omit<Contact, "id" | "createdAt">) => void
  updateContact: (id: string, contact: Partial<Contact>) => void
  deleteContact: (id: string) => void
  setPrimaryContact: (id: string) => void
  importFromPhone: () => Promise<void>
  addNearbyPoliceStations: (lat: number, lng: number) => Promise<void>
  sendSOSAlerts: (location: { lat: number; lng: number; address: string }) => Promise<{
    sent: Contact[]
    failed: Contact[]
    sessionId: string
  }>
  updateSOSLocation: (sessionId: string, location: { lat: number; lng: number; address: string }) => Promise<void>
  endSOSSession: (sessionId: string) => Promise<void>
  currentSOSSession: SOSSession | null
  sendOfflineSOSToAll: (location?: { lat: number; lng: number; address?: string }) => Promise<void>
}

const ContactsContext = createContext<ContactsContextType | undefined>(undefined)

const defaultContacts: Contact[] = [
  {
    id: "1",
    name: "Mom",
    phone: "+17813680539",
    relationship: "Parent",
    isPrimary: true,
    notifyOnSOS: true,
    shareLocation: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: "2",
    name: "Dad",
    phone: "+919741589059",
    relationship: "Parent",
    isPrimary: false,
    notifyOnSOS: true,
    shareLocation: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: "3",
    name: "Best Friend",
    phone: "+918050253556",
    relationship: "Friend",
    isPrimary: false,
    notifyOnSOS: true,
    shareLocation: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
]

const DB_NAME = "ProtectMeContactsDB"
const DB_VERSION = 1

function openContactsDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains("contacts")) {
        db.createObjectStore("contacts", { keyPath: "id" })
      }
    }
  })
}

async function saveContactsToIndexedDB(contacts: Contact[]) {
  try {
    const db = await openContactsDB()
    const tx = db.transaction("contacts", "readwrite")
    const store = tx.objectStore("contacts")
    store.clear()
    contacts.forEach((contact) => store.put(contact))
  } catch (e) {
    console.error("Failed to save to IndexedDB:", e)
  }
}

async function loadContactsFromIndexedDB(): Promise<Contact[]> {
  try {
    const db = await openContactsDB()
    const tx = db.transaction("contacts", "readonly")
    const store = tx.objectStore("contacts")
    const request = store.getAll()
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result || [])
      request.onerror = () => reject(request.error)
    })
  } catch (e) {
    return []
  }
}

export function ContactsProvider({ children }: { children: React.ReactNode }) {
  const [contacts, setContacts] = useState<Contact[]>(defaultContacts)
  const [currentSOSSession, setCurrentSOSSession] = useState<SOSSession | null>(null)
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    // Load from localStorage first
    const saved = localStorage.getItem("protectme_contacts")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setContacts(parsed)
          saveContactsToIndexedDB(parsed) // Sync to IndexedDB
        }
      } catch (e) {
        setContacts(defaultContacts)
      }
    }

    // Also try loading from IndexedDB (for offline)
    loadContactsFromIndexedDB().then((offlineContacts) => {
      if (offlineContacts.length > 0 && !saved) {
        setContacts(offlineContacts)
      }
    })

    // Track online status
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

  const saveContacts = (newContacts: Contact[]) => {
    setContacts(newContacts)
    localStorage.setItem("protectme_contacts", JSON.stringify(newContacts))
    saveContactsToIndexedDB(newContacts) // Also save to IndexedDB for offline
  }

  const addContact = (contact: Omit<Contact, "id" | "createdAt">) => {
    const newContact: Contact = {
      ...contact,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    }
    saveContacts([...contacts, newContact])
  }

  const updateContact = (id: string, updates: Partial<Contact>) => {
    saveContacts(contacts.map((c) => (c.id === id ? { ...c, ...updates } : c)))
  }

  const deleteContact = (id: string) => {
    saveContacts(contacts.filter((c) => c.id !== id))
  }

  const setPrimaryContact = (id: string) => {
    saveContacts(contacts.map((c) => ({ ...c, isPrimary: c.id === id })))
  }

  const importFromPhone = async () => {
    try {
      if ("contacts" in navigator && "ContactsManager" in window) {
        const props = ["name", "email", "tel"]
        const opts = { multiple: true }
        // @ts-ignore
        const selectedContacts = await navigator.contacts.select(props, opts)

        if (selectedContacts && selectedContacts.length > 0) {
          const newContacts: Contact[] = selectedContacts.map((contact: any) => ({
            id: crypto.randomUUID(),
            name: contact.name?.[0] || "Unknown",
            phone: contact.tel?.[0] || "",
            email: contact.email?.[0] || "",
            relationship: "Friend",
            isPrimary: false,
            notifyOnSOS: true,
            shareLocation: false,
            createdAt: new Date(),
          }))
          saveContacts([...contacts, ...newContacts])
        }
      } else {
        alert("Contact Picker not supported. Please add contacts manually.")
      }
    } catch (error) {
      console.error("Contact import error:", error)
    }
  }

  const addNearbyPoliceStations = async (lat: number, lng: number) => {
    try {
      // Use our backend API with real Bangalore/Whitefield police station data
      const response = await fetch(`/api/nearby-police?lat=${lat}&lng=${lng}`)
      const data = await response.json()

      if (data.success && data.policeStations && data.policeStations.length > 0) {
        const policeContacts: Contact[] = data.policeStations.map((station: any) => ({
          id: `police-${crypto.randomUUID()}`,
          name: station.name,
          phone: station.phone,
          relationship: "Police Station",
          isPrimary: false,
          notifyOnSOS: true,
          shareLocation: true,
          createdAt: new Date(),
          isPoliceStation: true,
          isEmergencyService: true,
          distance: station.distance,
        }))

        // Also add government emergency services
        const emergencyContacts: Contact[] =
          data.emergencyServices
            ?.filter((svc: any) => svc.type === "police")
            .map((svc: any) => ({
              id: `emergency-${crypto.randomUUID()}`,
              name: svc.name,
              phone: svc.phone,
              relationship: "Emergency Service",
              isPrimary: false,
              notifyOnSOS: true,
              shareLocation: true,
              createdAt: new Date(),
              isPoliceStation: svc.type === "police",
              isEmergencyService: true,
            })) || []

        const nonPoliceContacts = contacts.filter((c) => !c.isPoliceStation && !c.isEmergencyService)
        saveContacts([...nonPoliceContacts, ...policeContacts, ...emergencyContacts])
      }
    } catch (error) {
      console.error("Failed to fetch police stations:", error)
      // Fallback: Add Whitefield Police Station directly
      const fallbackPolice: Contact[] = [
        {
          id: `police-${crypto.randomUUID()}`,
          name: "Whitefield Police Station",
          phone: "080-28452317",
          relationship: "Police Station",
          isPrimary: false,
          notifyOnSOS: true,
          shareLocation: true,
          createdAt: new Date(),
          isPoliceStation: true,
          isEmergencyService: true,
          distance: "Nearby",
        },
        {
          id: `police-${crypto.randomUUID()}`,
          name: "Emergency Police (100)",
          phone: "100",
          relationship: "Emergency Service",
          isPrimary: false,
          notifyOnSOS: true,
          shareLocation: true,
          createdAt: new Date(),
          isPoliceStation: true,
          isEmergencyService: true,
        },
      ]
      const nonPoliceContacts = contacts.filter((c) => !c.isPoliceStation && !c.isEmergencyService)
      saveContacts([...nonPoliceContacts, ...fallbackPolice])
    }
  }

  const sendOfflineSOSToAll = async (location?: { lat: number; lng: number; address?: string }) => {
    const sosContacts = contacts.filter((c) => c.notifyOnSOS)

    const locationText = location
      ? `\n\nMy Location: ${location.address || `${location.lat}, ${location.lng}`}\nGoogle Maps: https://maps.google.com/?q=${location.lat},${location.lng}`
      : ""

    const message = `EMERGENCY SOS!\n\nI need immediate help! This is an emergency alert.${locationText}\n\nPlease call me or come to my location immediately!\n\nSent from ProtectMe SOS App`

    for (const contact of sosContacts) {
      sendOfflineSMS(contact.phone, message)
      // Small delay between messages to prevent overload
      await new Promise((resolve) => setTimeout(resolve, 800))
    }
  }

  const sendSOSAlerts = async (location: { lat: number; lng: number; address: string }): Promise<{
    sent: Contact[]
    failed: Contact[]
    sessionId: string
  }> => {
    const sosContacts = contacts.filter((c) => c.notifyOnSOS)
    const sent: Contact[] = []
    const failed: Contact[] = []

    const userName = contacts.find((c) => c.isPrimary)?.name || "ProtectMe User"
    const mapLink = `https://www.google.com/maps?q=${location.lat},${location.lng}`
    const liveTrackLink = `https://www.google.com/maps/@${location.lat},${location.lng},18z`

    const message = `🚨 *EMERGENCY SOS ALERT* 🚨

*${userName}* needs immediate help!

📍 *Location:* ${location.address}

🗺️ *View on Map:* ${mapLink}

📡 *Live Tracking:* ${liveTrackLink}

⏰ *Time:* ${new Date().toLocaleString()}

⚠️ This is an automated emergency alert from ProtectMe SOS app.

*Please respond immediately or call emergency services!*`

    const smsMessage = `EMERGENCY SOS! ${userName} needs help!\n\nLocation: ${location.address}\nMap: ${mapLink}\n\nPlease respond immediately!`

    if (!navigator.onLine) {
      await sendOfflineSOSToAll(location)
      return {
        sent: sosContacts,
        failed: [],
        sessionId: crypto.randomUUID(),
      }
    }

    // Start SOS session on backend
    let sessionId = ""
    try {
      const sessionRes = await fetch("/api/sos-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "start",
          userId: crypto.randomUUID(),
          location,
          contacts: sosContacts.map((c) => c.phone),
        }),
      })
      const sessionData = await sessionRes.json()
      sessionId = sessionData.sessionId || crypto.randomUUID()
    } catch (e) {
      sessionId = crypto.randomUUID()
    }

    // Send alerts to ALL contacts simultaneously (parallel)
    const sendPromises = sosContacts.map(async (contact, index) => {
      try {
        const phoneClean = contact.phone.replace(/[^0-9]/g, "")
        const whatsappUrl = `https://wa.me/${phoneClean}?text=${encodeURIComponent(message)}`

        // 1. Send SMS via API (actual SMS delivery if configured)
        const smsPromise = fetch("/api/send-sms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: contact.phone,
            message: smsMessage,
            location,
          }),
        }).catch(() => null)

        // 2. Open native SMS app as backup (delayed to not overwhelm)
        setTimeout(() => {
          sendOfflineSMS(contact.phone, smsMessage)
        }, index * 500)

        // 3. Auto-open WhatsApp for ALL contacts with notifyOnSOS enabled
        // Stagger opening to prevent popup blocker issues
        setTimeout(() => {
          window.open(whatsappUrl, `_blank_${index}`)
        }, index * 300)

        await smsPromise

        // Store alert
        const alerts = JSON.parse(localStorage.getItem("protectme_sos_alerts") || "[]")
        alerts.push({
          id: crypto.randomUUID(),
          sessionId,
          contactId: contact.id,
          contactName: contact.name,
          contactPhone: contact.phone,
          message,
          location,
          timestamp: new Date().toISOString(),
          status: "sent",
          whatsappUrl,
        })
        localStorage.setItem("protectme_sos_alerts", JSON.stringify(alerts))

        return { contact, success: true }
      } catch (error) {
        return { contact, success: false }
      }
    })

    const results = await Promise.all(sendPromises)
    results.forEach((r) => {
      if (r.success) sent.push(r.contact)
      else failed.push(r.contact)
    })

    // Set current session
    setCurrentSOSSession({
      sessionId,
      isActive: true,
      startTime: new Date(),
      contacts: sent,
    })

    // Show browser notification
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("SOS Alert Sent!", {
        body: `Emergency alerts sent to ${sent.length} contacts with your live location.`,
        icon: "/icon-192.jpg",
        tag: "sos-alert",
      })
    }

    return { sent, failed, sessionId }
  }

  const updateSOSLocation = async (sessionId: string, location: { lat: number; lng: number; address: string }) => {
    try {
      await fetch("/api/sos-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update",
          sessionId,
          location,
        }),
      })

      // Update stored alerts with new location
      const alerts = JSON.parse(localStorage.getItem("protectme_sos_alerts") || "[]")
      const updatedAlerts = alerts.map((alert: any) =>
        alert.sessionId === sessionId ? { ...alert, location, lastUpdate: new Date().toISOString() } : alert,
      )
      localStorage.setItem("protectme_sos_alerts", JSON.stringify(updatedAlerts))
    } catch (error) {
      console.error("Failed to update SOS location:", error)
    }
  }

  const endSOSSession = async (sessionId: string) => {
    try {
      await fetch("/api/sos-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "end",
          sessionId,
        }),
      })

      setCurrentSOSSession(null)

      // Notify contacts that user is safe
      const sosContacts = contacts.filter((c) => c.notifyOnSOS)
      const safeMessage = `✅ *ALL CLEAR* ✅\n\nThe emergency has been resolved. User is now safe.\n\nThank you for your concern!`

      for (const contact of sosContacts.slice(0, 3)) {
        sendOfflineSMS(contact.phone, "ALL CLEAR - Emergency resolved. User is now safe. Thank you!")
      }

      for (const contact of sosContacts.slice(0, 2)) {
        const phoneClean = contact.phone.replace(/[^0-9]/g, "")
        const whatsappUrl = `https://wa.me/${phoneClean}?text=${encodeURIComponent(safeMessage)}`
        window.open(whatsappUrl, "_blank")
      }
    } catch (error) {
      console.error("Failed to end SOS session:", error)
    }
  }

  return (
    <ContactsContext.Provider
      value={{
        contacts,
        addContact,
        updateContact,
        deleteContact,
        setPrimaryContact,
        importFromPhone,
        addNearbyPoliceStations,
        sendSOSAlerts,
        updateSOSLocation,
        endSOSSession,
        currentSOSSession,
        sendOfflineSOSToAll,
      }}
    >
      {children}
    </ContactsContext.Provider>
  )
}

export function useContacts() {
  const context = useContext(ContactsContext)
  if (context === undefined) {
    throw new Error("useContacts must be used within a ContactsProvider")
  }
  return context
}
