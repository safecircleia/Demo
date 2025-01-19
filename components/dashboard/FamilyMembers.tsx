'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Member {
  id: string
  name: string | null
  email: string
  image: string | null
  accountType: string
}

interface FamilyMembersProps {
  members: Member[]
}

export function FamilyMembers({ members }: FamilyMembersProps) {
  return (
    <div className="space-y-4">
      {members.map((member) => (
        <div key={member.id} className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={member.image || undefined} />
            <AvatarFallback>{member.name?.[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{member.name}</p>
            <p className="text-sm text-gray-400">{member.accountType}</p>
          </div>
        </div>
      ))}
    </div>
  )
}