import { type NextRequest, NextResponse } from "next/server"
import { churnaizerAI } from "@/lib/ai-services"

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()

    // Validate required fields
    if (!userData.userId || !userData.email || userData.churnScore === undefined) {
      return NextResponse.json({ error: "Missing required fields: userId, email, churnScore" }, { status: 400 })
    }

    // Generate AI recommendations
    const recommendations = await churnaizerAI.generateRecommendations(userData)

    // Store recommendations in database (mock implementation)
    const storedRecommendations = recommendations.recommendations.map((rec, index) => ({
      id: `rec_${userData.userId}_${Date.now()}_${index}`,
      user_id: userData.userId,
      type: rec.type,
      title: rec.title,
      description: rec.description,
      priority: rec.priority,
      estimated_impact: rec.estimatedImpact,
      timeframe: rec.timeframe,
      action_steps: rec.actionSteps,
      status: "pending",
      created_at: new Date().toISOString(),
    }))

    console.log(`[AI] Generated ${recommendations.recommendations.length} recommendations for user ${userData.userId}`)

    return NextResponse.json({
      success: true,
      recommendations: storedRecommendations,
      strategy: recommendations.overallStrategy,
      urgency: recommendations.urgency,
    })
  } catch (error) {
    console.error("Error generating recommendations:", error)
    return NextResponse.json({ error: "Failed to generate recommendations" }, { status: 500 })
  }
}
