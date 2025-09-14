import { type NextRequest, NextResponse } from "next/server"
import { churnaizerAI } from "@/lib/ai-services"

export async function POST(request: NextRequest) {
  try {
    const { featureData } = await request.json()

    if (!featureData || !Array.isArray(featureData)) {
      return NextResponse.json({ error: "featureData array is required" }, { status: 400 })
    }

    // Generate AI analysis
    const analysis = await churnaizerAI.analyzeFeatureRetention(featureData)

    console.log(`[AI] Feature retention analysis completed for ${featureData.length} features`)

    return NextResponse.json({
      success: true,
      analysis: {
        powerFeatures: analysis.powerFeatures,
        underutilizedFeatures: analysis.underutilizedFeatures,
        strategicInsights: analysis.strategicInsights,
        recommendations: analysis.actionableRecommendations,
        analyzedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Error analyzing features:", error)
    return NextResponse.json({ error: "Failed to analyze features" }, { status: 500 })
  }
}
