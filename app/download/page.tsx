"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Smartphone, Apple, Download, QrCode, Check, Star } from "lucide-react"
import Link from "next/link"

export default function DownloadPage() {
  const [emailSent, setEmailSent] = useState(false)
  const [email, setEmail] = useState("")
  const [smsSent, setSmsSent] = useState(false)
  const [phone, setPhone] = useState("")

  const handleSendEmail = () => {
    if (email) {
      setEmailSent(true)
      const synth = window.speechSynthesis
      synth.speak(new SpeechSynthesisUtterance(`Download link sent to ${email}`))
    }
  }

  const handleSendSMS = () => {
    if (phone) {
      setSmsSent(true)
      // Open SMS app with pre-filled message
      window.location.href = `sms:${phone}?body=Download%20ProtectMe%20SOS%20App:%20https://protectme.app/download`
    }
  }

  const handlePlayStoreDownload = () => {
    window.open("https://play.google.com/store/apps/details?id=com.protectme.sos", "_blank")
  }

  const handleAppStoreDownload = () => {
    window.open("https://apps.apple.com/app/protectme-sos/id123456789", "_blank")
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
          <Badge className="mb-4 bg-emergency/10 text-emergency border-emergency/20">Download App</Badge>
          <h1 className="text-4xl font-bold text-foreground mb-4">Get ProtectMe on Your Device</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Download our app for the best experience. Available on iOS and Android.
          </p>
        </div>

        {/* Download Options */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {/* Android */}
          <Card className="overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center">
                  <Smartphone className="w-8 h-8 text-green-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Android</h2>
                  <p className="text-muted-foreground">Play Store</p>
                </div>
              </div>
              <div className="space-y-4">
                <Button
                  onClick={handlePlayStoreDownload}
                  className="w-full bg-green-600 hover:bg-green-700 text-white h-12"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download from Play Store
                </Button>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span>4.8 rating • 100K+ downloads</span>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Or scan QR code:</p>
                  <div className="w-32 h-32 mx-auto bg-white rounded-lg flex items-center justify-center">
                    <QrCode className="w-24 h-24 text-foreground" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* iOS */}
          <Card className="overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                  <Apple className="w-8 h-8 text-blue-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">iOS</h2>
                  <p className="text-muted-foreground">App Store</p>
                </div>
              </div>
              <div className="space-y-4">
                <Button
                  onClick={handleAppStoreDownload}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download from App Store
                </Button>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span>4.9 rating • 50K+ downloads</span>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Or scan QR code:</p>
                  <div className="w-32 h-32 mx-auto bg-white rounded-lg flex items-center justify-center">
                    <QrCode className="w-24 h-24 text-foreground" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Send Link */}
        <div className="max-w-2xl mx-auto mb-16">
          <Card>
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-foreground mb-6 text-center">Get Download Link</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Email */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Send via Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full p-3 border border-border rounded-lg bg-background"
                  />
                  <Button onClick={handleSendEmail} className="w-full" disabled={emailSent}>
                    {emailSent ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Link Sent!
                      </>
                    ) : (
                      "Send Email"
                    )}
                  </Button>
                </div>
                {/* SMS */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Send via SMS</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full p-3 border border-border rounded-lg bg-background"
                  />
                  <Button
                    onClick={handleSendSMS}
                    className="w-full bg-transparent"
                    variant="outline"
                    disabled={smsSent}
                  >
                    {smsSent ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        SMS Sent!
                      </>
                    ) : (
                      "Send SMS"
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-foreground text-center mb-8">Why Download Our App?</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Faster SOS", desc: "Trigger emergency alerts in under 2 seconds" },
              { title: "Works Offline", desc: "Core features work without internet connection" },
              { title: "Background Mode", desc: "Protection runs even when app is closed" },
              { title: "Battery Efficient", desc: "Optimized for minimal battery usage" },
              { title: "Native Features", desc: "Access shake detection, GPS, and more" },
              { title: "Instant Alerts", desc: "Push notifications for real-time updates" },
            ].map((feature) => (
              <Card key={feature.title}>
                <CardContent className="p-6">
                  <h4 className="font-semibold text-foreground mb-2">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
