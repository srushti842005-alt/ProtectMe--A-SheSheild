import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[800px] h-[400px] bg-emergency/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-emergency/10 flex items-center justify-center mx-auto mb-8">
          <Shield className="w-8 h-8 text-emergency" />
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
          Ready to feel safer?
        </h2>

        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Join thousands of users who trust ProtectMe for their personal safety. Download now and set up your emergency
          contacts in minutes.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-emergency hover:bg-emergency/90 text-emergency-foreground h-14 px-10 text-lg"
            >
              Create Free Account
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link href="/login">
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-10 text-lg border-border text-foreground hover:bg-secondary bg-transparent"
            >
              Sign In
            </Button>
          </Link>
        </div>

        <p className="text-sm text-muted-foreground mt-6">
          No credit card required. Free forever for basic protection.
        </p>
      </div>
    </section>
  )
}
