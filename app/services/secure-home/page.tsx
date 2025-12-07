"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Home, Shield, Camera, Bell, Phone, Check, ChevronLeft, Lock, X } from "lucide-react"
import Link from "next/link"

export default function SecureHomePage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isQuoteSubmitted, setIsQuoteSubmitted] = useState(false)
  const [isCallDialogOpen, setIsCallDialogOpen] = useState(false)
  const [callDuration, setCallDuration] = useState(0)

  const plans = [
    {
      id: "basic",
      name: "Basic",
      price: "₹999",
      period: "/month",
      features: ["2 Security Cameras", "24/7 Monitoring", "Mobile App Access", "Email Alerts"],
    },
    {
      id: "pro",
      name: "Pro",
      price: "₹1,999",
      period: "/month",
      popular: true,
      features: [
        "4 Security Cameras",
        "24/7 Monitoring",
        "Panic Buttons (2)",
        "Instant Police Dispatch",
        "Smart Door Locks",
        "Video Storage 30 days",
      ],
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "₹3,999",
      period: "/month",
      features: [
        "8 Security Cameras",
        "24/7 Armed Response",
        "Panic Buttons (5)",
        "Instant Police Dispatch",
        "Smart Door & Window Locks",
        "Video Storage 90 days",
        "Personal Security Manager",
      ],
    },
  ]

  const handleGetQuote = () => {
    if (!phoneNumber || !selectedPlan) return

    // Show success message
    setIsQuoteSubmitted(true)

    // Send WhatsApp message with quote request
    const plan = plans.find((p) => p.id === selectedPlan)
    const message = `Hi SecureHome! I'm interested in the ${plan?.name} plan (${plan?.price}${plan?.period}). Please contact me at ${phoneNumber} for a quote and installation details.`
    window.open(`https://wa.me/918001234567?text=${encodeURIComponent(message)}`, "_blank")
  }

  const handleCall = () => {
    setIsCallDialogOpen(true)
    setCallDuration(0)
    const interval = setInterval(() => setCallDuration((prev) => prev + 1), 1000)

    // Speak as customer service
    const speech = new SpeechSynthesisUtterance(
      "Thank you for calling SecureHome. This is Raj from customer support. How may I help you today? If you're interested in our home security plans, I can help you choose the right one for your needs.",
    )
    speech.rate = 0.9
    speechSynthesis.speak(speech)

    return () => clearInterval(interval)
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4">
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
              <Home className="w-8 h-8" />
            </div>
            <div>
              <Badge className="bg-white/20 text-white mb-2">Partner Service</Badge>
              <h1 className="text-3xl font-bold">SecureHome</h1>
              <p className="text-white/80">Smart Home Security System</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Complete Home Protection</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { icon: Camera, title: "HD Cameras", desc: "Crystal clear 4K footage" },
              { icon: Bell, title: "Instant Alerts", desc: "Real-time notifications" },
              { icon: Shield, title: "Police Dispatch", desc: "One-tap emergency" },
              { icon: Lock, title: "Smart Locks", desc: "Remote access control" },
            ].map((feature, i) => (
              <Card key={i} className="border-border text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-3">
                    <feature.icon className="w-6 h-6 text-blue-500" />
                  </div>
                  <p className="font-semibold">{feature.title}</p>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <h2 className="text-2xl font-bold mb-6 text-center">Choose Your Plan</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`border-2 cursor-pointer transition-all ${
                selectedPlan === plan.id
                  ? "border-blue-500 bg-blue-500/5"
                  : plan.popular
                    ? "border-blue-500/50"
                    : "border-border"
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              <CardHeader>
                {plan.popular && <Badge className="w-fit bg-blue-500 mb-2">Most Popular</Badge>}
                <CardTitle>{plan.name}</CardTitle>
                <div>
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
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
                <Button
                  className={`w-full mt-4 ${selectedPlan === plan.id ? "bg-blue-500" : "bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-500/10"}`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {selectedPlan === plan.id ? "Selected" : "Select Plan"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <Card className="border-blue-500/50 bg-blue-500/5">
          <CardContent className="p-6">
            {isQuoteSubmitted ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-green-500">Quote Request Submitted!</h3>
                <p className="text-muted-foreground mb-4">Our team will contact you within 24 hours</p>
                <Button variant="outline" onClick={() => setIsQuoteSubmitted(false)}>
                  Submit Another Request
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <div>
                  <h3 className="text-xl font-bold mb-2">Get Protected Today</h3>
                  <p className="text-muted-foreground mb-4">Free installation worth ₹5,000 for ProtectMe users</p>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter your phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    <Button
                      className="bg-blue-500 hover:bg-blue-600"
                      onClick={handleGetQuote}
                      disabled={!phoneNumber || !selectedPlan}
                    >
                      Get Quote
                    </Button>
                  </div>
                  {!selectedPlan && <p className="text-xs text-orange-500 mt-2">Please select a plan above</p>}
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Or call us directly</p>
                  <Button variant="outline" size="lg" onClick={handleCall}>
                    <Phone className="w-4 h-4 mr-2" />
                    1800-123-SECURE
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Call Dialog */}
      <Dialog open={isCallDialogOpen} onOpenChange={setIsCallDialogOpen}>
        <DialogContent className="max-w-sm">
          <div className="text-center py-8 space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-blue-500/20 flex items-center justify-center">
              <Phone className="w-10 h-10 text-blue-500 animate-pulse" />
            </div>
            <div>
              <p className="text-lg font-semibold">SecureHome Support</p>
              <p className="text-sm text-muted-foreground">1800-123-SECURE</p>
            </div>
            <p className="text-3xl font-mono">{formatDuration(callDuration)}</p>
            <Button
              className="bg-red-500 hover:bg-red-600 w-full"
              onClick={() => {
                speechSynthesis.cancel()
                setIsCallDialogOpen(false)
              }}
            >
              <X className="w-4 h-4 mr-2" />
              End Call
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
