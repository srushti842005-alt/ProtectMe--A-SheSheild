"use client"

import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function TermsPage() {
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
        <h1 className="text-4xl font-bold text-foreground mb-4">Terms of Service</h1>
        <p className="text-muted-foreground mb-8">Last updated: December 1, 2024</p>

        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing or using ProtectMe SOS ("the App"), you agree to be bound by these Terms of Service. If you
              do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Description of Service</h2>
            <p className="text-muted-foreground">
              ProtectMe is a personal safety application that provides emergency alert features, location sharing,
              incident reporting, and safety tools. The App is designed to assist users in emergency situations but is
              not a replacement for official emergency services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. User Responsibilities</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Provide accurate information when creating your account</li>
              <li>Keep your login credentials secure</li>
              <li>Use the App responsibly and not for false emergencies</li>
              <li>Ensure your emergency contacts have consented to receive alerts</li>
              <li>Keep the App updated for optimal performance</li>
              <li>Grant necessary permissions (location, camera, microphone) for features to work</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Emergency Services Disclaimer</h2>
            <div className="text-muted-foreground space-y-4">
              <p>
                <strong className="text-foreground">Important:</strong> ProtectMe is not a replacement for official
                emergency services (100, 112, 911). In life-threatening situations, always contact official emergency
                services directly.
              </p>
              <p>
                We make reasonable efforts to connect you with help, but we cannot guarantee response times or
                availability of emergency services. Network connectivity, device issues, and other factors may affect
                the App's functionality.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Prohibited Uses</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Making false emergency reports or fake SOS alerts</li>
              <li>Using the App to harass, stalk, or harm others</li>
              <li>Attempting to hack, reverse-engineer, or exploit the App</li>
              <li>Sharing your account with others</li>
              <li>Using the App for any illegal activities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Subscription & Payments</h2>
            <div className="text-muted-foreground space-y-4">
              <p>
                ProtectMe offers free and premium subscription tiers. Premium features require payment. Subscriptions
                auto-renew unless cancelled. Refunds are available within 30 days of purchase if you're unsatisfied with
                the service.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              To the maximum extent permitted by law, ProtectMe and its affiliates shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages arising from your use of the App. Our total
              liability shall not exceed the amount you paid for the service in the past 12 months.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Account Termination</h2>
            <p className="text-muted-foreground">
              We reserve the right to suspend or terminate accounts that violate these terms. You may delete your
              account at any time through the App settings. Upon termination, your data will be deleted according to our
              Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Changes to Terms</h2>
            <p className="text-muted-foreground">
              We may update these terms from time to time. We will notify you of significant changes via email or in-app
              notification. Continued use of the App after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. Contact</h2>
            <div className="text-muted-foreground">
              <p>For questions about these Terms of Service:</p>
              <p className="mt-2">Email: legal@protectme.app</p>
              <p>Address: 123, Tech Park, Koramangala, Bangalore - 560034</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
