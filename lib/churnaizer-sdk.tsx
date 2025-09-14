// Churnaizer JavaScript SDK for client-side data collection
export interface ChurnaizerConfig {
  apiKey: string
  apiUrl?: string
  userId: string
  userEmail?: string
  plan: string
  monthlyRevenue: number
  debug?: boolean
}

export interface UserEvent {
  type: "login" | "feature_usage" | "session_end" | "support_ticket" | "billing_update"
  userId: string
  timestamp: number
  data?: Record<string, any>
}

export interface CancellationData {
  userId: string
  reason: string
  category?: string
  timestamp: number
}

class ChurnaizerSDK {
  private config: ChurnaizerConfig
  private sessionStart: number
  private featureUsage: Map<string, number> = new Map()
  private isInitialized = false

  constructor(config: ChurnaizerConfig) {
    this.config = {
      apiUrl: "https://api.churnaizer.com",
      debug: false,
      ...config,
    }
    this.sessionStart = Date.now()
    this.init()
  }

  private init() {
    if (typeof window === "undefined") {
      console.warn("[Churnaizer] SDK can only be used in browser environment")
      return
    }

    this.isInitialized = true
    this.trackLogin()
    this.setupEventListeners()

    if (this.config.debug) {
      console.log("[Churnaizer] SDK initialized", this.config)
    }
  }

  private setupEventListeners() {
    // Track page visibility changes for session duration
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.trackSessionEnd()
      } else {
        this.sessionStart = Date.now()
      }
    })

    // Track before page unload
    window.addEventListener("beforeunload", () => {
      this.trackSessionEnd()
    })
  }

  // Track user login
  public trackLogin() {
    this.sendEvent({
      type: "login",
      userId: this.config.userId,
      timestamp: Date.now(),
      data: {
        plan: this.config.plan,
        monthlyRevenue: this.config.monthlyRevenue,
        userEmail: this.config.userEmail,
      },
    })
  }

  // Track feature usage
  public trackFeature(featureName: string, metadata?: Record<string, any>) {
    const currentCount = this.featureUsage.get(featureName) || 0
    this.featureUsage.set(featureName, currentCount + 1)

    this.sendEvent({
      type: "feature_usage",
      userId: this.config.userId,
      timestamp: Date.now(),
      data: {
        featureName,
        usageCount: currentCount + 1,
        metadata,
      },
    })

    if (this.config.debug) {
      console.log(`[Churnaizer] Feature tracked: ${featureName}`)
    }
  }

  // Track session end
  private trackSessionEnd() {
    const sessionDuration = Math.round((Date.now() - this.sessionStart) / 1000 / 60) // in minutes

    this.sendEvent({
      type: "session_end",
      userId: this.config.userId,
      timestamp: Date.now(),
      data: {
        sessionDuration,
        featuresUsed: Array.from(this.featureUsage.entries()).map(([name, count]) => ({
          feature: name,
          count,
        })),
      },
    })
  }

  // Track support ticket creation
  public trackSupportTicket(ticketData?: Record<string, any>) {
    this.sendEvent({
      type: "support_ticket",
      userId: this.config.userId,
      timestamp: Date.now(),
      data: ticketData,
    })
  }

  // Update billing information
  public updateBilling(billingData: {
    plan?: string
    monthlyRevenue?: number
    billingStatus?: string
  }) {
    this.config.plan = billingData.plan || this.config.plan
    this.config.monthlyRevenue = billingData.monthlyRevenue || this.config.monthlyRevenue

    this.sendEvent({
      type: "billing_update",
      userId: this.config.userId,
      timestamp: Date.now(),
      data: billingData,
    })
  }

  // Show cancellation feedback popup
  public showCancellationPopup(): Promise<CancellationData | null> {
    return new Promise((resolve) => {
      if (typeof window === "undefined") {
        resolve(null)
        return
      }

      // Create modal overlay
      const overlay = document.createElement("div")
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      `

      // Create modal content
      const modal = document.createElement("div")
      modal.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 8px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      `

      modal.innerHTML = `
        <h2 style="margin: 0 0 1rem 0; font-size: 1.5rem; font-weight: 600; color: #1f2937;">
          We're sorry to see you go
        </h2>
        <p style="margin: 0 0 1.5rem 0; color: #6b7280; line-height: 1.5;">
          Help us improve by letting us know why you're cancelling:
        </p>
        <textarea 
          id="cancellation-reason" 
          placeholder="Tell us what we could have done better..."
          style="
            width: 100%;
            min-height: 100px;
            padding: 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-size: 0.875rem;
            resize: vertical;
            margin-bottom: 1.5rem;
            font-family: inherit;
          "
        ></textarea>
        <div style="display: flex; gap: 0.75rem; justify-content: flex-end;">
          <button 
            id="cancel-feedback" 
            style="
              padding: 0.5rem 1rem;
              border: 1px solid #d1d5db;
              background: white;
              border-radius: 6px;
              cursor: pointer;
              font-size: 0.875rem;
            "
          >
            Skip
          </button>
          <button 
            id="submit-feedback" 
            style="
              padding: 0.5rem 1rem;
              background: #8b5cf6;
              color: white;
              border: none;
              border-radius: 6px;
              cursor: pointer;
              font-size: 0.875rem;
            "
          >
            Submit Feedback
          </button>
        </div>
      `

      overlay.appendChild(modal)
      document.body.appendChild(overlay)

      const textarea = modal.querySelector("#cancellation-reason") as HTMLTextAreaElement
      const submitBtn = modal.querySelector("#submit-feedback") as HTMLButtonElement
      const cancelBtn = modal.querySelector("#cancel-feedback") as HTMLButtonElement

      const cleanup = () => {
        document.body.removeChild(overlay)
      }

      submitBtn.addEventListener("click", () => {
        const reason = textarea.value.trim()
        cleanup()

        if (reason) {
          const cancellationData: CancellationData = {
            userId: this.config.userId,
            reason,
            timestamp: Date.now(),
          }

          this.sendCancellationFeedback(cancellationData)
          resolve(cancellationData)
        } else {
          resolve(null)
        }
      })

      cancelBtn.addEventListener("click", () => {
        cleanup()
        resolve(null)
      })

      // Focus textarea
      setTimeout(() => textarea.focus(), 100)
    })
  }

  // Send cancellation feedback
  private async sendCancellationFeedback(data: CancellationData) {
    try {
      await fetch(`${this.config.apiUrl}/api/cancellation-feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify(data),
      })

      if (this.config.debug) {
        console.log("[Churnaizer] Cancellation feedback sent", data)
      }
    } catch (error) {
      console.error("[Churnaizer] Failed to send cancellation feedback:", error)
    }
  }

  // Send event to API
  private async sendEvent(event: UserEvent) {
    if (!this.isInitialized) return

    try {
      await fetch(`${this.config.apiUrl}/api/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify(event),
      })

      if (this.config.debug) {
        console.log("[Churnaizer] Event sent:", event)
      }
    } catch (error) {
      console.error("[Churnaizer] Failed to send event:", error)
    }
  }

  // Get current session data
  public getSessionData() {
    return {
      userId: this.config.userId,
      sessionDuration: Math.round((Date.now() - this.sessionStart) / 1000 / 60),
      featuresUsed: Array.from(this.featureUsage.entries()),
      config: this.config,
    }
  }
}

// Export SDK class and factory function
export default ChurnaizerSDK

// Factory function for easier initialization
export function initChurnaizer(config: ChurnaizerConfig): ChurnaizerSDK {
  return new ChurnaizerSDK(config)
}

// Global window interface for browser usage
declare global {
  interface Window {
    Churnaizer?: typeof ChurnaizerSDK
    churnaizer?: ChurnaizerSDK
  }
}

// Auto-initialize if config is provided via window
if (typeof window !== "undefined") {
  window.Churnaizer = ChurnaizerSDK

  // Check for global config
  const globalConfig = (window as any).CHURNAIZER_CONFIG
  if (globalConfig) {
    window.churnaizer = new ChurnaizerSDK(globalConfig)
  }
}
