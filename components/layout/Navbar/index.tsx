"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession, signIn, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, LayoutDashboard, Play } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const [showBanner, setShowBanner] = useState(true);

  const handleSignIn = () => router.push("/auth/login");
  const handleSignUp = () => router.push("/auth/onboarding");

  return (
    <header className="relative top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl">
      <nav className="relavitve z-10 container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-white">
              SafeCircle
            </motion.span>
          </motion.div>
        </Link>

        <div className="flex items-center gap-4">
          {session?.user ? (
            <>
              <Link href="/demo">
                <Button variant="outline" className="glass-button flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  Demo
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" className="glass-button flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <UserMenu user={session.user} />
            </>
          ) : (
            <>
              <Button 
                onClick={handleSignIn}
                variant="outline" 
                className="glass-button"
                disabled={isLoading}
              >
                Sign In
              </Button>
              <Button 
                onClick={handleSignUp}
                className="relative overflow-hidden bg-gradient-to-r from-primary via-primary/80 to-primary text-black font-semibold shadow-lg hover:shadow-primary/50 hover:scale-105 transition-all duration-300 border border-primary/20 backdrop-blur-sm"
                disabled={isLoading}
              >
                Sign Up Free
              </Button>
            </>
          )}
        </div>
      </nav>
      {showBanner && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative w-full bg-gradient-to-r from-yellow-500/10 via-yellow-500/20 to-yellow-500/10 backdrop-blur-sm border-b border-yellow-500/20"
        >
          <div className="container mx-auto px-4 py-2 text-center text-sm font-medium">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20">
              <span className="animate-pulse h-2 w-2 rounded-full bg-yellow-500"></span>
              <span className="text-yellow-500/90">
                🚧 Work in Progress: This project is in active development. Features and UI are subject to change.
              </span>
            </div>
            <button
              onClick={() => setShowBanner(false)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-yellow-500/20 transition-colors"
            >
              <X className="h-4 w-4 text-yellow-500/90" />
            </button>
          </div>
        </motion.div>
      )}
    </header>
  );
}

function UserMenu({ user }: { user: any }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image || ""} alt={user.name || ""} />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-destructive focus:text-destructive"
          onSelect={() => signOut()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
