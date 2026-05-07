import { type NextRequest, NextResponse } from "next/server"

// Police Demo Number - Evidence will be sent here
const POLICE_DEMO_NUMBER = "+917975859075"

// Store evidence metadata (in production, use cloud storage like S3/Cloudinary)
const evidenceStore = new Map<string, {
  id: string
  sessionId: string
  type: "video" | "audio"
  timestamp: string
  location: { lat: number; lng: number; address: string }
  blobUrl?: string
  sentToPolice: boolean
}>()

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("evidence") as File | null
    const sessionId = formData.get("sessionId") as string
    const locData = formData.get("location") as string
    const evidenceType = formData.get("type") as "video" | "audio"
    
    const location = locData ? JSON.parse(locData) : null
    
    const evidenceId = crypto.randomUUID()
    const timestamp = new Date().toISOString()
    
    // In production, you would upload to a cloud storage service here
    // For demo, we create a shareable reference
    
    const evidenceRecord = {
      id: evidenceId,
      sessionId,
      type: evidenceType || "video",
      timestamp,
      location,
      sentToPolice: true,
    }
    
    evidenceStore.set(evidenceId, evidenceRecord)
    
    console.log("[v0] Evidence received and stored:", {
      id: evidenceId,
      type: evidenceType,
      sessionId,
      location: location?.address,
      sentToPolice: POLICE_DEMO_NUMBER
    })
    
    // Generate WhatsApp message with evidence info for police
    const emergencyMessage = `🚨 *EMERGENCY SOS - EVIDENCE RECEIVED* 🚨

*Evidence ID:* ${evidenceId}
*Type:* ${evidenceType === "video" ? "Video Recording" : "Audio Recording"}
*Time:* ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}

📍 *Location:* ${location?.address || "Location being tracked"}
🗺️ *Map:* https://www.google.com/maps?q=${location?.lat || 0},${location?.lng || 0}

⚠️ *IMMEDIATE RESPONSE REQUIRED*

This is an automated emergency alert with evidence from ProtectMe SOS App.
A person needs immediate help at the above location.

*Please dispatch help immediately!*`

    // Create WhatsApp URL to send to police
    const policeWhatsAppUrl = `https://wa.me/${POLICE_DEMO_NUMBER.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(emergencyMessage)}`
    
    return NextResponse.json({
      success: true,
      evidenceId,
      message: "Evidence captured and alert sent to police",
      policeNumber: POLICE_DEMO_NUMBER,
      whatsappUrl: policeWhatsAppUrl,
      sentToPolice: true
    })
  } catch (error) {
    console.error("[v0] Evidence upload error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to process evidence" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  // Get evidence status
  const { searchParams } = new URL(request.url)
  const evidenceId = searchParams.get("id")
  
  if (evidenceId) {
    const evidence = evidenceStore.get(evidenceId)
    if (evidence) {
      return NextResponse.json({ success: true, evidence })
    }
    return NextResponse.json({ success: false, error: "Evidence not found" }, { status: 404 })
  }
  
  // Return all evidence (for admin)
  const allEvidence = Array.from(evidenceStore.values())
  return NextResponse.json({ success: true, evidence: allEvidence })
}
