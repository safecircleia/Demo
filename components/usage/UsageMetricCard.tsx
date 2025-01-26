import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { LucideIcon } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

interface UsageMetricCardProps {
  apiKey: string
  title: string
  value?: number | string
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
  apiKey,
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
  const [usage, setUsage] = useState(0)

  useEffect(() => {
    fetchInitialUsage()
    
    // Subscribe to changes
    const channel = supabase
      .channel('api_usage_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'api_usage',
          filter: `api_key_id=eq.${hashApiKey(apiKey)}`
        },
        (payload) => {
          setUsage(payload.new.count)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [apiKey])

  async function fetchInitialUsage() {
    const { data } = await supabase
      .from('api_usage')
      .select('count')
      .eq('api_key_id', hashApiKey(apiKey))
      .single()
    
    if (data) {
      setUsage(data.count)
    }
  }

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
            <Progress value={percent} />
            <p className="text-xs text-muted-foreground">
              of {max.toLocaleString()} ({percent?.toFixed(1)}%)
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