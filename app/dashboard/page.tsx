// app/dashboard/page.tsx
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Card } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { FamilyMembers } from "@/components/dashboard/FamilyMembers"
import { FamilyCode } from "@/components/dashboard/FamilyCode"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bell } from "lucide-react"
import { prisma } from "@/lib/prisma"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) {
    redirect("/auth/login")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email ?? undefined },
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
    redirect("/onboarding")
  }

  return (
    <>
      <DashboardHeader user={user} />
      
      <Card className="mb-6 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
          <Bell className="h-5 w-5 text-gray-400" />
        </div>
        <div className="space-y-4">
          {/* Activity placeholders */}
          {/* ...existing activity items... */}
        </div>
      </Card>

      {user.accountType === 'parent' && (
        <div className="space-y-6">
          <FamilyCode familyCode={user.familyCode || ''} />
          <Card className="p-6">
            <FamilyMembers 
              members={user.familyMembers.map(member => ({
                id: member.id,
                name: member.name || 'Unnamed Member',
                email: member.email || '',
                image: member.image || '',
                accountType: member.accountType
              }))} 
            />
          </Card>
        </div>
      )}
    </>
  )
}