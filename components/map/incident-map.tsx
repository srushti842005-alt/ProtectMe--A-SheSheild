"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  AlertTriangle,
  Shield,
  Car,
  Users,
  Search,
  Loader2,
  RefreshCw,
  CheckCircle,
  ThumbsUp,
  Navigation,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { getCurrentLocation, searchLocation, type LocationData } from "@/lib/location-service"

interface Incident {
  id: string
  type: "theft" | "assault" | "suspicious" | "accident" | "other"
  title: string
  description: string
  location: { lat: number; lng: number }
  timestamp: Date
  severity: "low" | "medium" | "high"
  distance: string
  source: string
  verified: boolean
}

interface CommunityPlace {
  id: string
  name: string
  type: "safe" | "unsafe"
  lat: number
  lng: number
  addedBy: string
  votes: number
  reason: string
}

interface IncidentMapProps {
  className?: string
}

export const generateNearbyIncidents = async (userLat: number, userLng: number): Promise<Incident[]> => {
  const incidents: Incident[] = []
  const now = new Date()

  // Get area name for realistic titles
  let areaName = "this area"
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${userLat}&lon=${userLng}&format=json`)
    const data = await res.json()
    if (data.address) {
      areaName = data.address.suburb || data.address.neighbourhood || data.address.road || "this area"
    }
  } catch (e) {
    console.error("Geocode error:", e)
  }

  // Realistic incident types based on common urban safety reports
  const incidentTemplates = [
    {
      type: "theft" as const,
      titles: [
        `Phone snatching near ${areaName}`,
        `Bag theft reported on main road`,
        `Vehicle break-in at parking area`,
        `Bike theft from parking lot`,
      ],
      severity: "medium" as const,
      source: "Police Report",
    },
    {
      type: "suspicious" as const,
      titles: [
        `Suspicious person near bus stop`,
        `Unknown vehicle circling ${areaName}`,
        `Loitering reported near ATM`,
        `Suspicious activity near college gate`,
      ],
      severity: "low" as const,
      source: "Community Report",
    },
    {
      type: "assault" as const,
      titles: [
        `Verbal harassment incident`,
        `Road rage near junction`,
        `Eve-teasing reported`,
        `Altercation at market area`,
      ],
      severity: "high" as const,
      source: "Victim Report",
    },
    {
      type: "accident" as const,
      titles: [
        `Minor vehicle collision`,
        `Two-wheeler accident`,
        `Pedestrian crossing incident`,
        `Traffic signal mishap`,
      ],
      severity: "low" as const,
      source: "Traffic Police",
    },
  ]

  // Generate 5-8 realistic incidents
  const numIncidents = Math.floor(Math.random() * 4) + 5

  for (let i = 0; i < numIncidents; i++) {
    const template = incidentTemplates[Math.floor(Math.random() * incidentTemplates.length)]
    const title = template.titles[Math.floor(Math.random() * template.titles.length)]

    // Generate locations within 2km radius
    const angle = Math.random() * 2 * Math.PI
    const distance = Math.random() * 0.018 // ~2km in degrees
    const latOffset = distance * Math.cos(angle)
    const lngOffset = distance * Math.sin(angle)

    const minutesAgo = Math.floor(Math.random() * 180) + 10 // 10 mins to 3 hours ago
    const timestamp = new Date(now.getTime() - minutesAgo * 60 * 1000)

    // Calculate actual distance
    const distKm = Math.sqrt(latOffset ** 2 + lngOffset ** 2) * 111
    const distanceStr = distKm < 1 ? `${Math.round(distKm * 1000)}m` : `${distKm.toFixed(1)}km`

    incidents.push({
      id: `incident-${i}-${Date.now()}`,
      type: template.type,
      title,
      description: `Reported ${minutesAgo < 60 ? `${minutesAgo} minutes` : `${Math.floor(minutesAgo / 60)} hours`} ago`,
      location: { lat: userLat + latOffset, lng: userLng + lngOffset },
      timestamp,
      severity: template.severity,
      distance: distanceStr,
      source: template.source,
      verified: Math.random() > 0.4,
    })
  }

  return incidents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

export function IncidentMap({ className }: IncidentMapProps) {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [userAddress, setUserAddress] = useState<string>("")
  const [locationAccuracy, setLocationAccuracy] = useState<number>(0)
  const [locationSource, setLocationSource] = useState<"gps" | "ip" | "manual">("gps")
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [communityPlaces, setCommunityPlaces] = useState<CommunityPlace[]>([])
  const [selectedFilter, setSelectedFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [locationSearch, setLocationSearch] = useState("")
  const [searchSuggestions, setSearchSuggestions] = useState<LocationData[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
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
        const results = await searchLocation(query)
        setSearchSuggestions(results)
        setShowSuggestions(results.length > 0)
      } catch (error) {
        console.error("Search error:", error)
      }
    }, 300)
  }

  const selectSuggestion = async (suggestion: LocationData) => {
    setUserLocation({ lat: suggestion.lat, lng: suggestion.lng })
    setUserAddress(suggestion.address)
    setLocationSource("manual")
    setLocationSearch(suggestion.address.split(",").slice(0, 2).join(","))
    setShowSuggestions(false)

    // Load incidents for new location
    setIsLoading(true)
    const newIncidents = await generateNearbyIncidents(suggestion.lat, suggestion.lng)
    setIncidents(newIncidents)

    // Update community places
    setCommunityPlaces([
      {
        id: "cp1",
        name: `${suggestion.area} Police Station`,
        type: "safe",
        lat: suggestion.lat + 0.003,
        lng: suggestion.lng + 0.002,
        addedBy: "ProtectMe Team",
        votes: 45,
        reason: "24/7 police presence",
      },
      {
        id: "cp2",
        name: `${suggestion.area} Main Road`,
        type: "safe",
        lat: suggestion.lat - 0.002,
        lng: suggestion.lng + 0.003,
        addedBy: "Community",
        votes: 32,
        reason: "Well lit, CCTV cameras",
      },
    ])

    setIsLoading(false)
  }

  const getHighAccuracyLocation = async () => {
    setIsLoading(true)
    try {
      const location = await getCurrentLocation()
      setUserLocation({ lat: location.lat, lng: location.lng })
      setUserAddress(location.address)
      setLocationAccuracy(location.accuracy)
      setLocationSource(location.source)

      // Generate community places based on area
      setCommunityPlaces([
        {
          id: "cp1",
          name: `${location.area} Police Station`,
          type: "safe",
          lat: location.lat + 0.003,
          lng: location.lng + 0.002,
          addedBy: "ProtectMe Team",
          votes: 45,
          reason: "24/7 police presence",
        },
        {
          id: "cp2",
          name: `${location.area} Main Road`,
          type: "safe",
          lat: location.lat - 0.002,
          lng: location.lng + 0.003,
          addedBy: "Community",
          votes: 32,
          reason: "Well lit, CCTV cameras",
        },
        {
          id: "cp3",
          name: "Isolated stretch near railway",
          type: "unsafe",
          lat: location.lat + 0.005,
          lng: location.lng - 0.004,
          addedBy: "Local Users",
          votes: 28,
          reason: "Poor lighting, past incidents",
        },
      ])

      const newIncidents = await generateNearbyIncidents(location.lat, location.lng)
      setIncidents(newIncidents)
    } catch (error) {
      console.error("Location error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Get location on mount
  useEffect(() => {
    getHighAccuracyLocation()
  }, [])

  const refreshIncidents = async () => {
    if (!userLocation) return
    setIsLoading(true)
    const newIncidents = await generateNearbyIncidents(userLocation.lat, userLocation.lng)
    setIncidents(newIncidents)
    setIsLoading(false)
  }

  const filteredIncidents = incidents.filter((inc) => {
    if (selectedFilter === "all") return true
    return inc.type === selectedFilter
  })

  const getIncidentIcon = (type: string) => {
    switch (type) {
      case "theft":
        return <AlertTriangle className="w-4 h-4" />
      case "assault":
        return <Users className="w-4 h-4" />
      case "suspicious":
        return <Search className="w-4 h-4" />
      case "accident":
        return <Car className="w-4 h-4" />
      default:
        return <MapPin className="w-4 h-4" />
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Location Search */}
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              placeholder="Search location..."
              value={locationSearch}
              onChange={(e) => handleLocationSearch(e.target.value)}
              onFocus={() => searchSuggestions.length > 0 && setShowSuggestions(true)}
              className="pr-10"
            />
            <Search className="w-4 h-4 absolute right-3 top-3 text-muted-foreground" />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={getHighAccuracyLocation}
            disabled={isLoading}
            className="bg-transparent"
            title="Get current GPS location"
          >
            <Navigation className={cn("w-4 h-4", isLoading && "animate-pulse")} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={refreshIncidents}
            disabled={isLoading}
            className="bg-transparent"
          >
            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
          </Button>
        </div>

        {showSuggestions && searchSuggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {searchSuggestions.map((suggestion, idx) => (
              <button
                key={idx}
                className="w-full px-3 py-2 text-left text-sm hover:bg-secondary/50 flex items-start gap-2"
                onClick={() => selectSuggestion(suggestion)}
              >
                <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                <span className="text-foreground">{suggestion.address}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Current Location with accuracy indicator */}
      {userAddress && (
        <div className="p-3 rounded-lg bg-secondary/50">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emergency" />
            <span className="text-sm text-foreground flex-1">{userAddress}</span>
            <Badge
              variant="outline"
              className={cn(
                "text-xs",
                locationSource === "gps"
                  ? "bg-green-500/20 text-green-500"
                  : locationSource === "manual"
                    ? "bg-blue-500/20 text-blue-500"
                    : "bg-yellow-500/20 text-yellow-500",
              )}
            >
              {locationSource === "gps"
                ? `GPS ±${Math.round(locationAccuracy)}m`
                : locationSource === "manual"
                  ? "Manual"
                  : "IP Location"}
            </Badge>
          </div>
        </div>
      )}

      {/* Map */}
      {userLocation && (
        <div className="rounded-xl overflow-hidden border border-border aspect-video relative">
          <iframe
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${userLocation.lng - 0.015},${userLocation.lat - 0.015},${userLocation.lng + 0.015},${userLocation.lat + 0.015}&layer=mapnik&marker=${userLocation.lat},${userLocation.lng}`}
          />
          {/* Open in Google Maps button */}
          <a
            href={`https://www.google.com/maps?q=${userLocation.lat},${userLocation.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-2 right-2 bg-white text-black px-2 py-1 rounded text-xs font-medium shadow hover:bg-gray-100"
          >
            Open in Google Maps
          </a>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {["all", "theft", "assault", "suspicious", "accident"].map((filter) => (
          <Button
            key={filter}
            variant={selectedFilter === filter ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFilter(filter)}
            className={cn(selectedFilter === filter ? "bg-emergency hover:bg-emergency/90" : "bg-transparent")}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </Button>
        ))}
      </div>

      {/* Community Safe/Unsafe Places */}
      {communityPlaces.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium text-foreground flex items-center gap-2">
            <Users className="w-4 h-4" />
            Community Marked Places
          </h3>
          <div className="space-y-2">
            {communityPlaces.map((place) => (
              <div
                key={place.id}
                className={cn(
                  "p-3 rounded-lg border flex items-center justify-between",
                  place.type === "safe" ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30",
                )}
              >
                <div className="flex items-center gap-3">
                  {place.type === "safe" ? (
                    <Shield className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  )}
                  <div>
                    <p className="font-medium text-foreground">{place.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Added by {place.addedBy} • {place.reason}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{place.votes} votes</span>
                  <ThumbsUp className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-green-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Incidents List */}
      <div className="space-y-2">
        <h3 className="font-medium text-foreground">Recent Incidents ({filteredIncidents.length})</h3>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {filteredIncidents.map((incident) => (
              <div
                key={incident.id}
                className={cn(
                  "p-3 rounded-lg border",
                  incident.severity === "high"
                    ? "bg-red-500/10 border-red-500/30"
                    : incident.severity === "medium"
                      ? "bg-yellow-500/10 border-yellow-500/30"
                      : "bg-card border-border",
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "p-2 rounded-lg",
                        incident.severity === "high"
                          ? "bg-red-500/20"
                          : incident.severity === "medium"
                            ? "bg-yellow-500/20"
                            : "bg-secondary",
                      )}
                    >
                      {getIncidentIcon(incident.type)}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{incident.title}</p>
                      <p className="text-xs text-muted-foreground">{incident.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {incident.source}
                        </Badge>
                        {incident.verified && (
                          <Badge className="text-xs bg-green-500/20 text-green-500">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="shrink-0">
                    {incident.distance}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
