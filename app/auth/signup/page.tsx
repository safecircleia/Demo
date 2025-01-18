"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AccountTypeSelector } from "@/components/signup/AccountTypeSelector";
import { ParentSignup } from "@/components/signup/ParentSignup";
import { ChildSignup } from "@/components/signup/ChildSignup";

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [accountType, setAccountType] = useState<"parent" | "child" | null>(null);

  return (
    <div className="relative pt-32 md:pt-48">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-md mx-auto"
        >
          <div className="text-center mb-8">
            <motion.h1
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-white animate-shimmer"
            >
              Create Your Account
            </motion.h1>
          </div>

          <Card className="backdrop-blur-sm bg-black/20 border-white/10">
            {step === 1 && (
              <AccountTypeSelector
                onSelect={(type) => {
                  setAccountType(type);
                  setStep(2);
                }}
              />
            )}
            {step === 2 && accountType === "parent" && (
              <ParentSignup />
            )}
            {step === 2 && accountType === "child" && (
              <ChildSignup />
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}