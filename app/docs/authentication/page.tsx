'use client'

import { motion } from "framer-motion"

export default function AuthenticationPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1 className="text-4xl font-bold mb-6">Authentication</h1>
      <div className="space-y-8">
        <div className="p-6 rounded-lg border border-white/10 bg-black/50 backdrop-blur-md">
          <h2 className="text-2xl font-semibold mb-4">Bearer Authentication</h2>
          <p className="text-gray-400 mb-4">
            All API requests require authentication using Bearer tokens.
          </p>
          <div className="bg-black/30 p-4 rounded-md font-mono text-sm">
            <code className="text-blue-400">
              Authorization: Bearer YOUR_API_KEY
            </code>
          </div>
        </div>
        {/* ... more authentication details */}
      </div>
    </motion.div>
  )
}