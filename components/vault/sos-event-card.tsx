"use client"

import type { SOSEvent, EvidenceFile } from "@/lib/vault-context"
import { Clock, MapPin, Users, ChevronRight, Shield, Video, Mic, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface SOSEventCardProps {
  event: SOSEvent
  files: EvidenceFile[]
  onClick: () => void
}

const statusConfig = {
  active: { label: "Active", color: "bg-destructive text-destructive-foreground" },
  resolved: { label: "Resolved", color: "bg-success/20 text-success" },
  false_alarm: { label: "False Alarm", color: "bg-muted text-muted-foreground" },
}

export function SOSEventCard({ event, files, onClick }: SOSEventCardProps) {
  const formatDate = (date: Date) => {
    const d = new Date(date)
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const videoCount = files.filter((f) => f.type === "video").length
  const audioCount = files.filter((f) => f.type === "audio").length
  const imageCount = files.filter((f) => f.type === "image").length

  return (
    <button
      onClick={onClick}
      className="w-full p-4 rounded-xl bg-card border border-border hover:border-emergency/30 transition-colors text-left group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emergency/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-emergency" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">SOS Event</h3>
            <p className="text-xs text-muted-foreground">{formatDate(event.timestamp)}</p>
          </div>
        </div>
        <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", statusConfig[event.status].color)}>
          {statusConfig[event.status].label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>Duration: {formatDuration(event.duration)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>{event.contactsNotified.length} notified</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
        <MapPin className="w-4 h-4 flex-shrink-0" />
        <span className="truncate">{event.location.address}</span>
      </div>

      {/* File counts */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-3">
          {videoCount > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Video className="w-3 h-3" />
              <span>{videoCount}</span>
            </div>
          )}
          {audioCount > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Mic className="w-3 h-3" />
              <span>{audioCount}</span>
            </div>
          )}
          {imageCount > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <ImageIcon className="w-3 h-3" />
              <span>{imageCount}</span>
            </div>
          )}
          <span className="text-xs text-muted-foreground">{files.length} files total</span>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
      </div>
    </button>
  )
}
