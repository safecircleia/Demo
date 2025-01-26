import { SUBSCRIPTION_LIMITS } from "@/lib/constants"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { UsageAnalytics } from "@/components/usage/UsageAnalytics"
import { withAccelerate } from "@prisma/extension-accelerate"

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

  const planLimits = SUBSCRIPTION_LIMITS[user.subscriptionPlan.toLowerCase() as keyof typeof SUBSCRIPTION_LIMITS]

  const totalUsage = user.apiKeys.reduce((sum, key) => sum + key.usageCount, 0)
  const totalLimit = planLimits.totalUsage
  const usagePercentage = (totalUsage / totalLimit) * 100

  return (
    <UsageAnalytics 
      usageTrend={[]}
      initialUsage={{
        total: totalUsage,
        limit: totalLimit,
        percentage: usagePercentage,
        remainingKeys: planLimits.apiKeys - user.apiKeys.length
      }}
      apiKeys={user.apiKeys}
      planLimits={planLimits}
      userId={user.id}
    />
  )
}