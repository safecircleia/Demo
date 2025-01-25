import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { DashboardClient } from "@/components/dashboard/DashboardClient"
import { prisma } from "@/lib/prisma"
import { DashboardUser, isFamilyRole, FamilyRole } from "@/types/user"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.email) redirect("/auth/login")

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      familyRole: true,
      family: {
        select: {
          id: true,
          name: true,
          code: true,
          members: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              accountType: true
            }
          }
        }
      },
      sentInvitations: {
        select: {
          id: true,
          status: true,
          invited: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }
    }
  })

  if (!dbUser) redirect("/auth/login")
  if (!isFamilyRole(dbUser.familyRole)) redirect("/auth/login")

  const safeUser: DashboardUser = {
    id: dbUser.id,
    name: dbUser.name || "",
    email: dbUser.email || session.user.email,
    familyRole: dbUser.familyRole as FamilyRole,
    family: dbUser.family ? {
      id: dbUser.family.id,
      name: dbUser.family.name,
      code: dbUser.family.code,
      members: dbUser.family.members
    } : undefined,
    sentInvitations: dbUser.sentInvitations
      .filter((inv): inv is { id: string; status: string; invited: { id: string; name: string | null; email: string | null } } => 
        inv.invited !== null
      )
      .map(inv => ({
        id: inv.id,
        status: inv.status,
        invited: {
          id: inv.invited.id,
          name: inv.invited.name,
          email: inv.invited.email
        }
      }))
  }

  return <DashboardClient user={safeUser} />
}