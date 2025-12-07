"use client"

export interface LocationData {
  lat: number
  lng: number
  accuracy: number
  address: string
  area: string
  city: string
  state: string
  source: "gps" | "ip" | "manual"
}

export interface NearbyPlace {
  name: string
  address: string
  phone: string
  distance: string
  lat: number
  lng: number
  type: "police" | "hospital" | "fire"
}

// High-accuracy GPS options
const GPS_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 0, // Don't use cached position
}

// Get current location with high accuracy
export async function getCurrentLocation(): Promise<LocationData> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"))
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords

        // Get address using multiple services for accuracy
        const addressData = await reverseGeocode(latitude, longitude)

        resolve({
          lat: latitude,
          lng: longitude,
          accuracy,
          address: addressData.fullAddress,
          area: addressData.area,
          city: addressData.city,
          state: addressData.state,
          source: "gps",
        })
      },
      async (error) => {
        console.error("GPS Error:", error)
        // Fallback to IP-based location
        try {
          const ipLocation = await getIPLocation()
          resolve(ipLocation)
        } catch (e) {
          reject(error)
        }
      },
      GPS_OPTIONS,
    )
  })
}

// Watch location continuously with high accuracy
export function watchLocation(
  onUpdate: (location: LocationData) => void,
  onError: (error: GeolocationPositionError) => void,
): number {
  return navigator.geolocation.watchPosition(
    async (position) => {
      const { latitude, longitude, accuracy } = position.coords
      const addressData = await reverseGeocode(latitude, longitude)

      onUpdate({
        lat: latitude,
        lng: longitude,
        accuracy,
        address: addressData.fullAddress,
        area: addressData.area,
        city: addressData.city,
        state: addressData.state,
        source: "gps",
      })
    },
    onError,
    GPS_OPTIONS,
  )
}

// Reverse geocode using multiple services
async function reverseGeocode(
  lat: number,
  lng: number,
): Promise<{
  fullAddress: string
  area: string
  city: string
  state: string
}> {
  // Try OpenStreetMap Nominatim first
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&zoom=18`,
      {
        headers: {
          "Accept-Language": "en",
          "User-Agent": "ProtectMeSOS/1.0",
        },
      },
    )
    const data = await response.json()

    if (data && data.address) {
      const addr = data.address
      const area = addr.suburb || addr.neighbourhood || addr.hamlet || addr.village || addr.town || ""
      const city = addr.city || addr.town || addr.municipality || addr.county || ""
      const state = addr.state || ""
      const road = addr.road || addr.pedestrian || ""

      let fullAddress = ""
      if (road) fullAddress += road + ", "
      if (area) fullAddress += area + ", "
      if (city) fullAddress += city
      if (state && state !== city) fullAddress += ", " + state

      return {
        fullAddress:
          fullAddress || data.display_name?.split(",").slice(0, 4).join(", ") || `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        area: area || "Unknown Area",
        city: city || "Unknown City",
        state: state || "",
      }
    }
  } catch (e) {
    console.error("Nominatim error:", e)
  }

  // Fallback to coordinates
  return {
    fullAddress: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
    area: "Unknown Area",
    city: "Unknown City",
    state: "",
  }
}

// IP-based location fallback
async function getIPLocation(): Promise<LocationData> {
  const response = await fetch("https://ipapi.co/json/")
  const data = await response.json()

  return {
    lat: data.latitude,
    lng: data.longitude,
    accuracy: 5000, // IP location is not very accurate
    address: `${data.city}, ${data.region}, ${data.country_name}`,
    area: data.city || "Unknown",
    city: data.city || "Unknown",
    state: data.region || "",
    source: "ip",
  }
}

// Search location by text (for manual input)
export async function searchLocation(query: string): Promise<LocationData[]> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=in&addressdetails=1`,
      {
        headers: {
          "Accept-Language": "en",
          "User-Agent": "ProtectMeSOS/1.0",
        },
      },
    )
    const data = await response.json()

    return data.map((item: any) => ({
      lat: Number.parseFloat(item.lat),
      lng: Number.parseFloat(item.lon),
      accuracy: 100,
      address: item.display_name,
      area: item.address?.suburb || item.address?.neighbourhood || "",
      city: item.address?.city || item.address?.town || "",
      state: item.address?.state || "",
      source: "manual" as const,
    }))
  } catch (e) {
    console.error("Search error:", e)
    return []
  }
}

// Get nearby police stations using backend API
export async function getNearbyPoliceStations(lat: number, lng: number): Promise<NearbyPlace[]> {
  try {
    // Use our backend API with real Bangalore/Whitefield police station data
    const response = await fetch(`/api/nearby-police?lat=${lat}&lng=${lng}`)
    const data = await response.json()

    if (data.success && data.policeStations) {
      return data.policeStations.map((station: any) => ({
        name: station.name,
        address: station.address,
        phone: station.phone,
        distance: station.distance,
        lat: station.lat,
        lng: station.lng,
        type: "police" as const,
      }))
    }
  } catch (e) {
    console.error("Police station API error:", e)
  }

  // Fallback: Return Whitefield Police Station as default
  return [
    {
      name: "Whitefield Police Station",
      address: "ITPL Main Road, Whitefield, Bangalore - 560066",
      phone: "080-28452317",
      distance: "Nearby",
      lat: 12.9698,
      lng: 77.7499,
      type: "police",
    },
    {
      name: "Emergency Police Helpline",
      address: "Dial for immediate help",
      phone: "100",
      distance: "Available 24/7",
      lat,
      lng,
      type: "police",
    },
  ]
}

// Get nearby hospitals
export async function getNearbyHospitals(lat: number, lng: number): Promise<NearbyPlace[]> {
  const places: NearbyPlace[] = []

  try {
    const query = `
      [out:json][timeout:10];
      (
        node["amenity"="hospital"](around:5000,${lat},${lng});
        way["amenity"="hospital"](around:5000,${lat},${lng});
      );
      out center body 5;
    `

    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `data=${encodeURIComponent(query)}`,
    })

    const data = await response.json()

    if (data.elements) {
      for (const element of data.elements.slice(0, 5)) {
        const placeLat = element.lat || element.center?.lat
        const placeLng = element.lon || element.center?.lon

        if (placeLat && placeLng) {
          const distance = calculateDistance(lat, lng, placeLat, placeLng)

          places.push({
            name: element.tags?.name || "Hospital",
            address: element.tags?.["addr:full"] || "",
            phone: element.tags?.phone || "108",
            distance: distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`,
            lat: placeLat,
            lng: placeLng,
            type: "hospital",
          })
        }
      }
    }
  } catch (e) {
    console.error("Hospital search error:", e)
  }

  return places
}

// Calculate distance between two coordinates (in km)
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180)
}

// Format coordinates for display
export function formatCoordinates(lat: number, lng: number): string {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`
}

// Get Google Maps link
export function getGoogleMapsLink(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat},${lng}`
}

// Get Google Maps directions link
export function getDirectionsLink(fromLat: number, fromLng: number, toLat: number, toLng: number): string {
  return `https://www.google.com/maps/dir/${fromLat},${fromLng}/${toLat},${toLng}`
}
