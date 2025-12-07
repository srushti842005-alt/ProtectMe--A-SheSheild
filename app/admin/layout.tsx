"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Shield,
  LayoutDashboard,
  AlertTriangle,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  Radio,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/incidents", label: "Live Incidents", icon: AlertTriangle },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/broadcast", label: "Broadcast", icon: Radio },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminRole, setAdminRole] = useState<string>("police")

  useEffect(() => {
    // Check admin authentication
    const adminAuth = localStorage.getItem("admin_auth")
    if (adminAuth) {
      const parsed = JSON.parse(adminAuth)
      setIsAuthenticated(true)
      setAdminRole(parsed.role || "police")
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("admin_auth")
    window.location.href = "/admin/login"
  }

  if (!isAuthenticated && pathname !== "/admin/login") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-emergency border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (pathname === "/admin/login") {
    return children
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border h-16 flex items-center px-4">
        <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
          <Menu className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-2 ml-4">
          <div className="w-8 h-8 rounded-lg bg-emergency flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-foreground">Admin Panel</span>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-border transform transition-transform lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emergency flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-semibold text-foreground text-sm">ProtectMe</span>
                <p className="text-[10px] text-muted-foreground capitalize">{adminRole} Admin</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-emergency/10 text-emergency"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
                onClick={() => setIsSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Live Alerts Counter */}
          <div className="px-4 py-3 border-t border-border">
            <div className="flex items-center justify-between p-3 rounded-lg bg-emergency/10">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-emergency" />
                <span className="text-sm font-medium text-foreground">Live Alerts</span>
              </div>
              <span className="w-6 h-6 rounded-full bg-emergency text-white text-xs flex items-center justify-center font-bold">
                5
              </span>
            </div>
          </div>

          {/* Logout */}
          <div className="p-4 border-t border-border">
            <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">{children}</main>
    </div>
  )
}
