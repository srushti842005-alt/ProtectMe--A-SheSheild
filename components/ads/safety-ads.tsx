"use client"

import type React from "react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, ExternalLink, Shield, Car, Home, Heart } from "lucide-react"
import { cn } from "@/lib/utils"

interface SafetyAd {
  id: string
  company: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
  cta: string
  url: string
  category: "insurance" | "transport" | "security" | "health"
}

const safetyAds: SafetyAd[] = [
  {
    id: "ad1",
    company: "SafeRide",
    title: "Women's Safety Cab Service",
    description: "Female drivers, SOS button in every cab, live tracking shared with family",
    icon: <Car className="w-6 h-6" />,
    color: "from-pink-500 to-rose-500",
    cta: "Book Safe Ride",
    url: "/services/safe-ride",
    category: "transport",
  },
  {
    id: "ad2",
    company: "SecureHome",
    title: "Smart Home Security",
    description: "24/7 monitoring, instant police dispatch, panic buttons for every room",
    icon: <Home className="w-6 h-6" />,
    color: "from-blue-500 to-cyan-500",
    cta: "Get Protected",
    url: "/services/secure-home",
    category: "security",
  },
  {
    id: "ad3",
    company: "HealthGuard",
    title: "Emergency Medical Insurance",
    description: "Instant ambulance, cashless hospitalization, 24/7 doctor on call",
    icon: <Heart className="w-6 h-6" />,
    color: "from-red-500 to-orange-500",
    cta: "View Plans",
    url: "/services/health-guard",
    category: "health",
  },
  {
    id: "ad4",
    company: "ShieldPlus",
    title: "Personal Safety Insurance",
    description: "Coverage for theft, assault incidents. Legal support included.",
    icon: <Shield className="w-6 h-6" />,
    color: "from-purple-500 to-indigo-500",
    cta: "Learn More",
    url: "/services/shield-plus",
    category: "insurance",
  },
]

interface SafetyAdsProps {
  placement?: "sidebar" | "banner" | "inline"
  className?: string
}

export function SafetyAds({ placement = "sidebar", className }: SafetyAdsProps) {
  const [currentAd, setCurrentAd] = useState(0)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAd((prev) => (prev + 1) % safetyAds.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  if (isDismissed) return null

  const ad = safetyAds[currentAd]

  if (placement === "banner") {
    return (
      <div className={cn("relative overflow-hidden rounded-lg", className)}>
        <div className={cn("p-4 bg-gradient-to-r", ad.color)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white">
                {ad.icon}
              </div>
              <div className="text-white">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                    Sponsored
                  </Badge>
                  <span className="font-semibold">{ad.company}</span>
                </div>
                <p className="text-lg font-bold">{ad.title}</p>
                <p className="text-sm text-white/80">{ad.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button className="bg-white text-black hover:bg-white/90" asChild>
                <Link href={ad.url}>
                  {ad.cta}
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => setIsDismissed(true)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className={cn("border-border overflow-hidden", className)}>
      <div className={cn("h-2 bg-gradient-to-r", ad.color)} />
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            Sponsored
          </Badge>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsDismissed(true)}>
            <X className="w-3 h-3" />
          </Button>
        </div>

        <div className="flex items-start gap-3">
          <div
            className={cn(
              "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center text-white",
              ad.color,
            )}
          >
            {ad.icon}
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">{ad.company}</p>
            <p className="font-semibold text-foreground text-sm">{ad.title}</p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">{ad.description}</p>

        <Button className="w-full text-sm" size="sm" asChild>
          <Link href={ad.url}>
            {ad.cta}
            <ExternalLink className="w-3 h-3 ml-2" />
          </Link>
        </Button>

        {/* Ad rotation dots */}
        <div className="flex justify-center gap-1 pt-2">
          {safetyAds.map((_, i) => (
            <button
              key={i}
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-colors",
                i === currentAd ? "bg-foreground" : "bg-muted-foreground/30",
              )}
              onClick={() => setCurrentAd(i)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Revenue Stats Component for Admin
export function RevenueStats() {
  const stats = {
    totalImpressions: 45678,
    clicks: 2345,
    ctr: "5.13%",
    revenue: "₹12,450",
    activeAds: 8,
    topPerformer: "SafeRide",
  }

  return (
    <Card className="border-border">
      <CardContent className="p-4 space-y-4">
        <h3 className="font-semibold text-foreground">Ad Revenue (This Month)</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-2xl font-bold text-success">{stats.revenue}</p>
            <p className="text-xs text-muted-foreground">Total Revenue</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{stats.totalImpressions.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Impressions</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{stats.clicks.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Clicks</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{stats.ctr}</p>
            <p className="text-xs text-muted-foreground">CTR</p>
          </div>
        </div>
        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Top Performer: <span className="text-foreground font-medium">{stats.topPerformer}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
