export type FamilyRole = "ADMIN" | "MEMBER"

export interface Family {
  id: string
  name: string
  code: string
  members: {
    id: string
    name: string | null
    email: string | null
    image: string | null
    accountType: string
  }[]
}

export interface FamilyMember {
  id: string
  name: string
  email: string
  image: string | null
  accountType: string
}

export interface Invitation {
  id: string
  status: string
  invited: {
    id: string
    name: string | null
    email: string | null
  }
}

export function isValidInvitation(inv: any): inv is Invitation {
  return (
    inv &&
    typeof inv.id === 'string' &&
    typeof inv.status === 'string' &&
    inv.invited &&
    typeof inv.invited.id === 'string'
  )
}

export interface User {
  id: string
  name: string | null
  email: string | null
  familyRole: FamilyRole
  family?: Family
  sentInvitations?: Invitation[]
}

export interface DashboardUser {
  id: string
  name: string  // Required, non-null
  email: string // Required, non-null
  familyRole: FamilyRole
  family?: Family
  sentInvitations?: {
    id: string
    status: string
    invited: {
      id: string
      name: string | null
      email: string | null
    }
  }[]
}

export const isFamilyRole = (role: string): role is FamilyRole => {
  return role === "ADMIN" || role === "MEMBER"
}