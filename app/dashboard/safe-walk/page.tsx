"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Camera,
  CameraOff,
  AlertTriangle,
  Volume2,
  VolumeX,
  RotateCcw,
  MapPin,
  Users,
  Car,
  AlertCircle,
  ArrowUp,
  ArrowLeft,
  ArrowRight,
  Footprints,
  Map,
  RefreshCw,
  Navigation2,
  CircleAlert,
  Siren,
  Search,
  MapPinOff,
  Locate,
} from "lucide-react"

interface Incident {
  id: string
  type: "gang" | "suspicious_vehicle" | "theft" | "assault" | "accident" | "harassment"
  lat: number
  lng: number
  distance: number
  bearing: string
  severity: "low" | "medium" | "high"
  description: string
  reportedAt: Date
}

interface SafeRoute {
  direction: "left" | "right" | "straight" | "back"
  safety: number
  description: string
}

export default function SafeWalkPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const [viewMode, setViewMode] = useState<"camera" | "map">("map")
  const [isStreaming, setIsStreaming] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [safeRoutes, setSafeRoutes] = useState<SafeRoute[]>([])
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment")
  const streamRef = useRef<MediaStream | null>(null)
  const lastSpokenRef = useRef<string>("")
  const watchIdRef = useRef<number | null>(null)

  const [locationError, setLocationError] = useState<string | null>(null)
  const [locationSource, setLocationSource] = useState<"gps" | "manual" | "ip">("gps")
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [showPermissionHelp, setShowPermissionHelp] = useState(false)

  // Speak warnings
  const speak = useCallback(
    (text: string) => {
      if (voiceEnabled && text !== lastSpokenRef.current) {
        lastSpokenRef.current = text
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.rate = 1.1
        speechSynthesis.cancel()
        speechSynthesis.speak(utterance)
        setTimeout(() => {
          lastSpokenRef.current = ""
        }, 8000)
      }
    },
    [voiceEnabled],
  )

  // Calculate bearing between two points
  const calculateBearing = (lat1: number, lng1: number, lat2: number, lng2: number): string => {
    const dLon = ((lng2 - lng1) * Math.PI) / 180
    const y = Math.sin(dLon) * Math.cos((lat2 * Math.PI) / 180)
    const x =
      Math.cos((lat1 * Math.PI) / 180) * Math.sin((lat2 * Math.PI) / 180) -
      Math.sin((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.cos(dLon)
    const brng = (Math.atan2(y, x) * 180) / Math.PI
    const bearings = ["North", "North-East", "East", "South-East", "South", "South-West", "West", "North-West"]
    const index = Math.round(((brng + 360) % 360) / 45) % 8
    return bearings[index]
  }

  // Calculate distance in meters
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371000
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lng2 - lng1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  // Generate realistic incidents around user location
  const generateNearbyIncidents = useCallback((lat: number, lng: number): Incident[] => {
    const incidentTypes: Array<{
      type: Incident["type"]
      severity: Incident["severity"]
      descriptions: string[]
    }> = [
      {
        type: "gang",
        severity: "high",
        descriptions: [
          "Group of 4-5 individuals loitering",
          "Suspicious group blocking pathway",
          "Multiple people gathering near corner",
        ],
      },
      {
        type: "suspicious_vehicle",
        severity: "medium",
        descriptions: [
          "Parked vehicle with engine running",
          "Slow-moving unmarked van",
          "Vehicle following pedestrians",
        ],
      },
      {
        type: "theft",
        severity: "high",
        descriptions: ["Phone snatching reported", "Bag theft incident", "Pickpocket activity"],
      },
      {
        type: "harassment",
        severity: "medium",
        descriptions: ["Verbal harassment reported", "Catcalling incidents", "Following behavior observed"],
      },
      {
        type: "accident",
        severity: "low",
        descriptions: ["Minor road accident", "Traffic congestion", "Road work ahead"],
      },
    ]

    const numIncidents = 3 + Math.floor(Math.random() * 4)
    const newIncidents: Incident[] = []

    for (let i = 0; i < numIncidents; i++) {
      const distance = 50 + Math.random() * 450
      const angle = Math.random() * 2 * Math.PI
      const latOffset = (distance / 111000) * Math.cos(angle)
      const lngOffset = (distance / (111000 * Math.cos((lat * Math.PI) / 180))) * Math.sin(angle)

      const incidentLat = lat + latOffset
      const incidentLng = lng + lngOffset

      const typeInfo = incidentTypes[Math.floor(Math.random() * incidentTypes.length)]
      const description = typeInfo.descriptions[Math.floor(Math.random() * typeInfo.descriptions.length)]

      newIncidents.push({
        id: `incident-${i}-${Date.now()}`,
        type: typeInfo.type,
        lat: incidentLat,
        lng: incidentLng,
        distance: Math.round(distance),
        bearing: calculateBearing(lat, lng, incidentLat, incidentLng),
        severity: typeInfo.severity,
        description,
        reportedAt: new Date(Date.now() - Math.random() * 30 * 60 * 1000),
      })
    }

    return newIncidents.sort((a, b) => a.distance - b.distance)
  }, [])

  // Calculate safe routes based on incidents
  const calculateSafeRoutes = useCallback((incidents: Incident[]): SafeRoute[] => {
    const directions: Array<{ dir: SafeRoute["direction"]; angle: number }> = [
      { dir: "straight", angle: 0 },
      { dir: "left", angle: -90 },
      { dir: "right", angle: 90 },
      { dir: "back", angle: 180 },
    ]

    const routes: SafeRoute[] = directions.map(({ dir, angle }) => {
      let safety = 100

      incidents.forEach((incident) => {
        const bearingAngles: Record<string, number> = {
          North: 0,
          "North-East": 45,
          East: 90,
          "South-East": 135,
          South: 180,
          "South-West": 225,
          West: 270,
          "North-West": 315,
        }

        const incidentAngle = bearingAngles[incident.bearing] || 0
        const directionAngle = (angle + 360) % 360

        const angleDiff = Math.abs(incidentAngle - directionAngle)
        if (angleDiff < 60 || angleDiff > 300) {
          const severityPenalty = incident.severity === "high" ? 30 : incident.severity === "medium" ? 15 : 5
          const distanceFactor = Math.max(0.2, 1 - incident.distance / 500)
          safety -= severityPenalty * distanceFactor
        }
      })

      safety = Math.max(0, Math.round(safety))

      let description = ""
      if (safety >= 80) description = "Safe route - No threats detected"
      else if (safety >= 50) description = "Proceed with caution"
      else description = "Not recommended - Multiple threats"

      return { direction: dir, safety, description }
    })

    return routes.sort((a, b) => b.safety - a.safety)
  }, [])

  const updateLocationAndIncidents = useCallback(
    (lat: number, lng: number) => {
      setCurrentLocation({ lat, lng })
      const newIncidents = generateNearbyIncidents(lat, lng)
      setIncidents(newIncidents)
      const routes = calculateSafeRoutes(newIncidents)
      setSafeRoutes(routes)

      const nearbyThreats = newIncidents.filter((i) => i.distance < 200 && i.severity === "high")
      if (nearbyThreats.length > 0) {
        const threat = nearbyThreats[0]
        speak(
          `Warning! ${threat.description} ${threat.distance} meters ${threat.bearing}. ${routes[0].direction} is the safest route.`,
        )
      }
      setIsLoading(false)
    },
    [generateNearbyIncidents, calculateSafeRoutes, speak],
  )

  const getIPBasedLocation = useCallback(async () => {
    try {
      const response = await fetch("https://ipapi.co/json/")
      const data = await response.json()
      if (data.latitude && data.longitude) {
        setLocationSource("ip")
        setLocationError(null)
        updateLocationAndIncidents(data.latitude, data.longitude)
        return true
      }
    } catch (error) {
      console.error("IP location failed:", error)
    }
    return false
  }, [updateLocationAndIncidents])

  const searchLocation = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`,
      )
      const data = await response.json()

      if (data && data.length > 0) {
        const { lat, lon } = data[0]
        setLocationSource("manual")
        setLocationError(null)
        updateLocationAndIncidents(Number.parseFloat(lat), Number.parseFloat(lon))
      } else {
        setLocationError("Location not found. Try a different search term.")
      }
    } catch (error) {
      setLocationError("Search failed. Please try again.")
    }
    setIsSearching(false)
  }

  const retryGPSLocation = () => {
    setIsLoading(true)
    setLocationError(null)
    setShowPermissionHelp(false)

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser")
      setIsLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setLocationSource("gps")
        updateLocationAndIncidents(latitude, longitude)

        // Start watching position
        if (watchIdRef.current !== null) {
          navigator.geolocation.clearWatch(watchIdRef.current)
        }
        watchIdRef.current = navigator.geolocation.watchPosition(
          (pos) => {
            updateLocationAndIncidents(pos.coords.latitude, pos.coords.longitude)
          },
          () => {}, // Ignore watch errors after initial success
          { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 },
        )
      },
      async (error) => {
        console.error("GPS error:", error)

        if (error.code === 1) {
          // PERMISSION_DENIED
          setLocationError("Location permission denied")
          setShowPermissionHelp(true)
          // Try IP-based fallback
          const ipSuccess = await getIPBasedLocation()
          if (!ipSuccess) {
            setIsLoading(false)
          }
        } else if (error.code === 2) {
          // POSITION_UNAVAILABLE
          setLocationError("Location unavailable - trying IP-based location")
          const ipSuccess = await getIPBasedLocation()
          if (!ipSuccess) {
            setIsLoading(false)
          }
        } else if (error.code === 3) {
          // TIMEOUT
          setLocationError("Location request timed out - trying IP-based location")
          const ipSuccess = await getIPBasedLocation()
          if (!ipSuccess) {
            setIsLoading(false)
          }
        }
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 },
    )
  }

  useEffect(() => {
    retryGPSLocation()

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
      }
    }
  }, [])

  // Refresh incidents
  const refreshIncidents = () => {
    if (currentLocation) {
      const newIncidents = generateNearbyIncidents(currentLocation.lat, currentLocation.lng)
      setIncidents(newIncidents)
      setSafeRoutes(calculateSafeRoutes(newIncidents))
    }
  }

  // Start camera for AR view
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setIsStreaming(true)
      }
    } catch (error) {
      console.error("Camera error:", error)
    }
  }

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
      setIsStreaming(false)
    }
  }

  // Switch camera
  const switchCamera = async () => {
    stopCamera()
    setFacingMode(facingMode === "environment" ? "user" : "environment")
    setTimeout(startCamera, 100)
  }

  // Get incident icon
  const getIncidentIcon = (type: Incident["type"]) => {
    switch (type) {
      case "gang":
        return <Users className="h-4 w-4" />
      case "suspicious_vehicle":
        return <Car className="h-4 w-4" />
      case "theft":
        return <AlertCircle className="h-4 w-4" />
      case "assault":
        return <Siren className="h-4 w-4" />
      case "harassment":
        return <CircleAlert className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  // Get severity color
  const getSeverityColor = (severity: Incident["severity"]) => {
    switch (severity) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      default:
        return "bg-blue-500"
    }
  }

  // Get direction icon
  const getDirectionIcon = (direction: SafeRoute["direction"]) => {
    switch (direction) {
      case "left":
        return <ArrowLeft className="h-6 w-6" />
      case "right":
        return <ArrowRight className="h-6 w-6" />
      case "straight":
        return <ArrowUp className="h-6 w-6" />
      case "back":
        return <RotateCcw className="h-6 w-6" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Footprints className="h-6 w-6 text-primary" />
              Safe Navigator
            </h1>
            <p className="text-muted-foreground text-sm">Real-time incident alerts & safe route guidance</p>
          </div>

          <div className="flex items-center gap-2">
            {currentLocation && (
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  locationSource === "gps"
                    ? "bg-green-500/20 text-green-400"
                    : locationSource === "manual"
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-yellow-500/20 text-yellow-400"
                }`}
              >
                {locationSource === "gps" ? "GPS" : locationSource === "manual" ? "Manual" : "IP Location"}
              </span>
            )}
            <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === "map" ? "camera" : "map")}>
              {viewMode === "map" ? <Camera className="h-4 w-4 mr-1" /> : <Map className="h-4 w-4 mr-1" />}
              {viewMode === "map" ? "AR View" : "Map View"}
            </Button>
            <Button variant="outline" size="icon" onClick={() => setVoiceEnabled(!voiceEnabled)}>
              {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {(locationError || !currentLocation) && !isLoading && (
          <Card className="p-4 mb-4 border-yellow-500/50 bg-yellow-500/10">
            <div className="flex items-start gap-3">
              <MapPinOff className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-foreground">{locationError || "Unable to get your location"}</h3>

                {showPermissionHelp && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    <p className="mb-2">To enable GPS location:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Click the lock/info icon in your browser's address bar</li>
                      <li>Find "Location" and set it to "Allow"</li>
                      <li>Refresh the page or click "Retry GPS" below</li>
                    </ol>
                  </div>
                )}

                <div className="mt-3 flex flex-col sm:flex-row gap-2">
                  <Button size="sm" onClick={retryGPSLocation} className="gap-2">
                    <Locate className="h-4 w-4" />
                    Retry GPS
                  </Button>

                  <div className="flex gap-2 flex-1">
                    <Input
                      placeholder="Search location (e.g., Mumbai, India)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && searchLocation()}
                      className="flex-1"
                    />
                    <Button size="sm" onClick={searchLocation} disabled={isSearching}>
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-muted-foreground">Getting your location...</p>
            <p className="text-xs text-muted-foreground mt-1">Please allow location access when prompted</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Main View */}
            <div className="lg:col-span-2">
              <Card className="overflow-hidden">
                {viewMode === "map" ? (
                  <div className="relative h-[500px]">
                    {/* OpenStreetMap with markers */}
                    {currentLocation && (
                      <iframe
                        className="w-full h-full border-0"
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${currentLocation.lng - 0.01}%2C${currentLocation.lat - 0.01}%2C${currentLocation.lng + 0.01}%2C${currentLocation.lat + 0.01}&layer=mapnik&marker=${currentLocation.lat}%2C${currentLocation.lng}`}
                        title="Safe Walk Map"
                      />
                    )}

                    {/* Incident Overlays */}
                    <div className="absolute inset-0 pointer-events-none">
                      {/* Current location indicator */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse" />
                        <div className="absolute -inset-4 bg-blue-500/20 rounded-full animate-ping" />
                      </div>

                      {/* Incident markers on overlay */}
                      {incidents.map((incident, index) => {
                        const angle = (index * (360 / incidents.length) * Math.PI) / 180
                        const radius = Math.min(150, incident.distance / 2)
                        const x = 50 + radius * Math.cos(angle) * 0.15
                        const y = 50 + radius * Math.sin(angle) * 0.15

                        return (
                          <div
                            key={incident.id}
                            className="absolute pointer-events-auto cursor-pointer group"
                            style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
                          >
                            <div
                              className={`w-8 h-8 rounded-full ${getSeverityColor(incident.severity)} flex items-center justify-center text-white shadow-lg`}
                            >
                              {getIncidentIcon(incident.type)}
                            </div>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/95 border border-border rounded-lg p-2 w-48 z-10">
                              <p className="text-xs font-medium">{incident.description}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {incident.distance}m {incident.bearing}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Location info overlay */}
                    <div className="absolute bottom-4 left-4 right-4 bg-background/95 backdrop-blur rounded-lg p-3 border border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">
                            {currentLocation
                              ? `${currentLocation.lat.toFixed(6)}, ${currentLocation.lng.toFixed(6)}`
                              : "Location unavailable"}
                          </span>
                        </div>
                        <Button size="sm" variant="outline" onClick={refreshIncidents}>
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Refresh
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative h-[500px] bg-black">
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />

                    {!isStreaming && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900">
                        <Camera className="h-16 w-16 text-zinc-600 mb-4" />
                        <p className="text-zinc-400 mb-4">Camera not active</p>
                        <Button onClick={startCamera}>
                          <Camera className="h-4 w-4 mr-2" />
                          Start Camera
                        </Button>
                      </div>
                    )}

                    {isStreaming && (
                      <>
                        {/* AR Overlay - Incident warnings */}
                        <div className="absolute inset-0 pointer-events-none">
                          {incidents
                            .filter((i) => i.distance < 300)
                            .map((incident, index) => (
                              <div
                                key={incident.id}
                                className="absolute"
                                style={{
                                  left: `${20 + (index % 3) * 30}%`,
                                  top: `${20 + Math.floor(index / 3) * 25}%`,
                                }}
                              >
                                <div
                                  className={`${getSeverityColor(incident.severity)} text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2`}
                                >
                                  {getIncidentIcon(incident.type)}
                                  <div>
                                    <p className="text-xs font-bold">{incident.distance}m</p>
                                    <p className="text-xs">{incident.bearing}</p>
                                  </div>
                                </div>
                              </div>
                            ))}

                          {/* Direction indicator */}
                          {safeRoutes.length > 0 && (
                            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
                              <div className="bg-green-500 text-white px-4 py-3 rounded-xl flex items-center gap-3 shadow-xl">
                                {getDirectionIcon(safeRoutes[0].direction)}
                                <div>
                                  <p className="font-bold capitalize">Go {safeRoutes[0].direction}</p>
                                  <p className="text-xs">{safeRoutes[0].safety}% safe</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Camera controls */}
                        <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2">
                          <Button variant="secondary" size="icon" onClick={switchCamera}>
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="icon" onClick={stopCamera}>
                            <CameraOff className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </Card>
            </div>

            {/* Side Panel */}
            <div className="space-y-4">
              {/* Safe Routes */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Navigation2 className="h-4 w-4 text-primary" />
                  Recommended Routes
                </h3>
                <div className="space-y-2">
                  {safeRoutes.map((route, index) => (
                    <div
                      key={route.direction}
                      className={`p-3 rounded-lg border ${index === 0 ? "border-green-500 bg-green-500/10" : "border-border"}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getDirectionIcon(route.direction)}
                          <span className="font-medium capitalize">{route.direction}</span>
                        </div>
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-bold ${
                            route.safety >= 80
                              ? "bg-green-500/20 text-green-400"
                              : route.safety >= 50
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {route.safety}%
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{route.description}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Nearby Incidents */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  Nearby Incidents ({incidents.length})
                </h3>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {incidents.map((incident) => (
                    <div key={incident.id} className="p-3 rounded-lg bg-muted/50 border border-border">
                      <div className="flex items-start gap-2">
                        <div className={`p-1.5 rounded-full ${getSeverityColor(incident.severity)} text-white`}>
                          {getIncidentIcon(incident.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{incident.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">
                              {incident.distance}m {incident.bearing}
                            </span>
                            <span
                              className={`text-xs px-1.5 py-0.5 rounded ${
                                incident.severity === "high"
                                  ? "bg-red-500/20 text-red-400"
                                  : incident.severity === "medium"
                                    ? "bg-yellow-500/20 text-yellow-400"
                                    : "bg-blue-500/20 text-blue-400"
                              }`}
                            >
                              {incident.severity}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="destructive" className="w-full" asChild>
                    <a href="tel:100">
                      <Siren className="h-4 w-4 mr-2" />
                      Call 100
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" onClick={refreshIncidents}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
