"use client"

import { useState, useEffect, useRef } from "react"
import { Phone, PhoneOff, Volume2, VolumeX, User } from "lucide-react"

interface FakeCallOverlayProps {
  isOpen: boolean
  onClose: () => void
  callerName?: string
  callerNumber?: string
}

export function FakeCallOverlay({
  isOpen,
  onClose,
  callerName = "Mom",
  callerNumber = "+1 (555) 123-4567",
}: FakeCallOverlayProps) {
  const [callState, setCallState] = useState<"ringing" | "connected" | "ended">("ringing")
  const [callDuration, setCallDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeakerOn, setIsSpeakerOn] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!isOpen) {
      setCallState("ringing")
      setCallDuration(0)
      return
    }

    // Play ringtone
    if (callState === "ringing") {
      // Vibrate pattern for incoming call
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200, 100, 200])
      }
    }
  }, [isOpen, callState])

  useEffect(() => {
    if (callState === "connected") {
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [callState])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const answerCall = () => {
    setCallState("connected")
    if (navigator.vibrate) navigator.vibrate(0)

    // Simulate conversation with speech synthesis
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance("Hey! How are you? I was just thinking about you.")
      utterance.voice = speechSynthesis.getVoices().find((v) => v.name.includes("Female")) || null
      utterance.rate = 0.9
      speechSynthesis.speak(utterance)
    }, 1000)
  }

  const endCall = () => {
    setCallState("ended")
    speechSynthesis.cancel()
    if (timerRef.current) clearInterval(timerRef.current)
    setTimeout(onClose, 500)
  }

  const declineCall = () => {
    if (navigator.vibrate) navigator.vibrate(0)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      {/* Caller Info */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-6 shadow-lg">
          <User className="w-16 h-16 text-white" />
        </div>

        <h2 className="text-3xl font-semibold text-white mb-2">{callerName}</h2>
        <p className="text-gray-400 mb-4">{callerNumber}</p>

        {callState === "ringing" && <p className="text-emerald-400 animate-pulse text-lg">Incoming call...</p>}

        {callState === "connected" && <p className="text-emerald-400 text-lg">{formatDuration(callDuration)}</p>}
      </div>

      {/* Call Actions */}
      <div className="pb-16 px-8">
        {callState === "ringing" ? (
          <div className="flex justify-center gap-20">
            {/* Decline Button */}
            <button
              onClick={declineCall}
              className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
            >
              <PhoneOff className="w-8 h-8 text-white" />
            </button>

            {/* Answer Button */}
            <button
              onClick={answerCall}
              className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg hover:bg-emerald-600 transition-colors animate-pulse"
            >
              <Phone className="w-8 h-8 text-white" />
            </button>
          </div>
        ) : callState === "connected" ? (
          <div className="space-y-8">
            {/* Call Options */}
            <div className="flex justify-center gap-12">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`w-14 h-14 rounded-full flex items-center justify-center ${
                  isMuted ? "bg-white/20" : "bg-white/10"
                }`}
              >
                <VolumeX className={`w-6 h-6 ${isMuted ? "text-white" : "text-gray-400"}`} />
              </button>

              <button
                onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                className={`w-14 h-14 rounded-full flex items-center justify-center ${
                  isSpeakerOn ? "bg-white/20" : "bg-white/10"
                }`}
              >
                <Volume2 className={`w-6 h-6 ${isSpeakerOn ? "text-white" : "text-gray-400"}`} />
              </button>
            </div>

            {/* End Call */}
            <div className="flex justify-center">
              <button
                onClick={endCall}
                className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
              >
                <PhoneOff className="w-8 h-8 text-white" />
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* Swipe hint for ringing state */}
      {callState === "ringing" && (
        <div className="absolute bottom-4 left-0 right-0 text-center">
          <p className="text-gray-500 text-sm">Tap green to answer, red to decline</p>
        </div>
      )}
    </div>
  )
}
