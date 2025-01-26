'use client'

import { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Overview } from "@/components/dashboard/Overview"
import { UsageMetricCard } from "./UsageMetricCard"
import { Activity, Key, Zap, LineChart } from "lucide-react"
import { useApiUsageStream } from "@/hooks/useApiUsageStream"
import { motion, AnimatePresence } from "framer-motion"
import { SUBSCRIPTION_LIMITS, type PlanName } from "@/lib/constants"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { LucideIcon } from "lucide-react"
import { supabase } from '@/lib/supabase'

interface PlanLimits {
  name: PlanName
  apiKeys: number
  rateLimit: number
}

interface UsageAnalyticsProps {
  usageTrend: any[]
  initialUsage: {
    total: number
    limit: number
    percentage: number
    remainingKeys: number
  }
  apiKeys: any[]
  planLimits: PlanLimits
  userId: string
}

export function UsageAnalytics({ 
  usageTrend: initialTrend, 
  initialUsage,
  apiKeys,
  planLimits,
  userId,
  apiKeyId
}: UsageAnalyticsProps & { apiKeyId: string }) {
  const [usage, setUsage] = useState(initialUsage)
  const [trend, setTrend] = useState(initialTrend)
  const [prevTotal, setPrevTotal] = useState(initialUsage.total)
  const [currentUsage, setCurrentUsage] = useState<number>(0)

  const monthlyQuota = SUBSCRIPTION_LIMITS[planLimits?.name?.toLowerCase() as PlanName]?.totalUsage ?? 1000

  useApiUsageStream((data) => {
    const apiKey = apiKeys.find(key => key.id === data.apiKeyId)
    if (apiKey) {
      setPrevTotal(usage.total)
      setUsage(prev => ({
        ...prev,
        total: data.total,
        limit: monthlyQuota,
        percentage: (data.total / monthlyQuota) * 100
      }))

      setTrend(prev => {
        const now = new Date().toISOString().split('T')[0]
        const lastPoint = prev[prev.length - 1]
        
        if (lastPoint?.date === now) {
          return prev.map((point, i) => 
            i === prev.length - 1 
              ? { ...point, total: data.total }
              : point
          )
        }
        return [...prev, { date: now, total: data.total }]
      })
    }
  })

  useEffect(() => {
    // Initial fetch
    fetchCurrentUsage()

    // Subscribe to changes
    const channel = supabase
      .channel('api_usage_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'ApiUsage',
          filter: `apiKeyId=eq.${apiKeyId}`
        },
        (payload) => {
          setCurrentUsage(payload.new.count)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [apiKeyId])

  async function fetchCurrentUsage() {
    const { data, error } = await supabase
      .from('ApiUsage')
      .select('count')
      .eq('apiKeyId', apiKeyId)
      .single()

    if (!error && data) {
      setCurrentUsage(data.count)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <UsageMetricCard
          title="Total API Calls"
          value={usage.total}
          max={monthlyQuota}
          prevValue={prevTotal}
          icon={Activity}
          percent={usage.percentage}
          trend={usage.total > prevTotal ? "up" : "down"}
          trendValue={`${Math.abs(usage.total - prevTotal)}`}
          animate={true}
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

        <UsageMetricCard
          title="API Calls"
          value={currentUsage}
          icon={Activity}
          // ... other props
        />
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-6">Usage Over Time</h3>
        <Overview data={trend} />
      </Card>
    </div>
  )
}

interface UsageMetricCardProps {
  title: string
  value: number | string
  max?: number
  prevValue?: number | string
  icon: LucideIcon
  percent?: number
  trend?: "up" | "down"
  trendValue?: string
  status?: "good" | "warning" | "error"
  variant?: "default" | "muted"
  animate?: boolean
}

export function UsageMetricCard({
  title,
  value,
  max,
  prevValue,
  icon: Icon,
  percent,
  trend,
  trendValue,
  status,
  variant = "default",
  animate = false
}: UsageMetricCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          <h3 className="text-sm font-medium">{title}</h3>
        </div>
        {trend && (
          <Badge variant={trend === "up" ? "success" : "destructive"}>
            {trend === "up" ? "↑" : "↓"} {trendValue}
          </Badge>
        )}
      </div>
      <div className="mt-2">
        <AnimatePresence mode="wait">
          <motion.p
            key={value?.toString() ?? '0'}
            initial={animate ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`text-2xl font-bold ${variant === "muted" ? "text-muted-foreground" : ""}`}
          >
            {typeof value === "number" ? value.toLocaleString() : value || '0'}
          </motion.p>
        </AnimatePresence>
        {max && (
          <div className="mt-2 space-y-1">
            <Progress value={percent ?? 0} />
            <p className="text-xs text-muted-foreground">
              of {max.toLocaleString()} ({(percent ?? 0).toFixed(1)}%)
            </p>
          </div>
        )}
        {status && (
          <Badge variant={
            status === "good" ? "success" :
            status === "warning" ? "warning" : "destructive"
          } className="mt-2">
            {status.toUpperCase()}
          </Badge>
        )}
      </div>
    </Card>
  )
}