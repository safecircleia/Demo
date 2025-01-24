"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { User, Users, ArrowRight, Loader2, Github } from "lucide-react";
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"

interface FormData {
  accountType: "parent" | "child";
  familyCode?: string;
  acceptedTerms: boolean;
}

export function OnboardingForm() {
  const router = useRouter();
  const { data: session, update, status } = useSession();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    accountType: "parent",
    familyCode: "",
    acceptedTerms: false
  });

  useEffect(() => {
    if (session?.user?.onboardingComplete) {
      router.replace('/dashboard');
      router.refresh();
    }
  }, [session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.acceptedTerms) {
      toast.error("Please accept the terms and privacy policy");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to complete onboarding");
      }

      // Update session and force refresh
      await update({
        ...session,
        user: {
          ...session?.user,
          ...data.user,
          onboardingComplete: true
        }
      });

      toast.success("Welcome to SafeCircle!");
      
      // Force navigation and clear history
      router.replace('/dashboard');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md p-6 backdrop-blur-sm bg-black/20 border-white/10">
      <AnimatePresence mode="wait">
        {step === 1 && !session && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Welcome to SafeCircle</h2>
              <p className="text-muted-foreground">Choose how you want to continue</p>
            </div>
            
            <div className="space-y-3">
              <Button
                onClick={() => signIn('google', { callbackUrl: '/auth/onboarding' })}
                variant="outline"
                className="w-full"
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </Button>
              
              <Button
                onClick={() => signIn('github', { callbackUrl: '/auth/onboarding' })}
                variant="outline"
                className="w-full"
              >
                <Github className="mr-2 h-4 w-4" />
                Continue with GitHub
              </Button>
            </div>
          </motion.div>
        )}

        {session && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Choose Account Type</h2>
                <p className="text-muted-foreground">Select how you'll use SafeCircle</p>
              </div>

              <RadioGroup
                value={formData.accountType}
                onValueChange={(value: "parent" | "child") =>
                  setFormData({ ...formData, accountType: value })
                }
                className="grid grid-cols-2 gap-4"
              >
                <Label
                  htmlFor="parent"
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border ${
                    formData.accountType === "parent"
                      ? "border-primary bg-primary/10"
                      : "border-white/10 hover:bg-white/5"
                  } cursor-pointer transition-all duration-200`}
                >
                  <Users className="h-6 w-6 mb-2" />
                  <RadioGroupItem value="parent" id="parent" className="sr-only" />
                  Parent
                </Label>
                <Label
                  htmlFor="child"
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border ${
                    formData.accountType === "child"
                      ? "border-primary bg-primary/10"
                      : "border-white/10 hover:bg-white/5"
                  } cursor-pointer transition-all duration-200`}
                >
                  <User className="h-6 w-6 mb-2" />
                  <RadioGroupItem value="child" id="child" className="sr-only" />
                  Child
                </Label>
              </RadioGroup>

              {formData.accountType === "child" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <Label htmlFor="familyCode">Family Code</Label>
                  <Input
                    id="familyCode"
                    value={formData.familyCode}
                    onChange={(e) =>
                      setFormData({ ...formData, familyCode: e.target.value })
                    }
                    placeholder="Enter your family code"
                    required
                  />
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.acceptedTerms}
                    onCheckedChange={(checked: boolean) =>
                      setFormData({ ...formData, acceptedTerms: checked })
                    }
                    className="mt-1"
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Accept terms and conditions
                    </label>
                    <p className="text-sm text-muted-foreground">
                      By creating an account, you agree to our{" "}
                      <Link
                        href="/terms"
                        className="font-medium text-primary hover:underline"
                        target="_blank"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        className="font-medium text-primary hover:underline"
                        target="_blank"
                      >
                        Privacy Policy
                      </Link>
                      .
                    </p>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || !formData.acceptedTerms}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Complete Setup
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.div>
          </form>
        )}
      </AnimatePresence>
    </Card>
  );
}