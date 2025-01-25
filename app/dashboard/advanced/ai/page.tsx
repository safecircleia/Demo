"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { PageHeader } from "@/components/dashboard/PageHeader"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Shield, Zap, Lock, BrainCircuit, Currency, TextIcon, BrainIcon, ImageIcon, MicIcon } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Chip } from "@/components/ui/chip";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const defaultSettings = {
  modelVersion: "deepseek",
  temperature: 0.7,
  maxTokens: 2048,
  safetyLevel: "balanced",
  streaming: true,
  timeout: 30,
};

export default function AISettingsPage() {
  const [settings, setSettings] = useState(defaultSettings);
  const [isLoading, setIsLoading] = useState(false);

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
        title="AI Settings"
        description="Configure AI model parameters and behavior."
      />
      
      <Tabs defaultValue="model" className="space-y-6">
        <TabsList className="bg-transparent">
          <TabsTrigger value="model">
            <BrainCircuit className="h-4 w-4 mr-2" />
            Model
          </TabsTrigger>
          <TabsTrigger value="safety">
            <Shield className="h-4 w-4 mr-2" />
            Safety
          </TabsTrigger>
          <TabsTrigger value="performance">
            <Zap className="h-4 w-4 mr-2" />
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="model" className="space-y-4">
          <Card className="border border-white/10 bg-transparent backdrop-blur-sm p-6">
            <h3 className="text-lg font-medium mb-4">Model Configuration</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Model Version</Label>
                <Select defaultValue={settings.modelVersion} onValueChange={(value) => setSettings({ ...settings, modelVersion: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deepseek">
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium">DeepSeek-r1 7B</span>
                        <div className="flex gap-2 ml-4">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Chip variant="success" className="flex items-center gap-1">
                                  <TextIcon className="h-3 w-3" />
                                  <span>Text</span>
                                </Chip>
                              </TooltipTrigger>
                              <TooltipContent>Text processing capabilities</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Chip variant="purple" className="flex items-center gap-1">
                                  <BrainIcon className="h-3 w-3" />
                                  <span>Reasoning</span>
                                </Chip>
                              </TooltipTrigger>
                              <TooltipContent>Advanced reasoning capabilities</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="llama">
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium">Llama 3.2</span>
                        <div className="flex gap-2 ml-4">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Chip variant="success" className="flex items-center gap-1">
                                  <TextIcon className="h-3 w-3" />
                                  <span>Text</span>
                                </Chip>
                              </TooltipTrigger>
                              <TooltipContent>Text processing capabilities</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Chip variant="info" className="flex items-center gap-1">
                                  <ImageIcon className="h-3 w-3" />
                                  <span>Image</span>
                                </Chip>
                              </TooltipTrigger>
                              <TooltipContent>Image analysis capabilities</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Temperature (Creativity)</Label>
                <Slider
                  defaultValue={[settings.temperature]}
                  max={1}
                  step={0.1}
                  className="w-full"
                  onValueChange={(value) => setSettings({ ...settings, temperature: value[0] })}
                />
                <p className="text-sm text-muted-foreground">
                  Higher values make the output more creative but less predictable
                </p>
              </div>

              <div className="space-y-2">
                <Label>Maximum Response Length</Label>
                <Slider
                  defaultValue={[settings.maxTokens]}
                  max={4096}
                  step={256}
                  className="w-full"
                  onValueChange={(value) => setSettings({ ...settings, maxTokens: value[0] })}
                />
                <p className="text-sm text-muted-foreground">
                  Maximum number of tokens in the response
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="safety" className="space-y-4">
          <Card className="border border-white/10 bg-transparent backdrop-blur-sm p-6">
            <h3 className="text-lg font-medium mb-4">Safety Settings</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Content Filtering</Label>
                  <p className="text-sm text-muted-foreground">
                    Filter out inappropriate or unsafe content
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Rate Limiting</Label>
                  <p className="text-sm text-muted-foreground">
                    Limit requests per minute to prevent abuse
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="space-y-2">
                <Label>Safety Level</Label>
                <Select defaultValue={settings.safetyLevel} onValueChange={(value) => setSettings({ ...settings, safetyLevel: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select safety level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="strict">Strict</SelectItem>
                    <SelectItem value="balanced">Balanced</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card className="border border-white/10 bg-transparent backdrop-blur-sm p-6">
            <h3 className="text-lg font-medium mb-4">Performance Settings</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Response Streaming</Label>
                  <p className="text-sm text-muted-foreground">
                    Stream responses in real-time
                  </p>
                </div>
                <Switch defaultChecked={settings.streaming} onCheckedChange={(checked) => setSettings({ ...settings, streaming: checked })} />
              </div>

              <div className="space-y-2">
                <Label>Request Timeout</Label>
                <Slider
                  defaultValue={[settings.timeout]}
                  max={60}
                  step={5}
                  className="w-full"
                  onValueChange={(value) => setSettings({ ...settings, timeout: value[0] })}
                />
                <p className="text-sm text-muted-foreground">
                  Maximum time in seconds to wait for a response
                </p>
              </div>

              <div className="space-y-2">
                <Label>Concurrent Requests</Label>
                <Select defaultValue="5">
                  <SelectTrigger>
                    <SelectValue placeholder="Select limit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 request</SelectItem>
                    <SelectItem value="5">5 requests</SelectItem>
                    <SelectItem value="10">10 requests</SelectItem>
                    <SelectItem value="unlimited">Unlimited</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4">
        <Button variant="outline">Reset to Defaults</Button>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}