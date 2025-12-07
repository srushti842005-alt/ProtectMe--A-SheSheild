import type React from "react"
import { cn } from "@/lib/utils"

interface StatusCardProps {
  title: string
  value: string | number
  description?: string
  icon: React.ReactNode
  variant?: "default" | "success" | "warning" | "danger"
}

export function StatusCard({ title, value, description, icon, variant = "default" }: StatusCardProps) {
  return (
    <div className="p-6 rounded-2xl bg-card border border-border">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p
            className={cn(
              "text-2xl font-bold",
              variant === "success" && "text-success",
              variant === "warning" && "text-yellow-500",
              variant === "danger" && "text-destructive",
              variant === "default" && "text-foreground",
            )}
          >
            {value}
          </p>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            variant === "success" && "bg-success/10 text-success",
            variant === "warning" && "bg-yellow-500/10 text-yellow-500",
            variant === "danger" && "bg-destructive/10 text-destructive",
            variant === "default" && "bg-secondary text-foreground",
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  )
}
