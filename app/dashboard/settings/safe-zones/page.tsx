"use client"

import { useState } from "react"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useSafetyTriggers } from "@/lib/safety-triggers-context"
import { MapPin, Plus, Trash2, Home, Briefcase, Shield, Navigation, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SafeZonesPage() {
  const { safeZones, addSafeZone, removeSafeZone, geofenceAlerts, setGeofenceAlerts } = useSafetyTriggers()
  const [isAddingZone, setIsAddingZone] = useState(false)
  const [isLocating, setIsLocating] = useState(false)
  const [newZone, setNewZone] = useState({
    name: "",
    lat: 0,
    lng: 0,
    radius: 100,
    type: "custom" as "home" | "work" | "safe" | "custom",
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "home":
        return <Home className="w-4 h-4" />
      case "work":
        return <Briefcase className="w-4 h-4" />
      case "safe":
        return <Shield className="w-4 h-4" />
      default:
        return <MapPin className="w-4 h-4" />
    }
  }

  const useCurrentLocation = () => {
    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setNewZone((prev) => ({
          ...prev,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }))
        setIsLocating(false)
      },
      () => {
        setIsLocating(false)
        alert("Could not get your location")
      },
      { enableHighAccuracy: true },
    )
  }

  const handleAddZone = () => {
    if (newZone.name && newZone.lat && newZone.lng) {
      addSafeZone(newZone)
      setNewZone({ name: "", lat: 0, lng: 0, radius: 100, type: "custom" })
      setIsAddingZone(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-foreground">Safe Zones</h1>
            <p className="text-muted-foreground">Configure geofencing alerts for your safety</p>
          </div>

          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-foreground">Geofence Alerts</CardTitle>
                  <CardDescription>Get notified when entering/leaving safe zones</CardDescription>
                </div>
                <Switch checked={geofenceAlerts} onCheckedChange={setGeofenceAlerts} />
              </div>
            </CardHeader>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-foreground">Your Safe Zones</CardTitle>
                <Dialog open={isAddingZone} onOpenChange={setIsAddingZone}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-emergency hover:bg-emergency/90">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Zone
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card border-border">
                    <DialogHeader>
                      <DialogTitle className="text-foreground">Add Safe Zone</DialogTitle>
                      <DialogDescription>Create a new geofenced safe zone</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label className="text-foreground">Zone Name</Label>
                        <Input
                          value={newZone.name}
                          onChange={(e) => setNewZone({ ...newZone, name: e.target.value })}
                          placeholder="e.g., My Home, Office"
                          className="bg-secondary border-border text-foreground"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-foreground">Zone Type</Label>
                        <Select
                          value={newZone.type}
                          onValueChange={(value: "home" | "work" | "safe" | "custom") =>
                            setNewZone({ ...newZone, type: value })
                          }
                        >
                          <SelectTrigger className="bg-secondary border-border text-foreground">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border">
                            <SelectItem value="home">Home</SelectItem>
                            <SelectItem value="work">Work</SelectItem>
                            <SelectItem value="safe">Safe Place</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-foreground">Location</Label>
                        <Button
                          variant="outline"
                          className="w-full border-border bg-transparent"
                          onClick={useCurrentLocation}
                          disabled={isLocating}
                        >
                          {isLocating ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Navigation className="w-4 h-4 mr-2" />
                          )}
                          Use Current Location
                        </Button>
                        {newZone.lat !== 0 && (
                          <p className="text-xs text-emerald-500">
                            Location set: {newZone.lat.toFixed(4)}, {newZone.lng.toFixed(4)}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-foreground">Radius: {newZone.radius}m</Label>
                        <input
                          type="range"
                          min="50"
                          max="500"
                          step="25"
                          value={newZone.radius}
                          onChange={(e) => setNewZone({ ...newZone, radius: Number.parseInt(e.target.value) })}
                          className="w-full"
                        />
                      </div>

                      <Button
                        className="w-full bg-emergency hover:bg-emergency/90"
                        onClick={handleAddZone}
                        disabled={!newZone.name || newZone.lat === 0}
                      >
                        Add Safe Zone
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {safeZones.length === 0 ? (
                <div className="text-center py-8">
                  <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No safe zones configured</p>
                  <p className="text-sm text-muted-foreground">Add your home, work, or other safe places</p>
                </div>
              ) : (
                safeZones.map((zone) => (
                  <div
                    key={zone.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2 rounded-lg ${
                          zone.type === "home"
                            ? "bg-blue-500/20 text-blue-500"
                            : zone.type === "work"
                              ? "bg-purple-500/20 text-purple-500"
                              : zone.type === "safe"
                                ? "bg-emerald-500/20 text-emerald-500"
                                : "bg-gray-500/20 text-gray-500"
                        }`}
                      >
                        {getTypeIcon(zone.type)}
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{zone.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {zone.radius}m radius •{" "}
                          {zone.lat === 0 ? "Location not set" : `${zone.lat.toFixed(4)}, ${zone.lng.toFixed(4)}`}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                      onClick={() => removeSafeZone(zone.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <p className="text-sm text-blue-400">
              <strong>How it works:</strong> When geofence alerts are enabled, you'll receive notifications if you leave
              all your safe zones unexpectedly. This helps your contacts know if something might be wrong.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
