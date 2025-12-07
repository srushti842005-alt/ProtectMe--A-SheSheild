"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area,
} from "recharts"
import { AlertTriangle, Users, MapPin, TrendingUp, Clock, Shield, Activity } from "lucide-react"
import { useRouter } from "next/navigation"

// Mock data for analytics
const hourlyIncidents = [
  { hour: "00:00", incidents: 2, resolved: 2 },
  { hour: "04:00", incidents: 1, resolved: 1 },
  { hour: "08:00", incidents: 5, resolved: 4 },
  { hour: "12:00", incidents: 8, resolved: 7 },
  { hour: "16:00", incidents: 12, resolved: 10 },
  { hour: "20:00", incidents: 15, resolved: 12 },
  { hour: "Now", incidents: 8, resolved: 5 },
]

const incidentTypes = [
  { name: "SOS Alerts", value: 45, color: "#ef4444" },
  { name: "Panic Button", value: 25, color: "#f97316" },
  { name: "Suspicious Activity", value: 20, color: "#eab308" },
  { name: "Fake Calls", value: 10, color: "#6b7280" },
]

const weeklyTrend = [
  { day: "Mon", incidents: 23, responseTime: 4.2 },
  { day: "Tue", incidents: 28, responseTime: 3.8 },
  { day: "Wed", incidents: 19, responseTime: 4.5 },
  { day: "Thu", incidents: 32, responseTime: 3.5 },
  { day: "Fri", incidents: 38, responseTime: 4.0 },
  { day: "Sat", incidents: 45, responseTime: 4.8 },
  { day: "Sun", incidents: 35, responseTime: 4.3 },
]

const dangerZones = [
  { area: "MG Road", level: "high", incidents: 12, people: 45 },
  { area: "Koramangala", level: "medium", incidents: 8, people: 32 },
  { area: "Whitefield", level: "high", incidents: 15, people: 28 },
  { area: "Electronic City", level: "low", incidents: 3, people: 18 },
  { area: "Indiranagar", level: "medium", incidents: 6, people: 22 },
  { area: "Jayanagar", level: "low", incidents: 2, people: 15 },
]

const realtimePeopleData = [
  { time: "5m ago", safe: 12453, danger: 45, monitoring: 234 },
  { time: "4m ago", safe: 12448, danger: 48, monitoring: 238 },
  { time: "3m ago", safe: 12445, danger: 52, monitoring: 241 },
  { time: "2m ago", safe: 12440, danger: 55, monitoring: 245 },
  { time: "1m ago", safe: 12435, danger: 58, monitoring: 248 },
  { time: "Now", safe: 12430, danger: 62, monitoring: 252 },
]

export default function AnalyticsPage() {
  const router = useRouter()
  const [timeRange, setTimeRange] = useState("today")
  const [liveStats, setLiveStats] = useState({
    peopleInDanger: 5,
    peopleMonitored: 248,
    safeUsers: 12430,
    activeOfficers: 45,
  })

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setLiveStats((prev) => ({
        peopleInDanger: prev.peopleInDanger + Math.floor(Math.random() * 3) - 1,
        peopleMonitored: prev.peopleMonitored + Math.floor(Math.random() * 5) - 2,
        safeUsers: prev.safeUsers + Math.floor(Math.random() * 10) - 5,
        activeOfficers: 45 + Math.floor(Math.random() * 5),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleDeployOfficers = (area: string) => {
    const speech = new SpeechSynthesisUtterance(
      `Deploying officers to ${area}. 3 patrol units have been notified and are en route.`,
    )
    speechSynthesis.speak(speech)

    // Navigate to broadcast to send area alert
    router.push(`/admin/broadcast?area=${encodeURIComponent(area)}&type=alert`)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Real-time safety analytics and insights</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[150px] border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Real-time People Status */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-emergency/50 bg-emergency/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-emergency" />
              <span className="text-sm text-muted-foreground">People in Danger</span>
            </div>
            <p className="text-3xl font-bold text-emergency">{liveStats.peopleInDanger}</p>
            <p className="text-xs text-emergency mt-1">Requires immediate attention</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-500/50 bg-yellow-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-yellow-500" />
              <span className="text-sm text-muted-foreground">Being Monitored</span>
            </div>
            <p className="text-3xl font-bold text-yellow-500">{liveStats.peopleMonitored}</p>
            <p className="text-xs text-yellow-600 mt-1">Active location sharing</p>
          </CardContent>
        </Card>

        <Card className="border-success/50 bg-success/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-success" />
              <span className="text-sm text-muted-foreground">Safe Users</span>
            </div>
            <p className="text-3xl font-bold text-success">{liveStats.safeUsers.toLocaleString()}</p>
            <p className="text-xs text-success mt-1">No active alerts</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Active Officers</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{liveStats.activeOfficers}</p>
            <p className="text-xs text-muted-foreground mt-1">On patrol duty</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Hourly Incidents */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Incidents by Hour
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={hourlyIncidents}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="hour" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
                  labelStyle={{ color: "#fff" }}
                />
                <Bar dataKey="incidents" fill="#ef4444" name="Incidents" />
                <Bar dataKey="resolved" fill="#22c55e" name="Resolved" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Incident Types */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Incident Types Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={incidentTypes}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {incidentTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {incidentTypes.map((type, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }} />
                  <span className="text-xs text-muted-foreground">
                    {type.name} ({type.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time People Tracking */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Real-time User Safety Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={realtimePeopleData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="time" stroke="#888" fontSize={12} />
              <YAxis stroke="#888" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }} />
              <Legend />
              <Area type="monotone" dataKey="danger" stackId="1" stroke="#ef4444" fill="#ef4444" name="In Danger" />
              <Area
                type="monotone"
                dataKey="monitoring"
                stackId="1"
                stroke="#eab308"
                fill="#eab308"
                name="Monitoring"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Danger Zones */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-500" />
            Danger Zones - Alert Required
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dangerZones.map((zone, i) => (
              <div
                key={i}
                className={`p-4 rounded-lg border ${
                  zone.level === "high"
                    ? "border-red-500/50 bg-red-500/5"
                    : zone.level === "medium"
                      ? "border-yellow-500/50 bg-yellow-500/5"
                      : "border-border bg-muted/50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-foreground">{zone.area}</span>
                  <Badge
                    variant={zone.level === "high" ? "destructive" : zone.level === "medium" ? "default" : "secondary"}
                    className={zone.level === "medium" ? "bg-yellow-500 text-black" : ""}
                  >
                    {zone.level.toUpperCase()}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>{zone.incidents} incidents reported</p>
                  <p>{zone.people} people in this area</p>
                </div>
                {zone.level === "high" && (
                  <Button
                    size="sm"
                    className="w-full mt-3 bg-red-500 hover:bg-red-600"
                    onClick={() => handleDeployOfficers(zone.area)}
                  >
                    Deploy Officers
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Trend */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Weekly Incident Trend & Response Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="day" stroke="#888" fontSize={12} />
              <YAxis yAxisId="left" stroke="#888" fontSize={12} />
              <YAxis yAxisId="right" orientation="right" stroke="#888" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }} />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="incidents"
                stroke="#ef4444"
                name="Incidents"
                strokeWidth={2}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="responseTime"
                stroke="#22c55e"
                name="Avg Response (min)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
