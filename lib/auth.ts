export type AccountType = 'parent' | 'child'

export interface UserOnboarding {
  name: string
  email: string
  password: string
  accountType: AccountType
  familyCode?: string  // Required for children, generated for parents
}