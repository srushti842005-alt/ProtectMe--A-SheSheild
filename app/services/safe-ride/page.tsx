"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import {
  Car,
  Shield,
  MapPin,
  Phone,
  Star,
  Clock,
  Users,
  ChevronLeft,
  Check,
  AlertTriangle,
  Navigation,
  Share2,
  X,
} from "lucide-react"
import Link from "next/link"

export default function SafeRidePage() {
  const [pickup, setPickup] = useState("")
  const [destination, setDestination] = useState("")
  const [bookingStep, setBookingStep] = useState<"form" | "searching" | "found" | "confirmed">("form")
  const [selectedRide, setSelectedRide] = useState<string | null>(null)
  const [pickupSuggestions, setPickupSuggestions] = useState<any[]>([])
  const [destSuggestions, setDestSuggestions] = useState<any[]>([])
  const [isCallDialogOpen, setIsCallDialogOpen] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [isTripShared, setIsTripShared] = useState(false)

  const rideOptions = [
    { id: "economy", name: "SafeRide Go", price: "₹120", time: "5 min", rating: 4.8 },
    { id: "premium", name: "SafeRide Plus", price: "₹180", time: "3 min", rating: 4.9 },
    { id: "suv", name: "SafeRide XL", price: "₹250", time: "8 min", rating: 4.7 },
  ]

  const searchLocation = async (query: string, type: "pickup" | "dest") => {
    if (query.length < 3) {
      type === "pickup" ? setPickupSuggestions([]) : setDestSuggestions([])
      return
    }
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
      )
      const data = await response.json()
      type === "pickup" ? setPickupSuggestions(data) : setDestSuggestions(data)
    } catch (error) {
      console.error("Location search error:", error)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => searchLocation(pickup, "pickup"), 300)
    return () => clearTimeout(timer)
  }, [pickup])

  useEffect(() => {
    const timer = setTimeout(() => searchLocation(destination, "dest"), 300)
    return () => clearTimeout(timer)
  }, [destination])

  const handleBookRide = () => {
    if (!pickup || !destination) return
    setBookingStep("searching")
    setTimeout(() => setBookingStep("found"), 2000)
  }

  const handleConfirmRide = () => {
    if (!selectedRide) return
    setBookingStep("confirmed")
  }

  const handleCallDriver = () => {
    setIsCallDialogOpen(true)
    setCallDuration(0)
    const interval = setInterval(() => setCallDuration((prev) => prev + 1), 1000)

    // Speak as driver
    const speech = new SpeechSynthesisUtterance(
      "Hello, this is Priya from SafeRide. I'm on my way to your pickup location. I'll be there in about 3 minutes. My car is a white Swift with number plate KA 01 AB 1234.",
    )
    speech.rate = 0.9
    speechSynthesis.speak(speech)

    return () => clearInterval(interval)
  }

  const handleShareTrip = async () => {
    const tripDetails = `I'm taking a SafeRide!\n\nDriver: Priya Sharma\nCar: White Swift (KA 01 AB 1234)\nFrom: ${pickup}\nTo: ${destination}\n\nTrack my trip: https://saferide.app/track/TRIP${Date.now()}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: "SafeRide Trip",
          text: tripDetails,
        })
        setIsTripShared(true)
      } catch (err) {
        // Fallback to WhatsApp
        window.open(`https://wa.me/?text=${encodeURIComponent(tripDetails)}`, "_blank")
        setIsTripShared(true)
      }
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(tripDetails)}`, "_blank")
      setIsTripShared(true)
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4">
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
              <Car className="w-8 h-8" />
            </div>
            <div>
              <Badge className="bg-white/20 text-white mb-2">Partner Service</Badge>
              <h1 className="text-3xl font-bold">SafeRide</h1>
              <p className="text-white/80">Women's Safety Cab Service</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Booking Form */}
          <div className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Book a Safe Ride</CardTitle>
                <CardDescription>All drivers are verified women with background checks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {bookingStep === "form" && (
                  <>
                    <div className="space-y-2 relative">
                      <Label>Pickup Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Enter pickup location"
                          className="pl-10"
                          value={pickup}
                          onChange={(e) => setPickup(e.target.value)}
                        />
                      </div>
                      {pickupSuggestions.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                          {pickupSuggestions.map((s, i) => (
                            <button
                              key={i}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-muted truncate"
                              onClick={() => {
                                setPickup(s.display_name)
                                setPickupSuggestions([])
                              }}
                            >
                              {s.display_name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2 relative">
                      <Label>Destination</Label>
                      <div className="relative">
                        <Navigation className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Where to?"
                          className="pl-10"
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                        />
                      </div>
                      {destSuggestions.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                          {destSuggestions.map((s, i) => (
                            <button
                              key={i}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-muted truncate"
                              onClick={() => {
                                setDestination(s.display_name)
                                setDestSuggestions([])
                              }}
                            >
                              {s.display_name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button
                      className="w-full bg-gradient-to-r from-pink-500 to-rose-500"
                      onClick={handleBookRide}
                      disabled={!pickup || !destination}
                    >
                      Find Safe Rides
                    </Button>
                  </>
                )}

                {bookingStep === "searching" && (
                  <div className="py-12 text-center">
                    <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-lg font-medium">Finding nearby SafeRide drivers...</p>
                    <p className="text-sm text-muted-foreground">All drivers are verified women</p>
                  </div>
                )}

                {bookingStep === "found" && (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">Select a ride option:</p>
                    {rideOptions.map((ride) => (
                      <div
                        key={ride.id}
                        onClick={() => setSelectedRide(ride.id)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedRide === ride.id
                            ? "border-pink-500 bg-pink-500/10"
                            : "border-border hover:border-pink-500/50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">{ride.name}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="w-3 h-3" /> {ride.time} away
                              <Star className="w-3 h-3 text-yellow-500" /> {ride.rating}
                            </div>
                          </div>
                          <p className="text-xl font-bold text-pink-500">{ride.price}</p>
                        </div>
                      </div>
                    ))}
                    <Button
                      className="w-full bg-gradient-to-r from-pink-500 to-rose-500"
                      onClick={handleConfirmRide}
                      disabled={!selectedRide}
                    >
                      Confirm Booking
                    </Button>
                  </div>
                )}

                {bookingStep === "confirmed" && (
                  <div className="py-8 text-center space-y-4">
                    <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                      <Check className="w-10 h-10 text-green-500" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-green-500">Ride Confirmed!</p>
                      <p className="text-muted-foreground">Your driver Priya is on her way</p>
                    </div>
                    <Card className="bg-muted/50">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold">
                            P
                          </div>
                          <div className="text-left">
                            <p className="font-semibold">Priya Sharma</p>
                            <p className="text-sm text-muted-foreground">KA 01 AB 1234 • White Swift</p>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500" />
                              <span className="text-sm">4.9 • 2,345 rides</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1 bg-transparent" onClick={handleCallDriver}>
                        <Phone className="w-4 h-4 mr-2" />
                        Call Driver
                      </Button>
                      <Button
                        className={`flex-1 ${isTripShared ? "bg-green-600" : "bg-green-600 hover:bg-green-700"}`}
                        onClick={handleShareTrip}
                      >
                        {isTripShared ? <Check className="w-4 h-4 mr-2" /> : <Share2 className="w-4 h-4 mr-2" />}
                        {isTripShared ? "Shared!" : "Share Trip"}
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => {
                        setBookingStep("form")
                        setSelectedRide(null)
                        setIsTripShared(false)
                      }}
                    >
                      Book Another Ride
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Why SafeRide?</h2>
            <div className="grid gap-4">
              {[
                {
                  icon: Users,
                  title: "Female Drivers Only",
                  desc: "All our drivers are verified women with extensive background checks",
                },
                {
                  icon: Shield,
                  title: "SOS in Every Cab",
                  desc: "One-tap SOS button connected to police and your emergency contacts",
                },
                {
                  icon: MapPin,
                  title: "Live Trip Sharing",
                  desc: "Share your live location with family throughout the trip",
                },
                {
                  icon: AlertTriangle,
                  title: "Route Deviation Alerts",
                  desc: "Automatic alerts if the driver deviates from the planned route",
                },
              ].map((feature, i) => (
                <Card key={i} className="border-border">
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center">
                      <feature.icon className="w-5 h-5 text-pink-500" />
                    </div>
                    <div>
                      <p className="font-semibold">{feature.title}</p>
                      <p className="text-sm text-muted-foreground">{feature.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-pink-500/50 bg-pink-500/5">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-2">Special Offer for ProtectMe Users</p>
                <p className="text-2xl font-bold text-pink-500">20% OFF</p>
                <p className="text-sm">
                  Use code: <span className="font-mono bg-pink-500/20 px-2 py-1 rounded">PROTECTME20</span>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Call Dialog */}
      <Dialog open={isCallDialogOpen} onOpenChange={setIsCallDialogOpen}>
        <DialogContent className="max-w-sm">
          <div className="text-center py-8 space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-pink-500/20 flex items-center justify-center">
              <Phone className="w-10 h-10 text-pink-500 animate-pulse" />
            </div>
            <div>
              <p className="text-lg font-semibold">Priya Sharma</p>
              <p className="text-sm text-muted-foreground">SafeRide Driver</p>
            </div>
            <p className="text-3xl font-mono">{formatDuration(callDuration)}</p>
            <Button
              className="bg-red-500 hover:bg-red-600 w-full"
              onClick={() => {
                speechSynthesis.cancel()
                setIsCallDialogOpen(false)
              }}
            >
              <X className="w-4 h-4 mr-2" />
              End Call
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
