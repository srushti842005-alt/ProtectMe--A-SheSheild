"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertTriangle,
  Users,
  MapPin,
  Phone,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Eye,
  PhoneCall,
  Navigation,
  XCircle,
  AlertCircle,
  Video,
  Mic,
  X,
} from "lucide-react"

interface LiveIncident {
  id: string
  userId: string
  userName: string
  phone: string
  location: { lat: number; lng: number; address: string }
  type: "sos" | "panic" | "fake_suspected"
  status: "active" | "responding" | "resolved" | "fake"
  timestamp: Date
  trustScore: number
  hasVideo: boolean
  hasAudio: boolean
  nearbyOfficers: number
}

const generateMockIncidents = (): LiveIncident[] => [
  {
    id: "INC001",
    userId: "USR001",
    userName: "Priya Sharma",
    phone: "+91 98765 43210",
    location: { lat: 12.9716, lng: 77.5946, address: "MG Road, Bangalore" },
    type: "sos",
    status: "active",
    timestamp: new Date(Date.now() - 2 * 60000),
    trustScore: 95,
    hasVideo: true,
    hasAudio: true,
    nearbyOfficers: 3,
  },
  {
    id: "INC002",
    userId: "USR002",
    userName: "Sneha Reddy",
    phone: "+91 87654 32109",
    location: { lat: 12.9352, lng: 77.6245, address: "Koramangala, Bangalore" },
    type: "panic",
    status: "responding",
    timestamp: new Date(Date.now() - 5 * 60000),
    trustScore: 88,
    hasVideo: true,
    hasAudio: false,
    nearbyOfficers: 2,
  },
  {
    id: "INC003",
    userId: "USR003",
    userName: "Ananya Nair",
    phone: "+91 76543 21098",
    location: { lat: 12.9698, lng: 77.75, address: "Whitefield, Bangalore" },
    type: "fake_suspected",
    status: "active",
    timestamp: new Date(Date.now() - 1 * 60000),
    trustScore: 35,
    hasVideo: false,
    hasAudio: true,
    nearbyOfficers: 1,
  },
  {
    id: "INC004",
    userId: "USR004",
    userName: "Kavitha M",
    phone: "+91 65432 10987",
    location: { lat: 12.9141, lng: 77.6411, address: "HSR Layout, Bangalore" },
    type: "sos",
    status: "resolved",
    timestamp: new Date(Date.now() - 15 * 60000),
    trustScore: 92,
    hasVideo: true,
    hasAudio: true,
    nearbyOfficers: 0,
  },
]

export default function AdminDashboardPage() {
  const [incidents, setIncidents] = useState<LiveIncident[]>([])
  const [selectedIncident, setSelectedIncident] = useState<LiveIncident | null>(null)
  const [isCallDialogOpen, setIsCallDialogOpen] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const callIntervalRef = useRef<NodeJS.Timeout>()
  const [stats, setStats] = useState({
    activeIncidents: 0,
    totalUsers: 0,
    resolvedToday: 0,
    fakeCallsDetected: 0,
    avgResponseTime: "0",
    dangerZones: 0,
  })

  useEffect(() => {
    const mockIncidents = generateMockIncidents()
    setIncidents(mockIncidents)

    setStats({
      activeIncidents: mockIncidents.filter((i) => i.status === "active" || i.status === "responding").length,
      totalUsers: 15432,
      resolvedToday: 23,
      fakeCallsDetected: 5,
      avgResponseTime: "4.2",
      dangerZones: 3,
    })

    const interval = setInterval(() => {
      setIncidents((prev) => {
        const updated = [...prev]
        const idx = Math.floor(Math.random() * updated.length)
        if (updated[idx].status === "active") {
          updated[idx].status = "responding"
        }
        return updated
      })
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const getStatusBadge = (status: string, trustScore: number) => {
    if (trustScore < 50) {
      return (
        <Badge variant="destructive" className="bg-orange-500">
          Suspected Fake
        </Badge>
      )
    }
    switch (status) {
      case "active":
        return (
          <Badge variant="destructive" className="animate-pulse">
            ACTIVE
          </Badge>
        )
      case "responding":
        return <Badge className="bg-yellow-500 text-black">Responding</Badge>
      case "resolved":
        return <Badge className="bg-green-500">Resolved</Badge>
      case "fake":
        return <Badge variant="secondary">Fake Call</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleViewIncident = (incident: LiveIncident) => {
    setSelectedIncident(incident)
  }

  const handleCallUser = (incident: LiveIncident) => {
    setSelectedIncident(incident)
    setIsCallDialogOpen(true)
    setCallDuration(0)
    callIntervalRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1)
    }, 1000)

    const speech = new SpeechSynthesisUtterance(`Calling ${incident.userName}. Please wait while we connect you.`)
    speech.onend = () => {
      const response = new SpeechSynthesisUtterance(
        "Hello? Please help me! I'm in danger. Someone is following me near " + incident.location.address,
      )
      response.rate = 1.1
      speechSynthesis.speak(response)
    }
    speechSynthesis.speak(speech)
  }

  const handleDispatch = (incidentId: string) => {
    setIncidents((prev) => prev.map((inc) => (inc.id === incidentId ? { ...inc, status: "responding" as const } : inc)))

    const speech = new SpeechSynthesisUtterance("Officer dispatched. Estimated arrival time: 4 minutes.")
    speechSynthesis.speak(speech)
  }

  const endCall = () => {
    if (callIntervalRef.current) {
      clearInterval(callIntervalRef.current)
    }
    speechSynthesis.cancel()
    setIsCallDialogOpen(false)
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const activeCount = incidents.filter((i) => i.status === "active").length
  const respondingCount = incidents.filter((i) => i.status === "responding").length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Command Center</h1>
          <p className="text-muted-foreground">Real-time emergency monitoring dashboard</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm font-medium text-red-500">{activeCount} Active Emergencies</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="border-red-500/50 bg-red-500/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <TrendingUp className="w-4 h-4 text-red-500" />
            </div>
            <p className="text-2xl font-bold text-foreground mt-2">{stats.activeIncidents}</p>
            <p className="text-xs text-muted-foreground">Active Incidents</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Users className="w-5 h-5 text-muted-foreground" />
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-foreground mt-2">{stats.totalUsers.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Users</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-xs text-green-500">+12%</span>
            </div>
            <p className="text-2xl font-bold text-foreground mt-2">{stats.resolvedToday}</p>
            <p className="text-xs text-muted-foreground">Resolved Today</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <XCircle className="w-5 h-5 text-orange-500" />
              <TrendingDown className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-foreground mt-2">{stats.fakeCallsDetected}</p>
            <p className="text-xs text-muted-foreground">Fake Calls Detected</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <span className="text-xs text-green-500">-0.5m</span>
            </div>
            <p className="text-2xl font-bold text-foreground mt-2">{stats.avgResponseTime}m</p>
            <p className="text-xs text-muted-foreground">Avg Response Time</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <MapPin className="w-5 h-5 text-red-500" />
              <AlertCircle className="w-4 h-4 text-red-500" />
            </div>
            <p className="text-2xl font-bold text-foreground mt-2">{stats.dangerZones}</p>
            <p className="text-xs text-muted-foreground">Danger Zones</p>
          </CardContent>
        </Card>
      </div>

      {/* Live Incidents */}
      <Card className="border-border">
        <CardHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Live Incidents Feed
            </CardTitle>
            <Badge variant="outline" className="border-red-500 text-red-500">
              {activeCount + respondingCount} Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[400px]">
            {incidents.map((incident) => (
              <div
                key={incident.id}
                className={`p-4 border-b border-border hover:bg-muted/50 transition-colors ${
                  incident.status === "active" ? "bg-red-500/5" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-foreground">{incident.userName}</span>
                      {getStatusBadge(incident.status, incident.trustScore)}
                      {incident.trustScore < 50 && (
                        <Badge variant="outline" className="text-orange-500 border-orange-500">
                          Trust: {incident.trustScore}%
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {incident.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {incident.location.address}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {incident.hasVideo && (
                        <Badge variant="secondary" className="text-xs">
                          <Video className="w-3 h-3 mr-1" />
                          Video
                        </Badge>
                      )}
                      {incident.hasAudio && (
                        <Badge variant="secondary" className="text-xs">
                          <Mic className="w-3 h-3 mr-1" />
                          Audio
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {Math.round((Date.now() - incident.timestamp.getTime()) / 60000)}m ago
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      className="bg-red-500 hover:bg-red-600"
                      onClick={() => handleViewIncident(incident)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    {incident.status === "active" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-green-500 text-green-500 hover:bg-green-500/10 bg-transparent"
                          onClick={() => handleCallUser(incident)}
                        >
                          <PhoneCall className="w-3 h-3 mr-1" />
                          Call
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDispatch(incident.id)}>
                          <Navigation className="w-3 h-3 mr-1" />
                          Dispatch
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Incident Detail Dialog */}
      <Dialog open={!!selectedIncident && !isCallDialogOpen} onOpenChange={() => setSelectedIncident(null)}>
        <DialogContent className="max-w-2xl">
          {selectedIncident && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  Incident {selectedIncident.id}
                  {getStatusBadge(selectedIncident.status, selectedIncident.trustScore)}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">User</p>
                    <p className="font-medium">{selectedIncident.userName}</p>
                    <p className="text-sm text-muted-foreground">{selectedIncident.phone}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="font-medium">{selectedIncident.location.address}</p>
                  </div>
                </div>
                <div className="w-full h-48 rounded-lg overflow-hidden">
                  <iframe
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedIncident.location.lng - 0.01}%2C${selectedIncident.location.lat - 0.01}%2C${selectedIncident.location.lng + 0.01}%2C${selectedIncident.location.lat + 0.01}&layer=mapnik&marker=${selectedIncident.location.lat}%2C${selectedIncident.location.lng}`}
                    className="w-full h-full"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-green-500 hover:bg-green-600"
                    onClick={() => handleCallUser(selectedIncident)}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call User
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => handleDispatch(selectedIncident.id)}
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Dispatch Officer
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => {
                      window.open(
                        `https://www.google.com/maps/dir/?api=1&destination=${selectedIncident.location.lat},${selectedIncident.location.lng}`,
                        "_blank",
                      )
                    }}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Navigate
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Call Dialog */}
      <Dialog open={isCallDialogOpen} onOpenChange={endCall}>
        <DialogContent className="max-w-sm">
          <div className="text-center py-8 space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
              <Phone className="w-10 h-10 text-green-500 animate-pulse" />
            </div>
            <div>
              <p className="text-lg font-semibold">{selectedIncident?.userName}</p>
              <p className="text-sm text-muted-foreground">{selectedIncident?.phone}</p>
            </div>
            <p className="text-3xl font-mono">{formatDuration(callDuration)}</p>
            <Button className="bg-red-500 hover:bg-red-600 w-full" onClick={endCall}>
              <X className="w-4 h-4 mr-2" />
              End Call
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
