// components/profile/ProfileTab.tsx
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { useSession } from "next-auth/react";

export function ProfileTab() {
  const { data: session } = useSession();

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-6">
        <div className="relative">
          <Avatar className="h-24 w-24 border border-white/10">
            <AvatarImage src={session?.user?.image || ''} />
            <AvatarFallback>{session?.user?.name?.[0]}</AvatarFallback>
          </Avatar>
          <Button 
            size="icon" 
            className="glass-button absolute -bottom-2 -right-2"
          >
            <Camera className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-4 flex-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                defaultValue={session?.user?.name || ''} 
                className="glass-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                defaultValue={session?.user?.email || ''} 
                className="glass-input"
              />
            </div>
          </div>
          <Button className="w-full glass-button">Save Changes</Button>
        </div>
      </div>
    </div>
  );
}