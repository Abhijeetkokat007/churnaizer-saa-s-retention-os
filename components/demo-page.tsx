"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChurnaizerDashboard } from "@/components/churnaizer-dashboard"
import { SDKDemo } from "@/components/sdk-demo"

export function DemoPage() {
  return (
    <div className="min-h-screen bg-background">
      <Tabs defaultValue="dashboard" className="w-full">
        <div className="border-b bg-card">
          <div className="container mx-auto px-6 py-4">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="sdk">SDK Demo</TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="dashboard" className="mt-0">
          <ChurnaizerDashboard />
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
