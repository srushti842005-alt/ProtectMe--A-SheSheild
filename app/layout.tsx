import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/lib/auth-context"
import { ContactsProvider } from "@/lib/contacts-context"
import { VaultProvider } from "@/lib/vault-context"
import { OfflineProvider } from "@/lib/offline-manager"
import { SafetyTriggersProvider } from "@/lib/safety-triggers-context"
import { OfflineEmergencyPanel } from "@/components/offline-emergency-panel"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ProtectMe SOS - Personal Safety App",
  description:
    "Your personal safety companion. One-tap emergency alerts, live location sharing, and evidence recording to keep you protected.",
  keywords: ["safety app", "emergency SOS", "personal security", "location sharing", "evidence recording"],
  manifest: "/manifest.json",
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#1a1625",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans antialiased`}>
        <OfflineProvider>
          <AuthProvider>
            <ContactsProvider>
              <VaultProvider>
                <SafetyTriggersProvider>
                  {children}
                  <OfflineEmergencyPanel />
                </SafetyTriggersProvider>
              </VaultProvider>
            </ContactsProvider>
          </AuthProvider>
        </OfflineProvider>
        <Analytics />
      </body>
    </html>
  )
}
