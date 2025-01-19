"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

interface FormData {
  email: string;
  password: string;
  accountType: string;
  familyCode?: string;
  name: string;
}

export function OnboardingForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    accountType: "",
    familyCode: "",
    name: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) {
      setStep(step + 1);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      router.push('/auth/login?registered=true');
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
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
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="glass-input"
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
          type="submit"
          className="w-full glass-button"
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : step === 1 ? "Next" : "Create Account"}
        </Button>
      </form>
    </motion.div>
  );
}