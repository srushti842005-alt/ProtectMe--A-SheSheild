"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Shield, Lock, Server, Eye, Key, FileCheck } from "lucide-react"
import Link from "next/link"

const securityFeatures = [
  {
    icon: Lock,
    title: "AES-256 Encryption",
    description: "All your data is encrypted using military-grade AES-256 encryption at rest and in transit.",
  },
  {
    icon: Server,
    title: "Secure Cloud Infrastructure",
    description: "We use AWS with SOC 2 Type II compliance for hosting, ensuring enterprise-grade security.",
  },
  {
    icon: Eye,
    title: "Zero-Knowledge Architecture",
    description: "Your evidence vault uses zero-knowledge encryption - only you can access your files.",
  },
  {
    icon: Key,
    title: "Two-Factor Authentication",
    description: "Protect your account with 2FA using SMS, email, or authenticator apps.",
  },
  {
    icon: Shield,
    title: "Regular Security Audits",
    description: "We conduct quarterly third-party penetration testing and security assessments.",
  },
  {
    icon: FileCheck,
    title: "GDPR & DPDP Compliant",
    description: "We comply with international data protection regulations including GDPR and India's DPDP Act.",
  },
]

export default function SecurityPage() {
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
          <Badge className="mb-4 bg-emergency/10 text-emergency border-emergency/20">Security</Badge>
          <h1 className="text-4xl font-bold text-foreground mb-4">Your Security is Our Priority</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We employ industry-leading security practices to ensure your data and personal safety information remains
            protected at all times.
          </p>
        </div>

        {/* Security Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {securityFeatures.map((feature) => (
            <Card key={feature.title}>
              <CardContent className="p-6">
                <feature.icon className="w-10 h-10 text-emergency mb-4" />
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed Security Info */}
        <div className="max-w-4xl mx-auto space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Data Encryption</h2>
            <div className="text-muted-foreground space-y-4">
              <p>
                Every piece of data you store with ProtectMe is encrypted using AES-256, the same encryption standard
                used by banks and government agencies. This includes:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Personal information and account details</li>
                <li>Location history and GPS coordinates</li>
                <li>Audio and video recordings in your evidence vault</li>
                <li>Emergency contact information</li>
                <li>All communications between the app and our servers</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Evidence Vault Security</h2>
            <div className="text-muted-foreground space-y-4">
              <p>Your evidence vault uses client-side encryption with keys derived from your password. This means:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Files are encrypted before they leave your device</li>
                <li>We cannot access your files - only you have the decryption key</li>
                <li>Even if our servers were compromised, your files remain secure</li>
                <li>Files can only be shared when you explicitly authorize it</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Infrastructure Security</h2>
            <div className="text-muted-foreground space-y-4">
              <p>Our infrastructure is hosted on Amazon Web Services (AWS) with:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>SOC 2 Type II certified data centers</li>
                <li>24/7 security monitoring and intrusion detection</li>
                <li>Automatic failover and disaster recovery</li>
                <li>Data centers located in India for compliance with local regulations</li>
                <li>Regular backups with encrypted storage</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Bug Bounty Program</h2>
            <div className="text-muted-foreground space-y-4">
              <p>
                We run an active bug bounty program rewarding security researchers who responsibly disclose
                vulnerabilities. If you discover a security issue, please report it to:
              </p>
              <p className="font-mono bg-muted p-3 rounded-lg">security@protectme.app</p>
              <p>Rewards range from ₹5,000 to ₹5,00,000 depending on severity.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Compliance & Certifications</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { title: "ISO 27001", desc: "Information Security Management" },
                { title: "SOC 2 Type II", desc: "Security & Availability" },
                { title: "GDPR", desc: "EU Data Protection" },
                { title: "DPDP Act", desc: "India Data Protection" },
              ].map((cert) => (
                <Card key={cert.title}>
                  <CardContent className="p-4 flex items-center gap-3">
                    <Shield className="w-8 h-8 text-green-500" />
                    <div>
                      <p className="font-semibold text-foreground">{cert.title}</p>
                      <p className="text-sm text-muted-foreground">{cert.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
