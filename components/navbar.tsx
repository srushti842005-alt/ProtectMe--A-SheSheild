"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Shield, Menu, X, ShieldCheck } from "lucide-react"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emergency flex items-center justify-center">
              <Shield className="w-5 h-5 text-emergency-foreground" />
            </div>
            <span className="font-semibold text-lg text-foreground">ProtectMe</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </Link>
            <Link href="#safety" className="text-muted-foreground hover:text-foreground transition-colors">
              Safety
            </Link>
            <Link
              href="/admin/login"
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <ShieldCheck className="w-4 h-4" />
              Admin
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-foreground">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-emergency hover:bg-emergency/90 text-emergency-foreground">Get Started</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-foreground" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <div className="px-4 py-4 space-y-4">
            <Link href="#features" className="block text-muted-foreground hover:text-foreground">
              Features
            </Link>
            <Link href="#how-it-works" className="block text-muted-foreground hover:text-foreground">
              How It Works
            </Link>
            <Link href="#safety" className="block text-muted-foreground hover:text-foreground">
              Safety
            </Link>
            <Link
              href="/admin/login"
              className="block text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <ShieldCheck className="w-4 h-4" />
              Admin Portal
            </Link>
            <div className="pt-4 border-t border-border space-y-2">
              <Link href="/login" className="block">
                <Button variant="ghost" className="w-full text-foreground">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup" className="block">
                <Button className="w-full bg-emergency hover:bg-emergency/90 text-emergency-foreground">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
