"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Shield, ArrowLeft, Zap, Crown, Building2 } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Basic",
    icon: Shield,
    price: "Free",
    period: "forever",
    description: "Essential safety features for individuals",
    features: [
      "One-tap SOS button",
      "3 emergency contacts",
      "Basic location sharing",
      "Community incident map",
      "24/7 emergency hotline",
    ],
    notIncluded: [
      "Voice activation",
      "Shake to SOS",
      "AI threat detection",
      "Priority response",
      "Evidence vault (unlimited)",
    ],
    cta: "Get Started Free",
    popular: false,
  },
  {
    name: "Premium",
    icon: Zap,
    price: "₹149",
    period: "/month",
    description: "Advanced protection for complete peace of mind",
    features: [
      "Everything in Basic",
      "Unlimited emergency contacts",
      "Voice activation SOS",
      "Shake to SOS",
      "AI threat scanner",
      "Walk with me tracking",
      "Fake call generator",
      "Unlimited evidence vault",
      "Priority emergency response",
      "Self-defense training videos",
    ],
    notIncluded: [],
    cta: "Start 7-Day Free Trial",
    popular: true,
  },
  {
    name: "Family",
    icon: Crown,
    price: "₹349",
    period: "/month",
    description: "Protect your entire family with one plan",
    features: [
      "Everything in Premium",
      "Up to 5 family members",
      "Family location dashboard",
      "Cross-member alerts",
      "Parental controls",
      "Elder care features",
      "Dedicated support line",
      "Monthly safety reports",
    ],
    notIncluded: [],
    cta: "Start Family Trial",
    popular: false,
  },
  {
    name: "Enterprise",
    icon: Building2,
    price: "Custom",
    period: "pricing",
    description: "For organizations and large teams",
    features: [
      "Everything in Family",
      "Unlimited team members",
      "Admin dashboard",
      "API access",
      "Custom integrations",
      "Dedicated account manager",
      "On-site training",
      "SLA guarantee",
      "White-label options",
    ],
    notIncluded: [],
    cta: "Contact Sales",
    popular: false,
  },
]

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly")
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [showPayment, setShowPayment] = useState(false)

  const handleSelectPlan = (planName: string) => {
    setSelectedPlan(planName)
    if (planName === "Basic") {
      window.location.href = "/signup"
    } else if (planName === "Enterprise") {
      window.location.href = "/contact?subject=Enterprise%20Pricing"
    } else {
      setShowPayment(true)
    }
  }

  const handlePayment = () => {
    // Simulate payment processing
    const synth = window.speechSynthesis
    const utterance = new SpeechSynthesisUtterance(
      `Thank you for choosing ${selectedPlan} plan. Your payment is being processed. You will receive a confirmation email shortly.`,
    )
    synth.speak(utterance)

    setTimeout(() => {
      alert(`Payment successful! Welcome to ProtectMe ${selectedPlan}. Check your email for confirmation.`)
      window.location.href = "/dashboard"
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-emergency/10 text-emergency border-emergency/20">Pricing Plans</Badge>
          <h1 className="text-4xl font-bold text-foreground mb-4">Choose Your Protection Level</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start free and upgrade as you need. All plans include our core safety features.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={billingPeriod === "monthly" ? "text-foreground font-medium" : "text-muted-foreground"}>
            Monthly
          </span>
          <button
            onClick={() => setBillingPeriod(billingPeriod === "monthly" ? "yearly" : "monthly")}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              billingPeriod === "yearly" ? "bg-emergency" : "bg-muted"
            }`}
          >
            <span
              className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${
                billingPeriod === "yearly" ? "translate-x-8" : "translate-x-1"
              }`}
            />
          </button>
          <span className={billingPeriod === "yearly" ? "text-foreground font-medium" : "text-muted-foreground"}>
            Yearly
            <Badge variant="secondary" className="ml-2 text-xs">
              Save 20%
            </Badge>
          </span>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {plans.map((plan) => {
            const Icon = plan.icon
            const price =
              billingPeriod === "yearly" && plan.price !== "Free" && plan.price !== "Custom"
                ? `₹${Math.round(Number.parseInt(plan.price.replace("₹", "")) * 0.8)}`
                : plan.price

            return (
              <Card
                key={plan.name}
                className={`relative ${plan.popular ? "border-emergency shadow-lg shadow-emergency/20" : "border-border"}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emergency text-emergency-foreground">
                    Most Popular
                  </Badge>
                )}
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-emergency/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-emergency" />
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-foreground">{price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </li>
                    ))}
                    {plan.notIncluded.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 opacity-50">
                        <span className="w-5 h-5 shrink-0 mt-0.5 text-center">-</span>
                        <span className="text-sm text-muted-foreground line-through">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handleSelectPlan(plan.name)}
                    className={`w-full ${
                      plan.popular ? "bg-emergency hover:bg-emergency/90 text-emergency-foreground" : ""
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: "Can I change plans anytime?",
                a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.",
              },
              {
                q: "Is there a free trial?",
                a: "Yes! Premium and Family plans come with a 7-day free trial. No credit card required.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, UPI, net banking, and popular wallets like Paytm and PhonePe.",
              },
              {
                q: "Can I get a refund?",
                a: "Yes, we offer a 30-day money-back guarantee if you're not satisfied with our service.",
              },
            ].map((faq) => (
              <Card key={faq.q}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">{faq.q}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && selectedPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Complete Your Purchase</CardTitle>
              <CardDescription>Subscribe to ProtectMe {selectedPlan}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{selectedPlan} Plan</span>
                  <span className="font-bold">{selectedPlan === "Premium" ? "₹149/mo" : "₹349/mo"}</span>
                </div>
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Card Number"
                  className="w-full p-3 border border-border rounded-lg bg-background"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="p-3 border border-border rounded-lg bg-background"
                  />
                  <input type="text" placeholder="CVV" className="p-3 border border-border rounded-lg bg-background" />
                </div>
                <input
                  type="text"
                  placeholder="Name on Card"
                  className="w-full p-3 border border-border rounded-lg bg-background"
                />
              </div>
            </CardContent>
            <CardFooter className="flex gap-3">
              <Button variant="outline" onClick={() => setShowPayment(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handlePayment} className="flex-1 bg-emergency hover:bg-emergency/90">
                Pay Now
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}
