"use client"

import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PrivacyPage() {
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Badge className="mb-4 bg-emergency/10 text-emergency border-emergency/20">Legal</Badge>
        <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: December 1, 2024</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Information We Collect</h2>
            <div className="text-muted-foreground space-y-4">
              <p>
                <strong className="text-foreground">Personal Information:</strong> Name, email address, phone number,
                and emergency contact details when you create an account.
              </p>
              <p>
                <strong className="text-foreground">Location Data:</strong> Real-time GPS location when you activate
                SOS, use Walk With Me, or share your location with contacts.
              </p>
              <p>
                <strong className="text-foreground">Media:</strong> Audio and video recordings captured during emergency
                situations (only when you activate recording features).
              </p>
              <p>
                <strong className="text-foreground">Device Information:</strong> Device type, operating system, and app
                version for technical support purposes.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>To provide emergency services and alert your contacts during SOS activation</li>
              <li>To share your location with trusted contacts and emergency services</li>
              <li>To store evidence securely in your encrypted vault</li>
              <li>To improve our safety features and user experience</li>
              <li>To send you important safety alerts and app updates</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Data Security</h2>
            <div className="text-muted-foreground space-y-4">
              <p>We implement industry-standard security measures to protect your data:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-foreground">AES-256 Encryption:</strong> All stored data is encrypted at rest
                </li>
                <li>
                  <strong className="text-foreground">TLS 1.3:</strong> All data in transit is encrypted
                </li>
                <li>
                  <strong className="text-foreground">Zero-Knowledge Architecture:</strong> Only you can access your
                  evidence vault
                </li>
                <li>
                  <strong className="text-foreground">Regular Security Audits:</strong> Third-party security assessments
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Data Sharing</h2>
            <div className="text-muted-foreground space-y-4">
              <p>We share your data only in these circumstances:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>With your designated emergency contacts when you activate SOS</li>
                <li>With emergency services (police, ambulance) during active emergencies</li>
                <li>When required by law or to protect safety</li>
                <li>
                  We <strong className="text-foreground">never</strong> sell your data to advertisers
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Your Rights</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>
                <strong className="text-foreground">Access:</strong> Request a copy of your personal data
              </li>
              <li>
                <strong className="text-foreground">Correction:</strong> Update or correct your information
              </li>
              <li>
                <strong className="text-foreground">Deletion:</strong> Request deletion of your account and data
              </li>
              <li>
                <strong className="text-foreground">Portability:</strong> Export your data in a standard format
              </li>
              <li>
                <strong className="text-foreground">Opt-out:</strong> Disable non-essential data collection
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Data Retention</h2>
            <div className="text-muted-foreground space-y-4">
              <p>
                We retain your data for as long as your account is active. Evidence vault contents are retained until
                you delete them. After account deletion, we remove your data within 30 days, except where required by
                law.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Contact Us</h2>
            <div className="text-muted-foreground">
              <p>For privacy-related questions or to exercise your rights:</p>
              <p className="mt-2">Email: privacy@protectme.app</p>
              <p>Phone: +91 98765 43210</p>
              <p>Address: 123, Tech Park, Koramangala, Bangalore - 560034</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
