import { type NextRequest, NextResponse } from "next/server"
import { churnaizerAI } from "@/lib/ai-services"

export async function POST(request: NextRequest) {
  try {
    const { feedbackList } = await request.json()

    if (!feedbackList || !Array.isArray(feedbackList)) {
      return NextResponse.json({ error: "feedbackList array is required" }, { status: 400 })
    }

    // Generate AI clustering
    const clustering = await churnaizerAI.clusterChurnReasons(feedbackList)

    console.log(`[AI] Clustered ${feedbackList.length} feedback items into ${clustering.clusters.length} themes`)

    return NextResponse.json({
      success: true,
      clustering: {
        clusters: clustering.clusters,
        insights: clustering.overallInsights,
        priorityActions: clustering.priorityActions,
        analyzedAt: new Date().toISOString(),
        totalFeedback: feedbackList.length,
      },
    })
  } catch (error) {
    console.error("Error clustering feedback:", error)
    return NextResponse.json({ error: "Failed to cluster feedback" }, { status: 500 })
  }
}
