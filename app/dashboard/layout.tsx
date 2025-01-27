import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { prisma } from "@/lib/prisma"
import { AlertTriangle } from "lucide-react"
import { SettingsPage } from "@/components/dashboard/SettingsPage"
import { FamilySettings, isFamilySettings } from "@/types/settings"
import VercelAnalytics from '@/components/VercelAnalytics';
import { SpeedInsights } from "@vercel/speed-insights/next"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
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

  const safeUser = {
    name: user.name || 'Anonymous User',
    image: user.image || undefined,
    isBetaUser: user.isBetaUser || false,
    accountType: user.accountType
  }

  return (
    <html lang="en">
      <head>
        <VercelAnalytics />
        <SpeedInsights />
      </head>
      <body>
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
      </body>
    </html>
  )
}

export async function DashboardSettings() {
  const session = await auth()
  
  if (!session?.user?.email) {
    redirect("/auth/login")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { family: true }
  })

  const defaultSettings: FamilySettings = {
    security: {
      autoBlock: false,
      parentApproval: false
    }
  }

  const rawSettings = user?.family?.settings
  const settings = isFamilySettings(rawSettings) ? rawSettings : defaultSettings

  return <SettingsPage initialSettings={settings} />
}