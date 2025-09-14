"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Brain, Sparkles, TrendingUp, Users, MessageSquare } from "lucide-react"

export function AIInsights() {
  const [loading, setLoading] = useState(false)
  const [feedbackText, setFeedbackText] = useState("")
  const [analysis, setAnalysis] = useState<any>(null)
  const [prediction, setPrediction] = useState<any>(null)

  const analyzeFeedback = async () => {
    if (!feedbackText.trim()) return

    setLoading(true)
    try {
      const response = await fetch("/api/ai/categorize-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedbackText }),
      })

      const data = await response.json()
      setAnalysis(data.analysis)
    } catch (error) {
      console.error("Failed to analyze feedback:", error)
    } finally {
      setLoading(false)
    }
  }

  const generatePrediction = async () => {
    setLoading(true)
    try {
      const mockUserData = {
        userId: "demo_user",
        lastLogin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        sessionDuration: 15,
        featureUsage: 3,
        supportTickets: 2,
        plan: "Basic",
        billingStatus: "past_due",
        monthlyRevenue: 29,
      }

      const response = await fetch("/api/ai/predict-churn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockUserData),
      })

      const data = await response.json()
      setPrediction(data.prediction)
    } catch (error) {
      console.error("Failed to generate prediction:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI-Powered Insights
          </CardTitle>
          <CardDescription>
            Test Churnaizer's AI capabilities for churn prediction and feedback analysis
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feedback Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Feedback Analysis
            </CardTitle>
            <CardDescription>AI categorizes and analyzes cancellation feedback</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter cancellation feedback to analyze..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              rows={4}
            />
            <Button onClick={analyzeFeedback} disabled={loading || !feedbackText.trim()} className="w-full">
              {loading ? "Analyzing..." : "Analyze Feedback"}
            </Button>

            {analysis && (
              <div className="space-y-3 p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{analysis.category}</Badge>
                  <Badge variant="secondary">{Math.round(analysis.confidence * 100)}% confidence</Badge>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Key Insights:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {analysis.key_insights?.map((insight: string, index: number) => (
                      <li key={index}>• {insight}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Suggested Actions:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {analysis.suggested_actions?.map((action: string, index: number) => (
                      <li key={index}>• {action}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Churn Prediction */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Churn Prediction
            </CardTitle>
            <CardDescription>AI predicts user churn probability</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Users className="h-4 w-4" />
              <AlertDescription>
                Demo user: Basic plan, past due billing, inactive for 7 days, low engagement
              </AlertDescription>
            </Alert>

            <Button onClick={generatePrediction} disabled={loading} className="w-full">
              {loading ? "Predicting..." : "Generate Churn Prediction"}
            </Button>

            {prediction && (
              <div className="space-y-3 p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-destructive">
                      {Math.round(prediction.churn_score * 100)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Churn Probability</div>
                  </div>
                  <Badge
                    variant={
                      prediction.risk_level === "high"
                        ? "destructive"
                        : prediction.risk_level === "medium"
                          ? "default"
                          : "secondary"
                    }
                  >
                    {prediction.risk_level.toUpperCase()} RISK
                  </Badge>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Key Factors:</h4>
                  <div className="space-y-2">
                    {prediction.key_factors?.map((factor: any, index: number) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span>{factor.factor}</span>
                        <Badge variant={factor.impact === "negative" ? "destructive" : "secondary"} className="text-xs">
                          {factor.impact}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">AI Reasoning:</h4>
                  <p className="text-sm text-muted-foreground">{prediction.reasoning}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            AI Features in Churnaizer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Churn Prediction</h4>
              <p className="text-sm text-muted-foreground">
                ML models analyze user behavior, engagement, and billing patterns to predict churn probability
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Feedback Clustering</h4>
              <p className="text-sm text-muted-foreground">
                AI groups cancellation reasons into actionable themes and identifies root causes
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Smart Recommendations</h4>
              <p className="text-sm text-muted-foreground">
                Personalized retention strategies based on user risk profile and behavior patterns
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Feature Analysis</h4>
              <p className="text-sm text-muted-foreground">
                Identifies which product features drive retention and suggests optimization strategies
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
