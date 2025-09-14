"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import ChurnaizerSDK from "@/lib/churnaizer-sdk"

export function SDKDemo() {
  const [sdk, setSdk] = useState<ChurnaizerSDK | null>(null)
  const [events, setEvents] = useState<string[]>([])
  const [config, setConfig] = useState({
    apiKey: "demo_key_123",
    userId: "demo_user_001",
    userEmail: "demo@example.com",
    plan: "Pro",
    monthlyRevenue: 99,
  })

  const initializeSDK = () => {
    const newSDK = new ChurnaizerSDK({
      ...config,
      debug: true,
      apiUrl: "/api", // Use local API for demo
    })
    setSdk(newSDK)
    addEvent("SDK Initialized")
  }

  const addEvent = (event: string) => {
    setEvents((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${event}`])
  }

  const trackFeature = (featureName: string) => {
    if (sdk) {
      sdk.trackFeature(featureName)
      addEvent(`Feature tracked: ${featureName}`)
    }
  }

  const trackSupportTicket = () => {
    if (sdk) {
      sdk.trackSupportTicket({ priority: "high", category: "billing" })
      addEvent("Support ticket tracked")
    }
  }

  const showCancellationPopup = async () => {
    if (sdk) {
      const result = await sdk.showCancellationPopup()
      if (result) {
        addEvent(`Cancellation feedback: ${result.reason.substring(0, 50)}...`)
      } else {
        addEvent("Cancellation popup dismissed")
      }
    }
  }

  const updateBilling = () => {
    if (sdk) {
      sdk.updateBilling({ plan: "Enterprise", monthlyRevenue: 299 })
      addEvent("Billing updated to Enterprise plan")
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Churnaizer SDK Demo</CardTitle>
          <CardDescription>Test the JavaScript SDK functionality with real-time event tracking</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                value={config.userId}
                onChange={(e) => setConfig((prev) => ({ ...prev, userId: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="plan">Plan</Label>
              <Input
                id="plan"
                value={config.plan}
                onChange={(e) => setConfig((prev) => ({ ...prev, plan: e.target.value }))}
              />
            </div>
          </div>

          <Button onClick={initializeSDK} disabled={!!sdk} className="w-full">
            {sdk ? "SDK Initialized" : "Initialize SDK"}
          </Button>
        </CardContent>
      </Card>

      {sdk && (
        <Card>
          <CardHeader>
            <CardTitle>SDK Actions</CardTitle>
            <CardDescription>Test different tracking methods</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Button variant="outline" onClick={() => trackFeature("dashboard")}>
                Track Dashboard
              </Button>
              <Button variant="outline" onClick={() => trackFeature("reports")}>
                Track Reports
              </Button>
              <Button variant="outline" onClick={() => trackFeature("api")}>
                Track API Usage
              </Button>
              <Button variant="outline" onClick={trackSupportTicket}>
                Support Ticket
              </Button>
              <Button variant="outline" onClick={updateBilling}>
                Update Billing
              </Button>
              <Button variant="destructive" onClick={showCancellationPopup}>
                Cancel Account
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Event Log</CardTitle>
          <CardDescription>Real-time tracking of SDK events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {events.length === 0 ? (
              <p className="text-muted-foreground text-sm">No events tracked yet</p>
            ) : (
              events.map((event, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {index + 1}
                  </Badge>
                  <span className="text-sm font-mono">{event}</span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integration Code</CardTitle>
          <CardDescription>Copy this code to integrate Churnaizer into your SaaS</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            readOnly
            value={`// Install: npm install @churnaizer/sdk

import { initChurnaizer } from '@churnaizer/sdk'

// Initialize the SDK
const churnaizer = initChurnaizer({
  apiKey: 'your_api_key',
  userId: 'user_123',
  userEmail: 'user@example.com',
  plan: 'Pro',
  monthlyRevenue: 99
})

// Track feature usage
churnaizer.trackFeature('dashboard')
churnaizer.trackFeature('reports', { reportType: 'analytics' })

// Track support tickets
churnaizer.trackSupportTicket({ priority: 'high' })

// Update billing information
churnaizer.updateBilling({ 
  plan: 'Enterprise', 
  monthlyRevenue: 299 
})

// Show cancellation popup (when user tries to cancel)
const feedback = await churnaizer.showCancellationPopup()
if (feedback) {
  console.log('User feedback:', feedback.reason)
}`}
            className="font-mono text-xs"
            rows={25}
          />
        </CardContent>
      </Card>
    </div>
  )
}
