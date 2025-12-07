import { type NextRequest, NextResponse } from "next/server"

// Store active SOS sessions (in production, use Redis/database)
const activeSOS = new Map<
  string,
  {
    userId: string
    location: { lat: number; lng: number; address: string }
    contacts: string[]
    startTime: string
    lastUpdate: string
  }
>()

export async function POST(request: NextRequest) {
  try {
    const { action, userId, location, contacts, sessionId } = await request.json()

    if (action === "start") {
      // Start new SOS session
      const newSessionId = crypto.randomUUID()
      activeSOS.set(newSessionId, {
        userId,
        location,
        contacts,
        startTime: new Date().toISOString(),
        lastUpdate: new Date().toISOString(),
      })

      console.log("[v0] SOS Session started:", newSessionId)

      return NextResponse.json({
        success: true,
        sessionId: newSessionId,
        message: "SOS session started - contacts notified",
      })
    }

    if (action === "update" && sessionId) {
      // Update location in active session
      const session = activeSOS.get(sessionId)
      if (session) {
        session.location = location
        session.lastUpdate = new Date().toISOString()
        activeSOS.set(sessionId, session)
        console.log("[v0] SOS Location updated:", sessionId)
      }

      return NextResponse.json({
        success: true,
        message: "Location updated",
      })
    }

    if (action === "end" && sessionId) {
      // End SOS session
      activeSOS.delete(sessionId)
      console.log("[v0] SOS Session ended:", sessionId)

      return NextResponse.json({
        success: true,
        message: "SOS session ended safely",
      })
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("[v0] SOS alert error:", error)
    return NextResponse.json({ success: false, error: "Failed to process SOS" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  // Get all active SOS sessions (for admin dashboard)
  const sessions = Array.from(activeSOS.entries()).map(([id, data]) => ({
    sessionId: id,
    ...data,
  }))

  return NextResponse.json({ sessions })
}
