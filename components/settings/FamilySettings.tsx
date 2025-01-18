"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface FamilyMember {
  id: string;
  name: string;
  role: "parent" | "child";
  avatar?: string;
}

export function FamilySettings() {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [inviteCode, setInviteCode] = useState<string>("XXXX-XXXX-XXXX");

  return (
    <Card className="backdrop-blur-sm bg-black/20 border-white/10">
      <CardHeader>
        <CardTitle>Family Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 rounded-lg bg-black/30 border border-white/10">
          <h3 className="text-sm font-medium mb-2">Family Invite Code</h3>
          <div className="flex items-center justify-between">
            <code className="text-lg">{inviteCode}</code>
            <Button variant="outline" size="sm">Generate New Code</Button>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Family Members</h3>
          {familyMembers.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-4 rounded-lg bg-black/20">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback>{member.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-gray-400">{member.role}</p>
                </div>
              </div>
              {member.role === "child" && (
                <Button variant="destructive" size="sm">Remove</Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}