import { type NextRequest, NextResponse } from "next/server"
import { automationService } from "@/lib/automation-services"

export async function POST(request: NextRequest) {
  try {
    const { userEmail, userData } = await request.json()

    if (!userEmail) {
      return NextResponse.json({ error: "userEmail is required" }, { status: 400 })
    }

    // Send reactivation email
    const result = await automationService.sendReactivationEmail(userEmail, userData || {})

    console.log(`[API] Reactivation email sent to ${userEmail}`)

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
      sentAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error sending reactivation email:", error)
    return NextResponse.json({ error: "Failed to send reactivation email" }, { status: 500 })
  }
}
