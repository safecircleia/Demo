'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface DocsSidebarItemProps {
  href: string
  children: React.ReactNode
  exact?: boolean
}

export function DocsSidebarItem({ href, children, exact }: DocsSidebarItemProps) {
  const pathname = usePathname()
  const isActive = exact ? pathname === href : pathname.startsWith(href)

  return (
    <Link
      href={href}
      className={cn(
        "block px-2 py-1.5 text-sm rounded-md transition-colors",
        isActive
          ? "bg-white/10 text-white"
          : "text-gray-400 hover:text-white hover:bg-white/5"
      )}
    >
      {children}
    </Link>
  )
}