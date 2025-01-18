// components/profile/SecurityTab.tsx
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export function SecurityTab() {
  return (
    <div className="glass-card p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Two-factor Authentication</Label>
            <p className="text-sm text-gray-400">
              Add an extra layer of security to your account
            </p>
          </div>
          <Switch className="data-[state=checked]:bg-white/20" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="current-password">Current Password</Label>
          <Input 
            id="current-password" 
            type="password" 
            className="glass-input"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="new-password">New Password</Label>
          <Input 
            id="new-password" 
            type="password"
            className="glass-input"
          />
        </div>
        <Button className="w-full glass-button">Update Password</Button>
      </div>
    </div>
  );
}