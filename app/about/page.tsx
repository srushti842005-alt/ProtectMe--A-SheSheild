"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Shield, Users, Award, Globe, Heart, Target } from "lucide-react"
import Link from "next/link"

const team = [
  { name: "Priya Sharma", role: "CEO & Founder", image: "/indian-woman-professional-headshot.png" },
  { name: "Rahul Verma", role: "CTO", image: "/indian-man-tech-professional.jpg" },
  { name: "Anita Desai", role: "Head of Safety", image: "/indian-woman-safety-expert.jpg" },
  { name: "Vikram Patel", role: "Lead Engineer", image: "/indian-man-software-engineer.jpg" },
]

const stats = [
  { value: "500K+", label: "Active Users" },
  { value: "50K+", label: "SOS Alerts Handled" },
  { value: "98%", label: "Response Rate" },
  { value: "15", label: "Cities Covered" },
]

export default function AboutPage() {
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
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-emergency/10 text-emergency border-emergency/20">About Us</Badge>
          <h1 className="text-4xl font-bold text-foreground mb-4">Our Mission is Your Safety</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            ProtectMe was founded with a simple yet powerful vision: to make personal safety accessible to everyone. We
            believe that technology can be a force for good, empowering individuals to feel safe wherever they go.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-6 text-center">
                <p className="text-3xl font-bold text-emergency mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Story */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                ProtectMe was born in 2022 when our founder, Priya Sharma, experienced a frightening situation while
                walking home late at night. She realized that despite having a smartphone, there was no quick way to
                alert her family or get help.
              </p>
              <p>
                This experience sparked the idea for ProtectMe - an app that could transform any smartphone into a
                powerful personal safety device. Working with security experts, law enforcement, and technology
                specialists, we built a comprehensive safety platform.
              </p>
              <p>
                Today, ProtectMe serves over 500,000 users across India and has helped handle more than 50,000 emergency
                situations. Our mission remains the same: to ensure no one ever feels helpless when it comes to their
                personal safety.
              </p>
            </div>
          </div>
          <div className="relative h-80 rounded-xl overflow-hidden">
            <img src="/diverse-team-office.png" alt="ProtectMe Team" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: "Safety First",
                desc: "Every feature we build prioritizes user safety above all else.",
              },
              {
                icon: Heart,
                title: "Empathy",
                desc: "We understand the fear and anxiety that comes with feeling unsafe.",
              },
              {
                icon: Target,
                title: "Innovation",
                desc: "We constantly push the boundaries of what safety technology can do.",
              },
              {
                icon: Users,
                title: "Community",
                desc: "We believe in the power of community to keep each other safe.",
              },
              {
                icon: Globe,
                title: "Accessibility",
                desc: "Safety should be available to everyone, regardless of background.",
              },
              { icon: Award, title: "Excellence", desc: "We strive for excellence in everything we do." },
            ].map((value) => (
              <Card key={value.title}>
                <CardContent className="p-6">
                  <value.icon className="w-10 h-10 text-emergency mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-8">Leadership Team</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {team.map((member) => (
              <Card key={member.name}>
                <CardContent className="p-6 text-center">
                  <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-foreground">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Join Our Mission</h2>
          <p className="text-muted-foreground mb-6">Help us make the world a safer place for everyone.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/careers">
              <Button variant="outline">View Careers</Button>
            </Link>
            <Link href="/contact">
              <Button className="bg-emergency hover:bg-emergency/90">Contact Us</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
