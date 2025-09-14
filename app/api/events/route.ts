import { type NextRequest, NextResponse } from "next/server"

// Mock database operations (replace with actual database calls)
const mockDatabase = {
  users: new Map(),
  activities: new Map(),
  features: new Map(),
}

export async function POST(request: NextRequest) {
  try {
    const event = await request.json()
    const { type, userId, timestamp, data } = event

    // Validate required fields
    if (!type || !userId || !timestamp) {
      return NextResponse.json({ error: "Missing required fields: type, userId, timestamp" }, { status: 400 })
    }

    // Process different event types
    switch (type) {
      case "login":
        await handleLoginEvent(userId, data)
        break
      case "feature_usage":
        await handleFeatureUsageEvent(userId, data)
        break
      case "session_end":
        await handleSessionEndEvent(userId, data)
        break
      case "support_ticket":
        await handleSupportTicketEvent(userId, data)
        break
      case "billing_update":
        await handleBillingUpdateEvent(userId, data)
        break
      default:
        return NextResponse.json({ error: `Unknown event type: ${type}` }, { status: 400 })
    }

    return NextResponse.json({ success: true, eventId: generateEventId() })
  } catch (error) {
    console.error("Error processing event:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function handleLoginEvent(userId: string, data: any) {
  // Update or create user record
  const user = {
    user_id: userId,
    email: data.userEmail,
    plan: data.plan,
    monthly_revenue: data.monthlyRevenue,
    billing_status: "active",
    last_login: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  mockDatabase.users.set(userId, user)

  // Record activity
  const activity = {
    user_id: userId,
    last_login: new Date().toISOString(),
    recorded_at: new Date().toISOString(),
  }

  mockDatabase.activities.set(`${userId}_${Date.now()}`, activity)

  console.log(`[API] Login tracked for user: ${userId}`)
}

async function handleFeatureUsageEvent(userId: string, data: any) {
  const { featureName, usageCount, metadata } = data

  const featureUsage = {
    user_id: userId,
    feature_name: featureName,
    usage_count: usageCount,
    last_used: new Date().toISOString(),
    metadata: metadata || {},
    recorded_at: new Date().toISOString(),
  }

  mockDatabase.features.set(`${userId}_${featureName}_${Date.now()}`, featureUsage)

  console.log(`[API] Feature usage tracked: ${featureName} for user: ${userId}`)
}

async function handleSessionEndEvent(userId: string, data: any) {
  const { sessionDuration, featuresUsed } = data

  // Update user activity with session data
  const activity = {
    user_id: userId,
    avg_session_duration: sessionDuration,
    feature_usage_count: featuresUsed?.length || 0,
    recorded_at: new Date().toISOString(),
  }

  mockDatabase.activities.set(`${userId}_session_${Date.now()}`, activity)

  console.log(`[API] Session end tracked for user: ${userId}, duration: ${sessionDuration}min`)
}

async function handleSupportTicketEvent(userId: string, data: any) {
  // Increment support ticket count for user
  const activity = {
    user_id: userId,
    support_tickets: 1,
    ticket_data: data,
    recorded_at: new Date().toISOString(),
  }

  mockDatabase.activities.set(`${userId}_ticket_${Date.now()}`, activity)

  console.log(`[API] Support ticket tracked for user: ${userId}`)
}

async function handleBillingUpdateEvent(userId: string, data: any) {
  // Update user billing information
  const existingUser = mockDatabase.users.get(userId) || {}
  const updatedUser = {
    ...existingUser,
    user_id: userId,
    plan: data.plan || existingUser.plan,
    monthly_revenue: data.monthlyRevenue || existingUser.monthly_revenue,
    billing_status: data.billingStatus || existingUser.billing_status,
    updated_at: new Date().toISOString(),
  }

  mockDatabase.users.set(userId, updatedUser)

  console.log(`[API] Billing updated for user: ${userId}`)
}

function generateEventId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}
