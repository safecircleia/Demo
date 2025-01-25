import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { DashboardClient } from "@/components/dashboard/DashboardClient"
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
      },
      sentInvitations: {
        select: {
          id: true,
          email: true,
          status: true,
          invited: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              accountType: true,
            }
          }
        }
      }
    }
  })

  if (!user) {
    redirect("/onboarding")
  }

  return <DashboardClient user={user} />
}