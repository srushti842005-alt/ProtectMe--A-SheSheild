"use client"

import { useAuth } from "@/lib/auth-context"
import type { EvidenceFile, SOSEvent } from "@/lib/vault-context"
import { useVault } from "@/lib/vault-context"
import { redirect } from "next/navigation"
import { useEffect, useState } from "react"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { EvidenceCard } from "@/components/vault/evidence-card"
import { SOSEventCard } from "@/components/vault/sos-event-card"
import { FilePreviewDialog } from "@/components/vault/file-preview-dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  FolderLock,
  Search,
  Shield,
  Video,
  Mic,
  ImageIcon,
  MapPin,
  HardDrive,
  ArrowLeft,
  Square,
  Circle,
} from "lucide-react"

export default function VaultPage() {
  const { user, isLoading: authLoading } = useAuth()
  const { files, events, getEventFiles, isRecording, recordingType, startRecording, stopRecording, recordingDuration } =
    useVault()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEvent, setSelectedEvent] = useState<SOSEvent | null>(null)
  const [previewFile, setPreviewFile] = useState<EvidenceFile | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [recordingError, setRecordingError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      redirect("/login")
    }
  }, [user, authLoading])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleStartRecording = async (type: "video" | "audio") => {
    try {
      setRecordingError(null)
      await startRecording(type)
    } catch (error) {
      setRecordingError(`Could not access ${type === "video" ? "camera" : "microphone"}. Please grant permission.`)
    }
  }

  const handleStopRecording = async () => {
    const file = await stopRecording()
    if (file) {
      setPreviewFile(file)
    }
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emergency border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const filterFiles = (fileList: EvidenceFile[]) => {
    let filtered = fileList

    if (searchQuery) {
      filtered = filtered.filter((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    if (activeTab !== "all") {
      filtered = filtered.filter((f) => f.type === activeTab)
    }

    return filtered
  }

  const displayFiles = selectedEvent ? filterFiles(getEventFiles(selectedEvent.id)) : filterFiles(files)

  const videoCount = files.filter((f) => f.type === "video").length
  const audioCount = files.filter((f) => f.type === "audio").length
  const imageCount = files.filter((f) => f.type === "image").length
  const locationCount = files.filter((f) => f.type === "location").length

  const totalSize =
    files.length > 0
      ? (() => {
          let totalKB = 0
          files.forEach((f) => {
            const sizeStr = f.size
            if (sizeStr.includes("MB")) {
              totalKB += Number.parseFloat(sizeStr) * 1024
            } else if (sizeStr.includes("KB")) {
              totalKB += Number.parseFloat(sizeStr)
            }
          })
          return totalKB > 1024 ? `${(totalKB / 1024).toFixed(1)} MB` : `${Math.round(totalKB)} KB`
        })()
      : "0 KB"

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              {selectedEvent && (
                <Button variant="ghost" size="icon" onClick={() => setSelectedEvent(null)} className="mr-2">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              )}
              <div className="w-10 h-10 rounded-xl bg-emergency/10 flex items-center justify-center">
                <FolderLock className="w-5 h-5 text-emergency" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {selectedEvent ? "SOS Event Files" : "Evidence Vault"}
                </h1>
                <p className="text-muted-foreground text-sm">
                  {selectedEvent
                    ? `${displayFiles.length} files from this event`
                    : "Secure, encrypted storage for all evidence"}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              {isRecording ? (
                <Button
                  onClick={handleStopRecording}
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground animate-pulse"
                >
                  <Square className="w-4 h-4 mr-2 fill-current" />
                  Stop Recording ({formatDuration(recordingDuration)})
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => handleStartRecording("video")}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Record Video
                  </Button>
                  <Button
                    onClick={() => handleStartRecording("audio")}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Mic className="w-4 h-4 mr-2" />
                    Record Audio
                  </Button>
                </>
              )}
            </div>
          </div>

          {isRecording && (
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-4">
              <div className="relative">
                <Circle className="w-4 h-4 text-destructive fill-destructive animate-pulse" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-destructive">
                  Recording {recordingType === "video" ? "Video" : "Audio"}...
                </p>
                <p className="text-sm text-muted-foreground">
                  Duration: {formatDuration(recordingDuration)} | Your {recordingType} is being captured
                </p>
              </div>
              <Button onClick={handleStopRecording} variant="destructive" size="sm">
                <Square className="w-3 h-3 mr-1 fill-current" />
                Stop
              </Button>
            </div>
          )}

          {recordingError && (
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
              <p className="text-destructive">{recordingError}</p>
            </div>
          )}

          {/* Stats */}
          {!selectedEvent && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="p-4 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <HardDrive className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Total</span>
                </div>
                <p className="text-lg font-bold text-foreground">{files.length} files</p>
                <p className="text-xs text-muted-foreground">{totalSize}</p>
              </div>
              <div className="p-4 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Video className="w-4 h-4 text-blue-500" />
                  <span className="text-xs text-muted-foreground">Videos</span>
                </div>
                <p className="text-lg font-bold text-foreground">{videoCount}</p>
              </div>
              <div className="p-4 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Mic className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-muted-foreground">Audio</span>
                </div>
                <p className="text-lg font-bold text-foreground">{audioCount}</p>
              </div>
              <div className="p-4 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <ImageIcon className="w-4 h-4 text-purple-500" />
                  <span className="text-xs text-muted-foreground">Images</span>
                </div>
                <p className="text-lg font-bold text-foreground">{imageCount}</p>
              </div>
              <div className="p-4 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-orange-500" />
                  <span className="text-xs text-muted-foreground">Locations</span>
                </div>
                <p className="text-lg font-bold text-foreground">{locationCount}</p>
              </div>
            </div>
          )}

          {/* SOS Events Section */}
          {!selectedEvent && events.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Shield className="w-5 h-5 text-emergency" />
                SOS Events
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {events.map((event) => (
                  <SOSEventCard
                    key={event.id}
                    event={event}
                    files={getEventFiles(event.id)}
                    onClick={() => setSelectedEvent(event)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Files Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-lg font-semibold text-foreground">
                {selectedEvent ? "Event Files" : "All Evidence"}
              </h2>

              <div className="flex items-center gap-3">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search files..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-card border-border text-foreground"
                  />
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-secondary">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="video">Videos</TabsTrigger>
                <TabsTrigger value="audio">Audio</TabsTrigger>
                <TabsTrigger value="image">Images</TabsTrigger>
                <TabsTrigger value="location">Locations</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-4">
                {displayFiles.length === 0 ? (
                  <div className="text-center py-12">
                    <FolderLock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No files found</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchQuery
                        ? "Try a different search term"
                        : "Record video or audio evidence using the buttons above"}
                    </p>
                    {!searchQuery && (
                      <div className="flex justify-center gap-2">
                        <Button
                          onClick={() => handleStartRecording("video")}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Video className="w-4 h-4 mr-2" />
                          Record Video
                        </Button>
                        <Button
                          onClick={() => handleStartRecording("audio")}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Mic className="w-4 h-4 mr-2" />
                          Record Audio
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayFiles.map((file) => (
                      <EvidenceCard key={file.id} file={file} onPreview={setPreviewFile} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Encryption Notice */}
          <div className="p-4 rounded-xl bg-success/10 border border-success/20 flex items-start gap-3">
            <FolderLock className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-success">Your vault is protected</p>
              <p className="text-sm text-muted-foreground">
                All files are end-to-end encrypted with AES-256. Only you can access your evidence with biometric or PIN
                authentication.
              </p>
            </div>
          </div>
        </div>
      </main>

      <FilePreviewDialog file={previewFile} open={!!previewFile} onOpenChange={() => setPreviewFile(null)} />
    </div>
  )
}
