import { Shield, MapPin, Video, Users, Bell, Lock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: Shield,
    title: "One-Tap SOS",
    description: "Instantly trigger emergency mode with a single tap. Bypass all menus for immediate help.",
  },
  {
    icon: Video,
    title: "Auto Recording",
    description: "Automatically capture video, audio, and photos as evidence. Stored securely in the cloud.",
  },
  {
    icon: MapPin,
    title: "Live Location",
    description: "Share your real-time GPS location with trusted contacts and emergency services.",
  },
  {
    icon: Users,
    title: "Trusted Contacts",
    description: "Designate emergency contacts who receive instant alerts with your location and status.",
  },
  {
    icon: Bell,
    title: "AI Detection",
    description: "Smart audio analysis detects screams or distress and auto-triggers alerts if you can't.",
  },
  {
    icon: Lock,
    title: "Encrypted Vault",
    description: "All evidence is encrypted and stored securely. Only you can access it with biometric unlock.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <p className="text-emergency font-medium">Features</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">Safety at every step</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            We believe everyone deserves to feel safe. ProtectMe combines advanced technology with intuitive design to
            keep you protected in any situation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card border-border hover:border-emergency/50 transition-colors group">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-emergency/10 transition-colors">
                  <feature.icon className="w-6 h-6 text-foreground group-hover:text-emergency transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
