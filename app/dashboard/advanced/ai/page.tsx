"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Shield, Zap, Lock, BrainCircuit, Currency, TextIcon, BrainIcon, ImageIcon, MicIcon, Clock, Network } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Chip } from "@/components/ui/chip";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { OpenAI, DeepSeek } from '@lobehub/icons';
import { Progress } from "@/components/ui/progress"

const defaultSettings = {
  modelVersion: "gpt3",
  temperature: 0.7,
  maxTokens: 2048,
  safetyLevel: "balanced",
  streaming: true,
  timeout: 30,
};

type CapabilityType = 'text' | 'image' | 'reasoning' | 'voice';

const CAPABILITIES = {
  text: { icon: TextIcon, label: 'Text' },
  image: { icon: ImageIcon, label: 'Image' },
  reasoning: { icon: BrainIcon, label: 'Reasoning' },
  voice: { icon: MicIcon, label: 'Voice' }
} as const;

const MODEL_OPTIONS = {
  gpt3: {
    label: "GPT-3.5-Turbo",
    description: "Fast, reliable, and cost-effective for most use cases",
    value: "gpt3",
    capabilities: ['text'] as CapabilityType[],
    available: true,
    icon: OpenAI,
    iconSize: 56,
    bgGradient: "from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50"
  },
  gpt4: {
    label: "GPT-4",
    description: "Advanced capabilities with superior reasoning",
    value: "gpt4",
    capabilities: ['text', 'image'] as CapabilityType[],
    available: false,
    comingSoon: true,
    icon: OpenAI,
    iconSize: 56,
    bgGradient: "from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50"
  },
  deepseek: {
    label: "DeepSeek r1",
    description: "High-performance model with specialized capabilities",
    value: "deepseek",
    capabilities: ['text', 'image', 'reasoning'] as CapabilityType[],
    available: false,
    comingSoon: true,
    icon: DeepSeek,
    iconSize: 56,
    bgGradient: "from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50"
  }
};

const CAPABILITY_COLORS = {
  text: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  image: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  reasoning: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  voice: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
} as const;

const CapabilityTag = ({ type }: { type: CapabilityType }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Chip 
          size="sm" 
          className={cn(
            CAPABILITY_COLORS[type],
            "transition-all duration-200",
            "hover:shadow-sm hover:opacity-90"
          )}
        >
          <span className="flex items-center gap-1.5">
            {React.createElement(CAPABILITIES[type].icon, { 
              className: 'w-3 h-3' 
            })}
            {CAPABILITIES[type].label}
          </span>
        </Chip>
      </TooltipTrigger>
      <TooltipContent>
        <p>Supports {CAPABILITIES[type].label.toLowerCase()} generation</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const ModelCard = ({ model, isSelected, onSelect, isUpdating }) => (
  <Card
    className={cn(
      "group relative cursor-pointer transition-all duration-300",
      "hover:shadow-xl hover:-translate-y-1",
      "border border-border/50",
      `bg-gradient-to-br ${model.bgGradient}`,
      "overflow-hidden",
      isSelected && "ring-2 ring-primary ring-opacity-50 shadow-lg",
      !model.available && "opacity-75",
      isUpdating && "opacity-50 pointer-events-none"
    )}
    onClick={() => model.available && !isUpdating && onSelect(model.value)}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-background/5 pointer-events-none" />
    
    <CardHeader className="pb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={cn(
            "relative w-12 h-12 rounded-xl",
            "bg-background/80 p-2.5",
            "transition-transform duration-300 group-hover:scale-110",
            "flex items-center justify-center",
            "shadow-sm"
          )}>
            {React.createElement(model.icon, { 
              size: model.iconSize || 32,
              className: "transition-transform duration-300 group-hover:scale-110" 
            })}
          </div>
          <div className="space-y-1">
            <CardTitle className="text-xl font-semibold">
              {model.label}
            </CardTitle>
            {model.comingSoon ? (
              <ComingSoonChip />
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  model.available ? "bg-green-500" : "bg-yellow-500"
                )} />
                {model.available ? "Available" : "Coming Soon"}
              </div>
            )}
          </div>
        </div>
      </div>
    </CardHeader>

    <CardContent className="space-y-4">
      <p className="text-sm text-muted-foreground/90 leading-relaxed">
        {model.description}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {model.capabilities.map((cap) => (
          <div 
            key={cap} 
            className="transition-all duration-200 hover:scale-105"
          >
            <CapabilityTag type={cap} />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const PrivacyNotice = () => (
  <Card className="p-4 bg-muted/50 mt-6">
    <div className="flex items-start gap-3">
      <Shield className="w-5 h-5 mt-0.5 text-muted-foreground shrink-0" />
      <div className="space-y-1">
        <p className="text-sm font-medium">Privacy Notice</p>
        <p className="text-sm text-muted-foreground">
          External AI providers process data according to their respective privacy policies. 
          We do not control or have access to how your data is processed by these providers. 
          Please review{" "}
          <Link href="https://openai.com/privacy" className="underline hover:text-primary">
            OpenAI's privacy policy
          </Link>
          {" "}and other providers' policies before use.
        </p>
      </div>
    </div>
  </Card>
);

const ModelSelector = () => {
  const [selected, setSelected] = useState<string>("gpt3")
  const [isUpdating, setIsUpdating] = useState(false)
  const [tokenInfo, setTokenInfo] = useState({ 
    tokensUsed: 0, 
    tokenLimit: 10, 
    tokensRemaining: 10,
    resetAt: null 
  });

  const handleModelSelect = async (modelValue: string) => {
    setIsUpdating(true)
    try {
      const response = await fetch("/api/settings/ai", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modelVersion: modelValue })
      })

      if (!response.ok) throw new Error()
      
      setSelected(modelValue)
      toast.success("AI model updated successfully")
    } catch (error) {
      toast.error("Failed to update AI model")
      console.error("Error updating model:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  // Load saved model on mount
  useEffect(() => {
    const loadSavedModel = async () => {
      try {
        const response = await fetch("/api/settings/ai")
        if (response.ok) {
          const data = await response.json()
          if (data.modelVersion) {
            setSelected(data.modelVersion)
          }
        }
      } catch (error) {
        console.error("Error loading saved model:", error)
      }
    }
    loadSavedModel()
  }, [])

  useEffect(() => {
    const loadTokenInfo = async () => {
      const response = await fetch("/api/settings/ai");
      if (response.ok) {
        const data = await response.json();
        setTokenInfo({
          tokensUsed: data.tokensUsed || 0,
          tokenLimit: data.tokenLimit || 10,
          tokensRemaining: data.tokensRemaining || 10,
          resetAt: data.resetAt
        });
      }
    };
    loadTokenInfo();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Token Usage</h3>
        <div className="flex items-center gap-2">
          <Progress value={(tokenInfo.tokensUsed / tokenInfo.tokenLimit) * 100} className="w-48" />
          <span className="text-sm text-muted-foreground">
            {tokenInfo.tokensRemaining.toLocaleString()} tokens remaining
          </span>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Internal Solutions</h3>
          <Chip variant="outline" size="sm">Coming Soon</Chip>
        </div>
        <Card className="p-8">
          <div className="flex flex-col items-center justify-center text-center space-y-3">
            <div className="p-3 rounded-full bg-primary/10">
              <BrainCircuit className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold">In-house AI Solutions</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              We're developing our own AI models to provide more secure and customized solutions. Stay tuned for updates.
            </p>
          </div>
        </Card>
      </div>

      <Separator className="my-8" />
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">External Providers</h3>
          <Chip variant="outline" size="sm">Production Ready</Chip>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(MODEL_OPTIONS).map(([key, model]) => (
            <ModelCard
              key={key}
              model={model}
              isSelected={selected === model.value}
              onSelect={handleModelSelect}
              isUpdating={isUpdating}
            />
          ))}
        </div>
      </div>

      <PrivacyNotice />
    </div>
  )
}

interface SettingOption {
  label: string;
  description: string;
  available: boolean;
  icon: React.ComponentType;
}

const SETTINGS_OPTIONS: Record<string, SettingOption[]> = {
  "Model Parameters": [
    {
      label: "Temperature",
      description: "Controls randomness in responses",
      available: false,
      icon: Zap
    },
    {
      label: "Maximum Length",
      description: "Sets the response length limit",
      available: false,
      icon: TextIcon
    }
  ],
  "Safety & Filtering": [
    {
      label: "Content Filtering",
      description: "Filter inappropriate content",
      available: false,
      icon: Shield
    },
    {
      label: "Safety Level",
      description: "Adjust content safety measures",
      available: false,
      icon: Lock
    }
  ],
  "Performance": [
    {
      label: "Rate Limit",
      description: "Maximum requests per minute",
      available: false,
      icon: Currency
    },
    {
      label: "Response Streaming",
      description: "Stream responses in real-time",
      available: false,
      icon: BrainCircuit
    },
    {
      label: "Request Timeout",
      description: "Maximum wait time for responses",
      available: false,
      icon: Clock
    },
    {
      label: "Concurrent Responses",
      description: "Number of simultaneous requests",
      available: false,
      icon: Network
    }
  ]
};

const SettingItem = ({ option }: { option: SettingOption }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center justify-between py-2 opacity-70">
          <div className="flex items-center gap-2">
            <option.icon className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{option.label}</p>
              <p className="text-xs text-muted-foreground">{option.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Chip size="sm" variant="secondary">Coming Soon</Chip>
            <Switch disabled aria-disabled={true} checked={false} />
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>This feature is coming soon!</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const SettingsSection = () => (
  <div className="space-y-6">
    {Object.entries(SETTINGS_OPTIONS).map(([category, options]) => (
      <div key={category} className="space-y-4">
        <h3 className="font-medium text-lg">
          {category}
          <Chip size="sm" variant="secondary" className="ml-2">Coming Soon</Chip>
        </h3>
        <Card className="p-4">
          <div className="space-y-2">
            {options.map((option) => (
              <SettingItem key={option.label} option={option} />
            ))}
          </div>
        </Card>
        <Separator />
      </div>
    ))}
  </div>
);

const ComingSoonChip = () => (
  <Chip 
    size="sm" 
    variant="secondary" 
    className="bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 ml-2 transition-colors"
  >
    <Lock className="w-3 h-3 mr-1" />
    Coming Soon
  </Chip>
);

export default function AISettingsPage() {
  const [settings, setSettings] = useState(defaultSettings);
  const [activeTab, setActiveTab] = useState("model");

  useEffect(() => {
    const loadSettings = async () => {
      const response = await fetch("/api/settings/ai");
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/settings/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error();
      toast.success("Settings saved successfully");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        heading="AI Settings"
        text="Configure your AI model and analysis preferences"
      />

      <Tabs defaultValue="model" className="space-y-4">
        <TabsList>
          <TabsTrigger value="model">Model Selection</TabsTrigger>
          <TabsTrigger value="parameters" disabled>
            Parameters
            <ComingSoonChip />
          </TabsTrigger>
          <TabsTrigger value="safety" disabled>
            Safety
            <ComingSoonChip />
          </TabsTrigger>
          <TabsTrigger value="performance" disabled>
            Performance
            <ComingSoonChip />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="model" className="space-y-4">
          <Card className="p-4">
            <div className="space-y-2">
              <Label>Model Selection</Label>
              <ModelSelector />
            </div>
          </Card>
        </TabsContent>

        {["parameters", "safety", "performance"].map((tab) => (
          <TabsContent key={tab} value={tab}>
            <Card className="p-4">
              <div className="flex items-center justify-center p-8">
                <div className="text-center space-y-2">
                  <BrainCircuit className="w-12 h-12 mx-auto text-muted-foreground" />
                  <h3 className="font-medium">Coming Soon</h3>
                  <p className="text-sm text-muted-foreground">
                    This feature is currently under development
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}