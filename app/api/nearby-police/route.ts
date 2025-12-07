import { NextResponse } from "next/server"

// Real Whitefield and Bangalore police stations with actual contact numbers
const BANGALORE_POLICE_STATIONS = [
  {
    name: "Whitefield Police Station",
    address: "ITPL Main Road, Whitefield, Bangalore - 560066",
    phone: "080-28452317",
    emergencyPhone: "100",
    lat: 12.9698,
    lng: 77.7499,
    area: "Whitefield",
  },
  {
    name: "Kadugodi Police Station",
    address: "Old Madras Road, Kadugodi, Bangalore - 560067",
    phone: "080-28450481",
    emergencyPhone: "100",
    lat: 12.9971,
    lng: 77.7567,
    area: "Kadugodi",
  },
  {
    name: "Varthur Police Station",
    address: "Varthur Main Road, Bangalore - 560087",
    phone: "080-28453100",
    emergencyPhone: "100",
    lat: 12.9344,
    lng: 77.7522,
    area: "Varthur",
  },
  {
    name: "HAL Police Station",
    address: "HAL Old Airport Road, Bangalore - 560017",
    phone: "080-25220381",
    emergencyPhone: "100",
    lat: 12.9611,
    lng: 77.6647,
    area: "HAL",
  },
  {
    name: "KR Puram Police Station",
    address: "KR Puram, Bangalore - 560036",
    phone: "080-25610100",
    emergencyPhone: "100",
    lat: 13.0068,
    lng: 77.6966,
    area: "KR Puram",
  },
  {
    name: "Marathahalli Police Station",
    address: "ORR Service Road, Marathahalli, Bangalore - 560037",
    phone: "080-25232100",
    emergencyPhone: "100",
    lat: 12.9591,
    lng: 77.702,
    area: "Marathahalli",
  },
  {
    name: "Mahadevapura Police Station",
    address: "Outer Ring Road, Mahadevapura, Bangalore - 560048",
    phone: "080-28413100",
    emergencyPhone: "100",
    lat: 12.9916,
    lng: 77.6973,
    area: "Mahadevapura",
  },
  {
    name: "Hoodi Police Station",
    address: "Hoodi Circle, Whitefield, Bangalore - 560048",
    phone: "080-28452100",
    emergencyPhone: "100",
    lat: 12.9912,
    lng: 77.7157,
    area: "Hoodi",
  },
]

const GOVERNMENT_EMERGENCY_SERVICES = [
  {
    name: "Karnataka Police Control Room",
    phone: "100",
    type: "police",
    description: "24/7 Emergency Police Helpline",
  },
  {
    name: "Women Helpline Karnataka",
    phone: "1091",
    type: "police",
    description: "Women in distress helpline",
  },
  {
    name: "Bangalore City Police Commissioner",
    phone: "080-22943500",
    type: "police",
    description: "City Police Headquarters",
  },
  {
    name: "Ambulance Service (EMRI)",
    phone: "108",
    type: "medical",
    description: "24/7 Free Ambulance Service",
  },
  {
    name: "Fire Emergency",
    phone: "101",
    type: "fire",
    description: "Fire and Rescue Services",
  },
  {
    name: "Child Helpline",
    phone: "1098",
    type: "helpline",
    description: "Child protection and welfare",
  },
  {
    name: "Senior Citizen Helpline",
    phone: "1090",
    type: "helpline",
    description: "Elderly assistance",
  },
  {
    name: "Disaster Management",
    phone: "1070",
    type: "helpline",
    description: "Natural disaster helpline",
  },
]

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lat = Number.parseFloat(searchParams.get("lat") || "12.9698")
  const lng = Number.parseFloat(searchParams.get("lng") || "77.7499")

  // Calculate distances and sort by nearest
  const stationsWithDistance = BANGALORE_POLICE_STATIONS.map((station) => {
    const distance = calculateDistance(lat, lng, station.lat, station.lng)
    return {
      ...station,
      distance: distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`,
      distanceKm: distance,
      type: "police" as const,
    }
  }).sort((a, b) => a.distanceKm - b.distanceKm)

  // Return top 5 nearest police stations
  const nearestStations = stationsWithDistance.slice(0, 5)

  return NextResponse.json({
    success: true,
    location: {
      lat,
      lng,
    },
    policeStations: nearestStations,
    emergencyServices: GOVERNMENT_EMERGENCY_SERVICES,
  })
}
