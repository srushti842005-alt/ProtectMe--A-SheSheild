"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, ArrowRight, Play, X, Volume2, VolumeX } from "lucide-react"

export function HeroSection() {
  const [showDemo, setShowDemo] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const demoSteps = [
    {
      title: "One-Tap SOS Activation",
      description:
        "Press and hold the SOS button for 2 seconds to instantly alert your emergency contacts and nearby authorities.",
      video: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1",
      duration: 5000,
    },
    {
      title: "Live Location Sharing",
      description:
        "Your real-time GPS location is automatically shared with your trusted contacts via WhatsApp and SMS.",
      video: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1",
      duration: 5000,
    },
    {
      title: "Auto Evidence Recording",
      description: "Video and audio recording starts automatically, securely stored in your encrypted evidence vault.",
      video: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1",
      duration: 5000,
    },
    {
      title: "AI Threat Detection",
      description: "Our AI-powered threat scanner identifies potential dangers and suggests safe routes in real-time.",
      video: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1",
      duration: 5000,
    },
    {
      title: "Emergency Response",
      description:
        "Connect directly with 911/100 emergency services with your location and evidence automatically shared.",
      video: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1",
      duration: 5000,
    },
  ]

  const startDemo = () => {
    setShowDemo(true)
    setCurrentStep(0)
    speakStep(0)
  }

  const speakStep = (step: number) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      if (!isMuted) {
        const utterance = new SpeechSynthesisUtterance(
          `Step ${step + 1}: ${demoSteps[step].title}. ${demoSteps[step].description}`,
        )
        utterance.rate = 0.9
        utterance.pitch = 1
        window.speechSynthesis.speak(utterance)
      }
    }
  }

  const nextStep = () => {
    if (currentStep < demoSteps.length - 1) {
      const next = currentStep + 1
      setCurrentStep(next)
      speakStep(next)
    } else {
      setShowDemo(false)
      window.speechSynthesis?.cancel()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      const prev = currentStep - 1
      setCurrentStep(prev)
      speakStep(prev)
    }
  }

  const closeDemo = () => {
    setShowDemo(false)
    window.speechSynthesis?.cancel()
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (!isMuted) {
      window.speechSynthesis?.cancel()
    } else {
      speakStep(currentStep)
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background glow effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emergency/20 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-sm text-muted-foreground">Trusted by 50,000+ users worldwide</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-balance">
              Your safety is
              <br />
              <span className="text-emergency">one tap away.</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              ProtectMe SOS provides instant emergency alerts, live location sharing, and automatic evidence recording.
              Stay protected 24/7 with our AI-powered safety companion.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/signup">
                <Button size="lg" className="bg-emergency hover:bg-emergency/90 text-emergency-foreground h-12 px-8">
                  Get Started Free
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 border-border text-foreground hover:bg-secondary bg-transparent"
                onClick={startDemo}
              >
                <Play className="mr-2 w-4 h-4" />
                Watch Demo
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div>
                <p className="text-2xl font-bold text-foreground">{"<"}3s</p>
                <p className="text-sm text-muted-foreground">Response Time</p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div>
                <p className="text-2xl font-bold text-foreground">99.9%</p>
                <p className="text-sm text-muted-foreground">Uptime</p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div>
                <p className="text-2xl font-bold text-foreground">24/7</p>
                <p className="text-sm text-muted-foreground">Monitoring</p>
              </div>
            </div>
          </div>

          {/* Right content - Phone mockup with SOS */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* Phone frame */}
              <div className="w-[280px] sm:w-[320px] h-[580px] sm:h-[640px] bg-card rounded-[3rem] border-4 border-border p-3 shadow-2xl">
                <div className="w-full h-full bg-background rounded-[2.5rem] overflow-hidden flex flex-col">
                  {/* Status bar */}
                  <div className="flex justify-between items-center px-6 py-3">
                    <span className="text-xs text-muted-foreground">9:41</span>
                    <div className="flex gap-1">
                      <div className="w-4 h-2 bg-muted-foreground rounded-sm" />
                      <div className="w-4 h-2 bg-muted-foreground rounded-sm" />
                      <div className="w-6 h-3 bg-success rounded-sm" />
                    </div>
                  </div>

                  {/* App content */}
                  <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6">
                    <div className="text-center space-y-2">
                      <p className="text-sm text-muted-foreground">You are protected</p>
                      <div className="flex items-center justify-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                        <span className="text-sm text-success font-medium">Safe Mode Active</span>
                      </div>
                    </div>

                    {/* SOS Button */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-emergency/30 rounded-full pulse-ring" />
                      <div
                        className="absolute inset-0 bg-emergency/20 rounded-full pulse-ring"
                        style={{ animationDelay: "0.5s" }}
                      />
                      <button className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-emergency hover:bg-emergency/90 flex items-center justify-center shadow-lg shadow-emergency/30 transition-transform hover:scale-105">
                        <div className="text-center text-emergency-foreground">
                          <Shield className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-1" />
                          <span className="text-xl sm:text-2xl font-bold">SOS</span>
                        </div>
                      </button>
                    </div>

                    <p className="text-xs text-muted-foreground text-center">Press and hold for emergency</p>

                    {/* Quick actions */}
                    <div className="flex gap-4 pt-4">
                      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                        <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                        <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                        <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDemo && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-card rounded-2xl overflow-hidden border border-border">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emergency/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-emergency" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">ProtectMe SOS Demo</h3>
                  <p className="text-sm text-muted-foreground">
                    Step {currentStep + 1} of {demoSteps.length}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeDemo}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Video Area */}
            <div className="aspect-video bg-background relative">
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Animated Demo Visualization */}
                <div className="text-center space-y-6 p-8">
                  <div className="relative mx-auto w-32 h-32">
                    {currentStep === 0 && (
                      <div className="absolute inset-0 animate-pulse">
                        <div className="w-full h-full rounded-full bg-emergency/30 animate-ping" />
                        <div className="absolute inset-4 rounded-full bg-emergency flex items-center justify-center">
                          <Shield className="w-12 h-12 text-white" />
                        </div>
                      </div>
                    )}
                    {currentStep === 1 && (
                      <div className="relative">
                        <svg className="w-32 h-32 text-emergency" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-emergency rounded-full animate-ping" />
                      </div>
                    )}
                    {currentStep === 2 && (
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-16 rounded-xl bg-emergency/20 flex items-center justify-center animate-pulse">
                          <svg className="w-8 h-8 text-emergency" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div
                          className="w-16 h-16 rounded-xl bg-blue-500/20 flex items-center justify-center animate-pulse"
                          style={{ animationDelay: "0.3s" }}
                        >
                          <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                    {currentStep === 3 && (
                      <div className="relative">
                        <div className="w-32 h-32 rounded-full border-4 border-emergency/30 flex items-center justify-center">
                          <div className="text-center">
                            <svg
                              className="w-12 h-12 text-emergency mx-auto"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                            <span className="text-xs text-emergency font-medium">AI SCANNING</span>
                          </div>
                        </div>
                        <div className="absolute inset-0 rounded-full border-2 border-emergency animate-ping opacity-50" />
                      </div>
                    )}
                    {currentStep === 4 && (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center animate-bounce">
                          <svg
                            className="w-10 h-10 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                        </div>
                        <span className="text-sm text-green-500 font-medium animate-pulse">HELP ON THE WAY</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-foreground mb-2">{demoSteps[currentStep].title}</h4>
                    <p className="text-muted-foreground max-w-md mx-auto">{demoSteps[currentStep].description}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="px-4 py-2 bg-secondary/50">
              <div className="flex gap-1">
                {demoSteps.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      idx <= currentStep ? "bg-emergency" : "bg-muted"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-4 border-t border-border">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="border-border bg-transparent"
              >
                Previous
              </Button>
              <div className="flex items-center gap-2">
                {demoSteps.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentStep(idx)
                      speakStep(idx)
                    }}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      idx === currentStep ? "bg-emergency" : "bg-muted hover:bg-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <Button onClick={nextStep} className="bg-emergency hover:bg-emergency/90 text-emergency-foreground">
                {currentStep === demoSteps.length - 1 ? "Get Started" : "Next"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
