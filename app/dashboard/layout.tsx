import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { prisma } from "@/lib/prisma"
import { AlertTriangle } from "lucide-react"

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
    <div className="flex h-screen pt-16">
      <DashboardSidebar user={safeUser} accountType={user.accountType} />
      <main className="flex-1">
        <div className="relative p-4 border-b border-yellow-500/50 bg-gradient-to-r from-yellow-500/10 via-white/10 to-yellow-500/10 backdrop-blur-sm">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.1)_10px,rgba(255,255,255,0.1)_20px)] animate-[move-stripes_3s_linear_infinite]" />
          <div className="relative flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <p className="text-sm text-yellow-200">
              This is a work in progress. Some features may not be functional yet as we're building the UI.
            </p>
          </div>
        </div>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}