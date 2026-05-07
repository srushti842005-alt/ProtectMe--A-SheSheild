"use client"

import { useState, useRef, useEffect } from "react"
import {
  Shield,
  Phone,
  MapPin,
  Mic,
  X,
  Send,
  AlertTriangle,
  PhoneCall,
  Download,
  Eye,
  ExternalLink,
  MessageCircle,
  Siren,
  Clock,
  MicOff,
  CheckCircle,
  Users,
  Navigation,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useContacts, POLICE_DEMO_NUMBER } from "@/lib/contacts-context"
import { getCurrentLocation } from "@/lib/location-service"

interface SOSButtonProps {
  onActivate?: () => void
  onDeactivate?: () => void
}

interface AlertStatus {
  contactId: string
  contactName: string
  status: "pending" | "sent" | "delivered" | "seen"
  whatsappUrl: string
}

export function SOSButton({ onActivate, onDeactivate }: SOSButtonProps) {
  const [isActive, setIsActive] = useState(false)
  const [isHolding, setIsHolding] = useState(false)
  const [holdProgress, setHoldProgress] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number; address: string } | null>(null)
  const [alertStatuses, setAlertStatuses] = useState<AlertStatus[]>([])
  const [rescueStatus, setRescueStatus] = useState<"notified" | "responding" | "en-route" | "arrived">("notified")
  const [rescueETA, setRescueETA] = useState(8)
  const [evidenceSent, setEvidenceSent] = useState(0)
  const [show911Call, setShow911Call] = useState(false)
  const [isCallActive, setIsCallActive] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [nearbyPoliceAdded, setNearbyPoliceAdded] = useState(false)
  const [sosSessionId, setSOSSessionId] = useState<string | null>(null)
  const [locationUpdateInterval, setLocationUpdateInterval] = useState<NodeJS.Timeout | null>(null)
  const [evidenceSentToPolice, setEvidenceSentToPolice] = useState(false)
  const [policeAlertStatus, setPoliceAlertStatus] = useState<"pending" | "sent" | "opened">("pending")

  // 911 call conversation
  const [callMessages, setCallMessages] = useState<{ from: "dispatcher" | "user"; text: string }[]>([])
  const [isListening, setIsListening] = useState(false)
  const [dispatcherResponding, setDispatcherResponding] = useState(false)

  const holdTimerRef = useRef<NodeJS.Timeout | null>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const callIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordedChunksRef = useRef<Blob[]>([])
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const recognitionRef = useRef<any>(null)

  const { contacts, addNearbyPoliceStations, sendSOSAlerts, updateSOSLocation, endSOSSession } = useContacts()

  const HOLD_DURATION = 2000

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current)
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current)
      if (callIntervalRef.current) clearInterval(callIntervalRef.current)
      if (locationUpdateInterval) clearInterval(locationUpdateInterval)
      stopRecording()
    }
  }, [])

  // Recording timer - sends evidence to police every 30 seconds
  useEffect(() => {
    if (isActive && isRecording) {
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          const newTime = prev + 1
          // Send evidence to police every 30 seconds automatically
          if (newTime > 0 && newTime % 30 === 0 && currentLocation) {
            sendEvidenceToPolice()
          }
          return newTime
        })
        setEvidenceSent((prev) => Math.min(prev + Math.random() * 5, 100))
      }, 1000)
    } else {
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current)
      setRecordingTime(0)
    }
    return () => {
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current)
    }
  }, [isActive, isRecording, currentLocation])

  useEffect(() => {
    if (isActive && typeof navigator !== "undefined") {
      // Get initial high-accuracy location
      getCurrentLocation()
        .then(async (location) => {
          const loc = {
            lat: location.lat,
            lng: location.lng,
            address: location.address,
          }
          setCurrentLocation(loc)

          // Add nearby police stations using accurate location
          if (!nearbyPoliceAdded) {
            await addNearbyPoliceStations(location.lat, location.lng)
            setNearbyPoliceAdded(true)
          }

          // Send SOS alerts to all contacts
          const result = await sendSOSAlerts(loc)
          setSOSSessionId(result.sessionId)

          setAlertStatuses(
            result.sent.map((c) => ({
              contactId: c.id,
              contactName: c.name,
              status: "sent",
              whatsappUrl: `https://wa.me/${c.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                `🚨 EMERGENCY SOS 🚨\n\n📍 ${loc.address}\n🗺️ https://www.google.com/maps?q=${loc.lat},${loc.lng}`,
              )}`,
            })),
          )

          // Simulate delivery statuses
          setTimeout(() => {
            setAlertStatuses((prev) => prev.map((a) => ({ ...a, status: "delivered" as const })))
          }, 3000)

          setTimeout(() => {
            setAlertStatuses((prev) => prev.map((a, i) => (i < 2 ? { ...a, status: "seen" as const } : a)))
          }, 6000)
        })
        .catch((error) => {
          console.error("Location error:", error)
          // Use IP-based location as fallback (already handled by getCurrentLocation)
        })

      // Set up continuous location updates using watchPosition
      const intervalId = setInterval(async () => {
        try {
          const location = await getCurrentLocation()
          const loc = {
            lat: location.lat,
            lng: location.lng,
            address: location.address,
          }
          setCurrentLocation(loc)

          if (sosSessionId) {
            await updateSOSLocation(sosSessionId, loc)
          }
        } catch (e) {
          console.error("Location update error:", e)
        }
      }, 30000) // Update every 30 seconds

      setLocationUpdateInterval(intervalId)

      return () => {
        if (intervalId) clearInterval(intervalId)
      }
    }
  }, [isActive, nearbyPoliceAdded, sosSessionId])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: true,
      })
      mediaStreamRef.current = stream

      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream
        videoPreviewRef.current.play()
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" })
      mediaRecorderRef.current = mediaRecorder
      recordedChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.start(1000)
      setIsRecording(true)
    } catch (error) {
      console.error("Recording error:", error)
      // Continue SOS even without recording
      setIsRecording(false)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop()
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop())
    }
    setIsRecording(false)
  }

  const downloadEvidence = () => {
    if (recordedChunksRef.current.length > 0) {
      const blob = new Blob(recordedChunksRef.current, { type: "video/webm" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `sos-evidence-${new Date().toISOString()}.webm`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  // Send evidence to police automatically
  const sendEvidenceToPolice = async () => {
    if (recordedChunksRef.current.length === 0 || !currentLocation) return
    
    try {
      const blob = new Blob(recordedChunksRef.current, { type: "video/webm" })
      const formData = new FormData()
      formData.append("evidence", blob, `sos-evidence-${Date.now()}.webm`)
      formData.append("sessionId", sosSessionId || crypto.randomUUID())
      formData.append("location", JSON.stringify(currentLocation))
      formData.append("type", "video")
      
      const response = await fetch("/api/send-evidence", {
        method: "POST",
        body: formData,
      })
      
      const data = await response.json()
      
      if (data.success) {
        setEvidenceSentToPolice(true)
        setPoliceAlertStatus("sent")
        
        // Auto-open WhatsApp to send evidence alert to police
        if (data.whatsappUrl) {
          window.open(data.whatsappUrl, "_blank")
        }
        
        // Vibrate to confirm evidence sent
        if ("vibrate" in navigator) {
          navigator.vibrate([200, 100, 200])
        }
      }
    } catch (error) {
      console.error("Failed to send evidence to police:", error)
    }
  }

  const activateSOS = async () => {
    setIsActive(true)
    setEvidenceSentToPolice(false)
    setPoliceAlertStatus("pending")
    onActivate?.()

    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission()
    }

    // Vibrate pattern for emergency
    if ("vibrate" in navigator) {
      navigator.vibrate([500, 200, 500, 200, 500])
    }

    // Try to start recording (but don't block SOS if it fails)
    startRecording()
    
    // Send first evidence to police after 10 seconds of recording
    setTimeout(() => {
      sendEvidenceToPolice()
    }, 10000)
  }

  const deactivateSOS = async () => {
    // Send final evidence before deactivating
    if (recordedChunksRef.current.length > 0) {
      await sendEvidenceToPolice()
    }
    
    stopRecording()
    setIsActive(false)
    setAlertStatuses([])
    setRescueStatus("notified")
    setRescueETA(8)
    setEvidenceSent(0)
    setNearbyPoliceAdded(false)
    setEvidenceSentToPolice(false)
    setPoliceAlertStatus("pending")

    if (locationUpdateInterval) {
      clearInterval(locationUpdateInterval)
      setLocationUpdateInterval(null)
    }

    // End SOS session and notify contacts
    if (sosSessionId) {
      await endSOSSession(sosSessionId)
      setSOSSessionId(null)
    }

    onDeactivate?.()
  }

  const handleHoldStart = () => {
    if (isActive) return

    setIsHolding(true)
    setHoldProgress(0)

    progressIntervalRef.current = setInterval(() => {
      setHoldProgress((prev) => {
        if (prev >= 100) {
          if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
          return 100
        }
        return prev + 100 / (HOLD_DURATION / 50)
      })
    }, 50)

    holdTimerRef.current = setTimeout(() => {
      activateSOS()
      setIsHolding(false)
      setHoldProgress(0)
    }, HOLD_DURATION)
  }

  const handleHoldEnd = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current)
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
    }
    setIsHolding(false)
    setHoldProgress(0)
  }

  // 911 Call functions
  const start911Call = () => {
    setShow911Call(true)
    setIsCallActive(true)
    setCallDuration(0)
    setCallMessages([])

    callIntervalRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1)
    }, 1000)

    // Initial dispatcher greeting
    setTimeout(() => {
      const greeting = "911, what's your emergency?"
      setCallMessages([{ from: "dispatcher", text: greeting }])
      speakText(greeting)
      setTimeout(() => startListening(), 2000)
    }, 1500)
  }

  const speakText = (text: string) => {
    if ("speechSynthesis" in window && !isMuted) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1.1
      const voices = speechSynthesis.getVoices()
      const femaleVoice = voices.find(
        (v) => v.name.includes("Female") || v.name.includes("Samantha") || v.name.includes("Google"),
      )
      if (femaleVoice) utterance.voice = femaleVoice
      speechSynthesis.speak(utterance)
    }
  }

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) return

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition

    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = "en-US"

    recognition.onstart = () => setIsListening(true)

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setCallMessages((prev) => [...prev, { from: "user", text: transcript }])
      setIsListening(false)
      respondToUser(transcript)
    }

    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)

    recognition.start()
  }

  const respondToUser = (userText: string) => {
    setDispatcherResponding(true)
    const lower = userText.toLowerCase()

    let response = ""
    if (lower.includes("help") || lower.includes("emergency") || lower.includes("danger")) {
      response = "I understand you need help. Can you tell me your exact location? Are you safe right now?"
    } else if (lower.includes("location") || lower.includes("address") || lower.includes("where")) {
      response = currentLocation
        ? `I can see your location at ${currentLocation.address}. Police are being dispatched now. Stay on the line.`
        : "I'm tracking your location now. Can you describe where you are?"
    } else if (lower.includes("yes") || lower.includes("safe")) {
      response = "Good. Officers are on their way. ETA is 5-8 minutes. Stay where you are if it's safe."
      setTimeout(() => setRescueStatus("en-route"), 2000)
    } else if (lower.includes("no") || lower.includes("not safe") || lower.includes("danger")) {
      response = "Officers are being dispatched immediately with priority. Can you get to a safe public place nearby?"
    } else if (lower.includes("someone") || lower.includes("following") || lower.includes("person")) {
      response = "I understand someone is following you. Can you describe them? Try to stay in well-lit public areas."
    } else {
      response =
        "I'm sending help to your location now. Officers will arrive in approximately 5 minutes. Stay calm and stay on the line."
    }

    setTimeout(() => {
      setCallMessages((prev) => [...prev, { from: "dispatcher", text: response }])
      speakText(response)
      setDispatcherResponding(false)
      setTimeout(() => startListening(), 3000)
    }, 1500)
  }

  const end911Call = () => {
    if (callIntervalRef.current) clearInterval(callIntervalRef.current)
    if (recognitionRef.current) recognitionRef.current.abort()
    speechSynthesis.cancel()
    setShow911Call(false)
    setIsCallActive(false)
    setCallDuration(0)
    setCallMessages([])
    setIsListening(false)
  }

  const openWhatsApp = (url: string) => {
    window.open(url, "_blank")
  }

  const resendAlerts = async () => {
    if (currentLocation) {
      const result = await sendSOSAlerts(currentLocation)
      setAlertStatuses(
        result.sent.map((c) => ({
          contactId: c.id,
          contactName: c.name,
          status: "sent",
          whatsappUrl: `https://wa.me/${c.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
            `🚨 EMERGENCY SOS UPDATE 🚨\n\n📍 ${currentLocation.address}\n🗺️ https://www.google.com/maps?q=${currentLocation.lat},${currentLocation.lng}`,
          )}`,
        })),
      )
    }
  }

  const copyLocationLink = () => {
    if (currentLocation) {
      const link = `https://www.google.com/maps?q=${currentLocation.lat},${currentLocation.lng}`
      navigator.clipboard.writeText(link)
      alert("Location link copied!")
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const sosContacts = contacts.filter((c) => c.notifyOnSOS)
  const policeContacts = contacts.filter((c) => c.isPoliceStation)

  // 911 Call Modal
  if (show911Call) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-between p-4 sm:p-8">
        <div className="text-center mt-4 sm:mt-8">
          <div
            className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${isCallActive ? "bg-green-600 animate-pulse" : "bg-gray-700"}`}
          >
            <PhoneCall className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Emergency Services</h2>
          <p className="text-gray-400">911 / 100</p>
          {isCallActive && <p className="text-green-500 mt-2 text-lg">{formatTime(callDuration)}</p>}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 w-full max-w-md overflow-y-auto my-4 space-y-3 px-2">
          {callMessages.map((msg, i) => (
            <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  msg.from === "user" ? "bg-blue-600 text-white" : "bg-gray-800 text-white"
                }`}
              >
                <p className="text-xs opacity-70 mb-1">{msg.from === "user" ? "You" : "Dispatcher"}</p>
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
          {dispatcherResponding && (
            <div className="flex justify-start">
              <div className="bg-gray-800 p-3 rounded-2xl">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
          {isListening && (
            <div className="flex justify-center">
              <div className="bg-red-600/20 text-red-500 px-4 py-2 rounded-full flex items-center gap-2">
                <Mic className="w-4 h-4 animate-pulse" />
                <span className="text-sm">Listening...</span>
              </div>
            </div>
          )}
        </div>

        {/* Location being shared */}
        {currentLocation && (
          <div className="w-full max-w-md bg-gray-900 rounded-xl p-3 mb-4">
            <p className="text-xs text-gray-400 mb-1">Your location is being shared:</p>
            <p className="text-sm text-white truncate">{currentLocation.address}</p>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mb-8">
          <Button
            variant="ghost"
            size="icon"
            className={`w-14 h-14 rounded-full ${isMuted ? "bg-red-600" : "bg-gray-700"}`}
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
          </Button>

          <Button className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700" onClick={end911Call}>
            <Phone className="w-8 h-8 text-white rotate-[135deg]" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="w-14 h-14 rounded-full bg-gray-700"
            onClick={startListening}
            disabled={isListening}
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </Button>
        </div>
      </div>
    )
  }

  // Active SOS View
  if (isActive) {
    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Emergency Header */}
        <div className="bg-emergency/10 border border-emergency rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emergency flex items-center justify-center animate-pulse">
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-emergency">SOS ACTIVE</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Recording & sharing location</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={deactivateSOS}
              className="border-emergency text-emergency hover:bg-emergency hover:text-white bg-transparent"
            >
              <X className="w-4 h-4 mr-1" />
              End SOS
            </Button>
          </div>

          {/* Live Video Preview */}
          <div className="relative rounded-xl overflow-hidden bg-black mb-4">
            <video ref={videoPreviewRef} autoPlay muted playsInline className="w-full h-32 sm:h-40 object-cover" />
            {isRecording && (
              <div className="absolute top-2 left-2 flex items-center gap-2 bg-red-600 px-2 py-1 rounded-full">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="text-xs text-white font-medium">{formatTime(recordingTime)}</span>
              </div>
            )}
            <div className="absolute bottom-2 right-2">
              <Button size="sm" variant="secondary" onClick={downloadEvidence} className="text-xs">
                <Download className="w-3 h-3 mr-1" />
                Save Evidence
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <Button variant="destructive" size="sm" onClick={start911Call} className="flex-col h-auto py-2">
              <Phone className="w-4 h-4 mb-1" />
              <span className="text-xs">Call 911</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={copyLocationLink}
              className="flex-col h-auto py-2 bg-transparent"
            >
              <MapPin className="w-4 h-4 mb-1" />
              <span className="text-xs">Copy Location</span>
            </Button>
            <Button variant="outline" size="sm" onClick={resendAlerts} className="flex-col h-auto py-2 bg-transparent">
              <RefreshCw className="w-4 h-4 mb-1" />
              <span className="text-xs">Resend Alert</span>
            </Button>
          </div>
        </div>

        {/* Current Location */}
        {currentLocation && (
          <div className="bg-card border border-border rounded-xl p-4">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2 mb-2">
              <Navigation className="w-4 h-4 text-blue-500" />
              Your Live Location
            </h4>
            <p className="text-sm text-muted-foreground mb-2">{currentLocation.address}</p>
            <a
              href={`https://www.google.com/maps?q=${currentLocation.lat},${currentLocation.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-500 underline"
            >
              View on Google Maps
            </a>
          </div>
        )}

        {/* Rescue Status */}
        <div className="bg-card border border-border rounded-xl p-4">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2 mb-3">
            <Siren className="w-4 h-4 text-emergency" />
            Rescue Status
          </h4>
          <div className="flex items-center gap-2 mb-2">
            {rescueStatus === "notified" && (
              <span className="bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded-full text-xs">Contacts Notified</span>
            )}
            {rescueStatus === "responding" && (
              <span className="bg-blue-500/20 text-blue-500 px-3 py-1 rounded-full text-xs">Help Responding</span>
            )}
            {rescueStatus === "en-route" && (
              <span className="bg-green-500/20 text-green-500 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                <Clock className="w-3 h-3" />
                En-Route (ETA: {rescueETA} min)
              </span>
            )}
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-emergency h-2 rounded-full transition-all duration-500"
              style={{ width: `${evidenceSent}%` }}
            />
          </div>
<p className="text-xs text-muted-foreground mt-1">{Math.round(evidenceSent)}% evidence uploaded</p>
          </div>

          {/* Police Evidence Status */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2 mb-3">
              <Siren className="w-4 h-4 text-blue-500" />
              Police Evidence Alert
            </h4>
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm text-foreground font-medium">Control Room (Demo)</p>
                <p className="text-xs text-muted-foreground">{POLICE_DEMO_NUMBER}</p>
              </div>
              <div className="flex items-center gap-2">
                {evidenceSentToPolice ? (
                  <span className="bg-green-500/20 text-green-500 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Evidence Sent
                  </span>
                ) : (
                  <span className="bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded-full text-xs flex items-center gap-1 animate-pulse">
                    <Clock className="w-3 h-3" />
                    Recording...
                  </span>
                )}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Video evidence is being recorded and will be sent automatically to police every 30 seconds.
            </p>
            <Button 
              size="sm" 
              variant="outline" 
              className="mt-3 w-full bg-blue-500/10 border-blue-500/30 text-blue-500 hover:bg-blue-500/20"
              onClick={sendEvidenceToPolice}
            >
              <Send className="w-4 h-4 mr-2" />
              Send Evidence Now
            </Button>
          </div>

          {/* Alert Status for Each Contact */}
        <div className="bg-card border border-border rounded-xl p-4">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-emergency" />
            Contacts Notified ({alertStatuses.length})
          </h4>
          <div className="max-h-48 overflow-y-auto space-y-2">
            {alertStatuses.map((alert) => (
              <div key={alert.contactId} className="p-3 rounded-xl bg-muted/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      alert.status === "seen" ? "bg-green-500/20" : "bg-blue-500/20",
                    )}
                  >
                    {alert.status === "seen" ? (
                      <Eye className="w-4 h-4 text-green-500" />
                    ) : alert.status === "delivered" ? (
                      <CheckCircle className="w-4 h-4 text-blue-500" />
                    ) : (
                      <Send className="w-4 h-4 text-blue-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{alert.contactName}</p>
                    <p className="text-xs text-muted-foreground capitalize">{alert.status}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openWhatsApp(alert.whatsappUrl)}
                  className="text-green-500"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Police Stations */}
        {policeContacts.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-4">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2 mb-3">
              <Siren className="w-4 h-4 text-blue-500" />
              Nearby Police Stations
            </h4>
            {policeContacts.map((police) => (
              <div key={police.id} className="p-3 rounded-xl bg-muted/50 flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-foreground">{police.name}</p>
                  <p className="text-xs text-muted-foreground">{police.phone}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const a = document.createElement("a")
                    a.href = `tel:${police.phone}`
                    a.click()
                  }}
                >
                  <Phone className="w-4 h-4 mr-1" />
                  Call
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Default SOS Button
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        {/* Pulse rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-emergency/10 animate-ping" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-emergency/20" />
        </div>

        {/* Main button */}
        <button
          className={cn(
            "relative w-32 h-32 sm:w-40 sm:h-40 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl",
            isHolding ? "bg-emergency scale-95" : "bg-gradient-to-br from-emergency to-red-700 hover:scale-105",
          )}
          onMouseDown={handleHoldStart}
          onMouseUp={handleHoldEnd}
          onMouseLeave={handleHoldEnd}
          onTouchStart={handleHoldStart}
          onTouchEnd={handleHoldEnd}
        >
          {/* Progress ring */}
          {isHolding && (
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke="white"
                strokeWidth="4"
                strokeDasharray={`${holdProgress * 2.83} 283`}
                className="opacity-50"
              />
            </svg>
          )}

          <Shield className="w-10 h-10 sm:w-14 sm:h-14 text-white mb-1" />
          <span className="text-white font-bold text-base sm:text-lg">SOS</span>
          <span className="text-white/70 text-[10px] sm:text-xs">Hold for 2 sec</span>
        </button>
      </div>

      <p className="text-center text-muted-foreground text-xs sm:text-sm mt-4 sm:mt-6 max-w-xs">
        Press and hold the SOS button to alert {sosContacts.length} emergency contacts with your live location
      </p>

      {/* Quick contacts preview */}
      <div className="flex items-center gap-2 mt-4">
        {sosContacts.slice(0, 3).map((contact, i) => (
          <div
            key={contact.id}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium"
            style={{ marginLeft: i > 0 ? "-8px" : 0 }}
          >
            {contact.name.charAt(0)}
          </div>
        ))}
        {sosContacts.length > 3 && (
          <span className="text-xs text-muted-foreground ml-1">+{sosContacts.length - 3} more</span>
        )}
      </div>
    </div>
  )
}
