'use client'

import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { FamilyMembers } from "@/components/dashboard/FamilyMembers"
import { FamilyCode } from "@/components/dashboard/FamilyCode"
import { UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { InviteMemberModal } from '@/components/dashboard/InviteMemberModal'
import { useRouter } from 'next/navigation'

interface DashboardClientProps {
  user: any // TODO: Add proper type
}

export function DashboardClient({ user }: DashboardClientProps) {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const router = useRouter()

  const handleInviteSuccess = () => {
    router.refresh()
    setIsInviteModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <DashboardHeader user={user} />
      <div className="container mx-auto p-6 grid gap-6 md:grid-cols-2">
        <section className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold">Family Members</h2>
                <p className="text-muted-foreground">Manage your family circle</p>
              </div>
              {user.familyRole === 'ADMIN' && (
                <Button onClick={() => setIsInviteModalOpen(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite Member
                </Button>
              )}
            </div>
            <FamilyMembers 
              members={user.familyMembers} 
              currentUserRole={user.familyRole}
            />
          </Card>
        </section>
        <section className="space-y-6">
          <FamilyCode familyCode={user.familyCode || ''} />
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