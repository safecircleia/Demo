"use client";

import { useState, useEffect } from "react";
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
  ChevronDown,
  Settings2, // Add this import
  Sparkles // Add this import
} from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation"

interface DashboardSidebarProps {
  user: {
    name: string;
    image?: string;
    isBetaUser?: boolean; // Add this field
  };
  accountType: string;
}

export function DashboardSidebar({ user, accountType }: DashboardSidebarProps) {
  const [openSection, setOpenSection] = useState<string>("")
  const pathname = usePathname()
  
  // Enhanced isActive check for nested routes
  const isActive = (path: string) => pathname.startsWith(path)
  
  // Determine active section on mount and route change
  useEffect(() => {
    if (pathname.includes('/dashboard/developer')) setOpenSection('developer')
    else if (pathname.includes('/dashboard/advanced')) setOpenSection('advanced')
    else if (pathname.includes('/dashboard/profile')) setOpenSection('profile')
    else setOpenSection('family')
  }, [pathname])

  // Updated styles for consistency
  const activeStyles = "bg-white/5 border-l-2 border-primary/50 text-primary"
  const buttonStyles = "w-full justify-start gap-2 text-sm hover:bg-white/5"
  const sectionButtonStyles = "w-full justify-between gap-2 hover:bg-white/5"

  // Add this beta indicator component
  const BetaIndicator = () => (
    <div className="flex items-center gap-1 ml-2 px-1.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">
      <Sparkles className="h-3 w-3 text-primary" />
      <span className="text-xs text-primary font-medium">Beta</span>
    </div>
  )

  // Only show Advanced section if user is in beta
  const showAdvancedSection = user.isBetaUser;

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
                sectionButtonStyles,
                openSection === "family" && "bg-white/5",
                isActive("/dashboard") && !pathname.includes("/dashboard/") && activeStyles
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
                          buttonStyles,
                          isActive("/dashboard") && !pathname.includes("/dashboard/") && activeStyles
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
                            buttonStyles,
                            isActive("/dashboard/settings") && activeStyles
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
              className={cn(
                sectionButtonStyles,
                openSection === "developer" && "bg-white/5"
              )}
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
                      <Button 
                        variant="ghost" 
                        className={cn(
                          buttonStyles,
                          isActive("/dashboard/developer/keys") && activeStyles
                        )}
                      >
                        <Key className="h-4 w-4" />
                        API Keys
                      </Button>
                    </Link>
                    <Link href="/dashboard/developer/usage">
                      <Button 
                        variant="ghost" 
                        className={cn(
                          buttonStyles,
                          isActive("/dashboard/developer/usage") && activeStyles
                        )}
                      >
                        <BarChart2 className="h-4 w-4" />
                        Usage Analytics
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* New Advanced Section */}
          {showAdvancedSection && (
            <div>
              <Button 
                variant="ghost" 
                onClick={() => setOpenSection(openSection === "advanced" ? "" : "advanced")}
                className={cn(
                  sectionButtonStyles,
                  openSection === "advanced" && "bg-white/5"
                )}
              >
                <div className="flex items-center gap-2">
                  <Settings2 className="h-5 w-5" />
                  <span>Advanced</span>
                </div>
                <ChevronDown className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  openSection === "advanced" && "transform rotate-180"
                )} />
              </Button>
              <AnimatePresence>
                {openSection === "advanced" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="pl-4 py-2 space-y-1">
                      <Link href="/dashboard/advanced/ai">
                        <Button 
                          variant="ghost" 
                          className={cn(
                            buttonStyles,
                            isActive("/dashboard/advanced/ai") && activeStyles
                          )}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                              <Bot className="h-4 w-4" />
                              AI Settings
                            </div>
                            {user.isBetaUser && <BetaIndicator />}
                          </div>
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Profile Section - Fixed double indicator */}
          <div>
            <Button 
              variant="ghost" 
              onClick={() => setOpenSection(openSection === "profile" ? "" : "profile")}
              className={cn(
                sectionButtonStyles,
                openSection === "profile" && "bg-white/5"
              )}
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
                    {[
                      { href: "/dashboard/profile", icon: Settings, label: "Account Settings" },
                      { href: "/dashboard/profile/subcription", icon: CreditCard, label: "Subscription" },
                      { href: "/dashboard/profile/notifications", icon: Bell, label: "Notifications" },
                      { href: "/dashboard/profile/beta", icon: Star, label: "Beta Access" }
                    ].map((item) => (
                      <Link href={item.href} key={item.href}>
                        <Button 
                          variant="ghost" 
                          className={cn(
                            buttonStyles,
                            pathname === item.href && activeStyles // Changed to exact match for profile items
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                          {item.label}
                        </Button>
                      </Link>
                    ))}
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