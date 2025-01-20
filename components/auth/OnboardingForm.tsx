"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";

interface FormData {
  email: string;
  password: string;
  name: string;
  accountType: "parent" | "child";
  familyCode?: string;
}

export function OnboardingForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    name: "",
    accountType: "parent",
    familyCode: "",
  });

  // Send verification email when reaching step 3
  useEffect(() => {
    if (step === 3) {
      handleSendVerification();
    }
  }, [step]);

  const handleSendVerification = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/email/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });

      if (!response.ok) throw new Error();
      toast.success("Verification code sent to your email!");
    } catch (error) {
      toast.error("Failed to send verification code");
      setStep(2); // Go back if email sending fails
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          verificationCode
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Registration failed');
      }
      
      setIsVerified(true);
      toast.success("Email verified and account created!");
      router.push('/dashboard');
    } catch (error: unknown) {  // Add explicit unknown type
      // Type guard for Error objects
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Invalid verification code");
      }
      setIsVerified(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    if (step === 3) {
      await handleVerifyCode();
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2 }}
        className="p-6 glass-card"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <Label>Account Type</Label>
                <RadioGroup
                  value={formData.accountType}
                  onValueChange={(value: "parent" | "child") => 
                    setFormData({ ...formData, accountType: value })}
                  className="grid grid-cols-2 gap-4"
                >
                  <Card className="relative flex items-center space-x-2 p-4">
                    <RadioGroupItem value="parent" id="parent" />
                    <Label htmlFor="parent" className="font-normal">Parent</Label>
                  </Card>
                  <Card className="relative flex items-center space-x-2 p-4">
                    <RadioGroupItem value="child" id="child" />
                    <Label htmlFor="child" className="font-normal">Child</Label>
                  </Card>
                </RadioGroup>
              </div>

              {formData.accountType === "child" && (
                <div className="space-y-2">
                  <Label htmlFor="familyCode">Family Code</Label>
                  <Input
                    id="familyCode"
                    className="glass-input"
                    value={formData.familyCode}
                    onChange={(e) => setFormData({ ...formData, familyCode: e.target.value })}
                    placeholder="Enter your family code"
                    required={formData.accountType === "child"}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  className="glass-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  className="glass-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  className="glass-input"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold gradient-text">
                  Verify Your Email
                </h3>
                <p className="text-sm text-gray-400">
                  We've sent a verification code to {formData.email}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="verification-code">Verification Code</Label>
                <Input
                  id="verification-code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="000000"
                  maxLength={6}
                  className="glass-input text-center text-2xl tracking-widest"
                />
              </div>
              {isVerified && (
                <div className="flex items-center justify-center gap-2 text-green-500">
                  <CheckCircle className="h-4 w-4" />
                  <span>Email verified successfully!</span>
                </div>
              )}
            </motion.div>
          )}

          <div className="flex gap-4">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                className="glass-button"
                onClick={() => setStep(step - 1)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            <Button
              type="submit"
              className="w-full glass-button"
              disabled={isLoading || (step === 3 && !verificationCode) || 
                (step === 1 && formData.accountType === "child" && !formData.familyCode)}
            >
              {isLoading 
                ? "Processing..." 
                : step === 3 
                ? isVerified 
                  ? "Create Account" 
                  : "Verify Code"
                : "Next"}
            </Button>
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
}