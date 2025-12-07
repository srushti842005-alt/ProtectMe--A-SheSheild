"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, Eye, EyeOff, AlertTriangle } from "lucide-react"

const ADMIN_CREDENTIALS = {
  police: { username: "police_admin", password: "police123", name: "Police Station" },
  ias: { username: "ias_admin", password: "ias123", name: "IAS Officer" },
  safety: { username: "safety_admin", password: "safety123", name: "City Safety Officer" },
}

export default function AdminLoginPage() {
  const router = useRouter()
  const [role, setRole] = useState<string>("police")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000))

    const creds = ADMIN_CREDENTIALS[role as keyof typeof ADMIN_CREDENTIALS]
    if (username === creds.username && password === creds.password) {
      localStorage.setItem("admin_auth", JSON.stringify({ role, name: creds.name }))
      router.push("/admin")
    } else {
      setError("Invalid credentials. Please try again.")
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emergency flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl text-foreground">Admin Portal</CardTitle>
            <CardDescription>ProtectMe Emergency Management System</CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                <AlertTriangle className="w-4 h-4" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label>Select Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="police">Police Station Admin</SelectItem>
                  <SelectItem value="ias">IAS Officer</SelectItem>
                  <SelectItem value="safety">City Safety Officer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Username</Label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="border-border"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="border-border pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-emergency hover:bg-emergency/90" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In to Admin Panel"}
            </Button>

            <div className="text-xs text-muted-foreground text-center space-y-1 pt-4 border-t border-border">
              <p className="font-medium">Demo Credentials:</p>
              <p>Police: police_admin / police123</p>
              <p>IAS: ias_admin / ias123</p>
              <p>Safety: safety_admin / safety123</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
