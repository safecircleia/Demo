"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { 
  Users, 
  Settings, 
  LogOut, 
  User,
  Code,
  Key,
  BarChart2,
  Bot,
  CreditCard,
  Bell,
  Star,
  ChevronDown
} from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation"

interface DashboardSidebarProps {
  user: any;
  accountType: string;
}

export function DashboardSidebar({ user, accountType }: DashboardSidebarProps) {
  const [openSection, setOpenSection] = useState<string>("family")
  const pathname = usePathname()
  
  const isActive = (path: string) => pathname === path

  return (
    <motion.aside 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="w-64 min-h-[calc(100vh-4rem)] border-r border-white/10 p-6 flex flex-col bg-black/50 backdrop-blur-xl"
    >
      <div className="flex-1 space-y-2">
        <motion.nav className="space-y-2">
          {/* Family Section */}
          <div>
            <Button 
              variant="ghost" 
              onClick={() => setOpenSection(openSection === "family" ? "" : "family")}
              className={cn(
                "w-full justify-between gap-2 hover:bg-white/10",
                openSection === "family" && "bg-white/5",
                isActive("/dashboard") && "bg-primary/20 text-primary border border-primary/20"
              )}
            >
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>Family</span>
              </div>
              <ChevronDown className={cn(
                "h-4 w-4 transition-transform duration-200",
                openSection === "family" && "transform rotate-180"
              )} />
            </Button>
            <AnimatePresence>
              {openSection === "family" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="pl-4 py-2 space-y-1">
                    <Link href="/dashboard">
                      <Button 
                        variant="ghost" 
                        className={cn(
                          "w-full justify-start gap-2 text-sm",
                          isActive("/dashboard") && "bg-primary/20 text-primary border border-primary/20"
                        )}
                      >
                        <Users className="h-4 w-4" />
                        Overview
                      </Button>
                    </Link>
                    {accountType === 'parent' && (
                      <Link href="/dashboard/settings">
                        <Button 
                          variant="ghost" 
                          className={cn(
                            "w-full justify-start gap-2 text-sm",
                            isActive("/dashboard/settings") && "bg-primary/20 text-primary border border-primary/20"
                          )}
                        >
                          <Settings className="h-4 w-4" />
                          Family Settings
                        </Button>
                      </Link>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Developer Section */}
          <div>
            <Button 
              variant="ghost" 
              onClick={() => setOpenSection(openSection === "developer" ? "" : "developer")}
              className="w-full justify-between gap-2 hover:bg-white/10"
            >
              <div className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                <span>Developer</span>
              </div>
              <ChevronDown className={cn(
                "h-4 w-4 transition-transform duration-200",
                openSection === "developer" && "transform rotate-180"
              )} />
            </Button>
            <AnimatePresence>
              {openSection === "developer" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="pl-4 py-2 space-y-1">
                    <Link href="/dashboard/developer/keys">
                      <Button variant="ghost" className="w-full justify-start gap-2 text-sm">
                        <Key className="h-4 w-4" />
                        API Keys
                      </Button>
                    </Link>
                    <Link href="/dashboard/developer/usage">
                      <Button variant="ghost" className="w-full justify-start gap-2 text-sm">
                        <BarChart2 className="h-4 w-4" />
                        Usage Analytics
                      </Button>
                    </Link>
                    <Link href="/dashboard/developer/settings">
                      <Button variant="ghost" className="w-full justify-start gap-2 text-sm">
                        <Bot className="h-4 w-4" />
                        AI Settings
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Section */}
          <div>
            <Button 
              variant="ghost" 
              onClick={() => setOpenSection(openSection === "profile" ? "" : "profile")}
              className="w-full justify-between gap-2 hover:bg-white/10"
            >
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span>Profile</span>
              </div>
              <ChevronDown className={cn(
                "h-4 w-4 transition-transform duration-200",
                openSection === "profile" && "transform rotate-180"
              )} />
            </Button>
            <AnimatePresence>
              {openSection === "profile" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="pl-4 py-2 space-y-1">
                    <Link href="/dashboard/profile">
                      <Button variant="ghost" className="w-full justify-start gap-2 text-sm">
                        <Settings className="h-4 w-4" />
                        Account Settings
                      </Button>
                    </Link>
                    <Link href="/dashboard/profile/billing">
                      <Button variant="ghost" className="w-full justify-start gap-2 text-sm">
                        <CreditCard className="h-4 w-4" />
                        Billing
                      </Button>
                    </Link>
                    <Link href="/dashboard/profile/notifications">
                      <Button variant="ghost" className="w-full justify-start gap-2 text-sm">
                        <Bell className="h-4 w-4" />
                        Notifications
                      </Button>
                    </Link>
                    <Link href="/dashboard/profile/beta">
                      <Button variant="ghost" className="w-full justify-start gap-2 text-sm">
                        <Star className="h-4 w-4" />
                        Beta Access
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.nav>
      </div>

      {/* Profile Menu */}
      <Button 
        variant="ghost" 
        onClick={() => signOut()}
        className="w-full justify-between items-center px-2 hover:bg-white/10"
      >
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.image || ""} />
            <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium">{user?.name}</span>
            <span className="text-xs text-muted-foreground">{accountType}</span>
          </div>
        </div>
        <LogOut className="h-4 w-4 opacity-50" />
      </Button>
    </motion.aside>
  );
}