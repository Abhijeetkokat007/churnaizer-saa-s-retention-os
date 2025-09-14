import { type NextRequest, NextResponse } from "next/server"
import { churnaizerAI } from "@/lib/ai-services"

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()

    // Validate required fields
    const requiredFields = ["userId", "lastLogin", "sessionDuration", "featureUsage", "plan", "billingStatus"]
    for (const field of requiredFields) {
      if (userData[field] === undefined) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Generate AI prediction
    const prediction = await churnaizerAI.predictChurn(userData)

    // Store prediction in database (mock implementation)
    const predictionRecord = {
      id: `pred_${Date.now()}`,
      user_id: userData.userId,
      churn_score: prediction.churnScore,
      risk_level: prediction.riskLevel,
      confidence: prediction.confidence,
      key_factors: prediction.keyFactors,
      reasoning: prediction.reasoning,
      model_version: "ai-v1.0",
      created_at: new Date().toISOString(),
    }

    console.log(`[AI] Churn prediction generated for user ${userData.userId}:`, {
      score: prediction.churnScore,
      risk: prediction.riskLevel,
      confidence: prediction.confidence,
    })

    return NextResponse.json({
      success: true,
      prediction: predictionRecord,
    })
  } catch (error) {
    console.error("Error generating churn prediction:", error)
    return NextResponse.json({ error: "Failed to generate prediction" }, { status: 500 })
  }
}
