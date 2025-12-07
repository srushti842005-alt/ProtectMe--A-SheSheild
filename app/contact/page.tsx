"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Mail, Phone, MapPin, MessageSquare, Clock, Send, Check } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function ContactPage() {
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: searchParams.get("subject") || "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [calling, setCalling] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate form submission
    const synth = window.speechSynthesis
    synth.speak(
      new SpeechSynthesisUtterance(
        `Thank you ${formData.name}. Your message has been received. Our team will get back to you within 24 hours.`,
      ),
    )
    setSubmitted(true)
  }

  const handleCall = (number: string) => {
    setCalling(true)
    window.location.href = `tel:${number}`
  }

  const handleWhatsApp = () => {
    const message = encodeURIComponent("Hi, I need help with ProtectMe app.")
    window.open(`https://wa.me/919876543210?text=${message}`, "_blank")
  }

  const handleEmail = () => {
    window.location.href = "mailto:support@protectme.app?subject=Support%20Request"
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
          <Badge className="mb-4 bg-emergency/10 text-emergency border-emergency/20">Contact Us</Badge>
          <h1 className="text-4xl font-bold text-foreground mb-4">Get in Touch</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions? We're here to help 24/7. Reach out through any channel below.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <Card
              className="cursor-pointer hover:border-emergency transition-colors"
              onClick={() => handleCall("+919876543210")}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-emergency/10 flex items-center justify-center">
                  <Phone className="w-6 h-6 text-emergency" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Call Us</h3>
                  <p className="text-sm text-muted-foreground">+91 98765 43210</p>
                  <p className="text-xs text-muted-foreground">Tap to call</p>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:border-emergency transition-colors" onClick={handleWhatsApp}>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">WhatsApp</h3>
                  <p className="text-sm text-muted-foreground">Chat with us</p>
                  <p className="text-xs text-muted-foreground">Tap to open</p>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:border-emergency transition-colors" onClick={handleEmail}>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Email</h3>
                  <p className="text-sm text-muted-foreground">support@protectme.app</p>
                  <p className="text-xs text-muted-foreground">Tap to send email</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Office</h3>
                  <p className="text-sm text-muted-foreground">
                    123, Tech Park, Koramangala
                    <br />
                    Bangalore - 560034
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Hours</h3>
                  <p className="text-sm text-muted-foreground">
                    Support: 24/7
                    <br />
                    Office: Mon-Fri 9AM-6PM
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground mb-6">
                      Thank you for contacting us. We'll get back to you within 24 hours.
                    </p>
                    <Button onClick={() => setSubmitted(false)} variant="outline">
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1 block">Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full p-3 border border-border rounded-lg bg-background"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1 block">Email *</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full p-3 border border-border rounded-lg bg-background"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1 block">Phone</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full p-3 border border-border rounded-lg bg-background"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1 block">Subject *</label>
                        <select
                          required
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="w-full p-3 border border-border rounded-lg bg-background"
                        >
                          <option value="">Select a topic</option>
                          <option value="General Inquiry">General Inquiry</option>
                          <option value="Technical Support">Technical Support</option>
                          <option value="Billing">Billing</option>
                          <option value="Partnership">Partnership</option>
                          <option value="Enterprise Pricing">Enterprise Pricing</option>
                          <option value="Feedback">Feedback</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Message *</label>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full p-3 border border-border rounded-lg bg-background resize-none"
                        placeholder="How can we help you?"
                      />
                    </div>
                    <Button type="submit" className="w-full bg-emergency hover:bg-emergency/90">
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
