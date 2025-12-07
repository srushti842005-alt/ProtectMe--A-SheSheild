"use client"

import { useAuth } from "@/lib/auth-context"
import { redirect } from "next/navigation"
import { useEffect, useState } from "react"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { SOSButton } from "@/components/dashboard/sos-button"
import { StatusCard } from "@/components/dashboard/status-card"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { HakriChatbot, ChatbotTrigger } from "@/components/chatbot/hakri-chatbot"
import { SafetyAds } from "@/components/ads/safety-ads"
import { OfflineIndicator } from "@/components/offline-indicator"
import { Shield, Users, MapPin, Battery } from "lucide-react"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const [safetyStatus, setSafetyStatus] = useState<"safe" | "monitoring" | "emergency">("safe")
  const [isChatOpen, setIsChatOpen] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      redirect("/login")
    }
  }, [user, isLoading])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emergency border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-foreground">Hello, {user.name?.split(" ")[0] || "there"}</h1>
            <p className="text-muted-foreground">
              {safetyStatus === "safe" ? "You are protected. Stay safe out there." : "Emergency mode is active."}
            </p>
          </div>

          <SafetyAds placement="banner" />

          {/* Status Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatusCard
              title="Safety Status"
              value={safetyStatus === "safe" ? "Protected" : "Active"}
              description="All systems normal"
              icon={<Shield className="w-5 h-5" />}
              variant="success"
            />
            <StatusCard
              title="Emergency Contacts"
              value="3"
              description="Ready to notify"
              icon={<Users className="w-5 h-5" />}
            />
            <StatusCard
              title="Location Sharing"
              value="Active"
              description="3 contacts can see you"
              icon={<MapPin className="w-5 h-5" />}
              variant="success"
            />
            <StatusCard
              title="Battery Level"
              value="78%"
              description="4h estimated"
              icon={<Battery className="w-5 h-5" />}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* SOS Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="p-8 rounded-2xl bg-card border border-border">
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    <span className="text-sm text-success font-medium">Safe Mode Active</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Last check: Just now</p>
                </div>
                <SOSButton
                  onActivate={() => setSafetyStatus("emergency")}
                  onDeactivate={() => setSafetyStatus("safe")}
                />
              </div>
              <QuickActions />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <SafetyAds placement="sidebar" />
              <RecentActivity />
            </div>
          </div>
        </div>
      </main>

      <OfflineIndicator />

      {isChatOpen ? (
        <HakriChatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      ) : (
        <ChatbotTrigger onClick={() => setIsChatOpen(true)} />
      )}
    </div>
  )
}
