"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"
import { Users, MapPin, FolderLock, Scan, Dumbbell, Footprints, Phone, Clock } from "lucide-react"
import { FakeCallOverlay } from "@/components/fake-call/fake-call-overlay"

const actions = [
  {
    icon: Users,
    label: "Contacts",
    description: "Manage emergency contacts",
    href: "/dashboard/contacts",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: MapPin,
    label: "Live Map",
    description: "View incidents nearby",
    href: "/dashboard/map",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    icon: FolderLock,
    label: "Evidence Vault",
    description: "Access recordings",
    href: "/dashboard/vault",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    icon: Phone,
    label: "Fake Call",
    description: "Escape uncomfortable situations",
    href: "#fake-call",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    isAction: true,
  },
  {
    icon: Footprints,
    label: "Walk With Me",
    description: "Live journey monitoring",
    href: "/dashboard/walk-with-me",
    color: "text-pink-500",
    bg: "bg-pink-500/10",
  },
  {
    icon: Clock,
    label: "Check-in",
    description: "Scheduled safety check",
    href: "/dashboard/check-in",
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
  {
    icon: Scan,
    label: "Threat Scanner",
    description: "AR camera detection",
    href: "/dashboard/threat-scanner",
    color: "text-emergency",
    bg: "bg-emergency/10",
  },
  {
    icon: Dumbbell,
    label: "Self Defense",
    description: "Learn protection skills",
    href: "/dashboard/self-defense",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
]

export function QuickActions() {
  const [showFakeCall, setShowFakeCall] = useState(false)

  const handleActionClick = (action: (typeof actions)[0], e: React.MouseEvent) => {
    if (action.isAction && action.href === "#fake-call") {
      e.preventDefault()
      setShowFakeCall(true)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {actions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            onClick={(e) => handleActionClick(action, e)}
            className="p-4 rounded-xl bg-card border border-border hover:border-muted-foreground/30 transition-colors group"
          >
            <div className={`w-10 h-10 rounded-xl ${action.bg} flex items-center justify-center mb-3`}>
              <action.icon className={`w-5 h-5 ${action.color}`} />
            </div>
            <p className="font-medium text-foreground text-sm">{action.label}</p>
            <p className="text-xs text-muted-foreground">{action.description}</p>
          </Link>
        ))}
      </div>

      <FakeCallOverlay isOpen={showFakeCall} onClose={() => setShowFakeCall(false)} />
    </div>
  )
}
