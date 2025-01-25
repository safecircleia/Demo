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
import { User, Users, ArrowRight, Loader2, Github, ChevronLeft, Home, UserPlus, Settings } from "lucide-react";
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"

interface FormData {
  accountType: "parent" | "child";
  familyOption?: "create" | "join";
  familyName?: string;
  familyCode?: string;
  familySettings?: {
    notifications: {
      familyAlerts: boolean;
      memberActivity: boolean;
    };
    security: {
      autoBlock: boolean;
      parentApproval: boolean;
    };
  };
  acceptedTerms: boolean;
  errors?: {
    familyCode?: string;
  };
}

const getSteps = (accountType: "parent" | "child") => {
  if (accountType === "parent") {
    return [
      { title: "Choose Role", icon: User },
      { title: "Family Setup", icon: Home },
      { title: "Customize", icon: Settings }
    ];
  }
  return [
    { title: "Choose Role", icon: User },
    { title: "Join Family", icon: Users },
    { title: "Complete", icon: Home }
  ];
};

const defaultFamilySettings = {
  notifications: {
    familyAlerts: true,
    memberActivity: true
  },
  security: {
    autoBlock: true,
    parentApproval: true
  }
};

export function OnboardingForm() {
  const router = useRouter();
  const { data: session, update, status } = useSession();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    accountType: "parent",
    familyOption: "create",
    familyName: "",
    familyCode: "",
    familySettings: defaultFamilySettings,
    acceptedTerms: false,
    errors: {}
  });

  // Safe session check
  useEffect(() => {
    if (status === "loading") return;
    if (session?.user?.onboardingComplete) {
      router.replace('/dashboard');
    }
  }, [session, router, status]);

  // Prevent render until session is loaded
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const validateChildForm = () => {
    if (formData.accountType === "child" && !formData.familyCode) {
      setFormData(prev => ({
        ...prev,
        errors: {
          ...prev.errors,
          familyCode: "Family code is required to create a child account"
        }
      }));
      return false;
    }
    return true;
  };

  const verifyFamilyCode = async (code: string) => {
    if (!code) return;
    
    setIsVerifyingCode(true);
    try {
      const verifyResponse = await fetch(`/api/family/verify-code?code=${code}`);
      const data = await verifyResponse.json();
      
      if (!verifyResponse.ok) {
        setFormData(prev => ({
          ...prev,
          errors: {
            ...prev.errors,
            familyCode: data.error || "Invalid family code"
          }
        }));
        return false;
      }
      return true;
    } catch (error) {
      setFormData(prev => ({
        ...prev,
        errors: {
          ...prev.errors,
          familyCode: "Failed to verify family code"
        }
      }));
      return false;
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step < 3) {
      if (formData.accountType === "child") {
        setStep(3);
        setFormData(prev => ({
          ...prev,
          familyOption: "join"
        }));
      } else {
        setStep(step + 1);
      }
      return;
    }

    // Verify code for both child accounts and parents joining existing families
    if (formData.accountType === "child" || formData.familyOption === "join") {
      if (!formData.familyCode) {
        // Handle missing family code - could show error message here
        return;
      }
      const isValid = await verifyFamilyCode(formData.familyCode);
      if (!isValid) return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      await update({
        ...session,
        user: {
          ...session?.user,
          onboardingComplete: true
        }
      });

      toast.success("Welcome to SafeCircle!");
      router.replace('/dashboard');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to complete setup");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: string) => {
    setIsLoading(true);
    try {
      await signIn(provider, { callbackUrl: '/onboarding' });
    } catch (error) {
      toast.error("Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  // If not authenticated, show OAuth options
  if (!session?.user) {
    return (
      <div className="max-w-lg mx-auto space-y-8 p-6">
        <Card className="p-6">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold">Create your account</h2>
              <p className="text-muted-foreground">
                Choose a method to create your SafeCircle account
              </p>
            </div>

            <div className="grid gap-4">
              <Button
                variant="outline"
                onClick={() => handleOAuthSignIn("google")}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
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
                )}
                Continue with Google
              </Button>

              <Button
                variant="outline"
                onClick={() => handleOAuthSignIn("github")}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Github className="mr-2 h-4 w-4" />
                )}
                Continue with GitHub
              </Button>
            </div>


            <Button
              variant="outline"
              onClick={() => router.push('/auth/signup')}
              className="w-full"
            >
              Sign up with email
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const currentSteps = getSteps(formData.accountType);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0
    })
  };

  // Safe family settings update
  const updateFamilySettings = (field: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      familySettings: {
        ...defaultFamilySettings,
        ...prev.familySettings,
        notifications: {
          ...defaultFamilySettings.notifications,
          ...prev.familySettings?.notifications,
          [field]: value
        }
      }
    }));
  };

  return (
    <div className="max-w-lg mx-auto space-y-8 p-6">
      {/* Progress Steps and Line */}
      <div className="space-y-6">
        {/* Step Indicators */}
        <div className="flex justify-between">
          {currentSteps.map((s, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
            >
              <div className={`
                z-10 w-10 h-10 rounded-full flex items-center justify-center
                transition-colors duration-300 bg-background
                ${i + 1 === step ? 'bg-primary text-primary-foreground' : 
                  i + 1 < step ? 'bg-primary/20' : 'bg-muted'}
              `}>
                {<s.icon className="w-5 h-5" />}
              </div>
              <span className="text-sm mt-2">{s.title}</span>
            </motion.div>
          ))}
        </div>

        {/* Progress Line */}
        <div className="relative -mt-[52px] mx-5">
          <div className="h-0.5 w-full bg-muted">
            <motion.div
              className="h-full bg-primary origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: (step - 1) / (currentSteps.length - 1) }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              {/* Form Steps Content */}
              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold">Choose your role</h2>
                  <p className="text-muted-foreground">Select how you'll use SafeCircle</p>
                  <RadioGroup
                    value={formData.accountType}
                    onValueChange={(value: "parent" | "child") => 
                      setFormData({ ...formData, accountType: value })}
                    className="grid gap-4"
                  >
                    <Label className="flex p-4 border rounded-lg hover:border-primary transition-colors">
                      <RadioGroupItem value="parent" className="mt-1" />
                      <div className="ml-4">
                        <div className="font-medium">Parent</div>
                        <p className="text-sm text-muted-foreground">
                          Manage family settings and monitor activity
                        </p>
                      </div>
                    </Label>
                    <Label className="flex p-4 border rounded-lg hover:border-primary transition-colors">
                      <RadioGroupItem value="child" className="mt-1" />
                      <div className="ml-4">
                        <div className="font-medium">Child</div>
                        <p className="text-sm text-muted-foreground">
                          Join your family's protection circle
                        </p>
                      </div>
                    </Label>
                  </RadioGroup>
                </div>
              )}

              {/* Only show family option step for parents */}
              {step === 2 && formData.accountType === "parent" && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold">Set up your family</h2>
                  <p className="text-muted-foreground">Create or join a family group</p>
                  <RadioGroup
                    value={formData.familyOption}
                    onValueChange={(value: "create" | "join") => 
                      setFormData({ ...formData, familyOption: value })}
                    className="grid gap-4"
                  >
                    <Label className="flex p-4 border rounded-lg hover:border-primary transition-colors">
                      <RadioGroupItem value="create" className="mt-1" />
                      <div className="ml-4">
                        <div className="font-medium">Create a new family</div>
                        <p className="text-sm text-muted-foreground">
                          Start protecting your family members
                        </p>
                      </div>
                    </Label>
                    <Label className="flex p-4 border rounded-lg hover:border-primary transition-colors">
                      <RadioGroupItem value="join" className="mt-1" />
                      <div className="ml-4">
                        <div className="font-medium">Join existing family</div>
                        <p className="text-sm text-muted-foreground">
                          Use an invite code to join your family
                        </p>
                      </div>
                    </Label>
                  </RadioGroup>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-semibold mb-1">
                      {formData.accountType === "child" ? "Join your family" : 
                        formData.familyOption === "create" ? "Create your family" : "Join family"}
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      {formData.familyOption === "create" 
                        ? "Set up your family preferences" 
                        : "Enter the family code to join"}
                    </p>
                    
                    {/* For children or users choosing to join, show only join form */}
                    {(formData.accountType === "child" || formData.familyOption === "join") ? (
                      <div>
                        <Label>Family Code</Label>
                        <div className="relative">
                          <Input
                            value={formData.familyCode}
                            onChange={(e) => setFormData({ 
                              ...formData, 
                              familyCode: e.target.value.toUpperCase(),
                              errors: { ...formData.errors, familyCode: undefined }
                            })}
                            placeholder="Enter the code from your family admin"
                            className={`mt-1 ${formData.errors?.familyCode ? 'border-red-500' : ''}`}
                            disabled={isVerifyingCode}
                          />
                          {isVerifyingCode && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                            </div>
                          )}
                        </div>
                        {formData.errors?.familyCode && (
                          <p className="text-sm text-red-500 mt-1">{formData.errors.familyCode}</p>
                        )}
                      </div>
                    ) : (
                      <>
                        <div className="space-y-4">
                          <div>
                            <Label>Family Name</Label>
                            <Input
                              value={formData.familyName}
                              onChange={(e) => setFormData({ 
                                ...formData, 
                                familyName: e.target.value 
                              })}
                              placeholder="Enter family name"
                              className="mt-1"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Family Settings</Label>
                            <Card className="p-4">
                              <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                  <Checkbox
                                    id="notifications"
                                    checked={formData.familySettings?.notifications.familyAlerts ?? true}
                                    onCheckedChange={(checked) => 
                                      updateFamilySettings('familyAlerts', checked as boolean)
                                    }
                                  />
                                  <div>
                                    <Label htmlFor="notifications">Family Alerts</Label>
                                    <p className="text-sm text-muted-foreground">
                                      Receive notifications about family activity
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between pt-4">
            {step > 1 && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep(step - 1)}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
            <Button type="submit" className={step === 1 ? 'w-full' : 'ml-auto'}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up...
                </>
              ) : (
                <>
                  {step === 3 ? "Complete Setup" : "Continue"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}