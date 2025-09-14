import { type NextRequest, NextResponse } from "next/server"

// Mock recommendations database
const mockRecommendations = new Map([
  [
    "user_003",
    [
      {
        id: "rec_001",
        type: "email",
        title: "Send Reactivation Email",
        description: "User hasn't logged in for 7 days. Send feature highlights email.",
        priority: 5,
        status: "pending",
        estimatedImpact: "High",
        actionUrl: "/send-email/reactivation",
      },
      {
        id: "rec_002",
        type: "discount",
        title: "Offer Retention Discount",
        description: "Provide 20% discount for next 3 months to prevent churn.",
        priority: 4,
        status: "pending",
        estimatedImpact: "Medium",
        actionUrl: "/billing/apply-discount",
      },
    ],
  ],
  [
    "user_008",
    [
      {
        id: "rec_003",
        type: "call",
        title: "Priority Customer Success Call",
        description: "High churn risk. Schedule immediate call to understand needs.",
        priority: 5,
        status: "pending",
        estimatedImpact: "High",
        actionUrl: "/schedule-call",
      },
    ],
  ],
  [
    "user_006",
    [
      {
        id: "rec_004",
        type: "feature_adoption",
        title: "Feature Adoption Email",
        description: "User only uses basic features. Introduce advanced capabilities.",
        priority: 2,
        status: "pending",
        estimatedImpact: "Medium",
        actionUrl: "/send-email/feature-adoption",
      },
    ],
  ],
])

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const userId = params.userId
    const recommendations = mockRecommendations.get(userId) || []

    return NextResponse.json({
      userId: userId,
      recommendations: recommendations,
      count: recommendations.length,
    })
  } catch (error) {
    console.error("Error fetching recommendations:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const userId = params.userId
    const { recommendationId, action } = await request.json()

    if (!recommendationId || !action) {
      return NextResponse.json({ error: "Missing recommendationId or action" }, { status: 400 })
    }

    // Update recommendation status
    const userRecommendations = mockRecommendations.get(userId) || []
    const recommendation = userRecommendations.find((r) => r.id === recommendationId)

    if (!recommendation) {
      return NextResponse.json({ error: "Recommendation not found" }, { status: 404 })
    }

    // Process the action
    switch (action) {
      case "execute":
        recommendation.status = "executed"
        console.log(`[API] Executing recommendation ${recommendationId} for user ${userId}`)
        break
      case "dismiss":
        recommendation.status = "dismissed"
        console.log(`[API] Dismissing recommendation ${recommendationId} for user ${userId}`)
        break
      case "snooze":
        recommendation.status = "snoozed"
        console.log(`[API] Snoozing recommendation ${recommendationId} for user ${userId}`)
        break
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      recommendation: recommendation,
    })
  } catch (error) {
    console.error("Error updating recommendation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
