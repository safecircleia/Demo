import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { prisma } from "@/lib/prisma"
import { Activity, AlertCircle, ArrowDown, ArrowUp, Clock } from "lucide-react"
import { Overview } from "@/components/dashboard/Overview"

export default async function UsageAnalyticsPage() {
  const session = await auth()
  if (!session?.user) redirect("/auth/login")

  const user = await prisma.user.findUnique({
    where: { email: session.user.email ?? undefined },
    include: {
      apiKeys: true
    }
  })

  if (!user) redirect("/auth/login")

  // Calculate total usage across all keys
  const totalUsage = user.apiKeys.reduce((sum, key) => sum + key.usageCount, 0)
  const totalLimit = user.apiKeys.reduce((sum, key) => sum + key.usageLimit, 0)
  const usagePercentage = (totalUsage / totalLimit) * 100

  // Mock data for chart
  const chartData = [
    { name: "Mon", total: 150 },
    { name: "Tue", total: 230 },
    { name: "Wed", total: 180 },
    { name: "Thu", total: 340 },
    { name: "Fri", total: 280 },
    { name: "Sat", total: 120 },
    { name: "Sun", total: 90 },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Usage Analytics"
        description="Monitor your API usage and analytics."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Total API Calls</h3>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold">{totalUsage.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              of {totalLimit.toLocaleString()} available
            </p>
          </div>
          <div className="mt-4 h-2 w-full bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${usagePercentage}%` }}
            />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Average Response Time</h3>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold">245ms</div>
            <p className="text-xs text-green-500 flex items-center">
              <ArrowDown className="h-3 w-3 mr-1" />
              12% from last week
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Error Rate</h3>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold">0.8%</div>
            <p className="text-xs text-red-500 flex items-center">
              <ArrowUp className="h-3 w-3 mr-1" />
              0.3% from last week
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Active Keys</h3>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold">{user.apiKeys.length}</div>
            <p className="text-xs text-muted-foreground">
              Total API keys in use
            </p>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-6">Usage Over Time</h3>
        <Overview data={chartData} />
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-6">API Keys Usage</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Key Name</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Limit</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Used</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {user.apiKeys.map((key) => (
              <TableRow key={key.id}>
                <TableCell className="font-medium">{key.name}</TableCell>
                <TableCell>{key.usageCount}</TableCell>
                <TableCell>{key.usageLimit}</TableCell>
                <TableCell>
                  <Badge variant={key.usageCount < key.usageLimit ? "success" : "destructive"}>
                    {key.usageCount < key.usageLimit ? "Active" : "Exceeded"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {key.lastUsed ? new Date(key.lastUsed).toLocaleDateString() : "Never"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}