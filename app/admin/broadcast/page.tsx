"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Radio, Send, MapPin, Users, AlertTriangle, CheckCircle, Clock, Megaphone } from "lucide-react"

interface BroadcastHistory {
  id: string
  type: "alert" | "warning" | "info"
  title: string
  message: string
  area: string
  recipients: number
  timestamp: Date
  status: "sent" | "delivered"
}

const mockHistory: BroadcastHistory[] = [
  {
    id: "BC001",
    type: "alert",
    title: "Avoid MG Road Area",
    message: "Multiple incidents reported near MG Road Metro. Please use alternate routes.",
    area: "MG Road, Bangalore",
    recipients: 2345,
    timestamp: new Date(Date.now() - 30 * 60000),
    status: "delivered",
  },
  {
    id: "BC002",
    type: "warning",
    title: "Heavy Traffic Alert",
    message: "Due to an accident, heavy traffic expected on Outer Ring Road for next 2 hours.",
    area: "Outer Ring Road",
    recipients: 5678,
    timestamp: new Date(Date.now() - 2 * 60 * 60000),
    status: "delivered",
  },
  {
    id: "BC003",
    type: "info",
    title: "Safety Patrol Increased",
    message: "Additional police patrol deployed in Koramangala area for the weekend.",
    area: "Koramangala",
    recipients: 1234,
    timestamp: new Date(Date.now() - 24 * 60 * 60000),
    status: "delivered",
  },
]

export default function BroadcastPage() {
  const [broadcastType, setBroadcastType] = useState<"alert" | "warning" | "info">("info")
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [area, setArea] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [history, setHistory] = useState<BroadcastHistory[]>(mockHistory)

  const handleSend = async () => {
    if (!title || !message || !area) return

    setIsSending(true)
    await new Promise((r) => setTimeout(r, 2000))

    const newBroadcast: BroadcastHistory = {
      id: `BC${Date.now()}`,
      type: broadcastType,
      title,
      message,
      area,
      recipients: Math.floor(Math.random() * 5000) + 1000,
      timestamp: new Date(),
      status: "sent",
    }

    setHistory((prev) => [newBroadcast, ...prev])
    setTitle("")
    setMessage("")
    setArea("")
    setIsSending(false)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "alert":
        return "bg-emergency text-white"
      case "warning":
        return "bg-yellow-500 text-black"
      case "info":
        return "bg-blue-500 text-white"
      default:
        return "bg-muted"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Broadcast Center</h1>
        <p className="text-muted-foreground">Send safety alerts to users in specific areas</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Send Broadcast */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Megaphone className="w-5 h-5" />
              New Broadcast
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Broadcast Type</Label>
              <Select value={broadcastType} onValueChange={(v: any) => setBroadcastType(v)}>
                <SelectTrigger className="border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alert">
                    <span className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-emergency" />
                      Emergency Alert
                    </span>
                  </SelectItem>
                  <SelectItem value="warning">
                    <span className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      Warning
                    </span>
                  </SelectItem>
                  <SelectItem value="info">
                    <span className="flex items-center gap-2">
                      <Radio className="w-4 h-4 text-blue-500" />
                      Information
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter broadcast title"
                className="border-border"
              />
            </div>

            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your message..."
                className="border-border min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Target Area</Label>
              <Select value={area} onValueChange={setArea}>
                <SelectTrigger className="border-border">
                  <SelectValue placeholder="Select area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users (City-wide)</SelectItem>
                  <SelectItem value="mg-road">MG Road</SelectItem>
                  <SelectItem value="koramangala">Koramangala</SelectItem>
                  <SelectItem value="whitefield">Whitefield</SelectItem>
                  <SelectItem value="electronic-city">Electronic City</SelectItem>
                  <SelectItem value="indiranagar">Indiranagar</SelectItem>
                  <SelectItem value="hsr">HSR Layout</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              className="w-full bg-emergency hover:bg-emergency/90"
              onClick={handleSend}
              disabled={isSending || !title || !message || !area}
            >
              {isSending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Broadcast
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Broadcast History */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Broadcasts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {history.map((broadcast) => (
              <div key={broadcast.id} className="p-4 rounded-lg border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <Badge className={getTypeColor(broadcast.type)}>{broadcast.type.toUpperCase()}</Badge>
                  <span className="text-xs text-muted-foreground">{broadcast.timestamp.toLocaleString()}</span>
                </div>
                <p className="font-semibold text-foreground">{broadcast.title}</p>
                <p className="text-sm text-muted-foreground">{broadcast.message}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {broadcast.area}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {broadcast.recipients.toLocaleString()} recipients
                  </span>
                  <span className="flex items-center gap-1 text-success">
                    <CheckCircle className="w-3 h-3" />
                    {broadcast.status}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
