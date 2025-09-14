import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChurnaizerDashboard } from "@/components/churnaizer-dashboard"
import { SDKDemo } from "@/components/sdk-demo"
import { AIInsights } from "@/components/ai-insights"
import { AutomationDemo } from "@/components/automation-demo"

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background">
      <Tabs defaultValue="dashboard" className="w-full">
        <div className="border-b bg-card">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Churnaizer Demo</h1>
                <p className="text-muted-foreground">Complete SaaS Retention Operating System</p>
              </div>
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="ai">AI Insights</TabsTrigger>
                <TabsTrigger value="automation">Automation</TabsTrigger>
                <TabsTrigger value="sdk">SDK</TabsTrigger>
              </TabsList>
            </div>
          </div>
        </div>

        <TabsContent value="dashboard" className="mt-0">
          <ChurnaizerDashboard />
        </TabsContent>

        <TabsContent value="ai" className="mt-0">
          <div className="container mx-auto px-6 py-8">
            <AIInsights />
          </div>
        </TabsContent>

        <TabsContent value="automation" className="mt-0">
          <div className="container mx-auto px-6 py-8">
            <AutomationDemo />
          </div>
        </TabsContent>

        <TabsContent value="sdk" className="mt-0">
          <div className="container mx-auto px-6 py-8">
            <SDKDemo />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
