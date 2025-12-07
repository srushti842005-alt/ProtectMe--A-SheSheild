"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Shield, Scale, Check, ChevronLeft, FileText, Users, Briefcase, Phone, X, Download } from "lucide-react"
import Link from "next/link"

export default function ShieldPlusPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isCallDialogOpen, setIsCallDialogOpen] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [policyNumber, setPolicyNumber] = useState("")

  const plans = [
    {
      id: "basic",
      name: "Basic Shield",
      price: "₹299",
      period: "/month",
      coverage: "₹2 Lakh",
      features: ["Theft Coverage", "Phone Snatching", "Basic Legal Aid", "24/7 Helpline"],
    },
    {
      id: "plus",
      name: "Shield Plus",
      price: "₹599",
      period: "/month",
      coverage: "₹5 Lakh",
      popular: true,
      features: [
        "All Basic Features",
        "Assault Coverage",
        "Full Legal Support",
        "Court Representation",
        "Counseling Support",
        "Family Notification",
      ],
    },
    {
      id: "elite",
      name: "Shield Elite",
      price: "₹999",
      period: "/month",
      coverage: "₹10 Lakh",
      features: [
        "All Plus Features",
        "Stalking Protection",
        "Cyber Crime Coverage",
        "Personal Advocate",
        "Relocation Assistance",
        "Income Protection",
      ],
    },
  ]

  const coverageTypes = [
    { icon: Shield, title: "Assault & Battery", desc: "Medical expenses and trauma counseling" },
    { icon: Briefcase, title: "Theft & Robbery", desc: "Coverage for stolen belongings" },
    { icon: Scale, title: "Legal Support", desc: "Free lawyer and court representation" },
    { icon: Users, title: "Stalking Protection", desc: "Restraining order assistance" },
  ]

  const handleGetQuote = () => {
    if (!selectedPlan || !formData.name || !formData.phone || !formData.email) return

    const plan = plans.find((p) => p.id === selectedPlan)
    const newPolicyNumber = `SP${Date.now().toString().slice(-8)}`
    setPolicyNumber(newPolicyNumber)
    setIsSubmitted(true)

    // Send to WhatsApp
    const message = `New ShieldPlus Insurance Quote Request:\n\nPlan: ${plan?.name}\nCoverage: ${plan?.coverage}\nPrice: ${plan?.price}${plan?.period}\n\nCustomer Details:\nName: ${formData.name}\nPhone: ${formData.phone}\nEmail: ${formData.email}\n\nReference: ${newPolicyNumber}`
    window.open(`https://wa.me/918001234567?text=${encodeURIComponent(message)}`, "_blank")
  }

  const handleCallAdvisor = () => {
    setIsCallDialogOpen(true)
    setCallDuration(0)
    const interval = setInterval(() => setCallDuration((prev) => prev + 1), 1000)

    const speech = new SpeechSynthesisUtterance(
      "Hello, thank you for calling ShieldPlus Insurance. My name is Meera and I'm your insurance advisor. I can help you understand our plans and find the right coverage for you. Which plan are you interested in?",
    )
    speech.rate = 0.9
    speechSynthesis.speak(speech)

    return () => clearInterval(interval)
  }

  const handleDownloadPolicy = () => {
    const plan = plans.find((p) => p.id === selectedPlan)
    const policyContent = `
SHIELDPLUS INSURANCE POLICY
===========================
Policy Number: ${policyNumber}
Plan: ${plan?.name}
Coverage: ${plan?.coverage}
Monthly Premium: ${plan?.price}

Policyholder Details:
Name: ${formData.name}
Phone: ${formData.phone}
Email: ${formData.email}

Coverage Details:
${plan?.features.map((f) => `• ${f}`).join("\n")}

Terms & Conditions:
1. Policy is valid for 12 months from activation date
2. Claims must be filed within 30 days of incident
3. All claims require police report (if applicable)
4. 24/7 helpline: 1800-123-SHIELD

Generated on: ${new Date().toLocaleString()}
    `

    const blob = new Blob([policyContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ShieldPlus_Policy_${policyNumber}.txt`
    a.click()
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4">
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <Badge className="bg-white/20 text-white mb-2">Partner Service</Badge>
              <h1 className="text-3xl font-bold">ShieldPlus</h1>
              <p className="text-white/80">Personal Safety Insurance</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Coverage Types */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">What We Cover</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {coverageTypes.map((item, i) => (
              <Card key={i} className="border-border text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-3">
                    <item.icon className="w-6 h-6 text-purple-500" />
                  </div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Plans */}
        <h2 className="text-2xl font-bold mb-6 text-center">Choose Your Protection</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`border-2 cursor-pointer transition-all ${
                selectedPlan === plan.id
                  ? "border-purple-500 bg-purple-500/5"
                  : plan.popular
                    ? "border-purple-500/50"
                    : "border-border"
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              <CardHeader>
                {plan.popular && <Badge className="w-fit bg-purple-500 mb-2">Recommended</Badge>}
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
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Registration Form */}
        <Card className="border-purple-500/50 bg-purple-500/5">
          <CardContent className="p-6">
            {isSubmitted ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-green-500">Application Submitted!</h3>
                <p className="text-muted-foreground mb-2">Your policy reference number:</p>
                <p className="text-2xl font-mono font-bold text-purple-500 mb-4">{policyNumber}</p>
                <div className="flex gap-2 justify-center flex-wrap">
                  <Button variant="outline" onClick={handleDownloadPolicy}>
                    <Download className="w-4 h-4 mr-2" />
                    Download Policy
                  </Button>
                  <Button variant="outline" onClick={handleCallAdvisor}>
                    <Phone className="w-4 h-4 mr-2" />
                    Talk to Advisor
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsSubmitted(false)
                      setFormData({ name: "", phone: "", email: "" })
                      setSelectedPlan(null)
                    }}
                  >
                    Apply for Another Plan
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-4 text-center">Get Started - It's Quick!</h3>
                <div className="grid md:grid-cols-4 gap-4 items-end">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      placeholder="you@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <Button
                    className="bg-purple-500 hover:bg-purple-600"
                    disabled={!selectedPlan || !formData.name || !formData.phone || !formData.email}
                    onClick={handleGetQuote}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Get Quote
                  </Button>
                </div>
                {!selectedPlan && (
                  <p className="text-xs text-orange-500 text-center mt-4">Please select a plan above to continue</p>
                )}
                <p className="text-xs text-muted-foreground text-center mt-4">
                  By submitting, you agree to our terms. No spam, we promise!
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Call Dialog */}
      <Dialog open={isCallDialogOpen} onOpenChange={setIsCallDialogOpen}>
        <DialogContent className="max-w-sm">
          <div className="text-center py-8 space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-purple-500/20 flex items-center justify-center">
              <Phone className="w-10 h-10 text-purple-500 animate-pulse" />
            </div>
            <div>
              <p className="text-lg font-semibold">Meera - Insurance Advisor</p>
              <p className="text-sm text-muted-foreground">ShieldPlus Insurance</p>
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
