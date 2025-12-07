"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Users, Search, MapPin, Phone, AlertTriangle, Clock, Eye, Ban, CheckCircle, Activity } from "lucide-react"

interface AppUser {
  id: string
  name: string
  email: string
  phone: string
  status: "active" | "safe" | "monitoring" | "danger" | "banned"
  trustScore: number
  totalSOS: number
  fakeCalls: number
  lastActive: Date
  location?: { address: string; lat: number; lng: number }
  emergencyContacts: number
  joinedDate: Date
}

const mockUsers: AppUser[] = [
  {
    id: "USR001",
    name: "Priya Sharma",
    email: "priya@email.com",
    phone: "+91 98765 43210",
    status: "danger",
    trustScore: 95,
    totalSOS: 3,
    fakeCalls: 0,
    lastActive: new Date(Date.now() - 2 * 60000),
    location: { address: "MG Road, Bangalore", lat: 12.9716, lng: 77.5946 },
    emergencyContacts: 4,
    joinedDate: new Date("2024-01-15"),
  },
  {
    id: "USR002",
    name: "Sneha Reddy",
    email: "sneha@email.com",
    phone: "+91 87654 32109",
    status: "monitoring",
    trustScore: 88,
    totalSOS: 2,
    fakeCalls: 0,
    lastActive: new Date(Date.now() - 10 * 60000),
    location: { address: "Koramangala, Bangalore", lat: 12.9352, lng: 77.6245 },
    emergencyContacts: 3,
    joinedDate: new Date("2024-02-20"),
  },
  {
    id: "USR003",
    name: "Ananya Nair",
    email: "ananya@email.com",
    phone: "+91 76543 21098",
    status: "safe",
    trustScore: 72,
    totalSOS: 5,
    fakeCalls: 2,
    lastActive: new Date(Date.now() - 30 * 60000),
    emergencyContacts: 2,
    joinedDate: new Date("2024-03-10"),
  },
  {
    id: "USR004",
    name: "Kavitha M",
    email: "kavitha@email.com",
    phone: "+91 65432 10987",
    status: "safe",
    trustScore: 98,
    totalSOS: 1,
    fakeCalls: 0,
    lastActive: new Date(Date.now() - 2 * 60 * 60000),
    emergencyContacts: 5,
    joinedDate: new Date("2023-11-05"),
  },
  {
    id: "USR005",
    name: "Suspicious User",
    email: "test@test.com",
    phone: "+91 12345 67890",
    status: "banned",
    trustScore: 15,
    totalSOS: 12,
    fakeCalls: 10,
    lastActive: new Date(Date.now() - 24 * 60 * 60000),
    emergencyContacts: 0,
    joinedDate: new Date("2024-06-01"),
  },
]

export default function UsersPage() {
  const [users, setUsers] = useState<AppUser[]>(mockUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [historyUser, setHistoryUser] = useState<AppUser | null>(null)

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery)
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "danger":
        return (
          <Badge variant="destructive" className="animate-pulse">
            IN DANGER
          </Badge>
        )
      case "monitoring":
        return <Badge className="bg-yellow-500 text-black">Monitoring</Badge>
      case "safe":
        return <Badge className="bg-success">Safe</Badge>
      case "active":
        return <Badge variant="secondary">Active</Badge>
      case "banned":
        return <Badge variant="destructive">Banned</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleCallUser = (user: AppUser) => {
    const a = document.createElement("a")
    a.href = `tel:${user.phone.replace(/\s/g, "")}`
    a.click()
  }

  const handleBanUser = (userId: string) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: "banned" as const } : u)))
    const speech = new SpeechSynthesisUtterance("User has been banned from the platform.")
    speechSynthesis.speak(speech)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground">Monitor and manage app users</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="pl-9 w-[200px] border-border"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-muted-foreground" />
              <span className="text-2xl font-bold text-foreground">{users.length}</span>
            </div>
            <p className="text-xs text-muted-foreground">Total Users</p>
          </CardContent>
        </Card>
        <Card className="border-emergency/50 bg-emergency/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-emergency" />
              <span className="text-2xl font-bold text-emergency">
                {users.filter((u) => u.status === "danger").length}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">In Danger</p>
          </CardContent>
        </Card>
        <Card className="border-yellow-500/50 bg-yellow-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-yellow-500" />
              <span className="text-2xl font-bold text-yellow-500">
                {users.filter((u) => u.status === "monitoring").length}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Monitoring</p>
          </CardContent>
        </Card>
        <Card className="border-success/50 bg-success/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <span className="text-2xl font-bold text-success">{users.filter((u) => u.status === "safe").length}</span>
            </div>
            <p className="text-xs text-muted-foreground">Safe</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Ban className="w-5 h-5 text-muted-foreground" />
              <span className="text-2xl font-bold text-foreground">
                {users.filter((u) => u.status === "banned").length}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Banned</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {["all", "danger", "monitoring", "safe", "banned"].map((status) => (
          <Button
            key={status}
            variant={statusFilter === status ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(status)}
            className={statusFilter === status ? "bg-emergency hover:bg-emergency/90" : "border-border"}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
        ))}
      </div>

      {/* Users List */}
      <Card className="border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-foreground">Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className={`p-4 hover:bg-muted/50 transition-colors cursor-pointer ${
                  user.status === "danger" ? "bg-emergency/5" : ""
                }`}
                onClick={() => setSelectedUser(user)}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-muted text-foreground">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{user.name}</span>
                        {getStatusBadge(user.status)}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{user.email}</span>
                        <span>{user.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-center">
                      <p className={`font-bold ${user.trustScore < 50 ? "text-orange-500" : "text-success"}`}>
                        {user.trustScore}%
                      </p>
                      <p className="text-xs text-muted-foreground">Trust</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-foreground">{user.totalSOS}</p>
                      <p className="text-xs text-muted-foreground">SOS</p>
                    </div>
                    <div className="text-center">
                      <p className={`font-bold ${user.fakeCalls > 0 ? "text-orange-500" : "text-foreground"}`}>
                        {user.fakeCalls}
                      </p>
                      <p className="text-xs text-muted-foreground">Fake</p>
                    </div>
                    <Button size="sm" variant="outline" className="border-border bg-transparent">
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Detail Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-lg">
          {selectedUser && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  User Profile
                  {getStatusBadge(selectedUser.status)}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="bg-muted text-foreground text-xl">
                      {selectedUser.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{selectedUser.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                    <p className="text-sm text-muted-foreground">{selectedUser.phone}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Trust Score</p>
                    <p
                      className={`text-2xl font-bold ${selectedUser.trustScore < 50 ? "text-orange-500" : "text-success"}`}
                    >
                      {selectedUser.trustScore}%
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Total SOS Calls</p>
                    <p className="text-2xl font-bold text-foreground">{selectedUser.totalSOS}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Fake Calls</p>
                    <p
                      className={`text-2xl font-bold ${selectedUser.fakeCalls > 0 ? "text-orange-500" : "text-foreground"}`}
                    >
                      {selectedUser.fakeCalls}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Emergency Contacts</p>
                    <p className="text-2xl font-bold text-foreground">{selectedUser.emergencyContacts}</p>
                  </div>
                </div>

                {selectedUser.location && (
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Last Known Location
                    </p>
                    <p className="text-sm font-medium text-foreground">{selectedUser.location.address}</p>
                  </div>
                )}

                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Last Active
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {Math.round((Date.now() - selectedUser.lastActive.getTime()) / 60000)} minutes ago
                  </p>
                </div>

                <div className="flex gap-2 pt-4 border-t border-border">
                  {selectedUser.status === "danger" && (
                    <Button className="flex-1 bg-red-500 hover:bg-red-600" onClick={() => handleCallUser(selectedUser)}>
                      <Phone className="w-4 h-4 mr-2" />
                      Call User
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="flex-1 border-border bg-transparent"
                    onClick={() => {
                      setHistoryUser(selectedUser)
                      setSelectedUser(null)
                    }}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View History
                  </Button>
                  {selectedUser.status !== "banned" && selectedUser.fakeCalls > 5 && (
                    <Button variant="destructive" className="flex-1" onClick={() => handleBanUser(selectedUser.id)}>
                      <Ban className="w-4 h-4 mr-2" />
                      Ban User
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* User History Dialog */}
      <Dialog open={!!historyUser} onOpenChange={() => setHistoryUser(null)}>
        <DialogContent className="max-w-lg">
          {historyUser && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  User History
                  {getStatusBadge(historyUser.status)}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="bg-muted text-foreground text-xl">
                      {historyUser.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{historyUser.name}</h3>
                    <p className="text-sm text-muted-foreground">{historyUser.email}</p>
                    <p className="text-sm text-muted-foreground">{historyUser.phone}</p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Joined Date</p>
                  <p className="text-sm font-medium text-foreground">{historyUser.joinedDate.toDateString()}</p>
                </div>

                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Emergency Contacts</p>
                  <p className="text-sm font-medium text-foreground">{historyUser.emergencyContacts}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
