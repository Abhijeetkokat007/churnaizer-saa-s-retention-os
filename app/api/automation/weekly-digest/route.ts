import { type NextRequest, NextResponse } from "next/server"
import { automationService } from "@/lib/automation-services"

export async function POST(request: NextRequest) {
  try {
    const { recipientEmail, dashboardData } = await request.json()

    if (!recipientEmail) {
      return NextResponse.json({ error: "recipientEmail is required" }, { status: 400 })
    }

    // Send weekly digest
    const result = await automationService.sendWeeklyDigest(recipientEmail, dashboardData)

    console.log(`[API] Weekly digest sent to ${recipientEmail}`)

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
      sentAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error sending weekly digest:", error)
    return NextResponse.json({ error: "Failed to send weekly digest" }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Trigger weekly digest for all admins
    const dashboardResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/dashboard`)
    const dashboardData = await dashboardResponse.json()

    const adminEmails = ["admin@company.com", "founder@company.com"] // Mock admin emails

    const results = []
    for (const email of adminEmails) {
      const result = await automationService.sendWeeklyDigest(email, dashboardData)
      results.push({ email, success: result.success })
    }

    return NextResponse.json({
      success: true,
      results: results,
      sentAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error sending weekly digests:", error)
    return NextResponse.json({ error: "Failed to send weekly digests" }, { status: 500 })
  }
}
