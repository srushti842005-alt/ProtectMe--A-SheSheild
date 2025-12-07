"use client"

import type React from "react"

import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, MapPin, Clock, DollarSign, Check, Loader2, Upload } from "lucide-react"

const jobs: Record<
  string,
  {
    title: string
    department: string
    location: string
    type: string
    salary: string
    description: string
    requirements: string[]
    benefits: string[]
  }
> = {
  "senior-mobile-engineer": {
    title: "Senior Mobile Engineer",
    department: "Engineering",
    location: "Bangalore, India (Hybrid)",
    type: "Full-time",
    salary: "₹25-40 LPA",
    description:
      "We're looking for a Senior Mobile Engineer to lead the development of our React Native mobile application. You'll work on critical safety features that help protect millions of users.",
    requirements: [
      "5+ years of mobile development experience",
      "Expert knowledge of React Native",
      "Experience with real-time features and GPS tracking",
      "Strong understanding of mobile security practices",
      "Experience with TensorFlow Lite or similar ML frameworks",
      "Published apps on both App Store and Play Store",
    ],
    benefits: [
      "Competitive salary with equity",
      "Health insurance for you and family",
      "Flexible work hours",
      "Learning budget ₹50,000/year",
      "Work from home allowance",
      "Mental health support",
    ],
  },
  "product-designer": {
    title: "Product Designer",
    department: "Design",
    location: "Remote (India)",
    type: "Full-time",
    salary: "₹18-28 LPA",
    description:
      "Join our design team to create intuitive and accessible interfaces for our safety platform. You'll design features that work reliably in high-stress emergency situations.",
    requirements: [
      "4+ years of product design experience",
      "Portfolio showing mobile app designs",
      "Experience with accessibility design",
      "Proficiency in Figma",
      "Understanding of user research methods",
      "Experience designing for emergencies/healthcare is a plus",
    ],
    benefits: [
      "Competitive salary",
      "100% remote work",
      "Health insurance",
      "Design tools subscription",
      "Conference attendance budget",
      "Flexible PTO",
    ],
  },
}

export default function JobPage() {
  const params = useParams()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    portfolio: "",
    coverLetter: "",
    resume: null as File | null,
  })

  const jobId = params.id as string
  const job = jobs[jobId]

  if (!job) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Job Not Found</h1>
          <p className="text-muted-foreground mb-4">This position may have been filled or removed.</p>
          <Link href="/careers">
            <Button className="bg-emergency hover:bg-emergency/90">View All Jobs</Button>
          </Link>
        </Card>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitted(true)
    setIsSubmitting(false)

    // Send confirmation email simulation
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(
        `Thank you ${formData.name}! Your application for ${job.title} has been submitted successfully. We'll review it and get back to you within 5-7 business days.`,
      )
      window.speechSynthesis.speak(utterance)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="max-w-md w-full text-center p-8">
          <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-success" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Application Submitted!</h1>
          <p className="text-muted-foreground mb-6">
            Thank you for applying to {job.title}. We've sent a confirmation to {formData.email}. Our team will review
            your application and get back to you within 5-7 business days.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/careers">
              <Button variant="outline">View More Jobs</Button>
            </Link>
            <Link href="/">
              <Button className="bg-emergency hover:bg-emergency/90">Back to Home</Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Careers
        </Button>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="mb-8">
              <span className="text-emergency text-sm font-medium">{job.department}</span>
              <h1 className="text-3xl font-bold text-foreground mt-2 mb-4">{job.title}</h1>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {job.location}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {job.type}
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  {job.salary}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-3">About the Role</h2>
                <p className="text-muted-foreground leading-relaxed">{job.description}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-3">Requirements</h2>
                <ul className="space-y-2">
                  {job.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-muted-foreground">
                      <Check className="w-4 h-4 text-success mt-1 flex-shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-foreground mb-3">Benefits</h2>
                <ul className="space-y-2">
                  {job.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2 text-muted-foreground">
                      <Check className="w-4 h-4 text-emergency mt-1 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div>
            <Card className="sticky top-4 bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Apply Now</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-secondary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-secondary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-secondary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn Profile</Label>
                    <Input
                      id="linkedin"
                      type="url"
                      placeholder="https://linkedin.com/in/..."
                      value={formData.linkedin}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                      className="bg-secondary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="portfolio">Portfolio URL</Label>
                    <Input
                      id="portfolio"
                      type="url"
                      placeholder="https://..."
                      value={formData.portfolio}
                      onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                      className="bg-secondary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="resume">Resume *</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                      <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {formData.resume ? formData.resume.name : "Click or drag to upload PDF"}
                      </p>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => setFormData({ ...formData, resume: e.target.files?.[0] || null })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="coverLetter">Cover Letter</Label>
                    <Textarea
                      id="coverLetter"
                      rows={4}
                      placeholder="Tell us why you're interested..."
                      value={formData.coverLetter}
                      onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                      className="bg-secondary"
                    />
                  </div>

                  <Button type="submit" className="w-full bg-emergency hover:bg-emergency/90" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
