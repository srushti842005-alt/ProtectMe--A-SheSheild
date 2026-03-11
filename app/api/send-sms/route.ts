import { type NextRequest, NextResponse } from "next/server"

// SMS API endpoint - integrates with Fast2SMS for India
export async function POST(request: NextRequest) {
  try {
    const { phone, message, location } = await request.json()

    // Clean phone number - remove non-digits except +
    let cleanPhone = phone.replace(/[^0-9+]/g, "")
    
    // For Indian numbers, ensure 10-digit format for Fast2SMS
    if (cleanPhone.startsWith("+91")) {
      cleanPhone = cleanPhone.slice(3)
    } else if (cleanPhone.startsWith("91") && cleanPhone.length === 12) {
      cleanPhone = cleanPhone.slice(2)
    }

    // Store SOS alert
    const alert = {
      id: crypto.randomUUID(),
      phone: cleanPhone,
      message,
      location,
      timestamp: new Date().toISOString(),
      status: "pending",
    }

    console.log("[SOS] Sending SMS to:", cleanPhone)

    // Try Fast2SMS API (India's popular SMS gateway)
    const fast2smsKey = process.env.FAST2SMS_API_KEY
    
    if (fast2smsKey && cleanPhone.length === 10) {
      try {
        // Format SOS message for SMS (plain text, no emojis for reliability)
        const smsText = `EMERGENCY SOS ALERT! Someone needs immediate help!\n\nLocation: ${location?.address || "Unknown"}\nMap: https://maps.google.com/?q=${location?.lat},${location?.lng}\nTime: ${new Date().toLocaleTimeString()}\n\nPlease respond immediately or call police!`

        const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
          method: "POST",
          headers: {
            "authorization": fast2smsKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            route: "q", // Quick SMS route
            message: smsText.slice(0, 160), // SMS limit
            language: "english",
            flash: 0,
            numbers: cleanPhone,
          }),
        })

        const result = await response.json()
        console.log("[SOS] Fast2SMS response:", result)

        if (result.return === true) {
          return NextResponse.json({
            success: true,
            alertId: alert.id,
            message: "SMS sent successfully via Fast2SMS",
            provider: "fast2sms",
          })
        }
      } catch (smsError) {
        console.error("[SOS] Fast2SMS error:", smsError)
      }
    }

    // Try Twilio if configured
    const twilioSid = process.env.TWILIO_ACCOUNT_SID
    const twilioToken = process.env.TWILIO_AUTH_TOKEN
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER

    if (twilioSid && twilioToken && twilioPhone) {
      try {
        const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`
        const auth = Buffer.from(`${twilioSid}:${twilioToken}`).toString("base64")

        const smsText = `EMERGENCY SOS! Someone needs help!\nLocation: ${location?.address || "Unknown"}\nMap: https://maps.google.com/?q=${location?.lat},${location?.lng}`

        const formData = new URLSearchParams()
        formData.append("To", phone.startsWith("+") ? phone : `+91${cleanPhone}`)
        formData.append("From", twilioPhone)
        formData.append("Body", smsText)

        const response = await fetch(twilioUrl, {
          method: "POST",
          headers: {
            "Authorization": `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
        })

        const result = await response.json()
        console.log("[SOS] Twilio response:", result.sid ? "Success" : result.message)

        if (result.sid) {
          return NextResponse.json({
            success: true,
            alertId: alert.id,
            message: "SMS sent successfully via Twilio",
            provider: "twilio",
            sid: result.sid,
          })
        }
      } catch (twilioError) {
        console.error("[SOS] Twilio error:", twilioError)
      }
    }

    // Fallback: Log alert (SMS providers not configured)
    console.log("[SOS] Alert logged (no SMS provider configured):", alert)
    
    return NextResponse.json({
      success: true,
      alertId: alert.id,
      message: "Alert registered. Configure FAST2SMS_API_KEY or TWILIO credentials for actual SMS delivery.",
      provider: "logged",
    })
  } catch (error) {
    console.error("[SOS] SMS send error:", error)
    return NextResponse.json({ success: false, error: "Failed to send SMS" }, { status: 500 })
  }
}
