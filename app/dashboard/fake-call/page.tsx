"use client"

import { useState } from "react"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FakeCallOverlay } from "@/components/fake-call/fake-call-overlay"
import { Phone, Clock, User, Play, Plus, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FakeCallPreset {
  id: string
  name: string
  number: string
  delay: number
}

export default function FakeCallPage() {
  const [showFakeCall, setShowFakeCall] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState<FakeCallPreset | null>(null)
  const [presets, setPresets] = useState<FakeCallPreset[]>([
    { id: "1", name: "Mom", number: "+91 78136 80539", delay: 0 },
    { id: "2", name: "Dad", number: "+91 97415 89059", delay: 0 },
    { id: "3", name: "Boss", number: "+91 98765 43210", delay: 0 },
  ])
  const [newPreset, setNewPreset] = useState({ name: "", number: "", delay: "0" })
  const [callDelay, setCallDelay] = useState(0)
  const [countdown, setCountdown] = useState<number | null>(null)

  const triggerFakeCall = (preset?: FakeCallPreset) => {
    const delay = preset?.delay ?? callDelay

    if (delay > 0) {
      setCountdown(delay)
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(interval)
            setSelectedPreset(preset || null)
            setShowFakeCall(true)
            return null
          }
          return prev - 1
        })
      }, 1000)
    } else {
      setSelectedPreset(preset || null)
      setShowFakeCall(true)
    }
  }

  const addPreset = () => {
    if (newPreset.name && newPreset.number) {
      setPresets([
        ...presets,
        {
          id: Date.now().toString(),
          name: newPreset.name,
          number: newPreset.number,
          delay: Number.parseInt(newPreset.delay),
        },
      ])
      setNewPreset({ name: "", number: "", delay: "0" })
    }
  }

  const removePreset = (id: string) => {
    setPresets(presets.filter((p) => p.id !== id))
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-foreground">Fake Call</h1>
            <p className="text-muted-foreground">Create an excuse to leave uncomfortable situations</p>
          </div>

          {/* Countdown overlay */}
          {countdown !== null && (
            <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground mb-2">Incoming call in...</p>
                <p className="text-6xl font-bold text-white">{countdown}</p>
                <Button
                  variant="outline"
                  className="mt-6 border-border bg-transparent"
                  onClick={() => setCountdown(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Quick Trigger */}
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Phone className="w-10 h-10 text-emerald-500" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Instant Fake Call</h2>
                  <p className="text-sm text-muted-foreground">Tap to receive a fake incoming call immediately</p>
                </div>
                <Button
                  size="lg"
                  className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 text-white"
                  onClick={() => triggerFakeCall()}
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Trigger Fake Call Now
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Delayed Call */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Delayed Call
              </CardTitle>
              <CardDescription>Schedule a fake call after a delay</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-foreground">Call delay</Label>
                <Select value={callDelay.toString()} onValueChange={(v) => setCallDelay(Number.parseInt(v))}>
                  <SelectTrigger className="bg-secondary border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="0">Immediate</SelectItem>
                    <SelectItem value="10">10 seconds</SelectItem>
                    <SelectItem value="30">30 seconds</SelectItem>
                    <SelectItem value="60">1 minute</SelectItem>
                    <SelectItem value="120">2 minutes</SelectItem>
                    <SelectItem value="300">5 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white" onClick={() => triggerFakeCall()}>
                <Clock className="w-4 h-4 mr-2" />
                Schedule Call ({callDelay === 0 ? "Now" : `${callDelay}s`})
              </Button>
            </CardContent>
          </Card>

          {/* Preset Callers */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <User className="w-5 h-5" />
                Caller Presets
              </CardTitle>
              <CardDescription>Quick access to common fake callers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {presets.map((preset) => (
                <div
                  key={preset.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <span className="text-emerald-500 font-medium">{preset.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm">{preset.name}</p>
                    <p className="text-xs text-muted-foreground">{preset.number}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10"
                    onClick={() => triggerFakeCall(preset)}
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                    onClick={() => removePreset(preset.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              {/* Add new preset */}
              <div className="pt-4 border-t border-border space-y-3">
                <p className="text-sm font-medium text-foreground">Add New Caller</p>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Name"
                    value={newPreset.name}
                    onChange={(e) => setNewPreset({ ...newPreset, name: e.target.value })}
                    className="bg-secondary border-border text-foreground"
                  />
                  <Input
                    placeholder="Phone number"
                    value={newPreset.number}
                    onChange={(e) => setNewPreset({ ...newPreset, number: e.target.value })}
                    className="bg-secondary border-border text-foreground"
                  />
                </div>
                <Button
                  variant="outline"
                  className="w-full border-border bg-transparent"
                  onClick={addPreset}
                  disabled={!newPreset.name || !newPreset.number}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Caller
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-sm text-emerald-400">
              <strong>Tip:</strong> Use the fake call feature to safely exit uncomfortable situations like unwanted
              conversations, unsafe meetings, or when you feel threatened. The call looks completely real!
            </p>
          </div>
        </div>
      </main>

      <FakeCallOverlay
        isOpen={showFakeCall}
        onClose={() => setShowFakeCall(false)}
        callerName={selectedPreset?.name}
        callerNumber={selectedPreset?.number}
      />
    </div>
  )
}
