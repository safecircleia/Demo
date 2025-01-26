export const SUBSCRIPTION_LIMITS = {
  free: {
    apiKeys: 2,
    usagePerKey: 1000,
    totalUsage: 2000,
    rateLimit: 100
  },
  pro: {
    apiKeys: 5,
    usagePerKey: 10000,
    totalUsage: 50000,
    rateLimit: 500
  },
  premium: {
    apiKeys: 10,
    usagePerKey: 100000,
    totalUsage: 200000,
    rateLimit: 2000
  }
} as const