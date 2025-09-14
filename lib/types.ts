export interface User {
  id: string
  user_id: string
  email?: string
  plan: string
  monthly_revenue: number
  billing_status: string
  created_at: string
  updated_at: string
}

export interface UserActivity {
  id: string
  user_id: string
  last_login?: string
  avg_session_duration: number
  feature_usage_count: number
  support_tickets: number
  recorded_at: string
}

export interface ChurnPrediction {
  id: string
  user_id: string
  churn_score: number
  risk_level: "low" | "medium" | "high"
  prediction_date: string
  model_version: string
}

export interface CancellationFeedback {
  id: string
  user_id: string
  reason: string
  category?: string
  feedback_date: string
  processed: boolean
}

export interface FeatureUsage {
  id: string
  user_id: string
  feature_name: string
  usage_count: number
  last_used: string
  recorded_at: string
}

export interface RetentionRecommendation {
  id: string
  user_id: string
  recommendation_type: string
  recommendation_text: string
  priority: number
  status: "pending" | "sent" | "completed"
  created_at: string
  executed_at?: string
}

export interface IndustryBenchmark {
  id: string
  industry: string
  plan_type: string
  avg_churn_rate: number
  sample_size: number
  updated_at: string
}

export interface DashboardMetrics {
  totalUsers: number
  churnRate: number
  highRiskUsers: number
  avgRevenue: number
  topChurnReasons: Array<{
    category: string
    count: number
    percentage: number
  }>
  riskDistribution: Array<{
    risk_level: string
    count: number
  }>
}
