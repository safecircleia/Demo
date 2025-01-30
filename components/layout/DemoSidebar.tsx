'use client';

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, LayoutDashboard, MessageCircle, AlertCircle, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'

const navigation = {
  main: [
    { name: 'Dashboard', href: '/demo', icon: LayoutDashboard }
  ],
  analysis: [
    { name: 'Message Analysis', href: '/demo/analysis', icon: MessageCircle },
    { name: 'Threat Logs', href: '/demo/logs', icon: AlertCircle }
  ]
}

export function DemoSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [openSection, setOpenSection] = useState<string>('analysis')
  const pathname = usePathname()

  // Styles
  const buttonStyles = "w-full justify-start gap-2 text-sm hover:bg-white/5"
  const sectionButtonStyles = "w-full justify-between gap-2 hover:bg-white/5"
  const activeStyles = "bg-primary/10 text-primary"

  return (
    <motion.aside 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "w-64 min-h-[calc(100vh-4rem)] border-r border-white/10 p-6 flex flex-col bg-black/50 backdrop-blur-xl fixed left-0 top-16",
        isCollapsed && "w-20"
      )}
    >
      <div className="flex h-full flex-col gap-2">
        <div className="flex h-16 items-center justify-between px-4 border-b border-white/10">
          <motion.span
            animate={{ opacity: isCollapsed ? 0 : 1 }}
            className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60"
          >
            Demo Mode
          </motion.span>
        </div>

        <nav className="flex-1 space-y-2 p-2">
          {/* Main Links */}
          {navigation.main.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                pathname === item.href ? activeStyles : 'text-gray-400 hover:bg-white/5 hover:text-white'
              )}
            >
              <item.icon className="h-5 w-5" />
              <motion.span
                animate={{ opacity: isCollapsed ? 0 : 1 }}
                className="truncate"
              >
                {item.name}
              </motion.span>
            </Link>
          ))}

          {/* Analysis Section */}
          <div>
            <Button 
              variant="ghost" 
              onClick={() => setOpenSection(openSection === "analysis" ? "" : "analysis")}
              className={cn(
                sectionButtonStyles,
                openSection === "analysis" && "bg-white/5"
              )}
            >
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                <motion.span
                  animate={{ opacity: isCollapsed ? 0 : 1 }}
                  className="truncate"
                >
                  Analysis
                </motion.span>
              </div>
              <motion.div
                animate={{ opacity: isCollapsed ? 0 : 1 }}
              >
                <ChevronDown className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  openSection === "analysis" && "transform rotate-180"
                )} />
              </motion.div>
            </Button>
            <AnimatePresence>
              {openSection === "analysis" && !isCollapsed && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="pl-4 py-2 space-y-1">
                    {navigation.analysis.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                          pathname === item.href ? activeStyles : 'text-gray-400 hover:bg-white/5 hover:text-white'
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        <span className="truncate">{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>
      </div>
    </motion.aside>
  )
}
