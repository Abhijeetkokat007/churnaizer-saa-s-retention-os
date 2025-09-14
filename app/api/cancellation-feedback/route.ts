import { type NextRequest, NextResponse } from "next/server"

// Mock database for cancellation feedback
const mockFeedbackDatabase = new Map()

export async function POST(request: NextRequest) {
  try {
    const feedback = await request.json()
    const { userId, reason, timestamp } = feedback

    // Validate required fields
    if (!userId || !reason || !timestamp) {
      return NextResponse.json({ error: "Missing required fields: userId, reason, timestamp" }, { status: 400 })
    }

    // Store cancellation feedback
    const feedbackRecord = {
      id: generateFeedbackId(),
      user_id: userId,
      reason: reason.trim(),
      category: await categorizeFeedback(reason), // AI categorization placeholder
      feedback_date: new Date(timestamp).toISOString(),
      processed: false,
      created_at: new Date().toISOString(),
    }

    mockFeedbackDatabase.set(feedbackRecord.id, feedbackRecord)

    console.log(`[API] Cancellation feedback received from user: ${userId}`)
    console.log(`[API] Feedback: ${reason.substring(0, 100)}...`)

    return NextResponse.json({
      success: true,
      feedbackId: feedbackRecord.id,
      category: feedbackRecord.category,
    })
  } catch (error) {
    console.error("Error processing cancellation feedback:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (userId) {
      // Get feedback for specific user
      const userFeedback = Array.from(mockFeedbackDatabase.values()).filter(
        (feedback: any) => feedback.user_id === userId,
      )

      return NextResponse.json({ feedback: userFeedback })
    } else {
      // Get all feedback with aggregation
      const allFeedback = Array.from(mockFeedbackDatabase.values())
      const categories = aggregateFeedbackByCategory(allFeedback)

      return NextResponse.json({
        feedback: allFeedback,
        categories: categories,
      })
    }
  } catch (error) {
    console.error("Error retrieving cancellation feedback:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function categorizeFeedback(reason: string): Promise<string> {
  // Simple keyword-based categorization (replace with AI in production)
  const lowerReason = reason.toLowerCase()

  if (lowerReason.includes("price") || lowerReason.includes("cost") || lowerReason.includes("expensive")) {
    return "Pricing"
  } else if (
    lowerReason.includes("feature") ||
    lowerReason.includes("functionality") ||
    lowerReason.includes("missing")
  ) {
    return "Features"
  } else if (
    lowerReason.includes("competitor") ||
    lowerReason.includes("alternative") ||
    lowerReason.includes("better")
  ) {
    return "Competition"
  } else if (lowerReason.includes("support") || lowerReason.includes("help") || lowerReason.includes("service")) {
    return "Support"
  } else if (lowerReason.includes("bug") || lowerReason.includes("error") || lowerReason.includes("broken")) {
    return "Technical Issues"
  } else if (lowerReason.includes("ui") || lowerReason.includes("ux") || lowerReason.includes("interface")) {
    return "User Experience"
  } else {
    return "Other"
  }
}

function aggregateFeedbackByCategory(feedback: any[]): Record<string, number> {
  const categories: Record<string, number> = {}

  feedback.forEach((item: any) => {
    const category = item.category || "Other"
    categories[category] = (categories[category] || 0) + 1
  })

  return categories
}

function generateFeedbackId(): string {
  return `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}
