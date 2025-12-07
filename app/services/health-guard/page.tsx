"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Heart,
  Ambulance,
  Phone,
  Check,
  ChevronLeft,
  Stethoscope,
  Clock,
  CreditCard,
  Mic,
  MicOff,
  PhoneOff,
} from "lucide-react"
import Link from "next/link"

export default function HealthGuardPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [isCallActive, setIsCallActive] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [chatLog, setChatLog] = useState<{ role: "advisor" | "user"; text: string }[]>([])
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<any>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)

  const plans = [
    {
      id: "individual",
      name: "Individual",
      price: "₹599",
      period: "/month",
      coverage: "₹5 Lakh",
      features: ["Emergency Ambulance", "24/7 Doctor on Call", "Cashless Hospitalization", "Accident Coverage"],
    },
    {
      id: "family",
      name: "Family",
      price: "₹1,499",
      period: "/month",
      coverage: "₹10 Lakh",
      popular: true,
      features: [
        "Covers 4 Members",
        "Emergency Ambulance",
        "24/7 Doctor on Call",
        "Cashless at 5000+ Hospitals",
        "Accident Coverage",
        "Critical Illness Cover",
      ],
    },
    {
      id: "premium",
      name: "Premium",
      price: "₹2,999",
      period: "/month",
      coverage: "₹25 Lakh",
      features: [
        "Covers 6 Members",
        "Air Ambulance",
        "24/7 Doctor Home Visit",
        "Global Coverage",
        "All Illness Cover",
        "Dental & Vision",
        "No Claim Bonus",
      ],
    },
  ]

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isCallActive])

  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis
    }
  }, [])

  const speak = (text: string) => {
    if (synthRef.current && !isMuted) {
      synthRef.current.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.95
      utterance.pitch = 1.1
      const voices = synthRef.current.getVoices()
      const femaleVoice = voices.find(
        (v) =>
          v.name.includes("female") ||
          v.name.includes("Samantha") ||
          v.name.includes("Zira") ||
          v.name.includes("Google"),
      )
      if (femaleVoice) utterance.voice = femaleVoice
      utterance.onend = () => {
        setTimeout(() => startListening(), 500)
      }
      synthRef.current.speak(utterance)
    }
  }

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) return

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    recognitionRef.current = new SpeechRecognition()
    recognitionRef.current.continuous = false
    recognitionRef.current.interimResults = false
    recognitionRef.current.lang = "en-IN"

    recognitionRef.current.onstart = () => setIsListening(true)
    recognitionRef.current.onend = () => setIsListening(false)
    recognitionRef.current.onerror = () => setIsListening(false)

    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setChatLog((prev) => [...prev, { role: "user", text: transcript }])
      processUserInput(transcript.toLowerCase())
    }

    recognitionRef.current.start()
  }

  const processUserInput = (input: string) => {
    let response = ""

    if (input.includes("family") || input.includes("members") || input.includes("wife") || input.includes("children")) {
      response =
        "The Family plan at rupees 1499 per month covers up to 4 members with 10 lakh coverage. It includes emergency ambulance, 24/7 doctor on call, and cashless hospitalization at over 5000 hospitals. Would you like me to help you enroll?"
    } else if (
      input.includes("individual") ||
      input.includes("single") ||
      input.includes("myself") ||
      input.includes("alone")
    ) {
      response =
        "The Individual plan at rupees 599 per month gives you 5 lakh coverage. It covers emergency ambulance, 24/7 doctor access, and cashless hospitalization. Shall I proceed with enrollment?"
    } else if (
      input.includes("premium") ||
      input.includes("best") ||
      input.includes("maximum") ||
      input.includes("full")
    ) {
      response =
        "Our Premium plan at rupees 2999 per month offers 25 lakh coverage for up to 6 members. It includes air ambulance, home doctor visits, global coverage, and dental plus vision benefits. This is our most comprehensive plan."
    } else if (input.includes("ambulance") || input.includes("emergency")) {
      response =
        "All our plans include emergency ambulance service with a 5 minute response guarantee. The Premium plan also includes air ambulance for critical emergencies."
    } else if (input.includes("hospital") || input.includes("cashless")) {
      response =
        "We have tie-ups with over 5000 hospitals across India for cashless treatment. Just show your HealthGuard card and we'll handle all payments directly."
    } else if (
      input.includes("enroll") ||
      input.includes("buy") ||
      input.includes("purchase") ||
      input.includes("yes") ||
      input.includes("proceed")
    ) {
      response =
        "Excellent! I'm sending you an enrollment link via SMS right now. You can complete the process in just 2 minutes. Is there anything else you'd like to know?"
    } else if (input.includes("price") || input.includes("cost") || input.includes("how much")) {
      response =
        "Our plans start at rupees 599 per month for Individual, rupees 1499 for Family covering 4 members, and rupees 2999 for Premium with 25 lakh coverage. Which one interests you?"
    } else if (input.includes("thank") || input.includes("bye") || input.includes("no")) {
      response =
        "Thank you for calling HealthGuard. Remember, your health is our priority. Have a safe and healthy day! You can call us anytime at 1800-HEALTH."
    } else {
      response =
        "I can help you choose the right health insurance plan. We have Individual, Family, and Premium options. Would you like me to explain the benefits of each plan?"
    }

    setChatLog((prev) => [...prev, { role: "advisor", text: response }])
    speak(response)
  }

  const startCall = () => {
    setIsCallActive(true)
    setCallDuration(0)
    setChatLog([])

    const greeting =
      "Hello! Welcome to HealthGuard medical insurance. I'm Priya, your health advisor. How can I help you today? Are you looking for coverage for yourself or your family?"
    setChatLog([{ role: "advisor", text: greeting }])
    setTimeout(() => speak(greeting), 500)
  }

  const endCall = () => {
    setIsCallActive(false)
    setIsListening(false)
    if (recognitionRef.current) recognitionRef.current.stop()
    if (synthRef.current) synthRef.current.cancel()
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  if (isCallActive) {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-red-600 to-red-800 z-50 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mb-4 animate-pulse">
            <Stethoscope className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">Priya - Health Advisor</h2>
          <p className="text-white/80 mb-2">HealthGuard Insurance</p>
          <p className="text-white text-xl font-mono">{formatDuration(callDuration)}</p>

          {isListening && (
            <div className="mt-4 px-4 py-2 bg-white/20 rounded-full flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white text-sm">Listening...</span>
            </div>
          )}
        </div>

        {/* Chat Log */}
        <div className="max-h-[40vh] overflow-y-auto px-4 pb-4">
          <div className="space-y-3">
            {chatLog.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl text-sm ${
                  msg.role === "advisor" ? "bg-white/20 text-white mr-8" : "bg-white text-red-800 ml-8"
                }`}
              >
                <span className="font-semibold block mb-1">{msg.role === "advisor" ? "Priya (Advisor)" : "You"}</span>
                {msg.text}
              </div>
            ))}
          </div>
        </div>

        {/* Call Controls */}
        <div className="p-6 flex items-center justify-center gap-6">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`w-14 h-14 rounded-full flex items-center justify-center ${
              isMuted ? "bg-red-500" : "bg-white/20"
            }`}
          >
            {isMuted ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
          </button>

          <button onClick={endCall} className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
            <PhoneOff className="w-8 h-8 text-red-600" />
          </button>

          <button
            onClick={startListening}
            disabled={isListening}
            className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center disabled:opacity-50"
          >
            <Mic className="w-6 h-6 text-white" />
          </button>
        </div>

        <p className="text-center text-white/60 text-sm pb-4">Tap green mic to speak</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4">
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
              <Heart className="w-8 h-8" />
            </div>
            <div>
              <Badge className="bg-white/20 text-white mb-2">Partner Service</Badge>
              <h1 className="text-3xl font-bold">HealthGuard</h1>
              <p className="text-white/80">Emergency Medical Insurance</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Emergency Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Instant Emergency Response</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { icon: Ambulance, title: "5 Min Response", desc: "Ambulance at your doorstep" },
              { icon: Stethoscope, title: "24/7 Doctors", desc: "On-call medical advice" },
              { icon: CreditCard, title: "Cashless", desc: "No upfront payment" },
              { icon: Clock, title: "No Waiting", desc: "Priority treatment" },
            ].map((feature, i) => (
              <Card key={i} className="border-border text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-3">
                    <feature.icon className="w-6 h-6 text-red-500" />
                  </div>
                  <p className="font-semibold">{feature.title}</p>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Pricing Plans */}
        <h2 className="text-2xl font-bold mb-6 text-center">View Plans</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`border-2 cursor-pointer transition-all ${
                selectedPlan === plan.id
                  ? "border-red-500 bg-red-500/5"
                  : plan.popular
                    ? "border-red-500/50"
                    : "border-border"
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              <CardHeader>
                {plan.popular && <Badge className="w-fit bg-red-500 mb-2">Best Value</Badge>}
                <CardTitle>{plan.name}</CardTitle>
                <div>
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground">Coverage: {plan.coverage}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-4 bg-red-500 hover:bg-red-600" disabled={selectedPlan !== plan.id}>
                  {selectedPlan === plan.id ? "Get This Plan" : "Select Plan"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact - Updated to call health advisor */}
        <Card className="border-red-500/50 bg-red-500/5">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold mb-2">Need Help Choosing?</h3>
            <p className="text-muted-foreground mb-4">Our health advisors can help you find the right plan</p>
            <Button size="lg" className="bg-red-500 hover:bg-red-600" onClick={startCall}>
              <Phone className="w-4 h-4 mr-2" />
              Talk to Health Advisor
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
