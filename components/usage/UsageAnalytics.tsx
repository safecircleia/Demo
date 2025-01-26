'use client'

import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Overview } from "@/components/dashboard/Overview"
import { UsageMetricCard } from "./UsageMetricCard"
import { Activity, Key, Zap, LineChart } from "lucide-react"

interface UsageAnalyticsProps {
  usageTrend: any[]
  initialUsage: {
    total: number
    limit: number
    percentage: number
    remainingKeys: number
  }
  apiKeys: any[]
  planLimits: any
  userId: string
}

export function UsageAnalytics({ 
  usageTrend: initialTrend, 
  initialUsage,
  apiKeys,
  planLimits,
  userId
}: UsageAnalyticsProps) {
  const [usage] = useState(initialUsage)
  const [trend] = useState(initialTrend)

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <UsageMetricCard
          title="Total API Calls"
          value={usage.total}
          max={usage.limit}
          icon={Activity}
          percent={usage.percentage}
          trend="up"
          trendValue="12%"
        />
        
        <UsageMetricCard
          title="API Keys"
          value={apiKeys.length}
          max={planLimits.apiKeys}
          icon={Key}
          percent={(apiKeys.length / planLimits.apiKeys) * 100}
        />

        <UsageMetricCard
          title="Rate Limit"
          value={planLimits.rateLimit}
          icon={Zap}
          status="good"
        />

        <UsageMetricCard
          title="Plan Status"
          value={planLimits.name}
          icon={LineChart}
          variant="default"
        />
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-6">Usage Over Time</h3>
        <Overview data={trend} />
      </Card>
    </div>
  )
}