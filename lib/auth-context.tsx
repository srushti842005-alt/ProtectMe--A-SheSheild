"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  email: string
  name: string
  phone?: string
  avatar?: string
  provider?: "email" | "google" | "apple"
  createdAt: Date
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>
  loginWithApple: () => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("protectme_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (email && password.length >= 6) {
      const newUser: User = {
        id: crypto.randomUUID(),
        email,
        name: email.split("@")[0],
        provider: "email",
        createdAt: new Date(),
      }
      setUser(newUser)
      localStorage.setItem("protectme_user", JSON.stringify(newUser))
      return { success: true }
    }

    return { success: false, error: "Invalid email or password" }
  }

  const signup = async (email: string, password: string, name: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (email && password.length >= 6 && name) {
      const newUser: User = {
        id: crypto.randomUUID(),
        email,
        name,
        provider: "email",
        createdAt: new Date(),
      }
      setUser(newUser)
      localStorage.setItem("protectme_user", JSON.stringify(newUser))
      return { success: true }
    }

    return { success: false, error: "Please fill in all fields correctly" }
  }

  const loginWithGoogle = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Simulated Google user data
    const googleUser: User = {
      id: crypto.randomUUID(),
      email: "user@gmail.com",
      name: "Google User",
      avatar: "https://lh3.googleusercontent.com/a/default-user",
      provider: "google",
      createdAt: new Date(),
    }

    setUser(googleUser)
    localStorage.setItem("protectme_user", JSON.stringify(googleUser))
    return { success: true }
  }

  const loginWithApple = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Simulated Apple user data
    const appleUser: User = {
      id: crypto.randomUUID(),
      email: "user@icloud.com",
      name: "Apple User",
      provider: "apple",
      createdAt: new Date(),
    }

    setUser(appleUser)
    localStorage.setItem("protectme_user", JSON.stringify(appleUser))
    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("protectme_user")
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, loginWithGoogle, loginWithApple, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
