import { type NextRequest, NextResponse } from "next/server"

// Mock churn prediction data
const mockChurnPredictions = [
  {
    user_id: "user_001",
    email: "john@startup.com",
    plan: "Pro",
    churn_score: 0.15,
    risk_level: "low",
    last_login: "2024-01-15T08:30:00Z",
    factors: [
      { factor: "Recent Login", impact: "positive", weight: 0.3 },
      { factor: "Feature Usage", impact: "positive", weight: 0.25 },
      { factor: "Support Tickets", impact: "neutral", weight: 0.0 },
    ],
  },
  {
    user_id: "user_003",
    email: "mike@saasapp.com",
    plan: "Basic",
    churn_score: 0.85,
    risk_level: "high",
    last_login: "2024-01-08T14:20:00Z",
    factors: [
      { factor: "Inactive for 7+ days", impact: "negative", weight: 0.4 },
      { factor: "Low Feature Usage", impact: "negative", weight: 0.3 },
      { factor: "Multiple Support Tickets", impact: "negative", weight: 0.15 },
    ],
  },
  {
    user_id: "user_008",
    email: "rachel@create.com",
    plan: "Basic",
    churn_score: 0.75,
    risk_level: "high",
    last_login: "2024-01-01T09:15:00Z",
    factors: [
      { factor: "Inactive for 14+ days", impact: "negative", weight: 0.5 },
      { factor: "Billing Issues", impact: "negative", weight: 0.2 },
      { factor: "Low Engagement", impact: "negative", weight: 0.05 },
    ],
  },
  {
    user_id: "user_006",
    email: "emma@innovate.com",
    plan: "Basic",
    churn_score: 0.3,
    risk_level: "medium",
    last_login: "2024-01-15T11:45:00Z",
    factors: [
      { factor: "Recent Login", impact: "positive", weight: 0.2 },
      { factor: "Limited Feature Usage", impact: "negative", weight: 0.1 },
    ],
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const riskLevel = searchParams.get("riskLevel")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    let filteredPredictions = mockChurnPredictions

    // Filter by risk level if specified
    if (riskLevel && ["low", "medium", "high"].includes(riskLevel)) {
      filteredPredictions = mockChurnPredictions.filter((prediction) => prediction.risk_level === riskLevel)
    }

    // Apply pagination
    const paginatedResults = filteredPredictions.slice(offset, offset + limit)

    // Calculate summary statistics
    const summary = {
      total: filteredPredictions.length,
      highRisk: filteredPredictions.filter((p) => p.risk_level === "high").length,
      mediumRisk: filteredPredictions.filter((p) => p.risk_level === "medium").length,
      lowRisk: filteredPredictions.filter((p) => p.risk_level === "low").length,
      avgChurnScore: filteredPredictions.reduce((sum, p) => sum + p.churn_score, 0) / filteredPredictions.length,
    }

    return NextResponse.json({
      predictions: paginatedResults,
      summary: summary,
      pagination: {
        limit: limit,
        offset: offset,
        total: filteredPredictions.length,
        hasMore: offset + limit < filteredPredictions.length,
      },
    })
  } catch (error) {
    console.error("Error fetching churn predictions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, forceRecalculate } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 })
    }

    // Simulate AI model prediction calculation
    const prediction = await calculateChurnPrediction(userId, forceRecalculate)

    return NextResponse.json({
      success: true,
      prediction: prediction,
    })
  } catch (error) {
    console.error("Error calculating churn prediction:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function calculateChurnPrediction(userId: string, forceRecalculate = false) {
  // Simulate AI model calculation
  console.log(`[API] Calculating churn prediction for user: ${userId}`)

  // Mock calculation based on various factors
  const factors = [
    { factor: "Login Frequency", weight: 0.25 },
    { factor: "Feature Usage", weight: 0.2 },
    { factor: "Support Tickets", weight: 0.15 },
    { factor: "Billing Status", weight: 0.2 },
    { factor: "Session Duration", weight: 0.1 },
    { factor: "Plan Type", weight: 0.1 },
  ]

  // Simulate model prediction (in real implementation, this would call ML model)
  const churnScore = Math.random() * 0.8 + 0.1 // Random score between 0.1 and 0.9
  const riskLevel = churnScore > 0.7 ? "high" : churnScore > 0.4 ? "medium" : "low"

  return {
    user_id: userId,
    churn_score: Math.round(churnScore * 100) / 100,
    risk_level: riskLevel,
    prediction_date: new Date().toISOString(),
    model_version: "v1.2.0",
    factors: factors.map((f) => ({
      ...f,
      impact: Math.random() > 0.5 ? "positive" : "negative",
      score: Math.random(),
    })),
  }
}
