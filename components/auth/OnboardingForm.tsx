"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export function OnboardingForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    accountType: "parent" as "parent" | "child",
    familyCode: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Add your API call here to create the user
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Sign in the user after successful registration
        await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          callbackUrl: "/dashboard",
        });
      } else {
        throw new Error("Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (step < 2) setStep(step + 1);
    else handleSubmit;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 glass-card"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold gradient-text">Choose Account Type</h2>
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant={formData.accountType === "parent" ? "default" : "outline"}
                className="glass-button"
                onClick={() => setFormData({ ...formData, accountType: "parent" })}
              >
                Parent
              </Button>
              <Button
                type="button"
                variant={formData.accountType === "child" ? "default" : "outline"}
                className="glass-button"
                onClick={() => setFormData({ ...formData, accountType: "child" })}
              >
                Child
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold gradient-text">Create Your Account</h2>
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
            {formData.accountType === "child" && (
              <div className="space-y-2">
                <Label htmlFor="familyCode">Family Code</Label>
                <Input
                  id="familyCode"
                  className="glass-input"
                  value={formData.familyCode}
                  onChange={(e) => setFormData({ ...formData, familyCode: e.target.value })}
                  required
                />
              </div>
            )}
          </div>
        )}

        <Button
          type="button"
          className="w-full glass-button"
          onClick={step === 2 ? handleSubmit : nextStep}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : step === 2 ? "Create Account" : "Next"}
        </Button>
      </form>
    </motion.div>
  );
}