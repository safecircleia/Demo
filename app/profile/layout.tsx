'use client'

import { motion } from "framer-motion"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { User, Users, Shield, Bell, ChevronRight } from "lucide-react"

const sidebarItems = [
  {
    title: "Personal Info",
    icon: User,
    href: "/profile",
    pattern: /^\/profile$/
  },
  {
    title: "Family Circle",
    icon: Users,
    href: "/profile/family",
    pattern: /^\/profile\/family/
  },
  {
    title: "Security",
    icon: Shield,
    href: "/profile/security",
    pattern: /^\/profile\/security/
  }
]

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="relative min-h-screen pt-20">
      <div className="container px-4 mx-auto py-8">
        <div className="flex gap-8">
          <motion.aside 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-64 shrink-0"
          >
            <nav className="glass-card p-4 rounded-lg space-y-2">
              {sidebarItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-md transition-colors",
                      "hover:bg-white/10",
                      item.pattern.test(pathname) 
                        ? "bg-white/10 text-white" 
                        : "text-gray-400"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </motion.div>
                </Link>
              ))}
            </nav>
          </motion.aside>

          <motion.main 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1"
          >
            {children}
          </motion.main>
        </div>
      </div>
    </div>
  )
}