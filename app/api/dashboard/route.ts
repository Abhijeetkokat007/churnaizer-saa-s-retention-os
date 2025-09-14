import { type NextRequest, NextResponse } from "next/server"
import type { DashboardMetrics } from "@/lib/types"

// Mock data for dashboard metrics
const mockDashboardData = {
  totalUsers: 1247,
  activeUsers: 1089,
  churnedUsers: 158,
  highRiskUsers: 89,
  mediumRiskUsers: 156,
  lowRiskUsers: 844,
  totalRevenue: 124700,
  avgRevenue: 99.92,
  churnRate: 12.7,

  riskDistribution: [
    { risk_level: "low", count: 844 },
    { risk_level: "medium", count: 156 },
    { risk_level: "high", count: 89 },
  ],

  topChurnReasons: [
    { category: "Pricing", count: 45, percentage: 28.5 },
    { category: "Features", count: 38, percentage: 24.1 },
    { category: "Competition", count: 32, percentage: 20.3 },
    { category: "Support", count: 23, percentage: 14.6 },
    { category: "Technical Issues", count: 12, percentage: 7.6 },
    { category: "Other", count: 8, percentage: 5.1 },
  ],

  monthlyChurnTrend: [
    { month: "Jan", churnRate: 8.2, newUsers: 145, churnedUsers: 12 },
    { month: "Feb", churnRate: 9.1, newUsers: 167, churnedUsers: 15 },
    { month: "Mar", churnRate: 11.3, newUsers: 189, churnedUsers: 21 },
    { month: "Apr", churnRate: 10.8, newUsers: 203, churnedUsers: 22 },
    { month: "May", churnRate: 12.7, newUsers: 178, churnedUsers: 23 },
    { month: "Jun", churnRate: 13.4, newUsers: 156, churnedUsers: 21 },
  ],

  featureRetentionCorrelation: [
    { feature: "Dashboard", retentionRate: 89.2, usageRate: 95.4 },
    { feature: "Reports", retentionRate: 76.8, usageRate: 67.3 },
    { feature: "API", retentionRate: 92.1, usageRate: 34.7 },
    { feature: "Integrations", retentionRate: 94.3, usageRate: 28.9 },
    { feature: "Analytics", retentionRate: 71.2, usageRate: 45.6 },
    { feature: "Exports", retentionRate: 68.9, usageRate: 23.1 },
  ],

  industryBenchmarks: {
    yourChurnRate: 12.7,
    industryAverage: 15.3,
    topQuartile: 8.9,
    bottomQuartile: 22.1,
    percentileRank: 68,
  },
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get("timeRange") || "30d"
    const userId = searchParams.get("userId")

    if (userId) {
      // Get user-specific metrics
      const userMetrics = await getUserMetrics(userId)
      return NextResponse.json(userMetrics)
    }

    // Get overall dashboard metrics
    const metrics: DashboardMetrics = {
      totalUsers: mockDashboardData.totalUsers,
      churnRate: mockDashboardData.churnRate,
      highRiskUsers: mockDashboardData.highRiskUsers,
      avgRevenue: mockDashboardData.avgRevenue,
      topChurnReasons: mockDashboardData.topChurnReasons,
      riskDistribution: mockDashboardData.riskDistribution,
    }

    // Add additional data for full dashboard
    const fullDashboard = {
      ...metrics,
      monthlyTrend: mockDashboardData.monthlyChurnTrend,
      featureCorrelation: mockDashboardData.featureRetentionCorrelation,
      benchmarks: mockDashboardData.industryBenchmarks,
      timeRange: timeRange,
    }

    return NextResponse.json(fullDashboard)
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function getUserMetrics(userId: string) {
  // Mock user-specific data
  return {
    userId: userId,
    churnScore: 0.23,
    riskLevel: "low",
    lastLogin: "2024-01-15T10:30:00Z",
    sessionDuration: 45,
    featuresUsed: ["dashboard", "reports", "api"],
    supportTickets: 0,
    plan: "Pro",
    monthlyRevenue: 99,
    recommendations: [
      {
        type: "feature_adoption",
        title: "Try Advanced Analytics",
        description: "Users who use analytics have 23% higher retention",
        priority: 2,
      },
    ],
  }
}
