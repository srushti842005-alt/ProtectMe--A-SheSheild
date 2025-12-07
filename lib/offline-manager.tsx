"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface OfflineData {
  contacts: any[]
  sosHistory: any[]
  safeLocations: any[]
  userProfile: any
  cachedLocation: { lat: number; lng: number; address?: string } | null
}

interface OfflineContextType {
  isOnline: boolean
  offlineData: OfflineData
  saveOfflineData: (key: keyof OfflineData, data: any) => void
  syncPendingActions: () => Promise<void>
  pendingActions: any[]
  addPendingAction: (action: any) => void
  cachedLocation: { lat: number; lng: number; address?: string } | null
}

const OfflineContext = createContext<OfflineContextType | null>(null)

const DB_NAME = "ProtectMeOfflineDB"
const DB_VERSION = 1

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result

      if (!db.objectStoreNames.contains("offlineData")) {
        db.createObjectStore("offlineData", { keyPath: "key" })
      }
      if (!db.objectStoreNames.contains("pendingActions")) {
        db.createObjectStore("pendingActions", { keyPath: "id", autoIncrement: true })
      }
      if (!db.objectStoreNames.contains("cachedMedia")) {
        db.createObjectStore("cachedMedia", { keyPath: "url" })
      }
    }
  })
}

async function saveToIndexedDB(storeName: string, data: any) {
  const db = await openDatabase()
  const tx = db.transaction(storeName, "readwrite")
  const store = tx.objectStore(storeName)
  store.put(data)
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve(true)
    tx.onerror = () => reject(tx.error)
  })
}

async function getFromIndexedDB(storeName: string, key: string): Promise<any> {
  const db = await openDatabase()
  const tx = db.transaction(storeName, "readonly")
  const store = tx.objectStore(storeName)
  const request = store.get(key)
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function getAllFromIndexedDB(storeName: string): Promise<any[]> {
  const db = await openDatabase()
  const tx = db.transaction(storeName, "readonly")
  const store = tx.objectStore(storeName)
  const request = store.getAll()
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

const EMERGENCY_NUMBERS = {
  police: "100",
  ambulance: "108",
  women_helpline: "1091",
  fire: "101",
}

// Function to make offline call using native tel: protocol
export function makeOfflineCall(phoneNumber: string) {
  if (typeof window === "undefined") return
  const cleanNumber = phoneNumber.replace(/\s+/g, "").replace(/[^\d+]/g, "")
  window.location.href = `tel:${cleanNumber}`
}

// Function to send offline SMS using native sms: protocol
export function sendOfflineSMS(phoneNumber: string, message: string) {
  if (typeof window === "undefined") return
  const cleanNumber = phoneNumber.replace(/\s+/g, "").replace(/[^\d+]/g, "")
  const encodedMessage = encodeURIComponent(message)
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
  window.location.href = isIOS
    ? `sms:${cleanNumber}&body=${encodedMessage}`
    : `sms:${cleanNumber}?body=${encodedMessage}`
}

// Function to send SOS to multiple contacts offline
export async function sendOfflineSOS(contacts: any[], location?: { lat: number; lng: number; address?: string }) {
  const locationText = location
    ? `Location: ${location.address || `${location.lat}, ${location.lng}`}\nGoogle Maps: https://maps.google.com/?q=${location.lat},${location.lng}`
    : "Location unavailable"

  const message = `EMERGENCY SOS! I need help immediately!\n\n${locationText}\n\nSent from ProtectMe SOS App`

  // Send SMS to each contact
  for (const contact of contacts) {
    if (contact.notifyOnSOS && contact.phone) {
      sendOfflineSMS(contact.phone, message)
      // Small delay between messages
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }
}

export function OfflineProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState(true)
  const [offlineData, setOfflineData] = useState<OfflineData>({
    contacts: [],
    sosHistory: [],
    safeLocations: [],
    userProfile: null,
    cachedLocation: null,
  })
  const [pendingActions, setPendingActions] = useState<any[]>([])
  const [cachedLocation, setCachedLocation] = useState<{ lat: number; lng: number; address?: string } | null>(null)

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => {
      setIsOnline(true)
      syncPendingActions()
    }
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    loadOfflineData()

    const cacheLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const loc = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            }
            // Try to get address
            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${loc.lat}&lon=${loc.lng}&format=json`,
              )
              const data = await response.json()
              loc.address = data.display_name
            } catch {}
            setCachedLocation(loc)
            await saveToIndexedDB("offlineData", { key: "cachedLocation", data: loc })
          },
          () => {},
        )
      }
    }

    cacheLocation()
    const locationInterval = setInterval(cacheLocation, 60000) // Update every minute

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
      clearInterval(locationInterval)
    }
  }, [])

  const loadOfflineData = async () => {
    try {
      const contacts = await getFromIndexedDB("offlineData", "contacts")
      const sosHistory = await getFromIndexedDB("offlineData", "sosHistory")
      const safeLocations = await getFromIndexedDB("offlineData", "safeLocations")
      const userProfile = await getFromIndexedDB("offlineData", "userProfile")
      const pending = await getAllFromIndexedDB("pendingActions")
      const cachedLoc = await getFromIndexedDB("offlineData", "cachedLocation")

      setOfflineData({
        contacts: contacts?.data || [],
        sosHistory: sosHistory?.data || [],
        safeLocations: safeLocations?.data || [],
        userProfile: userProfile?.data || null,
        cachedLocation: cachedLoc?.data || null,
      })
      setPendingActions(pending)
    } catch (error) {
      console.error("Error loading offline data:", error)
    }
  }

  const saveOfflineData = async (key: keyof OfflineData, data: any) => {
    try {
      await saveToIndexedDB("offlineData", { key, data })
      setOfflineData((prev) => ({ ...prev, [key]: data }))
    } catch (error) {
      console.error("Error saving offline data:", error)
    }
  }

  const addPendingAction = async (action: any) => {
    try {
      const actionWithTimestamp = { ...action, timestamp: Date.now() }
      await saveToIndexedDB("pendingActions", actionWithTimestamp)
      setPendingActions((prev) => [...prev, actionWithTimestamp])
    } catch (error) {
      console.error("Error adding pending action:", error)
    }
  }

  const syncPendingActions = async () => {
    if (!isOnline || pendingActions.length === 0) return

    for (const action of pendingActions) {
      try {
        // Process each pending action based on type
        switch (action.type) {
          case "SOS_ALERT":
            // Send SOS alert to server
            console.log("Syncing SOS alert:", action)
            break
          case "LOCATION_UPDATE":
            // Send location update
            console.log("Syncing location:", action)
            break
          case "INCIDENT_REPORT":
            // Submit incident report
            console.log("Syncing incident:", action)
            break
        }

        // Remove from pending after successful sync
        const db = await openDatabase()
        const tx = db.transaction("pendingActions", "readwrite")
        tx.objectStore("pendingActions").delete(action.id)
      } catch (error) {
        console.error("Error syncing action:", error)
      }
    }

    setPendingActions([])
  }

  return (
    <OfflineContext.Provider
      value={{
        isOnline,
        offlineData,
        saveOfflineData,
        syncPendingActions,
        pendingActions,
        addPendingAction,
        cachedLocation,
      }}
    >
      {children}
    </OfflineContext.Provider>
  )
}

export function useOffline() {
  const context = useContext(OfflineContext)
  if (!context) {
    throw new Error("useOffline must be used within OfflineProvider")
  }
  return context
}
