import { generateText, generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

// AI service for churn prediction and analysis
export class ChurnaizerAI {
  private model = openai("gpt-4o-mini")

  // Generate churn prediction based on user data
  async predictChurn(userData: {
    userId: string
    lastLogin: string
    sessionDuration: number
    featureUsage: number
    supportTickets: number
    plan: string
    billingStatus: string
    monthlyRevenue: number
  }) {
    const prompt = `
    Analyze this SaaS user data and predict churn probability:
    
    User ID: ${userData.userId}
    Last Login: ${userData.lastLogin}
    Avg Session Duration: ${userData.sessionDuration} minutes
    Feature Usage Count: ${userData.featureUsage}
    Support Tickets: ${userData.supportTickets}
    Plan: ${userData.plan}
    Billing Status: ${userData.billingStatus}
    Monthly Revenue: $${userData.monthlyRevenue}
    
    Consider factors like:
    - Recency of last login
    - Engagement level (session duration, feature usage)
    - Support burden
    - Plan value and billing health
    
    Provide a churn score (0.0-1.0) and risk level (low/medium/high).
    `

    const result = await generateObject({
      model: this.model,
      schema: z.object({
        churnScore: z.number().min(0).max(1),
        riskLevel: z.enum(["low", "medium", "high"]),
        confidence: z.number().min(0).max(1),
        keyFactors: z.array(
          z.object({
            factor: z.string(),
            impact: z.enum(["positive", "negative", "neutral"]),
            weight: z.number().min(0).max(1),
            explanation: z.string(),
          }),
        ),
        reasoning: z.string(),
      }),
      prompt,
    })

    return result.object
  }

  // Categorize cancellation feedback using AI
  async categorizeFeedback(feedbackText: string) {
    const prompt = `
    Categorize this SaaS cancellation feedback into one of these categories:
    - Pricing: Cost, budget, too expensive
    - Features: Missing functionality, feature requests
    - Competition: Found better alternative, competitor
    - Support: Poor customer service, lack of help
    - Technical Issues: Bugs, performance, reliability
    - User Experience: UI/UX problems, confusing interface
    - Business Changes: Company pivot, no longer needed
    - Other: Anything else
    
    Feedback: "${feedbackText}"
    
    Also extract key insights and sentiment.
    `

    const result = await generateObject({
      model: this.model,
      schema: z.object({
        category: z.enum([
          "Pricing",
          "Features",
          "Competition",
          "Support",
          "Technical Issues",
          "User Experience",
          "Business Changes",
          "Other",
        ]),
        confidence: z.number().min(0).max(1),
        sentiment: z.enum(["positive", "neutral", "negative"]),
        keyInsights: z.array(z.string()),
        suggestedActions: z.array(z.string()),
      }),
      prompt,
    })

    return result.object
  }

  // Generate retention recommendations for at-risk users
  async generateRecommendations(userData: {
    userId: string
    email: string
    churnScore: number
    riskLevel: string
    plan: string
    lastLogin: string
    featureUsage: Array<{ feature: string; count: number }>
    supportTickets: number
    billingStatus: string
  }) {
    const prompt = `
    Generate retention recommendations for this at-risk SaaS user:
    
    User: ${userData.email}
    Churn Score: ${userData.churnScore}
    Risk Level: ${userData.riskLevel}
    Plan: ${userData.plan}
    Last Login: ${userData.lastLogin}
    Feature Usage: ${JSON.stringify(userData.featureUsage)}
    Support Tickets: ${userData.supportTickets}
    Billing Status: ${userData.billingStatus}
    
    Generate 2-4 specific, actionable recommendations to prevent churn.
    Consider:
    - Personalized outreach (email, call)
    - Feature adoption strategies
    - Billing/pricing adjustments
    - Support interventions
    - Product education
    
    Prioritize by impact and urgency.
    `

    const result = await generateObject({
      model: this.model,
      schema: z.object({
        recommendations: z.array(
          z.object({
            type: z.enum(["email", "call", "discount", "feature_adoption", "support", "education"]),
            title: z.string(),
            description: z.string(),
            priority: z.number().min(1).max(5),
            estimatedImpact: z.enum(["Low", "Medium", "High"]),
            timeframe: z.string(),
            actionSteps: z.array(z.string()),
          }),
        ),
        overallStrategy: z.string(),
        urgency: z.enum(["Low", "Medium", "High", "Critical"]),
      }),
      prompt,
    })

    return result.object
  }

  // Analyze feature-retention correlation
  async analyzeFeatureRetention(
    featureData: Array<{
      feature: string
      totalUsers: number
      activeUsers: number
      retainedUsers: number
      avgUsageFrequency: number
    }>,
  ) {
    const prompt = `
    Analyze the relationship between feature usage and user retention:
    
    ${featureData
      .map(
        (f) => `
    Feature: ${f.feature}
    - Total Users: ${f.totalUsers}
    - Active Users: ${f.activeUsers}
    - Retained Users: ${f.retainedUsers}
    - Avg Usage Frequency: ${f.avgUsageFrequency}
    `,
      )
      .join("\n")}
    
    Identify:
    1. Which features have the strongest correlation with retention
    2. Power features that drive stickiness
    3. Underutilized features with high retention potential
    4. Recommendations for feature strategy
    `

    const result = await generateObject({
      model: this.model,
      schema: z.object({
        powerFeatures: z.array(
          z.object({
            feature: z.string(),
            retentionCorrelation: z.number(),
            reasoning: z.string(),
          }),
        ),
        underutilizedFeatures: z.array(
          z.object({
            feature: z.string(),
            potential: z.enum(["Low", "Medium", "High"]),
            recommendation: z.string(),
          }),
        ),
        strategicInsights: z.array(z.string()),
        actionableRecommendations: z.array(z.string()),
      }),
      prompt,
    })

    return result.object
  }

  // Generate churn reason clusters from feedback
  async clusterChurnReasons(feedbackList: Array<{ reason: string; category?: string }>) {
    const prompt = `
    Analyze these cancellation reasons and identify common themes/clusters:
    
    ${feedbackList.map((f, i) => `${i + 1}. ${f.reason} ${f.category ? `(Category: ${f.category})` : ""}`).join("\n")}
    
    Group similar reasons into clusters and identify:
    1. Main themes causing churn
    2. Frequency of each theme
    3. Severity/impact of each cluster
    4. Actionable insights to address each cluster
    `

    const result = await generateObject({
      model: this.model,
      schema: z.object({
        clusters: z.array(
          z.object({
            theme: z.string(),
            description: z.string(),
            frequency: z.number(),
            severity: z.enum(["Low", "Medium", "High", "Critical"]),
            examples: z.array(z.string()),
            rootCauses: z.array(z.string()),
            solutions: z.array(z.string()),
          }),
        ),
        overallInsights: z.array(z.string()),
        priorityActions: z.array(z.string()),
      }),
      prompt,
    })

    return result.object
  }

  // Generate executive summary for dashboard
  async generateExecutiveSummary(dashboardData: {
    totalUsers: number
    churnRate: number
    highRiskUsers: number
    topChurnReasons: Array<{ category: string; count: number }>
    monthlyTrend: Array<{ month: string; churnRate: number }>
  }) {
    const prompt = `
    Generate an executive summary for this SaaS retention dashboard:
    
    Total Users: ${dashboardData.totalUsers}
    Current Churn Rate: ${dashboardData.churnRate}%
    High Risk Users: ${dashboardData.highRiskUsers}
    
    Top Churn Reasons:
    ${dashboardData.topChurnReasons.map((r) => `- ${r.category}: ${r.count} users`).join("\n")}
    
    Monthly Trend:
    ${dashboardData.monthlyTrend.map((m) => `${m.month}: ${m.churnRate}%`).join(", ")}
    
    Provide:
    1. Key insights and trends
    2. Critical areas of concern
    3. Top 3 recommended actions
    4. Business impact assessment
    `

    const result = await generateText({
      model: this.model,
      prompt,
    })

    return result.text
  }
}

// Export singleton instance
export const churnaizerAI = new ChurnaizerAI()
