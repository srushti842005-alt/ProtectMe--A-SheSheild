"use client"

import type { EvidenceFile } from "@/lib/vault-context"
import { useVault } from "@/lib/vault-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Video, Mic, ImageIcon, MapPin, MoreVertical, Download, Trash2, Share, Lock, Play } from "lucide-react"
import { cn } from "@/lib/utils"

interface EvidenceCardProps {
  file: EvidenceFile
  onPreview: (file: EvidenceFile) => void
}

const fileTypeConfig = {
  video: { icon: Video, color: "text-blue-500", bg: "bg-blue-500/10" },
  audio: { icon: Mic, color: "text-green-500", bg: "bg-green-500/10" },
  image: { icon: ImageIcon, color: "text-purple-500", bg: "bg-purple-500/10" },
  location: { icon: MapPin, color: "text-orange-500", bg: "bg-orange-500/10" },
}

export function EvidenceCard({ file, onPreview }: EvidenceCardProps) {
  const { deleteFile } = useVault()
  const config = fileTypeConfig[file.type]
  const Icon = config.icon

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

  const handleDownload = () => {
    if (file.blobUrl) {
      const a = document.createElement("a")
      a.href = file.blobUrl
      a.download = file.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } else {
      alert(`Downloading ${file.name}...\n\nIn production, this would download your encrypted evidence file.`)
    }
  }

  const handleShare = async () => {
    if (navigator.share && file.blobUrl) {
      try {
        const response = await fetch(file.blobUrl)
        const blob = await response.blob()
        const shareFile = new File([blob], file.name, { type: file.mimeType || "application/octet-stream" })
        await navigator.share({
          title: `Evidence: ${file.name}`,
          text: `ProtectMe SOS Evidence - ${formatDate(file.createdAt)}`,
          files: [shareFile],
        })
      } catch (e) {
        // Fallback
        await navigator.clipboard.writeText(`Evidence: ${file.name}\nRecorded: ${formatDate(file.createdAt)}`)
        alert("Evidence info copied to clipboard")
      }
    } else {
      await navigator.clipboard.writeText(`Evidence: ${file.name}\nRecorded: ${formatDate(file.createdAt)}`)
      alert("Evidence info copied to clipboard for sharing")
    }
  }

  return (
    <div className="group relative p-4 rounded-xl bg-card border border-border hover:border-muted-foreground/30 transition-colors">
      {/* Thumbnail/Preview Area */}
      <button
        onClick={() => onPreview(file)}
        className="w-full aspect-video rounded-lg bg-secondary/50 flex items-center justify-center mb-3 relative overflow-hidden group/preview"
      >
        <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", config.bg)}>
          <Icon className={cn("w-6 h-6", config.color)} />
        </div>

        {/* Play overlay for video/audio */}
        {(file.type === "video" || file.type === "audio") && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center opacity-0 group-hover/preview:opacity-100 transition-opacity">
            <div className="w-12 h-12 rounded-full bg-foreground/90 flex items-center justify-center">
              <Play className="w-5 h-5 text-background ml-0.5" />
            </div>
          </div>
        )}

        {/* Duration badge */}
        {file.duration && (
          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-background/80 text-xs text-foreground">
            {file.duration}
          </div>
        )}

        {file.blobUrl && (
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-success/80 text-xs text-white">
            Live Recording
          </div>
        )}
      </button>

      {/* File Info */}
      <div className="space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-medium text-foreground truncate flex-1">{file.name}</h3>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border">
              <DropdownMenuItem onClick={() => onPreview(file)} className="cursor-pointer">
                <Play className="w-4 h-4 mr-2" />
                Preview
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownload} className="cursor-pointer">
                <Download className="w-4 h-4 mr-2" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleShare} className="cursor-pointer">
                <Share className="w-4 h-4 mr-2" />
                Share with Authorities
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem
                onClick={() => deleteFile(file.id)}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>{file.size}</span>
          <span>{formatDate(file.createdAt)}</span>
        </div>

        {file.isEncrypted && (
          <div className="flex items-center gap-1 text-xs text-success">
            <Lock className="w-3 h-3" />
            <span>Encrypted</span>
          </div>
        )}
      </div>
    </div>
  )
}
