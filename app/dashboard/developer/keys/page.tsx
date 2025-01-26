import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { Card } from "@/components/ui/card"
import { ApiKeyManager } from "@/components/api-keys/ApiKeyManager"
import { prisma } from "@/lib/prisma"

export default async function ApiKeysPage() {
  const session = await auth()
  if (!session?.user?.email) redirect("/auth/login")

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      subscriptionPlan: true,
      apiKeys: {
        select: {
          id: true,
          name: true,
          keyPrefix: true,
          createdAt: true,
          lastUsed: true,
          usageCount: true,
          usage: {
            where: {
              month: {
                gte: new Date(new Date().setDate(1)) // First day of current month
              }
            },
            select: {
              count: true,
              month: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!user) redirect("/auth/login")

  const isFreeTier = user.subscriptionPlan === 'free'

  return (
    <div className="space-y-6">
      <PageHeader
        title="API Keys"
        description="Manage your API keys for integrating with our services."
      />

      <Card className="p-6">
        <ApiKeyManager 
          apiKeys={user.apiKeys} 
          isFreeTier={isFreeTier}
          subscriptionPlan={user.subscriptionPlan.toLowerCase() as 'free' | 'pro' | 'premium'}
        />
      </Card>
    </div>
  )
}