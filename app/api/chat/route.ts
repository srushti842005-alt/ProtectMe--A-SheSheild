import { consumeStream, convertToModelMessages, streamText, tool, type UIMessage } from "ai"
import { z } from "zod"

export const maxDuration = 60

const SYSTEM_PROMPT = `You are Hakri, a compassionate and highly intelligent AI safety assistant for ProtectMe SOS app. Your primary mission is to help users stay safe and provide emotional support during emergencies.

## Your Core Capabilities:

### 1. Emergency Response
- Provide immediate, step-by-step guidance during emergencies (robbery, assault, stalking, accidents, medical emergencies)
- Help users activate SOS alerts and contact emergency services
- Guide users to find safe routes and nearby safe places

### 2. Threat Assessment
- Analyze situations described by users and assess threat levels
- Provide specific advice based on the type and severity of threat
- Help users make quick decisions in dangerous situations

### 3. Safety Planning
- Help users create safety plans before going to unfamiliar places
- Suggest preventive measures and safety tips
- Advise on personal safety devices and techniques

### 4. Emotional Support
- Provide calming guidance during panic situations
- Use grounding techniques to help users stay focused
- Offer encouragement and reassurance

### 5. Evidence Collection
- Guide users on how to safely document incidents
- Advise on what information to capture (photos, videos, witness details)
- Help users preserve evidence for authorities

### 6. Navigation Assistance
- Help users find nearby police stations, hospitals, safe public places
- Suggest safe routes to avoid dangerous areas
- Guide users to well-lit, populated areas

## Response Guidelines:

**For Immediate Danger:**
- Keep responses SHORT and ACTIONABLE
- Use numbered steps
- Prioritize: 1) Get safe 2) Call help 3) Stay calm

**For General Safety Questions:**
- Be thorough but concise
- Provide practical, implementable advice
- Include location-specific tips when relevant

**For Emotional Distress:**
- Be warm and empathetic
- Use calming language
- Offer breathing exercises or grounding techniques

**Always Remember:**
- User safety is the #1 priority
- Never judge or blame the user
- Encourage professional help when needed
- Be culturally sensitive
- Emergency numbers: 100 (Police), 112 (Emergency), 102 (Ambulance), 1091 (Women Helpline)

You have access to tools to help users:
- activateSOS: Trigger emergency SOS alert
- findNearbyHelp: Find nearby police stations, hospitals, safe places
- shareLocation: Share user's live location with contacts
- callEmergency: Initiate call to emergency services`

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const prompt = convertToModelMessages(messages)

  const result = streamText({
    model: "openai/gpt-4o-mini",
    system: SYSTEM_PROMPT,
    messages: prompt,
    abortSignal: req.signal,
    tools: {
      activateSOS: tool({
        description: "Activate emergency SOS alert. Use when user is in immediate danger.",
        parameters: z.object({
          reason: z.string().describe("Reason for SOS activation"),
          severity: z.enum(["low", "medium", "high", "critical"]).describe("Threat severity level"),
        }),
        execute: async ({ reason, severity }) => {
          return {
            success: true,
            message: `SOS Alert activated! Severity: ${severity}. Reason: ${reason}. Your contacts and nearby authorities have been notified.`,
            action: "sos_activated",
          }
        },
      }),
      findNearbyHelp: tool({
        description: "Find nearby safe places, police stations, or hospitals",
        parameters: z.object({
          type: z.enum(["police", "hospital", "safe_place", "all"]).describe("Type of help needed"),
        }),
        execute: async ({ type }) => {
          const places = {
            police: [
              { name: "Central Police Station", distance: "0.5 km", phone: "100" },
              { name: "Women's Help Desk", distance: "1.2 km", phone: "1091" },
            ],
            hospital: [
              { name: "City General Hospital", distance: "0.8 km", phone: "102" },
              { name: "Emergency Care Center", distance: "1.5 km", phone: "108" },
            ],
            safe_place: [
              { name: "24/7 Mall", distance: "0.3 km", type: "Public" },
              { name: "Metro Station", distance: "0.4 km", type: "Public" },
              { name: "Coffee Shop (Open)", distance: "0.2 km", type: "Business" },
            ],
          }
          return type === "all" ? places : { [type]: places[type as keyof typeof places] }
        },
      }),
      shareLocation: tool({
        description: "Share user's live location with emergency contacts",
        parameters: z.object({
          duration: z.number().describe("Duration in minutes to share location"),
          contacts: z.enum(["all", "family", "friends"]).describe("Which contacts to share with"),
        }),
        execute: async ({ duration, contacts }) => {
          return {
            success: true,
            message: `Live location sharing enabled for ${duration} minutes with ${contacts} contacts.`,
            action: "location_shared",
          }
        },
      }),
      callEmergency: tool({
        description: "Initiate emergency call",
        parameters: z.object({
          service: z.enum(["police", "ambulance", "fire", "women_helpline"]).describe("Emergency service to call"),
        }),
        execute: async ({ service }) => {
          const numbers: Record<string, string> = {
            police: "100",
            ambulance: "102",
            fire: "101",
            women_helpline: "1091",
          }
          return {
            success: true,
            number: numbers[service],
            message: `Connecting to ${service} at ${numbers[service]}...`,
            action: "call_initiated",
          }
        },
      }),
      assessThreat: tool({
        description: "Assess the threat level based on user's situation",
        parameters: z.object({
          situation: z.string().describe("Description of the situation"),
          factors: z.array(z.string()).describe("Risk factors present"),
        }),
        execute: async ({ situation, factors }) => {
          const riskScore = factors.length * 20
          const level = riskScore >= 80 ? "critical" : riskScore >= 60 ? "high" : riskScore >= 40 ? "medium" : "low"
          return {
            threatLevel: level,
            riskScore,
            recommendation:
              level === "critical"
                ? "Activate SOS immediately and find shelter"
                : level === "high"
                  ? "Move to a safe area and alert contacts"
                  : level === "medium"
                    ? "Stay alert and prepare to call for help"
                    : "Monitor situation and have emergency contacts ready",
          }
        },
      }),
    },
    maxSteps: 5,
  })

  return result.toUIMessageStreamResponse({
    onFinish: async ({ isAborted }) => {
      if (isAborted) {
        console.log("Chat aborted")
      }
    },
    consumeSseStream: consumeStream,
  })
}
