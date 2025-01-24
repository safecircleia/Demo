import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { ProfileForm } from "@/components/profile/ProfileForm"
import { prisma } from "@/lib/prisma"

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user) redirect("/auth/login")

  const email = session.user.email;
  if (!email) redirect("/auth/login");

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    }
  })

  if (!user) redirect("/auth/login")

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile Settings"
        description="Manage your account settings and preferences."
      />
      <ProfileForm user={user} />
    </div>
  )
}