import { churnaizerAI } from "./ai-services"

// Email templates for automated communications
export const emailTemplates = {
  weeklyDigest: {
    subject: "📊 Your Weekly Retention Report - Churnaizer",
    template: `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #8b5cf6; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">Churnaizer Weekly Report</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Your retention insights for {{dateRange}}</p>
      </div>
      
      <div style="padding: 30px 20px;">
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #1f2937; margin: 0 0 15px 0;">📈 Key Metrics</h2>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
            <div>
              <div style="font-size: 24px; font-weight: bold; color: #dc2626;">{{churnRate}}%</div>
              <div style="color: #6b7280; font-size: 14px;">Churn Rate</div>
            </div>
            <div>
              <div style="font-size: 24px; font-weight: bold; color: #dc2626;">{{highRiskUsers}}</div>
              <div style="color: #6b7280; font-size: 14px;">High Risk Users</div>
            </div>
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <h2 style="color: #1f2937; margin: 0 0 15px 0;">🚨 Urgent Actions</h2>
          <ul style="color: #374151; line-height: 1.6;">
            {{#each urgentActions}}
            <li style="margin-bottom: 8px;">{{this}}</li>
            {{/each}}
          </ul>
        </div>

        <div style="margin-bottom: 20px;">
          <h2 style="color: #1f2937; margin: 0 0 15px 0;">💡 Key Insights</h2>
          <ul style="color: #374151; line-height: 1.6;">
            {{#each insights}}
            <li style="margin-bottom: 8px;">{{this}}</li>
            {{/each}}
          </ul>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <a href="{{dashboardUrl}}" style="background: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Full Dashboard
          </a>
        </div>
      </div>
    </div>
    `,
  },

  highRiskAlert: {
    subject: "🚨 High Churn Risk Alert - {{userEmail}}",
    template: `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #dc2626; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 20px;">🚨 High Churn Risk Alert</h1>
      </div>
      
      <div style="padding: 20px;">
        <p><strong>User:</strong> {{userEmail}}</p>
        <p><strong>Churn Score:</strong> {{churnScore}}%</p>
        <p><strong>Plan:</strong> {{plan}}</p>
        <p><strong>Last Login:</strong> {{lastLogin}}</p>
        
        <h3>Recommended Actions:</h3>
        <ul>
          {{#each recommendations}}
          <li>{{this}}</li>
          {{/each}}
        </ul>
        
        <div style="margin-top: 20px; text-align: center;">
          <a href="{{userUrl}}" style="background: #dc2626; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
            View User Details
          </a>
        </div>
      </div>
    </div>
    `,
  },

  reactivationEmail: {
    subject: "We miss you! Come back to {{productName}}",
    template: `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #8b5cf6; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">We miss you, {{userName}}!</h1>
      </div>
      
      <div style="padding: 20px;">
        <p>Hi {{userName}},</p>
        <p>We noticed you haven't been active lately. Here's what you've been missing:</p>
        
        <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0;">🚀 New Features</h3>
          <ul>
            {{#each newFeatures}}
            <li>{{this}}</li>
            {{/each}}
          </ul>
        </div>
        
        <p>Ready to get back in? We're here to help!</p>
        
        <div style="text-align: center; margin: 20px 0;">
          <a href="{{loginUrl}}" style="background: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Log Back In
          </a>
        </div>
        
        <p style="font-size: 14px; color: #6b7280;">
          Need help? Reply to this email or contact our support team.
        </p>
      </div>
    </div>
    `,
  },
}

// Slack message templates
export const slackTemplates = {
  weeklyDigest: {
    text: "📊 Weekly Retention Report",
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "📊 Weekly Retention Report",
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: "*Churn Rate:*\n{{churnRate}}%",
          },
          {
            type: "mrkdwn",
            text: "*High Risk Users:*\n{{highRiskUsers}}",
          },
          {
            type: "mrkdwn",
            text: "*Total Users:*\n{{totalUsers}}",
          },
          {
            type: "mrkdwn",
            text: "*Avg Revenue:*\n${{avgRevenue}}",
          },
        ],
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*🚨 Urgent Actions:*\n{{urgentActions}}",
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "View Dashboard",
            },
            url: "{{dashboardUrl}}",
            style: "primary",
          },
        ],
      },
    ],
  },

  highRiskAlert: {
    text: "🚨 High Churn Risk Alert",
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "🚨 High Churn Risk Alert",
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*User:* {{userEmail}}\n*Churn Score:* {{churnScore}}%\n*Plan:* {{plan}}\n*Last Login:* {{lastLogin}}",
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*Recommended Actions:*\n{{recommendations}}",
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "View User",
            },
            url: "{{userUrl}}",
            style: "danger",
          },
        ],
      },
    ],
  },
}

// Automation service class
export class AutomationService {
  // Send weekly digest email
  async sendWeeklyDigest(recipientEmail: string, dashboardData: any) {
    const insights = await churnaizerAI.generateExecutiveSummary(dashboardData)

    const emailData = {
      to: recipientEmail,
      subject: emailTemplates.weeklyDigest.subject,
      html: this.renderTemplate(emailTemplates.weeklyDigest.template, {
        dateRange: this.getWeekRange(),
        churnRate: dashboardData.churnRate,
        highRiskUsers: dashboardData.highRiskUsers,
        urgentActions: [
          `Contact ${dashboardData.highRiskUsers} high-risk users immediately`,
          `Address top churn reason: ${dashboardData.topChurnReasons[0]?.category}`,
          `Review users inactive for 7+ days`,
        ],
        insights: insights.split("\n").filter((line: string) => line.trim()),
        dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      }),
    }

    return this.sendEmail(emailData)
  }

  // Send high-risk user alert
  async sendHighRiskAlert(recipientEmail: string, userData: any, recommendations: any[]) {
    const emailData = {
      to: recipientEmail,
      subject: this.renderTemplate(emailTemplates.highRiskAlert.subject, userData),
      html: this.renderTemplate(emailTemplates.highRiskAlert.template, {
        ...userData,
        churnScore: Math.round(userData.churn_score * 100),
        lastLogin: new Date(userData.last_login).toLocaleDateString(),
        recommendations: recommendations.map((r) => r.title),
        userUrl: `${process.env.NEXT_PUBLIC_APP_URL}/users/${userData.user_id}`,
      }),
    }

    return this.sendEmail(emailData)
  }

  // Send reactivation email to inactive users
  async sendReactivationEmail(userEmail: string, userData: any) {
    const emailData = {
      to: userEmail,
      subject: this.renderTemplate(emailTemplates.reactivationEmail.subject, {
        productName: "Your SaaS App",
      }),
      html: this.renderTemplate(emailTemplates.reactivationEmail.template, {
        userName: userData.name || userEmail.split("@")[0],
        newFeatures: ["Advanced Analytics Dashboard", "Real-time Notifications", "API Integrations"],
        loginUrl: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
      }),
    }

    return this.sendEmail(emailData)
  }

  // Send Slack notification
  async sendSlackNotification(webhookUrl: string, template: any, data: any) {
    const message = {
      ...template,
      blocks: template.blocks.map((block: any) => this.renderSlackBlock(block, data)),
    }

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
      })

      if (!response.ok) {
        throw new Error(`Slack API error: ${response.statusText}`)
      }

      console.log("[Automation] Slack notification sent successfully")
      return { success: true }
    } catch (error) {
      console.error("[Automation] Failed to send Slack notification:", error)
      return { success: false, error }
    }
  }

  // Schedule automated tasks
  async scheduleAutomations() {
    // Weekly digest (every Monday at 9 AM)
    this.scheduleTask("weekly-digest", "0 9 * * 1", async () => {
      const dashboardData = await this.fetchDashboardData()
      const adminEmails = await this.getAdminEmails()

      for (const email of adminEmails) {
        await this.sendWeeklyDigest(email, dashboardData)
      }
    })

    // Daily high-risk check (every day at 10 AM)
    this.scheduleTask("high-risk-check", "0 10 * * *", async () => {
      const highRiskUsers = await this.getHighRiskUsers()
      const adminEmails = await this.getAdminEmails()

      for (const user of highRiskUsers) {
        const recommendations = await this.getUserRecommendations(user.user_id)
        for (const email of adminEmails) {
          await this.sendHighRiskAlert(email, user, recommendations)
        }
      }
    })

    // Reactivation emails (every Tuesday and Thursday at 2 PM)
    this.scheduleTask("reactivation-emails", "0 14 * * 2,4", async () => {
      const inactiveUsers = await this.getInactiveUsers()

      for (const user of inactiveUsers) {
        await this.sendReactivationEmail(user.email, user)
      }
    })

    console.log("[Automation] All automation tasks scheduled")
  }

  // Helper methods
  private renderTemplate(template: string, data: any): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] || match
    })
  }

  private renderSlackBlock(block: any, data: any): any {
    const blockStr = JSON.stringify(block)
    const rendered = this.renderTemplate(blockStr, data)
    return JSON.parse(rendered)
  }

  private getWeekRange(): string {
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    return `${weekAgo.toLocaleDateString()} - ${now.toLocaleDateString()}`
  }

  private async sendEmail(emailData: any) {
    // Mock email sending (replace with actual email service)
    console.log("[Automation] Email sent:", {
      to: emailData.to,
      subject: emailData.subject,
    })
    return { success: true, messageId: `msg_${Date.now()}` }
  }

  private scheduleTask(name: string, cron: string, task: () => Promise<void>) {
    // Mock task scheduling (replace with actual cron scheduler)
    console.log(`[Automation] Task scheduled: ${name} (${cron})`)
  }

  private async fetchDashboardData() {
    // Mock data fetch
    return {
      totalUsers: 1247,
      churnRate: 12.7,
      highRiskUsers: 89,
      avgRevenue: 99.92,
      topChurnReasons: [{ category: "Pricing", count: 45 }],
    }
  }

  private async getAdminEmails(): Promise<string[]> {
    return ["admin@company.com", "founder@company.com"]
  }

  private async getHighRiskUsers() {
    // Mock high-risk users
    return [
      {
        user_id: "user_003",
        email: "mike@saasapp.com",
        churn_score: 0.85,
        plan: "Basic",
        last_login: "2024-01-08T14:20:00Z",
      },
    ]
  }

  private async getUserRecommendations(userId: string) {
    return [
      { title: "Send reactivation email" },
      { title: "Offer retention discount" },
      { title: "Schedule customer success call" },
    ]
  }

  private async getInactiveUsers() {
    return [
      {
        user_id: "user_inactive",
        email: "inactive@example.com",
        name: "Inactive User",
        last_login: "2024-01-01T00:00:00Z",
      },
    ]
  }
}

// Export singleton instance
export const automationService = new AutomationService()
