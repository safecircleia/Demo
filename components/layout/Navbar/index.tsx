"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession, signIn } from "next-auth/react";
import { UserMenu } from "@/components/UserMenu";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold">
          SafeCircle
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/about">
            <Button variant="ghost">About</Button>
          </Link>
          <Link href="/roadmap">
            <Button variant="ghost">Roadmap</Button>
          </Link>
          {status === "authenticated" && (
            <Link href="/demo">
              <Button variant="ghost">Demo</Button>
            </Link>
          )}
          {status === "loading" ? (
            <Button disabled variant="outline">
              Loading...
            </Button>
          ) : status === "authenticated" ? (
            <UserMenu user={session.user} />
          ) : (
            <Button onClick={() => signIn("github")} variant="default">
              Sign In
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}
