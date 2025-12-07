import { Check } from "lucide-react"

const steps = [
  {
    number: "01",
    title: "Activate SOS",
    description: "Press the SOS button or use a discreet trigger like triple-tapping your phone.",
    details: ["One-tap emergency activation", "Voice command support", "Discreet shake trigger option"],
  },
  {
    number: "02",
    title: "Auto Record & Upload",
    description: "Camera and microphone start instantly, uploading evidence to secure cloud in real-time.",
    details: ["Live video streaming", "Audio recording with timestamp", "GPS location tracking"],
  },
  {
    number: "03",
    title: "Alert Contacts",
    description: "Your trusted contacts receive instant alerts with your location and live feed.",
    details: ["SMS and push notifications", "Live location sharing", "Emergency service integration"],
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <p className="text-emergency font-medium">How It Works</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">Help in seconds, not minutes</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            When every second counts, ProtectMe ensures help is on the way immediately. Our streamlined process
            minimizes response time.
          </p>
        </div>

        <div className="space-y-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="grid md:grid-cols-[120px_1fr] gap-6 p-6 rounded-2xl bg-card border border-border hover:border-emergency/30 transition-colors"
            >
              <div className="text-5xl font-bold text-emergency/30">{step.number}</div>
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-foreground">{step.title}</h3>
                <p className="text-muted-foreground text-lg">{step.description}</p>
                <div className="flex flex-wrap gap-4 pt-2">
                  {step.details.map((detail, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-foreground">
                      <div className="w-5 h-5 rounded-full bg-emergency/10 flex items-center justify-center">
                        <Check className="w-3 h-3 text-emergency" />
                      </div>
                      {detail}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
