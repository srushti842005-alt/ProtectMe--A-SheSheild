"use client"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertTriangle,
  Phone,
  MapPin,
  Video,
  Mic,
  CheckCircle,
  XCircle,
  Search,
  Navigation,
  Clock,
  User,
  Shield,
  Eye,
  PhoneCall,
} from "lucide-react"

interface Incident {
  id: string
  userId: string
  userName: string
  phone: string
  location: { lat: number; lng: number; address: string }
  type: "sos" | "panic" | "report"
  status: "active" | "responding" | "resolved" | "fake"
  timestamp: Date
  trustScore: number
  hasVideo: boolean
  hasAudio: boolean
  videoUrl?: string
  audioUrl?: string
  notes: string[]
  assignedOfficer?: string
  contacts: { name: string; phone: string; notified: boolean }[]
}

const mockIncidents: Incident[] = [
  {
    id: "INC001",
    userId: "USR001",
    userName: "Priya Sharma",
    phone: "+91 98765 43210",
    location: { lat: 12.9716, lng: 77.5946, address: "MG Road, Near Trinity Metro, Bangalore" },
    type: "sos",
    status: "active",
    timestamp: new Date(Date.now() - 2 * 60000),
    trustScore: 95,
    hasVideo: true,
    hasAudio: true,
    notes: ["User appears distressed", "Multiple people visible in video"],
    contacts: [
      { name: "Mom", phone: "+91 97415 89059", notified: true },
      { name: "Dad", phone: "+91 74158 90590", notified: true },
    ],
  },
  {
    id: "INC002",
    userId: "USR002",
    userName: "Sneha Reddy",
    phone: "+91 87654 32109",
    location: { lat: 12.9352, lng: 77.6245, address: "80 Feet Road, Koramangala, Bangalore" },
    type: "panic",
    status: "responding",
    timestamp: new Date(Date.now() - 5 * 60000),
    trustScore: 88,
    hasVideo: true,
    hasAudio: false,
    assignedOfficer: "Officer Raju - Badge #4521",
    notes: ["Officer dispatched", "ETA 3 minutes"],
    contacts: [{ name: "Brother", phone: "+91 98765 12345", notified: true }],
  },
  {
    id: "INC003",
    userId: "USR003",
    userName: "Unknown User",
    phone: "+91 76543 21098",
    location: { lat: 12.9698, lng: 77.75, address: "ITPL Main Road, Whitefield" },
    type: "sos",
    status: "active",
    timestamp: new Date(Date.now() - 1 * 60000),
    trustScore: 32,
    hasVideo: false,
    hasAudio: true,
    notes: ["Low trust score - possible fake call", "No video evidence", "Audio contains silence"],
    contacts: [],
  },
]

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents)
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)
  const [filter, setFilter] = useState<"all" | "active" | "responding" | "resolved" | "fake">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isCallDialogOpen, setIsCallDialogOpen] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const callIntervalRef = useRef<NodeJS.Timeout>()

  const filteredIncidents = incidents.filter((inc) => {
    const matchesFilter = filter === "all" || inc.status === filter
    const matchesSearch =
      inc.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.phone.includes(searchQuery) ||
      inc.location.address.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const handleResolve = (id: string) => {
    setIncidents((prev) => prev.map((inc) => (inc.id === id ? { ...inc, status: "resolved" as const } : inc)))
    setSelectedIncident(null)
  }

  const handleMarkFake = (id: string) => {
    setIncidents((prev) => prev.map((inc) => (inc.id === id ? { ...inc, status: "fake" as const } : inc)))
    setSelectedIncident(null)
  }

  const handleDispatch = (id: string) => {
    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === id
          ? {
              ...inc,
              status: "responding" as const,
              assignedOfficer: "Officer Kumar - Badge #3892",
              notes: [...inc.notes, `Officer dispatched at ${new Date().toLocaleTimeString()}`],
            }
          : inc,
      ),
    )
  }

  const startCall = () => {
    setIsCallDialogOpen(true)
    setCallDuration(0)
    callIntervalRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1)
    }, 1000)
  }

  const endCall = () => {
    if (callIntervalRef.current) {
      clearInterval(callIntervalRef.current)
    }
    setIsCallDialogOpen(false)
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emergency text-white animate-pulse"
      case "responding":
        return "bg-yellow-500 text-black"
      case "resolved":
        return "bg-success text-white"
      case "fake":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-muted"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Live Incidents</h1>
          <p className="text-muted-foreground">Monitor and respond to emergency alerts</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search incidents..."
              className="pl-9 w-[200px] border-border"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "active", "responding", "resolved", "fake"] as const).map((status) => (
          <Button
            key={status}
            variant={filter === status ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(status)}
            className={filter === status ? "bg-emergency hover:bg-emergency/90" : "border-border"}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            {status === "active" && (
              <Badge className="ml-2 bg-white text-emergency h-5 px-1.5">
                {incidents.filter((i) => i.status === "active").length}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      {/* Incidents Grid */}
      <div className="grid lg:grid-cols-2 gap-4">
        {filteredIncidents.map((incident) => (
          <Card
            key={incident.id}
            className={`border-border cursor-pointer hover:border-emergency/50 transition-colors ${
              incident.status === "active" ? "border-emergency/50 bg-emergency/5" : ""
            }`}
            onClick={() => setSelectedIncident(incident)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-foreground">{incident.userName}</span>
                    <Badge className={getStatusColor(incident.status)}>{incident.status.toUpperCase()}</Badge>
                    {incident.trustScore < 50 && (
                      <Badge variant="outline" className="text-orange-500 border-orange-500">
                        Suspected Fake ({incident.trustScore}%)
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <Phone className="w-3 h-3" />
                      {incident.phone}
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="w-3 h-3" />
                      {incident.location.address}
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      {Math.round((Date.now() - incident.timestamp.getTime()) / 60000)} minutes ago
                    </p>
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
                    {incident.assignedOfficer && (
                      <Badge variant="outline" className="text-xs text-success border-success">
                        <Shield className="w-3 h-3 mr-1" />
                        Officer Assigned
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    className="bg-emergency hover:bg-emergency/90"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedIncident(incident)
                    }}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Incident Detail Dialog */}
      <Dialog open={!!selectedIncident} onOpenChange={() => setSelectedIncident(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedIncident && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-emergency" />
                  Incident {selectedIncident.id}
                  <Badge className={getStatusColor(selectedIncident.status)}>
                    {selectedIncident.status.toUpperCase()}
                  </Badge>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* User Info */}
                <div className="p-4 rounded-lg bg-muted/50">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    User Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Name</p>
                      <p className="font-medium text-foreground">{selectedIncident.userName}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Phone</p>
                      <p className="font-medium text-foreground">{selectedIncident.phone}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Trust Score</p>
                      <p
                        className={`font-medium ${selectedIncident.trustScore < 50 ? "text-orange-500" : "text-success"}`}
                      >
                        {selectedIncident.trustScore}%
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Time</p>
                      <p className="font-medium text-foreground">{selectedIncident.timestamp.toLocaleTimeString()}</p>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="p-4 rounded-lg bg-muted/50">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location
                  </h3>
                  <p className="text-sm text-foreground mb-2">{selectedIncident.location.address}</p>
                  <div className="w-full h-48 rounded-lg bg-muted flex items-center justify-center">
                    <iframe
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedIncident.location.lng - 0.01}%2C${selectedIncident.location.lat - 0.01}%2C${selectedIncident.location.lng + 0.01}%2C${selectedIncident.location.lat + 0.01}&layer=mapnik&marker=${selectedIncident.location.lat}%2C${selectedIncident.location.lng}`}
                      className="w-full h-full rounded-lg"
                    />
                  </div>
                </div>

                {/* Evidence */}
                {(selectedIncident.hasVideo || selectedIncident.hasAudio) && (
                  <div className="p-4 rounded-lg bg-muted/50">
                    <h3 className="font-semibold text-foreground mb-3">Evidence</h3>
                    <div className="flex gap-2">
                      {selectedIncident.hasVideo && (
                        <Button
                          variant="outline"
                          className="border-border bg-transparent"
                          onClick={() => {
                            const speech = new SpeechSynthesisUtterance(
                              "Playing video evidence. Video shows the user in a crowded area with several people nearby.",
                            )
                            speechSynthesis.speak(speech)
                          }}
                        >
                          <Video className="w-4 h-4 mr-2" />
                          Play Video
                        </Button>
                      )}
                      {selectedIncident.hasAudio && (
                        <Button
                          variant="outline"
                          className="border-border bg-transparent"
                          onClick={() => {
                            const speech = new SpeechSynthesisUtterance(
                              "Playing audio evidence. Audio recording: Help! Someone is following me. Please send help to my location immediately.",
                            )
                            speech.rate = 1.1
                            speechSynthesis.speak(speech)
                          }}
                        >
                          <Mic className="w-4 h-4 mr-2" />
                          Play Audio
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {/* Emergency Contacts */}
                {selectedIncident.contacts.length > 0 && (
                  <div className="p-4 rounded-lg bg-muted/50">
                    <h3 className="font-semibold text-foreground mb-3">Emergency Contacts Notified</h3>
                    <div className="space-y-2">
                      {selectedIncident.contacts.map((contact, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded bg-background">
                          <div>
                            <p className="font-medium text-foreground text-sm">{contact.name}</p>
                            <p className="text-xs text-muted-foreground">{contact.phone}</p>
                          </div>
                          {contact.notified && <Badge className="bg-success text-xs">Notified</Badge>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selectedIncident.notes.length > 0 && (
                  <div className="p-4 rounded-lg bg-muted/50">
                    <h3 className="font-semibold text-foreground mb-3">Notes</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {selectedIncident.notes.map((note, i) => (
                        <li key={i}>• {note}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                  <Button className="bg-success hover:bg-success/90" onClick={() => startCall()}>
                    <PhoneCall className="w-4 h-4 mr-2" />
                    Call User
                  </Button>

                  {selectedIncident.status === "active" && (
                    <Button variant="outline" onClick={() => handleDispatch(selectedIncident.id)}>
                      <Navigation className="w-4 h-4 mr-2" />
                      Dispatch Officer
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    className="border-success text-success hover:bg-success/10 bg-transparent"
                    onClick={() => handleResolve(selectedIncident.id)}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark Resolved
                  </Button>

                  {selectedIncident.trustScore < 50 && (
                    <Button
                      variant="outline"
                      className="border-orange-500 text-orange-500 hover:bg-orange-500/10 bg-transparent"
                      onClick={() => handleMarkFake(selectedIncident.id)}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Mark as Fake
                    </Button>
                  )}
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
            <div className="w-20 h-20 mx-auto rounded-full bg-success/20 flex items-center justify-center">
              <Phone className="w-10 h-10 text-success animate-pulse" />
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">{selectedIncident?.userName || "User"}</p>
              <p className="text-sm text-muted-foreground">{selectedIncident?.phone}</p>
            </div>
            <p className="text-3xl font-mono text-foreground">{formatDuration(callDuration)}</p>
            <Button className="bg-emergency hover:bg-emergency/90 w-full" onClick={endCall}>
              End Call
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
