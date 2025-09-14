"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, MessageSquare, Calendar, Zap, CheckCircle, Clock } from "lucide-react"

export function AutomationDemo() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [email, setEmail] = useState("admin@company.com")
  const [slackWebhook, setSlackWebhook] = useState("")

  const addResult = (result: any) => {
    setResults((prev) => [{ ...result, timestamp: new Date().toLocaleTimeString() }, ...prev.slice(0, 9)])
  }

  const sendWeeklyDigest = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/automation/weekly-digest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientEmail: email,
          dashboardData: {
            totalUsers: 1247,
            churnRate: 12.7,
            highRiskUsers: 89,
            avgRevenue: 99.92,
            topChurnReasons: [{ category: "Pricing", count: 45 }],
          },
        }),
      })

      const data = await response.json()
      addResult({
        type: "Weekly Digest",
        status: data.success ? "success" : "error",
        message: data.success ? `Sent to ${email}` : data.error,
      })
    } catch (error) {
      addResult({
        type: "Weekly Digest",
        status: "error",
        message: "Failed to send email",
      })
    } finally {
      setLoading(false)
    }
  }

  const sendHighRiskAlert = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/automation/high-risk-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientEmail: email,
          userData: {
            user_id: "user_003",
            userEmail: "mike@saasapp.com",
            churn_score: 0.85,
            plan: "Basic",
            last_login: "2024-01-08T14:20:00Z",
          },
          recommendations: [
            { title: "Send reactivation email" },
            { title: "Offer retention discount" },
            { title: "Schedule customer success call" },
          ],
        }),
      })

      const data = await response.json()
      addResult({
        type: "High Risk Alert",
        status: data.success ? "success" : "error",
        message: data.success ? `Alert sent for user mike@saasapp.com` : data.error,
      })
    } catch (error) {
      addResult({
        type: "High Risk Alert",
        status: "error",
        message: "Failed to send alert",
      })
    } finally {
      setLoading(false)
    }
  }

  const sendReactivationEmail = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/automation/reactivation-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: "inactive@example.com",
          userData: {
            name: "Inactive User",
            last_login: "2024-01-01T00:00:00Z",
          },
        }),
      })

      const data = await response.json()
      addResult({
        type: "Reactivation Email",
        status: data.success ? "success" : "error",
        message: data.success ? "Sent to inactive@example.com" : data.error,
      })
    } catch (error) {
      addResult({
        type: "Reactivation Email",
        status: "error",
        message: "Failed to send email",
      })
    } finally {
      setLoading(false)
    }
  }

  const sendSlackNotification = async () => {
    if (!slackWebhook) {
      addResult({
        type: "Slack Notification",
        status: "error",
        message: "Slack webhook URL required",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/automation/slack-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          webhookUrl: slackWebhook,
          type: "weeklyDigest",
          data: {
            churnRate: "12.7",
            highRiskUsers: "89",
            totalUsers: "1,247",
            avgRevenue: "99.92",
            urgentActions: "• Contact 89 high-risk users\n• Address pricing concerns\n• Review inactive users",
            dashboardUrl: window.location.origin + "/dashboard",
          },
        }),
      })

      const data = await response.json()
      addResult({
        type: "Slack Notification",
        status: data.success ? "success" : "error",
        message: data.success ? "Weekly digest sent to Slack" : data.error || "Failed to send",
      })
    } catch (error) {
      addResult({
        type: "Slack Notification",
        status: "error",
        message: "Failed to send notification",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Automation Layer Demo
          </CardTitle>
          <CardDescription>
            Test Churnaizer's automated email and Slack notifications for retention management
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="email" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="email">Email Automation</TabsTrigger>
          <TabsTrigger value="slack">Slack Integration</TabsTrigger>
          <TabsTrigger value="schedule">Scheduling</TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Notifications
              </CardTitle>
              <CardDescription>Automated email campaigns for retention management</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email">Recipient Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@company.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button
                  onClick={sendWeeklyDigest}
                  disabled={loading}
                  variant="outline"
                  className="h-auto p-4 bg-transparent"
                >
                  <div className="text-center">
                    <Calendar className="h-5 w-5 mx-auto mb-2" />
                    <div className="font-medium">Weekly Digest</div>
                    <div className="text-xs text-muted-foreground">Retention summary</div>
                  </div>
                </Button>

                <Button
                  onClick={sendHighRiskAlert}
                  disabled={loading}
                  variant="outline"
                  className="h-auto p-4 bg-transparent"
                >
                  <div className="text-center">
                    <Zap className="h-5 w-5 mx-auto mb-2 text-destructive" />
                    <div className="font-medium">High Risk Alert</div>
                    <div className="text-xs text-muted-foreground">Urgent user alert</div>
                  </div>
                </Button>

                <Button
                  onClick={sendReactivationEmail}
                  disabled={loading}
                  variant="outline"
                  className="h-auto p-4 bg-transparent"
                >
                  <div className="text-center">
                    <Mail className="h-5 w-5 mx-auto mb-2 text-primary" />
                    <div className="font-medium">Reactivation</div>
                    <div className="text-xs text-muted-foreground">Win back users</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="slack" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Slack Integration
              </CardTitle>
              <CardDescription>Real-time notifications to your Slack workspace</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="webhook">Slack Webhook URL</Label>
                <Input
                  id="webhook"
                  value={slackWebhook}
                  onChange={(e) => setSlackWebhook(e.target.value)}
                  placeholder="https://hooks.slack.com/services/..."
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Create a webhook in your Slack workspace to test notifications
                </p>
              </div>

              <Button onClick={sendSlackNotification} disabled={loading || !slackWebhook} className="w-full">
                Send Test Notification
              </Button>

              <Alert>
                <MessageSquare className="h-4 w-4" />
                <AlertDescription>
                  Slack notifications include interactive buttons for quick actions like viewing the dashboard or
                  contacting high-risk users.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Automated Scheduling
              </CardTitle>
              <CardDescription>Configured automation schedules for retention management</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Weekly Digest</div>
                    <div className="text-sm text-muted-foreground">Every Monday at 9:00 AM</div>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">High Risk Check</div>
                    <div className="text-sm text-muted-foreground">Daily at 10:00 AM</div>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Reactivation Emails</div>
                    <div className="text-sm text-muted-foreground">Tuesday & Thursday at 2:00 PM</div>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">Monthly Reports</div>
                    <div className="text-sm text-muted-foreground">First Monday of each month</div>
                  </div>
                  <Badge variant="outline">Planned</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Results Log */}
      <Card>
        <CardHeader>
          <CardTitle>Automation Log</CardTitle>
          <CardDescription>Real-time results of automation tests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {results.length === 0 ? (
              <p className="text-muted-foreground text-sm">No automation tests run yet</p>
            ) : (
              results.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {result.status === "success" ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Zap className="h-4 w-4 text-destructive" />
                    )}
                    <div>
                      <div className="font-medium text-sm">{result.type}</div>
                      <div className="text-xs text-muted-foreground">{result.message}</div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">{result.timestamp}</div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
