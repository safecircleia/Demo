// app/dashboard/page.tsx
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Card } from "@/components/ui/card"

export default async function DashboardPage() {
  const session = await auth()

  if (!session) {
    redirect("/auth/login")
  }

  return (
    <div className="container mx-auto p-8 pt-32">
      <h1 className="text-4xl font-bold gradient-text mb-8">Family Dashboard</h1>
      
      {session.user.accountType === 'parent' && (
        <Card className="glass-card p-6">
          <h2 className="text-2xl font-semibold mb-4">Family Members</h2>
          <div className="space-y-4">
            {/* Add child management UI here */}
          </div>
        </Card>
      )}
    </div>
  )
}