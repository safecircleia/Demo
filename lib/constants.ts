export const SUBSCRIPTION_LIMITS = {
  free: {
    totalUsage: 1000,
    apiKeys: 3,
    rateLimit: 10
  },
  pro: {
    totalUsage: 10000,
    apiKeys: 10,
    rateLimit: 100
  },
  enterprise: {
    totalUsage: 100000,
    apiKeys: 50,
    rateLimit: 1000
  }
} as const

export type PlanName = keyof typeof SUBSCRIPTION_LIMITS