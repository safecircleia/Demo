'use client'

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface Member {
  id: string
  name: string | null
  email: string
  image: string | null
  accountType: string
  status?: 'PENDING' | 'ACCEPTED'
  invitationId?: string
}

interface FamilyMembersProps {
  members: Member[]
  currentUserRole: 'ADMIN' | 'MEMBER'
}

export function FamilyMembers({ members, currentUserRole }: FamilyMembersProps) {
  const removeInvitation = async (invitationId: string) => {
    try {
      const response = await fetch(`/api/family/invitations/${invitationId}`, {
        method: 'DELETE'
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to remove invitation')
      }
      toast.success('Invitation removed successfully')
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove invitation'
      toast.error(errorMessage)
    }
  }

  return (
    <div className="space-y-4">
      {members.map((member) => (
        <div 
          key={member.id} 
          className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors"
        >
          <Avatar className="h-12 w-12 border-2 border-primary">
            <AvatarImage src={member.image || undefined} />
            <AvatarFallback className="bg-primary/10">
              {member.name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-medium">{member.name || member.email}</p>
              {member.status && (
                <Badge variant={member.status === 'PENDING' ? 'secondary' : 'default'}>
                  {member.status}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{member.email}</p>
          </div>
          {currentUserRole === 'ADMIN' && member.status === 'PENDING' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => member.invitationId && removeInvitation(member.invitationId)}
            >
              Cancel Invitation
            </Button>
          )}
        </div>
      ))}
    </div>
  )
}