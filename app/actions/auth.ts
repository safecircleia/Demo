'use server'

import { signIn } from "@/auth"

export async function signInWithGoogle() {
  return signIn("google", {
    callbackUrl: "/dashboard",
  });
}