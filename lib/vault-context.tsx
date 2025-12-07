"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useRef } from "react"

export interface EvidenceFile {
  id: string
  type: "video" | "audio" | "image" | "location"
  name: string
  size: string
  duration?: string
  thumbnail?: string
  createdAt: Date
  sosEventId?: string
  isEncrypted: boolean
  location?: { lat: number; lng: number }
  blobUrl?: string
  mimeType?: string
}

export interface SOSEvent {
  id: string
  timestamp: Date
  duration: number
  status: "active" | "resolved" | "false_alarm"
  files: string[]
  contactsNotified: string[]
  location: { lat: number; lng: number; address: string }
}

interface VaultContextType {
  files: EvidenceFile[]
  events: SOSEvent[]
  addFile: (file: Omit<EvidenceFile, "id" | "createdAt">) => void
  deleteFile: (id: string) => void
  getEventFiles: (eventId: string) => EvidenceFile[]
  isRecording: boolean
  recordingType: "video" | "audio" | null
  startRecording: (type: "video" | "audio") => Promise<void>
  stopRecording: () => Promise<EvidenceFile | null>
  recordingDuration: number
}

const VaultContext = createContext<VaultContextType | undefined>(undefined)

const mockEvents: SOSEvent[] = [
  {
    id: "e1",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    duration: 154,
    status: "resolved",
    files: ["f1", "f2", "f3", "f4"],
    contactsNotified: ["Mom", "Dad", "Best Friend"],
    location: { lat: 12.9716, lng: 77.5946, address: "Near your current location" },
  },
]

export function VaultProvider({ children }: { children: React.ReactNode }) {
  const [files, setFiles] = useState<EvidenceFile[]>([])
  const [events, setEvents] = useState<SOSEvent[]>(mockEvents)

  const [isRecording, setIsRecording] = useState(false)
  const [recordingType, setRecordingType] = useState<"video" | "audio" | null>(null)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)

  useEffect(() => {
    const storedFiles = localStorage.getItem("protectme_vault_files")
    if (storedFiles) {
      setFiles(JSON.parse(storedFiles))
    }
  }, [])

  const saveFiles = (newFiles: EvidenceFile[]) => {
    setFiles(newFiles)
    // Note: We can't store blob URLs in localStorage, only metadata
    const filesForStorage = newFiles.map((f) => ({ ...f, blobUrl: undefined }))
    localStorage.setItem("protectme_vault_files", JSON.stringify(filesForStorage))
  }

  const addFile = (file: Omit<EvidenceFile, "id" | "createdAt">) => {
    const newFile: EvidenceFile = {
      ...file,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    }
    saveFiles([newFile, ...files])
    return newFile
  }

  const deleteFile = (id: string) => {
    const file = files.find((f) => f.id === id)
    if (file?.blobUrl) {
      URL.revokeObjectURL(file.blobUrl)
    }
    saveFiles(files.filter((f) => f.id !== id))
  }

  const getEventFiles = (eventId: string) => {
    return files.filter((f) => f.sosEventId === eventId)
  }

  const startRecording = async (type: "video" | "audio") => {
    try {
      chunksRef.current = []

      const constraints = type === "video" ? { video: true, audio: true } : { audio: true }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream

      const mimeType =
        type === "video"
          ? MediaRecorder.isTypeSupported("video/webm")
            ? "video/webm"
            : "video/mp4"
          : MediaRecorder.isTypeSupported("audio/webm")
            ? "audio/webm"
            : "audio/mp4"

      const mediaRecorder = new MediaRecorder(stream, { mimeType })
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.start(1000) // Collect data every second
      startTimeRef.current = Date.now()
      setIsRecording(true)
      setRecordingType(type)
      setRecordingDuration(0)

      // Update duration every second
      timerRef.current = setInterval(() => {
        setRecordingDuration(Math.floor((Date.now() - startTimeRef.current) / 1000))
      }, 1000)
    } catch (error) {
      console.error("[v0] Failed to start recording:", error)
      throw error
    }
  }

  const stopRecording = async (): Promise<EvidenceFile | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current || !isRecording) {
        resolve(null)
        return
      }

      const recorder = mediaRecorderRef.current
      const type = recordingType
      const duration = recordingDuration

      recorder.onstop = async () => {
        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop())
        }

        // Clear timer
        if (timerRef.current) {
          clearInterval(timerRef.current)
        }

        // Create blob from chunks
        const mimeType = type === "video" ? "video/webm" : "audio/webm"
        const blob = new Blob(chunksRef.current, { type: mimeType })
        const blobUrl = URL.createObjectURL(blob)

        // Get current location
        let location: { lat: number; lng: number } | undefined
        try {
          const pos = await new Promise<GeolocationPosition>((res, rej) => {
            navigator.geolocation.getCurrentPosition(res, rej, { timeout: 5000 })
          })
          location = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        } catch (e) {
          console.log("[v0] Could not get location for recording")
        }

        // Format duration
        const mins = Math.floor(duration / 60)
        const secs = duration % 60
        const durationStr = `${mins}:${secs.toString().padStart(2, "0")}`

        // Format file size
        const sizeKB = blob.size / 1024
        const sizeStr = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${Math.round(sizeKB)} KB`

        const newFile: EvidenceFile = {
          id: crypto.randomUUID(),
          type: type!,
          name: `${type === "video" ? "Video" : "Audio"}_${new Date().toISOString().slice(0, 19).replace(/[:-]/g, "")}.${type === "video" ? "webm" : "webm"}`,
          size: sizeStr,
          duration: durationStr,
          createdAt: new Date(),
          isEncrypted: true,
          location,
          blobUrl,
          mimeType,
        }

        setFiles((prev) => [newFile, ...prev])
        setIsRecording(false)
        setRecordingType(null)
        setRecordingDuration(0)

        resolve(newFile)
      }

      recorder.stop()
    })
  }

  return (
    <VaultContext.Provider
      value={{
        files,
        events,
        addFile,
        deleteFile,
        getEventFiles,
        isRecording,
        recordingType,
        startRecording,
        stopRecording,
        recordingDuration,
      }}
    >
      {children}
    </VaultContext.Provider>
  )
}

export function useVault() {
  const context = useContext(VaultContext)
  if (context === undefined) {
    throw new Error("useVault must be used within a VaultProvider")
  }
  return context
}
