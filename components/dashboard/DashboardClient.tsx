'use client'

import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { FamilyCode } from "@/components/dashboard/FamilyCode"
import { UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { InviteMemberModal } from '@/components/dashboard/InviteMemberModal'
import { useRouter } from 'next/navigation'
import { Switch } from '../ui/switch'
import { toast } from 'sonner'
import { FamilySettings, defaultFamilySettings } from "@/types/family"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MoreVertical } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const defaultSettings = {
  notifications: {
    familyAlerts: true,
    memberActivity: true
  },
  security: {
    autoBlock: true,
    parentApproval: true
  }
};

interface Family {
  id: string
  name: string
  code: string
  settings?: string | FamilySettings // Can be string (JSON) or parsed object
  members: any[]
}

interface DashboardUser {
  id: string;
  name: string;
  email: string;
  familyRole: "ADMIN" | "MEMBER";
  family?: Family;
  accountType?: string; // Make optional in props interface
  sentInvitations?: { id: string; status: string; invited: any; }[];
}

interface DashboardClientProps {
  user: DashboardUser
}

interface FamilyMember {
  id: string;
  name: string;
  role: "ADMIN" | "MEMBER";
}

interface FamilyMembersProps {
  members: FamilyMember[];
  userRole: "ADMIN" | "MEMBER";
}

export const FamilyMembers: React.FC<FamilyMembersProps> = ({ members, userRole }): JSX.Element => {
  if (!members.length) {
    return (
      <div className="flex items-center justify-center p-6">
        <p className="text-muted-foreground text-sm">No family members found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {members.map((member) => (
        <div
          key={member.id}
          className="flex items-center justify-between p-4 rounded-lg border bg-card"
        >
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10">
              <AvatarFallback>{member.name[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="text-sm font-medium leading-none">{member.name}</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {member.role === "ADMIN" ? "Administrator" : "Member"}
              </p>
            </div>
          </div>

          {userRole === "ADMIN" && member.role !== "ADMIN" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="text-destructive">
                  Remove Member
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      ))}
    </div>
  );
};

export function DashboardClient({ user }: DashboardClientProps) {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const router = useRouter()

  const handleInviteSuccess = () => {
    router.refresh()
    setIsInviteModalOpen(false)
  }

  const familyMembers = [
    ...(user.family?.members || []),
    ...(user.sentInvitations?.map(invitation => ({
      ...invitation.invited,
      status: invitation.status,
      invitationId: invitation.id
    })) || [])
  ]

  // Parse settings if they're a string, or use provided object, or fallback to defaults
  const familySettings = (() => {
    if (!user.family?.settings) return defaultFamilySettings;
    if (typeof user.family.settings === 'string') {
      try {
        return JSON.parse(user.family.settings);
      } catch {
        return defaultFamilySettings;
      }
    }
    return {
      ...defaultFamilySettings,
      ...user.family.settings
    };
  })();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <DashboardHeader 
        user={{
          ...user,
          accountType: user.familyRole === 'ADMIN' ? 'parent' : 'member'
        }} 
      />
      <div className="container mx-auto p-6 grid gap-6 md:grid-cols-2">
        <section className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold">
                  {user.family?.name || "Your Family"}
                </h2>
                <p className="text-muted-foreground">Manage your family circle</p>
              </div>
              {user.familyRole === 'ADMIN' && (
                <>
                  <Button onClick={() => setIsInviteModalOpen(true)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite Member
                  </Button>
                </>
              )}
            </div>

            {user.familyRole === 'ADMIN' && user.family?.code && (
              <div className="mb-6 p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Family Code</p>
                    <p className="text-2xl font-mono">{user.family.code}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(user.family?.code || '')
                      toast.success('Family code copied to clipboard')
                    }}
                  >
                    Copy Code
                  </Button>
                </div>
              </div>
            )}

            <FamilyMembers members={familyMembers} userRole={user.familyRole} />
          </Card>

          {user.familyRole === 'ADMIN' && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Family Settings</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Notifications</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Family Alerts</span>
                      <Switch
                        checked={familySettings?.notifications?.familyAlerts ?? defaultFamilySettings.notifications.familyAlerts}
                        disabled
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Member Activity</span>
                      <Switch
                        checked={familySettings?.notifications?.memberActivity ?? defaultFamilySettings.notifications.memberActivity}
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </section>
      </div>

      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onSuccess={handleInviteSuccess}
      />
    </div>
  )
}