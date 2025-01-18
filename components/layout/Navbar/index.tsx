"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { UserNav } from "@/components/layout/UserNav";
import { motion } from "framer-motion";
import { User } from 'next-auth'

interface UserNavProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <motion.span 
            className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-white animate-shimmer"
          >
            SafeCircle
          </motion.span>
        </Link>

        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Link href="/demo">
                <Button variant="ghost" className="text-sm hover:bg-white/10">Demo</Button>
              </Link>
              <Link href="/roadmap">
                <Button variant="ghost" className="text-sm hover:bg-white/10">Roadmap</Button>
              </Link>
              <Link href="/about">
                <Button variant="ghost" className="text-sm hover:bg-white/10">About</Button>
              </Link>
              <UserNav user={{
                name: session?.user?.name ?? null,
                email: session?.user?.email ?? null,
                image: session?.user?.image ?? null
              }} />
            </>
          ) : (
            <>
              <Link href="/about">
                <Button variant="ghost" className="text-sm hover:bg-white/10">About</Button>
              </Link>
              <Link href="/sign-in">
                <Button variant="ghost" className="text-sm hover:bg-white/10">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-sm"
                >
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
