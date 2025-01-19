"use client";

import { OnboardingForm } from "@/components/auth/OnboardingForm";

export default function OnboardingPage() {
  return (
    <div className="container mx-auto p-8 pt-32">
      <div className="max-w-md mx-auto">
        <h1 className="text-4xl font-bold gradient-text mb-8 text-center">Create Account</h1>
        <OnboardingForm />
      </div>
    </div>
  );
}