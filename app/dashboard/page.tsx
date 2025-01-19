// app/dashboard/page.tsx
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Card } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { FamilyMembers } from "@/components/dashboard/FamilyMembers"
import { FamilyCode } from "@/components/dashboard/FamilyCode"
import { prisma } from "@/lib/prisma"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/login")
  }

  // Fetch user with family members
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      familyMembers: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          accountType: true
        }
      }
    }
  })

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="container mx-auto p-8 pt-32">
      <DashboardHeader user={user} />
      
      {user.accountType === 'parent' && (
        <div className="space-y-6">
          <FamilyCode familyCode={user.familyCode || ''} />
          
          <Card className="glass-card p-6">
            <h2 className="text-2xl font-semibold mb-4">Family Members</h2>
            <FamilyMembers members={user.familyMembers} />
          </Card>
        </div>
      )}

      {user.accountType === 'child' && (
        <Card className="glass-card p-6">
          <h2 className="text-2xl font-semibold mb-4">My Activity</h2>
          {/* Child dashboard content will go here */}
        </Card>
      )}
    </div>
  )
}