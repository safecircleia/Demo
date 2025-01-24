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
  if (!session?.user) {
    redirect("/auth/login")
  }

  const user = await prisma.user.findUnique({
    where: { 
      email: session.user.email ?? undefined 
    },
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
      apiKeys: true // Include API keys for developer section
    }
  })

  if (!user) {
    redirect("/signin")
  }

  return (
    <div className="flex min-h-screen pt-16">
      <DashboardSidebar user={user} accountType={user.accountType} />
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