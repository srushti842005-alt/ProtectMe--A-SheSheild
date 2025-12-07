"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useChat } from "@ai-sdk/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  MessageCircle,
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Bot,
  User,
  AlertTriangle,
  MapPin,
  Shield,
  Navigation,
  Siren,
  Heart,
  Loader2,
  Sparkles,
  PhoneCall,
  Share2,
  Maximize2,
  Minimize2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { SpeechRecognition, SpeechRecognitionEvent } from "web-speech-api-types"

interface HakriChatbotProps {
  isOpen: boolean
  onClose: () => void
}

export function HakriChatbot({ isOpen, onClose }: HakriChatbotProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)
  const [voiceMode, setVoiceMode] = useState(false)
  const [transcript, setTranscript] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null)

  const { messages, input, setInput, handleSubmit, status, append } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hi, I'm Hakri - your AI safety companion. I'm here to help you stay safe 24/7. You can talk to me anytime you feel unsafe, need safety tips, or want guidance during an emergency. How can I help you today?",
      },
    ],
  })

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Text to speech for assistant messages
  useEffect(() => {
    if (isSpeaking && messages.length > 1) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.role === "assistant" && lastMessage.content) {
        if ("speechSynthesis" in window) {
          window.speechSynthesis.cancel()
          const utterance = new SpeechSynthesisUtterance(lastMessage.content)
          utterance.rate = 1.0
          utterance.pitch = 1.1
          utterance.volume = 1
          // Try to get a female voice
          const voices = window.speechSynthesis.getVoices()
          const femaleVoice = voices.find(
            (v) =>
              v.name.includes("Female") || v.name.includes("Samantha") || v.name.includes("Google UK English Female"),
          )
          if (femaleVoice) utterance.voice = femaleVoice
          synthRef.current = utterance
          window.speechSynthesis.speak(utterance)
        }
      }
    }
  }, [messages, isSpeaking])

  // Setup speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.continuous = voiceMode
        recognition.interimResults = true
        recognition.lang = "en-US"

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let finalTranscript = ""
          let interimTranscript = ""

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              finalTranscript += transcript
            } else {
              interimTranscript += transcript
            }
          }

          if (finalTranscript) {
            setTranscript("")
            if (voiceMode) {
              append({ role: "user", content: finalTranscript })
            } else {
              setInput(finalTranscript)
              setIsListening(false)
            }
          } else {
            setTranscript(interimTranscript)
          }
        }

        recognition.onerror = (event) => {
          console.error("Speech recognition error:", event.error)
          setIsListening(false)
        }

        recognition.onend = () => {
          if (!voiceMode) {
            setIsListening(false)
          } else if (isListening) {
            // Restart for continuous voice mode
            try {
              recognition.start()
            } catch (e) {
              console.error("Failed to restart recognition:", e)
            }
          }
        }

        recognitionRef.current = recognition
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [voiceMode, isListening, append, setInput])

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
      setTranscript("")
    } else {
      try {
        recognitionRef.current.start()
        setIsListening(true)
      } catch (e) {
        console.error("Failed to start recognition:", e)
      }
    }
  }, [isListening])

  const toggleVoiceMode = useCallback(() => {
    if (voiceMode) {
      setVoiceMode(false)
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      setIsListening(false)
    } else {
      setVoiceMode(true)
      setIsListening(true)
      if (recognitionRef.current) {
        recognitionRef.current.continuous = true
        try {
          recognitionRef.current.start()
        } catch (e) {
          console.error("Failed to start voice mode:", e)
        }
      }
    }
  }, [voiceMode])

  const quickActions = [
    {
      label: "I feel unsafe",
      icon: AlertTriangle,
      message: "I'm feeling unsafe right now. Someone is following me. What should I do?",
      color: "text-red-500",
    },
    {
      label: "Find safe place",
      icon: MapPin,
      message: "Help me find the nearest safe place - police station, hospital, or public area with people.",
      color: "text-blue-500",
    },
    {
      label: "Safety tips",
      icon: Shield,
      message: "Give me practical safety tips for walking alone at night in an unfamiliar area.",
      color: "text-green-500",
    },
    {
      label: "Calm me down",
      icon: Heart,
      message: "I'm feeling very anxious and scared. Help me calm down with some breathing exercises.",
      color: "text-pink-500",
    },
    {
      label: "Share location",
      icon: Share2,
      message: "I want to share my live location with my emergency contacts for the next 30 minutes.",
      color: "text-purple-500",
    },
    {
      label: "Assess danger",
      icon: Navigation,
      message: "There's a group of people acting suspiciously nearby. Can you help me assess if I should be worried?",
      color: "text-orange-500",
    },
  ]

  const emergencyActions = [
    {
      label: "Activate SOS",
      icon: Siren,
      action: () => append({ role: "user", content: "ACTIVATE SOS NOW! I am in danger and need immediate help!" }),
      color: "bg-red-600 hover:bg-red-700",
    },
    {
      label: "Call Police",
      icon: PhoneCall,
      action: () => append({ role: "user", content: "I need to call the police immediately. Help me connect to 100." }),
      color: "bg-blue-600 hover:bg-blue-700",
    },
  ]

  if (!isOpen) return null

  return (
    <Card
      className={cn(
        "fixed z-50 shadow-2xl border-border bg-card flex flex-col transition-all duration-300",
        isExpanded ? "inset-4 w-auto h-auto" : "bottom-4 right-4 w-[400px] h-[650px]",
      )}
    >
      <CardHeader className="border-b border-border px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emergency via-red-500 to-orange-500 flex items-center justify-center shadow-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              {voiceMode && (
                <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-card flex items-center justify-center">
                  <Mic className="w-2 h-2 text-white" />
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base text-foreground">Hakri</CardTitle>
                <Badge variant="outline" className="text-[10px] h-4 px-1.5 border-emergency/30 text-emergency">
                  <Sparkles className="w-2.5 h-2.5 mr-0.5" />
                  AI
                </Badge>
              </div>
              <p className="text-xs text-success flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                {voiceMode ? "Voice mode active" : "Ready to help 24/7"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className={cn("h-8 w-8", voiceMode && "text-green-500")}
              onClick={toggleVoiceMode}
              title={voiceMode ? "Disable voice mode" : "Enable hands-free voice mode"}
            >
              {voiceMode ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsSpeaking(!isSpeaking)}
              title={isSpeaking ? "Mute voice" : "Enable voice"}
            >
              {isSpeaking ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        {/* Emergency Quick Actions */}
        <div className="flex gap-2 p-3 border-b border-border bg-muted/30">
          {emergencyActions.map((action, i) => (
            <Button
              key={i}
              size="sm"
              className={cn("flex-1 text-white text-xs gap-1.5", action.color)}
              onClick={action.action}
            >
              <action.icon className="w-3.5 h-3.5" />
              {action.label}
            </Button>
          ))}
        </div>

        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          {messages.length <= 1 ? (
            <div className="space-y-4">
              <div className="text-center py-4">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-emergency/20 to-orange-500/20 flex items-center justify-center">
                  <Bot className="w-10 h-10 text-emergency" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Hi, I'm Hakri</h3>
                <p className="text-sm text-muted-foreground max-w-[280px] mx-auto">
                  Your AI-powered safety companion. I can help you stay safe, find help, and provide support in any
                  situation.
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium px-1">How can I help you?</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      className="h-auto py-3 px-3 flex flex-col items-center gap-1.5 text-xs border-border hover:bg-muted/50 hover:border-emergency/30 bg-transparent"
                      onClick={() => append({ role: "user", content: action.message })}
                    >
                      <action.icon className={cn("w-5 h-5", action.color)} />
                      <span className="text-foreground">{action.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-3 mt-4">
                <p className="text-xs text-muted-foreground text-center">
                  <span className="font-medium text-foreground">Voice Mode:</span> Click the mic button in the header
                  for hands-free conversation
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn("flex gap-2", message.role === "user" ? "justify-end" : "justify-start")}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emergency to-orange-500 flex items-center justify-center flex-shrink-0 shadow">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                      message.role === "user"
                        ? "bg-emergency text-white rounded-br-sm"
                        : "bg-muted text-foreground rounded-bl-sm",
                    )}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    {/* Tool Results */}
                    {message.toolInvocations?.map((tool, i) => (
                      <div key={i} className="mt-2 p-2 bg-background/50 rounded-lg text-xs">
                        {tool.state === "result" && (
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[10px]">
                              {tool.toolName}
                            </Badge>
                            <span className="text-muted-foreground">
                              {typeof tool.result === "object" && "message" in tool.result
                                ? (tool.result as { message: string }).message
                                : "Action completed"}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {message.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-foreground" />
                    </div>
                  )}
                </div>
              ))}
              {status === "streaming" && (
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emergency to-orange-500 flex items-center justify-center shadow">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-emergency" />
                      <span className="text-xs text-muted-foreground">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Transcript Display */}
        {(isListening || transcript) && (
          <div className="px-4 py-2 bg-muted/50 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs text-muted-foreground">{transcript || "Listening..."}</span>
            </div>
          </div>
        )}

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className={cn(
                "flex-shrink-0 border-border transition-colors",
                isListening && "bg-red-500/10 border-red-500 text-red-500 animate-pulse",
              )}
              onClick={toggleListening}
              disabled={voiceMode}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                voiceMode ? "Voice mode active - just speak" : isListening ? "Listening..." : "Type your message..."
              }
              className="flex-1 border-border bg-background"
              disabled={status === "streaming" || voiceMode}
            />
            <Button
              type="submit"
              className="flex-shrink-0 bg-emergency hover:bg-emergency/90"
              size="icon"
              disabled={!input.trim() || status === "streaming"}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export function ChatbotTrigger({ onClick }: { onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-4 right-4 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-emergency to-orange-500 hover:from-emergency/90 hover:to-orange-500/90 shadow-lg shadow-emergency/25"
    >
      <MessageCircle className="w-6 h-6" />
    </Button>
  )
}
