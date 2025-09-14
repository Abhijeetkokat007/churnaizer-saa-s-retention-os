"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { TrendingDown, Users, AlertTriangle, DollarSign, Target, Phone, Mail, Percent } from "lucide-react"

interface DashboardData {
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
  monthlyTrend: Array<{
    month: string
    churnRate: number
    newUsers: number
    churnedUsers: number
  }>
  featureCorrelation: Array<{
    feature: string
    retentionRate: number
    usageRate: number
  }>
  benchmarks: {
    yourChurnRate: number
    industryAverage: number
    topQuartile: number
    percentileRank: number
  }
}

interface ChurnPrediction {
  user_id: string
  email: string
  plan: string
  churn_score: number
  risk_level: "low" | "medium" | "high"
  last_login: string
  factors: Array<{
    factor: string
    impact: "positive" | "negative" | "neutral"
    weight: number
  }>
}

interface Recommendation {
  id: string
  type: string
  title: string
  description: string
  priority: number
  status: string
  estimatedImpact: string
}

const COLORS = {
  high: "#dc2626",
  medium: "#f59e0b",
  low: "#10b981",
  primary: "#8b5cf6",
  secondary: "#6b7280",
}

export function ChurnaizerDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [churnPredictions, setChurnPredictions] = useState<ChurnPrediction[]>([])
  const [recommendations, setRecommendations] = useState<Record<string, Recommendation[]>>({})
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    fetchDashboardData()
    fetchChurnPredictions()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/dashboard")
      const data = await response.json()
      setDashboardData(data)
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    }
  }

  const fetchChurnPredictions = async () => {
    try {
      const response = await fetch("/api/churn-predictions")
      const data = await response.json()
      setChurnPredictions(data.predictions || [])

      // Fetch recommendations for high-risk users
      const highRiskUsers = data.predictions?.filter((p: ChurnPrediction) => p.risk_level === "high") || []
      const recPromises = highRiskUsers.map(async (user: ChurnPrediction) => {
        const recResponse = await fetch(`/api/users/${user.user_id}/recommendations`)
        const recData = await recResponse.json()
        return { userId: user.user_id, recommendations: recData.recommendations || [] }
      })

      const allRecommendations = await Promise.all(recPromises)
      const recMap = allRecommendations.reduce(
        (acc, { userId, recommendations }) => {
          acc[userId] = recommendations
          return acc
        },
        {} as Record<string, Recommendation[]>,
      )

      setRecommendations(recMap)
    } catch (error) {
      console.error("Failed to fetch churn predictions:", error)
    } finally {
      setLoading(false)
    }
  }

  const executeRecommendation = async (userId: string, recommendationId: string) => {
    try {
      await fetch(`/api/users/${userId}/recommendations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recommendationId, action: "execute" }),
      })

      // Refresh recommendations
      fetchChurnPredictions()
    } catch (error) {
      console.error("Failed to execute recommendation:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading Churnaizer Dashboard...</p>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>Failed to load dashboard data. Please try again.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Churnaizer</h1>
              <p className="text-muted-foreground">SaaS Retention Operating System</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-sm">
                Live Data
              </Badge>
              <Button variant="outline" size="sm">
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="predictions">Cancel-Intent</TabsTrigger>
            <TabsTrigger value="recommendations">Actions</TabsTrigger>
            <TabsTrigger value="features">Feature-Retention</TabsTrigger>
            <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData.totalUsers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Active subscribers</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
                  <TrendingDown className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">{dashboardData.churnRate}%</div>
                  <p className="text-xs text-muted-foreground">Monthly churn rate</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">High Risk Users</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">{dashboardData.highRiskUsers}</div>
                  <p className="text-xs text-muted-foreground">Need immediate attention</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${dashboardData.avgRevenue}</div>
                  <p className="text-xs text-muted-foreground">Per user per month</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Churn Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Churn Trend</CardTitle>
                  <CardDescription>Monthly churn rate over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dashboardData.monthlyTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="churnRate" stroke={COLORS.primary} strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Risk Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Risk Distribution</CardTitle>
                  <CardDescription>Users by churn risk level</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={dashboardData.riskDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ risk_level, count }) => `${risk_level}: ${count}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {dashboardData.riskDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[entry.risk_level as keyof typeof COLORS]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Churn Reasons */}
            <Card>
              <CardHeader>
                <CardTitle>Top Churn Reasons</CardTitle>
                <CardDescription>Why users are cancelling</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dashboardData.topChurnReasons}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill={COLORS.primary} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cancel-Intent Predictions Tab */}
          <TabsContent value="predictions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cancel-Intent Scores</CardTitle>
                <CardDescription>Users ranked by churn probability</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {churnPredictions.map((prediction) => (
                    <div key={prediction.user_id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <Badge
                            variant={
                              prediction.risk_level === "high"
                                ? "destructive"
                                : prediction.risk_level === "medium"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {prediction.risk_level.toUpperCase()}
                          </Badge>
                        </div>
                        <div>
                          <p className="font-medium">{prediction.email}</p>
                          <p className="text-sm text-muted-foreground">{prediction.plan} Plan</p>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="text-lg font-bold">{Math.round(prediction.churn_score * 100)}%</div>
                        <div className="text-xs text-muted-foreground">
                          Last login: {new Date(prediction.last_login).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Retention Recommendations</CardTitle>
                <CardDescription>AI-powered actions to prevent churn</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(recommendations).map(([userId, userRecs]) => {
                    const user = churnPredictions.find((p) => p.user_id === userId)
                    if (!user || userRecs.length === 0) return null

                    return (
                      <div key={userId} className="border rounded-lg p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{user.email}</h3>
                            <p className="text-sm text-muted-foreground">
                              Churn Score: {Math.round(user.churn_score * 100)}% • {user.plan} Plan
                            </p>
                          </div>
                          <Badge variant="destructive">High Risk</Badge>
                        </div>

                        <div className="space-y-3">
                          {userRecs.map((rec) => (
                            <div key={rec.id} className="flex items-center justify-between p-3 bg-muted rounded-md">
                              <div className="flex items-center space-x-3">
                                {rec.type === "email" && <Mail className="h-4 w-4 text-primary" />}
                                {rec.type === "call" && <Phone className="h-4 w-4 text-primary" />}
                                {rec.type === "discount" && <Percent className="h-4 w-4 text-primary" />}
                                <div>
                                  <p className="font-medium text-sm">{rec.title}</p>
                                  <p className="text-xs text-muted-foreground">{rec.description}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="text-xs">
                                  {rec.estimatedImpact} Impact
                                </Badge>
                                <Button
                                  size="sm"
                                  onClick={() => executeRecommendation(userId, rec.id)}
                                  disabled={rec.status !== "pending"}
                                >
                                  {rec.status === "pending" ? "Execute" : "Executed"}
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Feature-Retention Tab */}
          <TabsContent value="features" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Feature-Retention Fit</CardTitle>
                <CardDescription>Which features drive the highest retention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.featureCorrelation.map((feature) => (
                    <div key={feature.feature} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{feature.feature}</span>
                        <div className="text-right">
                          <div className="text-sm font-medium">{feature.retentionRate}% retention</div>
                          <div className="text-xs text-muted-foreground">{feature.usageRate}% usage</div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Progress value={feature.retentionRate} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Retention Rate</span>
                          <span>{feature.retentionRate}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Benchmarks Tab */}
          <TabsContent value="benchmarks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Industry Benchmarks</CardTitle>
                <CardDescription>How you compare to other SaaS companies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-primary">{dashboardData.benchmarks.percentileRank}th</div>
                  <p className="text-muted-foreground">
                    You're performing better than {dashboardData.benchmarks.percentileRank}% of similar SaaS companies
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted rounded-md">
                    <span>Your Churn Rate</span>
                    <span className="font-bold text-destructive">{dashboardData.benchmarks.yourChurnRate}%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded-md">
                    <span>Industry Average</span>
                    <span className="font-medium">{dashboardData.benchmarks.industryAverage}%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded-md">
                    <span>Top Quartile</span>
                    <span className="font-medium text-green-600">{dashboardData.benchmarks.topQuartile}%</span>
                  </div>
                </div>

                <Alert>
                  <Target className="h-4 w-4" />
                  <AlertDescription>
                    You're performing{" "}
                    {(dashboardData.benchmarks.industryAverage - dashboardData.benchmarks.yourChurnRate).toFixed(1)}{" "}
                    percentage points better than the industry average. To reach top quartile, aim to reduce churn by{" "}
                    {(dashboardData.benchmarks.yourChurnRate - dashboardData.benchmarks.topQuartile).toFixed(1)}{" "}
                    percentage points.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
