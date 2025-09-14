import { type NextRequest, NextResponse } from "next/server"
import { churnaizerAI } from "@/lib/ai-services"

export async function POST(request: NextRequest) {
  try {
    const { feedbackText, feedbackId } = await request.json()

    if (!feedbackText) {
      return NextResponse.json({ error: "feedbackText is required" }, { status: 400 })
    }

    // Generate AI categorization
    const analysis = await churnaizerAI.categorizeFeedback(feedbackText)

    // Update feedback record with AI analysis (mock implementation)
    const updatedFeedback = {
      id: feedbackId || `feedback_${Date.now()}`,
      original_text: feedbackText,
      category: analysis.category,
      confidence: analysis.confidence,
      sentiment: analysis.sentiment,
      key_insights: analysis.keyInsights,
      suggested_actions: analysis.suggestedActions,
      processed_at: new Date().toISOString(),
      processed: true,
    }

    console.log(`[AI] Feedback categorized:`, {
      category: analysis.category,
      confidence: analysis.confidence,
      sentiment: analysis.sentiment,
    })

    return NextResponse.json({
      success: true,
      analysis: updatedFeedback,
    })
  } catch (error) {
    console.error("Error categorizing feedback:", error)
    return NextResponse.json({ error: "Failed to categorize feedback" }, { status: 500 })
  }
}
