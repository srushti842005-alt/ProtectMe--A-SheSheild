"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MapPin, Clock, Briefcase, ArrowRight, Upload, Check } from "lucide-react"
import Link from "next/link"

const jobs = [
  {
    id: 1,
    title: "Senior React Native Developer",
    department: "Engineering",
    location: "Bangalore",
    type: "Full-time",
    experience: "4-6 years",
    description: "Build and maintain our mobile apps that protect millions of users.",
  },
  {
    id: 2,
    title: "Backend Engineer (Node.js)",
    department: "Engineering",
    location: "Bangalore",
    type: "Full-time",
    experience: "3-5 years",
    description: "Design and implement scalable backend systems for real-time safety features.",
  },
  {
    id: 3,
    title: "Product Manager",
    department: "Product",
    location: "Bangalore",
    type: "Full-time",
    experience: "5-7 years",
    description: "Lead product strategy and roadmap for our safety platform.",
  },
  {
    id: 4,
    title: "UI/UX Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time",
    experience: "3-5 years",
    description: "Create intuitive interfaces for emergency situations.",
  },
  {
    id: 5,
    title: "Customer Support Lead",
    department: "Operations",
    location: "Bangalore",
    type: "Full-time",
    experience: "4-6 years",
    description: "Lead our 24/7 support team handling emergency situations.",
  },
  {
    id: 6,
    title: "ML Engineer",
    department: "Engineering",
    location: "Bangalore",
    type: "Full-time",
    experience: "3-5 years",
    description: "Build AI models for threat detection and safety predictions.",
  },
]

const benefits = [
  "Competitive salary + equity",
  "Health insurance for family",
  "Flexible work hours",
  "Remote work options",
  "Learning budget",
  "Wellness programs",
]

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState<number | null>(null)
  const [applied, setApplied] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    experience: "",
    message: "",
  })

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault()
    const job = jobs.find((j) => j.id === selectedJob)
    const synth = window.speechSynthesis
    synth.speak(
      new SpeechSynthesisUtterance(
        `Thank you ${formData.name} for applying to ${job?.title}. We will review your application and get back to you soon.`,
      ),
    )
    setApplied(true)
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
          <Badge className="mb-4 bg-emergency/10 text-emergency border-emergency/20">Careers</Badge>
          <h1 className="text-4xl font-bold text-foreground mb-4">Join Our Mission</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Help us build technology that saves lives. We're looking for passionate people who want to make a
            difference.
          </p>
        </div>

        {/* Benefits */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground text-center mb-6">Why Work With Us?</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {benefits.map((benefit) => (
              <Card key={benefit}>
                <CardContent className="p-4 text-center">
                  <Check className="w-5 h-5 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-foreground">{benefit}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Jobs */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-bold text-foreground mb-4">Open Positions ({jobs.length})</h2>
            {jobs.map((job) => (
              <Card
                key={job.id}
                className={`cursor-pointer transition-colors ${
                  selectedJob === job.id ? "border-emergency" : "hover:border-muted-foreground"
                }`}
                onClick={() => setSelectedJob(job.id)}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{job.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{job.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">
                          <Briefcase className="w-3 h-3 mr-1" />
                          {job.department}
                        </Badge>
                        <Badge variant="secondary">
                          <MapPin className="w-3 h-3 mr-1" />
                          {job.location}
                        </Badge>
                        <Badge variant="secondary">
                          <Clock className="w-3 h-3 mr-1" />
                          {job.type}
                        </Badge>
                        <Badge variant="outline">{job.experience}</Badge>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Application Form */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>
                  {selectedJob ? `Apply for ${jobs.find((j) => j.id === selectedJob)?.title}` : "Select a Position"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!selectedJob ? (
                  <p className="text-muted-foreground text-center py-8">Click on a job listing to apply</p>
                ) : applied ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">Application Submitted!</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      We'll review your application and contact you soon.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setApplied(false)
                        setSelectedJob(null)
                      }}
                    >
                      Apply for Another Position
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleApply} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full p-3 border border-border rounded-lg bg-background"
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
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Phone *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full p-3 border border-border rounded-lg bg-background"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">LinkedIn Profile</label>
                      <input
                        type="url"
                        value={formData.linkedin}
                        onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                        className="w-full p-3 border border-border rounded-lg bg-background"
                        placeholder="https://linkedin.com/in/..."
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Years of Experience *</label>
                      <input
                        type="text"
                        required
                        value={formData.experience}
                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                        className="w-full p-3 border border-border rounded-lg bg-background"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Resume *</label>
                      <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Click to upload or drag & drop</p>
                        <input type="file" className="hidden" accept=".pdf,.doc,.docx" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1 block">Cover Letter</label>
                      <textarea
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full p-3 border border-border rounded-lg bg-background resize-none"
                        placeholder="Tell us why you're interested..."
                      />
                    </div>
                    <Button type="submit" className="w-full bg-emergency hover:bg-emergency/90">
                      Submit Application
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
