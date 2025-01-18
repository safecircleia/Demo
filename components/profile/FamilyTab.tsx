// components/profile/FamilyTab.tsx
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

export function FamilyTab() {
  return (
    <div className="glass-card p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold gradient-text">Family Members</h3>
        <Button className="glass-button">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </div>
      <div className="space-y-4">
        {/* Add family members list here */}
      </div>
    </div>
  );
}