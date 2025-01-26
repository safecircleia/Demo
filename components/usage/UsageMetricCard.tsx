import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { LucideIcon } from "lucide-react"

interface UsageMetricCardProps {
  title: string
  value: number | string
  max?: number
  icon: LucideIcon
  percent?: number
  trend?: "up" | "down"
  trendValue?: string
  status?: "good" | "warning" | "error"
  variant?: "default" | "muted"
}

export function UsageMetricCard({
  title,
  value,
  max,
  icon: Icon,
  percent,
  trend,
  trendValue,
  status,
  variant = "default"
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
        <p className={`text-2xl font-bold ${variant === "muted" ? "text-muted-foreground" : ""}`}>
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
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