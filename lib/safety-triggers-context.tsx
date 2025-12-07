"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react"

interface SafetyTriggersContextType {
  // Shake Detection
  shakeEnabled: boolean
  setShakeEnabled: (enabled: boolean) => void
  shakeThreshold: number
  setShakeThreshold: (threshold: number) => void

  // Voice Activation
  voiceEnabled: boolean
  setVoiceEnabled: (enabled: boolean) => void
  voiceKeyword: string
  setVoiceKeyword: (keyword: string) => void
  isListeningForKeyword: boolean

  // Fall Detection
  fallDetectionEnabled: boolean
  setFallDetectionEnabled: (enabled: boolean) => void

  // Geofencing
  safeZones: SafeZone[]
  addSafeZone: (zone: Omit<SafeZone, "id">) => void
  removeSafeZone: (id: string) => void
  geofenceAlerts: boolean
  setGeofenceAlerts: (enabled: boolean) => void

  // Check-ins
  checkInEnabled: boolean
  setCheckInEnabled: (enabled: boolean) => void
  checkInInterval: number
  setCheckInInterval: (minutes: number) => void
  lastCheckIn: Date | null
  checkIn: () => void
  missedCheckIns: number

  // SOS Trigger callback
  onSOSTriggered: (reason: string) => void
  setOnSOSTriggered: (callback: (reason: string) => void) => void

  // Permissions
  permissions: {
    location: boolean
    microphone: boolean
    camera: boolean
    motion: boolean
  }
  requestPermission: (type: "location" | "microphone" | "camera" | "motion") => Promise<boolean>
}

interface SafeZone {
  id: string
  name: string
  lat: number
  lng: number
  radius: number // in meters
  type: "home" | "work" | "safe" | "custom"
}

const SafetyTriggersContext = createContext<SafetyTriggersContextType | undefined>(undefined)

export function SafetyTriggersProvider({ children }: { children: React.ReactNode }) {
  // Shake Detection State
  const [shakeEnabled, setShakeEnabled] = useState(true)
  const [shakeThreshold, setShakeThreshold] = useState(25)
  const lastShakeTime = useRef(0)
  const shakeCount = useRef(0)

  // Voice Activation State
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [voiceKeyword, setVoiceKeyword] = useState("help me now")
  const [isListeningForKeyword, setIsListeningForKeyword] = useState(false)
  const voiceRecognitionRef = useRef<any>(null)

  // Fall Detection State
  const [fallDetectionEnabled, setFallDetectionEnabled] = useState(true)
  const lastAcceleration = useRef({ x: 0, y: 0, z: 0, time: 0 })

  // Geofencing State
  const [safeZones, setSafeZones] = useState<SafeZone[]>([
    { id: "1", name: "Home", lat: 0, lng: 0, radius: 100, type: "home" },
  ])
  const [geofenceAlerts, setGeofenceAlerts] = useState(true)
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null)

  // Check-in State
  const [checkInEnabled, setCheckInEnabled] = useState(false)
  const [checkInInterval, setCheckInInterval] = useState(30) // minutes
  const [lastCheckIn, setLastCheckIn] = useState<Date | null>(null)
  const [missedCheckIns, setMissedCheckIns] = useState(0)
  const checkInTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Permissions
  const [permissions, setPermissions] = useState({
    location: false,
    microphone: false,
    camera: false,
    motion: false,
  })

  // SOS callback
  const sosCallbackRef = useRef<(reason: string) => void>(() => {})

  const onSOSTriggered = useCallback((reason: string) => {
    sosCallbackRef.current(reason)
  }, [])

  const setOnSOSTriggered = useCallback((callback: (reason: string) => void) => {
    sosCallbackRef.current = callback
  }, [])

  // Request permissions
  const requestPermission = async (type: "location" | "microphone" | "camera" | "motion"): Promise<boolean> => {
    try {
      if (type === "location") {
        const result = await navigator.permissions.query({ name: "geolocation" })
        if (result.state === "granted") {
          setPermissions((prev) => ({ ...prev, location: true }))
          return true
        }
        return new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(
            () => {
              setPermissions((prev) => ({ ...prev, location: true }))
              resolve(true)
            },
            () => resolve(false),
          )
        })
      }

      if (type === "microphone") {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        stream.getTracks().forEach((track) => track.stop())
        setPermissions((prev) => ({ ...prev, microphone: true }))
        return true
      }

      if (type === "camera") {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        stream.getTracks().forEach((track) => track.stop())
        setPermissions((prev) => ({ ...prev, camera: true }))
        return true
      }

      if (type === "motion") {
        if (typeof (DeviceMotionEvent as any).requestPermission === "function") {
          const result = await (DeviceMotionEvent as any).requestPermission()
          if (result === "granted") {
            setPermissions((prev) => ({ ...prev, motion: true }))
            return true
          }
          return false
        }
        setPermissions((prev) => ({ ...prev, motion: true }))
        return true
      }

      return false
    } catch {
      return false
    }
  }

  // Shake Detection
  useEffect(() => {
    if (!shakeEnabled) return

    const handleMotion = (event: DeviceMotionEvent) => {
      const acc = event.accelerationIncludingGravity
      if (!acc || acc.x === null || acc.y === null || acc.z === null) return

      const totalAcc = Math.sqrt(acc.x ** 2 + acc.y ** 2 + acc.z ** 2)
      const now = Date.now()

      if (totalAcc > shakeThreshold) {
        if (now - lastShakeTime.current < 500) {
          shakeCount.current++
          if (shakeCount.current >= 3) {
            // Trigger SOS after 3 shakes
            onSOSTriggered("Shake detected - Emergency SOS activated")
            shakeCount.current = 0
          }
        } else {
          shakeCount.current = 1
        }
        lastShakeTime.current = now
      }
    }

    window.addEventListener("devicemotion", handleMotion)
    return () => window.removeEventListener("devicemotion", handleMotion)
  }, [shakeEnabled, shakeThreshold, onSOSTriggered])

  // Fall Detection
  useEffect(() => {
    if (!fallDetectionEnabled) return

    const handleMotion = (event: DeviceMotionEvent) => {
      const acc = event.accelerationIncludingGravity
      if (!acc || acc.x === null || acc.y === null || acc.z === null) return

      const now = Date.now()
      const prev = lastAcceleration.current

      // Check for sudden deceleration (fall pattern)
      const currentMag = Math.sqrt(acc.x ** 2 + acc.y ** 2 + acc.z ** 2)
      const timeDiff = now - prev.time

      if (timeDiff > 0 && timeDiff < 200) {
        const prevMag = Math.sqrt(prev.x ** 2 + prev.y ** 2 + prev.z ** 2)
        const acceleration_change = Math.abs(currentMag - prevMag)

        // Detect free fall followed by impact
        if (currentMag < 3 && prevMag > 15) {
          // Free fall detected
          setTimeout(() => {
            onSOSTriggered("Fall detected - Checking if you're okay")
          }, 1000)
        }

        if (acceleration_change > 30) {
          // Sudden impact
          onSOSTriggered("Sudden impact detected - Are you okay?")
        }
      }

      lastAcceleration.current = { x: acc.x, y: acc.y, z: acc.z, time: now }
    }

    window.addEventListener("devicemotion", handleMotion)
    return () => window.removeEventListener("devicemotion", handleMotion)
  }, [fallDetectionEnabled, onSOSTriggered])

  // Voice Keyword Detection
  useEffect(() => {
    if (!voiceEnabled || typeof window === "undefined") return

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = "en-US"

    recognition.onresult = (event: any) => {
      const last = event.results[event.results.length - 1]
      const transcript = last[0].transcript.toLowerCase().trim()

      if (transcript.includes(voiceKeyword.toLowerCase())) {
        onSOSTriggered(`Voice keyword "${voiceKeyword}" detected - Emergency SOS activated`)
        recognition.stop()
        setTimeout(() => {
          if (voiceEnabled) recognition.start()
        }, 5000)
      }
    }

    recognition.onerror = () => {
      setIsListeningForKeyword(false)
    }

    recognition.onstart = () => setIsListeningForKeyword(true)
    recognition.onend = () => {
      setIsListeningForKeyword(false)
      if (voiceEnabled) {
        setTimeout(() => {
          try {
            recognition.start()
          } catch {}
        }, 100)
      }
    }

    voiceRecognitionRef.current = recognition

    try {
      recognition.start()
    } catch {}

    return () => {
      recognition.stop()
      voiceRecognitionRef.current = null
    }
  }, [voiceEnabled, voiceKeyword, onSOSTriggered])

  // Geofencing
  useEffect(() => {
    if (!geofenceAlerts || safeZones.length === 0) return

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setCurrentLocation({ lat: latitude, lng: longitude })

        // Check if inside any safe zone
        const insideSafeZone = safeZones.some((zone) => {
          if (zone.lat === 0 && zone.lng === 0) return true // Not configured
          const distance = getDistance(latitude, longitude, zone.lat, zone.lng)
          return distance <= zone.radius
        })

        // Alert if leaving safe zones (only if zones are configured)
        const configuredZones = safeZones.filter((z) => z.lat !== 0 || z.lng !== 0)
        if (configuredZones.length > 0 && !insideSafeZone) {
          // User left all safe zones
        }
      },
      () => {},
      { enableHighAccuracy: true, timeout: 10000 },
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }, [geofenceAlerts, safeZones])

  // Check-in Timer
  useEffect(() => {
    if (!checkInEnabled) {
      if (checkInTimerRef.current) clearInterval(checkInTimerRef.current)
      return
    }

    checkInTimerRef.current = setInterval(() => {
      if (!lastCheckIn) return

      const timeSinceLastCheckIn = Date.now() - lastCheckIn.getTime()
      const expectedInterval = checkInInterval * 60 * 1000

      if (timeSinceLastCheckIn > expectedInterval) {
        setMissedCheckIns((prev) => {
          const newCount = prev + 1
          if (newCount >= 2) {
            onSOSTriggered("Missed check-ins detected - Are you okay?")
          }
          return newCount
        })
      }
    }, 60000) // Check every minute

    return () => {
      if (checkInTimerRef.current) clearInterval(checkInTimerRef.current)
    }
  }, [checkInEnabled, checkInInterval, lastCheckIn, onSOSTriggered])

  const addSafeZone = (zone: Omit<SafeZone, "id">) => {
    setSafeZones((prev) => [...prev, { ...zone, id: Date.now().toString() }])
  }

  const removeSafeZone = (id: string) => {
    setSafeZones((prev) => prev.filter((z) => z.id !== id))
  }

  const checkIn = () => {
    setLastCheckIn(new Date())
    setMissedCheckIns(0)
  }

  return (
    <SafetyTriggersContext.Provider
      value={{
        shakeEnabled,
        setShakeEnabled,
        shakeThreshold,
        setShakeThreshold,
        voiceEnabled,
        setVoiceEnabled,
        voiceKeyword,
        setVoiceKeyword,
        isListeningForKeyword,
        fallDetectionEnabled,
        setFallDetectionEnabled,
        safeZones,
        addSafeZone,
        removeSafeZone,
        geofenceAlerts,
        setGeofenceAlerts,
        checkInEnabled,
        setCheckInEnabled,
        checkInInterval,
        setCheckInInterval,
        lastCheckIn,
        checkIn,
        missedCheckIns,
        onSOSTriggered,
        setOnSOSTriggered,
        permissions,
        requestPermission,
      }}
    >
      {children}
    </SafetyTriggersContext.Provider>
  )
}

export function useSafetyTriggers() {
  const context = useContext(SafetyTriggersContext)
  if (!context) {
    throw new Error("useSafetyTriggers must be used within a SafetyTriggersProvider")
  }
  return context
}

// Helper function to calculate distance between two coordinates in meters
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3 // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180

  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}
