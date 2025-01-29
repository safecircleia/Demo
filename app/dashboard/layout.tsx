import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { prisma } from "@/lib/prisma"
import { AlertTriangle } from "lucide-react"
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user?.email) {
    redirect("/auth/login")
  }

  const user = await prisma.user.findUnique({
    where: { 
      email: session.user.email 
    },
    select: {
      name: true,
      image: true,
      isBetaUser: true,
      accountType: true
    }
  })

  if (!user) {
    redirect("/auth/login")
  }

  // Create a safe user object with default values for nullable fields
  const safeUser = {
    name: user.name || 'Anonymous User',
    image: user.image || undefined,
    isBetaUser: user.isBetaUser || false,
    accountType: user.accountType
  }

  return (
    <div className="flex">
      <DashboardSidebar user={safeUser} accountType={user.accountType} />
      <main className="flex-1">
        <div className="p-5">
          {children}
          <Analytics />
          <SpeedInsights />
        </div>
      </main>
    </div>
  )
}