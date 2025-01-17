"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

export default function SignIn() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="mx-auto max-w-sm space-y-6 p-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Sign In</h1>
          <p className="text-gray-500">Sign in to access the demo</p>
        </div>
        <Button
          onClick={() => signIn("github", { callbackUrl: "/demo" })}
          className="w-full"
        >
          <Github className="mr-2 h-4 w-4" />
          Sign in with GitHub
        </Button>
      </div>
    </div>
  );
}