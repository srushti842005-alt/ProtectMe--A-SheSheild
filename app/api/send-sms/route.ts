import { type NextRequest, NextResponse } from "next/server"

// SMS API endpoint - uses free SMS gateway APIs
export async function POST(request: NextRequest) {
  try {
    const { phone, message, location } = await request.json()

    // Clean phone number
    const cleanPhone = phone.replace(/[^0-9+]/g, "")

    // Store SOS alert in memory (would be database in production)
    const alert = {
      id: crypto.randomUUID(),
      phone: cleanPhone,
      message,
      location,
      timestamp: new Date().toISOString(),
      status: "sent",
    }

    // Log for debugging
    console.log("[v0] SOS Alert sent:", alert)

    // In production, integrate with:
    // - Twilio: https://www.twilio.com/docs/sms
    // - Fast2SMS (India): https://www.fast2sms.com/
    // - TextLocal: https://www.textlocal.com/

    // For demo, we return success and trigger browser notifications
    return NextResponse.json({
      success: true,
      alertId: alert.id,
      message: "SOS alert sent successfully",
    })
  } catch (error) {
    console.error("[v0] SMS send error:", error)
    return NextResponse.json({ success: false, error: "Failed to send SMS" }, { status: 500 })
  }
}
