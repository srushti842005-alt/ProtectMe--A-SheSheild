"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, Loader2, MapPin, Camera } from "lucide-react"

interface ReportIncidentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const incidentCategories = [
  { value: "theft", label: "Theft/Robbery" },
  { value: "assault", label: "Assault/Violence" },
  { value: "suspicious", label: "Suspicious Activity" },
  { value: "accident", label: "Traffic Accident" },
  { value: "harassment", label: "Harassment" },
  { value: "other", label: "Other" },
]

export function ReportIncidentDialog({ open, onOpenChange }: ReportIncidentDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    type: "",
    title: "",
    description: "",
    location: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsLoading(false)
    onOpenChange(false)
    setFormData({ type: "", title: "", description: "", location: "" })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-emergency" />
            Report an Incident
          </DialogTitle>
          <DialogDescription>Help keep your community safe by reporting incidents in your area.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-foreground">Incident Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <SelectTrigger className="bg-secondary border-border text-foreground">
                <SelectValue placeholder="Select incident type" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {incidentCategories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Title</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Brief title for the incident"
              required
              className="bg-secondary border-border text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what happened..."
              rows={3}
              className="bg-secondary border-border text-foreground resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Location</Label>
            <div className="relative">
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Address or location description"
                className="bg-secondary border-border text-foreground pr-10"
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              >
                <MapPin className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Or we can use your current location</p>
          </div>

          <div className="p-4 rounded-xl border border-dashed border-border bg-secondary/30 text-center">
            <Camera className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Add photos (optional)</p>
            <Button type="button" variant="ghost" size="sm" className="mt-2 text-emergency">
              Upload Image
            </Button>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-border text-foreground bg-transparent"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-emergency hover:bg-emergency/90 text-emergency-foreground"
              disabled={isLoading || !formData.type || !formData.title}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Report"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
