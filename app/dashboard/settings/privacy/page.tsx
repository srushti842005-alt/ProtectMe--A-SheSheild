"use client"

import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Lock, Eye, Database, Share2, UserCheck, Server, FileText } from "lucide-react"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />

      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-foreground">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: December 2024</p>
          </div>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-500" />
                Your Privacy Matters
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none">
              <p className="text-muted-foreground">
                ProtectMe SOS is committed to protecting your privacy. This policy explains what data we collect, how we
                use it, and your rights regarding your personal information.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-500" />
                Data We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Location Data</h4>
                <p className="text-sm text-muted-foreground">
                  We collect your location only when SOS mode is active, during Walk With Me sessions, or when you
                  explicitly enable location sharing. Location is never tracked in the background without your consent.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Emergency Contacts</h4>
                <p className="text-sm text-muted-foreground">
                  Contact information you provide for emergency alerts is stored securely and only used to send SOS
                  notifications when you activate an emergency.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Audio/Video Recordings</h4>
                <p className="text-sm text-muted-foreground">
                  Evidence recordings are encrypted end-to-end (AES-256) and stored only when you activate SOS. You have
                  full control to download or delete these recordings.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-500" />
                Data Encryption
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2" />
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">In Transit:</strong> All data is transmitted using HTTPS/TLS
                    encryption
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2" />
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">At Rest:</strong> Stored data is encrypted using AES-256
                    encryption
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2" />
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Evidence Vault:</strong> Recordings are encrypted before upload
                    and can only be decrypted by you
                  </p>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Share2 className="w-5 h-5 text-orange-500" />
                Data Sharing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">We do NOT share your data with:</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="text-red-500">✕</span> Third-party advertisers
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="text-red-500">✕</span> Data brokers or analytics companies
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="text-red-500">✕</span> Social media platforms
                </li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">Your data is shared ONLY with:</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="text-emerald-500">✓</span> Your designated emergency contacts (when SOS is active)
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="text-emerald-500">✓</span> Emergency services (police/ambulance) during active
                  emergencies
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-500" />
                Admin Dashboard Access
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Police and safety officers using the admin dashboard can only see:
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="text-emerald-500">✓</span> Aggregated statistics (e.g., "5 people in danger zone")
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="text-emerald-500">✓</span> Active SOS alerts with location (only during emergency)
                </li>
                <li className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="text-red-500">✕</span> Personal information when no emergency is active
                </li>
              </ul>
              <p className="text-sm text-muted-foreground mt-2">
                All admin access is logged and audited for security purposes.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-500" />
                Your Rights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2" />
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Access:</strong> Request a copy of all your stored data
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2" />
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Delete:</strong> Request deletion of your account and all
                    associated data
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2" />
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Modify:</strong> Edit or update your personal information at any
                    time
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2" />
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Withdraw:</strong> Revoke any permissions at any time from
                    Settings
                  </p>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Server className="w-5 h-5 text-purple-500" />
                Data Retention
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Location History:</strong> Deleted after 30 days or upon your
                  request
                </li>
                <li className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Evidence Recordings:</strong> Stored until you delete them (no
                  auto-deletion)
                </li>
                <li className="text-sm text-muted-foreground">
                  <strong className="text-foreground">SOS Logs:</strong> Retained for 90 days for your safety reference
                </li>
                <li className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Account Data:</strong> Deleted immediately upon account deletion
                  request
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <FileText className="w-5 h-5 text-muted-foreground" />
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                For privacy-related questions or data requests, contact us at:
                <br />
                <strong className="text-foreground">privacy@protectmesos.app</strong>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
