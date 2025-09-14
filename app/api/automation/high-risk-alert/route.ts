import { type NextRequest, NextResponse } from "next/server"
import { automationService } from "@/lib/automation-services"

export async function POST(request: NextRequest) {
  try {
    const { recipientEmail, userData, recommendations } = await request.json()

    if (!recipientEmail || !userData) {
      return NextResponse.json({ error: "recipientEmail and userData are required" }, { status: 400 })
    }

    // Send high-risk alert
    const result = await automationService.sendHighRiskAlert(recipientEmail, userData, recommendations || [])

    console.log(`[API] High-risk alert sent for user ${userData.user_id}`)

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
      sentAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error sending high-risk alert:", error)
    return NextResponse.json({ error: "Failed to send high-risk alert" }, { status: 500 })
  }
}
