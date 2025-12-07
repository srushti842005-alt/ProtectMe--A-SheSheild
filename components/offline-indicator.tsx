"use client"

import { useOffline } from "@/lib/offline-manager"
import { Wifi, WifiOff, Cloud, CloudOff } from "lucide-react"

export function OfflineIndicator() {
  const { isOnline, pendingActions } = useOffline()

  return (
    <div
      className={`fixed bottom-20 left-4 z-50 flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium transition-all ${
        isOnline ? "bg-success/20 text-success" : "bg-warning/20 text-warning animate-pulse"
      }`}
    >
      {isOnline ? (
        <>
          <Wifi className="w-3 h-3" />
          <span>Online</span>
          {pendingActions.length > 0 && (
            <span className="flex items-center gap-1">
              <Cloud className="w-3 h-3" />
              Syncing {pendingActions.length}
            </span>
          )}
        </>
      ) : (
        <>
          <WifiOff className="w-3 h-3" />
          <span>Offline Mode</span>
          {pendingActions.length > 0 && (
            <span className="flex items-center gap-1">
              <CloudOff className="w-3 h-3" />
              {pendingActions.length} pending
            </span>
          )}
        </>
      )}
    </div>
  )
}
