import { type NextRequest, NextResponse } from "next/server"
import { automationService, slackTemplates } from "@/lib/automation-services"

export async function POST(request: NextRequest) {
  try {
    const { webhookUrl, type, data } = await request.json()

    if (!webhookUrl || !type) {
      return NextResponse.json({ error: "webhookUrl and type are required" }, { status: 400 })
    }

    const template = slackTemplates[type as keyof typeof slackTemplates]
    if (!template) {
      return NextResponse.json({ error: "Invalid notification type" }, { status: 400 })
    }

    // Send Slack notification
    const result = await automationService.sendSlackNotification(webhookUrl, template, data || {})

    console.log(`[API] Slack notification sent: ${type}`)

    return NextResponse.json({
      success: result.success,
      error: result.error,
      sentAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error sending Slack notification:", error)
    return NextResponse.json({ error: "Failed to send Slack notification" }, { status: 500 })
  }
}
