"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Loader2, ArrowLeft, Mail } from "lucide-react"

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitted(true)
    setIsLoading(false)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emergency/10 rounded-full blur-[150px] pointer-events-none" />

        <Card className="relative w-full max-w-md bg-card border-border">
          <CardHeader className="space-y-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mx-auto">
              <Mail className="w-8 h-8 text-success" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">Check your email</CardTitle>
            <CardDescription className="text-muted-foreground">
              {"We've sent a password reset link to "}
              <span className="text-foreground font-medium">{email}</span>
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col gap-4">
            <Button
              onClick={() => setIsSubmitted(false)}
              variant="outline"
              className="w-full border-border text-foreground hover:bg-secondary bg-transparent"
            >
              Try a different email
            </Button>
            <Link href="/login" className="w-full">
              <Button className="w-full bg-emergency hover:bg-emergency/90 text-emergency-foreground">
                Back to sign in
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emergency/10 rounded-full blur-[150px] pointer-events-none" />

      <Card className="relative w-full max-w-md bg-card border-border">
        <CardHeader className="space-y-4 text-center">
          <Link href="/" className="flex items-center justify-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emergency flex items-center justify-center">
              <Shield className="w-6 h-6 text-emergency-foreground" />
            </div>
          </Link>
          <CardTitle className="text-2xl font-bold text-foreground">Forgot password?</CardTitle>
          <CardDescription className="text-muted-foreground">
            {"No worries, we'll send you reset instructions."}
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full bg-emergency hover:bg-emergency/90 text-emergency-foreground h-11"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                "Reset password"
              )}
            </Button>

            <Link
              href="/login"
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to sign in
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
