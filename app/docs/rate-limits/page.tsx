'use client'

import { motion } from "framer-motion"

export default function RateLimitPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-3xl"
    >
      <h1 className="text-4xl font-bold mb-6">Rate Limiting</h1>
      <p className="text-gray-400 mb-8">
        To ensure stability and fairness, SafeCircle API implements rate limiting on all endpoints.
      </p>

      <div className="space-y-8">
        {/* Rate Limits Overview */}
        <div className="p-6 rounded-lg border border-white/10 bg-black/50 backdrop-blur-md">
          <h2 className="text-2xl font-semibold mb-4">Rate Limits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-black/30 rounded-md">
              <p className="text-2xl font-bold text-blue-400">100</p>
              <p className="text-gray-400">Requests per minute</p>
            </div>
            <div className="p-4 bg-black/30 rounded-md">
              <p className="text-2xl font-bold text-blue-400">10,000</p>
              <p className="text-gray-400">Requests per day</p>
            </div>
          </div>
        </div>

        {/* Rate Limit Headers */}
        <div className="p-6 rounded-lg border border-white/10 bg-black/50 backdrop-blur-md">
          <h2 className="text-2xl font-semibold mb-4">Rate Limit Headers</h2>
          <p className="text-gray-400 mb-4">
            All API responses include headers to help you track your rate limit status:
          </p>
          <div className="bg-black/30 p-4 rounded-md font-mono text-sm">
            <pre className="text-blue-400">
{`X-RateLimit-Limit: 100
X-RateLimit-Remaining: 98
X-RateLimit-Reset: 1640995200`}
            </pre>
          </div>
        </div>

        {/* Rate Limit Response */}
        <div className="p-6 rounded-lg border border-white/10 bg-black/50 backdrop-blur-md">
          <h2 className="text-2xl font-semibold mb-4">Rate Limit Exceeded Response</h2>
          <div className="bg-black/30 p-4 rounded-md">
            <h4 className="font-medium text-red-400">429 Too Many Requests</h4>
            <pre className="mt-2 text-sm text-gray-400">
{`{
  "error": "Rate limit exceeded",
  "message": "Please try again in 60 seconds",
  "reset": 1640995200
}`}
            </pre>
          </div>
        </div>

        {/* Best Practices */}
        <div className="p-6 rounded-lg border border-white/10 bg-black/50 backdrop-blur-md">
          <h2 className="text-2xl font-semibold mb-4">Best Practices</h2>
          <ul className="space-y-2 text-gray-400">
            <li>• Implement exponential backoff when rate limited</li>
            <li>• Cache responses when possible</li>
            <li>• Monitor X-RateLimit-Remaining header</li>
            <li>• Use bulk operations when available</li>
          </ul>
        </div>

        {/* Rate Limit Tiers */}
        <div className="p-6 rounded-lg border border-white/10 bg-black/50 backdrop-blur-md">
          <h2 className="text-2xl font-semibold mb-4">Rate Limit Tiers</h2>
          <div className="space-y-4">
            <div className="p-4 bg-black/30 rounded-md">
              <h3 className="text-lg font-medium text-blue-400">Free Tier</h3>
              <p className="text-gray-400">100 requests/minute, 10,000 requests/day</p>
            </div>
            <div className="p-4 bg-black/30 rounded-md">
              <h3 className="text-lg font-medium text-blue-400">Pro Tier</h3>
              <p className="text-gray-400">500 requests/minute, 50,000 requests/day</p>
            </div>
            <div className="p-4 bg-black/30 rounded-md">
              <h3 className="text-lg font-medium text-blue-400">Enterprise Tier</h3>
              <p className="text-gray-400">Custom limits based on needs</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}