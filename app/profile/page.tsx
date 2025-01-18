// app/profile/page.tsx
"use client";

import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Shield, Lock } from "lucide-react";
import { ProfileTab } from "@/components/profile/ProfileTab";
import { FamilyTab } from "@/components/profile/FamilyTab";
import { SecurityTab } from "@/components/profile/SecurityTab";

export default function ProfilePage() {
  return (
    <div className="relative min-h-screen pt-20">
      <div className="container px-4 mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-8">
            <motion.h1
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-white animate-shimmer"
            >
              Profile Settings
            </motion.h1>
          </div>

          <Tabs defaultValue="profile" className="space-y-8">
            <div className="glass-tabs p-4 rounded-lg">
              <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-black/20 backdrop-blur-sm">
                <TabsTrigger 
                  value="profile" 
                  className="flex items-center gap-2 py-3 data-[state=active]:bg-white/10"
                >
                  <User className="h-4 w-4" />
                  Profile
                </TabsTrigger>
                <TabsTrigger 
                  value="family" 
                  className="flex items-center gap-2 py-3 data-[state=active]:bg-white/10"
                >
                  <Shield className="h-4 w-4" />
                  Family
                </TabsTrigger>
                <TabsTrigger 
                  value="security" 
                  className="flex items-center gap-2 py-3 data-[state=active]:bg-white/10"
                >
                  <Lock className="h-4 w-4" />
                  Security
                </TabsTrigger>
              </TabsList>

              <div className="glass-card p-6 mt-4">
                <div className="mt-8 space-y-8">
                  <TabsContent value="profile">
                    <ProfileTab />
                  </TabsContent>
                  
                  <TabsContent value="family">
                    <FamilyTab />
                  </TabsContent>
                  
                  <TabsContent value="security">
                    <SecurityTab />
                  </TabsContent>
                </div>
              </div>
            </div>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}