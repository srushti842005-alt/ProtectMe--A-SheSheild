"use client"

import { useState } from "react"
import type { EvidenceFile } from "@/lib/vault-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Video, Mic, ImageIcon, MapPin, Download, Share, Clock, Lock, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface FilePreviewDialogProps {
  file: EvidenceFile | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const fileTypeConfig = {
  video: { icon: Video, color: "text-blue-500", bg: "bg-blue-500/10", label: "Video Recording" },
  audio: { icon: Mic, color: "text-green-500", bg: "bg-green-500/10", label: "Audio Recording" },
  image: { icon: ImageIcon, color: "text-purple-500", bg: "bg-purple-500/10", label: "Screenshot" },
  location: { icon: MapPin, color: "text-orange-500", bg: "bg-orange-500/10", label: "Location Log" },
}

export function FilePreviewDialog({ file, open, onOpenChange }: FilePreviewDialogProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [shareStatus, setShareStatus] = useState<"idle" | "sharing" | "shared">("idle")

  if (!file) return null

  const config = fileTypeConfig[file.type]
  const Icon = config.icon

  const formatDate = (date: Date) => {
    const d = new Date(date)
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleDownload = () => {
    if (file.blobUrl) {
      const a = document.createElement("a")
      a.href = file.blobUrl
      a.download = file.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } else {
      // For demo files without blob, create a placeholder
      alert(`Downloading ${file.name}...\n\nIn production, this would download your encrypted evidence file.`)
    }
  }

  const handleShare = async () => {
    setShareStatus("sharing")

    // Simulate sharing process
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (navigator.share && file.blobUrl) {
      try {
        const response = await fetch(file.blobUrl)
        const blob = await response.blob()
        const shareFile = new File([blob], file.name, { type: file.mimeType || "application/octet-stream" })

        await navigator.share({
          title: `Evidence: ${file.name}`,
          text: `ProtectMe SOS Evidence File\nRecorded: ${formatDate(file.createdAt)}${file.location ? `\nLocation: ${file.location.lat.toFixed(4)}, ${file.location.lng.toFixed(4)}` : ""}`,
          files: [shareFile],
        })
      } catch (e) {
        console.log("[v0] Share cancelled or failed")
      }
    } else {
      // Fallback: copy info to clipboard
      const info = `ProtectMe SOS Evidence\nFile: ${file.name}\nRecorded: ${formatDate(file.createdAt)}${file.location ? `\nLocation: ${file.location.lat.toFixed(4)}, ${file.location.lng.toFixed(4)}` : ""}\n\nThis evidence has been shared for official review.`
      await navigator.clipboard.writeText(info)
      alert("Evidence information copied to clipboard.\nYou can now share it with authorities via email or messaging.")
    }

    setShareStatus("shared")
    setTimeout(() => setShareStatus("idle"), 3000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", config.bg)}>
              <Icon className={cn("w-4 h-4", config.color)} />
            </div>
            {config.label}
          </DialogTitle>
        </DialogHeader>

        {/* Preview Area - Now with real playback */}
        <div className="aspect-video rounded-xl bg-secondary/50 flex items-center justify-center overflow-hidden">
          {file.blobUrl && file.type === "video" ? (
            <video
              src={file.blobUrl}
              controls
              className="w-full h-full object-contain"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          ) : file.blobUrl && file.type === "audio" ? (
            <div className="text-center space-y-4 p-6 w-full">
              <div className={cn("w-20 h-20 rounded-full flex items-center justify-center mx-auto", config.bg)}>
                <Icon className={cn("w-10 h-10", config.color)} />
              </div>
              <p className="text-foreground font-medium">{file.name}</p>
              <audio
                src={file.blobUrl}
                controls
                className="w-full max-w-md mx-auto"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            </div>
          ) : (
            // Fallback for files without blob URL
            <div className="text-center space-y-4">
              <div className={cn("w-20 h-20 rounded-full flex items-center justify-center mx-auto", config.bg)}>
                <Icon className={cn("w-10 h-10", config.color)} />
              </div>
              <div>
                <p className="text-foreground font-medium">{file.name}</p>
                {file.duration && (
                  <p className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    {file.duration}
                  </p>
                )}
              </div>
              <p className="text-sm text-muted-foreground">This is a demo file. Record new evidence to play it back.</p>
            </div>
          )}
        </div>

        {/* File Details */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-secondary/50">
              <p className="text-xs text-muted-foreground mb-1">File Size</p>
              <p className="text-sm font-medium text-foreground">{file.size}</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/50">
              <p className="text-xs text-muted-foreground mb-1">Created</p>
              <p className="text-sm font-medium text-foreground">{formatDate(file.createdAt)}</p>
            </div>
          </div>

          {file.location && (
            <div className="p-3 rounded-lg bg-secondary/50">
              <p className="text-xs text-muted-foreground mb-1">Location at capture</p>
              <p className="text-sm font-medium text-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {file.location.lat.toFixed(6)}, {file.location.lng.toFixed(6)}
              </p>
            </div>
          )}

          {file.isEncrypted && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-success/10 border border-success/20">
              <Lock className="w-4 h-4 text-success" />
              <div>
                <p className="text-sm font-medium text-success">End-to-end Encrypted</p>
                <p className="text-xs text-muted-foreground">This file is protected and can only be accessed by you</p>
              </div>
            </div>
          )}
        </div>

        {/* Actions - Now functional */}
        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            className="flex-1 border-border text-foreground bg-transparent"
            onClick={handleDownload}
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button
            className={cn(
              "flex-1",
              shareStatus === "shared"
                ? "bg-success hover:bg-success/90 text-success-foreground"
                : "bg-emergency hover:bg-emergency/90 text-emergency-foreground",
            )}
            onClick={handleShare}
            disabled={shareStatus === "sharing"}
          >
            {shareStatus === "sharing" ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Sharing...
              </>
            ) : shareStatus === "shared" ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Shared
              </>
            ) : (
              <>
                <Share className="w-4 h-4 mr-2" />
                Share with Authorities
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
